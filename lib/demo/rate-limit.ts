/**
 * Fixed-window, in-memory rate limiter.
 *
 * Limitation: state lives in a single server process. It is effective for one
 * instance (local, single VM, single container). With multiple replicas or
 * serverless instances, each keeps its own counters, so the effective limit is
 * multiplied and resets on cold start. Replicated deployments need a shared store
 * (for example Redis) or edge/WAF rate limiting in front of /api/demo-request.
 */

export type RateLimiter = {
  check: (key: string, now?: number) => { allowed: boolean; retryAfterSeconds: number }
}

export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 5_000,
}: {
  limit: number
  windowMs: number
  maxKeys?: number
}): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>()

  return {
    check(key, now = Date.now()) {
      const entry = hits.get(key)
      if (!entry || entry.resetAt <= now) {
        if (hits.size >= maxKeys) {
          for (const [storedKey, stored] of hits) {
            if (stored.resetAt <= now) hits.delete(storedKey)
          }
          // Still full: drop the oldest entry rather than grow without bound.
          if (hits.size >= maxKeys) {
            const oldest = hits.keys().next().value
            if (oldest !== undefined) hits.delete(oldest)
          }
        }
        hits.set(key, { count: 1, resetAt: now + windowMs })
        return { allowed: true, retryAfterSeconds: 0 }
      }

      if (entry.count >= limit) {
        return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) }
      }
      entry.count += 1
      return { allowed: true, retryAfterSeconds: 0 }
    },
  }
}
