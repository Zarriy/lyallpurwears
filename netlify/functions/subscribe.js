// Newsletter + Rs. 500 voucher signup. POST /api/subscribe
//   { email, name?, whatsapp?, source?, website? }
//
// Netlify Functions v2 (Request -> Response). Also served under `npm run dev`
// by the middleware in vite.config.js, which adapts the Node request into a
// Request and pipes this Response back — so dev and production run the same
// handler rather than drifting apart.
//
// Posts the contact to Brevo. The API key is SERVER-SIDE ONLY (no VITE_
// prefix — a marketing key in client JS can be scraped and used to read your
// whole contact list).
//
// Two modes, chosen by whether BREVO_DOI_TEMPLATE_ID is set:
//
//   - Double opt-in (set it — recommended). Brevo emails a confirm link and
//     only adds the contact to the list once they click. That confirmation
//     email is where the voucher code goes, which means the voucher is only
//     ever delivered to an address someone actually controls. This is also
//     what keeps you off spam lists as the volume grows.
//   - Single opt-in (leave it unset). The contact lands on the list straight
//     away and NOTHING is emailed — you would have to send the voucher from a
//     Brevo automation triggered on list-add.
//
// Deliberately never reports whether an address was already on the list:
// that would turn this endpoint into a way to test whether a given person
// shops here.
import { encodeEmailToken } from './_token.js';

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_DOI_URL = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation';

const MAX_EMAIL_LEN = 254;
const MAX_NAME_LEN = 80;
const MAX_PHONE_LEN = 32;

// Deliberately loose. Strict RFC 5322 matching rejects addresses that work,
// and the confirmation email is the real proof the address exists.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
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

  const { email, name, whatsapp, source, website } = body || {};

  // Honeypot — a hidden field no real visitor sees. Bots fill every input.
  // Answer 200 so the bot cannot tell it was caught, but write nothing.
  if (website) return json(200, { ok: true });

  const cleanEmail = clean(email, MAX_EMAIL_LEN).toLowerCase();
  if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
    return json(400, { error: 'Please enter a valid email address.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !Number.isInteger(listId)) {
    return json(503, {
      error: 'Signup is not configured on this server (missing BREVO_API_KEY or BREVO_LIST_ID).',
    });
  }

  const attributes = {};
  const cleanName = clean(name, MAX_NAME_LEN);
  if (cleanName) {
    const [first, ...rest] = cleanName.split(/\s+/);
    attributes.FIRSTNAME = first;
    if (rest.length) attributes.LASTNAME = rest.join(' ');
  }
  const cleanPhone = clean(whatsapp, MAX_PHONE_LEN);
  // Brevo rejects the whole request on a malformed SMS value, so only send it
  // when it looks like an E.164 number and drop it silently otherwise — a bad
  // optional phone number must never cost us the email signup.
  if (/^\+?[0-9][0-9\s-]{7,}$/.test(cleanPhone)) {
    attributes.SMS = cleanPhone.replace(/[\s-]/g, '');
  }
  const cleanSource = clean(source, MAX_NAME_LEN);
  if (cleanSource) attributes.SIGNUP_SOURCE = cleanSource;

  const doiTemplateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const useDoi = Number.isInteger(doiTemplateId);

  // Brevo rejects doubleOptinConfirmation outright when redirectionUrl is
  // absent — it is where the visitor lands after clicking confirm, not an
  // optional extra. Passing `undefined` (as this did) reads to Brevo as
  // missing and comes back as a bare 400 `missing_parameter`, which surfaces
  // to the visitor as a generic "try again shortly" they can never fix.
  // Fail as a config error instead, the same way a missing key does.
  const doiRedirectUrl = (process.env.BREVO_DOI_REDIRECT_URL || '').trim();
  if (useDoi && !doiRedirectUrl) {
    return json(503, {
      error: 'Signup is not configured on this server (BREVO_DOI_TEMPLATE_ID is set but BREVO_DOI_REDIRECT_URL is empty).',
    });
  }

  // Brevo stores redirectionUrl per DOI request, so each subscriber can get
  // their own — which means we can carry who they are through the confirmation
  // click and spare them retyping their address on /welcome. We know the
  // address right here; no need to depend on whatever (if anything) Brevo
  // chooses to append. Encrypted rather than plain, see _token.js.
  function redirectWithToken(base, email) {
    try {
      const u = new URL(base);
      const token = encodeEmailToken(email);
      if (token) u.searchParams.set('t', token);
      return u.toString();
    } catch {
      // A malformed BREVO_DOI_REDIRECT_URL must not cost us the signup — send
      // it through unchanged and let the visitor type their address instead.
      return base;
    }
  }

  const url = useDoi ? BREVO_DOI_URL : BREVO_CONTACTS_URL;
  const payload = useDoi
    ? {
        email: cleanEmail,
        attributes,
        includeListIds: [listId],
        templateId: doiTemplateId,
        redirectionUrl: redirectWithToken(doiRedirectUrl, cleanEmail),
      }
    : { email: cleanEmail, attributes, listIds: [listId], updateEnabled: true };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) return json(200, { ok: true, doi: useDoi });

    let detail = {};
    try {
      detail = await res.json();
    } catch {
      /* Brevo returns an empty body on some 2xx/4xx — nothing to parse. */
    }

    // Already subscribed. Not an error the visitor can act on, and saying so
    // would leak list membership, so it reads as success.
    if (detail?.code === 'duplicate_parameter') return json(200, { ok: true, doi: useDoi });

    console.error('[brevo] subscribe failed', res.status, detail);
    return json(502, { error: 'We could not complete your signup. Please try again shortly.' });
  } catch (err) {
    console.error('[brevo] subscribe threw', err);
    return json(502, { error: 'We could not reach the mailing list. Please try again shortly.' });
  }
}
