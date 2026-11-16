/* ---------- Illustrations (shown under real images, and if images cannot load) ---------- */
const S = (bg, body) => `<svg class="art" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" font-family="Figtree,sans-serif"><rect width="320" height="200" fill="${bg}"/>${body}</svg>`;
const T = (x, y, t, c = '#0B2D22', s = 14) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="700" fill="${c}">${t}</text>`;
const APP = [
  S('#C8F135', `<circle cx="270" cy="30" r="64" fill="#E7F8A8" opacity=".5"/><rect x="50" y="24" width="140" height="152" rx="16" fill="#fff"/><path d="M72 66c18-18 46-14 56 6-24 8-44 4-56-6z" fill="#C8F135"/><rect x="66" y="96" width="108" height="12" rx="6" fill="#8B5E34"/><rect x="66" y="114" width="108" height="12" rx="6" fill="#B07F4A"/><rect x="66" y="132" width="108" height="12" rx="6" fill="#D9B17E"/><rect x="66" y="152" width="64" height="14" rx="7" fill="#0B2D22"/><circle cx="244" cy="118" r="38" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="13"/><path class="arc" pathLength="100" d="M206 118a38 38 0 0 1 64-28" fill="none" stroke="#FFB800" stroke-width="13" stroke-linecap="round"/>${T(244, 124, 'pH 6.8', '#fff', 15).replace('<text', '<text text-anchor="middle"')}`),
  S('#FFB800', /** @type {[number, number, string][]} */ ([[40, 26, '#0B2D22'], [172, 26, '#0E8F6E'], [40, 104, '#C8F135'], [172, 104, '#FF5A36']]).map(([x, y, c]) => `<rect x="${x}" y="${y}" width="108" height="68" rx="14" fill="#fff"/><rect x="${x + 28}" y="${y + 26}" width="52" height="34" rx="8" fill="${c}"/><path d="M${x + 40} ${y + 26}v-6a14 14 0 0 1 28 0v6" fill="none" stroke="${c}" stroke-width="5"/>`).join('')),
  S('#0E8F6E', `<circle cx="285" cy="30" r="38" fill="#FFB800"/>` + [96, 120, 84, 112, 100].map((h, i) => `<rect class="bk" style="animation-delay:${i * .25}s" x="${58 + i * 36}" y="${138 - h}" width="28" height="${h}" rx="5" fill="${['#FFB800', '#fff', '#C8F135', '#FF5A36', '#FFB800'][i]}"/><rect x="${64 + i * 36}" y="${148 - h}" width="16" height="5" rx="2.5" fill="#0B2D22" opacity=".25"/>`).join('') + `<rect x="40" y="144" width="240" height="6" rx="3" fill="#fff" opacity=".5"/><rect x="90" y="162" width="140" height="26" rx="13" fill="#fff"/>` + T(160, 180, 'Subscribe', '#0E8F6E', 13).replace('<text', '<text text-anchor="middle"')),
  S('#FF5A36', `<circle cx="40" cy="40" r="22" fill="#FFB800"/><circle cx="288" cy="150" r="30" fill="#fff" opacity=".25"/><circle cx="160" cy="92" r="52" fill="#fff"/><path d="M116 62l-8-38 34 24zM204 62l8-38-34 24z" fill="#fff"/><circle cx="142" cy="86" r="6" fill="#0B2D22"/><circle cx="178" cy="86" r="6" fill="#0B2D22"/><path d="M151 104h18l-9 10z" fill="#FF5A36"/><rect x="108" y="158" width="104" height="28" rx="14" fill="#0B2D22"/>` + T(160, 177, 'Adopt me', '#fff', 13).replace('<text', '<text text-anchor="middle"')),
  S('#0B2D22', '<g class="eq">' + Array.from({ length: 26 }, (_, i) => { const h = 16 + Math.abs(Math.sin(i * .7)) * 90; return `<rect x="${24 + i * 10.6}" y="${100 - h / 2}" width="6" height="${h}" rx="3" fill="${i % 3 ? '#FFB800' : '#C8F135'}"/>`; }).join('') + '</g>' + `<circle cx="160" cy="100" r="30" fill="#fff"/><path d="M152 85l24 15-24 15z" fill="#0B2D22"/>`),
  S('#FF9EB5', `<g class="bub"><rect x="36" y="30" width="156" height="40" rx="18" fill="#fff"/>${T(54, 55, '¡Hola! Soy Luna')}</g><g class="bub" style="animation-delay:.7s"><rect x="120" y="84" width="164" height="40" rx="18" fill="#FFB800"/>${T(138, 109, 'Hello, Luna!')}</g><g class="bub" style="animation-delay:1.4s"><rect x="36" y="138" width="130" height="40" rx="18" fill="#fff"/>${T(54, 163, '¿Cómo estás?')}</g>`),
];
const TP = [[80, 52], [240, 52], [70, 150], [250, 150]];
const BLOG = [
  S('#FFB800', `<rect x="143" y="40" width="34" height="64" rx="17" fill="#0B2D22"/><path d="M122 92a38 38 0 0 0 76 0M160 130v26M136 158h48" fill="none" stroke="#0B2D22" stroke-width="7" stroke-linecap="round"/><path class="wv" d="M100 70a70 70 0 0 0 0 40M220 70a70 70 0 0 1 0 40" fill="none" stroke="#0E8F6E" stroke-width="6" stroke-linecap="round"/>`),
  S('#0E8F6E', TP.map(([x, y]) => `<line x1="160" y1="100" x2="${x}" y2="${y}" stroke="#fff" stroke-opacity=".5" stroke-width="4"/>`).join('') + TP.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="18" fill="#fff"/>`).join('') + `<circle class="pulse" cx="160" cy="100" r="28" fill="#FFB800"/>`),
  S('#0B2D22', `<circle cx="270" cy="40" r="22" fill="#FFB800"/><path d="M30 176H290" stroke="#fff" stroke-opacity=".25" stroke-width="3" stroke-dasharray="6 8"/><path class="draw" pathLength="100" d="M30 46L80 62L120 54L170 104L220 120L286 156" fill="none" stroke="#FF5A36" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="286" cy="156" r="14" fill="#FF5A36"/>`),
  S('#C8F135', `<rect x="50" y="54" width="70" height="70" rx="14" fill="#fff"/><rect x="132" y="54" width="70" height="70" rx="14" fill="#0B2D22"/><rect class="hop" x="214" y="30" width="60" height="60" rx="14" fill="#FFB800" transform="rotate(12 244 60)"/><rect x="92" y="136" width="136" height="36" rx="18" fill="#fff"/><circle cx="110" cy="154" r="8" fill="#C8F135"/>`),
  S('#FFE9B0', `<circle cx="262" cy="46" r="24" fill="#FFB800"/><path d="M160 70c-30-24-72 4-58 46 10 30 34 46 58 36 24 10 48-6 58-36 14-42-28-70-58-46z" fill="#FF5A36"/><path d="M160 70c0-20 8-34 26-42-2 20-10 34-26 42z" fill="#C8F135"/>`),
  S('#FF9EB5', `<circle cx="160" cy="104" r="56" fill="#FFB800"/><path class="spin" d="M160 62l11 28 30 3-22 20 7 30-26-16-26 16 7-30-22-20 30-3z" fill="#0B2D22"/><circle cx="52" cy="48" r="10" fill="#fff"/><circle cx="276" cy="150" r="14" fill="#fff" opacity=".6"/><circle cx="270" cy="44" r="6" fill="#fff"/>`),
];
const ic = (d) => `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>', code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-3.9A13 13 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', layers: '<path d="m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
  trend: '<path d="m22 7-8.5 8.5-5-5L2 17M16 7h6v6"/>', cap: '<path d="M22 10 12 5 2 10l10 5zM6 12v5c3 2 9 2 12 0v-5"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1 1.3-1.5 3-1.5s3 .5 3 1.7-1.5 1.5-3 1.8-3 .6-3 1.8 1.3 1.7 3 1.7 3-.5 3-1.5"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>', deck: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 21h8M12 16v5"/>',
};
const COL = ['background:var(--sun);color:var(--forest)', 'background:var(--emerald);color:#fff', 'background:var(--lime);color:var(--forest)', 'background:var(--forest);color:var(--lime)', 'background:var(--coral);color:var(--forest)', 'background:var(--pink);color:var(--forest)'];

export { S, APP, BLOG, ic, I, COL };
export const REEL_ART = `<svg class="art" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><circle cx="690" cy="50" r="140" fill="#FFB800" opacity=".9"/><circle cx="90" cy="290" r="120" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="28"/><rect x="250" y="70" width="300" height="170" rx="20" fill="#fff" opacity=".95"/><circle cx="300" cy="120" r="22" fill="#0E8F6E"/><rect x="340" y="104" width="150" height="12" rx="6" fill="#0B2D22" opacity=".8"/><rect x="340" y="126" width="100" height="9" rx="4" fill="#0B2D22" opacity=".25"/><rect x="280" y="170" width="240" height="46" rx="12" fill="#E8F0DD"/><circle cx="560" cy="200" r="26" fill="#C8F135"/></svg>`;
export const THUMB_ART = `<svg class="art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="320" height="180" fill="#0E8F6E"/><circle cx="270" cy="30" r="70" fill="#FFB800"/><circle cx="40" cy="170" r="60" fill="#FF9EB5"/><path d="M40 120c30-40 60-10 90-40s60-20 90-50" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/></svg>`;

Object.assign(I, {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2-1.2.6-2 2-2 3.8M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8M18 2H6v7a6 6 0 0 0 12 0z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
});

Object.assign(I, {
  send: '<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
});
