// Maps raw Sanity documents into exactly the object shape the existing
// components already expect — see src/data/products.js PRODUCTS entries:
//   { id, slug, name, urdu, price, oldPrice, discount, stock, badge,
//     fabric, category, pieces, rating, reviews, description, details }
//
// `discount` is always derived here from price/oldPrice so it can never
// drift out of sync with the two source numbers (the product schema
// deliberately has no `discount` field).
//
// `rating` / `reviews` / `ratingBreakdown` are derived from the product's
// APPROVED reviews (see queries.js — the reviews subquery is already
// filtered to approved == true, so every review passed in here is safe to
// count). The zero-reviews case is handled explicitly: rating is `null`
// (not NaN, not 0 — 0 would read as "one star"), reviews is 0, and every
// ratingBreakdown bucket is 0.
import { urlFor } from './client.js';

function imageUrl(image, opts = {}) {
  const b = urlFor(image);
  if (!b) return null;
  let chain = b;
  if (opts.width) chain = chain.width(opts.width);
  if (opts.height) chain = chain.height(opts.height);
  return chain.auto('format').url();
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images.map((img) => ({
    url: imageUrl(img, { width: 1200 }),
    alt: img?.alt || '',
    view: img?.view || null,
    // Keep the raw Sanity asset reference around too, in case a consumer
    // wants to build its own urlFor() chain (e.g. hotspot-aware crops).
    asset: img,
  }));
}

function deriveDiscount(price, oldPrice) {
  if (!oldPrice || !price || oldPrice <= price) return null;
  return Math.round((1 - price / oldPrice) * 100);
}

/**
 * Computes { rating, reviews, ratingBreakdown } from a list of approved
 * review docs (each with a `rating` 1-5). Explicitly handles zero reviews.
 */
export function computeRatingSummary(reviews) {
  const list = Array.isArray(reviews) ? reviews : [];
  const count = list.length;

  if (count === 0) {
    return {
      rating: null,
      reviews: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  const rating = Math.round((sum / count) * 10) / 10;

  const buckets = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  list.forEach((r) => {
    const b = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 0)));
    buckets[b] += 1;
  });

  const ratingBreakdown = {};
  Object.keys(buckets).forEach((k) => {
    ratingBreakdown[k] = buckets[k] / count;
  });

  return { rating, reviews: count, ratingBreakdown };
}

/** Category doc -> { slug, en, ur, tag } shape matching src/data/products.js CATEGORIES. */
export function normalizeCategory(raw) {
  if (!raw) return null;
  return {
    id: raw._id,
    slug: raw.slug,
    en: raw.title,
    ur: raw.urdu || null,
    tag: raw.tagline || '',
    description: raw.description || '',
    heroImageUrl: imageUrl(raw.heroImage, { width: 1600 }),
    displayOrder: raw.displayOrder ?? 0,
  };
}

/**
 * Card-only fields (from ALL_PRODUCTS_QUERY) -> the same flat shape as
 * src/data/products.js PRODUCTS, minus fields the card query doesn't fetch
 * (rating/reviews/description/details default to safe empty values since
 * ProductCard.jsx never reads them).
 */
export function normalizeProductCard(raw) {
  if (!raw) return null;
  const discount = deriveDiscount(raw.price, raw.oldPrice);
  return {
    id: raw._id,
    slug: raw.slug,
    name: raw.name,
    urdu: raw.urdu || null,
    productNumber: raw.productNumber ?? null,
    price: raw.price,
    oldPrice: raw.oldPrice ?? null,
    discount,
    stock: raw.stock ?? 0,
    badge: raw.badge || null,
    fabric: raw.fabric,
    category: raw.category?.slug || null,
    pieces: raw.pieces,
    images: normalizeImages(raw.images),
    featured: Boolean(raw.featured),
    displayOrder: raw.displayOrder ?? 0,
    // Not fetched by the card query — kept null/zero rather than undefined
    // so consumers can rely on the keys always being present.
    rating: null,
    reviews: 0,
    description: '',
    details: '',
  };
}

/**
 * Full product doc (from PRODUCT_BY_SLUG_QUERY) -> the same flat shape,
 * fully populated, plus the extra fields the PDP needs beyond the legacy
 * static shape (images, colours, sizes, editionLabel, care/shipping copy,
 * ratingBreakdown, relatedProducts).
 */
export function normalizeProduct(raw) {
  if (!raw) return null;
  const discount = deriveDiscount(raw.price, raw.oldPrice);
  const { rating, reviews, ratingBreakdown } = computeRatingSummary(raw.reviews);

  return {
    id: raw._id,
    slug: raw.slug,
    name: raw.name,
    urdu: raw.urdu || null,
    productNumber: raw.productNumber ?? null,
    price: raw.price,
    oldPrice: raw.oldPrice ?? null,
    discount,
    stock: raw.stock ?? 0,
    badge: raw.badge || null,
    editionLabel: raw.editionLabel || null,
    fabric: raw.fabric,
    category: raw.category?.slug || null,
    pieces: raw.pieces,
    images: normalizeImages(raw.images),
    colours: Array.isArray(raw.colours)
      ? raw.colours.map((c) => ({ name: c.name, hex: c.hex }))
      : [],
    sizes: Array.isArray(raw.sizes) ? raw.sizes : [],
    unstitchedNote: raw.unstitchedNote || null,
    description: raw.description || '',
    details: raw.details || '',
    careInstructions: raw.careInstructions || null,
    shippingReturns: raw.shippingReturns || null,
    featured: Boolean(raw.featured),
    displayOrder: raw.displayOrder ?? 0,
    seo: raw.seo || null,
    rating,
    reviews,
    ratingBreakdown,
    reviewsList: Array.isArray(raw.reviews) ? raw.reviews : [],
    relatedProducts: Array.isArray(raw.relatedProducts)
      ? raw.relatedProducts.map(normalizeProductCard)
      : [],
  };
}

/** Site settings singleton — passthrough with safe defaults. */
export function normalizeSiteSettings(raw) {
  if (!raw) return null;
  return {
    brandName: raw.brandName || 'Lyallpurwears',
    tagline: raw.tagline || '',
    announcementText: raw.announcementText || '',
    contactEmail: raw.contactEmail || '',
    contactPhone: raw.contactPhone || '',
    contactAddress: raw.contactAddress || '',
    contactAddressNote: raw.contactAddressNote || '',
    contactHours: raw.contactHours || [],
    socialLinks: raw.socialLinks || [],
    footerCopy: raw.footerCopy || '',
    // Homepage / collections-page editorial. All three are optional — every
    // consumer falls back (homepageCollections -> all categories,
    // featuredCollection -> whole catalogue, collectionsIntro -> literal
    // copy), so an unpopulated singleton renders the original design.
    homepageCollections: Array.isArray(raw.homepageCollections)
      ? raw.homepageCollections.filter(Boolean).map(normalizeCategory)
      : [],
    featuredCollection: raw.featuredCollection ? normalizeCategory(raw.featuredCollection) : null,
    featuredCollectionLimit: raw.featuredCollectionLimit ?? 12,
    collectionsIntro: raw.collectionsIntro || '',
    freeShippingThreshold: raw.freeShippingThreshold ?? 5000,
    shippingCells: raw.shippingCells || [],
    trustStripItems: raw.trustStripItems || [],
    defaultEditionLabel: raw.defaultEditionLabel || 'Mehfil Edit',
    seasonLabel: raw.seasonLabel || '',
    sizeGuideUrl: raw.sizeGuideUrl || null,
    stockUrgencyTemplate: raw.stockUrgencyTemplate || 'Only {stock} pieces left',
    viewingNowTemplate: raw.viewingNowTemplate || '{count} people viewing this in the last hour',
    viewingNowCount: raw.viewingNowCount ?? 14,
    defaultCareInstructions: raw.defaultCareInstructions || '',
    defaultShippingReturns: raw.defaultShippingReturns || '',
  };
}
