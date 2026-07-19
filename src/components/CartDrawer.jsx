// Slide-in cart drawer — mounted globally by App.jsx.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Placeholder } from './primitives.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/products.js';

const EASE = [0.22, 1, 0.36, 1];

function LineItem({ line, setQty, removeItem }) {
  const { key, qty, size, color, product } = line;
  const meta = [product.fabric, [size, color].filter(Boolean).join(' · ')]
    .filter(Boolean)
    .join(' · ');
  return (
    <div style={{ display: 'flex', gap: 14, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
      <Link to={`/product/${product.slug}`} style={{ flexShrink: 0, width: 72 }}>
        <Placeholder ratio="3/4" seed={product.name} label={product.name.toUpperCase()} />
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 18, lineHeight: 1.2 }}>
            {product.name}
            {product.urdu && (
              <span className="urdu" style={{ fontSize: 12, color: 'var(--gold)', marginLeft: 6 }}>{product.urdu}</span>
            )}
          </div>
          <button
            onClick={() => removeItem(key)}
            aria-label="Remove item"
            style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--muted)', lineHeight: 1, padding: 2 }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginTop: 4,
          }}
        >
          {meta}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', height: 32 }}>
            <button
              onClick={() => setQty(key, qty - 1)}
              style={{ width: 30, height: '100%', fontFamily: 'var(--mono)', fontSize: 13 }}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span style={{ width: 26, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12 }}>{qty}</span>
            <button
              onClick={() => setQty(key, qty + 1)}
              style={{ width: 30, height: '100%', fontFamily: 'var(--mono)', fontSize: 13 }}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 500 }}>
            {formatPrice(product.price * qty)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    freeShippingThreshold,
    shippingRemaining,
    setQty,
    removeItem,
    drawerOpen,
    closeDrawer,
  } = useCart();

  // Lock body scroll + escape-to-close while open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen, closeDrawer]);

  const progress = Math.min(1, subtotal / freeShippingThreshold);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className="drawer-scrim"
            onClick={closeDrawer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          />
          <motion.aside
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
            role="dialog"
            aria-label="Shopping bag"
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 24px 20px',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 500 }}>
                Your Bag <span style={{ color: 'var(--gold)' }}>· {count}</span>
              </h2>
              <button onClick={closeDrawer} aria-label="Close" style={{ fontFamily: 'var(--mono)', fontSize: 18, lineHeight: 1 }}>
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  padding: 40,
                  textAlign: 'center',
                }}
              >
                <div className="kicker kicker-gold">Lyallpurwears</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 30 }}>Your bag is empty.</div>
                <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--muted)' }}>
                  Hand-loomed lawn, block-printed and waiting.
                </p>
                <Link to="/collections" className="btn btn-gold" style={{ marginTop: 8 }} onClick={closeDrawer}>
                  Shop the Edit
                </Link>
              </div>
            ) : (
              <>
                {/* Free-shipping progress */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)' }}>
                  {shippingRemaining > 0 ? (
                    <>
                      <div
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 10,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--ink)',
                          marginBottom: 8,
                        }}
                      >
                        {formatPrice(shippingRemaining)} away from free shipping
                      </div>
                      <div style={{ height: 3, background: 'var(--line-soft)', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: 'var(--gold)', transition: 'width 0.4s var(--ease)' }} />
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 10,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--gold-deep)',
                      }}
                    >
                      ✓ Free shipping unlocked
                    </div>
                  )}
                </div>

                {/* Line items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {items.map((line) => (
                    <LineItem key={line.key} line={line} setQty={setQty} removeItem={removeItem} />
                  ))}
                </div>

                {/* Footer */}
                <div style={{ borderTop: '1px solid var(--line)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span className="kicker">Subtotal</span>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500 }}>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="kicker kicker-gold" style={{ textAlign: 'center' }}>
                    Cash on Delivery available · PKR
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Link to="/cart" className="btn btn-outline" style={{ flex: 1 }} onClick={closeDrawer}>
                      View Bag
                    </Link>
                    <Link
                      to="/checkout"
                      className="btn btn-gold"
                      style={{ flex: 1 }}
                      onClick={closeDrawer}
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
