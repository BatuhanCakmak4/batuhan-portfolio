'use strict';
/**
 * Hardened zero-dependency static server for the portfolio.
 * No npm packages are used on purpose: nothing to patch, nothing to hijack.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const zlib = require('zlib');
const { promisify } = require('util');

const brotli = promisify(zlib.brotliCompress);
const gzip = promisify(zlib.gzip);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const TRUST_PROXY = parseInt(process.env.TRUST_PROXY || '0', 10); // number of proxies in front (0 = none)
const RATE_MAX = parseInt(process.env.RATE_LIMIT_MAX || '240', 10); // requests per IP per minute
const RATE_WINDOW_MS = 60 * 1000;
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const ROOT = path.resolve(__dirname, 'public');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2'
};
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.txt', '.xml', '.svg']);
const REVALIDATE = new Set(['.html', '.css', '.js', '.txt', '.xml', '.json']);
const cache = new Map();
const hits = new Map();

function clientIp(req) {
  const remote = req.socket.remoteAddress || '';
  if (TRUST_PROXY > 0) {
    const parts = String(req.headers['x-forwarded-for'] || '').split(',').map((s) => s.trim()).filter(Boolean);
    const candidate = parts[Math.max(0, parts.length - TRUST_PROXY)];
    if (candidate && net.isIP(candidate)) return candidate;
  }
  return remote;
}

function isSecure(req) {
  return Boolean(req.socket.encrypted) || (TRUST_PROXY > 0 && req.headers['x-forwarded-proto'] === 'https');
}

function rateLimited(ip) {
  const now = Date.now();
  let h = hits.get(ip);
  if (!h || h.reset <= now) { h = { count: 0, reset: now + RATE_WINDOW_MS }; hits.set(ip, h); }
  h.count += 1;
  return h.count > RATE_MAX ? Math.ceil((h.reset - now) / 1000) : 0;
}
setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (v.reset <= now) hits.delete(k); }, RATE_WINDOW_MS).unref();

function securityHeaders(req, res) {
  let csp = "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; " +
    "font-src https://fonts.gstatic.com; img-src 'self' data:; media-src 'self'; connect-src 'self'; " +
    "object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
  const secure = isSecure(req);
  if (secure) {
    csp += '; upgrade-insecure-requests';
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
}

function resolvePath(pathname) {
  let p;
  try { p = decodeURIComponent(pathname); } catch (e) { return null; }
  if (p.includes('\0') || p.includes('\\')) return null;
  if (p.endsWith('/')) p += 'index.html';
  const segs = p.split('/').filter(Boolean);
  if (segs.some((s) => s === '.' || s === '..')) return null;
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (s.startsWith('.') && !(i === 0 && s === '.well-known')) return null; // no dotfiles
  }
  const full = path.join(ROOT, ...segs);
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) return null;
  return full;
}

function plain(res, status, text, extra) {
  res.writeHead(status, Object.assign({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }, extra || {}));
  res.end(text + '\n');
}

async function serveFile(req, res, file, st, status) {
  const ext = path.extname(file).toLowerCase();
  const etag = 'W/"' + st.size.toString(16) + '-' + Math.floor(st.mtimeMs).toString(16) + '"';
  res.setHeader('Content-Type', TYPES[ext]);
  res.setHeader('Vary', 'Accept-Encoding');
  if (status === 200) {
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', st.mtime.toUTCString());
    res.setHeader('Cache-Control', REVALIDATE.has(ext) ? 'no-cache' : 'public, max-age=604800');
    const inm = req.headers['if-none-match'];
    const ims = Date.parse(req.headers['if-modified-since'] || '');
    if ((inm && inm.split(',').some((t) => t.trim() === etag)) || (!inm && ims && Math.floor(st.mtimeMs / 1000) * 1000 <= ims)) {
      res.writeHead(304); return res.end();
    }
  } else {
    res.setHeader('Cache-Control', 'no-cache');
  }
  let enc = null;
  if (COMPRESSIBLE.has(ext) && st.size > 256) {
    const ae = String(req.headers['accept-encoding'] || '');
    enc = /\bbr\b/.test(ae) ? 'br' : /\bgzip\b/.test(ae) ? 'gzip' : null;
  }
  if (enc) {
    const key = file + ':' + st.mtimeMs + ':' + enc;
    let buf = cache.get(key);
    if (!buf) {
      const raw = await fs.promises.readFile(file);
      buf = enc === 'br' ? await brotli(raw) : await gzip(raw);
      if (cache.size > 200) cache.clear();
      cache.set(key, buf);
    }
    res.setHeader('Content-Encoding', enc);
    res.setHeader('Content-Length', buf.length);
    res.writeHead(status);
    return req.method === 'HEAD' ? res.end() : res.end(buf);
  }
  res.setHeader('Content-Length', st.size);
  res.writeHead(status);
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
}

async function notFound(req, res) {
  const file = path.join(ROOT, '404.html');
  try { return await serveFile(req, res, file, await fs.promises.stat(file), 404); }
  catch (e) { return plain(res, 404, 'Not found'); }
}

const server = http.createServer(async (req, res) => {
  const started = Date.now();
  const ip = clientIp(req);
  res.on('finish', () => {
    console.log(JSON.stringify({ t: new Date().toISOString(), ip, method: req.method, path: String(req.url).slice(0, 200), status: res.statusCode, ms: Date.now() - started }));
  });
  securityHeaders(req, res);
  try {
    if (!req.url || req.url.length > 2048) return plain(res, 414, 'URI too long');
    if (ALLOWED_HOSTS.length) {
      const host = String(req.headers.host || '').toLowerCase().replace(/:\d+$/, '');
      if (!ALLOWED_HOSTS.includes(host)) return plain(res, 421, 'Misdirected request');
    }
    let url;
    try { url = new URL(req.url, 'http://localhost'); } catch (e) { return plain(res, 400, 'Bad request'); }

    if (url.pathname === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(req.method === 'HEAD' ? undefined : '{"status":"ok"}');
    }
    const wait = rateLimited(ip);
    if (wait) return plain(res, 429, 'Too many requests', { 'Retry-After': String(wait) });

    if (req.method === 'OPTIONS') { res.writeHead(204, { Allow: 'GET, HEAD, OPTIONS' }); return res.end(); }
    if (req.method !== 'GET' && req.method !== 'HEAD') return plain(res, 405, 'Method not allowed', { Allow: 'GET, HEAD, OPTIONS' });

    const file = resolvePath(url.pathname);
    if (!file || !TYPES[path.extname(file).toLowerCase()]) return notFound(req, res);
    let st;
    try { st = await fs.promises.stat(file); } catch (e) { return notFound(req, res); }
    if (!st.isFile()) return notFound(req, res);
    return await serveFile(req, res, file, st, 200);
  } catch (err) {
    console.error('request error:', err && err.message);
    if (!res.headersSent) return plain(res, 500, 'Internal server error');
    res.destroy();
  }
});

server.headersTimeout = 15000;
server.requestTimeout = 20000;
server.keepAliveTimeout = 5000;
server.maxHeadersCount = 50;
server.on('clientError', (err, socket) => { if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n'); });

server.listen(PORT, HOST, () => console.log('Portfolio listening on http://' + HOST + ':' + PORT));

function shutdown(signal) {
  console.log(signal + ' received, shutting down');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (e) => console.error('unhandledRejection:', e));
