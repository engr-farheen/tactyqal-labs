// 'background:var(--sun);color:#fff' -> { background: 'var(--sun)', color: '#fff' }
export const css = (s) => Object.fromEntries(s.split(';').filter(Boolean).map((r) => {
  const [k, ...v] = r.split(':'); return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v.join(':').trim()];
}));
