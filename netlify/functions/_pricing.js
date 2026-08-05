// Single source of truth for cart maths, shared by /api/discount and
// /api/order so a quoted discount and a charged discount can never disagree.
//
// Everything here runs SERVER-SIDE ONLY and recomputes from scratch. The
// browser sends what was ordered (slug, qty, size, colour) and which code was
// typed — never prices, never totals. A checkout that trusted client-sent
// money would let anyone place a Rs. 0 order with a devtools console.
//
// TAX: see TAX_RATE below — worth a decision before launch.

// Shipping is free on every order, nationwide — no threshold, no flat rate.
// It used to be Rs. 299 below a Rs. 5,000 threshold.
export const FLAT_SHIPPING = 0;

// Zero: listed prices are tax-inclusive, which is the norm in Pakistani
// retail and what Terms.jsx has always told customers ("All prices are in
// Pakistani Rupees and include applicable taxes"). Checkout used to add 16%
// on top, contradicting that and turning a Rs. 3,699 suit into Rs. 4,590 on
// the final screen. Set TAX_RATE if you ever need to charge tax separately.
export const TAX_RATE = Number(process.env.TAX_RATE ?? 0);

// Discount codes are NOT defined here. They are per-subscriber, single-use
// `voucher` documents — see _vouchers.js. A shared code in an env var used to
// live in this file; it was reusable by anyone it was forwarded to, so it is
// gone deliberately. Don't reintroduce one: quoting and claiming have to go
// through the voucher store or "single use" stops being true.

/**
 * Shipping/tax/total from a subtotal and an already-validated discount.
 * With both rates at zero the total is simply goods less discount — the
 * fields are still returned so the order document and emails keep a complete
 * record, and so reinstating either charge is a one-line change here.
 */
export function computeTotals(subtotal, discountAmount = 0) {
  const discount = Math.min(Math.max(0, discountAmount), subtotal);
  const goods = subtotal - discount;
  const shipping = FLAT_SHIPPING;
  const taxes = Math.round(goods * TAX_RATE);
  return {
    subtotal,
    discount,
    shipping,
    taxes,
    total: goods + shipping + taxes,
  };
}
