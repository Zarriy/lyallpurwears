// Cart state — shared by header badge, cart drawer, PDP and cart page.
//
// Line items are keyed by `product.id`, which is a numeric id in the static
// catalogue (src/data/products.js) but a string Sanity `_id` once the CMS
// is wired up (see src/sanity/useStore.js). Everything below is written to
// be agnostic to that — no `parseInt`, no numeric arithmetic on ids, no
// strict comparison against numeric literals. Product lookups go through
// `useStore()`'s live `products` list (static fallback or Sanity) rather
// than importing the static catalogue directly, so a cart line only ever
// renders once its product actually resolves against whichever catalogue is
// currently active — see the `items` derivation below.
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { useStore } from '../sanity/useStore.js';

const CartContext = createContext(null);

const STORAGE_KEY = 'lyallpurwear-cart-v1';

// line: { key, productId, qty, size, color }
function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const { productId, qty = 1, size = null, color = null } = action;
      const key = `${productId}|${size ?? ''}|${color ?? ''}`;
      const existing = lines.find((l) => l.key === key);
      if (existing) {
        // Bumping an existing line leaves it where it is — the qty change is
        // the feedback, and reshuffling the bag under the shopper is worse.
        return lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      }
      // Newest first. The drawer slides in scrolled to the top, so a new line
      // appended to the end would land below the fold once the bag has a few
      // items in it — the shopper gets no confirmation of what they just
      // added. Ordering lives here rather than in the drawer's render so the
      // drawer and /cart can never disagree about it.
      return [{ key, productId, qty, size, color }, ...lines];
    }
    case 'remove':
      return lines.filter((l) => l.key !== action.key);
    case 'setQty':
      if (action.qty <= 0) return lines.filter((l) => l.key !== action.key);
      return lines.map((l) => (l.key === action.key ? { ...l, qty: action.qty } : l));
    case 'clear':
      return [];
    default:
      return lines;
  }
}

// Only a basic shape guard here — whether a given productId still resolves
// to a real product depends on which catalogue (static or Sanity) is live,
// which isn't known synchronously at localStorage-read time. Real
// product-existence filtering happens reactively in `items` below, every
// render, against whatever `products` currently is.
function loadInitialLines() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => l && typeof l === 'object' && l.key && l.productId != null);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { products } = useStore();
  const [lines, dispatch] = useReducer(reducer, undefined, loadInitialLines);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const value = useMemo(() => {
    // A line whose product no longer resolves (orphaned/pre-migration cart,
    // or a product removed from the catalogue) is dropped here rather than
    // rendered as a broken row — `lines` itself is left untouched so a line
    // isn't lost just because it's momentarily unresolved while Sanity data
    // is still loading (products starts as the static fallback and swaps in
    // once the fetch resolves).
    const items = lines
      .map((l) => ({ ...l, product: products.find((p) => p.id === l.productId) }))
      .filter((l) => l.product);
    const count = items.reduce((n, l) => n + l.qty, 0);
    const subtotal = items.reduce((n, l) => n + l.qty * l.product.price, 0);
    const freeShippingThreshold = 5000;
    return {
      items,
      count,
      subtotal,
      freeShippingThreshold,
      shippingRemaining: Math.max(0, freeShippingThreshold - subtotal),
      addItem: (productId, opts = {}) => {
        dispatch({ type: 'add', productId, ...opts });
        setDrawerOpen(true);
      },
      removeItem: (key) => dispatch({ type: 'remove', key }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      clear: () => dispatch({ type: 'clear' }),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [lines, drawerOpen, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
