// Slide-in cart drawer — mounted globally by App.jsx.
import { useEffect, useState, useRef, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SanityImage } from './SanityImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/products.js';

const EASE = [0.22, 1, 0.36, 1];

// forwardRef because <AnimatePresence mode="popLayout"> wraps each child in
// framer-motion's PopChild, which measures it through a ref. A plain function
// component silently drops that ref and React warns.
const LineItem = forwardRef(function LineItem({ line, setQty, removeItem }, ref) {
  const { key, qty, size, color, product } = line;
  // A null size means unstitched, which is the default sale. Say so rather
  // than leaving the line silent about what's actually in the parcel.
  const stitching = size ? `Stitched ${size}` : 'Unstitched';
  const front = product.images?.find((i) => i.view === 'FRONT') || product.images?.[0] || null;
  const wasPrice = product.oldPrice && product.oldPrice > product.price ? product.oldPrice : null;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, ease: EASE }}
      style={{ display: 'flex', gap: 16, paddingBottom: 22, borderBottom: '1px solid var(--line-soft)' }}
    >
      <Link to={`/product/${product.slug}`} style={{ flexShrink: 0, width: 84 }}>
        <SanityImage asset={front?.asset} alt={front?.alt || product.name} ratio="3/4" seed={product.name} label={product.name.toUpperCase()} />
      </Link>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
          <Link to={`/product/${product.slug}`} style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.15, color: 'var(--ink)' }}>
            {product.name}
            {product.urdu && (
              <span className="urdu" lang="ur" style={{ fontSize: 13, color: 'var(--gold)', marginLeft: 6 }}>{product.urdu}</span>
            )}
          </Link>
          <button
            onClick={() => removeItem(key)}
            aria-label={`Remove ${product.name}`}
            title="Remove"
            style={{ color: 'var(--muted)', lineHeight: 0, padding: 4, marginRight: -4, flexShrink: 0 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        {/* Stitching is the thing customers most often get wrong, so it reads
            as a chip rather than another line of grey micro-copy. */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--gold-deep)', background: 'var(--gold-tint)', border: '1px solid var(--gold-line)',
            padding: '3px 8px',
          }}>
            {stitching}
          </span>
          {color && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--muted)', border: '1px solid var(--line)', padding: '3px 8px',
            }}>
              {color}
            </span>
          )}
        </div>

        {product.fabric && (
          <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
            {product.fabric}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: 12, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', height: 34 }}>
            <button
              onClick={() => setQty(key, qty - 1)}
              style={{ width: 32, height: '100%', fontFamily: 'var(--mono)', fontSize: 15, color: qty <= 1 ? 'var(--muted)' : 'var(--ink)' }}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span style={{ width: 28, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12 }}>{qty}</span>
            <button
              onClick={() => setQty(key, qty + 1)}
              style={{ width: 32, height: '100%', fontFamily: 'var(--mono)', fontSize: 15 }}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div style={{ textAlign: 'right' }}>
            {wasPrice && (
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textDecoration: 'line-through' }}>
                {formatPrice(wasPrice * qty)}
              </div>
            )}
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500 }}>
              {formatPrice(product.price * qty)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export function CartDrawer() {
  const { items, count, subtotal, setQty, removeItem, drawerOpen, closeDrawer } = useCart();

  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(null);

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

  useEffect(() => () => clearTimeout(timer.current), []);

  // Reset when the drawer is dismissed mid-transition, or the button stays
  // stuck on "Securing your bag" the next time it opens.
  useEffect(() => {
    if (!drawerOpen) {
      clearTimeout(timer.current);
      setLeaving(false);
    }
  }, [drawerOpen]);

  // Deliberate beat between tapping Checkout and the checkout page appearing.
  // Checkout is the moment a customer is most likely to hesitate; a hard cut
  // from a warm drawer to a cold form reads as a jump. This also covers the
  // route's own mount cost so the first paint isn't half-rendered.
  const goToCheckout = () => {
    if (leaving) return;
    setLeaving(true);
    timer.current = setTimeout(() => {
      closeDrawer();
      setLeaving(false);
      navigate('/checkout');
    }, 900);
  };

  const savings = items.reduce(
    (sum, l) => sum + (l.product.oldPrice && l.product.oldPrice > l.product.price ? (l.product.oldPrice - l.product.price) * l.qty : 0),
    0
  );

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
                padding: '22px 24px 18px',
                borderBottom: '1px solid var(--line)',
                flexShrink: 0,
              }}
            >
              <div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 500, lineHeight: 1 }}>Your Bag</h2>
                <div className="kicker" style={{ color: 'var(--muted)', marginTop: 6 }}>
                  {count} {count === 1 ? 'piece' : 'pieces'}
                </div>
              </div>
              <button onClick={closeDrawer} aria-label="Close bag" style={{ color: 'var(--ink)', lineHeight: 0, padding: 6, marginRight: -6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
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
                <div className="kicker kicker-gold">Lyallpur Wear</div>
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
                {/* Shipping is free on every order, so there is no threshold
                    left to chase — the progress bar that used to live here
                    ("Rs 1,301 away from free shipping") would now be a bar
                    that is always full. State the benefit instead. */}
                <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--line)', background: 'var(--paper-warm)', flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--gold-deep)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Free shipping on every order
                  </div>
                </div>

                {/* Line items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <AnimatePresence initial={false} mode="popLayout">
                    {items.map((line) => (
                      <LineItem key={line.key} line={line} setQty={setQty} removeItem={removeItem} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div style={{ borderTop: '1px solid var(--line)', padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--paper)', flexShrink: 0 }}>
                  {savings > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span className="kicker" style={{ color: 'var(--gold-deep)' }}>You save</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--gold-deep)' }}>−{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span className="kicker">Subtotal</span>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 500 }}>{formatPrice(subtotal)}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
                    Free delivery · Prices include tax
                  </div>

                  <button className="btn btn-gold" onClick={goToCheckout} disabled={leaving} style={{ width: '100%', position: 'relative' }}>
                    {leaving ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <span className="drawer-spinner" aria-hidden="true" />
                        Securing your bag
                      </span>
                    ) : (
                      <>
                        Checkout
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5h12m0 0L9 1m4 4L9 9" /></svg>
                      </>
                    )}
                  </button>

                  <Link
                    to="/cart"
                    onClick={closeDrawer}
                    style={{
                      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: 'var(--muted)', textAlign: 'center',
                    }}
                  >
                    View full bag
                  </Link>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 18, borderTop: '1px solid var(--line-soft)', paddingTop: 14 }}>
                    {['Cash on Delivery', '7-day returns'].map((t) => (
                      <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        {t}
                      </span>
                    ))}
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
