// Collections — Lyallpur Wear
// Editorial product listing. Routes: /collections, /collections/:category
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Reveal, TrustStrip } from '../components/primitives.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { useStore } from '../sanity/useStore.js';

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price, low to high' },
  { key: 'price-desc', label: 'Price, high to low' },
  { key: 'newest', label: 'Newest' },
];

export default function Collections() {
  const { category } = useParams();
  const [sort, setSort] = useState('featured');
  const { products, categories, settings } = useStore();

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === category) || null,
    [category, categories]
  );

  // The italic line under the title. Studio-editable at two levels:
  //   - a named collection uses its own Description (Collections → <name>)
  //   - the "All" view uses Site Settings → Collections Page → intro
  // Each falls back to the original generated/literal copy when unset, so an
  // unpopulated CMS still reads as finished.
  const intro = useMemo(() => {
    if (activeCategory) {
      if (activeCategory.description) return activeCategory.description;
      const tag = activeCategory.tag ? `${activeCategory.tag.toLowerCase()}, ` : '';
      return `A closer look at our ${activeCategory.en.toLowerCase()} — ${tag}woven in Lyallpur.`;
    }
    // We buy cloth rather than make it — see the note at the top of
    // src/pages/About.jsx. Copy here has to stay on the right side of that.
    return settings?.collectionsIntro || 'Every fabric we chose this season, gathered in one place.';
  }, [activeCategory, settings]);

  const filtered = useMemo(() => {
    const base = activeCategory
      ? products.filter((p) => p.category === activeCategory.slug)
      : products;

    const list = [...base];
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') {
      list.sort((a, b) => {
        const aNew = a.badge === 'New' ? 1 : 0;
        const bNew = b.badge === 'New' ? 1 : 0;
        if (aNew !== bNew) return bNew - aNew;
        // `id` is a numeric static id in the fallback catalogue but a
        // string Sanity `_id` once CMS-backed — not safe to subtract.
        // `productNumber` is a real number either way (required by the
        // product schema; the static entries' array index doubles as it).
        const bNum = Number(b.productNumber ?? b.id) || 0;
        const aNum = Number(a.productNumber ?? a.id) || 0;
        return bNum - aNum;
      });
    }
    return list;
  }, [activeCategory, sort, products]);

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
                <span className="urdu" lang="ur" style={{ color: 'var(--gold)' }}>
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
            {intro}
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
            {categories.map((c) => (
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
            {/* The band is wider than the source's 16:9, so it crops top and
                bottom — anchored just above centre to keep the loom beam and
                the spools of yarn in frame. */}
            <img
              src="/litmus.png"
              alt="A hand-loom in Lyallpur, spools of dyed yarn resting on the beam"
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                aspectRatio: '21/9',
                // At phone widths a 21:9 band is ~150px tall and the quote
                // overflows it — hold a floor and let the crop deepen instead.
                minHeight: 300,
                objectFit: 'cover',
                objectPosition: 'center 45%',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Deeper than a flat scrim on the right, where the photo's
                // windows blow out and would otherwise swallow the quote.
                background: 'linear-gradient(90deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.5) 45%, rgba(10,10,10,0.55) 100%)',
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
