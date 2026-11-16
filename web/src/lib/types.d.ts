// Next.js extends fetch() with a `next` option for caching; teach the type checker about it.
interface RequestInit {
  next?: { revalidate?: number | false; tags?: string[] };
}
