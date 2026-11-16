'use client';

// Light/dark theme. The initial theme is set by an inline script in <head> (no flash); icons switch with CSS from [data-theme].
export default function ThemeToggle() {
  const toggle = () => {
    const d = document.documentElement, next = d.dataset.theme === 'dark' ? 'light' : 'dark';
    d.classList.add('theme-anim'); d.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* private mode: keep the choice for this visit only */ }
    setTimeout(() => d.classList.remove('theme-anim'), 600);
  };
  return (
    <button type="button" className="theme" onClick={toggle} aria-label="Switch between light and dark theme">
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    </button>
  );
}
