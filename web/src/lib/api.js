const BASE = process.env.API_URL || 'http://localhost:4000';
const EMPTY = { data: [], meta: { page: 1, limit: 9, total: 0, pages: 1 } };

// Server-side only. Failures degrade to an empty list so the page still renders if the API is asleep or down.
/** @typedef {{ id: number, title: string, slug: string, excerpt: string, content?: string, cover_image: string | null, source_url: string | null, author: string, category: string, tags: string[], status: string, read_minutes: number, published_at: string, created_at: string, updated_at: string }} Post */

/** @param {Record<string, string | number>} [params] @returns {Promise<{ data: Post[], meta: { page: number, limit: number, total: number, pages: number } }>} */
export async function getPosts(params = {}) {
  try {
    const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
    const r = await fetch(`${BASE}/api/posts?${qs}`, { next: { revalidate: 60 } });
    return r.ok ? await r.json() : EMPTY;
  } catch { return EMPTY; }
}
/** @param {string} slug @returns {Promise<Post | null>} */
export async function getPost(slug) {
  try {
    const r = await fetch(`${BASE}/api/posts/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    return r.ok ? (await r.json()).data : null;
  } catch { return null; }
}
export const BLOG_ART = (p, i) => { const t = p.slug || ''; return /pitch/.test(t) ? 0 : /team/.test(t) ? 1 : /fail/.test(t) ? 2 : /no-code/.test(t) ? 3 : /food/.test(t) ? 4 : /gen-z/.test(t) ? 5 : i % 6; };
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' });
