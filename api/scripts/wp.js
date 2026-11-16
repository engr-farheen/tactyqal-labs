import { query } from '../src/db.js';
import { minutes } from '../src/posts.js';

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”' };
export const decode = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m);
const strip = (t) => t.replace(/<[^>]+>/g, '').trim();

// WordPress HTML -> the plain-text format the blog uses ("## " headings, "- " list items, blank line = paragraph)
export function htmlToText(html = '') {
  return decode(html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, t) => `\n\n## ${strip(t)}\n\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `\n- ${strip(t)}`)
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|ul|ol|blockquote)>/gi, '\n\n').replace(/<[^>]+>/g, ''))
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function mapWpPost(wp) {
  const terms = (wp._embedded?.['wp:term'] || []).flat();
  const cat = terms.find((t) => t.taxonomy === 'category' && t.slug !== 'uncategorized');
  return {
    title: decode(wp.title?.rendered || '').trim(), slug: wp.slug, content: htmlToText(wp.content?.rendered),
    excerpt: htmlToText(wp.excerpt?.rendered).replace(/\s*\[…\]\s*$/, '').slice(0, 300),
    cover_image: wp._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null, source_url: wp.link ?? null, author: wp._embedded?.author?.[0]?.name ?? 'Tactyqal',
    category: cat?.name ?? 'General', tags: terms.filter((t) => t.taxonomy === 'post_tag').map((t) => t.name).slice(0, 10),
    status: wp.status === 'publish' ? 'published' : 'draft', published_at: wp.date_gmt ? `${wp.date_gmt}Z` : wp.date ?? null,
  };
}

// Idempotent: re-running updates existing rows (matched by slug) instead of duplicating them.
export async function importPosts(wpPosts, { dryRun = false } = {}) {
  const out = { created: 0, updated: 0, skipped: [] };
  for (const wp of wpPosts) {
    const p = mapWpPost(wp);
    if (!p.slug || p.title.length < 3 || !p.content) { out.skipped.push(p.slug || '(no slug)'); continue; }
    if (dryRun) { out.created++; continue; }
    const { rows } = await query(
      `INSERT INTO posts (title,slug,excerpt,content,cover_image,source_url,author,category,tags,status,read_minutes,published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, content=EXCLUDED.content, cover_image=EXCLUDED.cover_image, source_url=EXCLUDED.source_url,
         author=EXCLUDED.author, category=EXCLUDED.category, tags=EXCLUDED.tags, status=EXCLUDED.status, read_minutes=EXCLUDED.read_minutes,
         published_at=EXCLUDED.published_at, updated_at=now()
       RETURNING (xmax = 0) AS inserted`,
      [p.title, p.slug, p.excerpt, p.content, p.cover_image, p.source_url, p.author, p.category, p.tags, p.status, minutes(p.content), p.status === 'published' ? p.published_at : null]);
    rows[0].inserted ? out.created++ : out.updated++;
  }
  return out;
}
