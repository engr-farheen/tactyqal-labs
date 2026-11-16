'use client';
import { useEffect, useRef } from 'react';

// Sets --mx/--my (-1..1) on the hero; the CSS turns them into a gentle parallax on the app windows.
export default function Parallax({ className, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!matchMedia('(hover:hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e) => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5) * 2); el.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5) * 2); };
    const leave = () => { el.style.setProperty('--mx', 0); el.style.setProperty('--my', 0); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, []);
  return <section ref={ref} className={className}>{children}</section>;
}
