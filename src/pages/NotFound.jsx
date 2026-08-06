// 404 — also used as the pre-launch gate while SITE_LOCKED is true in App.jsx.
// While locked it renders on every route with no site chrome.
import { LogoStacked, LogoMark } from '../components/Logo.jsx';

export default function NotFound() {
  return (
    <div className="nf">
      <style>{CSS}</style>

      {/* Watermark monogram */}
      <div className="nf-watermark" aria-hidden="true">
        <LogoMark size={720} color="var(--paper)" accent="var(--gold-soft)" />
      </div>

      {/* Edge frame */}
      <div className="nf-frame" aria-hidden="true" />

      {/* Top strip */}
      <div className="nf-strip nf-strip-top">
        <span>Lyallpur · Faisalabad</span>
        <span>31.4504° N, 73.1350° E</span>
      </div>

      {/* Centre */}
      <div className="nf-center">
        <div className="nf-logo">
          <LogoStacked width={190} color="var(--paper)" accent="var(--gold-soft)" />
        </div>

        <div className="kicker nf-kicker">Error 404 · Page not found</div>

        <h1 className="serif-display nf-title">
          Still on <em>the loom.</em>
        </h1>

        <p className="nf-body">
          We&rsquo;re facing some upgradation behind the scenes
          and will be right back with you.
        </p>

        <div className="nf-rule" />

        <div className="nf-contacts">
          <span>WhatsApp 0311 4717323</span>
          <span className="nf-email">hello@lyallpurwear.pk</span>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="nf-strip nf-strip-bottom">
        <span>© 2026 Lyallpur Wear</span>
        <span>Heritage lawn · Linen</span>
      </div>
    </div>
  );
}

const CSS = `
.nf {
  min-height: 100vh;
  background: var(--ink);
  color: var(--paper);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  font-family: var(--sans);
  /* Keeps every piece of content clear of the edge frame */
  --nf-frame: 24px;
  --nf-pad: clamp(48px, 6vw, 72px);
}
.nf-watermark {
  position: absolute;
  right: -12%;
  bottom: -18%;
  opacity: 0.05;
  pointer-events: none;
}
.nf-frame {
  position: absolute;
  inset: var(--nf-frame);
  border: 1px solid rgba(250, 250, 247, 0.18);
  pointer-events: none;
}
.nf-strip {
  padding: 0 var(--nf-pad);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(250, 250, 247, 0.55);
  position: relative;
  z-index: 1;
  white-space: nowrap;
}
.nf-strip-top { padding-top: var(--nf-pad); }
.nf-strip-bottom { padding-bottom: var(--nf-pad); }
.nf-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px var(--nf-pad);
  position: relative;
  z-index: 1;
}
.nf-logo svg {
  width: clamp(132px, 38vw, 190px);
  height: auto;
}
.nf-kicker {
  color: var(--gold-soft);
  margin: clamp(32px, 6vh, 56px) 0 20px;
}
.nf-title {
  font-size: clamp(52px, 11vw, 160px);
  color: var(--paper);
}
.nf-title em {
  color: var(--gold-soft);
  font-weight: 300;
}
.nf-body {
  font-family: var(--serif);
  font-style: italic;
  font-size: clamp(16px, 2vw, 22px);
  color: rgba(250, 250, 247, 0.75);
  max-width: 520px;
  line-height: 1.55;
  margin-top: 24px;
}
.nf-rule {
  width: 40px;
  height: 1px;
  background: var(--gold);
  margin: clamp(28px, 5vh, 40px) 0;
}
.nf-contacts {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(250, 250, 247, 0.6);
  display: flex;
  gap: 16px 32px;
  flex-wrap: wrap;
  justify-content: center;
}
.nf-email { color: var(--gold-soft); }

@media (max-width: 640px) {
  .nf {
    --nf-frame: 14px;
    --nf-pad: 28px;
  }
  .nf-strip {
    font-size: 8.5px;
    letter-spacing: 0.14em;
    /* nowrap clips the right-hand span inside .nf's overflow:hidden at
       320px — let the strip stack instead. */
    white-space: normal;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    gap: 4px 12px;
  }
  .nf-title {
    font-size: clamp(44px, 13vw, 160px);
  }
  .nf-contacts {
    flex-direction: column;
    gap: 12px;
    font-size: 10px;
  }
  .nf-watermark {
    right: -45%;
    bottom: -12%;
  }
}
`;
