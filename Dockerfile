# syntax=docker/dockerfile:1.25.0@sha256:0adf442eae370b6087e08edc7c50b552d80ddf261576f4ebd6421006b2461f12

# Manar marketing site. Three stages: install, build, and a minimal runtime that
# contains only the traced `.next/standalone` server (see `output` in next.config.ts).
# Same pinned base image as the other Next.js sites deployed by Manar.

ARG NODE_IMAGE=docker.io/library/node:24.18.0-bookworm-slim@sha256:6f7b03f7c2c8e2e784dcf9295400527b9b1270fd37b7e9a7285cf83b6951452d

FROM ${NODE_IMAGE} AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

FROM ${NODE_IMAGE} AS builder
WORKDIR /app

# SITE_URL is read at build time: metadata URLs, robots.txt, and sitemap.xml are
# prerendered. Changing it at runtime has no effect.
ARG SITE_URL
# Optional: inlined into the client bundle at build time (see .env.example).
# Public hosts, inlined into the client bundle at build time.
ARG NEXT_PUBLIC_CONSOLE_URL="https://console-manar.fixio.ae"
ARG NEXT_PUBLIC_STATUS_URL="https://status-manar.fixio.ae"
ARG NEXT_PUBLIC_POSTHOG_KEY=""
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ENV NEXT_TELEMETRY_DISABLED=1 \
    SITE_URL=${SITE_URL} \
    NEXT_PUBLIC_CONSOLE_URL=${NEXT_PUBLIC_CONSOLE_URL} \
    NEXT_PUBLIC_STATUS_URL=${NEXT_PUBLIC_STATUS_URL} \
    NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY} \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY}

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN test -n "${SITE_URL}" || (echo "SITE_URL build argument is required" >&2 && exit 1) \
    && npm test \
    && npm run build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ARG BUILD_DATE
ARG VCS_REF=unknown
ARG IMAGE_VERSION=dev

LABEL org.opencontainers.image.title="Manar marketing site" \
      org.opencontainers.image.description="Bilingual Manar marketing homepage and demo request flow" \
      org.opencontainers.image.vendor="VAX" \
      org.opencontainers.image.source="https://github.com/manarhq/manar-landing" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.version="${IMAGE_VERSION}"

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    HOME=/tmp

# Unprivileged user; package managers are removed because the runtime never uses them.
# Debian security updates first: the pinned base can lag behind fixed CVEs (the CI image scan blocks on
# fixed HIGH/CRITICAL findings).
RUN apt-get update \
    && apt-get upgrade -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 10001 nextjs \
    && useradd --system --uid 10001 --gid nextjs --home-dir /app --shell /usr/sbin/nologin nextjs \
    && rm -rf /usr/local/lib/node_modules /opt/yarn-v* \
    && rm -f /usr/local/bin/corepack /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/yarn /usr/local/bin/yarnpkg

COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public

USER 10001:10001
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then((r) => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"]

CMD ["node", "server.js"]
