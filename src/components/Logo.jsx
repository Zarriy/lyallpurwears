// Lyallpurwears logo — the mark is drawn from Lyallpur's (old Faisalabad's)
// Ghanta Ghar plan: eight bazaars radiating from the clock tower.

export function LogoMark({ size = 40, color = 'currentColor', accent = 'var(--gold)' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="24" cy="24" r="21" stroke={color} strokeWidth="1" opacity="0.35" />
      <circle cx="24" cy="24" r="15" stroke={color} strokeWidth="1.4" />
      <circle cx="24" cy="24" r="9.5" stroke={color} strokeWidth="1" />
      {/* Eight bazaars radiating from the clock tower */}
      <path
        d="M24 9v5.5M24 33.5V39M9 24h5.5M33.5 24H39M13.4 13.4l3.9 3.9M30.7 30.7l3.9 3.9M34.6 13.4l-3.9 3.9M17.3 30.7l-3.9 3.9"
        stroke={color}
        strokeWidth="1.4"
      />
      {/* Clock hands — frozen at the golden hour */}
      <path d="M24 24V17.5" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 24l4.6 2.7" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.2" fill={accent} />
    </svg>
  );
}

// Full horizontal lockup — SVG wordmark + mark. Used in the header.
export function Logo({ height = 40, color = 'currentColor', accent = 'var(--gold)' }) {
  return (
    <svg
      height={height}
      viewBox="0 0 268 48"
      fill="none"
      role="img"
      aria-label="Lyallpurwears"
      style={{ display: 'block' }}
    >
      <g transform="translate(0, 0)">
        <circle cx="24" cy="24" r="21" stroke={color} strokeWidth="1" opacity="0.35" />
        <circle cx="24" cy="24" r="15" stroke={color} strokeWidth="1.4" />
        <circle cx="24" cy="24" r="9.5" stroke={color} strokeWidth="1" />
        <path
          d="M24 9v5.5M24 33.5V39M9 24h5.5M33.5 24H39M13.4 13.4l3.9 3.9M30.7 30.7l3.9 3.9M34.6 13.4l-3.9 3.9M17.3 30.7l-3.9 3.9"
          stroke={color}
          strokeWidth="1.4"
        />
        <path d="M24 24V17.5" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M24 24l4.6 2.7" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="24" cy="24" r="2.2" fill={accent} />
      </g>
      <text
        x="58"
        y="29"
        fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
        fontSize="27"
        fontWeight="500"
        letterSpacing="1.5"
        fill={color}
      >
        LYALLPUR
      </text>
      <text
        x="58"
        y="43"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="10"
        letterSpacing="7.5"
        fill={accent}
      >
        W E A R S
      </text>
    </svg>
  );
}

// Stacked lockup — mark above wordmark. Used in the footer / veil.
export function LogoStacked({ width = 180, color = 'currentColor', accent = 'var(--gold)' }) {
  return (
    <svg
      width={width}
      viewBox="0 0 200 118"
      fill="none"
      role="img"
      aria-label="Lyallpurwears"
      style={{ display: 'block' }}
    >
      <g transform="translate(76, 0)">
        <circle cx="24" cy="24" r="21" stroke={color} strokeWidth="1" opacity="0.35" />
        <circle cx="24" cy="24" r="15" stroke={color} strokeWidth="1.4" />
        <circle cx="24" cy="24" r="9.5" stroke={color} strokeWidth="1" />
        <path
          d="M24 9v5.5M24 33.5V39M9 24h5.5M33.5 24H39M13.4 13.4l3.9 3.9M30.7 30.7l3.9 3.9M34.6 13.4l-3.9 3.9M17.3 30.7l-3.9 3.9"
          stroke={color}
          strokeWidth="1.4"
        />
        <path d="M24 24V17.5" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M24 24l4.6 2.7" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="24" cy="24" r="2.2" fill={accent} />
      </g>
      <text
        x="100"
        y="84"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
        fontSize="30"
        fontWeight="500"
        letterSpacing="2"
        fill={color}
      >
        LYALLPUR
      </text>
      <line x1="55" y1="96" x2="145" y2="96" stroke={accent} strokeWidth="1" opacity="0.6" />
      <text
        x="103"
        y="112"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="11"
        letterSpacing="9"
        fill={accent}
      >
        W E A R S
      </text>
    </svg>
  );
}
