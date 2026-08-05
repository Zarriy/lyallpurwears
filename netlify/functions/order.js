// Places an order. POST /api/order
//   { customer:{firstName,lastName,email,phone}, shipping:{...},
//     lines:[{slug,qty,size,colour}], discountCode?, website? }
//
// Replaced a setTimeout in Checkout.jsx that invented an order number, cleared
// the cart and stored nothing. A COD order left no record of what was bought
// or where to send it.
//
// Order of operations matters: SAVE FIRST, then email. Sanity is the record;
// email is a notification. If the write fails we tell the customer the order
// did not go through. If the write succeeds but email fails, the order still
// exists in Studio and we return success — a failed notification must never
// present as a failed order to someone who is about to be charged on delivery.
import { priceLines } from './_catalogue.js';
import { computeTotals } from './_pricing.js';
import { quoteVoucher, claimVoucher, releaseVoucher } from './_vouchers.js';
import { sendEmail } from './_email.js';

const API_VERSION = '2025-01-01';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = { name: 80, email: 254, phone: 32, address: 200, city: 80, postal: 20 };

const fmt = (n) => `Rs. ${Number(n).toLocaleString('en-PK')}`;

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function clean(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// LPW-YYMMDD-XXXX. Date-stamped so a number is sortable and legible over the
// phone, with a random tail rather than a counter — a sequential id would need
// a lock to stay unique across concurrent checkouts.
function makeOrderNumber() {
  const d = new Date();
  const stamp = [
    String(d.getUTCFullYear()).slice(2),
    String(d.getUTCMonth() + 1).padStart(2, '0'),
    String(d.getUTCDate()).padStart(2, '0'),
  ].join('');
  const tail = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `LPW-${stamp}-${tail}`;
}

function lineRowsHtml(lines) {
  return lines
    .map(
      (l) => `<tr>
  <td style="padding:10px 0;border-bottom:1px solid #E4E4E0;font-family:Georgia,serif;font-size:14px;color:#1A1A1A;">
    ${escapeHtml(l.productName)}<br />
    <span style="font-size:12px;color:#6B6B6B;">${escapeHtml([l.fabric, l.stitching, l.colour].filter(Boolean).join(' · '))}</span>
  </td>
  <td style="padding:10px 0;border-bottom:1px solid #E4E4E0;font-family:Georgia,serif;font-size:14px;color:#6B6B6B;text-align:center;">×${l.qty}</td>
  <td style="padding:10px 0;border-bottom:1px solid #E4E4E0;font-family:Georgia,serif;font-size:14px;color:#1A1A1A;text-align:right;white-space:nowrap;">${fmt(l.lineTotal)}</td>
</tr>`
    )
    .join('');
}

function totalsRowsHtml(t, discountCode) {
  const row = (label, value, bold) => `<tr>
  <td colspan="2" style="padding:6px 0;font-family:Georgia,serif;font-size:${bold ? 16 : 14}px;color:#1A1A1A;${bold ? 'font-weight:bold;' : ''}">${escapeHtml(label)}</td>
  <td style="padding:6px 0;font-family:Georgia,serif;font-size:${bold ? 16 : 14}px;color:#1A1A1A;text-align:right;white-space:nowrap;${bold ? 'font-weight:bold;' : ''}">${escapeHtml(value)}</td>
</tr>`;
  return [
    row('Subtotal', fmt(t.subtotal)),
    t.discount > 0 ? row(`Discount (${discountCode})`, `−${fmt(t.discount)}`) : '',
    row('Shipping', t.shipping === 0 ? 'Free' : fmt(t.shipping)),
    t.taxes > 0 ? row('Taxes', fmt(t.taxes)) : '',
    row('Total', fmt(t.total), true),
  ].join('');
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

  if (body?.website) return json(200, { ok: true, orderNumber: makeOrderNumber() }); // honeypot

  const customer = {
    firstName: clean(body?.customer?.firstName, MAX.name),
    lastName: clean(body?.customer?.lastName, MAX.name),
    email: clean(body?.customer?.email, MAX.email).toLowerCase(),
    phone: clean(body?.customer?.phone, MAX.phone),
  };
  const shippingAddress = {
    address: clean(body?.shipping?.address, MAX.address),
    apartment: clean(body?.shipping?.apartment, MAX.address),
    city: clean(body?.shipping?.city, MAX.city),
    postalCode: clean(body?.shipping?.postalCode, MAX.postal),
    country: 'Pakistan',
  };

  const errs = [];
  if (!customer.email || !EMAIL_RE.test(customer.email)) errs.push('Enter a valid email address.');
  // Required for COD — the rider phones before delivery, so an order without a
  // reachable number is one the courier may not be able to complete.
  if (!customer.phone || customer.phone.replace(/\D/g, '').length < 10) {
    errs.push('Enter a phone number our rider can call.');
  }
  if (!customer.lastName) errs.push('Enter a last name.');
  if (!shippingAddress.address) errs.push('Enter an address.');
  if (!shippingAddress.city) errs.push('Enter a city.');
  if (errs.length) return json(400, { ok: false, error: errs[0], details: errs });

  // Price from the catalogue — never from the request.
  const priced = await priceLines(body?.lines);
  if (!priced.ok) return json(priced.status || 400, { ok: false, error: priced.error });

  const orderNumber = makeOrderNumber();
  const placedAt = new Date().toISOString();

  // --- 0. Claim the voucher BEFORE saving. ------------------------------
  // Claim-then-write, not write-then-claim: if the claim loses a race we must
  // reject the order outright rather than store one carrying a discount it
  // never actually held. /api/discount only quoted; this is what consumes.
  let discount = { ok: false, amount: 0, code: null };
  let claimedVoucherId = null;
  if (body?.discountCode) {
    let quote;
    try {
      quote = await quoteVoucher(body.discountCode, priced.subtotal);
    } catch (err) {
      console.error('[order] voucher lookup failed', err);
      return json(502, { ok: false, error: 'We could not check your discount code. Please try again shortly.' });
    }
    if (!quote.ok) {
      // Surface it rather than silently dropping the discount — the customer
      // agreed to a total that included it and must not be quietly charged more.
      return json(409, { ok: false, error: quote.error, discountRejected: true });
    }

    const claim = await claimVoucher(quote.voucher._id, quote.voucher._rev, orderNumber);
    if (!claim.ok) {
      return json(409, {
        ok: false,
        discountRejected: true,
        error: claim.conflict
          ? 'That code was just used on another order. Please remove it and try again.'
          : 'We could not apply your discount code. Please remove it and try again.',
      });
    }
    claimedVoucherId = quote.voucher._id;
    discount = { ok: true, amount: quote.amount, code: quote.code };
  }

  const totals = computeTotals(priced.subtotal, discount.ok ? discount.amount : 0);

  const doc = {
    _type: 'order',
    orderNumber,
    status: 'new',
    placedAt,
    customer,
    shippingAddress,
    lines: priced.lines.map((l) => ({ _type: 'object', _key: `${l.productSlug}-${Math.random().toString(36).slice(2, 9)}`, ...l })),
    subtotal: totals.subtotal,
    discountCode: discount.ok ? discount.code : null,
    discountAmount: totals.discount,
    shipping: totals.shipping,
    taxes: totals.taxes,
    total: totals.total,
    paymentMethod: 'cod',
  };

  // --- 1. Save. Nothing else matters if this fails. --------------------
  // Any failure past this point must hand the voucher back — a customer left
  // with a burnt code and no order is the worst outcome of the pair.
  const abort = async (status, error) => {
    if (claimedVoucherId) await releaseVoucher(claimedVoucherId);
    return json(status, { ok: false, error });
  };

  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) {
    console.error('[order] cannot save — missing SANITY_WRITE_TOKEN or project id');
    return abort(503, 'We could not place your order just now. Please WhatsApp us and we will take it directly.');
  }

  try {
    const res = await fetch(
      `https://${projectId}.api.sanity.io/v${API_VERSION}/data/mutate/${dataset}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mutations: [{ create: doc }] }),
      }
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[order] Sanity write failed', res.status, detail.slice(0, 400));
      return abort(502, 'We could not place your order just now. Please WhatsApp us and we will take it directly.');
    }
  } catch (err) {
    console.error('[order] Sanity write threw', err);
    return abort(502, 'We could not place your order just now. Please WhatsApp us and we will take it directly.');
  }

  // --- 2. Confirm to the CUSTOMER. -------------------------------------
  // The shop is not emailed. New orders appear in Sanity Studio (Orders → To
  // fulfil), which is the actual work queue — an alert copy in someone's inbox
  // is a second place to look and a second place to miss something.
  //
  // This one email genuinely matters: for a COD order it is the customer's
  // only record of what they bought and what to have ready in cash. The
  // outcome is written back onto the order document so a failure is visible in
  // Studio rather than buried in a server log.
  const summaryTable = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
    ${lineRowsHtml(priced.lines)}
    ${totalsRowsHtml(totals, discount.code)}
  </table>`;

  const inbox = process.env.CONTACT_INBOX;

  const confirmation = await sendEmail({
    label: `customer confirmation ${orderNumber}`,
    to: [customer.email],
    replyTo: inbox ? inbox.split(',')[0].trim() : undefined,
    subject: `Your Lyallpur Wear order ${orderNumber}`,
    html: `<div style="background:#F4F1EA;padding:24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background:#FAFAF7;">
    <tr><td align="center" style="padding:34px 28px 6px;font-family:Georgia,serif;font-size:22px;letter-spacing:0.16em;color:#0A0A0A;">LYALLPUR</td></tr>
    <tr><td align="center" style="padding-bottom:24px;font-family:Georgia,serif;font-size:9px;letter-spacing:0.44em;color:#B8924A;">W E A R</td></tr>
    <tr><td style="padding:0 28px;"><div style="height:1px;background:#E4E4E0;font-size:0;">&nbsp;</div></td></tr>
    <tr><td style="padding:26px 28px 0;font-family:Georgia,serif;font-size:16px;line-height:1.75;color:#1A1A1A;">
      <p style="margin:0 0 16px;">${escapeHtml(customer.firstName || 'Hello')},</p>
      <p style="margin:0 0 16px;">Shukriya — your order is confirmed. Reference <strong>${escapeHtml(orderNumber)}</strong>.</p>
      <p style="margin:0 0 16px;">We'll dispatch to ${escapeHtml(shippingAddress.city)} within 2–4 working days and our rider will call before delivery. Please keep <strong>${escapeHtml(fmt(totals.total))}</strong> ready in cash.</p>
    </td></tr>
    <tr><td style="padding:12px 28px 26px;">${summaryTable}</td></tr>
    <tr><td style="padding:0 28px 28px;font-family:Georgia,serif;font-size:13px;line-height:1.7;color:#6B6B6B;">
      A reminder that everything ships <strong>unstitched</strong> — measured lengths of cloth for your tailor, unless you chose a stitched size.
    </td></tr>
    <tr><td style="background:#0A0A0A;padding:22px 28px;font-family:Georgia,serif;font-size:11px;line-height:1.8;color:rgba(250,250,247,0.6);text-align:center;">
      Lyallpur Wear · Faisalabad (Lyallpur), Pakistan<br />Reply to this email or message us on WhatsApp with any question.
    </td></tr>
  </table>
</div>`,
    text: `${customer.firstName || 'Hello'},\n\nYour order is confirmed. Reference ${orderNumber}.\n\n${priced.lines.map((l) => `${l.qty} × ${l.productName} (${l.stitching}) — ${fmt(l.lineTotal)}`).join('\n')}\n\nSubtotal ${fmt(totals.subtotal)}${totals.discount ? `\nDiscount ${discount.code} −${fmt(totals.discount)}` : ''}\nShipping ${totals.shipping === 0 ? 'Free' : fmt(totals.shipping)}\nTaxes ${fmt(totals.taxes)}\nTOTAL ${fmt(totals.total)}\n\nKeep ${fmt(totals.total)} ready in cash for the rider. Dispatch in 2-4 working days to ${shippingAddress.city}.\n\nEverything ships unstitched unless you chose a stitched size.`,
  });

  // Stamp the result onto the order so Studio can show "confirmation not sent"
  // next to the order it belongs to. Best-effort: if this patch fails the order
  // is still correct, we just lose the delivery note.
  try {
    await fetch(`https://${projectId}.api.sanity.io/v${API_VERSION}/data/mutate/${dataset}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mutations: [
          {
            patch: {
              query: `*[_type == "order" && orderNumber == "${orderNumber}"]`,
              set: {
                confirmationEmail: {
                  status: confirmation.ok ? 'sent' : 'failed',
                  provider: confirmation.provider || null,
                  sentAt: new Date().toISOString(),
                  error: confirmation.ok ? null : JSON.stringify(confirmation.errors).slice(0, 500),
                },
              },
            },
          },
        ],
      }),
    });
  } catch (err) {
    console.error('[order] could not record confirmation status', err);
  }

  return json(201, {
    ok: true,
    orderNumber,
    placedAt,
    totals,
    discountCode: discount.ok ? discount.code : null,
    lines: priced.lines,
    customer: { firstName: customer.firstName, email: customer.email },
    shippingCity: shippingAddress.city,
    // The success page tells the customer whether to expect an email, rather
    // than promising one that may not have gone.
    confirmationEmailSent: confirmation.ok,
  });
}
