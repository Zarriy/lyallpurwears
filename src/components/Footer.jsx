// Site footer — stacked SVG logo, link columns, newsletter.
import { Link } from 'react-router-dom';
import { LogoStacked } from './Logo.jsx';

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
        { label: 'Track Order', to: '/contact' },
        { label: 'Shipping & Returns', to: '/contact' },
        { label: 'Size Guide', to: '/contact' },
        { label: 'FAQ', to: '/contact' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      title: 'About',
      items: [
        { label: 'Our Story', to: '/about' },
        { label: 'Craftsmanship', to: '/about' },
        { label: 'Sustainability', to: '/about' },
        { label: 'The City of Looms', to: '/about' },
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
            Heritage textiles from the city of looms. Woven in Lyallpur — old Faisalabad — for women who carry tradition forward.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {['IG', 'FB', 'TT', 'YT'].map((s) => (
              <a key={s} href="#" aria-label={s} style={{ width: 32, height: 32, border: '1px solid rgba(250,250,247,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 10 }}>
                {s}
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
        <div>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 18 }}>The Letter</div>
          <p style={{ color: 'var(--paper-fade-60)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            New drops, private previews and Rs. 500 off your first order.
          </p>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', borderBottom: '1px solid rgba(250,250,247,0.3)' }}>
            <input
              type="email"
              placeholder="Email address"
              style={{ flex: 1, background: 'transparent', border: 0, color: 'var(--paper)', padding: '10px 0', fontFamily: 'var(--sans)', fontSize: 13, outline: 'none' }}
            />
            <button style={{ color: 'var(--gold-soft)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Join →</button>
          </form>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 24, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.5)' }}>
        <span>© 2026 Lyallpurwears · Faisalabad (Lyallpur), Pakistan</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Returns</a>
        </span>
      </div>
    </footer>
  );
}
