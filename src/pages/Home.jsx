// Lyallpur Wear — homepage. Editorial luxe lawn store, woven in Lyallpur.
import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, Placeholder, Marquee, TrustStrip } from '../components/primitives.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { formatPrice } from '../data/products.js';
import { useStore } from '../sanity/useStore.js';
import { useHasOverflow } from '../hooks/useHasOverflow.js';

const IMAGES = {
  hero: 'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/moves_hands_down_and_make_202605161624.jpg?v=1778930697',
  story: 'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/remove_the_cards_and_any_202605162011.jpg?v=1778944709',
  lookbook: [
    'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/remove_the_text_2K_202605161724.jpg?v=1778941756',
    'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/Create_a_wide_luxury_Pakistani_202605161657.jpg?v=1778932658',
    'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/remove_the_text_and_the_202605161639.jpg?v=1778931568',
    'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/Model_wearing_Pakistani_outfit_202607191414.jpg?v=1784452510',
  ],
};

// Curated editorial photography for the collections slider, used ONLY as a
// per-position fallback: collections seeded from the static catalogue carry
// no heroImage, and dropping those cards to flat placeholder art would gut
// the section. Upload a Hero image on a collection in Studio and it wins.
const COLLECTION_FALLBACK_IMAGES = [
  'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/Nishat.jpg?v=1778942943',
  'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/Gemini_Generated_Image_gj38gfgj38gfgj38.png?v=1778943588',
  'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/update_the_dress_of_our_202605161958.jpg?v=1778943642',
  'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/BAREEZE_BY_AMAL-VOL-23.jpg?v=1778942768',
];

// Real photography tile — cover-fit, right-anchored per art direction.
function Photo({ src, alt, ratio, pos = 'right center', style }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ width: '100%', height: '100%', aspectRatio: ratio, objectFit: 'cover', objectPosition: pos, display: 'block', ...style }}
    />
  );
}

/* ---------------------------------------------------------------- Hero */
function Hero({ products }) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const frame = document.querySelector('.frame');
      setScrollY((frame && frame.scrollTop) || window.scrollY || 0);
    };
    const frame = document.querySelector('.frame');
    if (frame) frame.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) frame.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const hero = products[0];

  return (
    <section style={{ position: 'relative', height: 'min(760px, 92vh)', overflow: 'hidden', background: 'var(--paper-warm)' }}>
      {/* Background photography w/ ken-burns */}
      <div className="kenburns" style={{ position: 'absolute', inset: 0 }}>
        <img
          src={IMAGES.hero}
          alt="Model in hand block-printed lawn"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center' }}
        />
      </div>
      {/* Legibility scrim over the photograph */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.2) 45%, rgba(10,10,10,0.35) 100%)', zIndex: 1 }} />

      {/* Edge frame */}
      <div style={{
        position: 'absolute', inset: 24, border: '1px solid rgba(250,250,247,0.25)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* Top label + counter */}
      <div style={{
        position: 'absolute', top: 56, left: 'var(--gutter)', right: 'var(--gutter)', zIndex: 3,
        display: 'flex', justifyContent: 'space-between', color: 'var(--paper)',
        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        transform: `translateY(${scrollY * -0.15}px)`,
      }}>
        <span>Spring/Summer · Vol. 04</span>
        <span>01 / 06</span>
      </div>

      {/* Main copy */}
      <div style={{
        position: 'absolute', bottom: 96, left: 'var(--gutter)', zIndex: 3,
        color: 'var(--paper)', maxWidth: 720,
        transform: `translateY(${scrollY * -0.25}px)`,
      }}>
        <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>
          New Arrival · Lawn '26
        </div>
        <h1 className="serif-display" style={{ fontSize: 'clamp(60px, 9vw, 132px)', marginBottom: 20 }}>
          The Mehfil<br />
          <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>Edit.</em>
        </h1>
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'rgba(250,250,247,0.85)', maxWidth: 480, marginBottom: 36, lineHeight: 1.4 }}>
          Hand-block prints on featherweight lawn — woven in Lyallpur for warm afternoons and cooler evenings.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link className="btn btn-gold" to="/collections">
            Shop the Edit
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5h12m0 0L9 1m4 4L9 9" /></svg>
          </Link>
          <Link className="btn btn-outline" to="/collections" style={{ borderColor: 'rgba(250,250,247,0.5)', color: 'var(--paper)' }}>
            View Lookbook
          </Link>
        </div>
      </div>

      {/* Right meta column */}
      <Link to={`/product/${hero.slug}`} style={{
        position: 'absolute', right: 'var(--gutter)', bottom: 96, zIndex: 3,
        color: 'var(--paper)', textAlign: 'right',
        transform: `translateY(${scrollY * -0.18}px)`,
      }}>
        <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 14 }}>Featured Piece</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 28, marginBottom: 6 }}>{hero.name} — {hero.pieces ? '3 Piece' : 'Lawn'}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--gold-soft)' }}>{formatPrice(hero.price)}</div>
        <div style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'rgba(250,250,247,0.7)' }}>
          ONLY {hero.stock} LEFT IN STOCK
        </div>
      </Link>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 3, color: 'var(--paper)',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <span>SCROLL</span>
        <div style={{ width: 1, height: 36, background: 'rgba(250,250,247,0.5)' }} />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Collections slider */
function CollectionsSlider() {
  const { categories, settings } = useStore();
  const trackRef = useRef(null);

  // Studio drives both the membership and the order of these cards:
  // Site Settings → Homepage → Homepage collections. Unset falls back to
  // every collection (the GROQ query already sorts by displayOrder), so the
  // section is populated the moment a dataset exists and never renders empty.
  const slides = useMemo(() => {
    const source = settings?.homepageCollections?.length
      ? settings.homepageCollections
      : categories;
    return (source || []).filter(Boolean).map((c, i) => ({
      key: c.slug || c.id || i,
      name: c.en,
      tag: c.tag,
      img: c.heroImageUrl || COLLECTION_FALLBACK_IMAGES[i % COLLECTION_FALLBACK_IMAGES.length],
      to: c.slug ? `/collections/${c.slug}` : '/collections',
    }));
  }, [settings, categories]);

  // Arrows only when the row actually runs past the edge of the screen.
  const canSlide = useHasOverflow(trackRef, [slides.length]);

  const slideBy = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    const step = card.getBoundingClientRect().width + gap;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (!slides.length) return null;

  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)', overflow: 'hidden' }}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 48 }}>
          <div>
            <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>New In · The Houses</div>
            <h2 className="serif-display" style={{ fontSize: 'clamp(40px, 5vw, 76px)' }}>
              This season's <em style={{ color: 'var(--gold)', fontWeight: 300 }}>collections.</em>
            </h2>
          </div>
          {canSlide && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button aria-label="Previous collections" className="slider-arrow" onClick={() => slideBy(-1)}>←</button>
              <button aria-label="Next collections" className="slider-arrow" onClick={() => slideBy(1)}>→</button>
            </div>
          )}
        </div>
      </Reveal>
      <Reveal>
        <div className="coll-slider" ref={trackRef}>
          {slides.map((c, i) => (
            <Link key={c.key} to={c.to} className="coll-slide">
              <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                <Photo src={c.img} alt={`${c.name} collection`} ratio="3/4" style={{ transition: 'transform 1.2s var(--ease)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.55) 0%, transparent 40%)' }} />
                <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--paper)' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, color: 'var(--paper)' }}>
                  <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 6 }}>{c.tag || 'Collection'}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 className="serif-display" style={{ fontSize: 34, color: 'var(--paper)' }}>{c.name}</h3>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Explore →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------------------------------------------- Story */
function FeaturedProduct() {
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 'var(--section-pad) var(--gutter)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(40px, 6vw, 96px)', alignItems: 'center' }}>
        <Reveal>
          <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
            <Photo src={IMAGES.story} alt="The looms of Lyallpur — editorial" ratio="4/5" />
          </div>
        </Reveal>
        <Reveal>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>The Story · 03</div>
          <h2 className="serif-display" style={{ fontSize: 'clamp(40px, 5vw, 76px)', color: 'var(--paper)', marginBottom: 24 }}>
            Threads <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>that remember.</em>
          </h2>
          {/* We are a buying house, not a mill. This block used to read "14
              Master Artisans / 72hr Per Block Print / 0 Synthetic Dye", which
              described a workshop we don't run — see the note at the top of
              src/pages/About.jsx. Keep any figure here to something we can
              actually stand behind as a buyer. */}
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.78)', marginBottom: 32, maxWidth: 480 }}>
            The Mehfil edit was pulled bolt by bolt out of the cloth bazaars of Lyallpur — Faisalabad, the city of looms — and off the print tables of Multan. We don't own the looms. We just refuse to bring back anything we wouldn't wear ourselves.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginBottom: 40, paddingTop: 32, borderTop: '1px solid rgba(250,250,247,0.12)' }}>
            <div>
              <div className="figure-stat" style={{ color: 'var(--gold-soft)' }}>40+</div>
              <div className="kicker" style={{ marginTop: 8 }}>Mills Visited</div>
            </div>
            <div>
              <div className="figure-stat" style={{ color: 'var(--gold-soft)' }}>1 in 9</div>
              <div className="kicker" style={{ marginTop: 8 }}>Bolts We Keep</div>
            </div>
            <div>
              <div className="figure-stat" style={{ color: 'var(--gold-soft)' }}>8</div>
              <div className="kicker" style={{ marginTop: 8 }}>Bazaars We Walk</div>
            </div>
          </div>
          <Link className="btn btn-gold" to="/about">Read the Story →</Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Product rail */
// Horizontal product slider stocked from one Studio-chosen collection
// (Site Settings → Homepage → Featured collection). Replaced the old
// four-tab filter grid: the tabs were hardcoded to Lawn/Khaddar/Linen and
// would silently mismatch any collection renamed or added in the CMS.
function ProductRail({ products }) {
  const { settings } = useStore();
  const railRef = useRef(null);

  const collection = settings?.featuredCollection || null;
  const limit = settings?.featuredCollectionLimit ?? 12;

  const shown = useMemo(() => {
    const base = collection ? products.filter((p) => p.category === collection.slug) : products;
    // A collection that's been emptied — or whose slug no longer matches any
    // product — falls back to the full catalogue rather than blanking the
    // section on the homepage.
    return (base.length ? base : products).slice(0, limit);
  }, [products, collection, limit]);

  const canSlide = useHasOverflow(railRef, [shown.length]);

  const slideBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.firstElementChild;
    if (!card) return;
    // Read the live gap rather than hardcoding it — the rail narrows its gap
    // at the 640px breakpoint, and a stale constant would drift the step.
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 28;
    rail.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };

  if (!shown.length) return null;

  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 56 }}>
          <div>
            <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>
              The Edit · {collection ? collection.en : "Spring '26"}
            </div>
            <h2 className="serif-display" style={{ fontSize: 'clamp(40px, 5vw, 76px)' }}>
              Most loved <em style={{ color: 'var(--gold)', fontWeight: 300 }}>this week.</em>
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link
              to={collection ? `/collections/${collection.slug}` : '/collections'}
              style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 4 }}
            >
              View all →
            </Link>
            {canSlide && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button aria-label="Previous products" className="slider-arrow" onClick={() => slideBy(-1)}>←</button>
                <button aria-label="Next products" className="slider-arrow" onClick={() => slideBy(1)}>→</button>
              </div>
            )}
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="product-rail" ref={railRef}>
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------------------------------------------- Lookbook */
function Lookbook() {
  return (
    <section style={{ padding: '0 var(--gutter) var(--section-pad)', overflow: 'hidden' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Lookbook · The Mehfil</div>
          <h2 className="serif-display" style={{ fontSize: 'clamp(48px, 6vw, 96px)' }}>
            Worn <em style={{ color: 'var(--gold)', fontWeight: 300 }}>in motion.</em>
          </h2>
        </div>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <Reveal style={{ gridColumn: 'span 5', gridRow: 'span 2' }}>
          <Photo src={IMAGES.lookbook[0]} alt="Lookbook — Ghanta Ghar" ratio="3/4" />
        </Reveal>
        <Reveal style={{ gridColumn: 'span 4' }}>
          <Photo src={IMAGES.lookbook[1]} alt="Lookbook — courtyard" ratio="4/3" />
        </Reveal>
        <Reveal style={{ gridColumn: 'span 3' }}>
          <Photo src={IMAGES.lookbook[2]} alt="Lookbook — golden hour" ratio="4/3" />
        </Reveal>
        <Reveal style={{ gridColumn: 'span 3' }}>
          <Photo src={IMAGES.lookbook[3]} alt="Lookbook — portrait" ratio="3/4" />
        </Reveal>
        <Reveal style={{ gridColumn: 'span 4' }}>
          <Placeholder ratio="3/4" label="LOOKBOOK · 05 · PORTRAIT" kind="model" seed="lb-5" />
        </Reveal>
      </div>
      <Reveal>
        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <Link className="btn btn-outline" to="/collections">View Full Lookbook →</Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------------------------------------------- Reviews */
function ReviewsBlock() {
  const reviews = [
    {
      name: 'Sarah K.', city: 'Karachi', rating: 5,
      text: 'The lawn is unbelievably soft. I ordered the Gulab in dusty rose — the block print is even better in person. Stitched perfectly within a week.',
      verified: true, photos: 2,
    },
    {
      name: 'Hina A.', city: 'Lahore', rating: 5,
      text: 'COD made it so easy to try a new brand. The dupatta alone is worth the price. Will be ordering again for Eid.',
      verified: true, photos: 1,
    },
    {
      name: 'Faiza R.', city: 'Islamabad', rating: 4,
      text: 'Beautiful packaging, beautiful fabric — you can feel the Lyallpur weave. Took an extra day to arrive but they kept me updated on WhatsApp.',
      verified: true, photos: 0,
    },
  ];
  return (
    <section style={{ background: 'var(--paper-warm)', padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 56 }}>
          <div>
            <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>The Verdict</div>
            <h2 className="serif-display" style={{ fontSize: 'clamp(40px, 5vw, 76px)' }}>
              4.9 <em style={{ color: 'var(--gold)', fontWeight: 300, fontStyle: 'italic' }}>/ 5</em>
              <span style={{ fontSize: '0.4em', color: 'var(--muted)', marginLeft: 16, fontStyle: 'normal', fontWeight: 400 }}>
                from 2,400+ reviews
              </span>
            </h2>
          </div>
          <Link to="/collections" style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 4 }}>
            Read all reviews →
          </Link>
        </div>
      </Reveal>
      <Reveal stagger>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: 'var(--paper)', padding: 32, border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} style={{ color: idx < r.rating ? 'var(--gold)' : 'var(--line)', fontSize: 16 }}>★</span>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.5, fontStyle: 'italic', marginBottom: 24, color: 'var(--ink)' }}>
                "{r.text}"
              </p>
              {r.photos > 0 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {Array.from({ length: r.photos }).map((_, idx) => (
                    <Placeholder key={idx} ratio="1/1" kind="flatlay" seed={`review-${i}-${idx}`} label="PHOTO" style={{ width: 56, height: 56 }} />
                  ))}
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 16 }}>{r.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    {r.city}
                  </div>
                </div>
                {r.verified && (
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    ✓ Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------------------------------------------- Newsletter */
function Newsletter() {
  const darkField = {
    color: 'var(--paper)',
    borderBottomColor: 'rgba(250,250,247,0.3)',
  };
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 'var(--section-pad) var(--gutter)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(40px, 6vw, 96px)', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>Become a Patron</div>
          <h2 className="serif-display" style={{ fontSize: 'clamp(44px, 6vw, 88px)', color: 'var(--paper)', marginBottom: 24 }}>
            Rs. 500 off<br />
            <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>your first letter.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.5, color: 'rgba(250,250,247,0.7)', maxWidth: 460 }}>
            Join our list for early access to new collections, private sales and a Rs. 500 voucher delivered to your inbox today.
          </p>
        </Reveal>
        <Reveal>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ background: 'rgba(250,250,247,0.04)', padding: 40, border: '1px solid rgba(184,146,74,0.3)' }}
          >
            <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>Sign up · No spam</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input className="field-underline" placeholder="Full name" style={darkField} />
              <input className="field-underline" type="email" placeholder="Email address" style={darkField} />
              <input className="field-underline" placeholder="WhatsApp (optional)" style={darkField} />
              <button type="submit" className="btn btn-gold" style={{ marginTop: 16 }}>Claim Rs. 500 Voucher →</button>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.4)', textAlign: 'center', marginTop: 8 }}>
                Unsubscribe anytime · Voucher valid 30 days
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Page */
export default function Home() {
  const { products } = useStore();
  return (
    <>
      <Hero products={products} />
      <Marquee items={[
        'COD AVAILABLE NATIONWIDE',
        'FREE SHIPPING OVER RS. 5,000',
        'NEW DROP — MEHFIL EDIT',
        '7-DAY EASY RETURNS',
        'WOVEN IN LYALLPUR',
        'WHATSAPP +92 300 1234567',
      ]} />
      <CollectionsSlider />
      <FeaturedProduct />
      <ProductRail products={products} />
      <Lookbook />
      <ReviewsBlock />
      <TrustStrip />
      <Newsletter />
    </>
  );
}
