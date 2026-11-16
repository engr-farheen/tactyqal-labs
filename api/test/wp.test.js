import test from 'node:test';
import assert from 'node:assert/strict';

if (process.env.TEST_DATABASE_URL) process.env.DATABASE_URL = process.env.TEST_DATABASE_URL; // CI: real PostgreSQL
else process.env.PGLITE_DIR = 'memory://'; // default: embedded PostgreSQL, no setup
const { htmlToText, mapWpPost, importPosts } = await import('../scripts/wp.js');
const { migrate, query } = await import('../src/db.js');
if (process.env.TEST_DATABASE_URL) await query('DROP TABLE IF EXISTS posts, leads');
await migrate();

const wp = [
  { slug: 'hello-wp', status: 'publish', date_gmt: '2024-05-01T10:00:00', title: { rendered: 'Pitch &amp; Win &#8211; 101' },
    excerpt: { rendered: '<p>Short intro&hellip; [&hellip;]</p>' },
    content: { rendered: '<h2>Start <em>here</em></h2><p>Hello &amp; welcome.</p><ul><li>One</li><li>Two</li></ul><script>x()</script>' },
    _embedded: { author: [{ name: 'Sam' }], 'wp:featuredmedia': [{ source_url: 'https://x.test/a.png' }],
      'wp:term': [[{ taxonomy: 'category', name: 'Startups', slug: 'startups' }], [{ taxonomy: 'post_tag', name: 'pitch' }]] } },
  { slug: 'bad', title: { rendered: 'x' }, content: { rendered: '' } },
];

test('HTML converts to the blog text format', () => {
  assert.equal(htmlToText(wp[0].content.rendered), '## Start here\n\nHello & welcome.\n\n- One\n- Two');
});
test('WordPress fields map to our schema', () => {
  const p = mapWpPost(wp[0]);
  assert.equal(p.title, 'Pitch & Win – 101');
  assert.equal(p.excerpt, 'Short intro…');
  assert.deepEqual([p.category, p.author, p.cover_image, p.status, p.tags], ['Startups', 'Sam', 'https://x.test/a.png', 'published', ['pitch']]);
  assert.equal(p.published_at, '2024-05-01T10:00:00Z');
});
test('import is idempotent and skips invalid posts', async () => {
  assert.deepEqual(await importPosts(wp, { dryRun: true }), { created: 1, updated: 0, skipped: ['bad'] });
  assert.equal((await query('SELECT count(*)::int n FROM posts')).rows[0].n, 0);
  const a = await importPosts(wp), b = await importPosts(wp);
  assert.deepEqual([a.created, a.updated, b.created, b.updated], [1, 0, 0, 1]);
  const { rows } = await query('SELECT * FROM posts');
  assert.equal(rows.length, 1); assert.equal(rows[0].read_minutes, 1); assert.equal(rows[0].status, 'published');
});
