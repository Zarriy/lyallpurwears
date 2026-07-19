// Contact — WhatsApp-first support, studio address, and FAQ.
import { useState } from 'react';
import { Reveal, Placeholder, TrustStrip } from '../components/primitives.jsx';

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

function ContactCards() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ width: 40, height: 40, border: '1px solid var(--line)', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        </div>
        <div>
          <div className="kicker kicker-gold" style={{ marginBottom: 6 }}>WhatsApp</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 18, color: 'var(--ink)', marginBottom: 4 }}>+92 300 1234567</div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--muted)' }}>Fastest — 9am–9pm PKT</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ width: 40, height: 40, border: '1px solid var(--line)', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4h16v16H4z" /><path d="M4 6l8 7 8-7" />
          </svg>
        </div>
        <div>
          <div className="kicker kicker-gold" style={{ marginBottom: 6 }}>Email</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 18, color: 'var(--ink)', marginBottom: 4 }}>hello@lyallpurwears.pk</div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--muted)' }}>For press, wholesale and everything else</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ width: 40, height: 40, border: '1px solid var(--line)', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="9" r="2.4" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div className="kicker kicker-gold" style={{ marginBottom: 6 }}>Studio</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--ink)', marginBottom: 4 }}>
            D Ground, Faisalabad (Lyallpur), Pakistan
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
            Visits by appointment only
          </div>
          <Placeholder ratio="4/3" kind="texture" label="MAP · D GROUND · LYALLPUR" />
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--line)', paddingTop: 20 }}>
        <div className="kicker kicker-gold" style={{ marginBottom: 10 }}>Hours</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '0.08em', color: 'var(--ink)', marginBottom: 4 }}>
          MON–SAT · 10AM–7PM PKT
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '0.08em', color: 'var(--muted)' }}>
          SUN · WHATSAPP ONLY
        </div>
      </div>
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

function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ borderTop: '1px solid var(--line)' }}>
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{ width: '100%', textAlign: 'left', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>{it.title}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--gold)' }}>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div style={{ paddingBottom: 28, fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 640 }}>
              {it.body}
            </div>
          )}
        </div>
      ))}
    </div>
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
