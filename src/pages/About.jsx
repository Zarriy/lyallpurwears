// About — "The city of looms." Lyallpur Wear brand story.
//
// POSITIONING: we are a curated retailer, not a manufacturer. Lyallpur Wear
// buys finished cloth from mills, block-printers and wholesalers in
// Faisalabad and sells it under its own name. This page previously claimed
// employed artisans ("fourteen master artisans set warp and weft", "our
// tailors cut and stitch to order", "our weavers are paid above bazaar
// rate") — all of which described a business we are not. Every claim on this
// page is now one a buying house can actually stand behind; see the
// WhatWeAre section, which states the limits outright rather than leaving a
// reader to infer them.
import { Link } from 'react-router-dom';
import { Reveal, Figure } from '../components/primitives.jsx';

const IMG = {
  clocktower: '/images/about/clocktower.jpg',
  bazaar: '/images/about/bazaar.jpg',
  blockprinter: '/images/about/blockprinter.jpg',
  stock: '/images/about/folded-stock.jpg',
  steps: {
    walk: '/images/about/step-walk.jpg',
    choose: '/images/about/step-choose.jpg',
    check: '/images/about/step-check.jpg',
    send: '/images/about/step-send.jpg',
  },
};

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
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 640, margin: '0 auto' }}>
            Before it was Faisalabad, it was Lyallpur — eight bazaars radiating from a clock tower,
            built on the hum of looms. We don't own a loom in it. We buy cloth from the people who
            do, and this page says exactly what that means.
          </p>
        </Reveal>
      </div>
      <Reveal style={{ marginTop: 64 }}>
        <img
          className="figure-wide"
          src={IMG.clocktower}
          alt="The Ghanta Ghar clock tower in Faisalabad at golden hour, seen down one of the eight bazaars"
          style={{ aspectRatio: '21/9' }}
        />
      </Reveal>
    </section>
  );
}

/* --------------------------------------------------------- What we are */
// The candid section. Reads as art direction, but its real job is to stop a
// visitor mistaking a buying house for a workshop.
function WhatWeAre() {
  const are = [
    ['A shop', 'We buy finished cloth from mills, printers and wholesalers across Faisalabad and sell it under our own name.'],
    ['Choosy', 'Roughly one bolt in nine that we unroll comes back with us. The rest stays on the shelf it came from.'],
    ['Specific', 'Every listing states the fabric, the piece count, and whether a print is hand-blocked or machine-run.'],
  ];
  const areNot = [
    ['A mill', 'We employ no weavers. We own no looms, no print tables, and no dye vats.'],
    ['The maker', 'The people who make this cloth have their own names and their own workshops. We are their customer.'],
    ['Hand-block only', 'A good deal of what we sell is machine-printed. It is good cloth, and we label it as what it is.'],
  ];

  const Column = ({ title, items, accent }) => (
    <div>
      <div className="kicker" style={{ color: accent, marginBottom: 22 }}>{title}</div>
      <div style={{ borderTop: '1px solid var(--line)' }}>
        {items.map(([t, b]) => (
          <div key={t} style={{ padding: '24px 0', borderBottom: '1px solid var(--line)' }}>
            <h3 className="serif-display" style={{ fontSize: 26, marginBottom: 8 }}>{t}</h3>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{b}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 64, maxWidth: 720, margin: '0 auto 64px' }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>Plainly Put</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 20 }}>
            What we are, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>and what we aren't.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)' }}>
            Plenty of labels borrow a craftsman's story. We'd rather hand you ours with the edges
            showing, so you know precisely whose work you're buying.
          </p>
        </div>
      </Reveal>
      <Reveal>
        <div className="split split-start">
          <Column title="What we are" items={are} accent="var(--gold)" />
          <Column title="What we are not" items={areNot} accent="var(--muted)" />
        </div>
      </Reveal>
    </section>
  );
}

/* --------------------------------------------------------- City history */
function StorySplit() {
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)', background: 'var(--paper-warm)' }}>
      <div className="split">
        <Reveal className="split-media">
          <Figure
            src={IMG.bazaar}
            alt="A cloth bazaar lane in Faisalabad, bolts stacked shoulder-high on either side"
            ratio="4/5"
            caption="The cloth bazaars · Faisalabad"
          />
        </Reveal>
        <Reveal>
          <div className="kicker kicker-gold" style={{ marginBottom: 20 }}>Lyallpur, since 1904</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 24 }}>
            Eight roads, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>one clock tower.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--ink)', marginBottom: 20, maxWidth: 520 }}>
            At the turn of the last century the British laid out a new town on the plains of Punjab
            around a red-brick clock tower — the Ghanta Ghar — with eight bazaars running off it like
            spokes on a wheel. They called it Lyallpur. Within decades it was Pakistan's Manchester:
            a city of looms, its streets humming with the sound of cotton becoming cloth.
          </p>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--ink)', marginBottom: 32, maxWidth: 520 }}>
            The city was renamed Faisalabad in 1979, but the looms never stopped. We took the older
            name because it still describes what the place does — and because our whole trade
            happens inside those eight bazaars. We buy from them. We don't pretend to be them.
          </p>
          <div className="rule-gold" style={{ marginBottom: 20 }} />
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.5, color: 'var(--ink)', marginBottom: 28 }}>
            "A city built to weave — we simply carry its cloth forward."
          </p>
          <Link
            to="/city-of-looms"
            style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 4 }}
          >
            More on the city →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- The makers */
function MakersSection() {
  const stats = [
    { n: '40+', l: 'Mills & Workshops Visited' },
    { n: '1 in 9', l: 'Bolts We Keep' },
    { n: '8', l: 'Bazaars We Walk' },
    { n: '100%', l: 'Checked Before Boxing' },
  ];
  return (
    <section className="on-ink" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 'var(--section-pad) var(--gutter)' }}>
      <div className="split" style={{ marginBottom: 80 }}>
        <Reveal>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>Credit Where It's Due</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', color: 'var(--paper)', marginBottom: 24 }}>
            The hands <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>are not ours.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.78)', maxWidth: 480, marginBottom: 24 }}>
            The cloth we sell is woven on pit-looms and power-looms across Faisalabad, and printed by
            families in Multan who have been cutting teak blocks for three generations. None of them
            work for us. We are a customer who turns up, looks carefully, and pays.
          </p>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.78)', maxWidth: 480 }}>
            That makes our promise a narrower one than a maker's, and we'd rather be held to a small
            promise kept: we buy at the price asked, we pay on collection day, and we never put our
            name on a bolt without saying where it came from.
          </p>
        </Reveal>
        <Reveal className="split-media">
          <Figure
            src={IMG.blockprinter}
            alt="A block-printer pressing a carved teak block onto cotton by hand at a long print table"
            ratio="4/5"
            caption="Hand block-printing · Multan"
          />
        </Reveal>
      </div>
      <Reveal stagger>
        <div className="band" style={{ paddingTop: 40, borderTop: '1px solid rgba(250,250,247,0.12)' }}>
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

/* --------------------------------------------------------- How we buy */
// Was a four-step production timeline (Weave → Print → Wash → Finish), which
// described work we don't do. These are our four steps.
function HowWeBuy() {
  const steps = [
    { n: '01', t: 'Walk', img: IMG.steps.walk, alt: 'A buyer walking a Faisalabad cloth market between stacked bolts', b: 'Most weeks start in the eight bazaars and the mill yards off Sargodha Road. We look at cloth in daylight, because nothing tells the truth about a colour like an open doorway.' },
    { n: '02', t: 'Choose', img: IMG.steps.choose, alt: 'Hands comparing two lengths of printed lawn cotton', b: 'About one bolt in nine comes back with us. We buy in short runs, which is why a colourway sells out and often never returns.' },
    { n: '03', t: 'Check', img: IMG.steps.check, alt: 'A length of lawn cotton held up to daylight to check the weave for flaws', b: 'Every piece is unrolled, measured against the metre and held to the light. Anything with a slub, a mis-strike or a short cut goes back to the seller.' },
    { n: '04', t: 'Send', img: IMG.steps.send, alt: 'Folded lawn suits being wrapped in tissue and boxed for dispatch', b: 'We photograph the actual cloth — not a sample, not a render — write down exactly what it is, and pack it in Faisalabad the day your order clears.' },
  ];
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>How We Buy</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)' }}>
            Four steps, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>no shortcuts.</em>
          </h2>
        </div>
      </Reveal>
      <Reveal stagger>
        <div className="band">
          {steps.map((s) => (
            <div key={s.n}>
              <Figure src={s.img} alt={s.alt} ratio="3/4" style={{ marginBottom: 24 }} />
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 20 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: 12 }}>{s.n}</div>
                <h3 className="serif-display" style={{ fontSize: 30, marginBottom: 12 }}>{s.t}</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{s.b}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* --------------------------------------------------------- Values */
function ValuesGrid() {
  const values = [
    { t: 'Chosen, not made', b: 'We don’t own a loom or a print table. We buy from the people who do, and we say so on every page.' },
    { t: 'Described exactly', b: 'Fabric, weight, piece count, hand-blocked or machine-run. Where we don’t know something, the listing says we don’t know.' },
    { t: 'Paid at asking', b: 'Our suppliers set their own price and are paid on collection day — not on sixty-day terms.' },
    { t: 'Short runs', b: 'We buy what the mill actually has, not what a forecast says it should. When a colourway is gone, it is gone.' },
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
        <div className="band band-tight">
          {values.map((v) => (
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

/* --------------------------------------------------------- Closing */
function ClosingCTA() {
  return (
    <section>
      <Reveal>
        <img
          className="figure-wide"
          src={IMG.stock}
          alt="Folded bolts of lawn, khaddar and linen stacked on wooden shelving"
          style={{ aspectRatio: '21/9' }}
        />
      </Reveal>
      <div style={{ padding: 'var(--section-pad) var(--gutter)', textAlign: 'center' }}>
        <Reveal>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', maxWidth: 720, margin: '0 auto 20px' }}>
            Wear a piece <em style={{ color: 'var(--gold)', fontWeight: 300 }}>of Lyallpur.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 560, margin: '0 auto 36px' }}>
            Everything we've chosen this season, with the fabric and the piece count written on
            the front of every listing.
          </p>
          <Link to="/collections" className="btn btn-gold">Shop the Edit →</Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div>
      <Hero />
      <WhatWeAre />
      <StorySplit />
      <MakersSection />
      <HowWeBuy />
      <ValuesGrid />
      <ClosingCTA />
    </div>
  );
}
