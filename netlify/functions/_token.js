// Opaque round-trip token carrying a subscriber's email through Brevo's
// confirmation redirect, shared by subscribe.js (mints) and voucher.js (reads).
//
// WHY NOT JUST ?email=foo@bar.com — which is the obvious way to save the
// visitor retyping it. A raw address in a query string ends up in browser
// history, in access logs, in analytics, and leaks to any third-party asset on
// the page via the Referer header. The customer gets the same "nothing to
// type" experience either way, so there is no reason to pay that cost.
//
// AES-256-GCM, so the token is both unreadable and tamper-evident: a modified
// token fails the auth tag and throws rather than decrypting to some other
// address. That matters because whatever comes out of here is fed straight
// into a Brevo contact lookup.
//
// NOT an expiring capability. It stays valid as long as the key does, and it
// only ever yields an email that still has to pass the confirmed-and-on-list
// check in voucher.js. It is a privacy wrapper, not an entitlement.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const IV_LEN = 12; // GCM standard
const TAG_LEN = 16;

// Falls back to the Brevo key so the flow works with no extra configuration —
// it is already a required, server-only secret. Set VOUCHER_TOKEN_SECRET to
// decouple them (rotating the Brevo key would otherwise invalidate every
// outstanding confirmation link).
function keyFromEnv() {
  const secret = process.env.VOUCHER_TOKEN_SECRET || process.env.BREVO_API_KEY;
  if (!secret) return null;
  return createHash('sha256').update(secret).digest();
}

/** @returns {string|null} base64url token, or null if no secret is configured. */
export function encodeEmailToken(email) {
  const key = keyFromEnv();
  if (!key) return null;
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(email), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64url');
}

/** @returns {string|null} the email, or null if absent/tampered/undecryptable. */
export function decodeEmailToken(token) {
  const key = keyFromEnv();
  if (!key || !token) return null;
  try {
    const raw = Buffer.from(String(token), 'base64url');
    if (raw.length <= IV_LEN + TAG_LEN) return null;
    const decipher = createDecipheriv('aes-256-gcm', key, raw.subarray(0, IV_LEN));
    decipher.setAuthTag(raw.subarray(IV_LEN, IV_LEN + TAG_LEN));
    const out = Buffer.concat([decipher.update(raw.subarray(IV_LEN + TAG_LEN)), decipher.final()]);
    return out.toString('utf8');
  } catch {
    // Tampered, truncated, or minted under a different key.
    return null;
  }
}
