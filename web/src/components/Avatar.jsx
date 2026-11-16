'use client';
import { useEffect, useRef, useState } from 'react';

export default function Avatar({ src, name, bg }) {
  const list = (Array.isArray(src) ? src : [src]).filter(Boolean);
  const [i, setI] = useState(0);
  const img = useRef(null);
  useEffect(() => { const el = img.current; if (el && el.complete && el.naturalWidth === 0) setI((n) => n + 1); }, [i]);
  const cur = list[i];
  return (
    <span className="av" style={{ background: bg }}>
      {cur ? <img key={cur} ref={img} src={cur} alt="" width="48" height="48" loading="lazy" onError={() => setI((n) => n + 1)} /> : name[0]}
    </span>
  );
}
