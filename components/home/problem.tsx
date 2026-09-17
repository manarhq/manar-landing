import type { Dictionary } from "@/lib/i18n/dictionaries"

export function Problem({ dict }: { dict: Dictionary }) {
  const p = dict.problem

  return (
    <section aria-labelledby="problem-title" className="relative pt-6 pb-20 sm:pb-24 lg:pt-10 lg:pb-32">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">{p.eyebrow}</p>
            <h2 id="problem-title" className="headline mt-5">
              {p.title}
            </h2>
            <p className="lede mt-5 max-w-lg">{p.body}</p>
          </div>
        </div>

        <ol className="lg:col-span-7 lg:col-start-6 lg:ps-10">
          {p.items.map((item, index) => (
            <li
              key={item.title}
              className="group relative grid grid-cols-[3.25rem_1fr] gap-x-5 border-t border-border py-8 first:border-t-0 first:pt-0 sm:grid-cols-[4.5rem_1fr] sm:py-10 lg:first:pt-2"
            >
              <span
                aria-hidden
                className="font-mono text-2xl leading-none font-medium text-primary/80 tabular-nums sm:text-3xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl leading-snug font-semibold text-foreground sm:text-2xl">{item.title}</h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
