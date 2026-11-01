import { GiftIcon } from "@phosphor-icons/react/ssr"

import type { Locale } from "@/lib/i18n/config"
import { launchCopy } from "@/lib/launch/copy"
import { fetchOffer } from "@/lib/launch/offer"

/** "37 of 100 left". Renders nothing when the counter is unreachable or the offer never ran. */
export async function LaunchCounter({ locale, className }: { locale: Locale; className?: string }) {
  const offer = await fetchOffer()
  if (!offer || (!offer.enabled && offer.claimed === 0)) return null
  const o = launchCopy[locale].offer
  return (
    <p className={className} role="status">
      <GiftIcon aria-hidden weight="bold" className="me-1.5 inline size-4 align-text-bottom text-brand" />
      {offer.enabled ? (
        <>
          {o.title}{" "}
          <strong className="font-semibold tabular-nums text-foreground">
            {o.left.replace("{remaining}", String(offer.remaining)).replace("{total}", String(offer.total))}
          </strong>
        </>
      ) : (
        o.ended
      )}
    </p>
  )
}
