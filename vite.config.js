import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only middleware that serves POST /api/submit-review under `npm run
// dev`, mirroring how a Vercel-style deployment routes api/submit-review.js.
// Loads SANITY_WRITE_TOKEN from .env via loadEnv (Vite only exposes VITE_-
// prefixed vars to import.meta.env for client code, so server-side secrets
// like the write token have to be read explicitly here instead). Skips
// registering the route entirely when no token is configured, so a fresh
// checkout with no Sanity project still runs `npm run dev` cleanly.
function sanitySubmitReviewDevMiddleware(env) {
  return {
    name: 'sanity-submit-review-dev-middleware',
    configureServer(server) {
      if (!env.SANITY_WRITE_TOKEN) {
        server.config.logger.warn(
          '[sanity] SANITY_WRITE_TOKEN not set — /api/submit-review is disabled in dev. See SANITY_SETUP.md.'
        );
        return;
      }

      // Mirror how a real serverless platform injects server-side env vars,
      // so api/submit-review.js can read process.env the same way in dev
      // and in production.
      process.env.SANITY_WRITE_TOKEN = env.SANITY_WRITE_TOKEN;
      process.env.VITE_SANITY_PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || '';
      process.env.VITE_SANITY_DATASET = process.env.VITE_SANITY_DATASET || env.VITE_SANITY_DATASET || '';

      server.middlewares.use('/api/submit-review', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/submit-review.js');
          await mod.default(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal error', message: err?.message }));
        }
      });
    },
  };
}

// Dev-only middleware for POST /api/subscribe, which in production is the
// Netlify function at netlify/functions/subscribe.js. That handler is Netlify
// v2 style (Request -> Response) rather than Node's (req, res), so this adapts
// between the two — the same handler runs in dev and in production instead of
// two copies drifting apart.
// Server-side env the Netlify functions read off process.env. Listed once so
// dev and production stay in step; none are VITE_-prefixed, so none of them
// reach the browser bundle.
const FUNCTION_ENV_KEYS = [
  'BREVO_API_KEY',
  'BREVO_LIST_ID',
  'BREVO_DOI_TEMPLATE_ID',
  'BREVO_DOI_REDIRECT_URL',
  'VOUCHER_CODE',
  'VOUCHER_MIN_SPEND',
  'VOUCHER_AMOUNT',
  'VOUCHER_TOKEN_SECRET',
  'VOUCHER_VALID_DAYS',
  'RESEND_API_KEY',
  'CONTACT_INBOX',
  'CONTACT_FROM',
  'EMAIL_FROM',
  'BREVO_SENDER',
  'EMAIL_PROVIDER_ORDER',
  'CONTACT_SUBJECT_PREFIX',
  'SANITY_WRITE_TOKEN',
  'VITE_SANITY_PROJECT_ID',
  'VITE_SANITY_DATASET',
  'TAX_RATE',
];

function netlifyFunctionsDevMiddleware(env, names) {
  return {
    name: 'netlify-functions-dev-middleware',
    configureServer(server) {
      if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID) {
        server.config.logger.warn(
          '[brevo] BREVO_API_KEY/BREVO_LIST_ID not set — /api/subscribe and /api/voucher return 503 in dev. See .env.example.'
        );
      }

      // Mirror how Netlify injects server-side env vars so the functions read
      // process.env identically in dev and in production.
      for (const key of FUNCTION_ENV_KEYS) {
        if (env[key]) process.env[key] = env[key];
      }

      for (const name of names) {
        server.middlewares.use(`/api/${name}`, async (req, res) => {
          try {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = Buffer.concat(chunks);

            const mod = await server.ssrLoadModule(`/netlify/functions/${name}.js`);
            const response = await mod.default(
              new Request(`http://localhost/api/${name}`, {
                method: req.method,
                headers: req.headers,
                // GET/HEAD must not carry a body or Request throws.
                body: req.method === 'GET' || req.method === 'HEAD' || body.length === 0 ? undefined : body,
              })
            );

            res.statusCode = response.status;
            response.headers.forEach((value, key) => res.setHeader(key, value));
            res.end(Buffer.from(await response.arrayBuffer()));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal error', message: err?.message }));
          }
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  // Third arg '' loads ALL env vars (not just VITE_-prefixed) from
  // .env/.env.local, matching what the dev middleware needs.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      sanitySubmitReviewDevMiddleware(env),
      netlifyFunctionsDevMiddleware(env, ['subscribe', 'voucher', 'contact', 'discount', 'order']),
    ],
  };
});
