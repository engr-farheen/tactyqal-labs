'use client';
import { useState } from 'react';

export default function ShareButton({ title }) {
  const [label, setLabel] = useState('Share');
  const share = async () => {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else { await navigator.clipboard.writeText(url); setLabel('Link copied!'); setTimeout(() => setLabel('Share'), 1800); }
    } catch { /* cancelled */ }
  };
  return <button type="button" className="btn btn-line" onClick={share}><span>{label}</span></button>;
}
