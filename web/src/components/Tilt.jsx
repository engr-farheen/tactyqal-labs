'use client';
import { useEffect } from 'react';

// Subtle 3D tilt and a moving highlight on cards (event delegation, pointer devices only).
export default function Tilt() {
  useEffect(() => {
    if (!matchMedia('(hover:hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = (e) => e.target.closest?.('.story, .q, .tool');
    const move = (e) => {
      const c = card(e); if (!c) return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--ry', `${(x - 0.5) * 8}deg`); c.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
      c.style.setProperty('--sx', `${x * 100}%`); c.style.setProperty('--sy', `${y * 100}%`);
    };
    const out = (e) => { const c = card(e); if (c) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); } };
    document.addEventListener('pointermove', move); document.addEventListener('pointerout', out);
    return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerout', out); };
  }, []);
  return null;
}
