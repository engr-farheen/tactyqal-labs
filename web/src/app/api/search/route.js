const BASE = process.env.API_URL || 'http://localhost:4000';

// Same-origin proxy to the blog API's full-text search (keeps the API URL private and avoids CORS).
export async function GET(req) {
  const q = (new URL(req.url).searchParams.get('q') || '').trim().slice(0, 80);
  if (q.length < 2) return Response.json({ posts: [] });
  try {
    const r = await fetch(`${BASE}/api/posts?${new URLSearchParams({ q, limit: '5' })}`, { next: { revalidate: 30 } });
    if (!r.ok) throw new Error(String(r.status));
    const { data } = await r.json();
    return Response.json({ posts: data.map((p) => ({ title: p.title, slug: p.slug, excerpt: p.excerpt })) });
  } catch { return Response.json({ posts: [] }); }
}
