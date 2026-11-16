'use client';
import { useEffect, useRef, useState } from 'react';

export default function Reel({ src }) {
  const v = useRef(null);
  const [ok, setOk] = useState(true);
  useEffect(() => {
    if (!v.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => { e.isIntersecting ? v.current?.play().catch(() => {}) : v.current?.pause(); }, { threshold: 0.3 });
    io.observe(v.current);
    return () => io.disconnect();
  }, [ok]);
  return ok ? <video ref={v} src={src} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} onError={() => setOk(false)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null;
}
