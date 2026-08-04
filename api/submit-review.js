// Vercel-style serverless handler for public review submissions.
// POST /api/submit-review  { productSlug, authorName, city?, rating, title?, text, website? }
//
// - Uses @sanity/client with a SERVER-SIDE token (SANITY_WRITE_TOKEN,
//   deliberately NOT the VITE_ prefix — never bundled into client JS).
// - Validates the product slug resolves to a real product, rating is an
//   integer 1-5, name/text are present and length-capped, plus a honeypot
//   field ("website") that real users never see/fill.
// - ALWAYS creates the review with approved: false and verified: false.
//   Nothing in the request body can override those two fields — a client
//   can never publish or self-verify its own review.
// - Rejects non-POST with 405.
//
// Also served under `npm run dev` via the Vite middleware plugin in
// vite.config.js, which loads SANITY_WRITE_TOKEN from .env and calls this
// same default export.
import { createClient } from '@sanity/client';

const API_VERSION = '2025-01-01';
const MAX_NAME_LEN = 80;
const MAX_CITY_LEN = 80;
const MAX_TITLE_LEN = 140;
const MAX_TEXT_LEN = 2000;

function getWriteClient() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return createClient({ projectId, dataset, apiVersion: API_VERSION, token, useCdn: false });
}

// Vercel/Next-style handlers usually get `req.body` pre-parsed. Under the
// Vite dev middleware, `req` is a raw Node http.IncomingMessage, so we read
// and parse the stream ourselves when `body` isn't already there.
async function readJsonBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  const client = getWriteClient();
  if (!client) {
    return sendJson(res, 503, {
      error:
        'Review submission is not configured on this server (missing SANITY_WRITE_TOKEN or project id). See SANITY_SETUP.md.',
    });
  }

  const body = await readJsonBody(req);
  const { productSlug, authorName, city, rating, title, text, website } = body || {};

  // Honeypot: real visitors never see or fill this field. Bots that fill
  // every input will trip it — respond as if it worked, but write nothing.
  if (website) {
    return sendJson(res, 200, { ok: true });
  }

  const errors = [];
  if (!productSlug || typeof productSlug !== 'string') {
    errors.push('productSlug is required.');
  }
  if (!authorName || typeof authorName !== 'string' || !authorName.trim()) {
    errors.push('authorName is required.');
  } else if (authorName.trim().length > MAX_NAME_LEN) {
    errors.push(`authorName must be ${MAX_NAME_LEN} characters or fewer.`);
  }
  if (!text || typeof text !== 'string' || !text.trim()) {
    errors.push('text is required.');
  } else if (text.trim().length > MAX_TEXT_LEN) {
    errors.push(`text must be ${MAX_TEXT_LEN} characters or fewer.`);
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    errors.push('rating must be an integer between 1 and 5.');
  }
  if (city != null && typeof city === 'string' && city.length > MAX_CITY_LEN) {
    errors.push(`city must be ${MAX_CITY_LEN} characters or fewer.`);
  }
  if (title != null && typeof title === 'string' && title.length > MAX_TITLE_LEN) {
    errors.push(`title must be ${MAX_TITLE_LEN} characters or fewer.`);
  }

  if (errors.length > 0) {
    return sendJson(res, 400, { error: 'Validation failed', details: errors });
  }

  try {
    const product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{ _id }`,
      { slug: productSlug }
    );
    if (!product?._id) {
      return sendJson(res, 404, { error: `No product found for slug "${productSlug}".` });
    }

    const doc = {
      _type: 'review',
      product: { _type: 'reference', _ref: product._id },
      authorName: authorName.trim().slice(0, MAX_NAME_LEN),
      ...(city ? { city: String(city).trim().slice(0, MAX_CITY_LEN) } : {}),
      rating: ratingNum,
      ...(title ? { title: String(title).trim().slice(0, MAX_TITLE_LEN) } : {}),
      text: text.trim().slice(0, MAX_TEXT_LEN),
      submittedAt: new Date().toISOString(),
      // Moderation gate — never trust the client for these two fields.
      approved: false,
      verified: false,
    };

    const created = await client.create(doc);
    return sendJson(res, 201, { ok: true, id: created._id });
  } catch (err) {
    return sendJson(res, 500, { error: 'Failed to submit review.', message: err?.message });
  }
}
