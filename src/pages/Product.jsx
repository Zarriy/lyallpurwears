// Product detail page — editorial PDP for Lyallpur Wear.
//
// Every piece of PDP copy that has a corresponding CMS field is driven from
// the product doc first, falling back to Site Settings, and only falling
// back to a hardcoded literal (matching the original static design) as a
// last resort — so the page never flashes empty/broken before Sanity is
// configured, and never renders "null/5" or stale placeholder copy once it
// is. See the report for the couple of PDP elements that have no matching
// CMS field at all.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Reveal, TrustStrip, Stars } from '../components/primitives.jsx';
import { SanityImage } from '../components/SanityImage.jsx';
import { Lightbox } from '../components/Lightbox.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useStore, useProductDetail } from '../sanity/useStore.js';
import { formatPrice } from '../data/products.js';

const VIEWS = ['FRONT', 'BACK', 'DETAIL', 'TEXTILE', 'STYLED'];

const DEFAULT_SHIPPING_CELLS = [
  { label: 'Cash on Delivery', sublabel: 'Pay when it arrives', kind: 'cod' },
  { label: 'Free shipping', sublabel: 'On every order', kind: 'shipping' },
  { label: '7-Day Returns', sublabel: 'No questions asked', kind: 'returns' },
  { label: 'Authentic Lawn', sublabel: 'Woven in Lyallpur', kind: 'authentic' },
];

const DEFAULT_CARE_INSTRUCTIONS = 'Cold hand wash separately. Do not bleach. Iron on reverse. Dry in shade.';
const DEFAULT_SHIPPING_RETURNS = '2–4 working days nationwide. Cash on Delivery available. 7-day easy returns on unworn pieces with original tags.';
// Shown only once a stitched size is chosen. Unstitched is the default state
// of the selector, so this describes the paid add-on rather than the product.
const DEFAULT_STITCHING_NOTE = 'Stitched to measure · +Rs. 1,200 · Adds 5–9 days';
const DEFAULT_EDITION_LABEL = 'Mehfil Edit';
const DEFAULT_STOCK_TEMPLATE = 'Only {stock} pieces left';
const DEFAULT_VIEWING_TEMPLATE = '{count} people viewing this in the last hour';
const DEFAULT_VIEWING_COUNT = 14;

function fillTemplate(template, vars) {
  return Object.keys(vars).reduce((str, key) => str.replaceAll(`{${key}}`, String(vars[key])), template);
}

// No siteSettings field exists for an order-cutoff countdown or delivery
// estimate (see report) — computed here instead of left as a hardcoded,
// permanently-stale date.
function useDeliveryLine() {
  return useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setHours(18, 0, 0, 0);
    if (now >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
    const diffMs = cutoff - now;
    const hrs = Math.floor(diffMs / 3_600_000);
    const mins = Math.floor((diffMs % 3_600_000) / 60_000);

    const delivery = new Date(cutoff);
    delivery.setDate(delivery.getDate() + 3);
    const deliveryLabel = delivery.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return `Order in ${hrs}hrs ${mins}min · Delivery by ${deliveryLabel}`;
  }, []);
}

// ---- Product gallery — swipeable main stage + horizontal thumb rail ----
// The stage is a scroll-snap track rather than a single swapped <img>, so
// touch swipe comes free and the arrows/thumbs just drive scrollLeft. Which
// slide is "active" is derived FROM scroll position (not stored separately
// and pushed into it), so a manual swipe, an arrow press and a thumb click
// can never leave the highlight disagreeing with what's on screen.
function Gallery({ product, color }) {
  const stageRef = useRef(null);
  const railRef = useRef(null);
  const [active, setActive] = useState(0);
  // Index the zoom viewer opened on; null means closed.
  const [zoomAt, setZoomAt] = useState(null);

  // Real uploads win: show every image the product actually has, in order.
  // With none (the seeded catalogue has no images yet) fall back to the five
  // canonical VIEWS rendered as procedural art, which is what this page has
  // always shown.
  const slides = useMemo(() => {
    if (product.images?.length) {
      return product.images.map((img, i) => ({
        key: img.asset?._key || `${img.view || 'img'}-${i}`,
        asset: img.asset,
        alt: img.alt || `${product.name} — ${img.view || `image ${i + 1}`}`,
        label: `${product.name.toUpperCase()} · ${(color || '').toUpperCase()} · ${img.view || i + 1}`,
        thumbLabel: img.view || String(i + 1),
        seed: `${product.name}-${img.view || i}`,
      }));
    }
    return VIEWS.map((v) => ({
      key: v,
      asset: null,
      alt: `${product.name} — ${v}`,
      label: `${product.name.toUpperCase()} · ${(color || '').toUpperCase()} · ${v}`,
      thumbLabel: v,
      seed: `${product.name}-${v}`,
    }));
  }, [product.images, product.name, color]);

  const goTo = (i) => {
    const stage = stageRef.current;
    if (!stage) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    stage.scrollTo({ left: clamped * stage.clientWidth, behavior: 'smooth' });
  };

  const onStageScroll = () => {
    const stage = stageRef.current;
    if (!stage || !stage.clientWidth) return;
    const i = Math.round(stage.scrollLeft / stage.clientWidth);
    setActive(Math.max(0, Math.min(slides.length - 1, i)));
  };

  // Keep the selected thumb in view when the stage is swiped past the end of
  // the rail's visible span. `block: 'nearest'` is load-bearing — without it
  // this scrolls the whole page vertically to the gallery on every swipe.
  useEffect(() => {
    const rail = railRef.current;
    const thumb = rail?.children?.[active];
    if (thumb) thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [active]);

  return (
    <div>
      <div className="pdp-stage-frame" style={{ position: 'relative' }}>
        <div className="pdp-stage" ref={stageRef} onScroll={onStageScroll}>
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className="pdp-slide"
              onClick={() => setZoomAt(i)}
              aria-label={`Zoom ${s.alt}`}
            >
              {/* `aspectRatio: auto` releases the 3/4 box so the slide's
                  capped height (--pdp-stage-h) drives the size instead —
                  `ratio` is still passed because the placeholder art and the
                  CDN crop both use it to pick their shape. */}
              <SanityImage
                asset={s.asset}
                alt={s.alt}
                ratio="3/4"
                seed={s.seed}
                label={s.label}
                sizes="(max-width: 960px) 100vw, 60vw"
                objectFit="contain"
                style={{ height: '100%', aspectRatio: 'auto' }}
              />
            </button>
          ))}
        </div>

        {/* Sits on the stage, not inside a slide, so it stays put while the
            images move underneath. */}
        <span className="pdp-zoom-hint" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3M11 8.4v5.2M8.4 11h5.2" />
          </svg>
          Tap to zoom
        </span>

        {slides.length > 1 && (
          <div className="pdp-counter">
            {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </div>
        )}

        {slides.length > 1 && (
          <>
            <button
              className="pdp-nav"
              style={{ left: 16 }}
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="pdp-nav"
              style={{ right: 16 }}
              onClick={() => goTo(active + 1)}
              disabled={active === slides.length - 1}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="pdp-thumb-rail" ref={railRef}>
          {slides.map((s, i) => (
            <button
              key={s.key}
              className="pdp-thumb"
              aria-current={i === active}
              aria-label={`View ${s.thumbLabel}`}
              onClick={() => goTo(i)}
            >
              {/* No explicit height — the button's flex basis sets the width
                  and the 3/4 ratio derives the height, so the image fills the
                  thumb instead of sitting narrow inside it. */}
              <SanityImage asset={s.asset} alt={s.alt} ratio="3/4" seed={s.seed} label={s.thumbLabel} sizes="88px" />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        slides={slides}
        startIndex={zoomAt ?? 0}
        open={zoomAt !== null}
        onClose={() => setZoomAt(null)}
      />
    </div>
  );
}

function ColorSwatches({ colors, selected, onSelect }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="kicker">Colour</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink)' }}>
          {selected}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {colors.map((c) => {
          const on = c.name === selected;
          return (
            <button
              key={c.name}
              title={c.name}
              onClick={() => onSelect(c.name)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: c.hex,
                border: on ? '1.5px solid var(--gold)' : '1px solid var(--line)',
                outline: on ? '3px solid var(--paper)' : 'none',
                outlineOffset: -5,
                cursor: 'pointer',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

const sizeGuideLinkStyle = {
  fontFamily: 'var(--mono)',
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  borderBottom: '1px solid var(--ink)',
  color: 'var(--ink)',
};

function pillStyle(on) {
  return {
    minWidth: 52,
    height: 52,
    padding: '0 16px',
    border: on ? '1.5px solid var(--ink)' : '1px solid var(--line)',
    background: on ? 'var(--ink)' : 'var(--paper)',
    color: on ? 'var(--paper)' : 'var(--ink)',
    fontFamily: 'var(--mono)',
    fontSize: 12,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.3s var(--ease)',
  };
}

const shipsNoteStyle = {
  marginTop: 12,
  fontFamily: 'var(--mono)',
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
};

// We sell cloth. Stitching is a paid add-on, so unstitched is the default
// state of this control and picking a size is how you opt in — the reverse of
// how it read before, which labelled the row "Size · Stitched", preselected M
// and demoted unstitched to a footnote ("Or order unstitched"). That framed
// the add-on as the product and the product as the alternative.
//
// Renders on EVERY product, including the ones with no stitched sizes set —
// which today is all of them. Gating the whole block on `sizes.length > 0`
// (as it was) meant the page never said what arrives in the parcel at all:
// "3 Piece Lawn — Shirt · Dupatta · Trouser" reads like a finished outfit
// unless something states otherwise. With no sizes configured this degrades
// to a plain "ships unstitched" line rather than a one-option button group.
function StitchingSelector({ sizes, selected, onSelect, stitchingNote, sizeGuideUrl }) {
  const isExternal = sizeGuideUrl && /^https?:\/\//i.test(sizeGuideUrl);
  const unstitched = selected == null;
  const offersStitching = sizes.length > 0;

  const guideLink = sizeGuideUrl ? (
    isExternal ? (
      <a href={sizeGuideUrl} target="_blank" rel="noopener noreferrer" style={sizeGuideLinkStyle}>
        Size guide ↗
      </a>
    ) : (
      <Link to={sizeGuideUrl} style={sizeGuideLinkStyle}>
        Size guide ↗
      </Link>
    )
  ) : (
    <Link to="/size-guide" style={sizeGuideLinkStyle}>
      Size guide ↗
    </Link>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="kicker">{offersStitching ? 'Stitching · Optional' : 'Unstitched · How It Ships'}</span>
        {guideLink}
      </div>
      {offersStitching && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => onSelect(null)} aria-pressed={unstitched} style={pillStyle(unstitched)}>
            UNSTITCHED
          </button>
          {sizes.map((s) => (
            <button key={s} onClick={() => onSelect(s)} aria-pressed={selected === s} style={pillStyle(selected === s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div style={offersStitching ? shipsNoteStyle : { ...shipsNoteStyle, marginTop: 0 }}>
        {unstitched ? 'Measured lengths of cloth · Stitching not included' : stitchingNote}
      </div>
    </div>
  );
}

function StockUrgency({ stock, stockTemplate, viewingTemplate, viewingCount }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        background: 'var(--gold-tint)',
        border: '1px solid var(--gold-line)',
        marginBottom: 32,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--gold)',
          animation: 'pulse 2s ease infinite',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--gold-deep)',
            fontWeight: 500,
          }}
        >
          {fillTemplate(stockTemplate, { stock })}
        </div>
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 14,
            fontStyle: 'italic',
            color: 'var(--ink)',
            marginTop: 2,
          }}
        >
          {fillTemplate(viewingTemplate, { count: viewingCount })}
        </div>
      </div>
    </div>
  );
}

function ShippingPanel({ cells, deliveryLine }) {
  const cell = (icon, title, sub, key) => (
    <div key={key} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      {icon}
      <div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>{title}</div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
  const codPill = (
    <div
      style={{
        background: 'var(--gold)',
        color: 'var(--paper)',
        padding: '4px 8px',
        fontFamily: 'var(--mono)',
        fontSize: 9,
        letterSpacing: '0.14em',
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      COD
    </div>
  );
  const box = (
    <div
      style={{
        width: 28,
        height: 28,
        border: '1px solid var(--line)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
      </svg>
    </div>
  );
  const rows = (cells?.length ? cells : DEFAULT_SHIPPING_CELLS).slice(0, 4);
  return (
    <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24, marginTop: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {rows.map((c, i) => cell(c.kind === 'cod' ? codPill : box, c.label, c.sublabel, i))}
      </div>
      <div
        style={{
          background: 'var(--paper-warm)',
          padding: 14,
          fontFamily: 'var(--mono)',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          textAlign: 'center',
          color: 'var(--ink)',
        }}
      >
        {deliveryLine}
      </div>
    </div>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ borderTop: '1px solid var(--line)', marginTop: 32 }}>
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '20px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{it.title}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 14 }}>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div
              style={{
                paddingBottom: 24,
                fontFamily: 'var(--serif)',
                fontSize: 16,
                lineHeight: 1.6,
                color: 'var(--muted)',
                whiteSpace: 'pre-line',
              }}
            >
              {it.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---- Write-a-review form — posts to /api/submit-review ----
function ReviewForm({ productSlug }) {
  const [values, setValues] = useState({ authorName: '', city: '', rating: 5, title: '', text: '', website: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [fieldErrors, setFieldErrors] = useState([]);
  const [formError, setFormError] = useState(null);

  function update(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setFieldErrors([]);
    setFormError(null);
    try {
      const res = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug, ...values, rating: Number(values.rating) }),
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        // non-JSON error body — fall through to the generic message below
      }
      if (res.ok) {
        setStatus('success');
        setValues({ authorName: '', city: '', rating: 5, title: '', text: '', website: '' });
      } else {
        setStatus('error');
        setFieldErrors(Array.isArray(data.details) ? data.details : []);
        setFormError(data.error || 'Something went wrong — please try again.');
      }
    } catch {
      setStatus('error');
      setFormError('Network error — please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ borderTop: '1px solid var(--line)', paddingTop: 32, marginTop: 32 }}>
        <p className="serif-display" style={{ fontSize: 22, fontStyle: 'italic' }}>
          Thank you — your review will appear once approved.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ borderTop: '1px solid var(--line)', paddingTop: 32, marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18 }}
    >
      <div className="kicker kicker-gold">Write a review</div>

      {/* Honeypot — real visitors never see this. Must stay empty. */}
      <input
        type="text"
        name="website"
        value={values.website}
        onChange={update('website')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <input
          className="field-underline"
          placeholder="Your name"
          value={values.authorName}
          onChange={update('authorName')}
          required
          maxLength={80}
        />
        <input
          className="field-underline"
          placeholder="City (optional)"
          value={values.city}
          onChange={update('city')}
          maxLength={80}
        />
      </div>

      <div>
        <div className="kicker" style={{ marginBottom: 8 }}>Rating</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setValues((v) => ({ ...v, rating: n }))}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              style={{ fontSize: 22, lineHeight: 1, color: n <= values.rating ? 'var(--gold)' : 'var(--line)' }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <input
        className="field-underline"
        placeholder="Title (optional)"
        value={values.title}
        onChange={update('title')}
        maxLength={140}
      />
      <textarea
        className="field-underline"
        placeholder="Your review"
        rows={4}
        value={values.text}
        onChange={update('text')}
        required
        maxLength={2000}
        style={{ resize: 'vertical' }}
      />

      {formError && (
        <div style={{ color: '#B3261E', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em' }}>
          {formError}
        </div>
      )}
      {fieldErrors.length > 0 && (
        <ul style={{ color: '#B3261E', fontFamily: 'var(--mono)', fontSize: 11, paddingLeft: 18, margin: 0 }}>
          {fieldErrors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        className="btn btn-gold"
        disabled={status === 'submitting'}
        style={{ alignSelf: 'flex-start', opacity: status === 'submitting' ? 0.7 : 1 }}
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
}

function ReviewsSummary({ product }) {
  const { rating, reviews, ratingBreakdown, reviewsList = [] } = product;
  const hasReviews = reviews > 0 && rating != null;
  const bars = [5, 4, 3, 2, 1].map((n) => ({ l: n === 1 ? '1 star' : `${n} stars`, v: ratingBreakdown?.[n] ?? 0 }));

  return (
    <section style={{ padding: '0 var(--gutter) var(--section-pad)' }}>
      <Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 64,
            padding: '80px 0',
            borderTop: '1px solid var(--line)',
          }}
          className="pdp-reviews-grid"
        >
          <div>
            <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>
              {hasReviews ? `Reviews · ${reviews}` : 'Reviews'}
            </div>
            {hasReviews ? (
              <>
                <h2 className="serif-display" style={{ fontSize: 56, marginBottom: 16 }}>
                  {rating}
                  <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>/5</span>
                </h2>
                <Stars value={Math.round(rating)} size={20} />
                <div style={{ marginTop: 20 }}>
                  {bars.map((r) => (
                    <div
                      key={r.l}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr 36px',
                        gap: 12,
                        alignItems: 'center',
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 10,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--muted)',
                        }}
                      >
                        {r.l}
                      </span>
                      <div style={{ height: 4, background: 'var(--line-soft)', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, width: `${r.v * 100}%`, background: 'var(--gold)' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textAlign: 'right' }}>
                        {Math.round(r.v * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="serif-display" style={{ fontSize: 40, fontStyle: 'italic', marginBottom: 12 }}>
                  No reviews <em style={{ color: 'var(--gold)', fontWeight: 300 }}>yet.</em>
                </h2>
                <p style={{ fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--muted)' }}>
                  Be the first to share how this piece wore.
                </p>
              </>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {reviewsList.length > 0 ? (
              reviewsList.slice(0, 6).map((r) => (
                <div key={r._id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Stars value={r.rating} size={12} />
                      <span style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>{r.authorName}</span>
                      {r.city && (
                        <span
                          style={{
                            fontFamily: 'var(--mono)',
                            fontSize: 9,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: 'var(--muted)',
                          }}
                        >
                          {r.city}
                        </span>
                      )}
                    </div>
                    {r.verified && (
                      <span
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 9,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--gold)',
                        }}
                      >
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  {r.title && (
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 500, marginBottom: 6 }}>{r.title}</div>
                  )}
                  <p style={{ fontFamily: 'var(--serif)', fontSize: 19, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 12 }}>
                    "{r.text}"
                  </p>
                  {r.photos?.length > 0 && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      {r.photos.map((photo, idx) => (
                        <SanityImage
                          key={idx}
                          asset={photo}
                          alt={`${r.authorName} — photo ${idx + 1}`}
                          ratio="1/1"
                          seed={`${r.authorName}-${idx}`}
                          label="PHOTO"
                          style={{ width: 64, height: 64 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ border: '1px dashed var(--line)', padding: 32, textAlign: 'center' }}>
                <p className="serif-display" style={{ fontStyle: 'italic', fontSize: 22, marginBottom: 8 }}>
                  Be the first to review.
                </p>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--muted)' }}>
                  Share your experience with this piece below.
                </p>
              </div>
            )}
            <ReviewForm productSlug={product.slug} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function YouMayLike({ product }) {
  const { relatedProducts: computeRelated } = useStore();
  const related = product.relatedProducts?.length ? product.relatedProducts : computeRelated(product, 4);
  return (
    <section style={{ padding: '0 var(--gutter) var(--section-pad)' }}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, gap: 24 }}>
          <h2 className="serif-display" style={{ fontSize: 'clamp(40px, 4vw, 64px)' }}>
            You may also <em style={{ color: 'var(--gold)', fontWeight: 300 }}>love.</em>
          </h2>
          <Link to="/collections" className="kicker" style={{ borderBottom: '1px solid var(--ink)', paddingBottom: 4, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
            View All →
          </Link>
        </div>
      </Reveal>
      <Reveal stagger>
        <div className="pdp-related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 'var(--section-pad) var(--gutter)', textAlign: 'center' }}>
      <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Lyallpur Wear</div>
      <h1 className="serif-display" style={{ fontSize: 'var(--display-lg)', marginBottom: 20 }}>
        This piece could not be found.
      </h1>
      <p style={{ fontFamily: 'var(--serif)', fontSize: 20, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 40 }}>
        The design you are looking for may have sold out or moved. Explore the rest of the edit.
      </p>
      <Link to="/collections" className="btn btn-gold" style={{ display: 'inline-flex' }}>
        Browse the Collection
      </Link>
    </div>
  );
}

// Quiet, editorial-matching skeleton — shimmering blocks instead of a
// spinner, shown only while the per-slug Sanity fetch is in flight (the
// static fallback resolves synchronously, so this never appears when
// Sanity isn't configured).
function ProductSkeleton() {
  return (
    <div style={{ padding: '40px var(--gutter) 120px' }}>
      <div className="pdp-skel-line" style={{ width: 240, height: 12, marginBottom: 32 }} />
      {/* Mirrors the real 60/40 grid and the stage's capped height so the
          layout doesn't jump when the fetch resolves. */}
      <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 6fr) minmax(0, 4fr)', gap: 48 }}>
        <div>
          <div className="pdp-skel-block" style={{ height: 'var(--pdp-stage-h)' }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="pdp-skel-block" style={{ width: 76, aspectRatio: '3/4' }} />
            ))}
          </div>
        </div>
        <div>
          <div className="pdp-skel-line" style={{ width: 120, height: 11, marginBottom: 16 }} />
          <div className="pdp-skel-line" style={{ width: '70%', height: 48, marginBottom: 16 }} />
          <div className="pdp-skel-line" style={{ width: '40%', height: 20, marginBottom: 24 }} />
          <div className="pdp-skel-line" style={{ width: 160, height: 32, marginBottom: 24 }} />
          <div className="pdp-skel-block" style={{ height: 64, marginBottom: 32 }} />
          <div className="pdp-skel-block" style={{ height: 200 }} />
        </div>
      </div>
      <style>{`
        .pdp-skel-line, .pdp-skel-block {
          background: linear-gradient(90deg, var(--line-soft) 25%, var(--paper-warm) 37%, var(--line-soft) 63%);
          background-size: 400% 100%;
          animation: pdp-shimmer 1.6s ease-in-out infinite;
        }
        @keyframes pdp-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
      `}</style>
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();
  const { product, loading } = useProductDetail(slug);
  const { settings, categories } = useStore();
  const { addItem } = useCart();
  const deliveryLine = useDeliveryLine();

  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);

  // Selections depend on the loaded product's own colours/sizes (or the
  // global fallbacks) — (re)initialize once per product, synchronously
  // before paint so there's never a frame with nothing selected.
  useLayoutEffect(() => {
    if (!product) return;
    const c = product.colours ?? [];
    setColor(c[0]?.name ?? null);
    // No size preselected: null *is* unstitched, which is what we actually
    // sell. Preselecting M silently added a Rs. 1,200 stitching charge to
    // every cart line for a customer who only ever wanted the cloth.
    setSize(null);
    setQty(1);
  }, [product]);

  if (loading) return <ProductSkeleton />;
  if (!product) return <NotFound />;

  // Only what the product actually carries. These used to fall back to the
  // demo catalogue's COLORS/SIZES, which advertised four colourways and five
  // stitched sizes on every unstitched suit in the catalogue — options the
  // customer cannot actually buy.
  const colours = product.colours ?? [];
  const sizes = product.sizes ?? [];
  const categoryName = categories.find((c) => c.slug === product.category)?.en || product.category;

  const editionLabel = product.editionLabel || settings?.defaultEditionLabel || DEFAULT_EDITION_LABEL;
  const careInstructions = product.careInstructions || settings?.defaultCareInstructions || DEFAULT_CARE_INSTRUCTIONS;
  const shippingReturns = product.shippingReturns || settings?.defaultShippingReturns || DEFAULT_SHIPPING_RETURNS;
  // Sanity field is still named `unstitchedNote` (renaming it would need a
  // data migration); its Studio title/description now describe the add-on.
  const stitchingNote = product.unstitchedNote || DEFAULT_STITCHING_NOTE;
  const stockTemplate = settings?.stockUrgencyTemplate || DEFAULT_STOCK_TEMPLATE;
  const viewingTemplate = settings?.viewingNowTemplate || DEFAULT_VIEWING_TEMPLATE;
  const viewingCount = settings?.viewingNowCount ?? DEFAULT_VIEWING_COUNT;
  const shippingCells = settings?.shippingCells?.length ? settings.shippingCells : DEFAULT_SHIPPING_CELLS;
  const sizeGuideUrl = settings?.sizeGuideUrl || null;

  const clampedMax = product.stock;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(clampedMax, q + 1));

  return (
    <div>
      <div style={{ padding: '40px var(--gutter) 120px' }}>
        {/* Breadcrumb */}
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: 32,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/collections/${product.category}`}>{categoryName}</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)' }}>{product.name}</span>
        </div>

        {/* 60/40 — gallery left, buy column right. `minmax(0, …fr)` rather
            than literal percentages so the 48px gap comes out of the track
            widths instead of overflowing the row. */}
        <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 6fr) minmax(0, 4fr)', gap: 48, alignItems: 'flex-start' }}>
          {/* Gallery. Keyed by slug so navigating between products remounts
              it and resets the stage to the first image. */}
          <Gallery key={product.slug} product={product} color={color} />

          {/* Sticky info */}
          <div className="pdp-info" style={{ position: 'sticky', top: 120 }}>
            <div className="kicker kicker-gold" style={{ marginBottom: 12 }}>
              {editionLabel} · {product.fabric}
            </div>
            <h1 className="serif-display" style={{ fontSize: 64, marginBottom: 12 }}>
              {product.name}
              {product.urdu && (
                <span className="urdu" lang="ur" style={{ color: 'var(--gold)' }}>
                  {product.urdu}
                </span>
              )}
            </h1>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--muted)', marginBottom: 20 }}>
              {product.fabric} — {product.pieces}
            </div>
            {/* Studio's Description field — "the poetic paragraph under the
                product title" its own help text describes. The longer
                Description (accordion) copy is a separate field, rendered
                further down by <Accordion>. */}
            {product.description && (
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--muted)', marginBottom: 24, maxWidth: '46ch' }}>
                {product.description}
              </p>
            )}
            {product.rating != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Stars value={Math.round(product.rating)} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                  {product.rating} · {product.reviews} reviews
                </span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 38, fontWeight: 500 }}>{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {product.discount && (
                <span className="badge badge-gold">−{product.discount}%</span>
              )}
            </div>

            <StockUrgency stock={product.stock} stockTemplate={stockTemplate} viewingTemplate={viewingTemplate} viewingCount={viewingCount} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 32 }}>
              {colours.length > 0 && <ColorSwatches colors={colours} selected={color} onSelect={setColor} />}
              <StitchingSelector sizes={sizes} selected={size} onSelect={setSize} stitchingNote={stitchingNote} sizeGuideUrl={sizeGuideUrl} />
            </div>

            {/* Qty + Add */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--ink)', height: 56, flexShrink: 0 }}>
                <button onClick={dec} style={{ width: 48, height: '100%', fontFamily: 'var(--mono)' }} aria-label="Decrease quantity">
                  −
                </button>
                <span style={{ width: 36, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 13 }}>{qty}</span>
                <button onClick={inc} style={{ width: 48, height: '100%', fontFamily: 'var(--mono)' }} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <button
                className="btn btn-gold"
                style={{ flex: 1, height: 56, padding: '0 24px' }}
                onClick={() => addItem(product.id, { qty, size, color })}
              >
                Add to Bag · {formatPrice(product.price * qty)}
              </button>
            </div>

            <ShippingPanel cells={shippingCells} deliveryLine={deliveryLine} />

            <Accordion
              items={[
                { title: 'Description', body: product.details },
                { title: 'Care Instructions', body: careInstructions },
                { title: 'Shipping & Returns', body: shippingReturns },
              ]}
            />
          </div>
        </div>
      </div>

      <ReviewsSummary product={product} />
      <YouMayLike product={product} />
      <TrustStrip />

      <style>{`
        @media (max-width: 960px) {
          /* Below this the 50/50 split starves the buy column, so stack:
             full-width gallery, info underneath and no longer sticky. */
          .pdp-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .pdp-info { position: static !important; }
        }
        @media (max-width: 720px) {
          .pdp-reviews-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .pdp-related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
