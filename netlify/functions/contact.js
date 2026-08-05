// Contact form → Resend. POST /api/contact
//   { name, email, whatsapp?, orderNumber?, message, website? }
//
// Replaced a handleSubmit that called preventDefault(), set submitted=true and
// sent nothing — while telling the customer "Shukriya — we'll reply within a
// day. Your message has been sent." A dead button is bad; a dead button that
// claims success is worse, because the customer stops chasing.
//
// reply_to is set to the sender, so hitting Reply in your inbox answers the
// customer directly rather than emailing Resend's relay address.
//
// NOTE ON DURABILITY: this is fire-and-forget email. There is no stored copy —
// if a message is filtered, bounced or deleted, it is gone, and Resend's
// dashboard retains sends for a limited window only. If enquiries start
// mattering commercially, mirror them into Sanity as documents (the pattern in
// api/submit-review.js) so there is a queue that survives an inbox.
const RESEND_URL = 'https://api.resend.com/emails';

// Resend will only accept a `from` on a domain you have verified. Until
// lyallpurwear.com is verified there, this shared sender is the only one that
// works — and it can only deliver to the address that owns the Resend account.
const FALLBACK_FROM = 'Lyallpur Wear <onboarding@resend.dev>';

const MAX_NAME_LEN = 80;
const MAX_EMAIL_LEN = 254;
const MAX_PHONE_LEN = 32;
const MAX_ORDER_LEN = 60;
const MAX_MESSAGE_LEN = 4000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// The message is interpolated into an HTML email we send to ourselves. Escape
// it: a customer typing <script> or stray angle brackets must not be able to
// shape the markup of the mail that lands in the shop's inbox.
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function row(label, value) {
  if (!value) return '';
  return `<tr>
    <td style="padding:6px 16px 6px 0;font-family:Georgia,serif;font-size:13px;color:#6B6B6B;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;font-family:Georgia,serif;font-size:15px;color:#0A0A0A;">${escapeHtml(value)}</td>
  </tr>`;
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  // Honeypot — hidden field only bots fill. Answer 200 so they cannot tell.
  if (body?.website) return json(200, { ok: true });

  const name = clean(body?.name, MAX_NAME_LEN);
  const email = clean(body?.email, MAX_EMAIL_LEN).toLowerCase();
  const whatsapp = clean(body?.whatsapp, MAX_PHONE_LEN);
  const orderNumber = clean(body?.orderNumber, MAX_ORDER_LEN);
  const message = clean(body?.message, MAX_MESSAGE_LEN);

  const errors = [];
  if (!name) errors.push('Please tell us your name.');
  if (!email || !EMAIL_RE.test(email)) errors.push('Please enter a valid email address.');
  if (!message) errors.push('Please write a message.');
  if (errors.length) return json(400, { ok: false, error: errors[0], details: errors });

  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.CONTACT_INBOX;
  if (!apiKey || !inbox) {
    return json(503, {
      ok: false,
      error: 'The contact form is not configured on this server (missing RESEND_API_KEY or CONTACT_INBOX).',
    });
  }

  // Leading brand tag so the shop can tell at a glance which site a message
  // came from — several properties feed the same inbox. Keep it first in the
  // string: mail clients truncate subjects from the right, and it is what
  // inbox filters and search will key on.
  const prefix = process.env.CONTACT_SUBJECT_PREFIX || 'Lyallpurwear';
  const subject = orderNumber
    ? `${prefix} · Contact form — ${name} (order ${orderNumber})`
    : `${prefix} · Contact form — ${name}`;

  const html = `<div style="background:#F4F1EA;padding:24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background:#FFFFFF;">
    <tr><td style="padding:28px 28px 0 28px;font-family:Georgia,serif;font-size:12px;letter-spacing:0.16em;color:#B8924A;">NEW MESSAGE · LYALLPURWEAR.COM</td></tr>
    <tr><td style="padding:12px 28px 20px 28px;font-family:Georgia,serif;font-size:24px;color:#0A0A0A;">${escapeHtml(name)}</td></tr>
    <tr><td style="padding:0 28px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-top:1px solid #E4E4E0;padding-top:12px;">
        ${row('Email', email)}
        ${row('WhatsApp', whatsapp)}
        ${row('Order', orderNumber)}
      </table>
    </td></tr>
    <tr><td style="padding:20px 28px 28px 28px;">
      <div style="border-top:1px solid #E4E4E0;padding-top:18px;font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#1A1A1A;white-space:pre-wrap;">${escapeHtml(message)}</div>
    </td></tr>
    <tr><td style="padding:0 28px 28px 28px;font-family:Georgia,serif;font-size:12px;color:#6B6B6B;">Reply to this email to answer ${escapeHtml(name)} directly.</td></tr>
  </table>
</div>`;

  const text = [
    `New message from ${name}`,
    `Email: ${email}`,
    whatsapp ? `WhatsApp: ${whatsapp}` : null,
    orderNumber ? `Order: ${orderNumber}` : null,
    '',
    message,
  ]
    .filter((line) => line !== null)
    .join('\n');

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || FALLBACK_FROM,
        // Comma-separated CONTACT_INBOX lets you copy a second person in.
        to: inbox.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    if (res.ok) return json(200, { ok: true });

    let detail = '';
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      /* Resend returns an empty body on some errors. */
    }
    console.error('[resend] contact send failed', res.status, detail);
    return json(502, {
      ok: false,
      error: 'We could not send your message just now. Please WhatsApp us instead, or try again shortly.',
    });
  } catch (err) {
    console.error('[resend] contact send threw', err);
    return json(502, {
      ok: false,
      error: 'We could not reach our mail service. Please WhatsApp us instead, or try again shortly.',
    });
  }
}
