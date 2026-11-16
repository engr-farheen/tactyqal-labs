import { query } from './db.js';

export const LIST_COLS =
  'id,title,slug,excerpt,cover_image,source_url,author,category,tags,status,read_minutes,published_at,created_at,updated_at';
export const FULL_COLS = `${LIST_COLS},content`;

export const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim()
    .replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'post';
const excerptOf = (s) => {
  const first = s.split(/\n{2,}/).find((b) => !b.startsWith('#')) ?? s;
  const t = first.replace(/\s+/g, ' ').trim();
  return t.length > 160 ? t.slice(0, 157).replace(/\s+\S*$/, '') + '…' : t;
};
export const minutes = (s) => Math.max(1, Math.ceil(s.trim().split(/\s+/).length / 200));

async function uniqueSlug(base, ignoreId = 0) {
  let slug = base, n = 1;
  while ((await query('SELECT 1 FROM posts WHERE slug=$1 AND id<>$2', [slug, ignoreId])).rows.length) {
    slug = `${base}-${++n}`;
  }
  return slug;
}

export async function createPost(d, publishedAt) {
  const status = d.status ?? 'draft';
  const slug = await uniqueSlug(slugify(d.title));
  const { rows } = await query(
    `INSERT INTO posts (title,slug,excerpt,content,cover_image,source_url,author,category,tags,status,read_minutes,published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING ${FULL_COLS}`,
    [d.title, slug, d.excerpt ?? excerptOf(d.content), d.content, d.cover_image ?? null, d.source_url ?? null,
     d.author ?? 'Tactyqal', d.category ?? 'General', d.tags ?? [], status, d.read_minutes ?? minutes(d.content),
     status === 'published' ? (publishedAt ?? new Date().toISOString()) : null],
  );
  return rows[0];
}

// Slug stays stable after creation so published URLs never break.
export async function updatePost(id, patch) {
  const { rows: [cur] } = await query('SELECT * FROM posts WHERE id=$1', [id]);
  if (!cur) return null;
  const m = { ...cur, ...patch };
  const publishedAt = cur.published_at
    ? new Date(cur.published_at).toISOString()
    : m.status === 'published' ? new Date().toISOString() : null;
  const { rows } = await query(
    `UPDATE posts SET title=$1,excerpt=$2,content=$3,cover_image=$4,source_url=$5,author=$6,category=$7,tags=$8,
       status=$9,read_minutes=$10,published_at=$11,updated_at=now()
     WHERE id=$12 RETURNING ${FULL_COLS}`,
    [m.title, m.excerpt, m.content, m.cover_image ?? null, m.source_url ?? null, m.author, m.category, m.tags,
     m.status, patch.read_minutes ?? (patch.content !== undefined ? minutes(m.content) : cur.read_minutes), publishedAt, id],
  );
  return rows[0];
}

export async function listPosts({ page, limit, q, category, tag, status }) {
  const where = [], params = [];
  const add = (sql, v) => { params.push(v); where.push(sql.replace('?', `$${params.length}`)); };
  if (status !== 'all') add('status = ?', status);
  if (category) add('lower(category) = lower(?)', category);
  if (tag) add('? = ANY(tags)', tag);
  if (q) add(`search @@ websearch_to_tsquery('english', ?)`, q);
  const w = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const { rows: [{ total }] } = await query(`SELECT count(*)::int AS total FROM posts ${w}`, params);
  const { rows } = await query(
    `SELECT ${LIST_COLS} FROM posts ${w}
     ORDER BY COALESCE(published_at, created_at) DESC, id DESC
     LIMIT ${limit} OFFSET ${(page - 1) * limit}`, params);
  return { data: rows, meta: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } };
}
