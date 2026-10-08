"use client"

import { PrinterIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

export function PrintButton({ label }: { label: string }) {
  return (
    <Button variant="secondary" size="sm" onClick={() => window.print()} className="print:hidden">
      <PrinterIcon aria-hidden />
      {label}
    </Button>
  )
}
