// Validates a discount code against a cart. POST /api/discount
//   { code, lines: [{ slug, qty }] }
//
// Replaced the checkout's "Gift card" box, which had a permanently-greyed
// Apply button wired to nothing.
//
// The subtotal is priced from Sanity here rather than taken from the request,
// for the same reason /api/order does it: a client-supplied subtotal would let
// anyone claim they had met the minimum spend. This endpoint only ever
// *quotes* — /api/order re-validates independently before anything is stored.
import { priceLines } from './_catalogue.js';
import { computeTotals } from './_pricing.js';
import { quoteVoucher } from './_vouchers.js';

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

  const priced = await priceLines(body?.lines);
  if (!priced.ok) return json(priced.status || 400, { ok: false, error: priced.error });

  // Quote only — never consumes. The code is claimed at /api/order, so a
  // customer can type it, change their mind, and still have it.
  let result;
  try {
    result = await quoteVoucher(body?.code, priced.subtotal);
  } catch (err) {
    console.error('[discount] voucher lookup failed', err);
    return json(502, { ok: false, error: 'We could not check that code just now. Please try again shortly.' });
  }
  if (!result.ok) return json(200, { ok: false, error: result.error });

  const totals = computeTotals(priced.subtotal, result.amount);
  return json(200, { ok: true, code: result.code, ...totals });
}
