import { getPosts } from '@/lib/api';
import { TOOLS } from '@/lib/tools';
export const dynamic = 'force-dynamic';
const SITE = process.env.SITE_URL || 'http://localhost:3000';
export default async function sitemap() {
  const { data } = await getPosts({ limit: 50 });
  return [{ url: SITE, lastModified: new Date() }, { url: `${SITE}/blog` }, { url: `${SITE}/tools` }, ...TOOLS.map((t) => ({ url: `${SITE}/tools/${t.slug}` })), ...data.map((p) => ({ url: `${SITE}/blog/${p.slug}`, lastModified: p.updated_at }))];
}
