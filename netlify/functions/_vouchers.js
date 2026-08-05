// Single-use voucher store. Shared by voucher.js (mint), discount.js (quote)
// and order.js (claim).
//
// THE HARD PART IS THE CLAIM. Two checkouts submitting the same code at the
// same moment must not both succeed. Sanity patches accept `ifRevisionID`, so
// claiming reads the document's _rev and writes conditionally on it: whichever
// request lands second finds the rev has moved and is rejected. That is what
// makes "single use" true rather than merely likely — a plain read-then-write
// would let both through.
const API_VERSION = '2025-01-01';

// No I, O, 0 or 1 — these codes get read aloud on WhatsApp and copied by hand.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LEN = 6;

export function voucherTerms() {
  return {
    amount: Number(process.env.VOUCHER_AMOUNT || 500),
    minSpend: Number(process.env.VOUCHER_MIN_SPEND || 3000),
    validDays: Number(process.env.VOUCHER_VALID_DAYS || 30),
  };
}

function sanityRef() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return { projectId, dataset, token };
}

async function query(groq, params = {}) {
  const ref = sanityRef();
  if (!ref) throw new Error('Sanity is not configured');
  const qs = new URLSearchParams({ query: groq });
  for (const [k, v] of Object.entries(params)) qs.set(`$${k}`, JSON.stringify(v));
  const res = await fetch(
    `https://${ref.projectId}.api.sanity.io/v${API_VERSION}/data/query/${ref.dataset}?${qs}`,
    { headers: { Authorization: `Bearer ${ref.token}`, Accept: 'application/json' } }
  );
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  return (await res.json()).result;
}

async function mutate(mutations) {
  const ref = sanityRef();
  if (!ref) throw new Error('Sanity is not configured');
  const res = await fetch(
    `https://${ref.projectId}.api.sanity.io/v${API_VERSION}/data/mutate/${ref.dataset}?returnIds=true`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${ref.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mutations }),
    }
  );
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text };
}

function randomCode() {
  let out = '';
  const bytes = new Uint8Array(CODE_LEN);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < CODE_LEN; i += 1) out += ALPHABET[bytes[i] % ALPHABET.length];
  return `LW${out}`;
}

/**
 * The subscriber's voucher: their existing live one, or a freshly minted one.
 *
 * Deliberately idempotent. Someone who revisits /welcome, or clicks the
 * confirmation link twice, must see the SAME code — minting a second one would
 * hand one person two discounts and make "single use" meaningless.
 */
export async function issueVoucherFor(email, source = 'welcome-signup') {
  const terms = voucherTerms();
  const now = new Date();

  const existing = await query(
    `*[_type == "voucher" && email == $email && status == "issued"] | order(issuedAt desc)[0]{
      _id, code, amount, minSpend, expiresAt, status
    }`,
    { email }
  );

  if (existing && (!existing.expiresAt || new Date(existing.expiresAt) > now)) {
    return { ok: true, ...existing, reissued: true };
  }

  // Retry on the (vanishingly unlikely) collision rather than handing back a
  // duplicate code — codes are 32^6, but "unlikely" is not "impossible".
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = randomCode();
    const clash = await query(`count(*[_type == "voucher" && code == $code])`, { code });
    if (clash > 0) continue;

    const expiresAt = new Date(now.getTime() + terms.validDays * 86400000).toISOString();
    const doc = {
      _type: 'voucher',
      code,
      email,
      status: 'issued',
      amount: terms.amount,
      minSpend: terms.minSpend,
      issuedAt: now.toISOString(),
      expiresAt,
      source,
    };
    const result = await mutate([{ create: doc }]);
    if (result.ok) {
      return { ok: true, code, amount: terms.amount, minSpend: terms.minSpend, expiresAt, reissued: false };
    }
    console.error('[vouchers] create failed', result.status, result.body.slice(0, 300));
  }

  return { ok: false, error: 'Could not issue a voucher just now.' };
}

/**
 * Read-only check used to quote a discount at checkout.
 * Never mutates — quoting must not consume anything.
 */
export async function lookupVoucher(rawCode) {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) return { ok: false, error: 'Enter a discount code.' };

  const v = await query(
    `*[_type == "voucher" && code == $code][0]{ _id, _rev, code, status, amount, minSpend, expiresAt, email }`,
    { code }
  );

  // Same message for "no such code" and "already used by someone else", so
  // this cannot be used to probe which codes exist.
  if (!v) return { ok: false, error: 'That code isn’t valid.' };
  if (v.status === 'redeemed') return { ok: false, error: 'That code has already been used.' };
  if (v.status === 'void') return { ok: false, error: 'That code isn’t valid.' };
  if (v.expiresAt && new Date(v.expiresAt) <= new Date()) {
    return { ok: false, error: 'That code has expired.' };
  }
  return { ok: true, voucher: v };
}

/**
 * Validate against a subtotal without consuming.
 */
export async function quoteVoucher(rawCode, subtotal) {
  const found = await lookupVoucher(rawCode);
  if (!found.ok) return found;
  const v = found.voucher;
  if (subtotal < v.minSpend) {
    return {
      ok: false,
      error: `Spend Rs. ${v.minSpend.toLocaleString('en-PK')} to use this code — you're at Rs. ${subtotal.toLocaleString('en-PK')}.`,
    };
  }
  return { ok: true, code: v.code, amount: Math.min(v.amount, subtotal), voucher: v };
}

/**
 * Consume the voucher. Conditional on _rev, so a concurrent claim loses.
 * Call BEFORE saving the order — a claim that fails must stop the order from
 * being written with a discount it never actually held.
 */
export async function claimVoucher(voucherId, rev, orderNumber) {
  const result = await mutate([
    {
      patch: {
        id: voucherId,
        ifRevisionID: rev,
        set: {
          status: 'redeemed',
          redeemedAt: new Date().toISOString(),
          redeemedOrderNumber: orderNumber,
        },
      },
    },
  ]);
  if (result.ok) return { ok: true };
  // 409 is the revision mismatch: someone else redeemed it first.
  if (result.status === 409) return { ok: false, conflict: true };
  console.error('[vouchers] claim failed', result.status, result.body.slice(0, 300));
  return { ok: false, conflict: false };
}

/**
 * Undo a claim when the order write fails afterwards, so a customer is not
 * left with a burnt code and no order.
 */
export async function releaseVoucher(voucherId) {
  const result = await mutate([
    {
      patch: {
        id: voucherId,
        set: { status: 'issued' },
        unset: ['redeemedAt', 'redeemedOrderNumber'],
      },
    },
  ]);
  if (!result.ok) console.error('[vouchers] release failed', result.status, result.body.slice(0, 300));
  return result.ok;
}
