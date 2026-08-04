#!/usr/bin/env node
// Seeds the Sanity dataset with the 12 products, 4 collections and 4
// colours currently hardcoded in src/data/products.js, a handful of
// approved sample reviews, and the siteSettings singleton populated with
// the copy currently hardcoded in Product.jsx / Footer.jsx / Contact.jsx.
//
// Uses deterministic `_id`s and `createOrReplace`, so re-running this
// script is idempotent — it will not create duplicates.
//
// Usage:  npm run seed   (requires SANITY_WRITE_TOKEN in .env — see below)
import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// --- tiny .env loader (no dependency) -------------------------------------
function loadEnvFile(file) {
  const full = path.join(rootDir, file);
  if (!existsSync(full)) return;
  const contents = readFileSync(full, 'utf8');
  for (const line of contents.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
loadEnvFile('.env');
loadEnvFile('.env.local');

// --- guard: refuse to run without a write token ---------------------------
const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('\n✖ Cannot seed — missing Sanity configuration.\n');
  if (!projectId) {
    console.error('  VITE_SANITY_PROJECT_ID is not set. Run `npx sanity init` (or paste an existing');
    console.error('  project ID) and add VITE_SANITY_PROJECT_ID=<id> to .env — see SANITY_SETUP.md.\n');
  }
  if (!token) {
    console.error('  SANITY_WRITE_TOKEN is not set. Mint one with Editor permissions at:');
    console.error('    https://www.sanity.io/manage  →  your project  →  API  →  Tokens  →  Add API token');
    console.error('  Then add it to .env as:');
    console.error('    SANITY_WRITE_TOKEN=sk...\n');
  }
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

// --- source data (mirrors src/data/products.js) ----------------------------
const CATEGORIES = [
  { slug: 'lawn', en: 'Lawn', ur: 'لان', tag: 'Featherweight cotton' },
  { slug: 'khaddar', en: 'Khaddar', ur: 'کھدر', tag: 'Hand-loomed' },
  { slug: 'linen', en: 'Linen', ur: 'لینن', tag: 'European weave' },
  { slug: 'dupatta', en: 'Dupatta', ur: 'دوپٹہ', tag: 'The finishing touch' },
];

const COLOURS = [
  { name: 'Ivory Rose', hex: '#F0E0D8' },
  { name: 'Sage', hex: '#B5BFA1' },
  { name: 'Saffron', hex: '#D4A04C' },
  { name: 'Charcoal', hex: '#3A3A3A' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const PRODUCTS = [
  {
    slug: 'gulab', name: 'Gulab', urdu: 'گلاب', productNumber: 1,
    price: 8490, oldPrice: 10500, stock: 6, badge: 'New',
    fabric: '3 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser · Dupatta',
    description: 'Gulab — Urdu for rose — is woven on a hand-loom in Lyallpur and finished beneath a block-printer\'s mallet in Multan. Featherweight, breathable, made for warm afternoons and cool evenings.',
    details: 'A 3-piece unstitched lawn in featherweight cotton, hand block-printed with our signature rose motif. Includes shirt (3.0m), trouser (2.5m) and dupatta (2.5m).',
  },
  {
    slug: 'mehrunissa', name: 'Mehrunissa', urdu: null, productNumber: 2,
    price: 9290, oldPrice: 11500, stock: 3,
    fabric: '3 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser · Dupatta',
    description: 'Named for the empress — a regal lawn in muted jade with a hand-carved paisley border that took our block-makers three weeks to cut.',
    details: '3-piece unstitched lawn. Shirt (3.0m), trouser (2.5m), dupatta (2.5m). Natural dyes throughout.',
  },
  {
    slug: 'yasmin', name: 'Yasmin', urdu: 'یاسمین', productNumber: 3,
    price: 7990, oldPrice: null, stock: 12,
    fabric: '2 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser',
    description: 'A jasmine-white two-piece with a scattered buti print — the quiet workhorse of a summer wardrobe.',
    details: '2-piece unstitched lawn. Shirt (3.0m), trouser (2.5m).',
  },
  {
    slug: 'saba', name: 'Saba', urdu: null, productNumber: 4,
    price: 10490, oldPrice: null, stock: 4, badge: 'Limited',
    fabric: '3 Piece Khaddar', category: 'khaddar', pieces: 'Shirt · Trouser · Shawl',
    description: 'Hand-loomed khaddar in a deep saffron, woven slow on pit-looms and softened with a stone wash.',
    details: '3-piece khaddar. Shirt (3.0m), trouser (2.5m), shawl (2.5m). Hand-loomed in Lyallpur.',
  },
  {
    slug: 'roshni', name: 'Roshni', urdu: 'روشنی', productNumber: 5,
    price: 6790, oldPrice: 8500, stock: 2,
    fabric: '2 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser',
    description: 'Roshni — light — is a sunrise-pink lawn with a fine gold block print along the hem.',
    details: '2-piece unstitched lawn. Shirt (3.0m), trouser (2.5m).',
  },
  {
    slug: 'anaya', name: 'Anaya', urdu: null, productNumber: 6,
    price: 11790, oldPrice: null, stock: 8, badge: 'New',
    fabric: '3 Piece Linen', category: 'linen', pieces: 'Shirt · Trouser · Dupatta',
    description: 'European-weave linen cut for the shoulder months — crisp in the day, soft by evening.',
    details: '3-piece linen. Shirt (3.0m), trouser (2.5m), dupatta (2.5m).',
  },
  {
    slug: 'khushbu', name: 'Khushbu', urdu: 'خوشبو', productNumber: 7,
    price: 7290, oldPrice: null, stock: 14,
    fabric: '2 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser',
    description: 'A powder-sage lawn with a trailing vine motif pressed from hundred-year-old blocks.',
    details: '2-piece unstitched lawn. Shirt (3.0m), trouser (2.5m).',
  },
  {
    slug: 'mahnoor', name: 'Mahnoor', urdu: null, productNumber: 8,
    price: 12990, oldPrice: null, stock: 5,
    fabric: '3 Piece Linen', category: 'linen', pieces: 'Shirt · Trouser · Dupatta',
    description: 'Moonlight-ivory linen with tonal embroidery at the neckline — our most requested formal.',
    details: '3-piece linen. Shirt (3.0m), trouser (2.5m), dupatta (2.5m). Tonal machine embroidery.',
  },
  {
    slug: 'zeenat', name: 'Zeenat', urdu: 'زینت', productNumber: 9,
    price: 9890, oldPrice: null, stock: 7,
    fabric: '3 Piece Khaddar', category: 'khaddar', pieces: 'Shirt · Trouser · Shawl',
    description: 'A winter khaddar in burnt henna, finished with a hand-knotted fringe on the shawl.',
    details: '3-piece khaddar. Shirt (3.0m), trouser (2.5m), shawl (2.5m).',
  },
  {
    slug: 'chandni', name: 'Chandni', urdu: 'چاندنی', productNumber: 10,
    price: 4490, oldPrice: 5500, stock: 9,
    fabric: 'Dupatta', category: 'dupatta', pieces: 'Dupatta',
    description: 'A silver-thread dupatta that catches lamplight the way its namesake catches the moon.',
    details: 'Pure lawn dupatta (2.5m) with woven silver zari border.',
  },
  {
    slug: 'heer', name: 'Heer', urdu: 'ہیر', productNumber: 11,
    price: 5290, oldPrice: null, stock: 11, badge: 'New',
    fabric: 'Dupatta', category: 'dupatta', pieces: 'Dupatta',
    description: 'Block-printed on both borders and hand-rolled at the edges — the Punjab romance, worn.',
    details: 'Pure lawn dupatta (2.5m), double-border block print, hand-rolled hem.',
  },
  {
    slug: 'noor-jehan', name: 'Noor Jehan', urdu: 'نور جہاں', productNumber: 12,
    price: 13490, oldPrice: 15900, stock: 3, badge: 'Limited',
    fabric: '3 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser · Dupatta',
    description: 'The crown of the Mehfil edit — a twelve-screen print in wine and gold, numbered and limited to sixty pieces.',
    details: '3-piece unstitched lawn. Shirt (3.0m), trouser (2.5m), dupatta (2.5m). Numbered edition of 60.',
  },
];

// A handful of approved sample reviews — pulled from the quotes hardcoded
// in Product.jsx's ReviewsSummary and Home.jsx's ReviewsBlock, now real
// documents so ratingBreakdown/average is computed from real data instead
// of the hardcoded 86/10/3/1/0 split.
const REVIEWS = [
  {
    productSlug: 'gulab', authorName: 'Mariam S.', city: 'Karachi', rating: 5,
    text: 'The print is even more beautiful in person — I got the dusty rose and it goes with everything. Stitched up in 4 days.',
    verified: true,
  },
  {
    productSlug: 'gulab', authorName: 'Sarah K.', city: 'Karachi', rating: 5,
    text: 'The lawn is unbelievably soft. I ordered the Gulab in dusty rose — the block print is even better in person. Stitched perfectly within a week.',
    verified: true,
  },
  {
    productSlug: 'mehrunissa', authorName: 'Ayesha N.', city: 'Lahore', rating: 5,
    text: 'Soft, breathable, and the dupatta has gorgeous detailing along the border. Will definitely order again.',
    verified: true,
  },
  {
    productSlug: 'chandni', authorName: 'Hina A.', city: 'Lahore', rating: 5,
    text: 'COD made it so easy to try a new brand. The dupatta alone is worth the price. Will be ordering again for Eid.',
    verified: true,
  },
  {
    productSlug: 'anaya', authorName: 'Faiza R.', city: 'Islamabad', rating: 4,
    text: 'Beautiful packaging, beautiful fabric — you can feel the Lyallpur weave. Took an extra day to arrive but they kept me updated on WhatsApp.',
    verified: true,
  },
];

// Collection descriptions — rendered as the italic line under the title on
// /collections/<slug>. The static catalogue's CATEGORIES carry only a short
// `tag`, so the longer copy lives here.
const CATEGORY_DESCRIPTIONS = {
  lawn: 'Featherweight cotton, hand-block printed and woven on the looms of Lyallpur — built for warm afternoons and cooler evenings.',
  khaddar: 'Hand-loomed on pit-looms and softened with a stone wash. Heavier in the hand, made for the shoulder months.',
  linen: 'European-weave linen cut for structure — crisp through the day, soft by evening.',
  dupatta: 'The finishing touch. Block-printed on both borders and hand-rolled at the edges.',
};

const SITE_SETTINGS = {
  brandName: 'Lyallpurwears',
  tagline: 'Heritage textiles from the city of looms.',
  announcementText: 'FREE SHIPPING OVER RS. 5,000 · COD AVAILABLE NATIONWIDE',
  contactEmail: 'hello@lyallpurwear.pk',
  contactPhone: '+92 300 1234567',
  socialLinks: [
    { _key: 'ig', _type: 'socialLink', platform: 'Instagram', url: 'https://instagram.com/lyallpurwear' },
    { _key: 'fb', _type: 'socialLink', platform: 'Facebook', url: 'https://facebook.com/lyallpurwear' },
    { _key: 'tt', _type: 'socialLink', platform: 'TikTok', url: 'https://tiktok.com/@lyallpurwear' },
    { _key: 'yt', _type: 'socialLink', platform: 'YouTube', url: 'https://youtube.com/@lyallpurwear' },
  ],
  footerCopy: '© 2026 Lyallpur Wear · Faisalabad (Lyallpur), Pakistan',
  // Homepage: which collections appear in the slider below the hero, and
  // which one stocks the horizontal product rail further down.
  homepageCollections: CATEGORIES.map((c) => ({
    _key: `hc-${c.slug}`,
    _type: 'reference',
    _ref: `category-${c.slug}`,
  })),
  featuredCollection: { _type: 'reference', _ref: 'category-lawn' },
  featuredCollectionLimit: 12,
  collectionsIntro: 'Every fabric we weave, every print we cut, gathered in one place.',
  freeShippingThreshold: 5000,
  shippingCells: [
    { _key: 'cod', _type: 'shippingCell', label: 'Cash on Delivery', sublabel: 'Pay when it arrives', kind: 'cod' },
    { _key: 'ship', _type: 'shippingCell', label: 'Free shipping', sublabel: 'Orders over Rs. 5,000', kind: 'shipping' },
    { _key: 'ret', _type: 'shippingCell', label: '7-Day Returns', sublabel: 'No questions asked', kind: 'returns' },
    { _key: 'auth', _type: 'shippingCell', label: 'Authentic Lawn', sublabel: 'Woven in Lyallpur', kind: 'authentic' },
  ],
  trustStripItems: [
    { _key: 'cod', _type: 'trustItem', title: 'Cash on Delivery', subtitle: 'Pay when it arrives' },
    { _key: 'ret', _type: 'trustItem', title: '7-Day Easy Returns', subtitle: 'No questions asked' },
    { _key: 'ship', _type: 'trustItem', title: 'Pakistan-Wide Shipping', subtitle: '2–4 working days' },
    { _key: 'auth', _type: 'trustItem', title: 'Authentic Lawn', subtitle: 'Woven in Lyallpur' },
  ],
  defaultEditionLabel: 'Mehfil Edit',
  seasonLabel: "Mehfil '26",
  sizeGuideUrl: '/size-guide',
  stockUrgencyTemplate: 'Only {stock} pieces left',
  viewingNowTemplate: '{count} people viewing this in the last hour',
  viewingNowCount: 14,
  defaultCareInstructions: 'Cold hand wash separately. Do not bleach. Iron on reverse. Dry in shade.',
  defaultShippingReturns: '2–4 working days nationwide. Cash on Delivery available. 7-day easy returns on unworn pieces with original tags.',
};

// --- id helpers -------------------------------------------------------------
const categoryId = (slug) => `category-${slug}`;
const colourId = (name) => `colour-${slugify(name)}`;
const productId = (slug) => `product-${slug}`;
const reviewId = (productSlug, index) => `review-${productSlug}-${index}`;

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function run() {
  console.log(`\nSeeding dataset "${dataset}" on project "${projectId}"...\n`);

  const tx = client.transaction();

  // Collections
  CATEGORIES.forEach((c, i) => {
    tx.createOrReplace({
      _id: categoryId(c.slug),
      _type: 'category',
      title: c.en,
      slug: { _type: 'slug', current: c.slug },
      urdu: c.ur,
      tagline: c.tag,
      description: CATEGORY_DESCRIPTIONS[c.slug],
      displayOrder: i,
    });
  });

  // Colours
  COLOURS.forEach((c) => {
    tx.createOrReplace({
      _id: colourId(c.name),
      _type: 'colour',
      name: c.name,
      hex: c.hex,
    });
  });

  await tx.commit({ autoGenerateArrayKeys: true });
  console.log(`✓ ${CATEGORIES.length} collections, ${COLOURS.length} colours`);

  // Products (separate transaction — they reference the collections above)
  const productTx = client.transaction();
  PRODUCTS.forEach((p) => {
    productTx.createOrReplace({
      _id: productId(p.slug),
      _type: 'product',
      name: p.name,
      urdu: p.urdu,
      slug: { _type: 'slug', current: p.slug },
      productNumber: p.productNumber,
      category: { _type: 'reference', _ref: categoryId(p.category) },
      fabric: p.fabric,
      pieces: p.pieces,
      price: p.price,
      oldPrice: p.oldPrice ?? undefined,
      stock: p.stock,
      badge: p.badge ?? undefined,
      editionLabel: 'Mehfil Edit',
      colours: COLOURS.map((c) => ({ _type: 'reference', _ref: colourId(c.name), _key: colourId(c.name) })),
      sizes: SIZES,
      unstitchedNote: 'Or order unstitched · Save Rs. 1,200',
      description: p.description,
      details: p.details,
      featured: p.productNumber <= 4,
      displayOrder: p.productNumber,
      // No images seeded — this catalogue has none checked in. The
      // storefront's normalize.js/Placeholder handle a missing image
      // gracefully; add real assets from Studio (Products > <item> > Images).
      images: [],
    });
  });
  await productTx.commit({ autoGenerateArrayKeys: true });
  console.log(`✓ ${PRODUCTS.length} products`);

  // Reviews
  const reviewTx = client.transaction();
  REVIEWS.forEach((r, i) => {
    reviewTx.createOrReplace({
      _id: reviewId(r.productSlug, i),
      _type: 'review',
      product: { _type: 'reference', _ref: productId(r.productSlug) },
      authorName: r.authorName,
      city: r.city,
      rating: r.rating,
      text: r.text,
      verified: r.verified,
      approved: true,
      submittedAt: new Date().toISOString(),
    });
  });
  await reviewTx.commit({ autoGenerateArrayKeys: true });
  console.log(`✓ ${REVIEWS.length} approved sample reviews`);

  // Site settings singleton
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...SITE_SETTINGS,
  });
  console.log('✓ siteSettings singleton');

  console.log('\nDone. Visit /studio to review, or start the site with `npm run dev`.\n');
}

run().catch((err) => {
  console.error('\n✖ Seed failed:', err?.message || err);
  process.exit(1);
});
