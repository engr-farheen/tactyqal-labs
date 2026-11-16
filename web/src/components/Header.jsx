'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV, BOOK } from '@/lib/data';
import { ic, I } from '@/lib/art';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [seen, setSeen] = useState('');
  const bar = useRef(null);

  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      bar.current.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)})`;
      setScrolled(h.scrollTop > 8);
    };
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  // Scroll-spy: highlight the link of the section in the middle of the screen (home page only).
  useEffect(() => {
    if (path !== '/') return;
    const els = NAV.map((n) => n[2] && document.getElementById(n[2])).filter(Boolean);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setSeen(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);

  // Mobile menu: lock page scroll, close on Escape or outside click.
  useEffect(() => {
    document.documentElement.classList.toggle('menu-lock', open);
    if (!open) return;
    const key = (e) => e.key === 'Escape' && setOpen(false);
    const out = (e) => !e.target.closest('.nav') && setOpen(false);
    addEventListener('keydown', key); document.addEventListener('pointerdown', out);
    return () => { removeEventListener('keydown', key); document.removeEventListener('pointerdown', out); document.documentElement.classList.remove('menu-lock'); };
  }, [open]);

  const current = (href, id) => (path === '/' && seen === id) || (href === '/blog' && path.startsWith('/blog')) || (href === '/tools' && path.startsWith('/tools'));
  return (
    <>
      <div id="prog" ref={bar} aria-hidden="true" />
      <header className={`nav${scrolled ? ' sc' : ''}${open ? ' menu-open' : ''}`}>
        <div className="wrap">
          <Link href="/" className="logo" aria-label="Tactyqal Labs home"><Logo /></Link>
          <nav id="site-nav" className="links" aria-label="Main" onClick={(e) => e.target.closest('a') && setOpen(false)}>
            <ul>
              {NAV.map(([href, label, id], i) => (
                <li key={href} style={{ '--i': i }}>
                  <Link href={href} className="nl" aria-current={current(href, id) ? (href.startsWith('/#') ? 'location' : 'page') : undefined}>
                    <b>{String(i + 1).padStart(2, '0')}</b><span>{label}</span><i className="nl-arrow" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ic(I.arrow) }} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="menu-foot">
              <a className="btn btn-lime" href={BOOK} target="_blank" rel="noopener noreferrer"><span>Book free consultation</span><span className="bi" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ic(I.arrow) }} /></a>
              <p>tactyqal.labs@gmail.com · +91-98047-72106</p>
            </div>
          </nav>
          <div className="cta">
            <button type="button" className="theme search-btn" aria-label="Search the site (Ctrl or Command plus K)" onClick={() => window.dispatchEvent(new Event('palette:open'))}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
            <ThemeToggle />
            <a className="btn btn-dark" href={BOOK} target="_blank" rel="noopener noreferrer"><span>Book free consultation</span><span className="bi" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ic(I.arrow) }} /></a>
            <button type="button" className="burger" aria-label="Menu" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}><span /><span /><span /></button>
          </div>
        </div>
      </header>
    </>
  );
}
