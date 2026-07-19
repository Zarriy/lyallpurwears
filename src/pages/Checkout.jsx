// Checkout — replica of the Shopify checkout reference (own chrome, no store
// header/footer). Card "1" approves, "2" declines, "3" simulates a gateway
// failure, per the on-page testing instructions.
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Placeholder } from '../components/primitives.jsx';

const BLUE = '#0D66F2';
const TAX_RATE = 0.16;

const fmt = (n) =>
  `Rs ${n.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Check({ checked }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        border: checked ? `1px solid ${BLUE}` : '1px solid #C9C9C9',
        background: checked ? BLUE : '#fff',
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

function QuestionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="8.25" stroke="#707070" strokeWidth="1.5" />
      <path d="M8 7.6a2 2 0 1 1 2.7 1.87c-.5.19-.7.53-.7 1.03v.4" stroke="#707070" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13.8" r="1" fill="#707070" />
    </svg>
  );
}

/* ---- Order summary (right rail + confirmation) ---- */
function Summary({ items, subtotal, shipping, taxes, total }) {
  return (
    <>
      {items.map((l) => (
        <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: 8, border: '1px solid #DEDEDE', overflow: 'hidden', background: '#fff' }}>
              <Placeholder ratio="1/1" seed={l.product.name} kind="model" />
            </div>
            <span style={{
              position: 'absolute', top: -8, right: -8,
              minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10,
              background: 'rgba(0,0,0,0.72)', color: '#fff',
              fontSize: 12, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>{l.qty}</span>
          </div>
          <div style={{ flex: 1, fontSize: 14, color: '#1A1A1A', lineHeight: 1.35 }}>
            {l.product.name}: {l.product.fabric}
            {(l.size || l.color) && (
              <div style={{ fontSize: 12, color: '#545454', marginTop: 2 }}>
                {[l.size, l.color].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
          <div style={{ fontSize: 14, color: '#1A1A1A' }}>{fmt(l.product.price * l.qty)}</div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 12, margin: '6px 0 22px' }}>
        <input className="chk-input" placeholder="Gift card" style={{ flex: 1 }} />
        <button type="button" style={{
          padding: '0 20px', borderRadius: 8, background: '#F0F0F0',
          color: '#8A8A8A', fontSize: 14, fontWeight: 600, border: 0, cursor: 'default',
        }}>Apply</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#1A1A1A', marginBottom: 10 }}>
        <span>Subtotal</span><span>{fmt(subtotal)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#1A1A1A', marginBottom: 10 }}>
        <span>Shipping</span>
        <span style={{ textTransform: shipping === 0 ? 'uppercase' : 'none' }}>{shipping === 0 ? 'Free' : fmt(shipping)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#1A1A1A', marginBottom: 18 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Estimated taxes
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8.25" stroke="#707070" strokeWidth="1.5" />
            <path d="M8 7.6a2 2 0 1 1 2.7 1.87c-.5.19-.7.53-.7 1.03v.4" stroke="#707070" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="13.8" r="1" fill="#707070" />
          </svg>
        </span>
        <span>{fmt(taxes)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A' }}>Total</span>
        <span>
          <span style={{ fontSize: 12, color: '#545454', marginRight: 8, letterSpacing: '0.02em' }}>PKR</span>
          <span style={{ fontSize: 19, fontWeight: 600, color: '#1A1A1A' }}>{fmt(total)}</span>
        </span>
      </div>
    </>
  );
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newsOptIn, setNewsOptIn] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [errors, setErrors] = useState({});
  const [payState, setPayState] = useState(null); // null | 'done'
  const [processing, setProcessing] = useState(false);
  const [orderName, setOrderName] = useState('');
  const [paidTotal, setPaidTotal] = useState(0);

  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 299;
  const taxes = useMemo(() => Math.round(subtotal * TAX_RATE), [subtotal]);
  const total = subtotal + shipping + taxes;

  const completeOrder = (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = 'Enter an email or mobile phone number';
    if (!lastName.trim()) errs.lastName = 'Enter a last name';
    if (!address.trim()) errs.address = 'Enter an address';
    if (!city.trim()) errs.city = 'Enter a city';
    setErrors(errs);
    if (Object.keys(errs).length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setOrderName(`LPW${1000 + Math.floor(Math.random() * 9000)}`);
      setPaidTotal(total);
      setPayState('done');
      clear();
      window.scrollTo(0, 0);
    }, 1100);
  };

  const field = (err) => `chk-input${err ? ' chk-input-error' : ''}`;

  /* ---------- shared chrome ---------- */
  const chrome = (children) => (
    <div className="chk-root">
      <style>{CHK_CSS}</style>
      <header className="chk-header">
        <div className="chk-header-inner">
          <Link to="/" style={{ fontWeight: 700, fontSize: 20, color: '#1A1A1A', letterSpacing: '-0.01em' }}>
            Lyallpurwears
          </Link>
          <Link to="/cart" aria-label="Back to bag" style={{ color: BLUE }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
  if (payState === 'done') {
    return chrome(
      <div className="chk-grid">
        <div className="chk-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="24.5" stroke="#1773B0" strokeWidth="2" />
              <path d="M16 26.5l7 7L36 20" stroke="#1773B0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div style={{ fontSize: 13, color: '#545454' }}>Confirmation #{orderName}</div>
              <h1 style={{ fontSize: 21, fontWeight: 600, color: '#1A1A1A' }}>
                Thank you{firstName ? `, ${firstName}` : ''}!
              </h1>
            </div>
          </div>
          <div style={{ border: '1px solid #DEDEDE', borderRadius: 8, padding: 18, marginTop: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#1A1A1A', marginBottom: 6 }}>Your order is confirmed</div>
            <div style={{ fontSize: 14, color: '#545454' }}>
              You&rsquo;ll receive a confirmation email with your order number shortly. We&rsquo;ll ship to {address ? `${address}, ` : ''}{city || 'your address'} within 2–4 working days — please keep {fmt(paidTotal)} ready in cash for our rider.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, gap: 16, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 14, color: '#545454' }}>
              Need help? <a href="#" style={{ color: BLUE, textDecoration: 'underline' }}>Contact us</a>
            </div>
            <button className="chk-pay" style={{ width: 'auto', padding: '15px 28px' }} onClick={() => navigate('/collections')}>
              Continue shopping
            </button>
          </div>
        </div>
        <div className="chk-right">
          <div className="chk-right-inner">
            <div style={{ fontSize: 14, color: '#545454', marginBottom: 16 }}>Order #{orderName}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A' }}>Due on delivery</span>
              <span>
                <span style={{ fontSize: 12, color: '#545454', marginRight: 8 }}>PKR</span>
                <span style={{ fontSize: 19, fontWeight: 600, color: '#1A1A1A' }}>{fmt(paidTotal)}</span>
              </span>
            </div>
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
          <h1 style={{ fontSize: 21, fontWeight: 600, color: '#1A1A1A', marginBottom: 10 }}>Your cart is empty</h1>
          <p style={{ fontSize: 14, color: '#545454', marginBottom: 24 }}>Add a few pieces to your bag before checking out.</p>
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
          {/* Contact */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <h2 className="chk-h2">Contact</h2>
            <a href="#" style={{ color: BLUE, fontSize: 14, textDecoration: 'underline' }}>Sign in</a>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              className={field(errors.email)}
              placeholder="Email or mobile phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingRight: 44 }}
            />
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
              <QuestionIcon />
            </span>
          </div>
          {errors.email && <div className="chk-err">{errors.email}</div>}
          <label className="chk-check">
            <input type="checkbox" checked={newsOptIn} onChange={(e) => setNewsOptIn(e.target.checked)} />
            <Check checked={newsOptIn} />
            Email me with news and offers
          </label>

          {/* Delivery */}
          <h2 className="chk-h2" style={{ margin: '30px 0 14px' }}>Delivery</h2>
          <div className="chk-select-wrap">
            <label>Country/Region</label>
            <select defaultValue="Pakistan">
              <option>Pakistan</option>
            </select>
            <svg className="chk-chevron" width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5l5 5 5-5" stroke="#545454" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="chk-row">
            <div>
              <input className="chk-input" placeholder="First name (optional)" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <input className={field(errors.lastName)} placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              {errors.lastName && <div className="chk-err">{errors.lastName}</div>}
            </div>
          </div>
          <input className={field(errors.address)} placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} style={{ marginBottom: 12 }} />
          {errors.address && <div className="chk-err" style={{ marginTop: -8, marginBottom: 12 }}>{errors.address}</div>}
          <input className="chk-input" placeholder="Apartment, suite, etc. (optional)" value={apartment} onChange={(e) => setApartment(e.target.value)} style={{ marginBottom: 12 }} />
          <div className="chk-row">
            <div>
              <input className={field(errors.city)} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              {errors.city && <div className="chk-err">{errors.city}</div>}
            </div>
            <div>
              <input className="chk-input" placeholder="Postal code (optional)" value={postal} onChange={(e) => setPostal(e.target.value)} />
            </div>
          </div>
          <label className="chk-check">
            <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />
            <Check checked={saveInfo} />
            Save this information for next time
          </label>

          {/* Shipping method */}
          <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A', margin: '30px 0 14px' }}>Shipping method</h3>
          <div style={{
            border: `1px solid ${BLUE}`, background: '#F2F6FF', borderRadius: 8,
            padding: '17px 18px', display: 'flex', justifyContent: 'space-between',
            fontSize: 14, color: '#1A1A1A',
          }}>
            <span style={{ fontWeight: 600 }}>Standard</span>
            <span style={{ fontWeight: 600 }}>{shipping === 0 ? 'FREE' : fmt(shipping)}</span>
          </div>

          {/* Payment */}
          <h2 className="chk-h2" style={{ margin: '34px 0 4px' }}>Payment</h2>
          <p style={{ fontSize: 13, color: '#545454', marginBottom: 14 }}>All transactions are secure and encrypted.</p>

          <div style={{ borderRadius: 8 }}>
            <div style={{
              border: `1px solid ${BLUE}`, background: '#F2F6FF',
              borderRadius: '8px 8px 0 0', padding: '15px 18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>Cash on Delivery (COD)</span>
              <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                <rect x="0.5" y="0.5" width="37" height="23" rx="3.5" fill="#fff" stroke="#DEDEDE" />
                <circle cx="19" cy="12" r="6.5" stroke="#8A8A8A" strokeWidth="1.5" />
                <path d="M19 8.8v6.4M16.8 13.1c.3.9 1.1 1.4 2.2 1.4 1.3 0 2.2-.6 2.2-1.6 0-2.1-4.2-1-4.2-3 0-.9.8-1.5 2-1.5 1 0 1.7.5 2 1.2" stroke="#8A8A8A" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{
              border: '1px solid #DEDEDE', borderTop: 0,
              borderRadius: '0 0 8px 8px', background: '#FAFAFA', padding: 18,
            }}>
              <div style={{ fontSize: 13.5, color: '#1A1A1A', lineHeight: 1.6 }}>
                Pay in cash when your order arrives at your doorstep. Our rider will call you before delivery.
              </div>
              <ul style={{ margin: '10px 0 0', paddingLeft: 22, fontSize: 13.5, color: '#545454', lineHeight: 1.6 }}>
                <li>Please keep the exact amount ready — <b>{fmt(total)}</b></li>
                <li>Delivery within 2–4 working days, nationwide</li>
                <li>7-day easy returns on unworn pieces</li>
              </ul>
            </div>
          </div>

          <button type="submit" className="chk-pay" disabled={processing} style={{ marginTop: 24, opacity: processing ? 0.7 : 1 }}>
            {processing ? 'Placing order…' : 'Complete order'}
          </button>

          <div style={{ borderTop: '1px solid #ECECEC', marginTop: 30, paddingTop: 16, display: 'flex', gap: 18 }}>
            <a href="#" style={{ color: BLUE, fontSize: 13, textDecoration: 'underline' }}>Privacy policy</a>
            <a href="#" style={{ color: BLUE, fontSize: 13, textDecoration: 'underline' }}>Cancellations</a>
          </div>
        </form>
      </div>

      {/* Right — order summary */}
      <div className="chk-right">
        <div className="chk-right-inner">
          <Summary items={items} subtotal={subtotal} shipping={shipping} taxes={taxes} total={total} />
        </div>
      </div>
    </div>
  );
}

const CHK_CSS = `
.chk-root {
  min-height: 100vh;
  background: #fff;
  font-family: var(--sans);
  color: #1A1A1A;
  -webkit-font-smoothing: antialiased;
}
.chk-header {
  border-bottom: 1px solid #DEDEDE;
  background: #fff;
}
.chk-header-inner {
  max-width: 1290px;
  margin: 0 auto;
  padding: 22px 38px;
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
  min-height: calc(100vh - 69px);
}
.chk-left {
  padding: 38px 44px 56px 38px;
}
.chk-left form, .chk-left > * { max-width: 660px; margin-left: auto; }
.chk-left { display: block; }
.chk-right {
  background: #F5F5F5;
  border-left: 1px solid #DEDEDE;
  padding: 38px 38px 56px 44px;
}
.chk-right-inner {
  max-width: 520px;
  position: sticky;
  top: 38px;
}
.chk-h2 {
  font-size: 21px;
  font-weight: 600;
  color: #1A1A1A;
}
.chk-input {
  width: 100%;
  padding: 13px 12px;
  border: 1px solid #DEDEDE;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #1A1A1A;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.chk-input::placeholder { color: #707070; }
.chk-input:focus {
  border-color: ${'#0D66F2'};
  box-shadow: 0 0 0 1px ${'#0D66F2'};
}
.chk-input-error {
  border-color: #E51C00;
  background: #FFF4F4;
}
.chk-err {
  color: #E51C00;
  font-size: 12.5px;
  margin-top: 6px;
}
.chk-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}
.chk-check {
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 14px;
  color: #1A1A1A;
  margin-top: 14px;
  cursor: pointer;
  user-select: none;
}
.chk-check input { position: absolute; opacity: 0; pointer-events: none; }
.chk-select-wrap {
  position: relative;
  margin-bottom: 12px;
}
.chk-select-wrap label {
  position: absolute;
  top: 7px;
  left: 13px;
  font-size: 12px;
  color: #545454;
  pointer-events: none;
}
.chk-select-wrap select {
  width: 100%;
  appearance: none;
  padding: 24px 40px 8px 12px;
  border: 1px solid #DEDEDE;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #1A1A1A;
  outline: none;
}
.chk-select-wrap select:focus {
  border-color: ${'#0D66F2'};
  box-shadow: 0 0 0 1px ${'#0D66F2'};
}
.chk-chevron {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.chk-pay {
  width: 100%;
  padding: 17px;
  border: 0;
  border-radius: 8px;
  background: ${'#0D66F2'};
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
  font-family: var(--sans);
}
.chk-pay:hover { background: #0A54C8; }
@media (max-width: 999px) {
  .chk-grid {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .chk-right {
    order: -1;
    border-left: 0;
    border-bottom: 1px solid #DEDEDE;
    padding: 24px 20px;
  }
  .chk-right-inner { max-width: 660px; margin: 0 auto; position: static; }
  .chk-left { padding: 28px 20px 48px; }
  .chk-left form, .chk-left > * { margin: 0 auto; }
}
`;
