'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NAV } from '@/lib/data';
import { TOOLS } from '@/lib/tools';

const PAGES = [
  ...NAV.map(([href, label]) => ({ label, href, group: 'Pages' })),
  ...TOOLS.map((t) => ({ label: t.name, href: `/tools/${t.slug}`, group: 'Tools', hint: t.blurb })),
];

// Ctrl/Cmd+K search over pages, tools and (via the API's full-text search) blog articles.
export default function CommandPalette() {
  const dlg = useRef(null), input = useRef(null), router = useRouter();
  const [q, setQ] = useState(''), [posts, setPosts] = useState([]), [i, setI] = useState(0);
  const open = () => { dlg.current?.showModal(); setTimeout(() => input.current?.focus(), 0); };

  useEffect(() => {
    const key = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); } };
    addEventListener('keydown', key); addEventListener('palette:open', open);
    return () => { removeEventListener('keydown', key); removeEventListener('palette:open', open); };
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const ac = new AbortController();
    const t = setTimeout(async () => {
      try { const r = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ac.signal }); setPosts((await r.json()).posts || []); } catch { /* aborted or offline */ }
    }, 200);
    return () => { clearTimeout(t); ac.abort(); };
  }, [q]);

  const term = q.trim().toLowerCase();
  const results = [
    ...PAGES.filter((p) => !term || p.label.toLowerCase().includes(term) || (p.hint || '').toLowerCase().includes(term)).slice(0, 10),
    ...(term.length < 2 ? [] : posts.map((p) => ({ label: p.title, href: `/blog/${p.slug}`, group: 'Articles', hint: p.excerpt }))),
  ];
  const go = (r) => { dlg.current?.close(); router.push(r.href); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((n) => Math.min(n + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((n) => Math.max(n - 1, 0)); }
    else if (e.key === 'Enter' && results[i]) { e.preventDefault(); go(results[i]); }
  };
  return (
    <dialog ref={dlg} className="palette" aria-label="Search" onClick={(e) => e.target === dlg.current && dlg.current.close()} onClose={() => { setQ(''); setI(0); }}>
      <div className="pal-bar">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input ref={input} type="text" role="combobox" aria-expanded="true" aria-controls="pal-list" aria-activedescendant={results[i] ? `pal-${i}` : undefined} aria-label="Search"
          placeholder="Search pages, tools and articles" value={q} onChange={(e) => { setQ(e.target.value); setI(0); }} onKeyDown={onKey} autoComplete="off" />
        <kbd>Esc</kbd>
      </div>
      <ul id="pal-list" role="listbox" aria-label="Results">
        {results.map((r, k) => (
          <li key={r.group + r.href} role="none">
            {(k === 0 || results[k - 1].group !== r.group) && <p className="pal-g">{r.group}</p>}
            <div id={`pal-${k}`} role="option" aria-selected={k === i} className={k === i ? 'on' : ''} onMouseEnter={() => setI(k)} onClick={() => go(r)}>
              <b>{r.label}</b>{r.hint && <small>{r.hint}</small>}
            </div>
          </li>
        ))}
      </ul>
      {results.length === 0 && <p className="pal-empty">No results for “{q}”</p>}
    </dialog>
  );
}
