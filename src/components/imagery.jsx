// Procedural SVG "photography" placeholders — abstract but evocative.
// Ported from the design prototype (imagery.jsx). Uses brand palette so it
// reads as real imagery at-a-glance until real photos are dropped in.

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i), h |= 0;
  return Math.abs(h);
}

// Seeds come from human labels ("GULAB · FRONT") — spaces and punctuation make
// invalid SVG element IDs, and url(#…) then fails to resolve (paints black).
function idSafe(seed) {
  return String(seed).replace(/[^A-Za-z0-9_-]/g, '') + '-' + hash(String(seed));
}

const PALETTES = [
  { bg: '#E8D5C4', mid: '#C9A88A', fg: '#7B5A42', accent: '#B8924A' },
  { bg: '#D9D7BD', mid: '#A8AC85', fg: '#5C6248', accent: '#8B6F2E' },
  { bg: '#E8D08C', mid: '#C9A04C', fg: '#6B4F1F', accent: '#8B6F2E' },
  { bg: '#E5C9C5', mid: '#C99A95', fg: '#7B4C48', accent: '#B8924A' },
  { bg: '#2A2724', mid: '#5A4F44', fg: '#D4B876', accent: '#B8924A' },
  { bg: '#EDE3CF', mid: '#C9B084', fg: '#6B5436', accent: '#8B6F2E' },
  { bg: '#3D2A38', mid: '#6B4860', fg: '#D4B876', accent: '#B8924A' },
  { bg: '#C8D4C5', mid: '#8FA08A', fg: '#3F4E3D', accent: '#B8924A' },
];

function ImgLabel({ label, light }) {
  if (!label) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 10, left: 10,
      fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.7)', mixBlendMode: light ? 'normal' : 'difference',
    }}>{label}</div>
  );
}

// Abstract model silhouette — woman in shalwar kameez, dupatta flowing
export function ModelSVG({ seed = 'a', label, ratio = '3/4' }) {
  const p = PALETTES[hash(seed) % PALETTES.length];
  const sid = idSafe(seed);
  const variant = hash(seed + 'v') % 3;
  const grain = hash(seed + 'g') % 100;

  return (
    <div style={{ position: 'relative', aspectRatio: ratio, overflow: 'hidden', background: p.bg, width: '100%', height: '100%' }}>
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id={`bg-${sid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.bg} />
            <stop offset="60%" stopColor={p.bg} />
            <stop offset="100%" stopColor={p.mid} stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={`dress-${sid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.fg} stopOpacity="0.92" />
            <stop offset="100%" stopColor={p.fg} stopOpacity="0.78" />
          </linearGradient>
          <linearGradient id={`dupatta-${sid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={p.mid} stopOpacity="0.55" />
            <stop offset="100%" stopColor={p.mid} stopOpacity="0.85" />
          </linearGradient>
          <pattern id={`pat-${sid}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={p.accent} strokeOpacity="0.18" strokeWidth="1" />
          </pattern>
          <radialGradient id={`vig-${sid}`} cx="50%" cy="55%" r="65%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
          </radialGradient>
          <filter id={`grain-${sid}`}>
            <feTurbulence baseFrequency="0.9" numOctaves="2" seed={grain} />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        <rect width="300" height="400" fill={`url(#bg-${sid})`} />
        {variant === 0 && (
          <g opacity="0.18">
            <path d="M30 100 Q30 20 90 20 L210 20 Q270 20 270 100 L270 380 L30 380 Z" fill={p.mid} />
            <line x1="150" y1="20" x2="150" y2="380" stroke={p.fg} strokeOpacity="0.2" strokeWidth="1" />
          </g>
        )}
        {variant === 1 && (
          <g opacity="0.15">
            <rect x="0" y="280" width="300" height="120" fill={p.fg} />
            <line x1="0" y1="280" x2="300" y2="280" stroke={p.accent} strokeWidth="1" />
          </g>
        )}
        {variant === 2 && (
          <g opacity="0.18">
            <circle cx="60" cy="80" r="120" fill={p.mid} />
            <circle cx="240" cy="320" r="100" fill={p.mid} />
          </g>
        )}

        <rect width="300" height="400" fill={`url(#pat-${sid})`} />

        <g>
          <path
            d="M70 90 Q40 130 60 200 Q70 260 50 340 Q90 320 110 270 Q130 200 140 140 Q150 100 130 90 Z"
            fill={`url(#dupatta-${sid})`}
            opacity="0.75"
          />
          <path
            d="M230 90 Q260 130 240 200 Q230 260 250 340 Q210 320 190 270 Q170 200 160 140 Q150 100 170 90 Z"
            fill={`url(#dupatta-${sid})`}
            opacity="0.6"
          />
          <ellipse cx="150" cy="80" rx="22" ry="28" fill={p.fg} opacity="0.85" />
          <path d="M128 75 Q125 60 138 56 Q145 52 162 56 Q175 60 172 75 Q175 95 168 105 L132 105 Q125 95 128 75 Z" fill={p.fg} opacity="0.95" />
          <rect x="142" y="100" width="16" height="14" fill={p.fg} opacity="0.85" />
          <path
            d="M110 115 Q120 110 150 110 Q180 110 190 115 L200 240 Q200 260 195 270 L180 280 L120 280 L105 270 Q100 260 100 240 Z"
            fill={`url(#dress-${sid})`}
          />
          <g opacity="0.4">
            <line x1="120" y1="180" x2="180" y2="180" stroke={p.accent} strokeWidth="0.5" />
            <line x1="115" y1="220" x2="185" y2="220" stroke={p.accent} strokeWidth="0.5" />
            <circle cx="150" cy="150" r="8" fill="none" stroke={p.accent} strokeWidth="0.4" opacity="0.5" />
          </g>
          <path
            d="M120 280 L115 380 L145 380 L150 290 L155 380 L185 380 L180 280 Z"
            fill={p.fg}
            opacity="0.7"
          />
          <line x1="105" y1="276" x2="195" y2="276" stroke={p.accent} strokeWidth="0.8" opacity="0.6" />
        </g>

        <rect width="300" height="400" fill={`url(#vig-${sid})`} />
        <rect width="300" height="400" filter={`url(#grain-${sid})`} opacity="0.5" />
      </svg>
      <ImgLabel label={label} />
    </div>
  );
}

// Flat lay — fabric arrangements
export function FlatLaySVG({ seed = 'b', label, ratio = '3/4' }) {
  const p = PALETTES[hash(seed) % PALETTES.length];
  const sid = idSafe(seed);
  const grain = hash(seed) % 100;
  return (
    <div style={{ position: 'relative', aspectRatio: ratio, overflow: 'hidden', background: p.bg, width: '100%', height: '100%' }}>
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id={`flbg-${sid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={p.bg} />
            <stop offset="100%" stopColor={p.mid} stopOpacity="0.7" />
          </linearGradient>
          <pattern id={`flpat-${sid}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0 L0 10" stroke={p.accent} strokeOpacity="0.18" strokeWidth="0.6" />
          </pattern>
          <pattern id={`flpat2-${sid}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.4" fill={p.accent} fillOpacity="0.25" />
          </pattern>
          <filter id={`flgrain-${sid}`}>
            <feTurbulence baseFrequency="0.85" numOctaves="2" seed={grain} />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <rect width="300" height="400" fill={`url(#flbg-${sid})`} />

        <g transform="translate(40, 90) rotate(-4)">
          <rect width="180" height="120" fill={p.fg} opacity="0.9" />
          <rect width="180" height="120" fill={`url(#flpat-${sid})`} />
          <line x1="0" y1="40" x2="180" y2="40" stroke={p.bg} strokeOpacity="0.5" />
          <line x1="0" y1="80" x2="180" y2="80" stroke={p.bg} strokeOpacity="0.5" />
          <line x1="0" y1="0" x2="180" y2="0" stroke={p.accent} strokeWidth="1.5" opacity="0.7" />
        </g>

        <g transform="translate(80, 200) rotate(6)">
          <path d="M0 0 Q60 -10 140 0 L150 80 Q70 90 -10 80 Z" fill={p.mid} opacity="0.85" />
          <path d="M0 0 Q60 -10 140 0 L150 80 Q70 90 -10 80 Z" fill={`url(#flpat2-${sid})`} />
          <line x1="-5" y1="0" x2="145" y2="0" stroke={p.accent} strokeWidth="1.5" opacity="0.8" />
          <line x1="-5" y1="80" x2="155" y2="80" stroke={p.accent} strokeWidth="1.5" opacity="0.8" />
        </g>

        <circle cx="240" cy="120" r="14" fill="none" stroke={p.accent} strokeWidth="2" opacity="0.7" />
        <circle cx="240" cy="120" r="9" fill="none" stroke={p.accent} strokeWidth="1" opacity="0.5" />

        <g transform="translate(50, 320)" opacity="0.5">
          <path d="M0 0 Q20 -10 40 0 Q50 10 60 5" stroke={p.fg} strokeWidth="1" fill="none" />
          <ellipse cx="20" cy="-4" rx="6" ry="2" fill={p.fg} opacity="0.5" transform="rotate(-20 20 -4)" />
          <ellipse cx="40" cy="0" rx="6" ry="2" fill={p.fg} opacity="0.5" transform="rotate(10 40 0)" />
        </g>

        <rect width="300" height="400" filter={`url(#flgrain-${sid})`} opacity="0.5" />
      </svg>
      <ImgLabel label={label} />
    </div>
  );
}

// Texture / detail — close-up of fabric weave
export function TextureSVG({ seed = 'c', label, ratio = '3/4' }) {
  const p = PALETTES[hash(seed) % PALETTES.length];
  const sid = idSafe(seed);
  return (
    <div style={{ position: 'relative', aspectRatio: ratio, overflow: 'hidden', background: p.fg, width: '100%', height: '100%' }}>
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <pattern id={`weave-${sid}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill={p.bg} opacity="0.3" />
            <rect x="4" y="4" width="4" height="4" fill={p.bg} opacity="0.3" />
            <rect x="4" y="0" width="4" height="4" fill={p.mid} opacity="0.5" />
            <rect x="0" y="4" width="4" height="4" fill={p.mid} opacity="0.5" />
          </pattern>
          <pattern id={`block-${sid}`} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <circle cx="20" cy="20" r="6" fill={p.accent} fillOpacity="0.3" />
            <circle cx="20" cy="20" r="3" fill={p.bg} fillOpacity="0.4" />
            <circle cx="0" cy="0" r="2" fill={p.accent} fillOpacity="0.25" />
            <circle cx="40" cy="40" r="2" fill={p.accent} fillOpacity="0.25" />
          </pattern>
          <radialGradient id={`tvig-${sid}`} cx="50%" cy="50%" r="70%">
            <stop offset="50%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <rect width="300" height="400" fill={p.fg} />
        <rect width="300" height="400" fill={`url(#weave-${sid})`} />
        <rect width="300" height="400" fill={`url(#block-${sid})`} />
        <rect width="300" height="400" fill={`url(#tvig-${sid})`} />
      </svg>
      <ImgLabel label={label} light />
    </div>
  );
}

// Smart picker — chooses an appropriate placeholder based on label hint
export function SmartImage({ seed, label, ratio = '3/4', kind, style, className = '' }) {
  let K = kind;
  if (!K) {
    const l = (label || '').toLowerCase();
    if (l.includes('texture') || l.includes('weave') || l.includes('print')) K = 'texture';
    else if (l.includes('flat') || l.includes('fabric') || l.includes('lay')) K = 'flatlay';
    else K = 'model';
  }
  const Comp = K === 'texture' ? TextureSVG : K === 'flatlay' ? FlatLaySVG : ModelSVG;
  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Comp seed={seed || label || 'x'} label={label} ratio={ratio} />
    </div>
  );
}
