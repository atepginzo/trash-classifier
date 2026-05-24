/**
 * TrashSmart Logo Component
 * Komponen logo yang dapat digunakan di berbagai tempat dengan ukuran yang berbeda
 */

export default function Logo({ size = 40, variant = 'default' }) {
  // Variant colors
  const colors = {
    default: {
      bg: '#1A3A1F',
      body: '#2D5A35',
      stroke: '#7EC892',
      light: '#A8E6B8',
      accent: '#4A9660',
    },
    light: {
      bg: '#2D5A35',
      body: '#2D5A35',
      stroke: '#7EC892',
      light: '#A8E6B8',
      accent: '#4A9660',
    },
  };

  const c = colors[variant] || colors.default;

  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill={c.bg} />

      {/* badan trash can */}
      <rect
        x="20"
        y="30"
        width="32"
        height="26"
        rx="3"
        stroke={c.stroke}
        strokeWidth="1.8"
        fill={c.body}
      />

      {/* garis vertikal sampah */}
      <line
        x1="28"
        y1="34"
        x2="28"
        y2="52"
        stroke={c.light}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.55"
      />
      <line
        x1="36"
        y1="34"
        x2="36"
        y2="52"
        stroke={c.light}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.55"
      />
      <line
        x1="44"
        y1="34"
        x2="44"
        y2="52"
        stroke={c.light}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* scan beam */}
      <line
        x1="20"
        y1="43"
        x2="52"
        y2="43"
        stroke={c.light}
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />

      {/* sensor ring + dot */}
      <circle
        cx="36"
        cy="43"
        r="4.5"
        stroke={c.accent}
        strokeWidth="1"
        fill={c.body}
        opacity="0.9"
      />
      <circle cx="36" cy="43" r="2.5" fill={c.light} />

      {/* lid */}
      <rect
        x="17"
        y="24"
        width="38"
        height="7"
        rx="2.5"
        stroke={c.stroke}
        strokeWidth="1.8"
        fill={c.body}
      />

      {/* handle */}
      <path
        d="M29 24 L29 21 Q29 19 31 19 L41 19 Q43 19 43 21 L43 24"
        stroke={c.stroke}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />

      {/* recycle hint kecil */}
      <path
        d="M36 32 L33 37 L34.5 37"
        stroke={c.stroke}
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path
        d="M33 37 L36 32 L39 37 L37.5 37"
        stroke={c.stroke}
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* sinyal wifi */}
      <path
        d="M50 20 Q54 16.5 58 20"
        stroke={c.light}
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M52 17.5 Q56 13 60 17.5"
        stroke={c.light}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="49.5" cy="22" r="1.4" fill={c.light} />
    </svg>
  );
}
