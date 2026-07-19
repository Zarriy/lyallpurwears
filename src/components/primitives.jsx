// Shared primitives — Reveal, Placeholder, Marquee, TrustStrip
import { useEffect, useRef } from 'react';
import { SmartImage } from './imagery.jsx';

// Reveal-on-scroll hook
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
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

// Trust strip — COD / Returns / etc.
export function TrustStrip() {
  const items = [
    { t: 'Cash on Delivery', s: 'Pay when it arrives' },
    { t: '7-Day Easy Returns', s: 'No questions asked' },
    { t: 'Pakistan-Wide Shipping', s: '2–4 working days' },
    { t: 'Authentic Lawn', s: 'Woven in Lyallpur' },
  ];
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
