// Checkout — own chrome (no store header/footer), branded to the storefront
// rather than the blue Shopify mock this started as.
//
// Nothing here decides money. The bag is priced, the discount validated and
// the totals computed by /api/order on the server; this page only *displays*
// figures and posts what was ordered. See netlify/functions/_catalogue.js for
// why. The local totals below exist purely so the summary isn't blank while
// the customer fills the form — the server's numbers replace them on success.
import { useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { SanityImage } from '../components/SanityImage.jsx';
import { Logo } from '../components/Logo.jsx';

// Kept in step with netlify/functions/_pricing.js. If you change one, change
// both — the server is authoritative, this is only the on-screen estimate.
// Shipping is free on every order and prices are tax-inclusive, so both are
// zero; the rows below hide themselves rather than showing "Rs 0".
const TAX_RATE = 0;
const FLAT_SHIPPING = 0;

const fmt = (n) => `Rs ${Number(n).toLocaleString('en-PK')}`;

function Check({ checked }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 18, height: 18, flexShrink: 0,
        border: checked ? '1px solid var(--gold)' : '1px solid var(--line)',
        background: checked ? 'var(--gold)' : 'var(--paper)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}
    >
      {checked && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/* ---- Discount code ---- */
// Replaced a "Gift card" input whose Apply button was permanently greyed and
// wired to nothing. Validation is server-side (/api/discount) so the code, its
// minimum spend and its value are never guessable from the bundle.
function DiscountBox({ lines, applied, onApply, onRemove }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle | checking | error
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'checking' || !code.trim()) return;
    setStatus('checking');
    setError('');
    try {
      const res = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), lines }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus('error');
        setError(data.error || 'That code isn’t valid.');
        return;
      }
      setStatus('idle');
      setCode('');
      onApply({ code: data.code, amount: data.discount });
    } catch {
      setStatus('error');
      setError('Could not check that code. Please try again.');
    }
  };

  if (applied) {
    return (
      <div style={{ margin: '4px 0 22px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          padding: '12px 14px', border: '1px dashed var(--gold)', background: 'var(--gold-tint)',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--gold-deep)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {applied.code}
            </span>
          </span>
          <button
            type="button"
            onClick={onRemove}
            style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'underline', flexShrink: 0 }}
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: '4px 0 22px' }}>
      {/* Not a <form>: this sits inside the checkout form, and nesting forms is
          invalid HTML — the browser drops the inner one and Enter would submit
          the order instead of applying the code. */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          className="chk-input"
          placeholder="Discount code"
          value={code}
          onChange={(e) => { setCode(e.target.value); if (status === 'error') { setStatus('idle'); setError(''); } }}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(e); }}
          style={{ flex: 1, textTransform: 'uppercase' }}
          aria-label="Discount code"
        />
        <button
          type="button"
          onClick={submit}
          disabled={status === 'checking' || !code.trim()}
          style={{
            padding: '0 22px',
            border: '1px solid var(--ink)',
            background: code.trim() ? 'var(--ink)' : 'transparent',
            color: code.trim() ? 'var(--paper)' : 'var(--muted)',
            borderColor: code.trim() ? 'var(--ink)' : 'var(--line)',
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: code.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s var(--ease)',
          }}
        >
          {status === 'checking' ? '…' : 'Apply'}
        </button>
      </div>
      {status === 'error' && <div className="chk-err">{error}</div>}
    </div>
  );
}

/* ---- Order summary (right rail) ---- */
function Summary({ items, totals, discountBox }) {
  return (
    <>
      {items.map((l) => {
        const front = l.product.images?.find((i) => i.view === 'FRONT') || l.product.images?.[0] || null;
        return (
          <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 66, height: 66, border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--paper)' }}>
                <SanityImage asset={front?.asset} alt={front?.alt || l.product.name} ratio="1/1" seed={l.product.name} kind="model" />
              </div>
              <span style={{
                position: 'absolute', top: -8, right: -8,
                minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10,
                background: 'var(--ink)', color: 'var(--paper)',
                fontFamily: 'var(--mono)', fontSize: 11,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{l.qty}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17, lineHeight: 1.25, color: 'var(--ink)' }}>{l.product.name}</div>
              {/* Null size == unstitched, the default sale — named rather than
                  omitted so the summary matches what actually ships. */}
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 5 }}>
                {[l.product.fabric, l.size ? `Stitched ${l.size}` : 'Unstitched', l.color].filter(Boolean).join(' · ')}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink)' }}>{fmt(l.product.price * l.qty)}</div>
          </div>
        );
      })}

      <div style={{ borderTop: '1px solid var(--line)', marginTop: 22, paddingTop: 20 }} />
      {discountBox}

      <div className="chk-total-row"><span>Subtotal</span><span>{fmt(totals.subtotal)}</span></div>
      {totals.discount > 0 && (
        <div className="chk-total-row" style={{ color: 'var(--gold-deep)' }}>
          <span>Discount</span><span>−{fmt(totals.discount)}</span>
        </div>
      )}
      <div className="chk-total-row">
        <span>Shipping</span>
        <span style={{ color: 'var(--gold-deep)' }}>{totals.shipping === 0 ? 'Free' : fmt(totals.shipping)}</span>
      </div>
      {/* Tax row only when there is tax. Prices are tax-inclusive, so an
          "Estimated taxes Rs 0" line would be noise on every single order. */}
      {totals.taxes > 0 && (
        <div className="chk-total-row"><span>Estimated taxes</span><span>{fmt(totals.taxes)}</span></div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--line)', marginTop: 14, paddingTop: 18 }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>Total</span>
        <span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginRight: 8, letterSpacing: '0.1em' }}>PKR</span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 500 }}>{fmt(totals.total)}</span>
        </span>
      </div>
    </>
  );
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newsOptIn, setNewsOptIn] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [placed, setPlaced] = useState(null); // server response once done

  // Lines in the shape the API expects — identity and quantity only, no money.
  const apiLines = useMemo(
    () => items.map((l) => ({ slug: l.product.slug, qty: l.qty, size: l.size, colour: l.color })),
    [items]
  );

  const totals = useMemo(() => {
    const d = Math.min(discount?.amount || 0, subtotal);
    const goods = subtotal - d;
    const shipping = FLAT_SHIPPING;
    const taxes = Math.round(goods * TAX_RATE);
    return { subtotal, discount: d, shipping, taxes, total: goods + shipping + taxes };
  }, [subtotal, discount]);

  const onApplyDiscount = useCallback((d) => setDiscount(d), []);
  const onRemoveDiscount = useCallback(() => setDiscount(null), []);

  const completeOrder = async (e) => {
    e.preventDefault();
    if (processing) return;

    const errs = {};
    if (!email.trim()) errs.email = 'Enter an email address';
    // Loose on purpose — Pakistani numbers get typed as 0300…, +92 300…,
    // 0092… and with spaces or dashes. Reject only what is clearly not a
    // number rather than bouncing a real customer over formatting.
    if (!phone.trim()) errs.phone = 'Enter a number our rider can call';
    else if (phone.replace(/\D/g, '').length < 10) errs.phone = 'That number looks too short';
    if (!lastName.trim()) errs.lastName = 'Enter a last name';
    if (!address.trim()) errs.address = 'Enter an address';
    if (!city.trim()) errs.city = 'Enter a city';
    setErrors(errs);
    setFormError('');
    if (Object.keys(errs).length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { firstName, lastName, email, phone },
          shipping: { address, apartment, city, postalCode: postal },
          lines: apiLines,
          discountCode: discount?.code || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setProcessing(false);
        // The code was spent between quoting and submitting (single-use, and
        // someone else got there first). Drop it so the summary stops showing
        // a discount that no longer applies and the total is honest again.
        if (data.discountRejected) setDiscount(null);
        setFormError(data.error || 'We could not place your order. Please try again, or WhatsApp us.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      // Only clear the bag once the order is safely stored. Clearing first
      // would lose the customer's basket if the write failed.
      setPlaced(data);
      clear();
      window.scrollTo(0, 0);
    } catch {
      setProcessing(false);
      setFormError('Network error. Please check your connection and try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const field = (err) => `chk-input${err ? ' chk-input-error' : ''}`;

  const chrome = (children) => (
    <div className="chk-root">
      <style>{CHK_CSS}</style>
      <header className="chk-header">
        <div className="chk-header-inner">
          <Link to="/" aria-label="Lyallpur Wear — home" style={{ display: 'inline-flex' }}>
            <Logo height={34} color="var(--ink)" accent="var(--gold)" />
          </Link>
          <Link to="/cart" aria-label="Back to bag" style={{ color: 'var(--ink)', display: 'inline-flex' }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 7h12l1 13a1.6 1.6 0 0 1-1.6 1.7H6.6A1.6 1.6 0 0 1 5 20z" />
              <path d="M9 9.5V6a3 3 0 0 1 6 0v3.5" />
            </svg>
          </Link>
        </div>
      </header>
      {children}
    </div>
  );

  /* ---------- confirmation ---------- */
  if (placed) {
    const t = placed.totals;
    return chrome(
      <div className="chk-thanks">
        <div className="chk-thanks-hero">
          <div className="chk-thanks-inner">
            <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 22, display: 'flex', justifyContent: 'center' }}>
              Order {placed.orderNumber}
            </div>
            <h1 className="serif-display chk-thanks-title">
              Shukriya{placed.customer?.firstName ? `, ${placed.customer.firstName}` : ''}.<br />
              <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>It's ours to carry now.</em>
            </h1>
            {/* Only promise WhatsApp if we actually have a number. This used
                to say "We'll be in touch on WhatsApp" unconditionally, even
                when the customer left the phone field blank. */}
            <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.75)', maxWidth: 520, margin: '22px auto 0' }}>
              Your cloth is being pulled and checked in Faisalabad.{' '}
              {phone.trim()
                ? "We'll message you on WhatsApp before the rider sets out."
                : "We'll email you before the rider sets out."}
            </p>

            <div className="chk-thanks-cod">
              <div className="kicker" style={{ color: 'rgba(250,250,247,0.55)', marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
                Keep ready in cash
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(38px, 6vw, 54px)', color: 'var(--paper)', lineHeight: 1 }}>
                {fmt(t.total)}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginTop: 12 }}>
                Cash on delivery · {placed.shippingCity}
              </div>
            </div>
          </div>
        </div>

        <div className="chk-thanks-body">
          <div className="chk-thanks-steps">
            {[
              // Step 01 reports what actually happened. Saying "we've emailed
              // you" when the send failed sends the customer hunting through
              // spam for a message that does not exist.
              placed.confirmationEmailSent
                ? ['01', 'Confirmation sent', `We've emailed ${placed.customer?.email} with everything below.`]
                : ['01', 'Keep this page', `We couldn't email ${placed.customer?.email} just now — screenshot this or note down ${placed.orderNumber}. Your order is safe with us either way.`],
              ['02', 'Packed & checked', 'Every length is measured and inspected before it is boxed.'],
              ['03', 'On its way', 'Free delivery in 2–4 working days. The rider calls before they set out.'],
            ].map(([n, title, body]) => (
              <div key={n} style={{ borderTop: '1px solid var(--line)', paddingTop: 18 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.16em', marginBottom: 10 }}>{n}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 21, marginBottom: 8 }}>{title}</div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{body}</p>
              </div>
            ))}
          </div>

          <div className="chk-thanks-receipt">
            <div className="kicker kicker-gold" style={{ marginBottom: 18 }}>Your order</div>
            {placed.lines.map((l, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid var(--line-soft)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>{l.productName}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 5 }}>
                    {[l.fabric, l.stitching, `×${l.qty}`].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13, whiteSpace: 'nowrap' }}>{fmt(l.lineTotal)}</div>
              </div>
            ))}
            <div className="chk-total-row"><span>Subtotal</span><span>{fmt(t.subtotal)}</span></div>
            {t.discount > 0 && (
              <div className="chk-total-row" style={{ color: 'var(--gold-deep)' }}>
                <span>Discount{placed.discountCode ? ` · ${placed.discountCode}` : ''}</span><span>−{fmt(t.discount)}</span>
              </div>
            )}
            <div className="chk-total-row"><span>Shipping</span><span style={{ color: 'var(--gold-deep)' }}>{t.shipping === 0 ? 'Free' : fmt(t.shipping)}</span></div>
            {t.taxes > 0 && <div className="chk-total-row"><span>Taxes</span><span>{fmt(t.taxes)}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--line)', marginTop: 14, paddingTop: 16 }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 19 }}>Due on delivery</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 500 }}>{fmt(t.total)}</span>
            </div>

            <div style={{ marginTop: 24, padding: 16, background: 'var(--paper-warm)', fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.7, color: 'var(--muted)' }}>
              A reminder: everything ships <strong style={{ color: 'var(--ink)' }}>unstitched</strong> — measured
              lengths for your own tailor — unless you chose a stitched size.
            </div>
          </div>
        </div>

        <div className="chk-thanks-foot">
          <button className="chk-pay" style={{ width: 'auto', padding: '16px 34px' }} onClick={() => navigate('/collections')}>
            Continue shopping
          </button>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--muted)' }}>
            Something wrong? <Link to="/contact" style={{ color: 'var(--ink)', borderBottom: '1px solid var(--gold)' }}>Tell us</Link> — quote {placed.orderNumber}.
          </div>
        </div>
      </div>
    );
  }

  /* ---------- empty cart guard ---------- */
  if (items.length === 0) {
    return chrome(
      <div className="chk-grid">
        <div className="chk-left" style={{ paddingTop: 64 }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 34, marginBottom: 10 }}>Your bag is empty</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>Add a few pieces to your bag before checking out.</p>
          <Link to="/collections" className="chk-pay" style={{ display: 'inline-flex', width: 'auto', padding: '15px 28px', textDecoration: 'none' }}>
            Shop the collection
          </Link>
        </div>
        <div className="chk-right" />
      </div>
    );
  }

  /* ---------- main checkout ---------- */
  return chrome(
    <div className="chk-grid">
      {/* Left — form */}
      <div className="chk-left">
        <form onSubmit={completeOrder} noValidate>
          {formError && (
            <div role="alert" style={{ border: '1px solid #E5A0A0', background: '#FDF3F3', padding: '14px 16px', marginBottom: 22, fontSize: 14, color: '#8E3B38', lineHeight: 1.6 }}>
              {formError}
            </div>
          )}

          <h2 className="chk-h2">Contact</h2>
          <input
            className={field(errors.email)}
            placeholder="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: 14 }}
          />
          {errors.email && <div className="chk-err">{errors.email}</div>}
          {/* Required, not optional. This is a cash-on-delivery store: the
              rider phones before they set out, so an order without a number
              is one the courier may simply fail to deliver. */}
          <input
            className={field(errors.phone)}
            placeholder="WhatsApp / mobile number"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginTop: 12 }}
          />
          {errors.phone ? (
            <div className="chk-err">{errors.phone}</div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
              Our rider calls this number before delivery.
            </div>
          )}
          <label className="chk-check">
            <input type="checkbox" checked={newsOptIn} onChange={(e) => setNewsOptIn(e.target.checked)} />
            <Check checked={newsOptIn} />
            Email me about new drops and private sales
          </label>

          <h2 className="chk-h2" style={{ margin: '34px 0 14px' }}>Delivery</h2>
          <div className="chk-select-wrap">
            <label>Country/Region</label>
            <select defaultValue="Pakistan">
              <option>Pakistan</option>
            </select>
            <svg className="chk-chevron" width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5l5 5 5-5" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="chk-row">
            <div>
              <input className="chk-input" placeholder="First name (optional)" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <input className={field(errors.lastName)} placeholder="Last name" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              {errors.lastName && <div className="chk-err">{errors.lastName}</div>}
            </div>
          </div>
          <input className={field(errors.address)} placeholder="Address" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} style={{ marginBottom: 12 }} />
          {errors.address && <div className="chk-err" style={{ marginTop: -8, marginBottom: 12 }}>{errors.address}</div>}
          <input className="chk-input" placeholder="Apartment, suite, etc. (optional)" value={apartment} onChange={(e) => setApartment(e.target.value)} style={{ marginBottom: 12 }} />
          <div className="chk-row">
            <div>
              <input className={field(errors.city)} placeholder="City" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
              {errors.city && <div className="chk-err">{errors.city}</div>}
            </div>
            <div>
              <input className="chk-input" placeholder="Postal code (optional)" autoComplete="postal-code" value={postal} onChange={(e) => setPostal(e.target.value)} />
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 21, margin: '32px 0 14px' }}>Shipping method</h3>
          <div className="chk-selected-row">
            <span>Standard — nationwide, 2–4 days</span>
            <span>{totals.shipping === 0 ? 'FREE' : fmt(totals.shipping)}</span>
          </div>

          <h2 className="chk-h2" style={{ margin: '34px 0 4px' }}>Payment</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>You pay the rider when the parcel reaches you.</p>

          <div>
            <div className="chk-selected-row" style={{ borderBottom: 0 }}>
              <span>Cash on Delivery</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5v9M9.6 14c.3 1 1.2 1.6 2.4 1.6 1.4 0 2.4-.7 2.4-1.8 0-2.3-4.6-1.1-4.6-3.3 0-1 .9-1.7 2.2-1.7 1.1 0 1.9.6 2.2 1.4" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ border: '1px solid var(--line)', borderTop: 0, background: 'var(--paper-warm)', padding: 18 }}>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.8 }}>
                <li>Keep <b style={{ color: 'var(--ink)' }}>{fmt(totals.total)}</b> ready in cash</li>
                <li>Delivery within 2–4 working days, nationwide</li>
                <li>7-day returns on unworn pieces, uncut cloth</li>
              </ul>
            </div>
          </div>

          <button type="submit" className="chk-pay" disabled={processing} style={{ marginTop: 26 }}>
            {processing ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span className="chk-spinner" aria-hidden="true" />
                Placing your order…
              </span>
            ) : (
              `Complete order · ${fmt(totals.total)}`
            )}
          </button>

          <div style={{ borderTop: '1px solid var(--line)', marginTop: 30, paddingTop: 16, display: 'flex', gap: 20 }}>
            <Link to="/privacy" className="chk-footlink">Privacy policy</Link>
            <Link to="/shipping-returns" className="chk-footlink">Shipping &amp; returns</Link>
            <Link to="/contact" className="chk-footlink">Contact</Link>
          </div>
        </form>
      </div>

      {/* Right — order summary */}
      <div className="chk-right">
        <div className="chk-right-inner">
          <Summary
            items={items}
            totals={totals}
            discountBox={
              <DiscountBox lines={apiLines} applied={discount} onApply={onApplyDiscount} onRemove={onRemoveDiscount} />
            }
          />
        </div>
      </div>
    </div>
  );
}

const CHK_CSS = `
.chk-root {
  min-height: 100vh;
  background: var(--paper);
  font-family: var(--sans);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
.chk-header {
  border-bottom: 1px solid var(--line);
  background: var(--paper);
}
.chk-header-inner {
  max-width: 1290px;
  margin: 0 auto;
  padding: 20px 38px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chk-grid {
  max-width: 1290px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 57% 43%;
  align-items: stretch;
  min-height: calc(100vh - 76px);
}
/* Left is the working surface (paper), right is the ledger (warm) — two
   different jobs, so two different grounds. */
.chk-left { padding: 40px 44px 60px 38px; display: block; }
.chk-left form, .chk-left > * { max-width: 660px; margin-left: auto; }
.chk-right {
  background: var(--paper-warm);
  border-left: 1px solid var(--line);
  padding: 40px 38px 60px 44px;
}
.chk-right-inner { max-width: 520px; position: sticky; top: 38px; }
.chk-h2 { font-family: var(--serif); font-size: 25px; font-weight: 500; }
.chk-input {
  width: 100%;
  padding: 14px 14px;
  border: 1px solid var(--line);
  background: var(--paper);
  font-family: var(--sans);
  font-size: 14px;
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.chk-input::placeholder { color: var(--muted); }
.chk-input:focus { border-color: var(--gold); box-shadow: 0 0 0 1px var(--gold); }
.chk-input-error { border-color: #C0564F; background: #FDF6F5; }
.chk-err { color: #C0564F; font-size: 12.5px; margin-top: 6px; }
.chk-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.chk-check {
  display: flex; align-items: center; gap: 11px;
  font-size: 14px; color: var(--ink); margin-top: 16px; cursor: pointer; user-select: none;
}
.chk-check input { position: absolute; opacity: 0; pointer-events: none; }
.chk-select-wrap { position: relative; margin-bottom: 12px; }
.chk-select-wrap label {
  position: absolute; top: 7px; left: 14px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--muted); pointer-events: none;
}
.chk-select-wrap select {
  width: 100%; appearance: none;
  padding: 25px 40px 9px 14px;
  border: 1px solid var(--line); background: var(--paper);
  font-family: var(--sans); font-size: 14px; color: var(--ink); outline: none;
}
.chk-select-wrap select:focus { border-color: var(--gold); box-shadow: 0 0 0 1px var(--gold); }
.chk-chevron { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; }
/* The one selected option in a group — gold-tinted rather than Shopify blue. */
.chk-selected-row {
  border: 1px solid var(--gold);
  background: var(--gold-tint);
  padding: 16px 18px;
  display: flex; justify-content: space-between; align-items: center;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink);
}
.chk-total-row {
  display: flex; justify-content: space-between;
  font-size: 14px; color: var(--ink); margin-bottom: 10px;
}
.chk-pay {
  width: 100%;
  padding: 18px;
  border: 1px solid var(--gold);
  background: var(--gold);
  color: var(--paper);
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.25s var(--ease), border-color 0.25s var(--ease);
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
}
.chk-pay:hover:not(:disabled) { background: var(--gold-deep); border-color: var(--gold-deep); }
.chk-pay:disabled { opacity: 0.75; cursor: default; }
.chk-footlink {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--muted);
}
.chk-footlink:hover { color: var(--ink); }
.chk-spinner {
  width: 13px; height: 13px;
  border: 1.5px solid rgba(250,250,247,0.35);
  border-top-color: var(--paper);
  border-radius: 50%;
  display: inline-block;
  animation: chk-spin 0.6s linear infinite;
}
@keyframes chk-spin { to { transform: rotate(360deg); } }

/* ---- Thank you ---- */
.chk-thanks-hero {
  background: var(--ink);
  color: var(--paper);
  padding: clamp(56px, 8vw, 96px) var(--gutter);
  text-align: center;
}
.chk-thanks-inner { max-width: 720px; margin: 0 auto; }
.chk-thanks-title {
  font-size: clamp(38px, 5.5vw, 68px);
  color: var(--paper);
  line-height: 1.12;
}
.chk-thanks-cod {
  margin: 44px auto 0;
  max-width: 420px;
  padding: 30px 24px;
  border: 1px dashed var(--gold);
  background: rgba(184,146,74,0.08);
}
.chk-thanks-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(48px, 6vw, 80px) var(--gutter) 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: start;
}
.chk-thanks-steps { display: flex; flex-direction: column; gap: 28px; }
.chk-thanks-receipt { border: 1px solid var(--line); padding: 28px; background: var(--paper); }
.chk-thanks-foot {
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 64px) var(--gutter) clamp(56px, 7vw, 96px);
  display: flex; align-items: center; justify-content: space-between;
  gap: 20px; flex-wrap: wrap;
}
@media (max-width: 999px) {
  .chk-grid { grid-template-columns: 1fr; min-height: 0; }
  .chk-right { order: -1; border-left: 0; border-bottom: 1px solid var(--line); padding: 24px 20px; }
  .chk-right-inner { max-width: 660px; margin: 0 auto; position: static; }
  .chk-left { padding: 28px 20px 48px; }
  .chk-left form, .chk-left > * { margin: 0 auto; }
  .chk-thanks-body { grid-template-columns: 1fr; }
}
`;
