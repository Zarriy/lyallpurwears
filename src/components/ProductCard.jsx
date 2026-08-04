// Editorial product card — the premium variant from the design sheets,
// wired to the router and the cart.
import { Link } from 'react-router-dom';
import { SanityImage } from './SanityImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/products.js';

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const { id, slug, name, urdu, price, oldPrice, stock, badge, fabric, productNumber, images } = product;

  const front = images?.find((i) => i.view === 'FRONT') || images?.[0] || null;
  const back = images?.find((i) => i.view === 'BACK') || images?.[1] || null;
  const displayNumber = productNumber ?? id;

  return (
    <Link to={`/product/${slug}`} className="swap-img product-card" style={{ display: 'block', position: 'relative' }}>
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
        <SanityImage
          asset={front?.asset}
          alt={front?.alt || `${name} — front`}
          ratio="3/4"
          label={`${name.toUpperCase()} · FRONT`}
          className="ph-front"
          style={{ position: 'absolute', inset: 0 }}
        />
        <SanityImage
          asset={back?.asset}
          alt={back?.alt || `${name} — back`}
          ratio="3/4"
          label={`${name.toUpperCase()} · BACK`}
          kind="flatlay"
          className="ph-back"
          style={{ position: 'absolute', inset: 0 }}
        />

        <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--paper)', mixBlendMode: 'difference' }}>
          № {String(displayNumber).padStart(2, '0')}
        </div>
        {badge && (
          <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--gold)', color: 'var(--paper)', padding: '4px 10px', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {badge}
          </div>
        )}

        <div className="qadd" style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product.id);
            }}
            style={{ width: '100%', padding: 12, background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', border: 0 }}
          >
            + Quick Add
          </button>
        </div>
      </div>

      <div style={{ paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, marginBottom: 2 }}>
            {name} {urdu && <span className="urdu" lang="ur" style={{ fontSize: 15, color: 'var(--gold)', marginLeft: 6 }}>{urdu}</span>}
          </h4>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {fabric}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 500 }}>{formatPrice(price)}</div>
          {oldPrice && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textDecoration: 'line-through' }}>{formatPrice(oldPrice)}</div>
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
    </Link>
  );
}
