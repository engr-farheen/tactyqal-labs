// Usage:
//   node scripts/import-wordpress.js --url https://tactyqal.com/blog [--dry-run]
//   node scripts/import-wordpress.js --file export.json [--dry-run]
import fs from 'node:fs';
import { migrate } from '../src/db.js';
import { importPosts } from './wp.js';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : undefined; };
const dryRun = process.argv.includes('--dry-run');

async function fetchAll(base) {
  const posts = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${base.replace(/\/$/, '')}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=1`);
    if (res.status === 400) break; // WordPress answers 400 when the page is past the end
    if (!res.ok) throw new Error(`WordPress returned HTTP ${res.status}. Check that ${base}/wp-json/wp/v2/posts opens in a browser.`);
    const batch = await res.json(); posts.push(...batch);
    if (page >= Number(res.headers.get('x-wp-totalpages') || 1) || !batch.length) break;
  }
  return posts;
}

const source = arg('file') ? JSON.parse(fs.readFileSync(arg('file'), 'utf8')) : arg('url') ? await fetchAll(arg('url')) : null;
if (!source) { console.error('Provide --url <wordpress site> or --file <export.json>'); process.exit(1); }
await migrate();
const r = await importPosts(source, { dryRun });
console.log(`${dryRun ? '[dry run] ' : ''}${source.length} posts read: ${r.created} ${dryRun ? 'would import' : 'created'}, ${r.updated} updated, ${r.skipped.length} skipped${r.skipped.length ? ` (${r.skipped.join(', ')})` : ''}`);
process.exit(0);
