// Shared primitives — Reveal, Placeholder, Figure, Accordion, Marquee, TrustStrip
import { useEffect, useRef, useState } from 'react';
import { SmartImage } from './imagery.jsx';
import { useStore } from '../sanity/useStore.js';

// Reveal-on-scroll hook
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // No IntersectionObserver (old browsers, some test environments) — show
    // the content rather than stranding it at opacity 0 forever.
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      // `threshold` MUST stay 0. It is a fraction of the *target's own* area,
      // so any non-zero value scales with the element's height: this was 0.12,
      // and Collections wraps its entire product grid in one Reveal that runs
      // 2,000px+ tall. Sitting below the hero and filter bar, only ~8% of it
      // was on screen at rest — under the threshold — so the cards stayed
      // invisible until you scrolled a few hundred pixels. Height-independent
      // triggering is the fix; the small negative bottom inset is what keeps
      // the effect, firing once the top edge is properly inside the viewport
      // rather than while it grazes the fold.
      { threshold: 0, rootMargin: '0px 0px -48px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Reveal({ children, stagger, as: As = 'div', className = '', ...rest }) {
  const ref = useReveal();
  return (
    <As ref={ref} className={`${stagger ? 'reveal-stagger' : 'reveal'} ${className}`} {...rest}>
      {children}
    </As>
  );
}

// Placeholder image — renders procedural SVG "photography"
export function Placeholder({ label, dark, ratio = '3/4', style, className = '', kind, seed }) {
  return (
    <div className={className} style={{ aspectRatio: ratio, overflow: 'hidden', ...style }}>
      <SmartImage seed={seed || label || 'x'} label={label} ratio={ratio} kind={kind} />
    </div>
  );
}

// Real photography — the counterpart to Placeholder above. Pages that have
// commissioned imagery use this; Placeholder stays for slots that don't yet.
// `pos` maps to object-position so a subject sitting off-centre survives the
// crop at narrow widths.
export function Figure({ src, alt, ratio = '3/4', pos = 'center', caption, className = '', style, imgStyle }) {
  return (
    <figure className={className} style={{ margin: 0, ...style }}>
      <div style={{ aspectRatio: ratio, overflow: 'hidden', background: 'var(--paper-warm)' }}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, display: 'block', ...imgStyle }}
        />
      </div>
      {caption && (
        <figcaption
          style={{
            marginTop: 12,
            fontFamily: 'var(--mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--track-wide)',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Standard interior-page masthead — kicker, display headline with a gold
// emphasis tail, and an italic lede. Matches the shape Contact.jsx
// established so every secondary page opens the same way.
export function PageHero({ kicker, title, accent, lede, children }) {
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter) 0' }}>
      <Reveal>
        <div className="kicker kicker-gold" style={{ marginBottom: 20 }}>{kicker}</div>
        <h1 className="serif-display" style={{ fontSize: 'var(--display-lg)', marginBottom: 20, maxWidth: 16 * 60 }}>
          {title}
          {accent && (
            <>
              {' '}
              <em style={{ color: 'var(--gold)', fontWeight: 300 }}>{accent}</em>
            </>
          )}
        </h1>
        {lede && (
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 640 }}>
            {lede}
          </p>
        )}
        {children}
      </Reveal>
    </section>
  );
}

// Disclosure list. Lifted out of Contact.jsx when the FAQ and Shipping pages
// needed the same control — `openFirst` keeps Contact's original behaviour of
// showing the first answer, while the longer policy lists start fully closed.
export function Accordion({ items, openFirst = true }) {
  const [open, setOpen] = useState(openFirst ? 0 : -1);
  return (
    <div style={{ borderTop: '1px solid var(--line)' }}>
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            style={{ width: '100%', textAlign: 'left', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}
          >
            <span style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>{it.title}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--gold)', flexShrink: 0 }}>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div style={{ paddingBottom: 28, fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 640 }}>
              {it.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Hover-swap placeholder pair
export function SwapPlaceholder({ frontLabel, backLabel, ratio = '3/4', style }) {
  return (
    <div className="swap-img" style={{ aspectRatio: ratio, position: 'relative', ...style }}>
      <div className="ph-front" style={{ position: 'absolute', inset: 0 }}>
        <Placeholder label={frontLabel} ratio={ratio} />
      </div>
      <div className="ph-back" style={{ position: 'absolute', inset: 0 }}>
        <Placeholder label={backLabel} ratio={ratio} kind="flatlay" />
      </div>
    </div>
  );
}

// Marquee
export function Marquee({ items }) {
  const content = (
    <span>
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 48 }}>
          {it}
          <span className="marquee-dot" />
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}

// Trust strip — COD / Returns / etc. Sourced from siteSettings.trustStripItems
// when configured (see sanity/schemas/siteSettings.js); falls back to the
// original hardcoded set otherwise, so this renders identically before any
// Sanity project is configured or before that field is populated.
const DEFAULT_TRUST_ITEMS = [
  { t: 'Cash on Delivery', s: 'Pay when it arrives' },
  { t: '7-Day Easy Returns', s: 'No questions asked' },
  { t: 'Pakistan-Wide Shipping', s: '2–4 working days' },
  { t: 'Authentic Lawn', s: 'Woven in Lyallpur' },
];

export function TrustStrip() {
  const { settings } = useStore();
  const items = settings?.trustStripItems?.length
    ? settings.trustStripItems.map((i) => ({ t: i.title, s: i.subtitle }))
    : DEFAULT_TRUST_ITEMS;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      {items.map((it, i) => (
        <div key={i} style={{ padding: '28px 24px', borderRight: i < items.length - 1 ? '1px solid var(--line)' : 'none', textAlign: 'center' }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 8 }}>{it.t}</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--ink)' }}>{it.s}</div>
        </div>
      ))}
    </div>
  );
}

export function Stars({ value = 5, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < value ? 'var(--gold)' : 'var(--line)', fontSize: size }}>★</span>
      ))}
    </span>
  );
}
