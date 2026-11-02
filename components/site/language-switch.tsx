"use client";

import { TranslateIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { localeTag, otherLocale, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const ANCHOR_KEY = "manar:lang-switch-anchor";

type Anchor = { id: string; ratio: number };

/** The sticky header covers the top of the viewport; read positions just below it. */
function readLine(): number {
  return (
    (document.querySelector("header")?.getBoundingClientRect().bottom ?? 0) + 1
  );
}

/** The innermost element with an id that the reading line passes through, and how far into it. */
export function currentAnchor(): Anchor | null {
  const line = readLine();
  let found: Anchor | null = null;
  for (const el of document.querySelectorAll<HTMLElement>("main [id]")) {
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.top <= line && r.bottom > line) {
      found = { id: el.id, ratio: (line - r.top) / r.height };
    }
  }
  return found;
}

/** Scroll so the same point of the same section sits under the header again. */
export function restoreAnchor(anchor: Anchor | null): void {
  const el = anchor ? document.getElementById(anchor.id) : null;
  if (!anchor || !el) {
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }
  const r = el.getBoundingClientRect();
  const top = window.scrollY + r.top + anchor.ratio * r.height - readLine();
  window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
}

/**
 * Links to the same page in the other language, keeping the reader on the section they were on
 * (the two languages have different heights, so a pixel offset would land elsewhere).
 */
export function LanguageSwitch({
  locale,
  label,
  accessibleLabel,
  className,
}: {
  locale: Locale;
  label: string;
  accessibleLabel: string;
  className?: string;
}) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const rest = pathname.replace(/^\/(en|ar)(?=\/|$)/, "");
  const href = `/${target}${rest}`;

  useEffect(() => {
    const raw = sessionStorage.getItem(ANCHOR_KEY);
    if (raw === null) return;
    sessionStorage.removeItem(ANCHOR_KEY);
    try {
      restoreAnchor(JSON.parse(raw) as Anchor | null);
    } catch {
      // A malformed value only loses the position.
    }
  }, [locale]);

  return (
    <Link
      href={href}
      // No prefetch: the other locale's page carries its own font preloads, which would then
      // download on this page too.
      prefetch={false}
      // We place the reader ourselves (restoreAnchor); Next's own scroll jumps to the page end.
      scroll={false}
      onClick={() =>
        sessionStorage.setItem(ANCHOR_KEY, JSON.stringify(currentAnchor()))
      }
      hrefLang={localeTag[target]}
      lang={localeTag[target]}
      aria-label={accessibleLabel}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "gap-2 px-3",
        className,
      )}
    >
      <TranslateIcon aria-hidden className="text-muted-foreground" />
      {/* System Arabic font on English pages: loading Plex Sans Arabic for one word is not worth it. */}
      <span>{label}</span>
    </Link>
  );
}
