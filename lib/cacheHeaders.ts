// Shared-cache headers for public, read-only GETs that return the same payload
// to everyone. Collapses repeated client polls into one origin hit per `s`
// seconds at the CDN edge (function never runs on a cache hit), slashing
// Function Invocations + Duration. `CDN-Cache-Control` drives the Vercel and
// Cloudflare edge caches and survives Next's force-dynamic `no-store` default;
// the plain `Cache-Control` mirror covers any other intermediary.
//
// NEVER use on responses that vary per user (cookie/session) — a shared cache
// would serve one user's data to the next.
export function edgeCache(s: number, swr: number = s * 2): Record<string, string> {
  const value = `public, s-maxage=${s}, stale-while-revalidate=${swr}`;
  return { 'Cache-Control': value, 'CDN-Cache-Control': value };
}
