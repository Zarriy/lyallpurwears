// Social-share / SEO metadata — the single source of truth for what a link
// to this store looks like when pasted into WhatsApp, Twitter/X, Facebook,
// LinkedIn, iMessage, Telegram, etc.
//
// Consumed from BOTH runtimes, so everything here must stay dependency-free
// and pure (no import.meta.env, no DOM, no Node/Deno APIs):
//   - netlify/edge-functions/social-meta.js rewrites index.html per request —
//     social crawlers never run the SPA's JavaScript, so the raw HTML is the
//     only thing they see.
//   - src/seo/RouteMeta.jsx keeps the live document's tags in step as the
//     visitor navigates, so the browser tab and any JS-executing crawler
//     (Google) agree with what the edge served.

export const SITE_NAME = 'Lyallpur Wear';
export const DEFAULT_TITLE = 'Lyallpur Wear — Heritage Lawn, Woven in Lyallpur';
export const DEFAULT_DESCRIPTION =
  'Hand block-printed lawn, khaddar and linen from the city of looms — chosen in Lyallpur (Faisalabad), Pakistan. Cash on Delivery and free shipping nationwide.';
// The homepage hero, cropped by the Shopify CDN to the 1200×630 canvas every
// platform's large-image card expects.
export const DEFAULT_IMAGE =
  'https://cdn.shopify.com/s/files/1/0773/3136/6059/files/moves_hands_down_and_make_202605161624.jpg?v=1778930697&width=1200&height=630&crop=center';
export const DEFAULT_IMAGE_ALT = 'Model in hand block-printed lawn — Lyallpur Wear';

const page = (title, description, extra = {}) => ({
  title,
  description,
  image: DEFAULT_IMAGE,
  imageAlt: DEFAULT_IMAGE_ALT,
  type: 'website',
  ...extra,
});

export const STATIC_ROUTES = {
  '/': page(DEFAULT_TITLE, DEFAULT_DESCRIPTION),
  '/collections': page(
    'Shop the Collection — Lyallpur Wear',
    'Every fabric we chose this season — lawn, khaddar, linen and dupattas, sold as unstitched cloth. Cash on Delivery and free shipping across Pakistan.'
  ),
  '/about': page(
    'Our Story · The City of Looms — Lyallpur Wear',
    'Before it was Faisalabad it was Lyallpur — eight bazaars around a clock tower, built on the hum of looms. We buy cloth from the people who work them.'
  ),
  '/city-of-looms': page(
    'The City of Looms — Lyallpur Wear',
    'Lyallpur, now Faisalabad: the story of the city whose bazaars and looms every bolt we sell comes from.'
  ),
  '/sustainability': page(
    'Sustainability — Lyallpur Wear',
    'Short runs, natural fibres and cloth bought at asking price — what sustainability means for a buying house in Faisalabad.'
  ),
  '/contact': page(
    'Contact Us — Lyallpur Wear',
    'Questions about an order, a fabric or stitching? WhatsApp us or write — a real person in Faisalabad reads every note, same-day.'
  ),
  '/faq': page(
    'FAQ — Lyallpur Wear',
    'Shipping times, Cash on Delivery, returns, stitching and fabric care — the questions we hear most, answered plainly.'
  ),
  '/shipping-returns': page(
    'Shipping & Returns — Lyallpur Wear',
    'Free nationwide delivery in 2–4 working days, Cash on Delivery on every order, and 7-day easy returns on unworn pieces.'
  ),
  '/size-guide': page(
    'Size Guide — Lyallpur Wear',
    'What arrives in the parcel: measured lengths of unstitched cloth, with measurements for the optional stitched sizes.'
  ),
  '/track-order': page(
    'Track Your Order — Lyallpur Wear',
    'Give us your order number and we will tell you exactly where your parcel is between the studio in Faisalabad and your door.'
  ),
  '/privacy': page('Privacy Policy — Lyallpur Wear', 'How Lyallpur Wear collects, uses and protects your information.'),
  '/terms': page('Terms of Service — Lyallpur Wear', 'The terms that govern shopping with Lyallpur Wear.'),
  '/cart': page('Your Bag — Lyallpur Wear', DEFAULT_DESCRIPTION, { noindex: true }),
  '/checkout': page('Checkout — Lyallpur Wear', DEFAULT_DESCRIPTION, { noindex: true }),
  // A page that exists to display a voucher code has no business in search
  // results — indexed voucher pages end up scraped onto coupon aggregators.
  '/welcome': page('Welcome — Your Rs. 500 Voucher | Lyallpur Wear', 'Confirm your signup and claim Rs. 500 off your first order.', {
    noindex: true,
  }),
};

export const NOT_FOUND_META = page('Page Not Found — Lyallpur Wear', DEFAULT_DESCRIPTION, { noindex: true });

/** Classifies a pathname: static page, product PDP, category listing, or 404. */
export function matchRoute(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (Object.prototype.hasOwnProperty.call(STATIC_ROUTES, path)) return { kind: 'static', path };
  let m = path.match(/^\/product\/([^/]+)$/);
  if (m) return { kind: 'product', slug: decodeURIComponent(m[1]) };
  m = path.match(/^\/collections\/([^/]+)$/);
  if (m) return { kind: 'category', slug: decodeURIComponent(m[1]) };
  return { kind: 'notFound' };
}

const fmtPrice = (n) => `Rs. ${Number(n).toLocaleString('en-PK')}`;

function truncate(s, max) {
  if (!s || s.length <= max) return s;
  return `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

/**
 * Share card for a product. Works with any of the product shapes in this
 * repo — the static catalogue, the store-normalized card, or the edge
 * function's GROQ projection. A Studio-set `seo.title` / `seo.description`
 * always wins.
 */
export function productMeta(prod) {
  const title = prod.seo?.title || [prod.name, prod.fabric].filter(Boolean).join(' — ') + ' | Lyallpur Wear';
  const priceLine = prod.price != null ? `${fmtPrice(prod.price)} · ` : '';
  const body =
    prod.description ||
    `${[prod.fabric, prod.pieces].filter(Boolean).join(' — ') || 'Unstitched cloth'}, chosen in Lyallpur.`;
  const description =
    prod.seo?.description || truncate(`${priceLine}${body} Cash on Delivery across Pakistan.`, 200);
  return {
    title,
    description,
    image: prod.imageUrl || DEFAULT_IMAGE,
    imageAlt: prod.imageUrl ? `${prod.name} — ${SITE_NAME}` : DEFAULT_IMAGE_ALT,
    type: 'product',
    price: prod.price ?? null,
  };
}

/** Share card for a collection. Accepts Sanity ({title, tagline}) and client/static ({en, tag}) shapes. */
export function categoryMeta(cat) {
  const name = cat.title || cat.en;
  const tag = cat.tagline || cat.tag;
  const description =
    cat.description ||
    `${tag ? `${tag}. ` : ''}Unstitched ${String(name).toLowerCase()} chosen in the bazaars of Lyallpur. Cash on Delivery and free shipping across Pakistan.`;
  return {
    title: `${name} Collection — ${SITE_NAME}`,
    description: truncate(description, 200),
    image: cat.imageUrl || cat.heroImageUrl || DEFAULT_IMAGE,
    imageAlt: `${name} collection — ${SITE_NAME}`,
    type: 'website',
  };
}

export function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Rewrites one authored meta tag's content attribute. Relies on the tags in
// index.html being written attribute-first (`property=`/`name=` before
// `content=`) — they are authored there specifically to keep this true.
function setContent(html, attr, value) {
  const escapedAttr = attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(<meta\\s+${escapedAttr}\\s+content=")[^"]*(")`);
  return html.replace(re, (_, open, close) => open + value + close);
}

/**
 * Rewrites index.html's authored meta block for one route. `meta` is a value
 * from STATIC_ROUTES / productMeta / categoryMeta, plus an optional absolute
 * `url` for og:url. Injected-only tags (og:url, robots, product price) are
 * appended before </head> since the static file deliberately omits them.
 */
export function applyMetaToHtml(html, meta) {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const image = escapeHtml(meta.image || DEFAULT_IMAGE);

  let out = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`);
  out = setContent(out, 'name="description"', description);
  out = setContent(out, 'property="og:type"', meta.type || 'website');
  out = setContent(out, 'property="og:title"', title);
  out = setContent(out, 'property="og:description"', description);
  out = setContent(out, 'property="og:image"', image);
  out = setContent(out, 'property="og:image:alt"', escapeHtml(meta.imageAlt || meta.title));
  out = setContent(out, 'name="twitter:title"', title);
  out = setContent(out, 'name="twitter:description"', description);
  out = setContent(out, 'name="twitter:image"', image);

  const extra = [];
  if (meta.url) extra.push(`<meta property="og:url" content="${escapeHtml(meta.url)}" />`);
  if (meta.noindex) extra.push('<meta name="robots" content="noindex, nofollow" />');
  if (meta.type === 'product' && meta.price != null) {
    extra.push(`<meta property="product:price:amount" content="${Number(meta.price)}" />`);
    extra.push('<meta property="product:price:currency" content="PKR" />');
  }
  if (extra.length) out = out.replace('</head>', `  ${extra.join('\n    ')}\n  </head>`);
  return out;
}
