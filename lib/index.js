import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ensureRegistry,
  readRegistry,
  writeRegistry,
  registerPath,
  scanCandidates,
} from './registry.js'
import {
  createProject,
  readArtifact,
  readDoc,
  readProjectFile,
  readProjectState,
  updateProject,
} from './project.js'

export const name = 'gd-product-kit'
export const inject = ['webServer']

const PREFIX = '/gd-product-kit'
const HERE = path.dirname(fileURLToPath(import.meta.url))

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function isLoopback(req) {
  const remote = req.socket?.remoteAddress ?? ''
  return remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
}

function sendJson(res, status, body) {
  const text = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(text),
  })
  res.end(text)
}

async function readBody(req, limit = 1024 * 1024) {
  const chunks = []
  let total = 0
  for await (const chunk of req) {
    total += chunk.length
    if (total > limit) throw new HttpError(413, 'body too large')
    chunks.push(chunk)
  }
  if (!total) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new HttpError(400, 'invalid JSON body')
  }
}

export function apply(ctx) {
  ensureRegistry()

  const route = async (req, res) => {
    if (!isLoopback(req)) {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('forbidden: loopback only')
      return
    }
    const url = new URL(req.url ?? '/', 'http://localhost')
    try {
      if (url.pathname === `${PREFIX}/api/health` && req.method === 'GET') {
        sendJson(res, 200, { ok: true, name, version: '0.2.1' })
        return
      }
      if (url.pathname === `${PREFIX}/static/style.css` && req.method === 'GET') {
        const css = fs.readFileSync(path.join(HERE, 'style.css'), 'utf8')
        res.writeHead(200, {
          'content-type': 'text/css; charset=utf-8',
          'cache-control': 'no-store',
          'content-length': Buffer.byteLength(css),
        })
        res.end(css)
        return
      }
      if (url.pathname === `${PREFIX}/api/state` && req.method === 'GET') {
        const reg = readRegistry()
        const projects = []
        for (const entry of reg.projects) {
          try {
            projects.push(await readProjectState(entry.path, { probe: false }))
          } catch {
            /* 目录没了就跳过；重新扫描时再处理 */
          }
        }
        sendJson(res, 200, { ok: true, roots: reg.roots, projects, generatedAt: new Date().toISOString() })
        return
      }
      if (url.pathname === `${PREFIX}/api/project` && req.method === 'GET') {
        const projectPath = url.searchParams.get('path')
        if (!projectPath) throw new HttpError(400, 'path is required')
        const probe = url.searchParams.get('probe') === '1'
        sendJson(res, 200, { ok: true, project: await readProjectState(projectPath, { probe }) })
        return
      }
      if (url.pathname === `${PREFIX}/api/scan` && req.method === 'GET') {
        const reg = readRegistry()
        sendJson(res, 200, { ok: true, roots: reg.roots, candidates: scanCandidates(reg) })
        return
      }
      if (url.pathname === `${PREFIX}/api/import` && req.method === 'POST') {
        const body = await readBody(req)
        const paths = Array.isArray(body.paths) ? body.paths : body.path ? [body.path] : []
        if (!paths.length) throw new HttpError(400, 'paths is required')
        let reg = readRegistry()
        for (const p of paths) reg = registerPath(reg, p)
        writeRegistry(reg)
        sendJson(res, 200, { ok: true, registered: reg.projects.length })
        return
      }
      if (url.pathname === `${PREFIX}/api/create` && req.method === 'POST') {
        const body = await readBody(req)
        const result = await createProject(body)
        let reg = readRegistry()
        reg = registerPath(reg, result.state.path)
        writeRegistry(reg)
        sendJson(res, 200, { ok: true, ...result })
        return
      }
      if (url.pathname === `${PREFIX}/api/update` && req.method === 'POST') {
        const body = await readBody(req)
        const projectPath = body.path
        if (!projectPath) throw new HttpError(400, 'path is required')
        const state = await updateProject(projectPath, body.action, body.payload || {})
        sendJson(res, 200, { ok: true, project: state })
        return
      }
      if (url.pathname === `${PREFIX}/api/artifact` && req.method === 'GET') {
        const projectPath = url.searchParams.get('path')
        const key = url.searchParams.get('key')
        const format = url.searchParams.get('format') === 'html' ? 'html' : 'md'
        if (!projectPath || !key) throw new HttpError(400, 'path and key are required')
        sendJson(res, 200, { ok: true, ...readArtifact(projectPath, key, format) })
        return
      }
      if (url.pathname === `${PREFIX}/api/doc` && req.method === 'GET') {
        const projectPath = url.searchParams.get('path')
        const rel = url.searchParams.get('rel')
        if (!projectPath || !rel) throw new HttpError(400, 'path and rel are required')
        sendJson(res, 200, { ok: true, ...readDoc(projectPath, rel) })
        return
      }
      if (url.pathname === `${PREFIX}/files` && req.method === 'GET') {
        const projectPath = url.searchParams.get('path')
        const rel = url.searchParams.get('rel')
        if (!projectPath || !rel) throw new HttpError(400, 'path and rel are required')
        const file = readProjectFile(projectPath, rel)
        res.writeHead(200, {
          'content-type': file.mime,
          'content-length': file.content.length,
          'cache-control': 'no-store',
        })
        res.end(file.content)
        return
      }
      sendJson(res, 404, { ok: false, error: 'not found' })
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500
      sendJson(res, status, { ok: false, error: error instanceof Error ? error.message : String(error) })
    }
  }

  const dispose = ctx.webServer.register({ kind: 'prefix', path: PREFIX, handler: route })
  ctx.effect(() => dispose, 'gd-product-kit: routes')
}
