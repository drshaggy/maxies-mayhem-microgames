#!/usr/bin/env node
// Zero-dependency static server for the microgame playground.
//   npm start        (or: node serve.mjs)
// Serves the repo root and opens the /dev/ playground. No install, works offline.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, normalize, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 5050;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',   // modules must be served as JS
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path.endsWith('/')) path += 'index.html';
    else if (!extname(path)) path += '/index.html';      // /dev -> /dev/index.html
    const file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/dev/`;
  console.log(`\n  Maxie's Mayhem — microgame playground\n  ▸ ${url}\n  (Ctrl-C to stop)\n`);
  const opener = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'start' : 'xdg-open';
  import('node:child_process').then(({ spawn }) => {
    try { spawn(opener, [url], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' }).unref(); }
    catch { /* no browser to open — the URL above still works */ }
  });
});
