// StoreProvider + useStore() — fetches products/categories/settings from
// Sanity once and exposes them with loading/error state.
//
// Falls back to the static catalogue in src/data/products.js whenever:
//   - the Sanity client is null (VITE_SANITY_PROJECT_ID unset), or
//   - the fetch throws (network error, wrong project id, CORS not
//     configured yet — see SANITY_SETUP.md), or
//   - Sanity is reachable but the dataset is still empty (before
//     `npm run seed` has been run).
// This means the site renders correctly before `sanity init`/seed have
// ever been run, which is the whole point of this data layer.
//
// Exports the same helper names the app's static data module already
// exposes (formatPrice, getProduct, relatedProducts) off the useStore()
// context value, plus a separate useProductDetail(slug) hook for the PDP's
// fuller per-product fetch (see below).
//
// NOTE on cart ids: cart lines are keyed by `product.id`, which is a
// numeric id in the static catalogue but a string Sanity `_id` once
// CMS-backed. src/context/CartContext.jsx sources its product list from
// this module's `products` (rather than importing the static catalogue
// directly) precisely so it stays correct under either id type — see the
// comment there for details.
import { createElement, useContext, createContext, useEffect, useMemo, useState } from 'react';
import { client } from './client.js';
import { ALL_PRODUCTS_QUERY, ALL_CATEGORIES_QUERY, SITE_SETTINGS_QUERY, PRODUCT_BY_SLUG_QUERY } from './queries.js';
import { normalizeProductCard, normalizeCategory, normalizeSiteSettings, normalizeProduct, computeRatingSummary } from './normalize.js';
import {
  PRODUCTS as STATIC_PRODUCTS,
  CATEGORIES as STATIC_CATEGORIES,
  formatPrice as staticFormatPrice,
  getProduct as staticGetProduct,
} from '../data/products.js';

const StoreContext = createContext(null);

// Fallback data keeps the exact shape/ids of the static catalogue (numeric
// `id`, `category` as a plain slug string) so CartContext and every
// existing component keep working unmodified while Sanity is unconfigured.
const FALLBACK_PRODUCTS = STATIC_PRODUCTS;
const FALLBACK_CATEGORIES = STATIC_CATEGORIES;

const initialSource = client ? 'loading' : 'static';

function initialState() {
  return {
    products: FALLBACK_PRODUCTS,
    categories: FALLBACK_CATEGORIES,
    settings: null,
    loading: Boolean(client),
    error: null,
    source: initialSource,
  };
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!client) return undefined; // no project configured — stay on static fallback

    let cancelled = false;

    (async () => {
      try {
        const [productsRaw, categoriesRaw, settingsRaw] = await Promise.all([
          client.fetch(ALL_PRODUCTS_QUERY),
          client.fetch(ALL_CATEGORIES_QUERY),
          client.fetch(SITE_SETTINGS_QUERY),
        ]);
        if (cancelled) return;

        const products = (productsRaw || []).map(normalizeProductCard);
        const categories = (categoriesRaw || []).map(normalizeCategory);
        const settings = normalizeSiteSettings(settingsRaw);

        if (!products.length) {
          // Sanity is reachable but empty (dataset not seeded yet).
          setState({
            products: FALLBACK_PRODUCTS,
            categories: categories.length ? categories : FALLBACK_CATEGORIES,
            settings,
            loading: false,
            error: null,
            source: 'static-empty',
          });
          return;
        }

        setState({ products, categories, settings, loading: false, error: null, source: 'sanity' });
      } catch (err) {
        if (cancelled) return;
        if (typeof console !== 'undefined') {
          console.warn('[sanity] Falling back to static catalogue —', err?.message || err);
        }
        setState({
          products: FALLBACK_PRODUCTS,
          categories: FALLBACK_CATEGORIES,
          settings: null,
          loading: false,
          error: err,
          source: 'static-error',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => {
    const { products, categories, settings, loading, error, source } = state;
    return {
      products,
      categories,
      settings,
      loading,
      error,
      source, // 'static' | 'loading' | 'sanity' | 'static-empty' | 'static-error'
      formatPrice: staticFormatPrice,
      getProduct: (slug) => products.find((p) => p.slug === slug),
      relatedProducts: (product, count = 4) =>
        products
          .filter((p) => p.id !== product.id)
          .sort((a, b) => (b.category === product.category) - (a.category === product.category))
          .slice(0, count),
    };
  }, [state]);

  return createElement(StoreContext.Provider, { value }, children);
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

// Adapts a flat static catalogue entry (src/data/products.js PRODUCTS) into
// the same extended shape normalizeProduct() produces for a Sanity product
// doc, so Product.jsx never has to branch on where the data came from.
// Static entries carry no images/colours/sizes/care-copy/reviews of their
// own — those all come back as empty, which is exactly what lets
// Product.jsx's own fallback chains (product -> siteSettings -> literal
// default) do the rest.
function adaptStaticProduct(p) {
  const { rating, reviews, ratingBreakdown } = computeRatingSummary([]);
  return {
    ...p,
    editionLabel: null,
    images: [],
    colours: [],
    sizes: [],
    unstitchedNote: null,
    careInstructions: null,
    shippingReturns: null,
    seo: null,
    rating,
    reviews,
    ratingBreakdown,
    reviewsList: [],
    relatedProducts: [],
  };
}

/**
 * Full single-product fetch for the PDP — separate from the card-level
 * `products` list above because the PDP needs fields the list query doesn't
 * fetch (images, colours, sizes, care/shipping copy, reviews...).
 *
 * Falls back to the static catalogue when:
 *   - no Sanity project is configured, or
 *   - the fetch throws, or
 *   - Sanity has no doc for this slug AND the rest of the site is currently
 *     running on the static fallback anyway (empty dataset / earlier fetch
 *     error) — otherwise a product card rendered from the static catalogue
 *     would 404 when clicked, which would be worse than showing the demo
 *     product.
 * A slug that's genuinely absent from a populated, reachable Sanity dataset
 * (source === 'sanity') is treated as a real 404 (`product: null`).
 */
export function useProductDetail(slug) {
  const { source } = useStore();
  // When unconfigured, resolve synchronously in the initializer — otherwise
  // the very first render (before any effect has run) would briefly see
  // `loading: false, product: undefined`, which Product.jsx reads as a 404.
  const [state, setState] = useState(() => {
    if (!client) {
      const p = staticGetProduct(slug);
      return { product: p ? adaptStaticProduct(p) : null, loading: false, error: null };
    }
    return { product: undefined, loading: true, error: null };
  });

  useEffect(() => {
    let cancelled = false;
    setState({ product: undefined, loading: Boolean(client), error: null });

    function fallbackToStatic(err) {
      if (cancelled) return;
      const p = staticGetProduct(slug);
      setState({ product: p ? adaptStaticProduct(p) : null, loading: false, error: err || null });
    }

    if (!client) {
      fallbackToStatic(null);
      return undefined;
    }

    (async () => {
      try {
        const raw = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
        if (cancelled) return;
        if (raw) {
          setState({ product: normalizeProduct(raw), loading: false, error: null });
          return;
        }
        if (source === 'sanity') {
          setState({ product: null, loading: false, error: null });
        } else {
          fallbackToStatic(null);
        }
      } catch (err) {
        if (cancelled) return;
        if (typeof console !== 'undefined') {
          console.warn('[sanity] Product detail fetch failed, falling back to static —', err?.message || err);
        }
        fallbackToStatic(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, source]);

  return state;
}
