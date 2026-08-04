// Floating predictive search — opened from the header's search icon.
//
// Matching runs against the catalogue StoreProvider has already loaded, so
// results land on the first keystroke with no network round trip. That list
// is the same one the collection grid renders, which means search can never
// surface a product the rest of the site doesn't have.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SanityImage } from './SanityImage.jsx';
import { useStore } from '../sanity/useStore.js';
import { formatPrice } from '../data/products.js';

const EASE = [0.22, 1, 0.36, 1];
const MAX_PRODUCTS = 6;
const MAX_CATEGORIES = 3;

// Strips diacritics and case so "Mehrunissa" matches "mehrunissa" and a
// pasted "Anayá" still finds Anaya.
function fold(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

// Rank so the most predictable hit leads: a name that starts with the query
// beats one that merely contains it, which beats a fabric/category match.
function scoreProduct(product, q) {
  const name = fold(product.name);
  if (name.startsWith(q)) return 0;
  if (name.split(/\s+/).some((w) => w.startsWith(q))) return 1;
  if (name.includes(q)) return 2;
  if (fold(product.urdu).includes(q)) return 2;
  if (fold(product.fabric).startsWith(q)) return 3;
  if (fold(product.fabric).includes(q)) return 4;
  if (fold(product.category).includes(q)) return 5;
  if (fold(product.badge).includes(q)) return 6;
  return -1;
}

export function SearchOverlay({ open, onClose }) {
  const { products, categories } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  const q = fold(query);

  const { productHits, categoryHits } = useMemo(() => {
    if (q.length < 1) return { productHits: [], categoryHits: [] };

    const scored = [];
    for (const p of products) {
      const score = scoreProduct(p, q);
      if (score >= 0) scored.push({ p, score });
    }
    scored.sort((a, b) => a.score - b.score || a.p.name.localeCompare(b.p.name));

    const catHits = categories
      .filter((c) => fold(c.en).includes(q) || fold(c.ur).includes(q) || fold(c.tag).includes(q))
      .slice(0, MAX_CATEGORIES);

    return {
      productHits: scored.slice(0, MAX_PRODUCTS).map((s) => s.p),
      categoryHits: catHits,
    };
  }, [q, products, categories]);

  // Flat list of every focusable result, in render order — this is what the
  // arrow keys walk and what Enter commits.
  const targets = useMemo(
    () => [
      ...categoryHits.map((c) => `/collections/${c.slug}`),
      ...productHits.map((p) => `/product/${p.slug}`),
    ],
    [categoryHits, productHits]
  );

  // Reset on every open so the panel never reappears holding a stale query.
  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setCursor(0);
    const raf = requestAnimationFrame(() => inputRef.current?.focus());

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // A shrinking result list must never leave the cursor pointing past the end.
  useEffect(() => {
    setCursor((c) => (c >= targets.length ? 0 : c));
  }, [targets.length]);

  function go(to) {
    onClose();
    navigate(to);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (!targets.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (c + 1) % targets.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (c - 1 + targets.length) % targets.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(targets[cursor] ?? targets[0]);
    }
  }

  const hasQuery = q.length > 0;
  const hasResults = targets.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="search-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
          <motion.div
            className="search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: EASE }}
            onKeyDown={onKeyDown}
          >
            <div className="search-field">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={{ color: 'var(--gold)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                placeholder="Search lawn, khaddar, a name…"
                aria-label="Search products"
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck="false"
              />
              <button type="button" className="search-close" onClick={onClose} aria-label="Close search">
                Esc
              </button>
            </div>

            {hasQuery && (
              <div className="search-results">
                {hasResults ? (
                  <>
                    {categoryHits.length > 0 && (
                      <>
                        <div className="search-group">Collections</div>
                        {categoryHits.map((c, i) => (
                          <Link
                            key={c.slug}
                            to={`/collections/${c.slug}`}
                            onClick={onClose}
                            onMouseEnter={() => setCursor(i)}
                            className={`search-row${cursor === i ? ' is-active' : ''}`}
                          >
                            <span className="search-row-thumb search-row-thumb-empty" aria-hidden="true" />
                            <span style={{ minWidth: 0 }}>
                              <span className="search-row-name">
                                {c.en}
                                {c.ur && <span className="urdu" lang="ur" style={{ fontSize: 13, color: 'var(--gold)', marginLeft: 6 }}>{c.ur}</span>}
                              </span>
                              <span className="search-row-meta">Collection</span>
                            </span>
                          </Link>
                        ))}
                      </>
                    )}

                    {productHits.length > 0 && (
                      <>
                        <div className="search-group">Products</div>
                        {productHits.map((p, i) => {
                          const index = categoryHits.length + i;
                          const front = p.images?.find((im) => im.view === 'FRONT') || p.images?.[0] || null;
                          return (
                            <Link
                              key={p.id}
                              to={`/product/${p.slug}`}
                              onClick={onClose}
                              onMouseEnter={() => setCursor(index)}
                              className={`search-row${cursor === index ? ' is-active' : ''}`}
                            >
                              <span className="search-row-thumb">
                                <SanityImage
                                  asset={front?.asset}
                                  alt={front?.alt || p.name}
                                  ratio="3/4"
                                  seed={p.name}
                                  label={p.name.toUpperCase()}
                                />
                              </span>
                              <span style={{ minWidth: 0 }}>
                                <span className="search-row-name">
                                  {p.name}
                                  {p.urdu && <span className="urdu" lang="ur" style={{ fontSize: 13, color: 'var(--gold)', marginLeft: 6 }}>{p.urdu}</span>}
                                </span>
                                <span className="search-row-meta">{p.fabric}</span>
                              </span>
                              <span className="search-row-price">{formatPrice(p.price)}</span>
                            </Link>
                          );
                        })}
                      </>
                    )}
                  </>
                ) : (
                  <div className="search-empty">
                    <span className="serif-display" style={{ fontSize: 22, fontStyle: 'italic' }}>
                      Nothing woven under “{query.trim()}”.
                    </span>
                    <Link to="/collections" onClick={onClose} className="search-empty-link">
                      Browse everything →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {!hasQuery && (
              <div className="search-results">
                <div className="search-group">Popular</div>
                <div className="search-suggestions">
                  {categories.slice(0, 4).map((c) => (
                    <button key={c.slug} type="button" onClick={() => go(`/collections/${c.slug}`)}>
                      {c.en}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
