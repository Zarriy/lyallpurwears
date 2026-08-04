// Contact — WhatsApp-first support, studio address, and FAQ.
//
// Every contact detail comes from Site Settings in Studio. The literals below
// are last-resort fallbacks only, so the page still reads as finished before
// the CMS is reachable or populated — the same pattern the PDP uses.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, TrustStrip, Accordion } from '../components/primitives.jsx';
import { useStore } from '../sanity/useStore.js';

const DEFAULT_PHONE = '+92 300 1234567';
const DEFAULT_EMAIL = 'hello@lyallpurwear.pk';
const DEFAULT_ADDRESS = 'D Ground, Faisalabad (Lyallpur), Pakistan';
const DEFAULT_ADDRESS_NOTE = 'Visits by appointment only';
const DEFAULT_HOURS = ['Mon–Sat · 10am–7pm PKT', 'Sun · WhatsApp only'];

// wa.me wants bare digits — no +, spaces or dashes.
function waLink(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

function Hero() {
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter) 0' }}>
      <Reveal>
        <div className="kicker kicker-gold" style={{ marginBottom: 20 }}>Contact</div>
        <h1 className="serif-display" style={{ fontSize: 'var(--display-lg)', marginBottom: 20 }}>
          Say <em style={{ color: 'var(--gold)', fontWeight: 300 }}>salaam.</em>
        </h1>
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 560 }}>
          Questions about an order, a fabric, or a stitching size — write to us or send a WhatsApp
          message. A real person in Faisalabad reads every note.
        </p>
      </Reveal>
    </section>
  );
}

function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', whatsapp: '', orderNumber: '', message: '' });
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
          Shukriya — we'll reply within a day.
        </p>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--muted)' }}>
          Your message has been sent. For anything urgent, WhatsApp us directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <input
          className="field-underline"
          placeholder="Full name"
          value={values.name}
          onChange={update('name')}
          required
        />
        <input
          className="field-underline"
          type="email"
          placeholder="Email address"
          value={values.email}
          onChange={update('email')}
          required
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <input
          className="field-underline"
          placeholder="WhatsApp number"
          value={values.whatsapp}
          onChange={update('whatsapp')}
        />
        <input
          className="field-underline"
          placeholder="Order number (optional)"
          value={values.orderNumber}
          onChange={update('orderNumber')}
        />
      </div>
      <textarea
        className="field-underline"
        placeholder="Your message"
        rows={5}
        value={values.message}
        onChange={update('message')}
        style={{ resize: 'vertical' }}
        required
      />
      <button type="submit" className="btn btn-gold" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
        Send Message
      </button>
    </form>
  );
}

function Card({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <div style={{ width: 40, height: 40, border: '1px solid var(--line)', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="kicker kicker-gold" style={{ marginBottom: 6 }}>{label}</div>
        {children}
      </div>
    </div>
  );
}

const detailLink = { color: 'var(--ink)', borderBottom: '1px solid var(--line)', transition: 'border-color 0.3s var(--ease)' };

function ContactCards() {
  const { settings } = useStore();
  const phone = settings?.contactPhone || DEFAULT_PHONE;
  const email = settings?.contactEmail || DEFAULT_EMAIL;
  const address = settings?.contactAddress || DEFAULT_ADDRESS;
  const addressNote = settings?.contactAddressNote || DEFAULT_ADDRESS_NOTE;
  const hours = settings?.contactHours?.length ? settings.contactHours : DEFAULT_HOURS;
  const whatsapp = waLink(phone);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Card
        label="WhatsApp"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        }
      >
        <div style={{ fontFamily: 'var(--mono)', fontSize: 18, marginBottom: 4 }}>
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" style={detailLink}>{phone}</a>
          ) : (
            phone
          )}
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--muted)' }}>Fastest — we reply the same day</div>
      </Card>

      <Card
        label="Email"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4h16v16H4z" /><path d="M4 6l8 7 8-7" />
          </svg>
        }
      >
        <div style={{ fontFamily: 'var(--mono)', fontSize: 18, marginBottom: 4, overflowWrap: 'anywhere' }}>
          <a href={`mailto:${email}`} style={detailLink}>{email}</a>
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--muted)' }}>For press, wholesale and everything else</div>
      </Card>

      <Card
        label="Studio"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="9" r="2.4" />
          </svg>
        }
      >
        {/* The address is a text field, so honour the line breaks the editor
            typed rather than collapsing them into a run-on line. */}
        <div style={{ fontFamily: 'var(--serif)', fontSize: 18, marginBottom: 4, whiteSpace: 'pre-line', lineHeight: 1.5 }}>
          {address}
        </div>
        {addressNote && (
          <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--muted)' }}>{addressNote}</div>
        )}
      </Card>

      {hours.length > 0 && (
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 20 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 10 }}>Hours</div>
          {hours.map((line, i) => (
            <div
              key={line}
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: i === 0 ? 'var(--ink)' : 'var(--muted)',
                marginBottom: 4,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactSplit() {
  return (
    <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 96, alignItems: 'flex-start' }}>
        <Reveal>
          <ContactForm />
        </Reveal>
        <Reveal>
          <ContactCards />
        </Reveal>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { title: 'How long does shipping take?', body: 'Orders ship within 2–4 working days nationwide, tracked from Faisalabad to your door via our courier partners. Made-to-order stitched pieces may take an extra 3–5 days.' },
    { title: 'Is Cash on Delivery available?', body: 'Yes — COD is available on every order across Pakistan. You only pay when your parcel arrives at your doorstep.' },
    { title: 'What is your returns policy?', body: 'We accept returns within 7 days of delivery on unworn, unwashed pieces with tags attached. Message us on WhatsApp with your order number to start a return.' },
    { title: 'Do you offer stitching services?', body: 'Yes. Every unstitched piece can be stitched to your measurements for an additional fee — select "Stitched" at checkout or tell us your size over WhatsApp.' },
    { title: 'How should I care for hand block-printed fabric?', body: 'Hand wash cold and separately for the first few washes, avoid bleach, iron on reverse, and dry in shade to protect the natural dye.' },
  ];
  return (
    <section style={{ background: 'var(--paper-warm)', padding: 'var(--section-pad) var(--gutter)' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>Before You Ask</div>
          <h2 className="serif-display" style={{ fontSize: 'var(--display-md)' }}>
            Frequently <em style={{ color: 'var(--gold)', fontWeight: 300 }}>asked.</em>
          </h2>
        </div>
      </Reveal>
      <Reveal>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <Accordion items={items} />
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <Link
              to="/faq"
              style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 4 }}
            >
              Read all questions →
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Contact() {
  return (
    <div>
      <Hero />
      <ContactSplit />
      <FAQ />
      <TrustStrip />
    </div>
  );
}
