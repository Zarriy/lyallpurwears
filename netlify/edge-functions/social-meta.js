// Per-route social-share metadata, injected into index.html at request time.
//
// WHY AN EDGE FUNCTION: this storefront is a client-rendered SPA — Netlify's
// SPA fallback serves the same index.html for every route, and the crawlers
// behind WhatsApp, Twitter/X, Facebook, LinkedIn, Telegram and iMessage read
// that raw HTML without ever running the bundle. Without this, every shared
// product link previews as the generic homepage card. This function rewrites
// the authored meta block (see index.html) with the route's real title,
// description and image before the HTML leaves the CDN.
//
// Product/collection data comes from Sanity's public GROQ HTTP API (same
// pattern as netlify/functions/_catalogue.js), falling back to the static
// catalogue — and on any error the untouched page ships (`onError: bypass`),
// so sharing can degrade but the store can't break.
//
// Runs on Deno, so imports from src/ must stay dependency-free and pure —
// src/seo/meta.js and src/data/products.js both are, on purpose.
import { PRODUCTS, CATEGORIES } from '../../src/data/products.js';
import {
  matchRoute,
  STATIC_ROUTES,
  NOT_FOUND_META,
  productMeta,
  categoryMeta,
  applyMetaToHtml,
} from '../../src/seo/meta.js';

const API_VERSION = '2025-01-01';
const SANITY_TIMEOUT_MS = 1500;

function env(name) {
  try {
    if (typeof Netlify !== 'undefined' && Netlify.env) return Netlify.env.get(name);
  } catch {
    /* fall through */
  }
  try {
    return Deno.env.get(name);
  } catch {
    /* fall through — also covers `Deno` not existing outside the edge runtime */
  }
  // Node (local testing) — absent on Deno, hence the guard.
  return typeof process !== 'undefined' ? process.env?.[name] : undefined;
}

// Sanity's CDN-backed query endpoint; null on any failure (no project id,
// timeout, non-200) so callers drop to the static catalogue.
async function groq(query, params) {
  const projectId = env('VITE_SANITY_PROJECT_ID') || env('SANITY_PROJECT_ID');
  if (!projectId) return null;
  const dataset = env('VITE_SANITY_DATASET') || env('SANITY_DATASET') || 'production';

  const qs = new URLSearchParams({ query });
  for (const [key, value] of Object.entries(params)) qs.set(`$${key}`, JSON.stringify(value));
  const url = `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}?${qs}`;

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), SANITY_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()).result ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Sanity's image pipeline crops to the 1200×630 card canvas.
const cardCrop = (url) => (url ? `${url}?w=1200&h=630&fit=crop&auto=format` : undefined);

async function resolveMeta(pathname) {
  const match = matchRoute(pathname);
  if (match.kind === 'static') return STATIC_ROUTES[match.path];

  if (match.kind === 'product') {
    const doc = await groq(
      `*[_type == "product" && slug.current == $slug][0]{
        name, fabric, pieces, price, description, seo,
        "imageUrl": images[0].asset->url
      }`,
      { slug: match.slug }
    );
    const product = doc || PRODUCTS.find((p) => p.slug === match.slug);
    if (!product) return NOT_FOUND_META;
    return productMeta({ ...product, imageUrl: cardCrop(doc?.imageUrl) });
  }

  if (match.kind === 'category') {
    const doc = await groq(
      `*[_type == "category" && slug.current == $slug][0]{
        title, tagline, description,
        "imageUrl": heroImage.asset->url
      }`,
      { slug: match.slug }
    );
    const category = doc || CATEGORIES.find((c) => c.slug === match.slug);
    if (!category) return NOT_FOUND_META;
    return categoryMeta({ ...category, imageUrl: cardCrop(doc?.imageUrl) });
  }

  return NOT_FOUND_META;
}

export default async (request, context) => {
  const response = await context.next();

  // Only the SPA's HTML shell gets rewritten — assets and API responses that
  // slip past excludedPath pass through untouched.
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const url = new URL(request.url);
  const meta = await resolveMeta(url.pathname);
  const html = await response.text();
  const rewritten = applyMetaToHtml(html, { ...meta, url: url.origin + url.pathname });

  const headers = new Headers(response.headers);
  // The body changed — both would now lie.
  headers.delete('content-length');
  headers.delete('etag');
  return new Response(rewritten, { status: response.status, headers });
};

export const config = {
  path: '/*',
  excludedPath: ['/assets/*', '/images/*', '/api/*', '/.netlify/*', '/studio/*', '/favicon.svg', '/litmus.png'],
  // A metadata failure must never take a page down — serve the original.
  onError: 'bypass',
};
