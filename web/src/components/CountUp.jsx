'use client';
import { useEffect, useRef, useState } from 'react';

export default function CountUp({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const [v, setV] = useState(to); // server HTML shows the final number, so it is correct without JavaScript
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to 0 after mount; the server HTML keeps the final number for no-JS and SEO
    setV(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => { const k = Math.min(1, (t - t0) / 1500); setV(Math.round(to * (1 - (1 - k) ** 3))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} data-to={to} data-pre={prefix} data-suf={suffix}>{prefix}{v.toLocaleString('en-IN')}{suffix}</span>;
}
