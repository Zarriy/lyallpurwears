// Where Brevo's double opt-in confirmation link lands (BREVO_DOI_REDIRECT_URL).
//
// The code is NOT in this file. It is served by /api/voucher, which releases
// it only for an address Brevo reports as confirmed and on the list — see the
// threat-model note in netlify/functions/voucher.js. A hardcoded const here
// would have shipped the code in the JS bundle to every visitor.
//
// The confirmation link arrives carrying ?t=<token> — an encrypted copy of the
// subscriber's address that subscribe.js baked into that contact's redirect URL
// (see netlify/functions/_token.js). So the normal path resolves with nothing
// typed. The email form remains for anyone arriving without a usable token: a
// bookmark, a forwarded link, or a key rotation.
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, TrustStrip } from '../components/primitives.jsx';

// `t` is ours (encrypted, minted in subscribe.js). The plain-email keys are a
// safety net in case Brevo itself appends one — never something we generate.
const EMAIL_PARAM_KEYS = ['email', 'EMAIL', 'e', 'contact_email'];

function credentialsFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('t');
  if (token) return { token };
  for (const key of EMAIL_PARAM_KEYS) {
    const v = params.get(key);
    if (v && v.includes('@')) return { email: v.trim() };
  }
  return null;
}

function CopyIcon({ done }) {
  return done ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function VoucherCode({ code, amount, minSpend, expiresAt }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    try {
      // navigator.clipboard needs a secure context; execCommand keeps this
      // working on plain-http previews and older mobile browsers.
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const el = document.createElement('textarea');
        el.value = code;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied (permissions, insecure context). The code is visible
      // on screen either way, so say nothing rather than throw an error at
      // someone who can simply read it.
    }
  }, [code]);

  return (
    <div style={{ marginTop: 44 }}>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy voucher code ${code}`}
        style={{
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '26px 24px',
          border: '1px dashed var(--gold)',
          background: 'rgba(184,146,74,0.08)',
          cursor: 'pointer',
          color: 'var(--paper)',
          transition: 'background 0.3s var(--ease)',
        }}
      >
        <span style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(24px, 4.5vw, 34px)', letterSpacing: '0.2em', fontWeight: 500 }}>
          {code}
        </span>
        <span style={{ color: copied ? 'var(--gold-soft)' : 'rgba(250,250,247,0.55)', display: 'flex', flexShrink: 0 }}>
          <CopyIcon done={copied} />
        </span>
      </button>

      {/* aria-live so a screen reader announces the copy without moving focus. */}
      <div
        aria-live="polite"
        style={{
          marginTop: 12,
          fontFamily: 'var(--mono)',
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: copied ? 'var(--gold-soft)' : 'rgba(250,250,247,0.45)',
        }}
      >
        {copied ? 'Copied to clipboard' : 'Tap the code to copy'}
      </div>

      <p style={{ fontFamily: 'var(--serif)', fontSize: 17, lineHeight: 1.7, color: 'rgba(250,250,247,0.7)', marginTop: 24, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
        Rs. {amount} off your first order over Rs. {minSpend.toLocaleString('en-PK')}. Enter it in the
        discount box at checkout and it comes off your total.
      </p>
      {/* Say it plainly. A code that silently stops working the second time is
          a support ticket; a code labelled single-use is just a rule. */}
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.45)', marginTop: 16 }}>
        Yours alone · one use{expiresAt ? ` · expires ${expiresAt}` : ''}
      </p>
    </div>
  );
}

export default function Welcome() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | checking | ok | error
  const [error, setError] = useState('');
  const [voucher, setVoucher] = useState(null);

  // Takes either { token } from the confirmation link or { email } typed in.
  const lookup = useCallback(async (credentials) => {
    setStatus('checking');
    setError('');
    try {
      const res = await fetch('/api/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus('error');
        setError(data.error || 'We could not check your signup. Please try again shortly.');
        return;
      }
      setVoucher({
        code: data.code,
        amount: data.amount,
        minSpend: data.minSpend,
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          : null,
      });
      setStatus('ok');
    } catch {
      setStatus('error');
      setError('Network error. Please check your connection and try again.');
    }
  }, []);

  // The confirmation click resolves without the visitor typing anything.
  useEffect(() => {
    const fromUrl = credentialsFromLocation();
    if (fromUrl) {
      if (fromUrl.email) setEmail(fromUrl.email);
      lookup(fromUrl);
    }
    // A page that exists to display a discount code has no business in search
    // results — indexed voucher pages end up scraped onto coupon aggregators.
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, [lookup]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (status === 'checking') return;
    lookup({ email: email.trim() });
  };

  return (
    <div>
      <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 'var(--section-pad) var(--gutter)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
              {status === 'ok' ? "You're on the list" : 'Almost there'}
            </div>
            <h1 className="serif-display" style={{ fontSize: 'clamp(44px, 6vw, 84px)', color: 'var(--paper)', marginBottom: 24, lineHeight: 1.1 }}>
              {status === 'ok' ? (
                <>
                  Confirmed.<br />
                  <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>Here's your Rs. 500.</em>
                </>
              ) : (
                <>
                  Claim your<br />
                  <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>Rs. 500.</em>
                </>
              )}
            </h1>
          </Reveal>

          {status === 'ok' && voucher ? (
            <Reveal>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.75)', maxWidth: 480, margin: '0 auto' }}>
                Thank you for confirming. The code below is yours for the next 30 days.
              </p>
              <VoucherCode code={voucher.code} amount={voucher.amount} minSpend={voucher.minSpend} expiresAt={voucher.expiresAt} />
            </Reveal>
          ) : (
            <Reveal>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.75)', maxWidth: 480, margin: '0 auto 32px' }}>
                Confirm the address you signed up with and we'll show your code.
              </p>
              <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="field-underline"
                  style={{ color: 'var(--paper)', borderBottomColor: 'rgba(250,250,247,0.3)', textAlign: 'center' }}
                />
                <button type="submit" className="btn btn-gold" disabled={status === 'checking'}>
                  {status === 'checking' ? 'Checking…' : 'Show my code →'}
                </button>
              </form>
              {status === 'error' && (
                <p role="status" aria-live="polite" style={{ marginTop: 20, fontSize: 14, lineHeight: 1.6, color: '#E5A0A0', maxWidth: 420, margin: '20px auto 0' }}>
                  {error}
                </p>
              )}
            </Reveal>
          )}

          <Reveal>
            <div style={{ marginTop: 44, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="btn btn-gold" to="/collections">
                Start shopping
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5h12m0 0L9 1m4 4L9 9" /></svg>
              </Link>
              <Link className="btn btn-outline" to="/size-guide" style={{ borderColor: 'rgba(250,250,247,0.5)', color: 'var(--paper)' }}>
                How it ships
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Same expectation-setter the email carries — a first-time buyer arriving
          here should not still think a stitched garment turns up. */}
      <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
        <Reveal>
          <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
            <div className="kicker kicker-gold" style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
              Before your first order
            </div>
            <h2 className="serif-display" style={{ fontSize: 'var(--display-sm)', marginBottom: 20 }}>
              We sell <em style={{ color: 'var(--gold)', fontWeight: 300 }}>cloth.</em>
            </h2>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)' }}>
              Every article ships unstitched — measured lengths for your own tailor, not a finished
              garment. If you'd rather we stitched it, that's a paid add-on you choose on the
              product page. The <Link to="/size-guide" style={{ borderBottom: '1px solid var(--gold)' }}>size guide</Link> covers both.
            </p>
          </div>
        </Reveal>
      </section>

      <TrustStrip />
    </div>
  );
}
