// Keeps the live document's title + social meta tags in step with the route.
//
// The authoritative copy for crawlers is injected server-side by
// netlify/edge-functions/social-meta.js (crawlers don't run this JS); this
// component makes the browser agree — correct tab titles, correct metadata
// for JS-executing crawlers like Google, and no stale og: values if a
// share-sheet or extension reads the live DOM.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../sanity/useStore.js';
import { urlFor } from '../sanity/client.js';
import {
  matchRoute,
  STATIC_ROUTES,
  NOT_FOUND_META,
  productMeta,
  categoryMeta,
  DEFAULT_IMAGE,
} from './meta.js';

function setContent(selector, value) {
  const el = document.head.querySelector(selector);
  if (el && value != null) el.setAttribute('content', value);
}

// 1200×630 crop of the product's first image, or null when the product has
// no uploads / Sanity isn't configured — productMeta then falls back to the
// site-wide share image.
function shareImageUrl(product) {
  const asset = product.images?.[0]?.asset;
  if (!asset) return null;
  return urlFor(asset)?.width(1200).height(630).fit('crop').url() || null;
}

export function RouteMeta() {
  const { pathname } = useLocation();
  const { products, categories } = useStore();

  useEffect(() => {
    const match = matchRoute(pathname);
    let meta = NOT_FOUND_META;
    if (match.kind === 'static') {
      meta = STATIC_ROUTES[match.path];
    } else if (match.kind === 'product') {
      const product = products.find((p) => p.slug === match.slug);
      if (product) meta = productMeta({ ...product, imageUrl: shareImageUrl(product) });
    } else if (match.kind === 'category') {
      const category = categories.find((c) => c.slug === match.slug);
      if (category) meta = categoryMeta(category);
    }

    document.title = meta.title;
    setContent('meta[name="description"]', meta.description);
    setContent('meta[property="og:type"]', meta.type || 'website');
    setContent('meta[property="og:title"]', meta.title);
    setContent('meta[property="og:description"]', meta.description);
    setContent('meta[property="og:image"]', meta.image || DEFAULT_IMAGE);
    setContent('meta[property="og:image:alt"]', meta.imageAlt || meta.title);
    setContent('meta[name="twitter:title"]', meta.title);
    setContent('meta[name="twitter:description"]', meta.description);
    setContent('meta[name="twitter:image"]', meta.image || DEFAULT_IMAGE);

    // og:url isn't in the static HTML (the edge function injects it with the
    // real request origin) — create it on first navigation.
    let urlTag = document.head.querySelector('meta[property="og:url"]');
    if (!urlTag) {
      urlTag = document.createElement('meta');
      urlTag.setAttribute('property', 'og:url');
      document.head.appendChild(urlTag);
    }
    urlTag.setAttribute('content', window.location.origin + pathname);

    // Cart, checkout, the voucher page and 404s stay out of search results.
    let robots = document.head.querySelector('meta[name="robots"][data-route-meta]');
    if (meta.noindex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        robots.setAttribute('data-route-meta', '');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex, nofollow');
    } else if (robots) {
      robots.remove();
    }
  }, [pathname, products, categories]);

  return null;
}
