import { BuildingsIcon, CloudIcon } from "@phosphor-icons/react/ssr"
import Image from "next/image"

import type { Dictionary } from "@/lib/i18n/dictionaries"

import { SectionHeading } from "./section-heading"

const optionIcons = [CloudIcon, BuildingsIcon]

/** Headline, one wide photograph, then the two ways to run Manar as plain facts. */
export function Deployment({ dict }: { dict: Dictionary }) {
  const d = dict.deployment
  return (
    <section id="deployment" aria-labelledby="deployment-title" className="py-16 md:py-24">
      <div className="shell">
        <SectionHeading id="deployment-title" title={d.title} body={d.body} />

        <div className="relative mt-12 aspect-[4/3] overflow-hidden rounded-md bg-surface sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image
            src={dict.images.deployment.src}
            alt={dict.images.deployment.alt}
            fill
            sizes="(min-width: 1248px) 1200px, 100vw"
            className="object-cover object-[68%_60%] dark:brightness-90"
          />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
          {d.options.map((option, i) => {
            const Icon = optionIcons[i]
            return (
              <div key={option.title} className="flex gap-4">
                <Icon aria-hidden className="mt-1 size-6 shrink-0 text-foreground" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{option.title}</h3>
                  <ul className="mt-2 grid gap-1 text-base text-muted-foreground">
                    {option.facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
