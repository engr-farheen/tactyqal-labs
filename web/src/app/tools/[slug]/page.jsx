import Link from 'next/link';
import { notFound } from 'next/navigation';
import ToolRunner from '@/components/ToolRunner';
import { TOOLS, bySlug } from '@/lib/tools';
import { BOOK } from '@/lib/data';
import { ic, I, COL } from '@/lib/art';
import { css } from '@/lib/style';

export const dynamicParams = false;
export const generateStaticParams = () => TOOLS.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }) {
  const t = bySlug((await params).slug);
  return t ? { title: t.name, description: t.blurb, openGraph: { title: t.name, description: t.blurb } } : {};
}

export default async function ToolPage({ params }) {
  const t = bySlug((await params).slug);
  if (!t) notFound();
  const i = TOOLS.indexOf(t), others = TOOLS.filter((x) => x !== t).slice(0, 3);
  return (
    <section className="sec" style={{ paddingTop: 36 }}><div className="wrap tool-page">
      <Link href="/tools" className="crumb">← All tools</Link>
      <div className="tool-head">
        <span className="ico" style={css(COL[i % 6])} dangerouslySetInnerHTML={{ __html: ic(I[t.icon]) }} />
        <div><h1>{t.name}</h1><p className="lead">{t.about}</p>
          <ul className="tool-meta"><li>{t.q ? `${t.q.length} questions` : 'Instant results'}</li><li>About {t.minutes} min</li><li>Free, no sign-up</li></ul></div>
      </div>
      <ToolRunner slug={t.slug} bookUrl={BOOK} />
      <h2 className="more-h">More free tools</h2>
      <div className="tools three">{others.map((o, k) => (
        <Link key={o.slug} className="tool" href={`/tools/${o.slug}`}><span className="ico" style={css(COL[(k + 2) % 6])} dangerouslySetInnerHTML={{ __html: ic(I[o.icon]) }} />{o.name}<small>{o.blurb}</small></Link>
      ))}</div>
    </div></section>
  );
}
