// Cloudflare Turnstile server-side verification.
//
// Files prefixed with an underscore in api/ are treated as helpers, not as
// routable endpoints, so this module is shared by the handlers without being
// exposed as /api/_turnstile.
//
// The secret is read from the TURNSTILE_SECRET environment variable and must
// never be committed or shipped to the browser.

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// The client IP as seen by the platform's proxy. X-Forwarded-For is a list;
// the original client is the first entry.
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0]).split(',')[0].trim();
  }
  return (req.socket && req.socket.remoteAddress) || '';
}

// Resolves true only when Cloudflare confirms the token. Every other outcome
// — missing secret, missing token, network failure, non-2xx, malformed body,
// success:false — fails closed and resolves false.
async function verifyTurnstile(token, remoteip) {
  if (!process.env.TURNSTILE_SECRET) {
    console.error('Turnstile: TURNSTILE_SECRET is not set; rejecting request');
    return false;
  }

  if (!token || typeof token !== 'string') {
    return false;
  }

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET,
    response: token,
  });

  if (remoteip) {
    body.set('remoteip', remoteip);
  }

  let result;
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!response.ok) throw new Error(`siteverify ${response.status}`);
    result = await response.json();
  } catch (error) {
    console.error('Turnstile siteverify error:', error);
    return false;
  }

  if (result.success !== true) {
    console.warn('Turnstile rejected token:', result['error-codes']);
    return false;
  }

  return true;
}

// Gate for a request handler. Returns true when the caller may proceed;
// otherwise it has already written a 403 and the handler must return.
async function guardRequest(req, res) {
  const token = req.body && req.body['cf-turnstile-response'];

  if (await verifyTurnstile(token, getClientIp(req))) {
    return true;
  }

  res.status(403).json({ error: 'Verificarea anti-spam a eșuat. Reîncarcă pagina și încearcă din nou.' });
  return false;
}

module.exports = { verifyTurnstile, guardRequest, getClientIp };
