/** Liveness/readiness probe. No dependencies: the site has no database or cache to gate on. */
export const dynamic = "force-dynamic"

export function GET() {
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } })
}
