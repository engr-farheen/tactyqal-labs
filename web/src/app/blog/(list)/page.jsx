import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { getPosts } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Blog', description: 'Startup ideas, pitching and team-building advice for teen founders.' };

export default async function Blog({ searchParams }) {
  const { q = '', page = '1' } = await searchParams;
  const n = Math.max(1, parseInt(page, 10) || 1);
  const { data, meta } = await getPosts({ page: n, limit: 9, ...(q && { q }) });
  const href = (p) => `/blog?${new URLSearchParams({ ...(q && { q }), page: p })}`;
  return (
    <section className="sec" style={{ paddingTop: 0 }}><div className="wrap">
      <div className="pagehead">
        <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.6rem)', fontWeight: 800 }}>Learn from industry experts</h1>
        <form className="search" action="/blog" role="search"><input type="search" name="q" defaultValue={q} placeholder="Search articles" aria-label="Search articles" /><button type="submit" className="btn btn-dark"><span>Search</span></button></form>
      </div>
      <h2 className="sr">Latest articles</h2>
      {data.length ? <div className="posts">{data.map((p, i) => <PostCard key={p.slug} p={p} i={i} />)}</div> : <p className="empty">{q ? `No articles match “${q}”.` : 'No articles yet. Check back soon.'}</p>}
      {meta.pages > 1 && <nav className="pager" aria-label="Pagination">{n > 1 ? <Link href={href(n - 1)}>← Newer</Link> : <span />}{n < meta.pages && <Link href={href(n + 1)}>Older →</Link>}</nav>}
    </div></section>
  );
}
