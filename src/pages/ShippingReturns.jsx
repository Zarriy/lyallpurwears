// Shipping & Returns — the footer pointed this at /contact, which only ever
// answered half of it in an FAQ accordion. Figures here are the same ones the
// cart and PDP enforce: free over Rs. 5,000, flat Rs. 299 below it (see
// src/pages/Cart.jsx SHIPPING_FLAT and CartContext's freeShippingThreshold).
// If those change, change them here too.
import { Link } from 'react-router-dom';
import { Reveal, PageHero, Accordion, TrustStrip } from '../components/primitives.jsx';
import { useStore } from '../sanity/useStore.js';
import { formatPrice } from '../data/products.js';

const DEFAULT_PHONE = '+92 300 1234567';
const SHIPPING_FLAT = 299;

function waLink(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

function DeliveryTable({ threshold }) {
  const rows = [
    ['Standard — nationwide', '2–4 working days', `${formatPrice(SHIPPING_FLAT)} · free over ${formatPrice(threshold)}`],
    ['Stitched to measure', '5–9 working days', 'Stitching charged per piece at checkout'],
    ['Cash on Delivery', '2–4 working days', 'No extra charge'],
    ['Remote / rural postcodes', '4–7 working days', 'Standard rate applies'],
  ];
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ marginBottom: 40, maxWidth: 640 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Delivery</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 20 }}>
            Out of Faisalabad, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>into your hands.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)' }}>
            Every parcel is packed and dispatched from our own studio. Orders placed before 4pm PKT
            on a working day go out the same afternoon.
          </p>
        </div>
      </Reveal>
      <Reveal>
        <div className="table-scroll">
          <table className="spec-table">
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Time in transit</th>
                <th scope="col">Cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([a, b, c]) => (
                <tr key={a}>
                  <td>{a}</td>
                  <td>{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.7, color: 'var(--muted)', marginTop: 20, maxWidth: 640 }}>
          Transit times are working days from dispatch and exclude Sundays and public holidays.
          Eid weeks run slower everywhere in the country, ours included — we post the cut-off dates
          on Instagram before each one.
        </p>
      </Reveal>
    </section>
  );
}

function Returns() {
  const yes = [
    'Unworn and unwashed, with original tags still attached',
    'Unstitched cloth still folded as it arrived, uncut',
    'Reported within 7 days of the parcel being delivered',
    'Anything that arrived damaged, short-measured or not what you ordered',
  ];
  const no = [
    'Cloth that has been cut, stitched or altered — a tailor’s scissors end our part in it',
    'Pieces washed, worn or scented',
    'Stitched-to-measure orders, unless the fault is ours',
    'Sale items marked final at checkout',
  ];
  const Col = ({ title, items, mark, tone }) => (
    <div>
      <div className="kicker" style={{ color: tone, marginBottom: 20 }}>{title}</div>
      <ul style={{ listStyle: 'none' }}>
        {items.map((t) => (
          <li key={t} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--line)', fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.6, color: 'var(--ink)' }}>
            <span aria-hidden="true" style={{ color: tone, fontFamily: 'var(--mono)', flexShrink: 0 }}>{mark}</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <section style={{ background: 'var(--paper-warm)', padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ marginBottom: 56, maxWidth: 680 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>Returns</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)', marginBottom: 20 }}>
            Seven days, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>no interrogation.</em>
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)' }}>
            If a piece isn’t right, send it back. We won’t ask you to justify it — we’d rather have
            the cloth back on the shelf than in a wardrobe you resent.
          </p>
        </div>
      </Reveal>
      <Reveal>
        <div className="split split-start">
          <Col title="We’ll take it back if" items={yes} mark="✓" tone="var(--gold)" />
          <Col title="We can’t take it back if" items={no} mark="—" tone="var(--muted)" />
        </div>
      </Reveal>
    </section>
  );
}

function HowTo({ phone }) {
  const wa = waLink(phone);
  const steps = [
    ['01', 'Message us', <>Send your order number on WhatsApp, or use the <Link to="/contact" style={{ borderBottom: '1px solid var(--line)' }}>contact form</Link>. A photograph helps if something arrived wrong.</>],
    ['02', 'We book the pickup', 'In most cities our courier collects from your address within two working days. There is no collection fee if the fault is ours.'],
    ['03', 'We check and confirm', 'Once the parcel reaches the studio we inspect it the same day and message you either way.'],
    ['04', 'You’re refunded', 'Card and bank orders are refunded to source within 5–7 working days. COD orders are refunded by bank transfer, Easypaisa or JazzCash — whichever you prefer.'],
  ];
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ marginBottom: 56, maxWidth: 640 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16 }}>How To Start One</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)' }}>
            Four steps, <em style={{ color: 'var(--gold)', fontWeight: 300 }}>one message.</em>
          </h2>
        </div>
      </Reveal>
      <Reveal stagger>
        <div className="band">
          {steps.map(([n, t, b]) => (
            <div key={n} style={{ borderTop: '1px solid var(--line)', paddingTop: 24 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: 16 }}>{n}</div>
              <h3 className="serif-display" style={{ fontSize: 28, marginBottom: 12 }}>{t}</h3>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{b}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal>
        <div style={{ marginTop: 56, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {wa && <a className="btn btn-gold" href={wa} target="_blank" rel="noopener noreferrer">Start a return on WhatsApp →</a>}
          <Link className="btn btn-outline" to="/track-order">Track an order</Link>
        </div>
      </Reveal>
    </section>
  );
}

function Details({ threshold }) {
  const items = [
    { title: 'Do you ship outside Pakistan?', body: 'Not yet. Everything currently ships within Pakistan only. We are working on rates for the Gulf and the UK — join the letter at the bottom of any page and we will tell you when it opens.' },
    { title: 'Can I pay cash on delivery?', body: 'Yes, anywhere in Pakistan, at no extra charge. The courier collects the full amount at your door. For orders above Rs. 25,000 we may ask for a partial advance before dispatch.' },
    { title: `Why is shipping free over ${formatPrice(threshold)}?`, body: `Below that figure the courier charge is a real cost we would otherwise bury in the product price, so we show it: a flat ${formatPrice(SHIPPING_FLAT)}. Above it, the order is large enough to absorb the charge and we stop passing it on.` },
    { title: 'My parcel is late — what now?', body: 'Check the tracking link in your dispatch message first; couriers scan irregularly on rural routes. If it has not moved in 48 hours, message us with the order number and we will chase it from our end rather than asking you to.' },
    { title: 'Something arrived damaged.', body: 'Photograph it before you unfold anything further and send us the pictures the same day. Damage in transit is our problem, not yours — we replace or refund, and we arrange collection at our own cost.' },
    { title: 'Can I exchange for another size or colour?', body: 'Yes, within the same 7-day window and subject to stock. Because we buy in short runs a colourway may already be gone, in which case we refund instead. Exchanges ship free.' },
    { title: 'I ordered stitched and the fit is wrong.', body: 'Send us your measurements alongside a photograph of the piece on. If the garment does not match the measurements you gave us, we alter or remake it at our cost. If the measurements themselves were off, we will still alter it once for the cost of the tailoring alone.' },
  ];
  return (
    <section style={{ background: 'var(--paper-warm)', padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>The Fine Print</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)' }}>
            Everything <em style={{ color: 'var(--gold)', fontWeight: 300 }}>else.</em>
          </h2>
        </div>
      </Reveal>
      <Reveal>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <Accordion items={items} openFirst={false} />
        </div>
      </Reveal>
    </section>
  );
}

export default function ShippingReturns() {
  const { settings } = useStore();
  const phone = settings?.contactPhone || DEFAULT_PHONE;
  const threshold = settings?.freeShippingThreshold ?? 5000;

  return (
    <div>
      <PageHero
        kicker="Shipping & Returns"
        title="Packed here,"
        accent="posted today."
        lede="What it costs, how long it takes, and exactly what happens if you want to send something back."
      />
      <DeliveryTable threshold={threshold} />
      <Returns />
      <HowTo phone={phone} />
      <Details threshold={threshold} />
      <TrustStrip />
    </div>
  );
}
