import Link from 'next/link';
import Media from './Media';
import Reel from './Reel';
import CountUp from './CountUp';
import PostCard from './PostCard';
import ContactForm from './ContactForm';
import Logo from './Logo';
import Avatar from './Avatar';
import LiteYouTube from './LiteYouTube';
import { APP, ic, I, COL, REEL_ART, THUMB_ART } from '@/lib/art';
import { css } from '@/lib/style';
import { TOOLS } from '@/lib/tools';
import { BOOK, appImg, portrait, NAV, TAGS, PERKS, STORIES, STEPS, WHY, QUOTES, AVATAR, INCLUDED, FAQS } from '@/lib/data';

const Bi = ({ k = 'arrow', up }) => <span className={`bi${up ? ' up' : ''}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: ic(I[k]) }} />;
export const Book = ({ className, icon = 'arrow', children }) => <a className={className} href={BOOK} target="_blank" rel="noopener noreferrer"><span>{children}</span><Bi k={icon} up={icon === 'rocket'} /></a>;
const Spark = ({ className }) => <svg className={`spk ${className}`} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" /></svg>;
const Icon = ({ k, style, className = 'ico' }) => <span className={className} style={style} dangerouslySetInnerHTML={{ __html: ic(I[k]) }} />;
const Words = ({ text, start = 0 }) => text.split(' ').map((w, i) => <span key={i}><span className="w" style={{ '--i': start + i }}>{w}</span>{' '}</span>);

const Seal = ({ id, className }) => (
  <div className={`seal ${className}`} role="img" aria-label="Limited offer: 16,000 rupees, down from 25,000. 15 spots a month.">
    <svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id={id} d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" /></defs>
      <text><textPath href={`#${id}`} textLength="278" lengthAdjust="spacing">LIMITED OFFER • 15 SPOTS A MONTH • </textPath></text></svg>
    <div><s>₹25,000</s><b>₹16,000</b></div>
  </div>
);

const win = (cls, name, art, img) => (
  <div className={`win ${cls}`} aria-hidden="true"><div className="bar"><i /><i /><i /></div><Media art={APP[art]} src={IMG + img} alt="" /></div>
);

export function Hero() {
  return (
    <>
      <div className="blob b1" /><div className="blob b2" />
      <div className="wrap hero-grid">
        <div>
          <p className="pill"><i /> Only 15 spots a month · 8-week 1:1 program</p>
          <h1><Words text="Real apps. Built by teenagers." /><em className="mark"><Words text="Live in 8 weeks." start={5} /></em></h1>
          <p className="sub">1:1 mentoring that takes your child from an idea to a working full-stack app, using no-code tools. No coding experience needed.</p>
          <ul className="tags">{TAGS.map((t, i) => <li key={t} style={{ '--i': i }}><span>✓</span>{t}</li>)}</ul>
          <div className="btns">
            <Book className="btn btn-dark nudge">Book free consultation</Book>
            <Link href="/#success" className="btn btn-line"><span>See success stories</span><Bi k="down" /></Link>
            <Spark className="sp1" /><Spark className="sp2" />
          </div>
          <dl className="stats">
            <div><dt>Students mentored</dt><dd><CountUp to={100} suffix="+" /></dd></div>
            <div><dt>Admissions</dt><dd>Top universities</dd></div><div><dt>People impacted</dt><dd>Thousands</dd></div>
          </dl>
        </div>
        <div className="stage" role="group" aria-label="What your teen achieves in 8 weeks">
          <span className="dot d1" /><span className="dot d2" /><span className="dot d3" />
          <div className="phone p2" aria-hidden="true"><div className="notch" /><div className="screen">
            <div className="apphead"><b>KrishiDrishti</b></div>
            <svg className="gauge" viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="none" stroke="#E8F0DD" strokeWidth="12" /><circle className="garc" cx="50" cy="50" r="38" fill="none" stroke="#0E8F6E" strokeWidth="12" strokeLinecap="round" pathLength="100" transform="rotate(-90 50 50)" /><text x="50" y="47" textAnchor="middle" fontSize="9" fill="#10211B" opacity=".7">Soil pH</text><text x="50" y="62" textAnchor="middle" fontSize="17" fontWeight="800" fill="#10211B">6.8</text></svg>
            <div className="row"><span>Nitrogen</span><b>Medium</b></div><div className="row"><span>Best crop</span><b>Wheat</b></div>
            <div className="mini">Get crop advice</div>
          </div></div>
          <div className="phone p1"><div className="notch" /><div className="screen">
            <div className="apphead"><b>My First App</b><small>Week 8</small></div>
            <div className="prog"><i /></div>
            <ul className="checks">{['Idea validated', 'Prototype designed', 'Full-stack app built', 'Launched on Product Hunt'].map((t, i) => <li key={t} style={{ '--i': i }}><span className="tick">✓</span>{t}</li>)}</ul>
            <div className="rev"><small>Revenue</small><div className="bars">{[18, 30, 26, 46, 60, 78, 100].map((h, i) => <i key={i} style={{ '--h': `${h}%`, '--i': i }} />)}</div></div>
            <div className="live"><Bi k="rocket" />Live!</div>
          </div></div>
          <div className="fchip f3"><Icon k="coin" className="" />First revenue</div>
          <div className="fchip f1"><Icon k="cap" className="" />Admissions edge</div>
          <div className="fchip f2"><Icon k="trophy" className="" />Real impact</div>
          <Seal id="seal-hero" className="s1" />
        </div>
      </div>
    </>
  );
}

export const Band = () => (
  <div className="band" aria-hidden="true"><div className="track">
    {[0, 1].map((n) => STORIES.map(([name, , , file]) => (
      
      <span key={`${n}-${name}`}><img src={`/img/thumbs/${file}.jpg`} alt="" width="30" height="30" /><b>{name}</b></span>
    )))}
  </div></div>
);

export const Stories = () => (
  <section id="success" className="sec"><div className="wrap">
    <h2 className="rv">Real students. Real apps. Real success.</h2>
    <div className="stories">
      {STORIES.map(([n, tag, d, file], i) => (
        <article className="story rv" key={n}><Media art={APP[i]} src={appImg(file)} alt={`${n} app screenshot`} />
          <div className="txt"><span className="chip">{tag}</span><h3>{n}</h3><p>{d}</p></div></article>
      ))}
    </div>
  </div></section>
);

export const Program = () => (
  <section id="program" className="sec" style={{ paddingTop: 0 }}><div className="wrap">
    <h2 className="rv">From idea to full app in 8 weeks</h2>
    <div className="steps-wrap">
      <span className="fill" aria-hidden="true" /><span className="fly" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ic(I.rocket) }} />
      <ol className="steps">
        {STEPS.map(([w, t, k], i) => <li className="step" key={t}><Icon k={k} className="ico badge" style={css(COL[i])} /><small>{w}</small><h3>{t}</h3></li>)}
      </ol>
    </div>
    <blockquote className="quote rv">Learn to sell. Learn to build. If you can do both, you will be unstoppable.<span>Naval Ravikant</span></blockquote>
    <ul className="perks rv">{PERKS.map((t) => <li key={t}>{t}</li>)}</ul>
    <p className="perk-note rv">University admissions, revenue generation, international recognition, grants</p>
    <Book className="btn btn-dark" icon="rocket">Start your journey today</Book>
  </div></section>
);

export const Why = () => (
  <>
    <svg className="wave" viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 56V22C240 0 480 0 720 22s480 22 720 0v34z" /></svg>
    <section id="why" className="sec dark" style={{ marginTop: -1, paddingTop: 40 }}><div className="wrap">
      <h2 className="rv">Why parents choose Tactyqal Labs</h2>
      <div className="reel rv"><span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: REEL_ART }} />
        <div className="mosaic" aria-hidden="true">{['olc', 'audionova', 'paws'].map((f) => <img key={f} src={`/img/apps/${f}.jpg`} alt="" loading="lazy" />)}</div>
        <Reel src="https://www.tactyqal.com/application/assets/videos/continuous-support.mp4" />
        <span className="cap">1 hour of live 1:1 mentoring, every week</span></div>
      <ul className="why">{WHY.map(([k, t, d]) => <li className="rv" key={t}><Icon k={k} /><div><h3>{t}</h3><p>{d}</p></div></li>)}</ul>
    </div></section>
  </>
);

export const Lesson = () => (
  <section className="sec"><div className="wrap lesson">
    <div className="rv"><h2>Startup Ideas 101</h2><p className="lead">Learn how to identify and validate profitable startup ideas from our founder.</p>
      <a className="btn btn-dark" style={{ marginTop: 26 }} href="https://www.youtube.com/watch?v=UyUH06CfLbk&t=105s" target="_blank" rel="noopener noreferrer"><span>Watch the lesson</span><Bi k="play" /></a></div>
    <div className="rv"><LiteYouTube id="UyUH06CfLbk" start={105} title="How to Come Up with Startup Ideas?" art={THUMB_ART} /></div>
  </div></section>
);

export const Tools = () => (
  <section id="tools" className="sec" style={{ paddingTop: 0 }}><div className="wrap">
    <h2 className="rv">Free tools to get started</h2><p className="lead rv">Explore our startup assessment tools used by 1000+ entrepreneurs. Each one runs right here and gives you a result in about two minutes.</p>
    <div className="tools">{TOOLS.map((t, i) => <Link className="tool rv" key={t.slug} href={`/tools/${t.slug}`}><Icon k={t.icon} style={css(COL[i % 6])} />{t.name}<em>{t.q ? `${t.q.length} questions · ${t.minutes} min` : 'Instant ideas'}</em></Link>)}</div>
    <Link href="/tools" className="btn btn-dark" style={{ marginTop: 32 }}><span>Access all tools free</span><Bi k="arrow" /></Link>
  </div></section>
);

export const Quotes = () => (
  <section className="sec alt"><div className="wrap">
    <h2 className="rv">What our students say</h2>
    <div className="quotes">{QUOTES.map(([n, q, f], i) => <figure className="q rv" key={n}><p>“{q}”</p><footer><Avatar src={portrait(f)} name={n} bg={AVATAR[i]} />{n}</footer></figure>)}</div>
  </div></section>
);

export const BlogSection = ({ posts }) => (
  <section id="blog" className="sec"><div className="wrap">
    <h2 className="rv">Learn from industry experts</h2>
    {posts.length ? <div className="posts">{posts.map((p, i) => <PostCard key={p.slug} p={p} i={i} />)}</div>
      : <p className="empty">Articles will appear here once the blog API is connected.</p>}
    <div style={{ textAlign: 'center', marginTop: 44 }}><Link href="/blog" className="btn btn-line"><span>Read all articles</span><Bi k="arrow" /></Link></div>
  </div></section>
);

export const Pricing = () => (
  <section id="pricing" className="sec" style={{ paddingTop: 0 }}><div className="wrap price rv">
    <Seal id="seal-price" className="s2" />
    <div><h2>Start your teen&apos;s entrepreneurial journey</h2>
      <div className="amt"><b><CountUp to={16000} prefix="₹" /></b><s>₹25,000</s></div>
      <p style={{ marginTop: 14, opacity: 0.88 }}>Limited time offer. Only 15 spots available for the month.</p>
      <Book className="btn btn-lime" icon="rocket">Enroll now</Book><p style={{ marginTop: 14, fontSize: '.9rem', opacity: 0.85 }}>Results guaranteed or money back</p></div>
    <ul style={{ alignSelf: 'center' }}>{INCLUDED.map((t) => <li key={t}><span>✓</span>{t}</li>)}</ul>
  </div></section>
);

export const Faq = () => (
  <section id="faq" className="sec" style={{ paddingTop: 0 }}><div className="wrap">
    <h2 className="rv" style={{ margin: 'auto', textAlign: 'center' }}>Frequently asked questions</h2>
    <div className="faq">{FAQS.map(([q, a]) => <details key={q} className="rv"><summary>{q}</summary><p>{a}</p></details>)}</div>
  </div></section>
);

export const Contact = () => (
  <section id="contact" className="sec" style={{ paddingTop: 0 }}><div className="wrap"><div className="contact-card rv">
    <div>
      <h2>Ready to start your teen&apos;s success story?</h2>
      <p className="lead" style={{ color: 'rgba(255,255,255,.78)' }}>Tell us a little about your teen and we will get back to you within 24 hours.</p>
      <div className="info">
        <a href="mailto:tactyqal.labs@gmail.com"><Icon k="mail" /><span><small>Email</small><b>tactyqal.labs@gmail.com</b></span></a>
        <a href="tel:+919804772106"><Icon k="phone" /><span><small>Phone</small><b>+91-98047-72106</b></span></a>
        <div><Icon k="clock" /><span><small>Working hours</small><b>Mon–Sat, 9am–7pm</b></span></div>
        <div><Icon k="send" /><span><small>Response time</small><b>Within 24 hours</b></span></div>
      </div>
      <Book className="btn btn-warm">Or book a time directly</Book>
    </div>
    <ContactForm />
  </div></div></section>
);

export const Footer = () => (
  <footer className="foot"><div className="wrap">
    <div><Link href="/" className="logo" aria-label="Tactyqal Labs home"><Logo light /></Link>
      <p style={{ marginTop: 14, maxWidth: '26em' }}>1:1 mentoring that turns teenagers&apos; ideas into real, launched apps.</p><small>© {new Date().getFullYear()} Tactyqal Labs. All rights reserved.</small></div>
    <div><p className="fh">Explore</p>{NAV.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</div>
    <div><p className="fh">Contact</p><a href="mailto:tactyqal.labs@gmail.com">tactyqal.labs@gmail.com</a><a href="tel:+919804772106">+91-98047-72106</a><a>Mon–Sat, 9am–7pm</a></div>
  </div></footer>
);
