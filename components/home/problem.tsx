import type { Dictionary } from "@/lib/i18n/dictionaries"

/** Manifesto: the headline lights up word by word as it crosses the viewport, then three plain needs. */
export function Problem({ dict }: { dict: Dictionary }) {
  const p = dict.problem
  const words = p.title.split(" ")

  return (
    <section aria-labelledby="problem-title" className="relative py-24 sm:py-28 lg:py-40">
      <div className="shell">
        <h2 id="problem-title" className="max-w-[18ch] text-[clamp(2.25rem,1.2rem+4.2vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-foreground rtl:leading-[1.35] rtl:tracking-normal">
          {words.map((word, i) => (
            <span key={i} className="word-lit" style={{ ["--i" as string]: i }}>
              {word}{" "}
            </span>
          ))}
        </h2>
        <p className="lede mt-8 max-w-[52ch]">{p.body}</p>

        <ul className="mt-16 grid gap-10 border-t border-border pt-12 lg:mt-24 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-12">
          {p.items.map((item, i) => (
            <li key={item.title} className="reveal" style={{ animationDelay: `${i * 60}ms` }}>
              <h3 className="text-[1.375rem] leading-snug font-semibold tracking-[-0.02em] text-foreground rtl:tracking-normal">
                {item.title}
              </h3>
              <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
