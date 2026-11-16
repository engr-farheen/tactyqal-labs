import crypto from 'node:crypto';
import fs from 'node:fs';
import express from 'express';
import helmet from 'helmet';
import { z } from 'zod';
import { query } from './db.js';
import { FULL_COLS, createPost, listPosts, updatePost } from './posts.js';

const err = (res, status, code, message, details) =>
  res.status(status).json({ error: { code, message, ...(details && { details }) } });

const PostIn = z.object({
  title: z.string().trim().min(3).max(160),
  content: z.string().min(1).max(100_000),
  excerpt: z.string().trim().max(300).optional(),
  cover_image: z.string().max(500).regex(/^(https?:\/\/|\/)/, 'Use a full URL or a path starting with /').nullable().optional(),
  source_url: z.string().url().nullable().optional(),
  read_minutes: z.number().int().min(1).max(120).optional(),
  author: z.string().trim().min(1).max(80).optional(),
  category: z.string().trim().min(1).max(60).optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
  status: z.enum(['draft', 'published']).optional(),
});
const ListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().max(60).optional(),
  tag: z.string().trim().max(30).optional(),
  status: z.enum(['published', 'draft', 'all']).default('published'),
});
const spec = JSON.parse(fs.readFileSync(new URL('./openapi.json', import.meta.url), 'utf8'));
const LeadIn = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().max(120).pipe(z.email()),
  phone: z.string().trim().regex(/^[0-9+()\-\s]{6,20}$/, 'Enter a valid phone number').or(z.literal('')).optional(),
  message: z.string().trim().max(1000).optional(),
  website: z.string().max(200).optional(), // honeypot: real people leave it empty
});

// Simple in-memory limiter: 5 requests per IP per 10 minutes (set TRUST_PROXY=1 behind Render/Vercel so req.ip is the visitor).
const hits = new Map();
function limited(ip) {
  const now = Date.now(), max = Number(process.env.LEAD_RATE_LIMIT || 5);
  const recent = (hits.get(ip) || []).filter((t) => now - t < 600_000);
  recent.push(now); hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
// Brute-force protection for the admin token: more than 20 failed attempts per IP in 10 minutes -> 429 (valid tokens are never blocked).
const authFails = new Map();
function tooManyAuthFails(ip) {
  const now = Date.now(), recent = (authFails.get(ip) || []).filter((t) => now - t < 600_000);
  recent.push(now); authFails.set(ip, recent);
  if (authFails.size > 5000) authFails.clear();
  return recent.length > 20;
}
function notify(lead) { // optional Slack/Zapier/Make webhook
  const url = process.env.LEAD_WEBHOOK_URL; if (!url) return;
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, signal: AbortSignal.timeout(3000),
    body: JSON.stringify({ text: `New consultation request: ${lead.name} <${lead.email}>`, lead }) })
    .catch((e) => console.error('lead webhook failed:', e.message));
}
const Id = z.coerce.number().int().positive();

export function createApp() {
  const TOKEN = process.env.ADMIN_TOKEN || 'dev-admin-token';
  if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_TOKEN) {
    throw new Error('ADMIN_TOKEN must be set in production');
  }
  const isAdmin = (req) => {
    const a = Buffer.from((req.get('authorization') || '').replace(/^Bearer\s+/i, ''));
    const b = Buffer.from(TOKEN);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  };
  const requireAdmin = (req, res, next) => {
    if (isAdmin(req)) return next();
    if (tooManyAuthFails(req.ip)) return err(res, 429, 'rate_limited', 'Too many failed attempts. Please try again in a few minutes.');
    return err(res, 401, 'unauthorized', 'A valid admin token is required.');
  };

  const app = express();
  app.disable('x-powered-by');
  if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '300kb' }));

  const api = express.Router();
  api.get('/openapi.json', (_req, res) => res.json(spec));
  api.get('/health', (_req, res) => res.json({ ok: true }));

  api.get('/posts', async (req, res) => {
    const q = ListQuery.parse(req.query);
    if (q.status !== 'published' && !isAdmin(req)) {
      return err(res, 401, 'unauthorized', 'Only admins can list drafts.');
    }
    res.json(await listPosts(q));
  });

  api.get('/posts/:slug', async (req, res) => {
    const { rows } = await query(
      `SELECT ${FULL_COLS} FROM posts WHERE slug=$1 AND ($2 OR status='published')`,
      [req.params.slug, isAdmin(req)]);
    rows[0] ? res.json({ data: rows[0] }) : err(res, 404, 'not_found', 'Post not found.');
  });

  api.post('/posts', requireAdmin, async (req, res) => {
    const post = await createPost(PostIn.parse(req.body));
    res.status(201).location(`/api/posts/${post.slug}`).json({ data: post });
  });

  const update = async (req, res) => {
    const post = await updatePost(Id.parse(req.params.id), PostIn.partial().parse(req.body));
    post ? res.json({ data: post }) : err(res, 404, 'not_found', 'Post not found.');
  };
  api.put('/posts/:id', requireAdmin, update);
  api.patch('/posts/:id', requireAdmin, update);

  api.delete('/posts/:id', requireAdmin, async (req, res) => {
    const r = await query('DELETE FROM posts WHERE id=$1 RETURNING id', [Id.parse(req.params.id)]);
    r.rows.length ? res.status(204).end() : err(res, 404, 'not_found', 'Post not found.');
  });

  api.post('/leads', async (req, res) => {
    if (limited(req.ip)) return err(res, 429, 'rate_limited', 'Too many requests. Please try again in a few minutes.');
    const d = LeadIn.parse(req.body);
    if (d.website) return res.status(201).json({ ok: true }); // bot: pretend success, store nothing
    const { rows } = await query('INSERT INTO leads (name,email,phone,message) VALUES ($1,$2,$3,$4) RETURNING id,name,email',
      [d.name, d.email, d.phone || null, d.message || null]);
    notify(rows[0]);
    res.status(201).json({ ok: true, data: { id: rows[0].id } });
  });
  api.get('/leads', requireAdmin, async (req, res) => {
    const { page, limit } = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(50) }).parse(req.query);
    const { rows } = await query('SELECT id,name,email,phone,message,source,status,created_at FROM leads ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, (page - 1) * limit]);
    res.json({ data: rows });
  });
  api.patch('/leads/:id', requireAdmin, async (req, res) => {
    const { status } = z.object({ status: z.enum(['new', 'contacted', 'closed']) }).parse(req.body);
    const { rows } = await query('UPDATE leads SET status=$1 WHERE id=$2 RETURNING id,status', [status, Id.parse(req.params.id)]);
    rows[0] ? res.json({ data: rows[0] }) : err(res, 404, 'not_found', 'Lead not found.');
  });

  api.get('/categories', async (_req, res) => {
    const { rows } = await query(
      `SELECT category AS name, count(*)::int AS posts FROM posts WHERE status='published'
       GROUP BY category ORDER BY posts DESC, name`);
    res.json({ data: rows });
  });

  app.get('/', (_req, res) => res.redirect('/docs'));
  app.use('/api', api, (_req, res) => err(res, 404, 'not_found', 'Unknown endpoint.'));
  app.use(express.static(new URL('../public', import.meta.url).pathname, { extensions: ['html'] }));

  app.use((e, _req, res, _next) => {
    if (e instanceof z.ZodError) {
      return err(res, 400, 'validation_error', 'Invalid input.',
        e.issues.map((i) => ({ path: i.path.join('.'), message: i.message })));
    }
    if (e.status && e.status < 500) return err(res, e.status, 'bad_request', e.message);
    console.error(e);
    err(res, 500, 'internal_error', 'Something went wrong.');
  });
  return app;
}
