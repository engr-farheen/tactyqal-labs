'use client';
import { useEffect, useRef, useState } from 'react';

// Illustration underneath, real image on top. `src` can be a list ordered best-first
// (for example the original HD file, then a local copy); the next one is tried if a source fails.
export default function Media({ art, src, alt = '', className = '' }) {
  const list = (Array.isArray(src) ? src : [src]).filter(Boolean);
  const [i, setI] = useState(0);
  const img = useRef(null);
  const next = () => setI((n) => n + 1);
  useEffect(() => { const el = img.current; if (el && el.complete && el.naturalWidth === 0) setI((n) => n + 1); }, [i]); // error fired before hydration
  const cur = list[i];
  return (
    <div className={`media ${className}`}>
      <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: art }} />
      {cur && <img key={cur} ref={img} src={cur} alt={alt} loading="lazy" decoding="async" onError={next}
        onLoad={(e) => { if (/ytimg/.test(cur) && e.currentTarget.naturalWidth <= 120) next(); }} />}
    </div>
  );
}
