// The City of Looms — the long version of the Lyallpur story.
//
// Footer previously pointed this link at /about, which meant four different
// footer labels all landed on the same page. This is the city's history, kept
// deliberately separate from the About page's account of what *we* do.
import { Link } from 'react-router-dom';
import { Reveal, Figure, PageHero, TrustStrip } from '../components/primitives.jsx';

const IMG = {
  mill: '/images/city/mill.jpg',
  loom: '/images/city/loom.jpg',
  cotton: '/images/city/cotton.jpg',
};

// The eight bazaars that still radiate from the Ghanta Ghar. The clock tower
// sits at the centre of a plan modelled on the Union Jack — which is why the
// old city is eight wedges rather than a grid.
const BAZAARS = [
  ['Katchery', 'Toward the old courts — cloth wholesalers and ledger shops.'],
  ['Rail', 'Runs to the railway station; the route bolts took out of the city.'],
  ['Bhawana', 'Grain and cotton traders, and the yarn merchants behind them.'],
  ['Jhang', 'Ready-made and stitching workshops, busiest before Eid.'],
  ['Aminpur', 'Trim, thread, lace and buttons — the finishing bazaar.'],
  ['Karkhana', 'Literally "the workshop" — dyers, printers and finishers.'],
  ['Chiniot', 'Furniture and woodwork, including the carvers who cut print blocks.'],
  ['Montgomery', 'General trade, and the shortest walk back to the tower.'],
];

function Intro() {
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <div className="split">
        <Reveal>
          <div className="prose">
            <p>
              In the 1890s the British colonial administration set out to settle the bar — the dry
              scrub between the Ravi and the Chenab — by digging canals and laying new towns beside
              them. One of those towns was drawn up by Captain Popham Young and named for Sir James
              Broadwood Lyall, then Lieutenant Governor of Punjab.
            </p>
            <p>
              Young gave it an unusual plan. Rather than a grid, he laid eight roads radiating from a
              central square, modelled on the Union Jack. A clock tower — the Ghanta Ghar — went up
              at the crossing point, its foundation stone laid in 1903 and the building finished a
              couple of years later, paid for out of local land revenue. The eight bazaars that run
              off it still carry their original names.
            </p>
            <p>
              Cotton followed the canals, and mills followed the cotton. By the middle of the
              twentieth century Lyallpur was spinning and weaving at a scale that earned it the
              nickname it still trades on: the Manchester of Pakistan. In 1979 the city was renamed
              Faisalabad in honour of King Faisal of Saudi Arabia. The looms did not notice.
            </p>
          </div>
        </Reveal>
        <Reveal className="split-media">
          <Figure
            src={IMG.loom}
            alt="An older weaver at a wooden handloom, hands resting on the shuttle, warp threads stretched before him"
            ratio="4/5"
            caption="Handloom · Punjab"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Bazaars() {
  return (
    <section style={{ background: 'var(--paper-warm)', padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ marginBottom: 56, maxWidth: 720 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>The Eight</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 20 }}>
            Eight bazaars, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>one clock.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)' }}>
            Every one of them still trades. Between them they cover the whole life of a piece of
            cloth — from the yarn merchant to the block carver to the shop that folds it into a bag.
          </p>
        </div>
      </Reveal>
      <Reveal stagger>
        <div className="band">
          {BAZAARS.map(([name, note], i) => (
            <div key={name} style={{ borderTop: '1px solid var(--line)', paddingTop: 20 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: 12 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="serif-display" style={{ fontSize: 26, marginBottom: 10 }}>{name}</h3>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{note}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function MillEra() {
  return (
    <section className="on-ink" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 'var(--section-pad) var(--gutter)' }}>
      <div className="split">
        <Reveal className="split-media">
          <Figure
            src={IMG.cotton}
            alt="Raw cotton bolls and cones of spun yarn on a wooden surface, with skeins dyed madder red and indigo"
            ratio="4/3"
          />
        </Reveal>
        <Reveal>
          <div className="kicker" style={{ color: 'var(--gold-soft)', marginBottom: 24 }}>Manchester of Pakistan</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', color: 'var(--paper)', marginBottom: 24 }}>
            What the canals <em style={{ color: 'var(--gold-soft)', fontWeight: 300 }}>brought.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.78)', maxWidth: 480, marginBottom: 20 }}>
            Irrigation turned the bar into cotton country, and cotton turned the town into an
            industry. Ginning sheds, spinning mills, power-loom yards and dye houses grew up along
            the roads out to Sargodha and Jhang — thousands of them, most small, many family-run.
          </p>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.6, color: 'rgba(250,250,247,0.78)', maxWidth: 480 }}>
            That density is the reason a buyer can still do in a single week here what would take a
            month anywhere else: see raw yarn, greige cloth, a print table and a finished bolt, all
            within a few kilometres of the same clock tower.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)', textAlign: 'center' }}>
      <Reveal>
        <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', maxWidth: 760, margin: '0 auto 20px' }}>
          We took the <em style={{ color: 'var(--gold)', fontWeight: 300 }}>older name.</em>
        </h2>
        <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 580, margin: '0 auto 36px' }}>
          Not for nostalgia — because it still describes the trade. Everything we sell is bought
          inside the city this page is about.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/collections" className="btn btn-gold">Shop the Edit →</Link>
          <Link to="/about" className="btn btn-outline">How we buy</Link>
        </div>
      </Reveal>
    </section>
  );
}

export default function CityOfLooms() {
  return (
    <div>
      <PageHero
        kicker="The City of Looms"
        title="A town laid out"
        accent="like a wheel."
        lede="Faisalabad was drawn on paper before it was built: eight roads, one clock tower, and a canal to make cotton grow. Here is where our name comes from."
      />
      <Reveal style={{ marginTop: 56 }}>
        <img
          className="figure-wide"
          src={IMG.mill}
          alt="Interior of a Faisalabad weaving mill, rows of looms receding under high windows with daylight falling through"
          style={{ aspectRatio: '21/9' }}
        />
      </Reveal>
      <Intro />
      <Bazaars />
      <MillEra />
      <Closing />
      <TrustStrip />
    </div>
  );
}
