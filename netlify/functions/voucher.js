// Releases the Rs. 500 voucher code — but only to a confirmed member of the
// list. POST /api/voucher  { email }
//
// The code lives in this function's environment, never in the client bundle.
// It used to be a const in src/pages/Welcome.jsx, which meant it shipped in
// the JS to every visitor and /welcome handed it to anyone who guessed the
// URL. Worse, a public page with a discount code on it gets scraped onto
// coupon aggregators within weeks.
//
// The check is deliberately simple: does Brevo have this contact, is it
// double-opt-in confirmed, and is it on our list. That is the same question
// "are you actually a subscriber" — no extra token scheme to keep in sync.
//
// The code issued here is now PERSONAL AND SINGLE-USE — a `voucher` document
// unique to this address, consumed at checkout (see _vouchers.js). It used to
// be one shared string from an env var, reusable forever by anyone it was
// forwarded to.
//
// Idempotent on purpose: revisiting /welcome, or clicking the confirmation
// link twice, returns the SAME code rather than minting a second one.
//
// Someone who knows a confirmed subscriber's address can still pull that
// subscriber's code — but they can only spend it once, and doing so burns it
// for the person it belonged to. That is a support problem, not a leak.
import { decodeEmailToken } from './_token.js';
import { issueVoucherFor } from './_vouchers.js';

const BREVO_CONTACT_URL = 'https://api.brevo.com/v3/contacts';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
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

  // Two ways in. The token is what the confirmation redirect carries, so the
  // common path needs no typing at all; the typed address stays as the fallback
  // for anyone who lands here without it (bookmark, forwarded link, retry).
  // A token that fails to decrypt falls through to the typed value rather than
  // erroring — otherwise a stale link from a rotated key would dead-end.
  const fromToken = body?.token ? decodeEmailToken(body.token) : null;
  const email = String(fromToken || body?.email || '').trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return json(400, { ok: false, error: 'Please enter the email address you signed up with.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !Number.isInteger(listId)) {
    return json(503, { ok: false, error: 'Voucher lookup is not configured on this server.' });
  }

  try {
    const res = await fetch(`${BREVO_CONTACT_URL}/${encodeURIComponent(email)}`, {
      headers: { 'api-key': apiKey, Accept: 'application/json' },
    });

    if (res.status === 404) {
      return json(404, {
        ok: false,
        error: 'We can’t find a confirmed signup for that address. Check the link in your email first.',
      });
    }
    if (!res.ok) {
      console.error('[brevo] voucher lookup failed', res.status);
      return json(502, { ok: false, error: 'We could not check your signup just now. Please try again shortly.' });
    }

    const contact = await res.json();
    const onList = Array.isArray(contact.listIds) && contact.listIds.includes(listId);
    // Brevo writes this attribute on the contact when the confirmation link is
    // clicked. Its key really does contain a hyphen.
    const confirmed = String(contact.attributes?.['DOUBLE_OPT-IN'] ?? '') === '1';

    if (!onList || !confirmed) {
      return json(403, {
        ok: false,
        error: 'That address hasn’t been confirmed yet. Open the email we sent and tap the confirm link.',
      });
    }

    // Confirmed subscriber — hand back their personal code, minting one on
    // first visit and returning the same one on every visit after.
    const issued = await issueVoucherFor(email);
    if (!issued.ok) {
      return json(502, { ok: false, error: 'We could not issue your code just now. Please try again shortly.' });
    }

    return json(200, {
      ok: true,
      code: issued.code,
      amount: issued.amount,
      minSpend: issued.minSpend,
      expiresAt: issued.expiresAt || null,
    });
  } catch (err) {
    console.error('[voucher] issue failed', err);
    return json(502, { ok: false, error: 'We could not check your signup just now. Please try again shortly.' });
  }
}
