// About — "The city of looms." Lyallpurwears brand story.
import { Link } from 'react-router-dom';
import { Reveal, Placeholder } from '../components/primitives.jsx';

function Hero() {
  return (
    <section style={{ paddingTop: 'var(--section-pad)' }}>
      <div style={{ padding: `0 var(--gutter)`, maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
        <Reveal>
          <div className="kicker kicker-gold" style={{ marginBottom: 22, display: 'flex', justifyContent: 'center' }}>
            Our Story
          </div>
          <h1 className="serif-display" style={{ fontSize: 'var(--display-xl)', marginBottom: 28 }}>
            The city <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 300 }}>of looms.</em>
          </h1>
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 620, margin: '0 auto' }}>
            Before it was Faisalabad, it was Lyallpur — eight bazaars radiating from a clock tower,
            built on the hum of looms. We took our name from that city because it is where every
            thread we sell begins.
          </p>
        </Reveal>
      </div>
      <Reveal style={{ marginTop: 64 }}>
        <Placeholder ratio="21/9" kind="flatlay" seed="ghanta-ghar-weave" label="LYALLPURWEARS · GHANTA GHAR · GOLDEN HOUR" />
      </Reveal>
    </section>
  );
}

function StorySplit() {
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'center' }}>
        <Reveal>
          <Placeholder ratio="4/5" kind="flatlay" label="EIGHT BAZAARS · CLOCK TOWER PLAN" />
        </Reveal>
        <Reveal>
          <div className="kicker kicker-gold" style={{ marginBottom: 20 }}>Lyallpur, since 1904</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 24 }}>
            Eight roads, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>one clock tower.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--ink)', marginBottom: 20, maxWidth: 520 }}>
            In 1896, the British laid out a new town on the plains of Punjab around a red-brick clock
            tower — the Ghanta Ghar — with eight bazaars running off it like spokes on a wheel. They
            called it Lyallpur. Within decades it was Pakistan's Manchester: a city of looms, its
            streets humming with the sound of cotton becoming cloth.
          </p>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--ink)', marginBottom: 32, maxWidth: 520 }}>
            The city was renamed Faisalabad in 1979, but the looms never stopped, and neither did we.
            We are Lyallpurwears because that older name still carries what we make: heritage lawn,
            khaddar and linen, woven by hand in the same bazaars that gave the city its first name.
          </p>
          <div className="rule-gold" style={{ marginBottom: 20 }} />
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.5, color: 'var(--ink)' }}>
            "A city built to weave — we simply carry its cloth forward."
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CraftSection() {
  const stats = [
    { n: '14', l: 'Master Artisans' },
    { n: '72hr', l: 'Per Block Print' },
    { n: '0', l: 'Synthetic Dye' },
    { n: '1904', l: 'Clock Tower Built' },
  ];
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 'var(--section-pad) var(--gutter)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'center', marginBottom: 80 }}>
        <Reveal>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>Loom to Loom</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', color: 'var(--paper)', marginBottom: 24 }}>
            Woven slow, <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>printed by hand.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.78)', maxWidth: 480 }}>
            Every bolt begins on a hand-loom in Lyallpur, where fourteen master artisans still set warp
            and weft the way their fathers did. It travels to Multan for hand block-printing — a
            mallet, a carved teak block, and a vat of natural dye, repeated for seventy-two hours until
            a single motif is finished. Then it comes home to be stitched, one piece at a time.
          </p>
        </Reveal>
        <Reveal>
          <Placeholder dark ratio="4/5" kind="texture" label="TEXTURE · HAND BLOCK · MULTAN" />
        </Reveal>
      </div>
      <Reveal stagger>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, paddingTop: 40, borderTop: '1px solid rgba(250,250,247,0.12)' }}>
          {stats.map((s) => (
            <div key={s.l}>
              <div className="figure-stat" style={{ color: 'var(--gold-soft)' }}>{s.n}</div>
              <div className="kicker" style={{ marginTop: 8, color: 'rgba(250,250,247,0.6)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function ProcessTimeline() {
  const steps = [
    { n: '01', t: 'Weave', b: 'Cotton yarn is set on hand-looms across Lyallpur — the same eight-bazaar streets that gave the city its craft.' },
    { n: '02', t: 'Print', b: 'Carved teak blocks and small-batch natural dyes stamp each motif in Multan, one impression at a time.' },
    { n: '03', t: 'Wash', b: 'Fabric is hand-washed and sun-dried to set colour and soften the weave before it ever reaches a needle.' },
    { n: '04', t: 'Finish', b: 'Our tailors cut and stitch to order, checking every seam before a piece is folded for delivery.' },
  ];
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>How It's Made</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)' }}>
            Four steps, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>no shortcuts.</em>
          </h2>
        </div>
      </Reveal>
      <Reveal stagger>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ borderTop: '1px solid var(--line)', paddingTop: 24 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: 16 }}>{s.n}</div>
              <h3 className="serif-display" style={{ fontSize: 30, marginBottom: 12 }}>{s.t}</h3>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{s.b}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function ValuesGrid() {
  const values = [
    { t: 'Slow craft', b: 'No shortcuts, no synthetic speed. Every piece takes the time it takes.' },
    { t: 'Natural dye', b: 'Colour drawn from madder, indigo and pomegranate — kind to skin and soil.' },
    { t: 'Fair wages', b: 'Our weavers and block-printers are paid above bazaar rate, always on time.' },
    { t: 'Made to keep', b: 'Clothes built for a decade of wear, not a single wash.' },
  ];
  return (
    <section style={{ background: 'var(--paper-warm)', padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>What We Stand For</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)' }}>
            Values, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>not slogans.</em>
          </h2>
        </div>
      </Reveal>
      <Reveal stagger>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--line)' }}>
          {values.map((v, i) => (
            <div key={v.t} style={{ padding: 32, borderRight: i < values.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div className="rule-gold" style={{ marginBottom: 20 }} />
              <h3 className="serif-display" style={{ fontSize: 24, marginBottom: 12 }}>{v.t}</h3>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{v.b}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)', textAlign: 'center' }}>
      <Reveal>
        <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 36, maxWidth: 720, margin: '0 auto 36px' }}>
          Wear a piece <em style={{ color: 'var(--gold)', fontWeight: 300 }}>of Lyallpur.</em>
        </h2>
        <Link to="/collections" className="btn btn-gold">Shop the Edit →</Link>
      </Reveal>
    </section>
  );
}

export default function About() {
  return (
    <div>
      <Hero />
      <StorySplit />
      <CraftSection />
      <ProcessTimeline />
      <ValuesGrid />
      <ClosingCTA />
    </div>
  );
}
