/** Every section header is the same stack: headline, then at most one short paragraph (65ch). */
export function SectionHeading({ id, title, body }: { id: string; title: string; body?: string }) {
  return (
    <div className="max-w-[65ch]">
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground md:text-4xl">
        {title}
      </h2>
      {body ? <p className="mt-4 text-lg text-pretty text-muted-foreground">{body}</p> : null}
    </div>
  )
}
