// Renders a real Sanity image (responsive srcset + hotspot-aware cropping
// via urlFor) when one is available, and falls back to the site's existing
// generative Placeholder otherwise.
//
// The catalogue ships with ZERO images today, so the fallback path is what
// actually renders everywhere right now — its output must be pixel-identical
// to the old direct <Placeholder> usage it replaces, which is why this
// wraps <Placeholder> rather than reimplementing it.
import { urlFor } from '../sanity/client.js';
import { Placeholder } from './primitives.jsx';

// Denser than a 400/800/1200/1600 ladder so the browser can land near the
// size actually rendered instead of jumping to the next doubling.
const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280, 1600, 2000];

function parseAspect(ratio) {
  const [w, h] = String(ratio).split('/').map(Number);
  return w && h ? w / h : 1;
}

/**
 * @param {object|null|undefined} asset - a raw Sanity image value (has
 *   `.asset` + optional `.hotspot`/`.crop`) — e.g. a normalized product
 *   image's `.asset` field (see src/sanity/normalize.js normalizeImages),
 *   or a review photo straight off the GROQ query. Anything falsy (no
 *   client configured, no image on this doc) renders <Placeholder> instead.
 */
export function SanityImage({
  asset,
  alt = '',
  ratio = '3/4',
  seed,
  label,
  kind,
  style,
  className = '',
  sizes = '(max-width: 720px) 100vw, 50vw',
  widths = DEFAULT_WIDTHS,
  objectFit = 'cover',
}) {
  const builder = asset ? urlFor(asset) : null;

  if (!builder) {
    return (
      <Placeholder ratio={ratio} seed={seed} label={label} kind={kind} style={style} className={className} />
    );
  }

  const aspect = parseAspect(ratio);
  // `contain` shows the whole photo, so the CDN must not pre-crop it to
  // `ratio` first — ask for the natural shape bounded by width instead.
  // Under `cover` the server-side crop is what makes a catalogue of mixed
  // source ratios line up, so it stays.
  // q90 rather than the CDN's default 75: printed lawn is fine repeating
  // detail, which is exactly what a mid-quality encode smears first.
  const build =
    objectFit === 'contain'
      ? (w) => builder.width(w).fit('max').quality(90).auto('format').url()
      : (w) => builder.width(w).height(Math.round(w / aspect)).fit('crop').quality(90).auto('format').url();

  const srcSet = widths.map((w) => `${build(w)} ${w}w`).join(', ');
  // `src` only serves browsers that ignore srcset — pick from the upper half
  // of the ladder so that fallback isn't a thumbnail on a full-width slide.
  const fallbackWidth = widths[Math.min(3, widths.length - 1)];

  return (
    <div className={className} style={{ aspectRatio: ratio, overflow: 'hidden', ...style }}>
      <img
        src={build(fallbackWidth)}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit, display: 'block' }}
      />
    </div>
  );
}
