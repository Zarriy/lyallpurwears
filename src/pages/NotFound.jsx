// 404 — also used as the pre-launch gate while SITE_LOCKED is true in App.jsx.
// While locked it renders on every route with no site chrome.
import { LogoStacked, LogoMark } from '../components/Logo.jsx';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ink)',
      color: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--sans)',
    }}>
      {/* Watermark monogram */}
      <div style={{
        position: 'absolute',
        right: '-12%',
        bottom: '-18%',
        opacity: 0.05,
        pointerEvents: 'none',
      }}>
        <LogoMark size={720} color="var(--paper)" accent="var(--gold-soft)" />
      </div>

      {/* Edge frame */}
      <div style={{
        position: 'absolute',
        inset: 24,
        border: '1px solid rgba(250,250,247,0.18)',
        pointerEvents: 'none',
      }} />

      {/* Top strip */}
      <div style={{
        padding: '48px 56px 0',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--mono)',
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(250,250,247,0.55)',
        position: 'relative',
        zIndex: 1,
      }}>
        <span>Lyallpur · Faisalabad</span>
        <span>31.4504° N, 73.1350° E</span>
      </div>

      {/* Centre */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        position: 'relative',
        zIndex: 1,
      }}>
        <LogoStacked width={190} color="var(--paper)" accent="var(--gold-soft)" />

        <div className="kicker" style={{ color: 'var(--gold-soft)', margin: '56px 0 20px' }}>
          Error 404 · Page not found
        </div>

        <h1 className="serif-display" style={{ fontSize: 'clamp(64px, 12vw, 160px)', color: 'var(--paper)' }}>
          Still on <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>the loom.</em>
        </h1>

        <p style={{
          fontFamily: 'var(--serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(17px, 2vw, 22px)',
          color: 'rgba(250,250,247,0.75)',
          maxWidth: 520,
          lineHeight: 1.5,
          marginTop: 24,
        }}>
          We&rsquo;re facing some upgradation behind the scenes
          and will be right back with you.
        </p>

        <div style={{ width: 40, height: 1, background: 'var(--gold)', margin: '40px 0' }} />

        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(250,250,247,0.6)',
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <span>WhatsApp 0311 4717323</span>
          <span style={{ color: 'var(--gold-soft)' }}>hello@lyallpurwears.com</span>
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{
        padding: '0 56px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--mono)',
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(250,250,247,0.55)',
        position: 'relative',
        zIndex: 1,
      }}>
        <span>© 2026 Lyallpurwears</span>
        <span>Heritage lawn · Linen</span>
      </div>
    </div>
  );
}
