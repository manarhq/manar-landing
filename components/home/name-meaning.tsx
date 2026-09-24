import { LazyLens } from "@/components/three/lazy-scenes"
import type { Dictionary } from "@/lib/i18n/dictionaries"

/** The name, set as the page's one typographic moment, beside the lighthouse lens that gives it meaning. */
export function NameMeaning({ dict }: { dict: Dictionary }) {
  const n = dict.name

  return (
    <section id="name" aria-labelledby="name-title" className="relative isolate overflow-hidden py-24 sm:py-28 lg:py-40">
      <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6">
          <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <div className="glow absolute inset-[8%] opacity-80" />
            <LazyLens className="absolute inset-0" />
          </div>
        </div>

        <div className="lg:col-span-6">
          <p className="eyebrow">{n.eyebrow}</p>
          <p lang="ar" dir="rtl" className="mt-6 w-fit font-[family-name:var(--font-plex-arabic)] text-[clamp(5rem,3rem+8vw,9rem)] leading-none font-semibold text-foreground">
            {n.word}
          </p>
          <p className="mt-5 text-base text-muted-foreground">
            <span lang="en" className="font-semibold text-foreground">
              {n.transliteration}
            </span>
            <span className="mx-2 text-control">/</span>
            {n.meaning}
          </p>
          <h2 id="name-title" className="headline mt-10 max-w-[18ch]">
            {n.title}
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground rtl:leading-[1.9]">{n.body}</p>
        </div>
      </div>
    </section>
  )
}
