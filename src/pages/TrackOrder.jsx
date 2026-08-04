// Track Order — the destination for the announcement bar's "Track order".
//
// Deliberately a request form, not a live carrier lookup: nothing in this
// storefront persists orders (Checkout mints its confirmation number on the
// client and discards it), so there is no order to query. Rather than fake a
// status, this collects the order number and hands it to the team, and sets
// the customer's expectations about the COD delivery flow in the meantime.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, TrustStrip } from '../components/primitives.jsx';
import { useStore } from '../sanity/useStore.js';

const DEFAULT_PHONE = '+92 300 1234567';
const DEFAULT_EMAIL = 'hello@lyallpurwear.pk';

// The COD journey every parcel takes, in the order the customer sees it.
const STAGES = [
  {
    step: '01',
    title: 'Order placed',
    body: 'You get a confirmation number the moment you check out. Keep it — it is what we look your parcel up by.',
  },
  {
    step: '02',
    title: 'Packed in Lyallpur',
    body: 'Your pieces are checked, folded and packed at the studio in Faisalabad, usually within one working day.',
  },
  {
    step: '03',
    title: 'On its way',
    body: 'The parcel is handed to our courier. Nationwide delivery runs 2–4 working days from dispatch.',
  },
  {
    step: '04',
    title: 'Rider calls you',
    body: 'Our rider phones before arriving. Have the cash total ready — payment is collected at the door.',
  },
];

function TrackForm({ phone }) {
  const [values, setValues] = useState({ orderNumber: '', contact: '' });
  const [submitted, setSubmitted] = useState(false);

  function update(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ borderTop: '1px solid var(--line)', paddingTop: 40 }}>
        <div className="rule-gold" style={{ marginBottom: 24 }} />
        <p className="serif-display" style={{ fontSize: 34, fontStyle: 'italic', marginBottom: 12 }}>
          We're looking for {values.orderNumber.trim() || 'your parcel'}.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--muted)', maxWidth: '52ch' }}>
          A person at the studio checks this by hand — expect a WhatsApp message on{' '}
          {values.contact.trim() || 'your number'} within a few hours, 9am–9pm PKT. If it's urgent,
          message {phone} directly and quote your order number.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          style={{
            marginTop: 24,
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            borderBottom: '1px solid var(--gold-line)',
            paddingBottom: 4,
          }}
        >
          Track another order
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 520 }}>
      <input
        className="field-underline"
        placeholder="Order number (e.g. LPW1234)"
        value={values.orderNumber}
        onChange={update('orderNumber')}
        autoComplete="off"
        required
      />
      <input
        className="field-underline"
        placeholder="WhatsApp number or email"
        value={values.contact}
        onChange={update('contact')}
        autoComplete="off"
        required
      />
      <button className="btn btn-gold" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
        Find my order
      </button>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', lineHeight: 1.8 }}>
        Checked by our team, not an automated feed — replies come by WhatsApp
      </p>
    </form>
  );
}

export default function TrackOrder() {
  const { settings } = useStore();
  const phone = settings?.contactPhone || DEFAULT_PHONE;
  const email = settings?.contactEmail || DEFAULT_EMAIL;

  return (
    <div>
      <section style={{ padding: 'var(--section-pad) var(--gutter) 0' }}>
        <Reveal>
          <div className="kicker kicker-gold" style={{ marginBottom: 20 }}>Track Order</div>
          <h1 className="serif-display" style={{ fontSize: 'var(--display-lg)', marginBottom: 20 }}>
            Where is my <em style={{ color: 'var(--gold)', fontWeight: 300 }}>parcel?</em>
          </h1>
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 560 }}>
            Give us the order number from your confirmation and we'll tell you exactly where it is
            between the studio and your door.
          </p>
        </Reveal>
      </section>

      <section style={{ padding: '56px var(--gutter) var(--section-pad)' }}>
        <div className="track-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 72, alignItems: 'flex-start' }}>
          <Reveal>
            <TrackForm phone={phone} />
          </Reveal>

          <Reveal>
            <div>
              <div className="kicker" style={{ marginBottom: 28 }}>What happens after you order</div>
              <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 28 }}>
                {STAGES.map((s) => (
                  <li key={s.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        flexShrink: 0,
                        width: 40,
                        height: 40,
                        border: '1px solid var(--line)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--mono)',
                        fontSize: 11,
                        color: 'var(--gold)',
                      }}
                    >
                      {s.step}
                    </span>
                    <span>
                      <span style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: 20, marginBottom: 4 }}>
                        {s.title}
                      </span>
                      <span style={{ display: 'block', fontSize: 13, lineHeight: 1.8, color: 'var(--muted)', maxWidth: '46ch' }}>
                        {s.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <div style={{ borderTop: '1px solid var(--line)', marginTop: 40, paddingTop: 28 }}>
                <div className="kicker kicker-gold" style={{ marginBottom: 12 }}>Rather ask a person?</div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--muted)', marginBottom: 4 }}>
                  WhatsApp <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink)' }}>{phone}</span> — fastest, 9am–9pm PKT.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--muted)' }}>
                  Or email <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink)' }}>{email}</span>, or use the{' '}
                  <Link to="/contact" style={{ color: 'var(--gold)', borderBottom: '1px solid var(--gold-line)' }}>
                    contact form
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <TrustStrip />

      <style>{`
        @media (max-width: 900px) {
          .track-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
        }
      `}</style>
    </div>
  );
}
