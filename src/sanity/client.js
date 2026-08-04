// Sanity client + image URL helper.
//
// Degrades gracefully: if VITE_SANITY_PROJECT_ID is unset (e.g. before
// `sanity init` has been run), `client` is exported as `null` instead of
// throwing at import time, so the rest of the app — and `npm run build` —
// keeps working. Consumers (see useStore.js) must check for a null client
// and fall back to the static catalogue in src/data/products.js.
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// `import.meta.env` itself (not just the VITE_ vars on it) can be undefined
// outside a Vite-transformed context — e.g. this module loaded directly
// under plain Node (a test runner, a script) rather than through Vite's
// dev server or build. Guard the access rather than assume it's always
// present, so importing this file never throws before the null-client
// fallback below even gets a chance to kick in.
const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {};

const projectId = metaEnv.VITE_SANITY_PROJECT_ID;
const dataset = metaEnv.VITE_SANITY_DATASET || 'production';

// Pinned to a dated API version rather than "vX" — keeps query behaviour
// stable as the Sanity API evolves. Bump deliberately, not accidentally.
export const apiVersion = '2025-01-01';

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const builder = client ? imageUrlBuilder(client) : null;

/**
 * Returns an @sanity/image-url image URL builder for a given image
 * reference, or null if the client isn't configured / no source was given.
 * Usage: urlFor(image)?.width(800).url()
 */
export function urlFor(source) {
  if (!builder || !source) return null;
  return builder.image(source);
}

export const isSanityConfigured = Boolean(client);
