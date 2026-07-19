// Cart state — shared by header badge, cart drawer, PDP and cart page.
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { PRODUCTS } from '../data/products.js';

const CartContext = createContext(null);

const STORAGE_KEY = 'lyallpurwears-cart-v1';

// line: { key, productId, qty, size, color }
function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const { productId, qty = 1, size = null, color = null } = action;
      const key = `${productId}|${size ?? ''}|${color ?? ''}`;
      const existing = lines.find((l) => l.key === key);
      if (existing) {
        return lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      }
      return [...lines, { key, productId, qty, size, color }];
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

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => PRODUCTS.some((p) => p.id === l.productId));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, loadInitial);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const value = useMemo(() => {
    const items = lines.map((l) => ({ ...l, product: PRODUCTS.find((p) => p.id === l.productId) }));
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
  }, [lines, drawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
