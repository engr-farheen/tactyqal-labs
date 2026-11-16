import test from 'node:test';
import assert from 'node:assert/strict';

if (process.env.TEST_DATABASE_URL) process.env.DATABASE_URL = process.env.TEST_DATABASE_URL; // CI: real PostgreSQL
else process.env.PGLITE_DIR = 'memory://'; // default: embedded PostgreSQL, no setup
process.env.ADMIN_TOKEN = 'secret';
const { createApp } = await import('../src/app.js');
const { migrate, query: sql } = await import('../src/db.js');
if (process.env.TEST_DATABASE_URL) await sql('DROP TABLE IF EXISTS posts, leads');
await migrate();
const server = await new Promise((r) => { const s = createApp().listen(0, () => r(s)); });
const base = `http://127.0.0.1:${server.address().port}/api`;
const auth = { 'content-type': 'application/json', authorization: 'Bearer secret' };
const call = async (path, opts) => {
  const r = await fetch(base + path, opts);
  return { status: r.status, body: await r.json().catch(() => null) };
};
test.after(() => server.close());

let post;
test('writes require the admin token', async () => {
  const r = await call('/posts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
  assert.equal(r.status, 401);
});
test('create validates input', async () => {
  const r = await call('/posts', { method: 'POST', headers: auth, body: JSON.stringify({ title: 'a' }) });
  assert.equal(r.status, 400);
  assert.equal(r.body.error.code, 'validation_error');
});
test('create, unique slugs, read-time and excerpt', async () => {
  const body = JSON.stringify({ title: 'Hello World!', content: 'word '.repeat(450), tags: ['a'], status: 'published' });
  const a = await call('/posts', { method: 'POST', headers: auth, body });
  const b = await call('/posts', { method: 'POST', headers: auth, body });
  assert.equal(a.status, 201);
  assert.equal(a.body.data.slug, 'hello-world');
  assert.equal(b.body.data.slug, 'hello-world-2');
  assert.equal(a.body.data.read_minutes, 3);
  assert.ok(a.body.data.published_at);
  post = a.body.data;
});
test('drafts are hidden from the public but visible to admins', async () => {
  const d = await call('/posts', { method: 'POST', headers: auth, body: JSON.stringify({ title: 'Secret draft', content: 'x' }) });
  assert.equal((await call(`/posts/${d.body.data.slug}`)).status, 404);
  assert.equal((await call(`/posts/${d.body.data.slug}`, { headers: auth })).status, 200);
  assert.equal((await call('/posts?status=all')).status, 401);
  const pub = await call('/posts');
  assert.ok(pub.body.data.every((p) => p.status === 'published'));
  assert.ok(!('content' in pub.body.data[0]));
});
test('update keeps slug, delete removes', async () => {
  const u = await call(`/posts/${post.id}`, { method: 'PUT', headers: auth, body: JSON.stringify({ title: 'Renamed' }) });
  assert.equal(u.body.data.title, 'Renamed');
  assert.equal(u.body.data.slug, 'hello-world');
  assert.equal((await call(`/posts/${post.id}`, { method: 'DELETE', headers: auth })).status, 204);
  assert.equal((await call(`/posts/${post.id}`, { method: 'DELETE', headers: auth })).status, 404);
});
test('search, tag filter and pagination', async () => {
  await call('/posts', { method: 'POST', headers: auth, body: JSON.stringify({ title: 'Soil analysis for farmers', content: 'crop advice', tags: ['agri'], category: 'Impact', status: 'published' }) });
  assert.equal((await call('/posts?q=farmers')).body.meta.total, 1);
  assert.equal((await call('/posts?tag=agri')).body.meta.total, 1);
  assert.equal((await call('/posts?category=impact')).body.meta.total, 1);
  const p = await call('/posts?limit=1&page=2');
  assert.equal(p.body.data.length, 1);
  assert.ok(p.body.meta.pages >= 2);
  assert.equal((await call('/posts?limit=999')).status, 400);
});
test('bad JSON and unknown routes return JSON errors', async () => {
  const r = await call('/posts', { method: 'POST', headers: auth, body: '{oops' });
  assert.equal(r.status, 400);
  assert.equal((await call('/nope')).status, 404);
});
test('OpenAPI spec and Swagger UI are served', async () => {
  const r = await call('/openapi.json');
  assert.equal(r.status, 200);
  assert.ok(r.body.paths['/api/posts'].post && r.body.paths['/api/posts/{ref}'].delete);
  const docs = await fetch(base.replace('/api', '') + '/docs');
  assert.equal(docs.status, 200);
});

const lead = { name: 'Asha Verma', email: 'asha@example.com', phone: '+91 98047 72106', message: 'My son wants to build an app.' };
test('leads: public create, validation, honeypot and admin-only list', async () => {
  const ok = await call('/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead) });
  assert.equal(ok.status, 201);
  const bad = await call('/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...lead, email: 'nope' }) });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.error.details[0].path, 'email');
  const bot = await call('/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...lead, name: 'Bot Bot', website: 'http://spam.test' }) });
  assert.equal(bot.status, 201);
  assert.equal((await call('/leads')).status, 401);
  const list = await call('/leads', { headers: auth });
  assert.equal(list.body.data.length, 1);
  assert.equal(list.body.data[0].email, 'asha@example.com');
  const up = await call(`/leads/${list.body.data[0].id}`, { method: 'PATCH', headers: auth, body: JSON.stringify({ status: 'contacted' }) });
  assert.equal(up.body.data.status, 'contacted');
});
test('leads: rate limit returns 429', async () => {
  const codes = [];
  for (let i = 0; i < 4; i++) codes.push((await call('/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead) })).status);
  assert.ok(codes.includes(429), `expected a 429 in ${codes}`);
});

test('read_minutes override, source_url and relative cover paths', async () => {
  const r = await call('/posts', { method: 'POST', headers: auth, body: JSON.stringify({ title: 'Imported style post', content: 'short', read_minutes: 5, cover_image: '/img/blog/pitch.jpg', source_url: 'https://tactyqal.com/blog/x/', status: 'published' }) });
  assert.equal(r.status, 201);
  assert.equal(r.body.data.read_minutes, 5);
  assert.equal(r.body.data.source_url, 'https://tactyqal.com/blog/x/');
  const bad = await call('/posts', { method: 'POST', headers: auth, body: JSON.stringify({ title: 'Bad cover', content: 'x', cover_image: 'javascript:alert(1)' }) });
  assert.equal(bad.status, 400);
});

test('repeated wrong tokens are rate limited, and a valid token still works', async () => {
  const bad = { 'content-type': 'application/json', authorization: 'Bearer wrong' }, codes = [];
  for (let i = 0; i < 25; i++) codes.push((await call('/posts', { method: 'POST', headers: bad, body: '{}' })).status);
  assert.equal(codes[0], 401);
  assert.ok(codes.includes(429), `expected a 429 in ${codes}`);
  assert.equal((await call('/posts?status=all', { headers: auth })).status, 200);
});
