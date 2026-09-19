import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Dictionary } from "@/lib/i18n/dictionaries"

export function Faq({ dict }: { dict: Dictionary }) {
  const f = dict.faq

  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 sm:py-24 lg:py-32">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow">{f.eyebrow}</p>
          <h2 id="faq-title" className="headline mt-5">
            {f.title}
          </h2>
        </div>

        <Accordion keepMounted className="border-t border-border lg:col-span-8">
          {f.items.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`} className="border-b border-border">
              <AccordionTrigger className="gap-6 rounded-none py-6 text-lg leading-snug font-semibold text-foreground hover:text-link focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-xl **:data-[slot=accordion-trigger-icon]:mt-1 **:data-[slot=accordion-trigger-icon]:size-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-7">
                <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem] rtl:leading-[1.9]">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
