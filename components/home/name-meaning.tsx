import type { Dictionary } from "@/lib/i18n/dictionaries"

export function NameMeaning({ dict }: { dict: Dictionary }) {
  const n = dict.name

  return (
    <section
      aria-labelledby="name-title"
      className="relative isolate overflow-hidden border-y border-border bg-[#0e1311] py-24 text-[#f4f1e8] sm:py-28 lg:py-36"
    >
      {/* This band stays dark in both themes: it is the one place the beacon is shown at night. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="beam absolute top-0 left-1/2 h-full w-[1100px] -translate-x-1/2"
          style={{ ["--beam" as string]: "52 211 153", ["--beam-strength" as string]: "0.2" }}
        />
        <div className="absolute top-0 left-1/2 h-32 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#34d399] to-transparent" />
      </div>

      <div className="shell grid items-center gap-12 lg:grid-cols-12">
        <div className="text-center lg:col-span-5 lg:text-start">
          <p
            lang="ar"
            className="px-3 font-[family-name:var(--font-plex-arabic)] text-[6rem] leading-none font-semibold text-[#f4f1e8] sm:text-[8.5rem] lg:text-[10rem]"
          >
            {n.word}
          </p>
          <p className="mt-6 text-sm text-[#b9c3ba]">
            <span lang="en" className="font-semibold text-[#f4f1e8]">
              {n.transliteration}
            </span>
            <span aria-hidden className="mx-2 text-[#677b6d]">
              ·
            </span>
            {n.meaning}
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow text-[#70e2af]">{n.eyebrow}</p>
          <h2 id="name-title" className="headline mt-5 text-[#f4f1e8]">
            {n.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[#b9c3ba] sm:text-xl rtl:leading-[1.9]">{n.body}</p>
        </div>
      </div>
    </section>
  )
}
