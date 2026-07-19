// Collections — Lyallpurwears
// Editorial product listing. Routes: /collections, /collections/:category
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Reveal, Placeholder, TrustStrip } from '../components/primitives.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { PRODUCTS, CATEGORIES, formatPrice } from '../data/products.js';

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price, low to high' },
  { key: 'price-desc', label: 'Price, high to low' },
  { key: 'newest', label: 'Newest' },
];

export default function Collections() {
  const { category } = useParams();
  const [sort, setSort] = useState('featured');

  const activeCategory = useMemo(
    () => CATEGORIES.find((c) => c.slug === category) || null,
    [category]
  );

  const filtered = useMemo(() => {
    const base = activeCategory
      ? PRODUCTS.filter((p) => p.category === activeCategory.slug)
      : PRODUCTS;

    const list = [...base];
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') {
      list.sort((a, b) => {
        const aNew = a.badge === 'New' ? 1 : 0;
        const bNew = b.badge === 'New' ? 1 : 0;
        if (aNew !== bNew) return bNew - aNew;
        return b.id - a.id;
      });
    }
    return list;
  }, [activeCategory, sort]);

  return (
    <div>
      {/* Hero band */}
      <section style={{ padding: 'var(--section-pad) var(--gutter) 64px' }}>
        <Reveal>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>
            {activeCategory ? activeCategory.tag : 'The Collection'}
          </div>
          <h1 className="serif-display" style={{ fontSize: 'var(--display-lg)', marginBottom: 20 }}>
            {activeCategory ? (
              <>
                {activeCategory.en}{' '}
                <span className="urdu" style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 300 }}>
                  {activeCategory.ur}
                </span>
              </>
            ) : (
              <>
                Every <em style={{ color: 'var(--gold)', fontWeight: 300 }}>thread.</em>
              </>
            )}
          </h1>
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--muted)', maxWidth: 520, marginBottom: 24, lineHeight: 1.5 }}>
            {activeCategory
              ? `A closer look at our ${activeCategory.en.toLowerCase()} — ${activeCategory.tag.toLowerCase()}, woven in Lyallpur.`
              : 'Every fabric we weave, every print we cut, gathered in one place.'}
          </p>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
          </div>
        </Reveal>
      </section>

      {/* Filter tabs + sort */}
      <section style={{ padding: '0 var(--gutter) 40px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            padding: '20px 0',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            <Link
              to="/collections"
              style={{
                padding: '8px 14px',
                color: !activeCategory ? 'var(--ink)' : 'var(--muted)',
                borderBottom: !activeCategory ? '1px solid var(--ink)' : '1px solid transparent',
              }}
            >
              All
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/collections/${c.slug}`}
                style={{
                  padding: '8px 14px',
                  color: activeCategory?.slug === c.slug ? 'var(--ink)' : 'var(--muted)',
                  borderBottom: activeCategory?.slug === c.slug ? '1px solid var(--ink)' : '1px solid transparent',
                }}
              >
                {c.en}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            <span style={{ color: 'var(--muted)' }}>Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                background: 'transparent',
                border: '1px solid var(--line)',
                padding: '8px 12px',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
              }}
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section style={{ padding: '0 var(--gutter) var(--section-pad)' }}>
        {filtered.length > 0 ? (
          <Reveal stagger>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 28,
                columnGap: 28,
                rowGap: 56,
              }}
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Reveal>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h3 className="serif-display" style={{ fontSize: 'var(--display-sm)', fontStyle: 'italic', marginBottom: 20 }}>
              Nothing woven here yet.
            </h3>
            <Link
              to="/collections"
              style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 4 }}
            >
              View all collections →
            </Link>
          </div>
        )}
      </section>

      {/* Editorial break */}
      <section style={{ position: 'relative' }}>
        <Reveal>
          <div style={{ position: 'relative' }}>
            <Placeholder ratio="21/9" kind="flatlay" label="LYALLPUR LOOMS" />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(10,10,10,0.35)',
                padding: '0 var(--gutter)',
              }}
            >
              <p
                className="serif-display"
                style={{
                  fontSize: 'var(--display-sm)',
                  fontStyle: 'italic',
                  color: 'var(--paper)',
                  textAlign: 'center',
                  maxWidth: 780,
                  lineHeight: 1.3,
                }}
              >
                "Every thread remembers the hand that wove it — Lyallpur's looms have not stopped turning in a hundred years."
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <TrustStrip />
    </div>
  );
}
