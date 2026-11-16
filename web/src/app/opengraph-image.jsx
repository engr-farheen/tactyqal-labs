import { ImageResponse } from 'next/og';
export const alt = 'Tactyqal Labs: real apps, built by teenagers, live in 8 weeks';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0B2D22', padding: 72, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: '#C8F135', color: '#0B2D22', fontSize: 44, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>T</div>
          <div style={{ fontSize: 38, fontWeight: 800 }}>Tactyqal Labs</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 88, fontWeight: 800, lineHeight: 1.02 }}>
          <div style={{ display: 'flex' }}>Real apps. Built by teenagers.</div>
          <div style={{ display: 'flex', color: '#C8F135' }}>Live in 8 weeks.</div>
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#FFB800' }}>1:1 mentoring · No coding experience needed</div>
      </div>
    ),
    size,
  );
}
