import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Minimal self-contained server for the container image (see Dockerfile).
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: true }]
  },
}

export default nextConfig
