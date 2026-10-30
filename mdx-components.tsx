import type { MDXComponents } from "mdx/types"

/** Docs typography on design tokens only. Code blocks stay left-to-right in Arabic pages. */
const components: MDXComponents = {
  h2: (p) => <h2 {...p} className="mt-12 scroll-mt-24 text-2xl font-semibold text-foreground first:mt-0" />,
  h3: (p) => <h3 {...p} className="mt-8 scroll-mt-24 text-lg font-semibold text-foreground" />,
  p: (p) => <p {...p} className="mt-4 text-base text-muted-foreground" />,
  ul: (p) => <ul {...p} className="mt-4 list-disc space-y-2 ps-6 text-base text-muted-foreground marker:text-line-strong" />,
  ol: (p) => <ol {...p} className="mt-4 list-decimal space-y-2 ps-6 text-base text-muted-foreground marker:text-line-strong" />,
  a: (p) => <a {...p} className="font-medium text-foreground underline underline-offset-4" />,
  strong: (p) => <strong {...p} className="font-semibold text-foreground" />,
  code: (p) => <code {...p} className="ltr-fragment rounded-sm bg-subtle px-1 py-0.5 font-mono text-[0.9em] text-foreground" />,
  pre: (p) => (
    <pre
      {...p}
      dir="ltr"
      tabIndex={0}
      className="mt-4 overflow-x-auto rounded-md border border-line bg-surface p-4 text-start font-mono text-sm text-foreground [&_code]:bg-transparent [&_code]:p-0"
    />
  ),
  table: (p) => (
    <div className="mt-4 overflow-x-auto rounded-md border border-line bg-surface">
      <table {...p} className="w-full min-w-[32rem] border-collapse text-start text-sm" />
    </div>
  ),
  th: (p) => <th {...p} className="border-b border-line-strong px-3 py-2 text-start font-semibold text-foreground" />,
  td: (p) => <td {...p} className="border-b border-line px-3 py-2 align-top text-muted-foreground" />,
}

export function useMDXComponents(): MDXComponents {
  return components
}
