// Shared primitives — Header, Footer, Marquee, Placeholder, hooks
const { useState: useStatePrim, useEffect: useEffectPrim, useRef: useRefPrim } = React;

// Reveal-on-scroll hook
function useReveal() {
  const ref = useRefPrim(null);
  useEffectPrim(() => {
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

function Reveal({ children, stagger, as: As = 'div', className = '', ...rest }) {
  const ref = useReveal();
  return (
    <As ref={ref} className={`${stagger ? 'reveal-stagger' : 'reveal'} ${className}`} {...rest}>
      {children}
    </As>
  );
}

// Placeholder image — now renders procedural SVG "photography" so the
// site looks filled-out at the end. Falls back to striped placeholder if
// SmartImage isn't loaded yet.
function Placeholder({ label, dark, ratio = '3/4', style, children, className = '', kind }) {
  // If children are provided (rare), keep old striped placeholder behavior
  if (children) {
    return (
      <div
        className={`placeholder ${dark ? 'dark' : ''} ${className}`}
        style={{ aspectRatio: ratio, ...style }}
      >
        {children}
        {label && <span className="placeholder-label">{label}</span>}
      </div>
    );
  }
  if (typeof window !== 'undefined' && window.SmartImage) {
    return (
      <div className={className} style={{ aspectRatio: ratio, overflow: 'hidden', ...style }}>
        <window.SmartImage seed={label || 'x'} label={label} ratio={ratio} kind={kind} />
      </div>
    );
  }
  return (
    <div
      className={`placeholder ${dark ? 'dark' : ''} ${className}`}
      style={{ aspectRatio: ratio, ...style }}
    >
      {label && <span className="placeholder-label">{label}</span>}
    </div>
  );
}

// Hover-swap placeholder pair
function SwapPlaceholder({ frontLabel, backLabel, dark, ratio = '3/4', style }) {
  return (
    <div className="swap-img" style={{ aspectRatio: ratio, position: 'relative', ...style }}>
      <div className="ph-front" style={{ position: 'absolute', inset: 0 }}>
        <Placeholder label={frontLabel} ratio={ratio} dark={dark} />
      </div>
      <div className="ph-back" style={{ position: 'absolute', inset: 0 }}>
        <Placeholder label={backLabel} ratio={ratio} dark={dark} kind="flatlay" />
      </div>
    </div>
  );
}

// Marquee
function Marquee({ items }) {
  const content = (
    <span>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {it}
          <span className="marquee-dot" />
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div className="marquee" role="marquee">
      <div className="marquee-track">
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}

// Header
function Header({ onNav, current = 'home' }) {
  return (
    <>
      <div className="topbar">
        <div>
          <span className="topbar-pill">COD</span>
          Cash on Delivery available across Pakistan
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>Free shipping over Rs. 5,000</span>
          <span>Track order</span>
          <span>EN / اردو</span>
        </div>
      </div>
      <header className="header">
        <nav className="header-nav">
          <a onClick={() => onNav && onNav('shop')}>Shop</a>
          <a onClick={() => onNav && onNav('lawn')}>Lawn <span className="urdu" style={{ marginLeft: 4, color: 'var(--gold)' }}>لان</span></a>
          <a onClick={() => onNav && onNav('khaddar')}>Khaddar</a>
          <a onClick={() => onNav && onNav('linen')}>Linen</a>
          <a onClick={() => onNav && onNav('lookbook')}>Lookbook</a>
        </nav>
        <a className="header-logo" onClick={() => onNav && onNav('home')}>
          NOOR <span className="ampersand">&amp;</span> CO
        </a>
        <div className="header-actions">
          <button className="icon-btn" title="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button className="icon-btn" title="Account">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </button>
          <button className="icon-btn" title="Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button className="icon-btn" title="Cart" style={{ position: 'relative' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="cart-count" style={{ position: 'absolute', top: -4, right: -4 }}>2</span>
          </button>
        </div>
      </header>
    </>
  );
}

// Footer
function Footer() {
  const cols = [
    { title: 'Shop', items: ['Lawn Collection', 'Khaddar', 'Linen', 'Pret Edit', 'Sale'] },
    { title: 'Help', items: ['Track Order', 'Shipping & Returns', 'Size Guide', 'FAQ', 'Contact'] },
    { title: 'About', items: ['Our Story', 'Craftsmanship', 'Sustainability', 'Press', 'Careers'] },
  ];
  return (
    <footer className="footer">
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1.2fr', gap: 48, paddingBottom: 64, borderBottom: '1px solid rgba(250,250,247,0.12)' }}>
        <div>
          <div className="serif-display" style={{ fontSize: 36, marginBottom: 20 }}>
            Noor <span style={{ color: 'var(--gold-soft)', fontStyle: 'italic' }}>&amp;</span> Co
          </div>
          <p style={{ color: 'rgba(250,250,247,0.6)', fontSize: 13, lineHeight: 1.7, maxWidth: 300, marginBottom: 24 }}>
            Heritage textiles, woven with intention. Crafted in Lahore for women who carry tradition forward.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {['IG', 'FB', 'TT', 'YT'].map((s) => (
              <a key={s} style={{ width: 32, height: 32, border: '1px solid rgba(250,250,247,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 10 }}>
                {s}
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 18 }}>{c.title}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              {c.items.map((i) => <li key={i}><a>{i}</a></li>)}
            </ul>
          </div>
        ))}
        <div>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 18 }}>The Letter</div>
          <p style={{ color: 'rgba(250,250,247,0.6)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            New drops, private previews and Rs. 500 off your first order.
          </p>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(250,250,247,0.3)' }}>
            <input
              type="email"
              placeholder="Email address"
              style={{ flex: 1, background: 'transparent', border: 0, color: 'var(--paper)', padding: '10px 0', fontFamily: 'var(--sans)', fontSize: 13, outline: 'none' }}
            />
            <button style={{ color: 'var(--gold-soft)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Join →</button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 24, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.5)' }}>
        <span>© 2026 Noor &amp; Co · Lahore, Pakistan</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a>Privacy</a><a>Terms</a><a>Returns</a>
        </span>
      </div>
    </footer>
  );
}

// Trust strip — COD / Returns / etc.
function TrustStrip() {
  const items = [
    { t: 'Cash on Delivery', s: 'Pay when it arrives' },
    { t: '7-Day Easy Returns', s: 'No questions asked' },
    { t: 'Pakistan-Wide Shipping', s: '2–4 working days' },
    { t: 'Authentic Lawn', s: 'Crafted in Lahore' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      {items.map((it, i) => (
        <div key={i} style={{ padding: '28px 24px', borderRight: i < 3 ? '1px solid var(--line)' : 'none', textAlign: 'center' }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 8 }}>{it.t}</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--ink)' }}>{it.s}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  useReveal, Reveal, Placeholder, SwapPlaceholder, Marquee, Header, Footer, TrustStrip
});
