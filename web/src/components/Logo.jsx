// Mark: a "T" (crossbar + stem) with an orbiting spark, i.e. an idea in launch trajectory.
export default function Logo({ light = false }) {
  return (
    <span className={`logo-in${light ? ' light' : ''}`}>
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="12" fill={light ? '#C8F135' : '#0B2D22'} />
        <path d="M13 15H27M20 15V29" stroke={light ? '#0B2D22' : '#C8F135'} strokeWidth="5" strokeLinecap="round" fill="none" />
        <g className="orb"><path d="M29 9.3A14 14 0 0 1 34 20" stroke="#FFB800" strokeWidth="2.4" strokeLinecap="round" fill="none" /><circle cx="29" cy="9.3" r="2.9" fill="#FFB800" /></g>
      </svg>
      <span className="wm"><b>Tactyqal</b>{' '}<em>Labs</em></span>
    </span>
  );
}
