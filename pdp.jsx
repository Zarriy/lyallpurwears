// Product Detail page — 3 layout variations
const useStatePDP = React.useState;

function Stars({ value = 5, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < value ? 'var(--gold)' : 'var(--line)', fontSize: size }}>★</span>
      ))}
    </span>
  );
}

function PDPThumbStrip({ vertical }) {
  const labels = ['FRONT', 'BACK', 'DETAIL', 'TEXTILE', 'STYLED'];
  const [active, setActive] = useStatePDP(0);
  return (
    <div style={{
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      gap: 10,
    }}>
      {labels.map((l, i) => (
        <button
          key={l}
          onClick={() => setActive(i)}
          style={{
            border: i === active ? '1.5px solid var(--gold)' : '1px solid var(--line)',
            padding: 0,
            cursor: 'pointer',
            transition: 'border-color 0.3s var(--ease)',
            width: vertical ? 64 : 'auto',
            flex: vertical ? '0 0 auto' : 1,
          }}
        >
          <Placeholder ratio="3/4" label={l} style={{ height: vertical ? 80 : 'auto' }} />
        </button>
      ))}
    </div>
  );
}

function ColorSwatches() {
  const colors = [
    { name: 'Ivory Rose', hex: '#F0E0D8', selected: true },
    { name: 'Sage', hex: '#B5BFA1' },
    { name: 'Saffron', hex: '#D4A04C' },
    { name: 'Charcoal', hex: '#3A3A3A' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="kicker">Colour</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink)' }}>
          {colors.find(c => c.selected)?.name}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {colors.map((c) => (
          <button key={c.name} title={c.name} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: c.hex,
            border: c.selected ? '1.5px solid var(--gold)' : '1px solid var(--line)',
            outline: c.selected ? '3px solid var(--paper)' : 'none',
            outlineOffset: -5,
            cursor: 'pointer',
          }} />
        ))}
      </div>
    </div>
  );
}

function SizeSelector() {
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const [active, setActive] = useStatePDP('M');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="kicker">Size · Stitched</span>
        <button style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', color: 'var(--ink)' }}>
          Size guide ↗
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {sizes.map((s) => (
          <button key={s} onClick={() => setActive(s)}
            style={{
              width: 52, height: 52,
              border: active === s ? '1.5px solid var(--ink)' : '1px solid var(--line)',
              background: active === s ? 'var(--ink)' : 'var(--paper)',
              color: active === s ? 'var(--paper)' : 'var(--ink)',
              fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.1em',
              cursor: 'pointer', transition: 'all 0.3s var(--ease)',
            }}>
            {s}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        Or order unstitched · Save Rs. 1,200
      </div>
    </div>
  );
}

function QtyAdd({ stock = 3 }) {
  const [qty, setQty] = useStatePDP(1);
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--ink)', height: 56 }}>
        <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 48, height: '100%', fontFamily: 'var(--mono)' }}>−</button>
        <span style={{ width: 36, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 13 }}>{qty}</span>
        <button onClick={() => setQty(Math.min(stock, qty + 1))} style={{ width: 48, height: '100%', fontFamily: 'var(--mono)' }}>+</button>
      </div>
      <button className="btn btn-gold" style={{ flex: 1, height: 56, padding: '0 32px' }}>
        Add to Bag · Rs. 8,490
      </button>
    </div>
  );
}

function StockUrgency({ stock = 3 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px',
      background: 'rgba(184, 146, 74, 0.08)',
      border: '1px solid rgba(184, 146, 74, 0.3)',
      marginBottom: 32,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 2s ease infinite', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-deep)', fontWeight: 500 }}>
          Only {stock} pieces left
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 14, fontStyle: 'italic', color: 'var(--ink)', marginTop: 2 }}>
          14 people viewing this in the last hour
        </div>
      </div>
    </div>
  );
}

function ShippingPanel() {
  return (
    <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24, marginTop: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--gold)', color: 'var(--paper)', padding: '4px 8px', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', fontWeight: 500 }}>
            COD
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>Cash on Delivery</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Pay when it arrives</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 28, height: 28, border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 16h6v-6M2 8h20M2 8v8a2 2 0 002 2h6m4-10v0M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>Free shipping</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Orders over Rs. 5,000</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 28, height: 28, border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12a9 9 0 109-9M3 12V3m0 9h9"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>7-Day Returns</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>No questions asked</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 28, height: 28, border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>Authentic Lawn</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Crafted in Lahore</div>
          </div>
        </div>
      </div>
      <div style={{ background: 'var(--paper-warm)', padding: 14, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', color: 'var(--ink)' }}>
        Order in 4hrs 22min · Delivery by Mon, May 4
      </div>
    </div>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useStatePDP(0);
  return (
    <div style={{ borderTop: '1px solid var(--line)', marginTop: 32 }}>
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
          <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', textAlign: 'left', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{it.title}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 14 }}>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div style={{ paddingBottom: 24, fontFamily: 'var(--serif)', fontSize: 16, lineHeight: 1.6, color: 'var(--muted)' }}>
              {it.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ===== Layout 1: Editorial — large image, sticky info column =====
function PDPEditorial() {
  return (
    <div style={{ padding: '40px 56px 120px' }}>
      {/* Breadcrumb */}
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 32, display: 'flex', gap: 8 }}>
        <span>Home</span><span>/</span><span>Lawn</span><span>/</span><span>Spring '26</span><span>/</span><span style={{ color: 'var(--ink)' }}>Gulab</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr 460px', gap: 32, alignItems: 'flex-start' }}>
        {/* Vertical thumbs */}
        <div style={{ position: 'sticky', top: 120 }}>
          <PDPThumbStrip vertical />
        </div>

        {/* Hero image */}
        <div>
          <div style={{ position: 'relative' }}>
            <Placeholder ratio="3/4" label="GULAB · IVORY ROSE · MODEL" />
            <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="badge badge-gold" style={{ background: 'var(--gold)', color: 'var(--paper)', borderColor: 'var(--gold)' }}>NEW · MEHFIL '26</span>
              <span className="badge">№ 01</span>
            </div>
            <button style={{ position: 'absolute', top: 20, right: 20, width: 44, height: 44, background: 'var(--paper)', border: '1px solid var(--line)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: 'auto' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            <Placeholder ratio="1/1" label="DETAIL · BLOCK PRINT" />
            <Placeholder dark ratio="1/1" label="DETAIL · TEXTILE" />
          </div>
        </div>

        {/* Sticky info */}
        <div style={{ position: 'sticky', top: 120 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 12 }}>Mehfil Edit · Lawn '26</div>
          <h1 className="serif-display" style={{ fontSize: 64, marginBottom: 12 }}>
            Gulab <span className="urdu" style={{ fontSize: 36, color: 'var(--gold)', marginLeft: 8 }}>گلاب</span>
          </h1>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--muted)', marginBottom: 20 }}>
            3-Piece Unstitched Lawn — Hand Block Print
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Stars value={5} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>4.9 · 187 reviews</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 38, fontWeight: 500 }}>Rs. 8,490</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--muted)', textDecoration: 'line-through' }}>Rs. 10,500</span>
            <span className="badge badge-gold" style={{ background: 'var(--gold)', color: 'var(--paper)', borderColor: 'var(--gold)' }}>−19%</span>
          </div>

          <StockUrgency stock={3} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 32 }}>
            <ColorSwatches />
            <SizeSelector />
          </div>

          <QtyAdd stock={3} />

          <ShippingPanel />

          <Accordion items={[
            { title: 'Description', body: 'A 3-piece unstitched lawn in featherweight cotton, hand block-printed in Multan with our signature rose motif. Includes shirt (3.0m), trouser (2.5m) and dupatta (2.5m).' },
            { title: 'Care Instructions', body: 'Cold hand wash separately. Do not bleach. Iron on reverse. Dry in shade.' },
            { title: 'Shipping & Returns', body: '2–4 working days nationwide. Cash on Delivery available. 7-day easy returns on unworn pieces with original tags.' },
          ]} />
        </div>
      </div>
    </div>
  );
}

// ===== Layout 2: Split — 50/50 with image gallery left, info right =====
function PDPSplit() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 900 }}>
      {/* Left: image stack */}
      <div style={{ background: 'var(--paper-warm)', padding: 0, position: 'relative' }}>
        <div style={{ position: 'sticky', top: 88 }}>
          <Placeholder ratio="3/4" label="GULAB · HERO · IVORY ROSE" style={{ height: '100vh', maxHeight: 900 }} />
          <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: 'var(--paper)', mixBlendMode: 'difference' }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.7)' }}>
                IMAGE 01 / 05
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--paper)', marginTop: 4 }}>
                Hand block print · Multan
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ width: 40, height: 40, background: 'rgba(250,250,247,0.15)', backdropFilter: 'blur(8px)', color: 'var(--paper)' }}>←</button>
              <button style={{ width: 40, height: 40, background: 'rgba(250,250,247,0.15)', backdropFilter: 'blur(8px)', color: 'var(--paper)' }}>→</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: info */}
      <div style={{ padding: '64px 64px 80px', maxWidth: 640 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 40, display: 'flex', gap: 8 }}>
          <span>Lawn</span><span>/</span><span>Spring '26</span><span>/</span><span style={{ color: 'var(--ink)' }}>Gulab</span>
        </div>

        <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Mehfil Edit · 03 of 24</div>
        <h1 className="serif-display" style={{ fontSize: 'clamp(56px, 6vw, 88px)', marginBottom: 16 }}>
          Gulab.
        </h1>
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.5, color: 'var(--muted)', marginBottom: 32, maxWidth: 460 }}>
          A featherweight 3-piece in dusty rose — hand block-printed and woven slow.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <Stars value={5} size={16} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>4.9 · 187 reviews</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--line)' }}>
          <span className="serif-display" style={{ fontSize: 48, fontWeight: 500 }}>Rs. 8,490</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--muted)', textDecoration: 'line-through' }}>Rs. 10,500</span>
        </div>

        <StockUrgency stock={3} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 32 }}>
          <ColorSwatches />
          <SizeSelector />
        </div>

        <QtyAdd stock={3} />

        <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1 }}>♡ Save</button>
          <button className="btn btn-outline" style={{ flex: 1 }}>WhatsApp Stylist</button>
        </div>

        <ShippingPanel />
      </div>
    </div>
  );
}

// ===== Layout 3: Immersive — full-bleed image hero, info below =====
function PDPImmersive() {
  return (
    <div>
      {/* Full-bleed hero */}
      <section style={{ position: 'relative', height: '85vh', minHeight: 720 }}>
        <Placeholder dark ratio="auto" style={{ position: 'absolute', inset: 0, height: '100%' }} label="GULAB · FULL-BLEED EDITORIAL" />

        {/* Floating info card */}
        <div style={{
          position: 'absolute',
          bottom: 48, left: 56,
          background: 'var(--paper)',
          padding: 40,
          maxWidth: 480,
          border: '1px solid var(--line)',
        }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 12 }}>Mehfil '26 · 03</div>
          <h1 className="serif-display" style={{ fontSize: 56, marginBottom: 8 }}>Gulab</h1>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--muted)', marginBottom: 20 }}>
            3-Piece Unstitched Lawn
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 500 }}>Rs. 8,490</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through' }}>Rs. 10,500</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <Stars value={5} size={12} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>4.9 · 187 reviews</span>
          </div>
        </div>

        {/* Right counter */}
        <div style={{ position: 'absolute', top: 56, right: 56, color: 'var(--paper)', textAlign: 'right' }}>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 8 }}>Image</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 38, lineHeight: 1 }}>
            01<span style={{ color: 'var(--gold-soft)', fontStyle: 'italic' }}> / 05</span>
          </div>
        </div>
      </section>

      {/* Image strip */}
      <section style={{ padding: '56px 56px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <Placeholder ratio="3/4" label="DETAIL · TEXTILE" />
          <Placeholder dark ratio="3/4" label="DETAIL · DUPATTA" />
          <Placeholder ratio="3/4" label="DETAIL · TROUSER" />
          <Placeholder ratio="3/4" label="DETAIL · STYLED" />
        </div>
      </section>

      {/* Buy section */}
      <section style={{ padding: '120px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: 96, alignItems: 'flex-start', maxWidth: 1400, margin: '0 auto' }}>
          <div>
            <div className="kicker kicker-gold" style={{ marginBottom: 24 }}>The Story</div>
            <h2 className="serif-display" style={{ fontSize: 'clamp(40px, 4vw, 64px)', marginBottom: 32 }}>
              A whisper of <em style={{ color: 'var(--gold)', fontWeight: 300 }}>old Lahore.</em>
            </h2>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.5, color: 'var(--ink)', marginBottom: 32, maxWidth: 600 }}>
              Gulab — Urdu for rose — is woven on a hand-loom in Faisalabad and finished beneath a block-printer's mallet in Multan. Featherweight, breathable, made for warm afternoons and cool evenings.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <div>
                <div className="kicker" style={{ marginBottom: 6 }}>Fabric</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>Lawn 100% cotton</div>
              </div>
              <div>
                <div className="kicker" style={{ marginBottom: 6 }}>Pieces</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>Shirt · Trouser · Dupatta</div>
              </div>
              <div>
                <div className="kicker" style={{ marginBottom: 6 }}>Print</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>Hand block · Natural dye</div>
              </div>
              <div>
                <div className="kicker" style={{ marginBottom: 6 }}>Origin</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>Multan, Pakistan</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'sticky', top: 120 }}>
            <StockUrgency stock={3} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 32 }}>
              <ColorSwatches />
              <SizeSelector />
            </div>
            <QtyAdd stock={3} />
            <ShippingPanel />
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewsSummary() {
  return (
    <section style={{ padding: '0 56px 120px' }}>
      <Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, padding: '80px 0', borderTop: '1px solid var(--line)' }}>
          <div>
            <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Reviews · 187</div>
            <h2 className="serif-display" style={{ fontSize: 56, marginBottom: 16 }}>
              4.9<span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>/5</span>
            </h2>
            <Stars value={5} size={20} />
            <div style={{ marginTop: 20 }}>
              {[
                { l: '5 stars', v: 0.86 },
                { l: '4 stars', v: 0.10 },
                { l: '3 stars', v: 0.03 },
                { l: '2 stars', v: 0.01 },
                { l: '1 star', v: 0 },
              ].map((r) => (
                <div key={r.l} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 36px', gap: 12, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>{r.l}</span>
                  <div style={{ height: 4, background: 'var(--line-soft)', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, width: `${r.v * 100}%`, background: 'var(--gold)' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textAlign: 'right' }}>{Math.round(r.v * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { name: 'Mariam S.', city: 'Karachi', text: 'The print is even more beautiful in person — I got the dusty rose and it goes with everything. Stitched up in 4 days.', photos: 2 },
              { name: 'Ayesha N.', city: 'Lahore', text: 'Soft, breathable, and the dupatta has gorgeous detailing along the border. Will definitely order again.', photos: 1 },
            ].map((r, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Stars value={5} size={12} />
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>{r.name}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>{r.city}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>✓ Verified</span>
                </div>
                <p style={{ fontFamily: 'var(--serif)', fontSize: 19, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 12 }}>"{r.text}"</p>
                {r.photos > 0 && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {Array.from({ length: r.photos }).map((_, idx) => (
                      <Placeholder key={idx} ratio="1/1" label="PHOTO" style={{ width: 64, height: 64 }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function YouMayLike() {
  const products = [
    { id: 11, name: 'Saba', price: '10,490', stock: 4, fabric: '3 Piece Lawn' },
    { id: 12, name: 'Yasmin', urdu: 'یاسمین', price: '7,990', stock: 12, fabric: '2 Piece Lawn' },
    { id: 13, name: 'Roshni', price: '6,790', oldPrice: '8,500', stock: 2, discount: 20, fabric: '2 Piece Lawn' },
    { id: 14, name: 'Anaya', price: '11,790', stock: 8, badge: 'New', fabric: '3 Piece Linen' },
  ];
  return (
    <section style={{ padding: '0 56px 120px' }}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
          <h2 className="serif-display" style={{ fontSize: 'clamp(40px, 4vw, 64px)' }}>
            You may also <em style={{ color: 'var(--gold)', fontWeight: 300 }}>love.</em>
          </h2>
          <a className="kicker" style={{ borderBottom: '1px solid var(--ink)', paddingBottom: 4, color: 'var(--ink)' }}>
            View All →
          </a>
        </div>
      </Reveal>
      <Reveal stagger>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
          {products.map((p) => <ProductCard key={p.id} product={p} variant="editorial" />)}
        </div>
      </Reveal>
    </section>
  );
}

function PDPPage({ layout = 'editorial', onNav }) {
  return (
    <div className="frame">
      <Header onNav={onNav} current="product" />
      {layout === 'editorial' && <PDPEditorial />}
      {layout === 'split' && <PDPSplit />}
      {layout === 'immersive' && <PDPImmersive />}
      <ReviewsSummary />
      <YouMayLike />
      <TrustStrip />
      <Footer />
    </div>
  );
}

Object.assign(window, { PDPPage });
