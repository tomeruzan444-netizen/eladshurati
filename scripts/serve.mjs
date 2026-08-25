/** Minimal static server for previewing site/ — handles Hebrew paths and pretty URLs. */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { networkInterfaces } from 'node:os'

const ROOT = path.resolve(import.meta.dirname, '..', 'site')
// 4471, not a common default: another project's dev server once bound 4321
// alongside this one and requests were split between the two sites.
const PORT = Number(process.env.PORT || 4471)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
}

const handler = async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    let file = path.join(ROOT, p)
    let info = await stat(file).catch(() => null)
    if (info?.isDirectory()) {
      file = path.join(file, 'index.html')
      info = await stat(file).catch(() => null)
    }
    if (!info) {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
      res.end('<h1 style="font-family:sans-serif">404</h1><p>' + p + '</p>')
      return
    }
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' })
    res.end(body)
  } catch (err) {
    res.writeHead(500)
    res.end(String(err))
  }
}

const server = createServer(handler)

// Refuse to share the port. Without this Windows will happily let a second
// server bind the same port and serve half the requests from another project.
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`port ${PORT} is already taken — run with PORT=<other> npm run serve`)
    process.exit(1)
  }
  throw err
})

server.listen({ port: PORT, exclusive: true }, async () => {
  // Confirm this server is the one answering, and that it is serving THIS build.
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/`)
    const html = await res.text()
    if (!html.includes('ELAD SHURATI') && !html.includes('אלעד שורתי')) {
      console.error('WARNING: something else is answering on this port — the page served is not this site')
    }
  } catch {
    /* self-check is best effort */
  }
  console.log(`preview  →  http://localhost:${PORT}`)
  // Same-Wi-Fi address, for checking the build on a phone.
  for (const ifaces of Object.values(networkInterfaces())) {
    for (const i of ifaces || []) {
      if (i.family === 'IPv4' && !i.internal) console.log(`phone    →  http://${i.address}:${PORT}`)
    }
  }
})
