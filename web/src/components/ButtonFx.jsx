'use client';
import { useEffect } from 'react';

// Global button micro-interactions (event delegation): cursor-following glow, magnetic lean and a click ripple.
export default function ButtonFx() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const btn = (e) => e.target.closest?.('.btn');
    const move = (e) => {
      const b = btn(e); if (!b || e.pointerType === 'touch') return;
      const r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      b.style.setProperty('--bx', `${x}px`); b.style.setProperty('--by', `${y}px`);
      b.style.setProperty('--tx', `${(x / r.width - 0.5) * 8}px`); b.style.setProperty('--ty', `${(y / r.height - 0.5) * 6}px`);
    };
    const out = (e) => { const b = btn(e); if (b) { b.style.setProperty('--tx', '0px'); b.style.setProperty('--ty', '0px'); } };
    const down = (e) => {
      const b = btn(e); if (!b) return;
      const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = document.createElement('span');
      s.className = 'rip'; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      b.append(s); setTimeout(() => s.remove(), 650);
      if (b.matches('.btn-lime, .btn-warm, .nudge')) {
        const colors = ['#C8F135', '#FFB800', '#FF5A36', '#FF9EB5', '#0E8F6E'];
        for (let i = 0; i < 16; i++) {
          const c = document.createElement('i'), a = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 70;
          c.className = 'confetti';
          c.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${colors[i % 5]};--dx:${Math.cos(a) * dist}px;--dy:${Math.sin(a) * dist - 24}px;rotate:${Math.random() * 360}deg`;
          document.body.append(c); setTimeout(() => c.remove(), 850);
        }
      }
    };
    document.addEventListener('pointermove', move); document.addEventListener('pointerout', out); document.addEventListener('pointerdown', down);
    return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerout', out); document.removeEventListener('pointerdown', down); };
  }, []);
  return null;
}
