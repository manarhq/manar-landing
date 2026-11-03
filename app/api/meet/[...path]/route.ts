import { siteApiOrigin } from "@/lib/content/load"
import { forwardMeet } from "@/lib/meet/proxy"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Context = { params: Promise<{ path: string[] }> }

export async function GET(request: Request, { params }: Context) {
  return forwardMeet(request, (await params).path, "GET", siteApiOrigin())
}

export async function POST(request: Request, { params }: Context) {
  return forwardMeet(request, (await params).path, "POST", siteApiOrigin())
}
