import Link from 'next/link';
import Media from './Media';
import { BLOG, ic, I } from '@/lib/art';
import { BLOG_ART, fmtDate } from '@/lib/api';
import { BLOG_KEYS } from '@/lib/data';

export default function PostCard({ p, i }) {
  return (
    <article className="rv">
      <Link className="post" href={`/blog/${p.slug}`}>
        <Media art={BLOG[BLOG_ART(p, i)]} src={[p.cover_image, `/img/blog/${BLOG_KEYS[BLOG_ART(p, i)]}.jpg`]} alt={p.title} />
        <small>By {p.author} · {p.read_minutes} min read · {fmtDate(p.published_at)}</small>
        <h3>{p.title}</h3>
        <p>{p.excerpt}</p>
        <span className="rm">Read more <span dangerouslySetInnerHTML={{ __html: ic(I.arrow) }} /></span>
      </Link>
    </article>
  );
}
