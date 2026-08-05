// Server-side product pricing. Shared by /api/discount and /api/order.
//
// THE POINT OF THIS FILE: prices come from Sanity, never from the request
// body. The browser tells us *what* was ordered — slug, quantity, stitching,
// colour — and the server decides what it costs. Accepting a client-sent
// price or subtotal would let anyone open devtools and buy the catalogue for
// nothing, which is the single most common way a hand-rolled checkout leaks
// money.
//
// Uses the plain HTTP API rather than @sanity/client so this stays importable
// under both the Netlify Functions runtime and the Vite dev middleware without
// dragging the browser-oriented client (and its import.meta.env access) along.
const API_VERSION = '2025-01-01';
const MAX_LINES = 40;
const MAX_QTY_PER_LINE = 20;

function projectRef() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
  return projectId ? { projectId, dataset } : null;
}

async function fetchProductsBySlug(slugs) {
  const ref = projectRef();
  if (!ref) return null;

  const query = `*[_type == "product" && slug.current in $slugs]{
    _id, name, "slug": slug.current, price, fabric, stock
  }`;
  const url =
    `https://${ref.projectId}.api.sanity.io/v${API_VERSION}/data/query/${ref.dataset}` +
    `?query=${encodeURIComponent(query)}&$slugs=${encodeURIComponent(JSON.stringify(slugs))}`;

  const headers = { Accept: 'application/json' };
  // A read token is optional — the dataset is public — but honour one if set
  // so this keeps working on a private dataset.
  if (process.env.SANITY_WRITE_TOKEN) {
    headers.Authorization = `Bearer ${process.env.SANITY_WRITE_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  const data = await res.json();
  return data.result || [];
}

/**
 * Prices a cart from the catalogue.
 *
 * @param {Array<{slug: string, qty: number, size?: string|null, colour?: string|null}>} rawLines
 * @returns {Promise<{ok: true, lines: Array, subtotal: number} | {ok: false, error: string, status?: number}>}
 */
export async function priceLines(rawLines) {
  if (!Array.isArray(rawLines) || rawLines.length === 0) {
    return { ok: false, error: 'Your bag is empty.' };
  }
  if (rawLines.length > MAX_LINES) {
    return { ok: false, error: 'Too many items in one order. Please contact us directly.' };
  }

  const slugs = [...new Set(rawLines.map((l) => String(l?.slug || '').trim()).filter(Boolean))];
  if (slugs.length === 0) return { ok: false, error: 'Your bag is empty.' };

  let products;
  try {
    products = await fetchProductsBySlug(slugs);
  } catch (err) {
    console.error('[catalogue] price lookup failed', err);
    return { ok: false, error: 'We could not price your bag just now. Please try again shortly.', status: 502 };
  }

  if (products === null) {
    return { ok: false, error: 'The store catalogue is not configured on this server.', status: 503 };
  }

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const lines = [];
  let subtotal = 0;

  for (const raw of rawLines) {
    const slug = String(raw?.slug || '').trim();
    const product = bySlug.get(slug);
    // Reject rather than skip. Silently dropping an unknown line would let
    // someone check out with items we never priced and never packed.
    if (!product) {
      return { ok: false, error: `We can no longer find "${slug}" in the catalogue. Please remove it and try again.` };
    }
    if (typeof product.price !== 'number') {
      return { ok: false, error: `"${product.name}" is not available to order right now.` };
    }

    const qty = Math.floor(Number(raw?.qty));
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) {
      return { ok: false, error: `Please choose a quantity between 1 and ${MAX_QTY_PER_LINE}.` };
    }

    const lineTotal = product.price * qty;
    subtotal += lineTotal;

    const size = raw?.size ? String(raw.size).slice(0, 20) : null;
    lines.push({
      productId: product._id,
      productName: product.name,
      productSlug: product.slug,
      fabric: product.fabric || null,
      // Null size means unstitched — the default sale. Recorded in words so
      // the packing slip cannot be misread.
      stitching: size ? `Stitched ${size}` : 'Unstitched',
      colour: raw?.colour ? String(raw.colour).slice(0, 40) : null,
      qty,
      unitPrice: product.price,
      lineTotal,
    });
  }

  return { ok: true, lines, subtotal };
}
