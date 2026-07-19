// Full cart page — editorial layout for Lyallpurwears.
import { Link } from 'react-router-dom';
import { Placeholder, TrustStrip } from '../components/primitives.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/products.js';

const SHIPPING_FLAT = 299;

function CartLine({ line, setQty, removeItem }) {
  const { key, qty, size, color, product } = line;
  const meta = [product.fabric, product.pieces, [size, color].filter(Boolean).join(' · ')]
    .filter(Boolean)
    .join(' · ');
  return (
    <div
      className="cart-line"
      style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, padding: '32px 0', borderBottom: '1px solid var(--line)', alignItems: 'flex-start' }}
    >
      <Link to={`/product/${product.slug}`} style={{ display: 'block' }}>
        <Placeholder ratio="3/4" seed={product.name} label={product.name.toUpperCase()} />
      </Link>

      <div style={{ minWidth: 0 }}>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 500, marginBottom: 4 }}>
          <Link to={`/product/${product.slug}`}>
            {product.name}
            {product.urdu && (
              <span className="urdu" style={{ fontSize: 16, color: 'var(--gold)', marginLeft: 8 }}>{product.urdu}</span>
            )}
          </Link>
        </h3>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: 20,
          }}
        >
          {meta}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--ink)', height: 44 }}>
            <button onClick={() => setQty(key, qty - 1)} style={{ width: 40, height: '100%', fontFamily: 'var(--mono)' }} aria-label="Decrease quantity">
              −
            </button>
            <span style={{ width: 32, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 13 }}>{qty}</span>
            <button onClick={() => setQty(key, qty + 1)} style={{ width: 40, height: '100%', fontFamily: 'var(--mono)' }} aria-label="Increase quantity">
              +
            </button>
          </div>
          <button
            onClick={() => removeItem(key)}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              borderBottom: '1px solid var(--line)',
              paddingBottom: 2,
            }}
          >
            Remove ✕
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500 }}>{formatPrice(product.price * qty)}</div>
        {qty > 1 && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
            {formatPrice(product.price)} each
          </div>
        )}
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, subtotal, freeShippingThreshold, setQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ padding: 'var(--section-pad) var(--gutter)', textAlign: 'center' }}>
        <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Your Bag</div>
        <h1 className="serif-display" style={{ fontSize: 'var(--display-lg)', marginBottom: 20 }}>
          Your bag is empty.
        </h1>
        <p style={{ fontFamily: 'var(--serif)', fontSize: 20, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 40 }}>
          Nothing here yet — the hand-looms of Lyallpur are waiting.
        </p>
        <Link to="/collections" className="btn btn-gold" style={{ display: 'inline-flex' }}>
          Shop the Edit
        </Link>
      </div>
    );
  }

  const freeShipping = subtotal >= freeShippingThreshold;
  const shipping = freeShipping ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  return (
    <div>
      <div style={{ padding: 'var(--section-pad) var(--gutter) var(--space-9)' }}>
        <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>
          {items.length} {items.length === 1 ? 'piece' : 'pieces'} · PKR
        </div>
        <h1 className="serif-display" style={{ fontSize: 'var(--display-lg)', marginBottom: 56 }}>
          Your Bag.
        </h1>

        <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 64, alignItems: 'flex-start' }}>
          {/* Line list */}
          <div style={{ borderTop: '1px solid var(--line)' }}>
            {items.map((line) => (
              <CartLine key={line.key} line={line} setQty={setQty} removeItem={removeItem} />
            ))}
          </div>

          {/* Order summary */}
          <aside
            className="cart-summary"
            style={{
              position: 'sticky',
              top: 120,
              border: '1px solid var(--line)',
              background: 'var(--paper-warm)',
              padding: 32,
            }}
          >
            <div className="kicker kicker-gold" style={{ marginBottom: 24 }}>Order Summary</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row
                label="Shipping"
                value={freeShipping ? 'Free' : formatPrice(SHIPPING_FLAT)}
                sub={freeShipping ? undefined : 'Free over Rs. 5,000'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>Estimated Total</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 500 }}>{formatPrice(total)}</span>
            </div>

            <div
              style={{
                background: 'var(--gold-tint)',
                border: '1px solid var(--gold-line)',
                padding: '12px 14px',
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--gold-deep)',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Cash on Delivery available
            </div>

            <Link to="/checkout" className="btn btn-gold" style={{ width: '100%', marginBottom: 12 }}>
              Proceed to Checkout
            </Link>
            <Link to="/collections" className="btn btn-outline" style={{ width: '100%' }}>
              Continue Shopping
            </Link>

            <p
              style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--muted)',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              7-day easy returns · Woven in Lyallpur
            </p>
          </aside>
        </div>
      </div>

      <TrustStrip />

      <style>{`
        @media (max-width: 860px) {
          .cart-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .cart-summary { position: static !important; }
        }
        @media (max-width: 520px) {
          .cart-line { grid-template-columns: 88px 1fr !important; }
          .cart-line > *:last-child { grid-column: 1 / -1; text-align: left !important; }
        }
      `}</style>
    </div>
  );
}

function Row({ label, value, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        {label}
        {sub && (
          <span style={{ display: 'block', fontSize: 9, color: 'var(--muted)', marginTop: 2, textTransform: 'none', letterSpacing: 'normal' }}>
            {sub}
          </span>
        )}
      </span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink)' }}>{value}</span>
    </div>
  );
}
