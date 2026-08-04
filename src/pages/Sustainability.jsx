// Sustainability — deliberately modest, because we buy cloth rather than
// make it. The temptation on a page like this is to borrow the mill's
// environmental story; instead this splits plainly into what we control,
// what we don't, and what we're still working on. Keep it that way.
import { Link } from 'react-router-dom';
import { Reveal, Figure, PageHero, TrustStrip } from '../components/primitives.jsx';

const IMG = {
  drying: '/images/sustainability/drying.jpg',
  dyes: '/images/sustainability/dyes.jpg',
};

const CONTROL = [
  {
    t: 'We buy short',
    b: 'Short runs mean we rarely hold stock we can’t sell. Nothing we’ve bought has ever been destroyed to protect a price, and it never will be — anything slow gets marked down until it goes.',
  },
  {
    t: 'Paper, not plastic',
    b: 'Orders ship folded in tissue inside a kraft box, tied with cotton twine. No polybags, no plastic tape, no filler. The box is plain enough to reuse.',
  },
  {
    t: 'Paid on collection',
    b: 'Suppliers are paid the day we take the cloth. Long payment terms push small workshops onto informal credit, and that cost lands on the people doing the work.',
  },
  {
    t: 'Built to be kept',
    b: 'We favour cloth that survives washing, and we publish care instructions that actually protect it. The greenest suit is the one still worn in five years.',
  },
];

const LIMITS = [
  ['Water and effluent', 'Dyeing and finishing are the water-intensive steps, and they happen in other people’s buildings. We can ask what a dye house does with its effluent; we cannot audit it, and we won’t claim we have.'],
  ['Energy', 'The mills we buy from run on the national grid and on gas. We have no influence over that mix.'],
  ['Cotton farming', 'Our cloth starts in fields we never see, several trades upstream. We can’t trace a bolt to a farm, and any brand that tells you it can from this position is guessing.'],
  ['Certification', 'We hold no organic or fair-trade certification. Certification covers a supply chain you control; ours is a buying relationship, and we’d rather describe it accurately than buy a badge.'],
];

function Control() {
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ marginBottom: 56, maxWidth: 720 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>In Our Hands</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 20 }}>
            Four things we <em style={{ color: 'var(--gold)', fontWeight: 300 }}>actually control.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)' }}>
            We’re a buying house, so our footprint is mostly in what we choose, how we pack it, and
            how we pay for it. That’s a short list, and it’s the whole of it.
          </p>
        </div>
      </Reveal>
      <Reveal stagger>
        <div className="band band-tight">
          {CONTROL.map((v) => (
            <div key={v.t}>
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

function Limits() {
  return (
    <section className="on-ink" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 'var(--section-pad) var(--gutter)' }}>
      <div className="split split-start">
        <Reveal>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>Out of Our Hands</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', color: 'var(--paper)', marginBottom: 24 }}>
            What we <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>can't promise.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.78)', maxWidth: 460, marginBottom: 24 }}>
            This is the part most brand pages leave out. We don’t own the mills, the dye houses or
            the fields, and a promise we can’t keep is worth less than an admission we can.
          </p>
          <Figure
            src={IMG.dyes}
            alt="Folded undyed and naturally dyed cotton beside clay bowls of madder root, indigo, pomegranate rind and marigold"
            ratio="4/5"
            style={{ maxWidth: 360 }}
          />
        </Reveal>
        <Reveal>
          <div style={{ borderTop: '1px solid var(--line-on-ink)' }}>
            {LIMITS.map(([t, b]) => (
              <div key={t} style={{ padding: '26px 0', borderBottom: '1px solid var(--line-on-ink)' }}>
                <h3 className="serif-display" style={{ fontSize: 26, color: 'var(--paper)', marginBottom: 10 }}>{t}</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.75, color: 'rgba(250,250,247,0.65)' }}>{b}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Working() {
  return (
    <section style={{ background: 'var(--paper-warm)', padding: 'var(--section-pad) var(--gutter)' }}>
      <div className="split">
        <Reveal className="split-media">
          <Figure
            src={IMG.drying}
            alt="Lengths of freshly washed cotton drying on lines across an open courtyard under a clear sky"
            ratio="16/9"
            caption="Sun-drying after wash · Punjab"
          />
        </Reveal>
        <Reveal>
          <div className="kicker kicker-gold" style={{ marginBottom: 20 }}>Underway</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 24 }}>
            What we're <em style={{ color: 'var(--gold)', fontWeight: 300 }}>working on.</em>
          </h2>
          <div className="prose">
            <ul>
              <li>Naming our suppliers on the product page, where they agree to it.</li>
              <li>Flagging which lines are dyed with natural dyestuff and which are not, instead of letting the photography imply it.</li>
              <li>Asking every dye house we buy from a standard set of questions about effluent, and publishing who answers.</li>
              <li>A repair-and-restitch service, so a suit with a failed seam doesn’t become a bin bag.</li>
            </ul>
            <p style={{ fontSize: 17, color: 'var(--muted)' }}>
              None of this is finished. When a line moves from this list to the one above, we’ll say
              so here rather than quietly.
            </p>
          </div>
          <div style={{ marginTop: 32 }}>
            <Link to="/contact" className="btn btn-outline">Ask us about a supplier</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Sustainability() {
  return (
    <div>
      <PageHero
        kicker="Sustainability"
        title="A short page,"
        accent="honestly."
        lede="We buy cloth; we don't weave it. That limits both our footprint and our claims — so here is exactly what we control, and what we don't."
      />
      <Control />
      <Limits />
      <Working />
      <TrustStrip />
    </div>
  );
}
