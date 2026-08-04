// Size Guide — footer pointed this at /contact, which never covered it at all.
//
// Two audiences on one page: most of the catalogue is sold *unstitched* (you
// get lengths of cloth, not a garment), so the yardage table comes first and
// the body-measurement chart second, for the stitch-to-measure service. The
// measuring diagram is inline SVG rather than a photograph — it has to carry
// labelled callouts, and those need to stay crisp and translatable.
import { Link } from 'react-router-dom';
import { Reveal, PageHero, Accordion, TrustStrip } from '../components/primitives.jsx';

/* Body measurements in inches. Kameez cut with standard ease — see FitNotes. */
const SIZES = [
  { size: 'XS', bust: 34, waist: 30, hip: 37, length: 38, sleeve: 21 },
  { size: 'S', bust: 36, waist: 32, hip: 39, length: 39, sleeve: 21.5 },
  { size: 'M', bust: 38, waist: 34, hip: 41, length: 40, sleeve: 22 },
  { size: 'L', bust: 40, waist: 36, hip: 43, length: 41, sleeve: 22.5 },
  { size: 'XL', bust: 42, waist: 38, hip: 45, length: 42, sleeve: 23 },
];

const YARDAGE = [
  ['2 Piece Lawn', '3.0 m', '2.5 m', '—'],
  ['3 Piece Lawn', '3.0 m', '2.5 m', '2.5 m dupatta'],
  ['3 Piece Khaddar', '3.0 m', '2.5 m', '2.5 m shawl'],
  ['3 Piece Linen', '3.0 m', '2.5 m', '2.5 m dupatta'],
];

/* Labelled kameez schematic. Letters key into the measuring steps below. */
function MeasureDiagram() {
  const dash = { stroke: 'var(--gold)', strokeWidth: 1, strokeDasharray: '4 4' };
  const tick = { fontFamily: 'var(--mono)', fontSize: 13, fill: 'var(--gold)' };
  return (
    <svg viewBox="0 0 320 400" role="img" aria-labelledby="measure-title" style={{ width: '100%', height: 'auto' }}>
      <title id="measure-title">
        A kameez seen from the front, with the bust, waist, hip, length and sleeve measurements marked
      </title>
      {/* Kameez body + sleeves */}
      <path
        d="M112 56 L128 48 Q150 62 172 48 L188 56 L214 140 L196 148 L200 316 L100 316 L104 148 L86 140 Z"
        fill="var(--paper-warm)"
        stroke="var(--ink)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Neckline */}
      <path d="M128 48 Q150 78 172 48" fill="none" stroke="var(--ink)" strokeWidth="1.4" />

      {/* A — bust */}
      <line x1="70" y1="112" x2="230" y2="112" {...dash} />
      <text x="238" y="117" {...tick}>A</text>
      {/* B — waist */}
      <line x1="76" y1="176" x2="224" y2="176" {...dash} />
      <text x="238" y="181" {...tick}>B</text>
      {/* C — hip */}
      <line x1="76" y1="240" x2="224" y2="240" {...dash} />
      <text x="238" y="245" {...tick}>C</text>

      {/* D — shoulder-to-hem length */}
      <line x1="56" y1="56" x2="56" y2="316" stroke="var(--gold)" strokeWidth="1" />
      <line x1="50" y1="56" x2="62" y2="56" stroke="var(--gold)" strokeWidth="1" />
      <line x1="50" y1="316" x2="62" y2="316" stroke="var(--gold)" strokeWidth="1" />
      <text x="32" y="192" {...tick}>D</text>

      {/* E — sleeve, along the arm */}
      <line x1="180" y1="60" x2="212" y2="146" stroke="var(--gold)" strokeWidth="1" />
      <text x="216" y="96" {...tick}>E</text>
    </svg>
  );
}

function Yardage() {
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ marginBottom: 40, maxWidth: 680 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Unstitched</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 20 }}>
            What's actually <em style={{ color: 'var(--gold)', fontWeight: 300 }}>in the bag.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)' }}>
            Most of what we sell is unstitched: lengths of cloth for your own tailor, not a finished
            garment. Sizes don't apply — these are the measured lengths you receive.
          </p>
        </div>
      </Reveal>
      <Reveal>
        <div className="table-scroll">
          <table className="spec-table">
            <thead>
              <tr>
                <th scope="col">Article</th>
                <th scope="col">Shirt</th>
                <th scope="col">Trouser</th>
                <th scope="col">Third piece</th>
              </tr>
            </thead>
            <tbody>
              {YARDAGE.map(([a, b, c, d]) => (
                <tr key={a}>
                  <td>{a}</td>
                  <td>{b}</td>
                  <td>{c}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.7, color: 'var(--muted)', marginTop: 20, maxWidth: 680 }}>
          Lengths are cut generously and measured before dispatch. A standard kameez to knee takes
          about 2.5m, so 3.0m leaves room for a longer cut, wider sleeves or a fuller hem. If you
          need more than the listed length, ask before ordering — we can often add to the cut.
        </p>
      </Reveal>
    </section>
  );
}

function Chart() {
  return (
    <section style={{ background: 'var(--paper-warm)', padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ marginBottom: 48, maxWidth: 680 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Stitched To Measure</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 20 }}>
            Our standard <em style={{ color: 'var(--gold)', fontWeight: 300 }}>sizes.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)' }}>
            Choose a stitched size at checkout and we cut to these. All figures are body
            measurements in inches — not the finished garment, which is cut roomier.
          </p>
        </div>
      </Reveal>
      <div className="split split-start">
        <Reveal>
          <div className="table-scroll">
            <table className="spec-table">
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">A · Bust</th>
                  <th scope="col">B · Waist</th>
                  <th scope="col">C · Hip</th>
                  <th scope="col">D · Length</th>
                  <th scope="col">E · Sleeve</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((s) => (
                  <tr key={s.size}>
                    <td>{s.size}</td>
                    <td>{s.bust}"</td>
                    <td>{s.waist}"</td>
                    <td>{s.hip}"</td>
                    <td>{s.length}"</td>
                    <td>{s.sleeve}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.7, color: 'var(--muted)', marginTop: 20 }}>
            Between two sizes? Take the larger — a kameez is easily taken in at the side seam and
            almost never let out. Trouser length is cut to 38–40" and hemmed to you.
          </p>
        </Reveal>
        <Reveal className="split-media">
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: 32 }}>
            <MeasureDiagram />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowToMeasure() {
  const steps = [
    ['A', 'Bust', 'Around the fullest part of the chest, tape level under the arms and flat across the back. Breathe normally.'],
    ['B', 'Waist', 'Around the narrowest part of the torso, usually an inch above the navel. Keep one finger under the tape.'],
    ['C', 'Hip', 'Around the widest point, roughly 8" below the waist, feet together.'],
    ['D', 'Length', 'From the top of the shoulder beside the neck, straight down to where you want the kameez to end.'],
    ['E', 'Sleeve', 'From the shoulder seam along a slightly bent arm to the wrist bone.'],
  ];
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ marginBottom: 48, maxWidth: 640 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>How To Measure</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)' }}>
            Five numbers, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>one tape.</em>
          </h2>
        </div>
      </Reveal>
      <Reveal stagger>
        <div style={{ borderTop: '1px solid var(--line)', maxWidth: 820 }}>
          {steps.map(([k, t, b]) => (
            <div key={k} style={{ display: 'flex', gap: 28, padding: '24px 0', borderBottom: '1px solid var(--line)', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--gold)', width: 20, flexShrink: 0 }}>{k}</span>
              <div>
                <h3 className="serif-display" style={{ fontSize: 24, marginBottom: 6 }}>{t}</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.7, color: 'var(--muted)' }}>{b}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal>
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, lineHeight: 1.6, color: 'var(--ink)', maxWidth: 620, marginTop: 40 }}>
          Measure over the underwear you'd wear with the suit, not over clothes — and have someone
          else hold the tape if you can. Self-measured busts run small by an inch more often than not.
        </p>
      </Reveal>
    </section>
  );
}

function FitNotes() {
  const items = [
    { title: 'How much ease do you add?', body: 'About 4" at the bust and hip and 3" at the waist, which is the standard relaxed kameez cut in Pakistan. Tell us at checkout if you want it closer or looser and we will note it on the docket.' },
    { title: 'Does lawn shrink?', body: 'Cotton lawn can lose up to 2% on its first hot wash, mostly in length. We pre-account for it in stitched orders. For unstitched cloth, ask your tailor to wash and dry the fabric before cutting if you plan to wash hot.' },
    { title: 'Can I send my own measurements instead of a size?', body: 'Yes, and it is the better option if you know them. Select "Stitched" at checkout and send the five figures over WhatsApp with your order number, or write them in the order notes.' },
    { title: 'What if the stitched piece does not fit?', body: 'If it does not match the measurements you gave us, we alter or remake it at our cost. If the measurements were off, we will still alter it once and only charge the tailoring. See Shipping & Returns for the full position.' },
    { title: 'Do you stitch children\'s or plus sizes?', body: 'Beyond XL we stitch to measurement rather than to a size chart, subject to there being enough cloth in the article — a 3.0m shirt piece limits how far we can go. Message us before ordering and we will tell you honestly whether it will work.' },
  ];
  return (
    <section style={{ background: 'var(--paper-warm)', padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>Fit Notes</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)' }}>
            Before you <em style={{ color: 'var(--gold)', fontWeight: 300 }}>order.</em>
          </h2>
        </div>
      </Reveal>
      <Reveal>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <Accordion items={items} openFirst={false} />
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <Link className="btn btn-outline" to="/contact">Ask about a fit</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function SizeGuide() {
  return (
    <div>
      <PageHero
        kicker="Size Guide"
        title="Cloth by the metre,"
        accent="or cut to you."
        lede="Nearly everything here is sold unstitched. This page covers both what you get in the bag and how to have it stitched to measure."
      />
      <Yardage />
      <Chart />
      <HowToMeasure />
      <FitNotes />
      <TrustStrip />
    </div>
  );
}
