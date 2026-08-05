// Outbound email with a provider fallback chain.
//
// WHY THIS EXISTS. Resend refuses to deliver to anyone but the account owner
// until a domain is verified there:
//     403 "You can only send testing emails to your own email address"
// That is fine for shop-facing mail (contact forms, order alerts — those go to
// us) but it silently killed the CUSTOMER order confirmation, which is the one
// email a COD buyer actually needs: their record of what they ordered and what
// to have ready in cash.
//
// Brevo, meanwhile, already delivers to arbitrary addresses today — the
// double-opt-in mail reaches real inboxes. So: try Resend, fall back to Brevo.
// Once lyallpurwear.com is verified in Resend the first attempt starts
// succeeding and the fallback stops firing, with no code change.
//
// Order is configurable via EMAIL_PROVIDER_ORDER (default "resend,brevo") if
// you would rather send everything through one of them.
const RESEND_URL = 'https://api.resend.com/emails';
const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

const FALLBACK_FROM = 'Lyallpur Wear <onboarding@resend.dev>';

/** Splits `Name <a@b.com>` into parts. Bare addresses are fine too. */
function parseFrom(value) {
  const raw = String(value || '').trim();
  const match = raw.match(/^\s*(.*?)\s*<\s*([^>]+)\s*>\s*$/);
  if (match) return { name: match[1] || 'Lyallpur Wear', email: match[2] };
  return { name: 'Lyallpur Wear', email: raw };
}

function fromValue() {
  // EMAIL_FROM is the modern name; CONTACT_FROM is kept working because it was
  // here first and is already set on some deploys.
  return process.env.EMAIL_FROM || process.env.CONTACT_FROM || FALLBACK_FROM;
}

async function sendViaResend({ to, subject, html, text, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, skipped: true, error: 'no RESEND_API_KEY' };
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromValue(),
        to,
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        html,
        text,
      }),
    });
    if (res.ok) return { ok: true };
    let detail = '';
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      /* empty body */
    }
    return { ok: false, error: `${res.status} ${detail}` };
  } catch (err) {
    return { ok: false, error: String(err?.message || err) };
  }
}

async function sendViaBrevo({ to, subject, html, text, replyTo }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { ok: false, skipped: true, error: 'no BREVO_API_KEY' };
  // Brevo needs a sender registered in the account. It will still deliver when
  // the domain is unauthenticated — it just rewrites the visible domain to
  // brevosend.com, which is why authenticating the domain still matters.
  const sender = parseFrom(process.env.BREVO_SENDER || fromValue());
  try {
    const res = await fetch(BREVO_URL, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sender,
        to: (Array.isArray(to) ? to : [to]).map((email) => ({ email })),
        ...(replyTo ? { replyTo: { email: replyTo } } : {}),
        subject,
        htmlContent: html,
        ...(text ? { textContent: text } : {}),
      }),
    });
    if (res.ok) return { ok: true };
    let detail = '';
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      /* empty body */
    }
    return { ok: false, error: `${res.status} ${detail}` };
  } catch (err) {
    return { ok: false, error: String(err?.message || err) };
  }
}

const PROVIDERS = { resend: sendViaResend, brevo: sendViaBrevo };

/**
 * Sends through the first provider that accepts it.
 *
 * @param {{to: string|string[], subject: string, html: string, text?: string,
 *          replyTo?: string, label?: string}} message
 * @returns {Promise<{ok: boolean, provider?: string, errors?: object}>}
 */
export async function sendEmail(message) {
  const order = (process.env.EMAIL_PROVIDER_ORDER || 'resend,brevo')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((name) => PROVIDERS[name]);

  const errors = {};
  for (const name of order) {
    const result = await PROVIDERS[name](message);
    if (result.ok) {
      // Worth logging: it tells you at a glance whether Resend is still
      // falling back, i.e. whether the domain verification is done.
      if (Object.keys(errors).length) {
        console.warn(`[email] ${message.label || 'message'} sent via ${name} after ${Object.keys(errors).join(', ')} failed`);
      }
      return { ok: true, provider: name };
    }
    errors[name] = result.error;
  }

  console.error(`[email] ${message.label || 'message'} not sent:`, errors);
  return { ok: false, errors };
}
