// Product detail page — editorial PDP for Lyallpurwears.
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Placeholder, Reveal, TrustStrip, Stars } from '../components/primitives.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import {
  CATEGORIES,
  COLORS,
  SIZES,
  formatPrice,
  getProduct,
  relatedProducts,
} from '../data/products.js';

const categoryName = (slug) => CATEGORIES.find((c) => c.slug === slug)?.en || slug;

// ---- Vertical thumb strip — clicking swaps the hero label/seed ----
function ThumbStrip({ name, active, onSelect }) {
  const views = ['FRONT', 'BACK', 'DETAIL', 'TEXTILE', 'STYLED'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {views.map((v, i) => (
        <button
          key={v}
          onClick={() => onSelect(i)}
          style={{
            border: i === active ? '1.5px solid var(--gold)' : '1px solid var(--line)',
            padding: 0,
            cursor: 'pointer',
            transition: 'border-color 0.3s var(--ease)',
            width: '100%',
            display: 'block',
          }}
        >
          <Placeholder ratio="3/4" seed={`${name}-${v}`} label={v} style={{ height: 80 }} />
        </button>
      ))}
    </div>
  );
}

function ColorSwatches({ colors, selected, onSelect }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="kicker">Colour</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink)' }}>
          {selected}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {colors.map((c) => {
          const on = c.name === selected;
          return (
            <button
              key={c.name}
              title={c.name}
              onClick={() => onSelect(c.name)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: c.hex,
                border: on ? '1.5px solid var(--gold)' : '1px solid var(--line)',
                outline: on ? '3px solid var(--paper)' : 'none',
                outlineOffset: -5,
                cursor: 'pointer',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function SizeSelector({ sizes, selected, onSelect }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="kicker">Size · Stitched</span>
        <button
          type="button"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            borderBottom: '1px solid var(--ink)',
            color: 'var(--ink)',
          }}
        >
          Size guide ↗
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {sizes.map((s) => {
          const on = selected === s;
          return (
            <button
              key={s}
              onClick={() => onSelect(s)}
              style={{
                width: 52,
                height: 52,
                border: on ? '1.5px solid var(--ink)' : '1px solid var(--line)',
                background: on ? 'var(--ink)' : 'var(--paper)',
                color: on ? 'var(--paper)' : 'var(--ink)',
                fontFamily: 'var(--mono)',
                fontSize: 12,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.3s var(--ease)',
              }}
            >
              {s}
            </button>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: 'var(--mono)',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        Or order unstitched · Save Rs. 1,200
      </div>
    </div>
  );
}

function StockUrgency({ stock }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        background: 'var(--gold-tint)',
        border: '1px solid var(--gold-line)',
        marginBottom: 32,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--gold)',
          animation: 'pulse 2s ease infinite',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--gold-deep)',
            fontWeight: 500,
          }}
        >
          Only {stock} pieces left
        </div>
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 14,
            fontStyle: 'italic',
            color: 'var(--ink)',
            marginTop: 2,
          }}
        >
          14 people viewing this in the last hour
        </div>
      </div>
    </div>
  );
}

function ShippingPanel() {
  const cell = (icon, title, sub) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      {icon}
      <div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>{title}</div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
  const box = (
    <div
      style={{
        width: 28,
        height: 28,
        border: '1px solid var(--line)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
      </svg>
    </div>
  );
  return (
    <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24, marginTop: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {cell(
          <div
            style={{
              background: 'var(--gold)',
              color: 'var(--paper)',
              padding: '4px 8px',
              fontFamily: 'var(--mono)',
              fontSize: 9,
              letterSpacing: '0.14em',
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            COD
          </div>,
          'Cash on Delivery',
          'Pay when it arrives'
        )}
        {cell(box, 'Free shipping', 'Orders over Rs. 5,000')}
        {cell(box, '7-Day Returns', 'No questions asked')}
        {cell(box, 'Authentic Lawn', 'Woven in Lyallpur')}
      </div>
      <div
        style={{
          background: 'var(--paper-warm)',
          padding: 14,
          fontFamily: 'var(--mono)',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          textAlign: 'center',
          color: 'var(--ink)',
        }}
      >
        Order in 4hrs 22min · Delivery by Mon, Jul 27
      </div>
    </div>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ borderTop: '1px solid var(--line)', marginTop: 32 }}>
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '20px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{it.title}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 14 }}>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div
              style={{
                paddingBottom: 24,
                fontFamily: 'var(--serif)',
                fontSize: 16,
                lineHeight: 1.6,
                color: 'var(--muted)',
              }}
            >
              {it.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ReviewsSummary({ product }) {
  const bars = [
    { l: '5 stars', v: 0.86 },
    { l: '4 stars', v: 0.1 },
    { l: '3 stars', v: 0.03 },
    { l: '2 stars', v: 0.01 },
    { l: '1 star', v: 0 },
  ];
  const quotes = [
    {
      name: 'Mariam S.',
      city: 'Karachi',
      text: 'The print is even more beautiful in person — I got the dusty rose and it goes with everything. Stitched up in 4 days.',
      photos: 2,
    },
    {
      name: 'Ayesha N.',
      city: 'Lahore',
      text: 'Soft, breathable, and the dupatta has gorgeous detailing along the border. Will definitely order again.',
      photos: 1,
    },
  ];
  return (
    <section style={{ padding: '0 var(--gutter) var(--section-pad)' }}>
      <Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 64,
            padding: '80px 0',
            borderTop: '1px solid var(--line)',
          }}
          className="pdp-reviews-grid"
        >
          <div>
            <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>
              Reviews · {product.reviews}
            </div>
            <h2 className="serif-display" style={{ fontSize: 56, marginBottom: 16 }}>
              {product.rating}
              <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>/5</span>
            </h2>
            <Stars value={Math.round(product.rating)} size={20} />
            <div style={{ marginTop: 20 }}>
              {bars.map((r) => (
                <div
                  key={r.l}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 36px',
                    gap: 12,
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                    }}
                  >
                    {r.l}
                  </span>
                  <div style={{ height: 4, background: 'var(--line-soft)', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, width: `${r.v * 100}%`, background: 'var(--gold)' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textAlign: 'right' }}>
                    {Math.round(r.v * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {quotes.map((r, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Stars value={5} size={12} />
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>{r.name}</span>
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 9,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--muted)',
                      }}
                    >
                      {r.city}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 9,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                    }}
                  >
                    ✓ Verified
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--serif)', fontSize: 19, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 12 }}>
                  "{r.text}"
                </p>
                {r.photos > 0 && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {Array.from({ length: r.photos }).map((_, idx) => (
                      <Placeholder key={idx} ratio="1/1" seed={`${r.name}-${idx}`} label="PHOTO" style={{ width: 64, height: 64 }} />
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

function YouMayLike({ product }) {
  const related = relatedProducts(product, 4);
  return (
    <section style={{ padding: '0 var(--gutter) var(--section-pad)' }}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, gap: 24 }}>
          <h2 className="serif-display" style={{ fontSize: 'clamp(40px, 4vw, 64px)' }}>
            You may also <em style={{ color: 'var(--gold)', fontWeight: 300 }}>love.</em>
          </h2>
          <Link to="/collections" className="kicker" style={{ borderBottom: '1px solid var(--ink)', paddingBottom: 4, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
            View All →
          </Link>
        </div>
      </Reveal>
      <Reveal stagger>
        <div className="pdp-related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 'var(--section-pad) var(--gutter)', textAlign: 'center' }}>
      <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Lyallpurwears</div>
      <h1 className="serif-display" style={{ fontSize: 'var(--display-lg)', marginBottom: 20 }}>
        This piece could not be found.
      </h1>
      <p style={{ fontFamily: 'var(--serif)', fontSize: 20, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 40 }}>
        The design you are looking for may have sold out or moved. Explore the rest of the edit.
      </p>
      <Link to="/collections" className="btn btn-gold" style={{ display: 'inline-flex' }}>
        Browse the Collection
      </Link>
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const { addItem } = useCart();

  const [activeThumb, setActiveThumb] = useState(0);
  const [color, setColor] = useState(COLORS[0].name);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);

  if (!product) return <NotFound />;

  const views = ['FRONT', 'BACK', 'DETAIL', 'TEXTILE', 'STYLED'];
  const heroLabel = `${product.name.toUpperCase()} · ${color.toUpperCase()} · ${views[activeThumb]}`;
  const heroSeed = `${product.name}-${views[activeThumb]}`;
  const clampedMax = product.stock;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(clampedMax, q + 1));

  return (
    <div>
      <div style={{ padding: '40px var(--gutter) 120px' }}>
        {/* Breadcrumb */}
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: 32,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/collections/${product.category}`}>{categoryName(product.category)}</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)' }}>{product.name}</span>
        </div>

        <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: '88px 1fr 460px', gap: 32, alignItems: 'flex-start' }}>
          {/* Vertical thumbs */}
          <div className="pdp-thumbs" style={{ position: 'sticky', top: 120 }}>
            <ThumbStrip name={product.name} active={activeThumb} onSelect={setActiveThumb} />
          </div>

          {/* Hero */}
          <div>
            <div style={{ position: 'relative' }}>
              <Placeholder ratio="3/4" seed={heroSeed} label={heroLabel} />
              <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {product.badge && (
                  <span className="badge badge-gold">{product.badge} · Mehfil '26</span>
                )}
                <span className="badge">№ {String(product.id).padStart(2, '0')}</span>
              </div>
              <button
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 44,
                  height: 44,
                  background: 'var(--paper)',
                  border: '1px solid var(--line)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Save"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <Placeholder ratio="1/1" seed={`${product.name}-block`} label="DETAIL · BLOCK PRINT" />
              <Placeholder ratio="1/1" seed={`${product.name}-textile`} kind="flatlay" label="DETAIL · TEXTILE" />
            </div>
          </div>

          {/* Sticky info */}
          <div className="pdp-info" style={{ position: 'sticky', top: 120 }}>
            <div className="kicker kicker-gold" style={{ marginBottom: 12 }}>
              Mehfil Edit · {product.fabric}
            </div>
            <h1 className="serif-display" style={{ fontSize: 64, marginBottom: 12 }}>
              {product.name}
              {product.urdu && (
                <span className="urdu" style={{ fontSize: 36, color: 'var(--gold)', marginLeft: 8 }}>
                  {product.urdu}
                </span>
              )}
            </h1>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--muted)', marginBottom: 20 }}>
              {product.fabric} — {product.pieces}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <Stars value={Math.round(product.rating)} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                {product.rating} · {product.reviews} reviews
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 38, fontWeight: 500 }}>{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {product.discount && (
                <span className="badge badge-gold">−{product.discount}%</span>
              )}
            </div>

            <StockUrgency stock={product.stock} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 32 }}>
              <ColorSwatches colors={COLORS} selected={color} onSelect={setColor} />
              <SizeSelector sizes={SIZES} selected={size} onSelect={setSize} />
            </div>

            {/* Qty + Add */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--ink)', height: 56, flexShrink: 0 }}>
                <button onClick={dec} style={{ width: 48, height: '100%', fontFamily: 'var(--mono)' }} aria-label="Decrease quantity">
                  −
                </button>
                <span style={{ width: 36, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 13 }}>{qty}</span>
                <button onClick={inc} style={{ width: 48, height: '100%', fontFamily: 'var(--mono)' }} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <button
                className="btn btn-gold"
                style={{ flex: 1, height: 56, padding: '0 24px' }}
                onClick={() => addItem(product.id, { qty, size, color })}
              >
                Add to Bag · {formatPrice(product.price * qty)}
              </button>
            </div>

            <ShippingPanel />

            <Accordion
              items={[
                { title: 'Description', body: product.details },
                { title: 'Care Instructions', body: 'Cold hand wash separately. Do not bleach. Iron on reverse. Dry in shade.' },
                {
                  title: 'Shipping & Returns',
                  body: '2–4 working days nationwide. Cash on Delivery available. 7-day easy returns on unworn pieces with original tags.',
                },
              ]}
            />
          </div>
        </div>
      </div>

      <ReviewsSummary product={product} />
      <YouMayLike product={product} />
      <TrustStrip />

      <style>{`
        @media (max-width: 1080px) {
          .pdp-grid { grid-template-columns: 64px 1fr !important; }
          .pdp-info { grid-column: 1 / -1 !important; position: static !important; }
        }
        @media (max-width: 720px) {
          .pdp-grid { grid-template-columns: 1fr !important; }
          .pdp-thumbs { display: none !important; }
          .pdp-reviews-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .pdp-related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
