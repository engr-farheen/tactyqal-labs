import Link from 'next/link';
import { notFound } from 'next/navigation';
import Media from '@/components/Media';
import { BLOG } from '@/lib/art';
import { BLOG_ART, fmtDate, getPost, getPosts } from '@/lib/api';
import { ic, I } from '@/lib/art';
import PostCard from '@/components/PostCard';
import ShareButton from '@/components/ShareButton';
import { BLOG_KEYS } from '@/lib/data';

export async function generateMetadata({ params }) {
  const p = await getPost((await params).slug);
  if (!p) return { title: 'Article not found' };
  return { title: p.title, description: p.excerpt, openGraph: { title: p.title, description: p.excerpt, type: 'article', publishedTime: p.published_at, images: p.cover_image ? [p.cover_image] : [] } };
}

function Body({ text }) {
  return text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean).map((b, i) => {
    const lines = b.split('\n');
    if (b.startsWith('## ')) return <h2 key={i}>{b.slice(3)}</h2>;
    if (lines.every((l) => l.startsWith('- '))) return <ul key={i}>{lines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>;
    return <p key={i}>{b}</p>;
  });
}

export default async function Article({ params }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const related = (await getPosts({ limit: 4 })).data.filter((x) => x.slug !== p.slug).slice(0, 3);
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.excerpt, datePublished: p.published_at, dateModified: p.updated_at, author: { '@type': 'Person', name: p.author }, image: p.cover_image || undefined };
  return (
    <article className="article">
      <Link href="/blog" className="crumb">← All articles</Link>
      <h1 style={{ marginTop: 18 }}>{p.title}</h1>
      <p className="meta">{p.category} · {p.read_minutes} min read · {fmtDate(p.published_at)} · By {p.author}</p>
      <Media art={BLOG[BLOG_ART(p, 0)]} src={[p.cover_image, `/img/blog/${BLOG_KEYS[BLOG_ART(p, 0)]}.jpg`]} alt={p.title} />
      <div className="prose"><Body text={p.content} /></div>
      <div className="art-actions"><ShareButton title={p.title} /></div>
      {p.source_url && <a className="btn btn-line" style={{ marginTop: 36 }} href={p.source_url} target="_blank" rel="noopener noreferrer"><span>Read the full article on tactyqal.com</span><span className="bi" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ic(I.arrow) }} /></a>}
      {related.length > 0 && <section className="related"><h2>Keep reading</h2><div className="posts">{related.map((x, k) => <PostCard key={x.slug} p={x} i={k} />)}</div></section>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
    </article>
  );
}
