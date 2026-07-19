// Homepage — luxe Pakistani lawn store

function Hero() {
  const [scrollY, setScrollY] = React.useState(0);
  React.useEffect(() => {
    const onScroll = (e) => {
      const root = e.target.scrollingElement || document.documentElement;
      setScrollY(root.scrollTop || window.scrollY || 0);
    };
    // The artboard scroll happens inside the artboard root if scrollable; fallback to window
    const target = document.querySelector('.frame');
    if (target) target.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (target) target.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section style={{ position: 'relative', height: 760, overflow: 'hidden', background: 'var(--paper-warm)' }}>
      {/* Background placeholder w/ ken-burns */}
      <div className="kenburns" style={{ position: 'absolute', inset: 0 }}>
        <Placeholder
          dark
          ratio="auto"
          style={{ position: 'absolute', inset: 0, height: '100%' }}
          label="HERO · MODEL IN IVORY LAWN · LAHORE COURTYARD"
        />
      </div>

      {/* Edge frame */}
      <div style={{
        position: 'absolute', inset: 24, border: '1px solid rgba(250,250,247,0.25)',
        pointerEvents: 'none', zIndex: 2
      }} />

      {/* Top label + counter */}
      <div style={{
        position: 'absolute', top: 56, left: 56, right: 56, zIndex: 3,
        display: 'flex', justifyContent: 'space-between', color: 'var(--paper)',
        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        transform: `translateY(${scrollY * -0.15}px)`
      }}>
        <span>Spring/Summer · Vol. 04</span>
        <span>01 / 06</span>
      </div>

      {/* Main copy */}
      <div style={{
        position: 'absolute',
        bottom: 96, left: 56,
        zIndex: 3,
        color: 'var(--paper)',
        maxWidth: 720,
        transform: `translateY(${scrollY * -0.25}px)`
      }}>
        <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>
          New Arrival · Lawn '26
        </div>
        <h1 className="serif-display" style={{ fontSize: 'clamp(72px, 9vw, 132px)', marginBottom: 20 }}>
          The Mehfil<br />
          <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>Edit.</em>
        </h1>
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'rgba(250,250,247,0.85)', maxWidth: 480, marginBottom: 36, lineHeight: 1.4 }}>
          Hand-block prints on featherweight lawn — woven for warm afternoons and cooler evenings.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <a className="btn btn-gold">
            Shop the Edit
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5h12m0 0L9 1m4 4L9 9" /></svg>
          </a>
          <a className="btn btn-outline" style={{ borderColor: 'rgba(250,250,247,0.5)', color: 'var(--paper)' }}>
            View Lookbook
          </a>
        </div>
      </div>

      {/* Right meta column */}
      <div style={{
        position: 'absolute', right: 56, bottom: 96, zIndex: 3,
        color: 'var(--paper)',
        textAlign: 'right',
        transform: `translateY(${scrollY * -0.18}px)`
      }}>
        <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 14 }}>Featured Piece</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 28, marginBottom: 6 }}>Gulab — 3 Piece</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--gold-soft)' }}>RS. 8,490</div>
        <div style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'rgba(250,250,247,0.7)' }}>
          ONLY 6 LEFT IN STOCK
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 3, color: 'var(--paper)',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
      }}>
        <span>SCROLL</span>
        <div style={{ width: 1, height: 36, background: 'rgba(250,250,247,0.5)' }} />
      </div>
    </section>
  );
}

function CategoryGrid() {
  const cats = [
    { en: 'Lawn', ur: 'لان', count: '142 pieces', tag: 'Featherweight cotton' },
    { en: 'Khaddar', ur: 'کھدر', count: '68 pieces', tag: 'Hand-loomed' },
    { en: 'Linen', ur: 'لینن', count: '54 pieces', tag: 'European weave' },
    { en: 'Dupatta', ur: 'دوپٹہ', count: '88 pieces', tag: 'The finishing touch' },
  ];
  return (
    <section style={{ padding: '120px 56px' }}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64 }}>
          <div>
            <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Shop by Fabric</div>
            <h2 className="serif-display" style={{ fontSize: 'clamp(48px, 5vw, 80px)' }}>
              Four threads,<br />
              <em style={{ color: 'var(--gold)', fontWeight: 300 }}>infinite stories.</em>
            </h2>
          </div>
          <a style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 4 }}>
            View all categories →
          </a>
        </div>
      </Reveal>

      <Reveal stagger>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {cats.map((c, i) => (
            <a key={c.en} className="swap-img" style={{ display: 'block', position: 'relative', cursor: 'pointer' }}>
              <Placeholder
                ratio="3/4"
                label={`${c.en.toUpperCase()} · CATEGORY`}
                className="ph-front"
                style={{ position: 'absolute', inset: 0 }}
              />
              <Placeholder
                dark
                ratio="3/4"
                label={`${c.en.toUpperCase()} · DETAIL`}
                className="ph-back"
                style={{ position: 'absolute', inset: 0 }}
              />
              <div style={{ aspectRatio: '3/4' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, color: 'var(--paper)', mixBlendMode: 'difference' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <h3 className="serif-display" style={{ fontSize: 38, color: 'var(--paper)' }}>
                    {c.en}
                  </h3>
                  <span className="urdu" style={{ fontSize: 22, color: 'var(--gold-soft)' }}>{c.ur}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.85)' }}>
                  <span>{c.count}</span>
                  <span>0{i + 1}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function FeaturedProduct() {
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '120px 56px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'center' }}>
        <Reveal>
          <Placeholder dark label="EDITORIAL · LOOKBOOK SHOT 1" ratio="4/5" />
        </Reveal>
        <Reveal>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>The Story · 03</div>
          <h2 className="serif-display" style={{ fontSize: 'clamp(48px, 5vw, 76px)', color: 'var(--paper)', marginBottom: 24 }}>
            Threads <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>that remember.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.78)', marginBottom: 32, maxWidth: 480 }}>
            Each piece in the Mehfil edit begins on a hand-loom in Faisalabad and finishes under a block-printer's mallet in Multan. Slow craft for clothes you'll keep.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginBottom: 40, paddingTop: 32, borderTop: '1px solid rgba(250,250,247,0.12)' }}>
            <div>
              <div className="figure-stat" style={{ color: 'var(--gold-soft)' }}>14</div>
              <div className="kicker" style={{ marginTop: 8 }}>Master Artisans</div>
            </div>
            <div>
              <div className="figure-stat" style={{ color: 'var(--gold-soft)' }}>72hr</div>
              <div className="kicker" style={{ marginTop: 8 }}>Per Block Print</div>
            </div>
            <div>
              <div className="figure-stat" style={{ color: 'var(--gold-soft)' }}>0</div>
              <div className="kicker" style={{ marginTop: 8 }}>Synthetic Dye</div>
            </div>
          </div>
          <a className="btn btn-gold">Read the Journal →</a>
        </Reveal>
      </div>
    </section>
  );
}

// Product card variants
function ProductCard({ product, variant = 'editorial' }) {
  const { name, urdu, price, oldPrice, stock, badge, discount } = product;

  if (variant === 'minimal') {
    return (
      <a className="swap-img" style={{ display: 'block', position: 'relative', cursor: 'pointer' }}>
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          <Placeholder ratio="3/4" label={`${name.toUpperCase()} · FRONT`} className="ph-front" style={{ position: 'absolute', inset: 0 }} />
          <Placeholder dark ratio="3/4" label={`${name.toUpperCase()} · DETAIL`} className="ph-back" style={{ position: 'absolute', inset: 0 }} />
          {badge && <span className="badge badge-ink" style={{ position: 'absolute', top: 14, left: 14 }}>{badge}</span>}
        </div>
        <div style={{ paddingTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <h4 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400 }}>{name}</h4>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--gold)' }}>Rs. {price}</span>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            3 Piece Unstitched
          </div>
        </div>
      </a>
    );
  }

  if (variant === 'card') {
    return (
      <a className="swap-img" style={{ display: 'block', position: 'relative', cursor: 'pointer', border: '1px solid var(--line)', background: 'var(--paper)', transition: 'border-color 0.4s var(--ease), transform 0.4s var(--ease)' }}
         onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
         onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          <Placeholder ratio="3/4" label={`${name.toUpperCase()}`} className="ph-front" style={{ position: 'absolute', inset: 0 }} />
          <Placeholder dark ratio="3/4" label={`${name.toUpperCase()} · DETAIL`} className="ph-back" style={{ position: 'absolute', inset: 0 }} />
          {discount && <span className="badge badge-gold" style={{ position: 'absolute', top: 14, left: 14, background: 'var(--gold)', color: 'var(--paper)', borderColor: 'var(--gold)' }}>−{discount}%</span>}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: 'linear-gradient(to top, rgba(10,10,10,0.5), transparent)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="icon-btn" style={{ background: 'var(--paper)', border: '1px solid var(--paper)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
        <div style={{ padding: 18 }}>
          <h4 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{name}</h4>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
            3 Piece Lawn · Unstitched
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>Rs. {price}</span>
              {oldPrice && <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textDecoration: 'line-through' }}>Rs. {oldPrice}</span>}
            </div>
            {stock <= 5 && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-deep)' }}>
                Only {stock} left
              </span>
            )}
          </div>
        </div>
      </a>
    );
  }

  // Editorial — most premium look
  return (
    <a className="swap-img" style={{ display: 'block', position: 'relative', cursor: 'pointer' }}>
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
        <Placeholder ratio="3/4" label={`${name.toUpperCase()} · FRONT`} className="ph-front" style={{ position: 'absolute', inset: 0 }} />
        <Placeholder dark ratio="3/4" label={`${name.toUpperCase()} · BACK`} className="ph-back" style={{ position: 'absolute', inset: 0 }} />

        {/* Numbered ribbon */}
        <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--paper)', mixBlendMode: 'difference' }}>
          № {String(product.id).padStart(2, '0')}
        </div>
        {badge && (
          <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--gold)', color: 'var(--paper)', padding: '4px 10px', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {badge}
          </div>
        )}

        {/* Quick add overlay */}
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, opacity: 0, transform: 'translateY(8px)', transition: 'all 0.4s var(--ease)', pointerEvents: 'none' }} className="qadd">
          <button style={{ width: '100%', padding: '12px', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', border: 0 }}>
            + Quick Add
          </button>
        </div>
      </div>
      <div style={{ paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, marginBottom: 2 }}>
            {name} {urdu && <span className="urdu" style={{ fontSize: 14, color: 'var(--gold)', marginLeft: 4 }}>{urdu}</span>}
          </h4>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {product.fabric || '3 Piece Lawn'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 500 }}>Rs. {price}</div>
          {oldPrice && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textDecoration: 'line-through' }}>Rs. {oldPrice}</div>
          )}
        </div>
      </div>
      {stock <= 5 && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-deep)' }}>
            Only {stock} pieces remain
          </span>
        </div>
      )}
      <style>{`
        .swap-img:hover .qadd { opacity: 1; transform: translateY(0); pointer-events: auto; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </a>
  );
}

function ProductGrid({ cardVariant = 'editorial' }) {
  const products = [
    { id: 1, name: 'Gulab', urdu: 'گلاب', price: '8,490', oldPrice: null, stock: 6, badge: 'New', fabric: '3 Piece Lawn' },
    { id: 2, name: 'Mehrunissa', urdu: null, price: '9,290', oldPrice: '11,500', stock: 3, discount: 19, fabric: '3 Piece Lawn' },
    { id: 3, name: 'Yasmin', urdu: 'یاسمین', price: '7,990', oldPrice: null, stock: 12, fabric: '2 Piece Lawn' },
    { id: 4, name: 'Saba', urdu: null, price: '10,490', oldPrice: null, stock: 4, badge: 'Limited', fabric: '3 Piece Khaddar' },
    { id: 5, name: 'Roshni', urdu: 'روشنی', price: '6,790', oldPrice: '8,500', stock: 2, discount: 20, fabric: '2 Piece Lawn' },
    { id: 6, name: 'Anaya', urdu: null, price: '11,790', oldPrice: null, stock: 8, badge: 'New', fabric: '3 Piece Linen' },
    { id: 7, name: 'Khushbu', urdu: 'خوشبو', price: '7,290', oldPrice: null, stock: 14, fabric: '2 Piece Lawn' },
    { id: 8, name: 'Mahnoor', urdu: null, price: '12,990', oldPrice: null, stock: 5, fabric: '3 Piece Linen' },
  ];
  return (
    <section style={{ padding: '120px 56px' }}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
          <div>
            <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>The Edit · Spring '26</div>
            <h2 className="serif-display" style={{ fontSize: 'clamp(48px, 5vw, 76px)' }}>
              Most loved <em style={{ color: 'var(--gold)', fontWeight: 300 }}>this week.</em>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            <button style={{ padding: '8px 14px', borderBottom: '1px solid var(--ink)' }}>All</button>
            <button style={{ padding: '8px 14px', color: 'var(--muted)' }}>Lawn</button>
            <button style={{ padding: '8px 14px', color: 'var(--muted)' }}>Khaddar</button>
            <button style={{ padding: '8px 14px', color: 'var(--muted)' }}>Linen</button>
          </div>
        </div>
      </Reveal>
      <Reveal stagger>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, columnGap: 28, rowGap: 56 }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} variant={cardVariant} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Lookbook() {
  return (
    <section style={{ padding: '0 56px 120px', overflow: 'hidden' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Lookbook · The Mehfil</div>
          <h2 className="serif-display" style={{ fontSize: 'clamp(56px, 6vw, 96px)' }}>
            Worn <em style={{ color: 'var(--gold)', fontWeight: 300 }}>in motion.</em>
          </h2>
        </div>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <Reveal className="" style={{ gridColumn: 'span 5', gridRow: 'span 2' }}>
          <Placeholder ratio="3/4" label="LOOKBOOK · 01 · COURTYARD" />
        </Reveal>
        <Reveal style={{ gridColumn: 'span 4' }}>
          <Placeholder ratio="4/3" label="LOOKBOOK · 02 · DETAIL" />
        </Reveal>
        <Reveal style={{ gridColumn: 'span 3' }}>
          <Placeholder dark ratio="4/3" label="LOOKBOOK · 03 · GOLDEN HOUR" />
        </Reveal>
        <Reveal style={{ gridColumn: 'span 3' }}>
          <Placeholder ratio="3/4" label="LOOKBOOK · 04 · TEXTILE" />
        </Reveal>
        <Reveal style={{ gridColumn: 'span 4' }}>
          <Placeholder ratio="3/4" label="LOOKBOOK · 05 · PORTRAIT" />
        </Reveal>
      </div>
      <Reveal>
        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <a className="btn btn-outline">View Full Lookbook →</a>
        </div>
      </Reveal>
    </section>
  );
}

function ReviewsBlock() {
  const reviews = [
    {
      name: 'Sarah K.', city: 'Karachi', rating: 5,
      text: 'The lawn is unbelievably soft. I ordered the Gulab in dusty rose — the print is even better in person. Stitched perfectly within a week.',
      verified: true, photos: 2,
    },
    {
      name: 'Hina A.', city: 'Lahore', rating: 5,
      text: 'COD made it so easy to try a new brand. The dupatta alone is worth the price. Will be ordering again for Eid.',
      verified: true, photos: 1,
    },
    {
      name: 'Faiza R.', city: 'Islamabad', rating: 4,
      text: 'Beautiful packaging, beautiful fabric. Took an extra day to arrive but customer service kept me updated on WhatsApp.',
      verified: true, photos: 0,
    },
  ];
  return (
    <section style={{ background: 'var(--paper-warm)', padding: '120px 56px' }}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
          <div>
            <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>The Verdict</div>
            <h2 className="serif-display" style={{ fontSize: 'clamp(48px, 5vw, 76px)' }}>
              4.9 <em style={{ color: 'var(--gold)', fontWeight: 300, fontStyle: 'italic' }}>/ 5</em>
              <span style={{ fontSize: '0.4em', color: 'var(--muted)', marginLeft: 16, fontStyle: 'normal', fontWeight: 400 }}>
                from 2,400+ reviews
              </span>
            </h2>
          </div>
          <a style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 4 }}>
            Read all reviews →
          </a>
        </div>
      </Reveal>
      <Reveal stagger>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: 'var(--paper)', padding: 32, border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} style={{ color: idx < r.rating ? 'var(--gold)' : 'var(--line)', fontSize: 16 }}>★</span>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.5, fontStyle: 'italic', marginBottom: 24, color: 'var(--ink)' }}>
                "{r.text}"
              </p>
              {r.photos > 0 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {Array.from({ length: r.photos }).map((_, idx) => (
                    <Placeholder key={idx} ratio="1/1" label="PHOTO" style={{ width: 56, height: 56 }} />
                  ))}
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 16 }}>{r.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    {r.city}
                  </div>
                </div>
                {r.verified && (
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    ✓ Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Newsletter() {
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '120px 56px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>Become a Patron</div>
          <h2 className="serif-display" style={{ fontSize: 'clamp(48px, 6vw, 88px)', color: 'var(--paper)', marginBottom: 24 }}>
            Rs. 500 off<br />
            <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>your first letter.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.5, color: 'rgba(250,250,247,0.7)', maxWidth: 460 }}>
            Join our list for early access to new collections, private sales and a Rs. 500 voucher delivered to your inbox today.
          </p>
        </Reveal>
        <Reveal>
          <div style={{ background: 'rgba(250,250,247,0.04)', padding: 40, border: '1px solid rgba(184,146,74,0.3)' }}>
            <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>Sign up · No spam</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input placeholder="Full name" style={{ padding: '14px 0', background: 'transparent', border: 0, borderBottom: '1px solid rgba(250,250,247,0.3)', color: 'var(--paper)', fontFamily: 'var(--sans)', fontSize: 14, outline: 'none' }} />
              <input placeholder="Email address" style={{ padding: '14px 0', background: 'transparent', border: 0, borderBottom: '1px solid rgba(250,250,247,0.3)', color: 'var(--paper)', fontFamily: 'var(--sans)', fontSize: 14, outline: 'none' }} />
              <input placeholder="WhatsApp (optional)" style={{ padding: '14px 0', background: 'transparent', border: 0, borderBottom: '1px solid rgba(250,250,247,0.3)', color: 'var(--paper)', fontFamily: 'var(--sans)', fontSize: 14, outline: 'none' }} />
              <button className="btn btn-gold" style={{ marginTop: 16 }}>Claim Rs. 500 Voucher →</button>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.4)', textAlign: 'center', marginTop: 8 }}>
                Unsubscribe anytime · Voucher valid 30 days
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HomePage({ cardVariant = 'editorial', onNav }) {
  return (
    <div className="frame">
      <Header onNav={onNav} current="home" />
      <Hero />
      <Marquee items={[
        'COD AVAILABLE NATIONWIDE',
        'FREE SHIPPING OVER RS. 5,000',
        'NEW DROP — MEHFIL EDIT',
        '7-DAY EASY RETURNS',
        'CRAFTED IN LAHORE',
        'WHATSAPP +92 300 1234567',
      ]} />
      <CategoryGrid />
      <FeaturedProduct />
      <ProductGrid cardVariant={cardVariant} />
      <Lookbook />
      <ReviewsBlock />
      <TrustStrip />
      <Newsletter />
      <Footer />
    </div>
  );
}

Object.assign(window, { HomePage, ProductCard, Hero, CategoryGrid, ProductGrid, Lookbook, ReviewsBlock, Newsletter });
