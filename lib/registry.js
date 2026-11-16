import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const DSH_HOME = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
export const STORE_DIR = path.join(DSH_HOME, 'storages', 'gd-product-kit')
export const REGISTRY_FILE = path.join(STORE_DIR, 'registry.json')

export const DEFAULT_ROOTS = ['E:\\AI', 'E:\\WORK']
export const DEFAULT_PROJECTS = ['E:\\AI\\铺板快算']
const EXCLUDE = new Set(['node_modules', '.git', '.venv', '.obsidian', '.agents', '.claude', '.codex-build'])

function exists(p) {
  try { fs.accessSync(p); return true } catch { return false }
}

function isDir(p) {
  try { return fs.statSync(p).isDirectory() } catch { return false }
}

function atomicWrite(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`
  fs.writeFileSync(tmp, text, 'utf8')
  fs.renameSync(tmp, file)
}

export function projectName(dir) {
  return path.basename(dir)
}

export function readRegistry() {
  try {
    const raw = fs.readFileSync(REGISTRY_FILE, 'utf8')
    const data = JSON.parse(raw)
    return normalizeRegistry(data)
  } catch {
    return normalizeRegistry({})
  }
}

export function writeRegistry(reg) {
  atomicWrite(REGISTRY_FILE, JSON.stringify(normalizeRegistry(reg), null, 2) + '\n')
}

export function normalizeRegistry(input) {
  const roots = Array.isArray(input?.roots) && input.roots.length
    ? input.roots.filter((r) => typeof r === 'string' && path.isAbsolute(r))
    : [...DEFAULT_ROOTS]
  const seen = new Set()
  const projects = []
  for (const item of Array.isArray(input?.projects) ? input.projects : []) {
    const p = typeof item === 'string' ? item : item?.path
    if (typeof p !== 'string' || !path.isAbsolute(p)) continue
    const canonical = path.resolve(p)
    if (seen.has(canonical.toLowerCase())) continue
    seen.add(canonical.toLowerCase())
    projects.push({ path: canonical, addedAt: typeof item?.addedAt === 'string' ? item.addedAt : new Date().toISOString() })
  }
  return { version: 1, roots, projects }
}

export function ensureRegistry() {
  let reg = readRegistry()
  const hadFile = exists(REGISTRY_FILE)
  if (!hadFile) {
    for (const p of DEFAULT_PROJECTS) {
      if (isDir(p)) reg.projects.push({ path: path.resolve(p), addedAt: new Date().toISOString() })
    }
    reg = normalizeRegistry(reg)
    writeRegistry(reg)
  }
  return reg
}

export function registerPath(reg, dir) {
  const target = path.resolve(dir)
  if (!isDir(target)) throw new Error(`目录不存在：${target}`)
  if (!reg.projects.some((p) => p.path.toLowerCase() === target.toLowerCase())) {
    reg.projects.push({ path: target, addedAt: new Date().toISOString() })
  }
  return normalizeRegistry(reg)
}

export function markersOf(dir) {
  const marks = []
  for (const name of ['.gd/project.json', '.git', 'package.json', 'AGENTS.md', 'CLAUDE.md']) {
    if (exists(path.join(dir, ...name.split('/')))) marks.push(name)
  }
  return marks
}

export function scanCandidates(reg) {
  const known = new Set(reg.projects.map((p) => p.path.toLowerCase()))
  const out = []
  for (const root of reg.roots) {
    if (!isDir(root)) continue
    let entries = []
    try { entries = fs.readdirSync(root, { withFileTypes: true }) } catch { continue }
    for (const ent of entries) {
      if (!ent.isDirectory()) continue
      if (ent.name.startsWith('.') || EXCLUDE.has(ent.name)) continue
      const dir = path.join(root, ent.name)
      if (dir.toLowerCase() === PLUGIN_ROOT.toLowerCase()) continue
      const marks = markersOf(dir)
      if (!marks.length) continue
      out.push({
        name: projectName(dir),
        path: dir,
        markers: marks,
        registered: known.has(dir.toLowerCase()),
        hasProjectJson: marks.includes('.gd/project.json'),
      })
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path, 'zh-CN'))
}

export function stateForRegistry(reg) {
  return {
    roots: reg.roots,
    projects: reg.projects.filter((p) => isDir(p.path)).map((p) => ({ path: p.path, name: projectName(p.path) })),
  }
}
