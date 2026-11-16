import Link from 'next/link';
import { TOOLS } from '@/lib/tools';
import { ic, I, COL } from '@/lib/art';
import { css } from '@/lib/style';

export const metadata = { title: 'Free startup tools', description: 'Free tools for young founders: idea generator, fundability, team, pitch deck, problem-solution fit and landing page checks.' };

export default function ToolsIndex() {
  return (
    <section className="sec" style={{ paddingTop: 0 }}><div className="wrap">
      <div className="pagehead"><h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.6rem)', fontWeight: 800 }}>Free startup tools</h1>
        <p className="lead">Short, honest assessments and generators used by 1000+ entrepreneurs. No sign-up, results in two minutes.</p></div>
      <div className="tools">
        {TOOLS.map((t, i) => (
          <Link key={t.slug} className="tool rv" href={`/tools/${t.slug}`}>
            <span className="ico" style={css(COL[i % 6])} dangerouslySetInnerHTML={{ __html: ic(I[t.icon]) }} />
            {t.name}<small>{t.blurb}</small><em>{t.q ? `${t.q.length} questions · ${t.minutes} min` : 'Instant ideas'}</em>
          </Link>
        ))}
      </div>
    </div></section>
  );
}
