"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"

/** Privacy settings: necessary storage (always on) and analytics (opt-in, off under GPC or DNT). */
export function ConsentSettings({
  locale,
  labels,
  signal,
  tokenConfigured,
  draft,
  setDraft,
  onClose,
  onSave,
}: {
  locale: Locale
  labels: Dictionary["site"]["consent"]
  signal: boolean
  tokenConfigured: boolean
  draft: boolean
  setDraft: (value: boolean) => void
  onClose: () => void
  onSave: () => void
}) {
  return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent closeLabel={labels.dialogClose}>
        <DialogTitle>{labels.title}</DialogTitle>
        <DialogDescription>{labels.body}</DialogDescription>

        <div className="divide-y divide-line rounded-md border border-line">
          <Row title={labels.necessaryTitle} body={labels.necessaryBody}>
            <Switch checked disabled aria-label={labels.necessaryTitle} />
          </Row>
          <Row title={labels.analyticsTitle} body={signal ? `${labels.analyticsBody} ${labels.signalNote}` : labels.analyticsBody}>
            <Switch
              checked={draft && !signal}
              onCheckedChange={setDraft}
              disabled={!tokenConfigured || signal}
              aria-label={labels.analyticsTitle}
            />
          </Row>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="flex flex-wrap gap-4 text-sm">
            <Link href={`/${locale}/cookies`} className="font-medium text-foreground underline underline-offset-4">
              {labels.policy}
            </Link>
            <Link href={`/${locale}/privacy`} className="font-medium text-foreground underline underline-offset-4">
              {labels.privacy}
            </Link>
          </span>
          <Button size="lg" onClick={onSave}>
            {labels.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Row({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  )
}
