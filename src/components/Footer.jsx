// Site footer — stacked SVG logo, link columns, newsletter.
import { Link } from 'react-router-dom';
import { LogoStacked } from './Logo.jsx';
import { useSubscribe } from '../hooks/useSubscribe.js';

// Social marks, drawn inline so they inherit the footer's paper/gold palette.
const socials = [
  {
    label: 'Instagram',
    href: '#',
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    path: <path d="M13.2 21.5v-8h2.6l.4-3.2h-3V8.2c0-.9.3-1.5 1.6-1.5h1.6V3.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.7H7.7v3.2h2.6v8z" />,
  },
  {
    label: 'TikTok',
    href: '#',
    path: (
      <>
        <path d="M14 3v11.5M14 3c.4 2.4 2.3 4.2 4.7 4.4" />
        <circle cx="10.7" cy="14.5" r="3.3" />
      </>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    path: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.3 9.6l4.6 2.4-4.6 2.4z" />
      </>
    ),
  },
];

// "The Letter" — same endpoint and state machine as the homepage voucher
// block, tagged with its own source so you can see in Brevo which of the two
// actually converts. Was a form that only called preventDefault().
function LetterSignup() {
  const { status, message, subscribe } = useSubscribe('footer-letter');
  const sending = status === 'sending';

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    subscribe({ email: data.get('email'), website: data.get('website') }).then((ok) => {
      if (ok) form.reset();
    });
  };

  return (
    <div>
      <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 18 }}>The Letter</div>
      <p style={{ color: 'var(--paper-fade-60)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
        New drops, private previews and Rs. 500 off your first order.
      </p>
      <form onSubmit={onSubmit} style={{ display: 'flex', borderBottom: '1px solid rgba(250,250,247,0.3)' }}>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Email address"
          style={{ flex: 1, background: 'transparent', border: 0, color: 'var(--paper)', padding: '10px 0', fontFamily: 'var(--sans)', fontSize: 13, outline: 'none' }}
        />
        {/* Honeypot — see the matching note on the homepage form. */}
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />
        <button
          type="submit"
          disabled={sending}
          style={{ color: 'var(--gold-soft)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}
        >
          {sending ? '…' : 'Join →'}
        </button>
      </form>
      {message && (
        <p
          role="status"
          aria-live="polite"
          style={{
            marginTop: 10, fontSize: 11, lineHeight: 1.6,
            color: status === 'error' ? '#E5A0A0' : 'var(--gold-soft)',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export function Footer() {
  const cols = [
    {
      title: 'Shop',
      items: [
        { label: 'Lawn Collection', to: '/collections/lawn' },
        { label: 'Khaddar', to: '/collections/khaddar' },
        { label: 'Linen', to: '/collections/linen' },
        { label: 'Dupatta', to: '/collections/dupatta' },
        { label: 'All Pieces', to: '/collections' },
      ],
    },
    {
      title: 'Help',
      items: [
        { label: 'Track Order', to: '/track-order' },
        { label: 'Shipping & Returns', to: '/shipping-returns' },
        { label: 'Size Guide', to: '/size-guide' },
        { label: 'FAQ', to: '/faq' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      title: 'About',
      items: [
        { label: 'Our Story', to: '/about' },
        // Was "Craftsmanship", which implied we do the making. We buy.
        { label: 'How We Buy', to: '/about' },
        { label: 'Sustainability', to: '/sustainability' },
        { label: 'The City of Looms', to: '/city-of-looms' },
      ],
    },
  ];
  return (
    <footer className="footer">
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1.2fr', gap: 48, paddingBottom: 64, borderBottom: '1px solid var(--line-on-ink)' }}>
        <div>
          <div style={{ marginBottom: 24 }}>
            <LogoStacked width={170} color="var(--paper)" accent="var(--gold-soft)" />
          </div>
          <p style={{ color: 'var(--paper-fade-60)', fontSize: 13, lineHeight: 1.7, maxWidth: 300, marginBottom: 24 }}>
            Heritage textiles from the city of looms. Chosen in Lyallpur — old Faisalabad — for women who carry tradition forward.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} title={s.label} style={{ width: 32, height: 32, border: '1px solid rgba(250,250,247,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--paper)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {s.path}
                </svg>
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 18 }}>{c.title}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              {c.items.map((i) => (
                <li key={i.label}><Link to={i.to}>{i.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <LetterSignup />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 24, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.5)' }}>
        <span>© 2026 Lyallpur Wear · Faisalabad (Lyallpur), Pakistan</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/shipping-returns">Returns</Link>
        </span>
      </div>
    </footer>
  );
}
