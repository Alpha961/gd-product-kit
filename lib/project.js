import fs from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { PLUGIN_ROOT } from './registry.js'

const run = promisify(execFile)
const TEMPLATES = path.join(PLUGIN_ROOT, 'templates')

export const ARTIFACT_DEFS = {
  demand: {
    title: '调研分析',
    file: '调研分析',
    md: ['docs/调研分析.md', '调研分析.md', 'docs/需求调研.md', '需求调研.md', 'docs/需求池.md', '需求池.md'],
    html: ['docs/调研分析.html', '调研分析.html', 'docs/需求调研.html'],
  },
  prd: {
    title: 'PRD',
    file: 'PRD',
    md: ['docs/PRD.md', 'PRD.md', 'docs/产品PRD.md'],
    html: ['docs/PRD.html', 'PRD.html'],
  },
  wireframe: {
    title: '线框图',
    file: '线框图',
    md: ['docs/线框图.md', 'docs/页面结构图.md'],
    html: ['docs/线框图.html', 'docs/产品线框图.html', 'docs/页面结构图.html'],
  },
  design: {
    title: '设计规范',
    file: '设计规范',
    md: ['docs/设计规范.md', 'docs/UI设计规范.md'],
    html: ['docs/设计规范.html', 'docs/UI设计规范.html'],
  },
  agents: {
    title: '工作区整理',
    file: 'AGENTS',
    md: ['AGENTS.md', 'docs/AGENTS.md', 'CLAUDE.md'],
    html: ['AGENTS.html', 'docs/AGENTS.html'],
  },
}

export function isDir(p) {
  try { return fs.statSync(p).isDirectory() } catch { return false }
}

export function isFile(p) {
  try { return fs.statSync(p).isFile() } catch { return false }
}

export function readJson(file, fallback = null) {
  try {
    const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
    return JSON.parse(text)
  } catch {
    return fallback
  }
}

function atomicWrite(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`
  fs.writeFileSync(tmp, text, 'utf8')
  fs.renameSync(tmp, file)
}

export function writeJson(file, data) {
  atomicWrite(file, JSON.stringify(data, null, 2) + '\n')
}

export function relInside(root, file) {
  const rel = path.relative(root, file)
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null
  return rel.split(path.sep).join('/')
}

export function projectJsonPath(projectPath) {
  return path.join(projectPath, '.gd', 'project.json')
}

export function readProjectJson(projectPath) {
  return readJson(projectJsonPath(projectPath), null)
}

export function writeProjectJson(projectPath, data) {
  writeJson(projectJsonPath(projectPath), data)
}

export function findExisting(projectPath, rels) {
  for (const rel of rels || []) {
    const abs = path.join(projectPath, ...rel.split('/'))
    if (isFile(abs)) {
      const stat = fs.statSync(abs)
      return { rel, abs, mtime: stat.mtimeMs }
    }
  }
  return null
}

function dateShort(ms) {
  if (!ms) return ''
  const d = new Date(ms)
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function discoverArtifacts(projectPath, projectJson) {
  const configured = projectJson?.artifacts || {}
  const out = {}
  for (const [key, def] of Object.entries(ARTIFACT_DEFS)) {
    const c = configured[key] || {}
    const md = (c.md ? findExisting(projectPath, [c.md]) : null) || findExisting(projectPath, def.md)
    const html = (c.html ? findExisting(projectPath, [c.html]) : null) || findExisting(projectPath, def.html)
    const latest = Math.max(md?.mtime || 0, html?.mtime || 0)
    out[key] = {
      md: Boolean(md),
      html: Boolean(html),
      mdPath: md?.rel || null,
      htmlPath: html?.rel || null,
      d: dateShort(latest),
    }
  }
  return out
}

export function toneOf(state) {
  const s = String(state || '')
  if (s.includes('暂停') || s.includes('归档')) return 'gray'
  if (s.includes('上线') || s.includes('发布')) return 'green'
  if (s.includes('提审') || s.includes('审核') || s.includes('内测')) return 'amber'
  if (s.includes('开发')) return 'blue'
  return 'gray'
}

export function defaultTrack(kind) {
  const k = String(kind || '')
  if (k.includes('小程序')) return ['代码', '体验版', '提审', '审核', '发布']
  if (k.includes('网站')) return ['代码', '预览', '上线']
  if (k.includes('App') || k.includes('应用')) return ['代码', '内测', '提审', '上架']
  if (k.includes('插件')) return ['代码', '自测', 'npm', '市场']
  return ['代码', '预览', '发布']
}

export function normalizeTrack(track, kind) {
  const names = defaultTrack(kind)
  const list = []
  if (Array.isArray(track) && track.length) {
    for (const step of track) {
      const name = step?.name ?? step?.n ?? ''
      const status = step?.status ?? step?.s ?? 'todo'
      if (!name) continue
      list.push({ n: String(name), s: ['done', 'active', 'todo'].includes(status) ? status : 'todo', d: step?.d || '' })
    }
  }
  if (!list.length) {
    for (const name of names) list.push({ n: name, s: 'todo', d: '' })
  }
  return list
}

export function relativeTime(iso) {
  if (!iso) return '未生成'
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return '未生成'
  const diff = Date.now() - t
  if (diff < 60 * 1000) return '刚刚'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / 86400000)} 天前`
  const d = new Date(t)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function gitCommits(projectPath) {
  if (!isDir(path.join(projectPath, '.git'))) return []
  try {
    const { stdout } = await run('git', ['-C', projectPath, 'log', '-3', '--date=short', '--pretty=format:%h|%ad|%s'], {
      timeout: 5000,
      windowsHide: true,
      maxBuffer: 1024 * 1024,
    })
    return String(stdout || '')
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [h, t, ...rest] = line.split('|')
        return { h: h || '', t: t || '', m: rest.join('|') || '' }
      })
  } catch {
    return []
  }
}

export async function probeUrl(url) {
  if (!url) return 'none'
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal })
    return res.status < 500 ? 'ok' : 'fail'
  } catch {
    return 'fail'
  } finally {
    clearTimeout(timer)
  }
}

function normalizeTodos(list) {
  if (!Array.isArray(list)) return []
  return list
    .filter((t) => t && typeof t.title === 'string')
    .map((t, i) => ({
      id: typeof t.id === 'string' ? t.id : `t${i + 1}`,
      title: t.title,
      state: ['todo', 'doing', 'blocked', 'done'].includes(t.state) ? t.state : 'todo',
      doc: typeof t.doc === 'string' ? t.doc.replace(/\\/g, '/') : null,
      docName: typeof t.docName === 'string' ? t.docName : (t.doc ? path.basename(t.doc) : ''),
    }))
}

function normalizeIdeas(list) {
  if (!Array.isArray(list)) return []
  return list
    .filter((it) => it && typeof it.title === 'string')
    .map((it, i) => ({
      id: typeof it.id === 'string' ? it.id : `I${i + 1}`,
      title: it.title,
      desc: typeof it.desc === 'string' ? it.desc : '',
      p: ['高', '中', '低'].includes(it.p) ? it.p : '中',
      doc: typeof it.doc === 'string' ? it.doc.replace(/\\/g, '/') : null,
    }))
}

function normalizeHistory(list) {
  if (!Array.isArray(list)) return []
  return list
    .filter((h) => h && typeof h.v === 'string')
    .map((h) => ({
      v: h.v,
      s: typeof h.s === 'string' ? h.s : '已发布',
      tone: typeof h.tone === 'string' ? h.tone : 'gray',
      t: typeof h.t === 'string' ? h.t : '',
    }))
}

export async function readProjectState(projectPath, options = {}) {
  const root = path.resolve(projectPath)
  const pj = readProjectJson(root) || {}
  const version = pj.version && typeof pj.version === 'object' ? pj.version : {}
  const state = typeof version.state === 'string' && version.state ? version.state : '构思'
  const track = normalizeTrack(version.track, pj.kind)
  const artifacts = discoverArtifacts(root, pj)
  const todos = normalizeTodos(pj.todos)
  const ideas = normalizeIdeas(pj.ideas)
  const release = pj.release && typeof pj.release === 'object' ? pj.release : {}
  const url = typeof release.url === 'string' ? release.url : ''
  const probe = options.probe && url ? await probeUrl(url) : (url ? 'skip' : 'none')
  const updatedAt = typeof pj.updatedAt === 'string' ? pj.updatedAt : ''
  const updatedBy = pj.updatedBy === 'ai' ? 'AI' : pj.updatedBy === 'human' ? '手动' : pj.updatedBy === 'mapping' ? '映射' : (pj.updatedBy || '未生成')
  const mdCount = Object.values(artifacts).filter((a) => a.md).length
  const htmlCount = Object.values(artifacts).filter((a) => a.html).length
  const blocked = todos.filter((t) => t.state === 'blocked').length
  const ageMs = updatedAt ? Date.now() - Date.parse(updatedAt) : Infinity
  const health = {
    md: mdCount,
    html: htmlCount,
    blocked,
    hasUrl: Boolean(url),
    linkOk: probe === 'ok' ? true : probe === 'fail' ? false : null,
  }
  return {
    id: root,
    name: typeof pj.name === 'string' && pj.name ? pj.name : path.basename(root),
    kind: typeof pj.kind === 'string' && pj.kind ? pj.kind : '其他',
    path: root,
    archived: Boolean(pj.archived),
    version: {
      label: typeof version.label === 'string' && version.label ? version.label : 'v0.1',
      state,
      tone: toneOf(state),
      goal: typeof version.goal === 'string' ? version.goal : '',
      next: typeof version.next === 'string' ? version.next : '',
      track,
    },
    release: { url, probe, note: typeof release.note === 'string' ? release.note : '', kind: typeof release.kind === 'string' ? release.kind : '' },
    artifacts,
    todos,
    ideas,
    ideaTotal: ideas.length,
    commits: await gitCommits(root),
    history: normalizeHistory(pj.history),
    updated: relativeTime(updatedAt),
    updater: updatedBy,
    stale: Number.isFinite(ageMs) ? ageMs > 7 * 24 * 60 * 60 * 1000 : true,
    paused: state.includes('暂停'),
    health,
    generatedAt: new Date().toISOString(),
  }
}

function safeText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function fillSurvey(body) {
  const name = safeText(body.name, '未命名项目')
  const user = safeText(body.user, '[TODO: 待补]')
  const background = safeText(body.background, '[TODO: 待补]')
  const problem = safeText(body.problem, '[TODO: 待补]')
  const workaround = safeText(body.workaround, '[TODO: 待补]')
  const goal = safeText(body.goal, '[TODO: 待补]')
  const coreTask = safeText(body.coreTask, '[TODO: 待补]')
  const notDoing = safeText(body.notDoing, '[TODO: 待补]')
  return `# 调研分析 · ${name}

> 来源：项目创建时填写
> 还需要确认：[待验证的猜测]
> 填写提示：拿不准的写「TODO: 待确认」，不要替对方编答案。

> 这份文档合二为一：**上半部分讲人（1–5），下半部分讲需求（6）。**两半不重复。

## 1 这个人是谁

- 称呼与身份：${user}
- 和这件事有关的生活节奏：${background}
- 为什么在意这件事：[TODO: 待补]

## 2 场景与限制

- 在什么环境里做：[TODO: 待补]
- 涉及哪些对象，各有什么特点：[TODO: 待补]
- 限制（时间/精力/经验/预算）：[TODO: 待补]

## 3 困难、现有办法与目标

### 困难 1 · [一句话概括]

- 具体经历：${problem}
- 现在的办法：${workaround}
- 现有办法的问题：[TODO: 待补]
- 想要的结果：${goal}

## 4 事实与猜测

- 已知事实：项目创建时填写
- 待验证假设：[TODO: 待补]

## 5 这一版的范围

- 要帮的是：[TODO: 待补]
- 核心任务：${coreTask}
- 不保证的是：${notDoing}
- 下一版可能加的：[先记下来，不进这一版]

## 6 需求池

### 6.1 产品与第一版范围

#### 项目名称
${name}

#### 为谁服务
${user}

#### 依据的用户资料
本文档 §1–§5

#### 第一版的核心任务
${coreTask}

#### 完整使用过程
1. [TODO: 待补 —— 由 AI 补全]

#### 第一版范围与限制
- 包含：[TODO: 待补]
- 不包含：${notDoing}
- 限制：[TODO: 待补]

### 6.2 优先级说明

- **P0**：第一版必需，缺了核心任务就完不成。
- **P1**：后续改善，第一版能跑但不顺手。
- **P2**：留待考虑，先记着，不排期。

### 6.3 全部需求

#### R01 · [TODO: 待补]

- **优先级**：P0
- **对应什么困难**：
- **用户希望达到什么结果**：
- **准备怎么解决**：
- **怎样检查完成**：
- **为什么这样排序**：
- **还需要确认什么**：

### 6.4 试用与验证计划

- [TODO: 待补]

### 6.5 尚未确认的假设

| # | 假设 | 依据强度 | 怎么验证 | 状态 |
|---|---|---|---|---|
| H1 | [TODO: 待补] | 弱 / 中 / 强 | [方法] | 未验证 |
`
}

function copyTemplate(name, dest, replacements = {}) {
  const src = path.join(TEMPLATES, name)
  if (!isFile(src)) return { copied: false, reason: `模板缺失：${name}` }
  if (isFile(dest)) return { copied: false, reason: '已存在，跳过' }
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  let text = fs.readFileSync(src, 'utf8')
  for (const [from, to] of Object.entries(replacements)) text = text.split(from).join(to)
  atomicWrite(dest, text)
  return { copied: true }
}

export async function createProject(body) {
  const name = safeText(body.name)
  const dir = safeText(body.dir)
  const user = safeText(body.user)
  const problem = safeText(body.problem)
  const coreTask = safeText(body.coreTask)
  if (!name) throw new Error('项目名不能为空')
  if (!dir || !path.isAbsolute(dir)) throw new Error('项目目录必须是绝对路径')
  if (!user) throw new Error('请先写「给谁用」')
  if (!problem) throw new Error('请先写「最麻烦的一件事」')
  if (!coreTask) throw new Error('请先写「第一版核心任务」')
  const root = path.resolve(dir)
  if (isFile(path.join(root, '.gd', 'project.json'))) throw new Error('这个目录已经是 gd-product-kit 项目')
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true })
  fs.mkdirSync(path.join(root, '.gd'), { recursive: true })

  const now = new Date().toISOString()
  const kind = safeText(body.kind, '其他')
  const track = defaultTrack(kind).map((n) => ({ name: n, status: 'todo' }))
  const artifacts = {
    demand: { md: 'docs/调研分析.md', html: null },
    prd: { md: 'docs/PRD.md', html: null },
    wireframe: { md: null, html: 'docs/线框图.html' },
    design: { md: 'docs/设计规范.md', html: null },
    agents: { md: 'AGENTS.md', html: null },
  }
  const projectJson = {
    schemaVersion: 1,
    name,
    kind,
    version: { label: 'v0.1', state: '构思', goal: coreTask, next: '补全调研分析 §6 需求池', track },
    release: { url: '' },
    artifacts,
    todos: [],
    ideas: [],
    history: [],
    updatedAt: now,
    updatedBy: 'ai',
  }

  atomicWrite(path.join(root, 'docs', '调研分析.md'), fillSurvey(body))
  atomicWrite(path.join(root, '.gd', 'project.json'), JSON.stringify(projectJson, null, 2) + '\n')

  const copies = []
  const jobs = [
    ['prd.md', path.join(root, 'docs', 'PRD.md')],
    ['wireframe.html', path.join(root, 'docs', '线框图.html')],
    ['design.md', path.join(root, 'docs', '设计规范.md')],
    ['AGENTS.md', path.join(root, 'AGENTS.md'), { '[项目名]': name }],
    ['发布清单.md', path.join(root, 'docs', '发布清单.md'), { '[项目名]': name }],
    ['PLAN.md', path.join(root, 'PLAN.md'), { '[产品名]': name }],
    ['README.md', path.join(root, 'README.md'), { '[产品名]': name }],
    ['验收记录.md', path.join(root, 'docs', '验收记录.md'), { '[项目名]': name }],
  ]
  for (const [tpl, dest, rep] of jobs) {
    const r = copyTemplate(tpl, dest, rep || {})
    copies.push({ file: relInside(root, dest), ...r })
  }
  return {
    state: await readProjectState(root, { probe: true }),
    copies,
  }
}

export async function updateProject(projectPath, action, payload = {}) {
  const root = path.resolve(projectPath)
  if (!isDir(root)) throw new Error('项目目录不存在')
  const pj = readProjectJson(root) || {
    schemaVersion: 1,
    name: path.basename(root),
    kind: '其他',
    version: { label: 'v0.1', state: '构思', goal: '', next: '', track: [] },
    release: { url: '' },
    artifacts: {},
    todos: [],
    ideas: [],
    history: [],
  }
  const now = new Date().toISOString()
  if (!pj.version || typeof pj.version !== 'object') pj.version = { label: 'v0.1', state: '构思', track: [] }
  if (!Array.isArray(pj.todos)) pj.todos = []
  if (!Array.isArray(pj.ideas)) pj.ideas = []

  switch (action) {
    case 'addTodo': {
      const title = safeText(payload.title)
      if (!title) throw new Error('待办标题不能为空')
      pj.todos.push({ id: `t${Date.now()}`, title, state: 'todo', doc: safeText(payload.doc) || null })
      break
    }
    case 'promoteIdea': {
      const title = safeText(payload.title)
      if (!title) throw new Error('点子标题不能为空')
      pj.todos.push({ id: `t${Date.now()}`, title, state: 'todo', doc: safeText(payload.doc) || null })
      break
    }
    case 'archive':
      pj.archived = true
      break
    case 'restore':
      delete pj.archived
      if (String(pj.version.state || '').includes('暂停')) pj.version.state = '开发中'
      break
    case 'setNext':
      pj.version.next = safeText(payload.next)
      break
    default:
      throw new Error(`未知动作：${action}`)
  }
  pj.updatedAt = now
  pj.updatedBy = 'human'
  writeProjectJson(root, pj)
  return readProjectState(root, { probe: true })
}

export function readArtifact(projectPath, key, format) {
  const root = path.resolve(projectPath)
  const pj = readProjectJson(root) || {}
  const artifacts = discoverArtifacts(root, pj)
  const a = artifacts[key]
  if (!a) throw new Error('未知产物')
  const rel = format === 'html' ? a.htmlPath : a.mdPath
  if (!rel) throw new Error('文件不存在')
  const abs = path.join(root, ...rel.split('/'))
  if (!relInside(root, abs)) throw new Error('非法路径')
  const stat = fs.statSync(abs)
  if (stat.size > 2 * 1024 * 1024) throw new Error('文件太大，暂不在工作台预览')
  return { rel, format, content: fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '') }
}

export function readDoc(projectPath, rel) {
  const root = path.resolve(projectPath)
  const clean = String(rel || '').replace(/\\/g, '/').replace(/^\/+/, '')
  if (!clean || clean.includes('..')) throw new Error('非法路径')
  const abs = path.join(root, ...clean.split('/'))
  if (!relInside(root, abs)) throw new Error('非法路径')
  if (!isFile(abs)) throw new Error('文件不存在')
  const stat = fs.statSync(abs)
  if (stat.size > 2 * 1024 * 1024) throw new Error('文件太大，暂不在工作台预览')
  return { rel: clean, content: fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '') }
}

const FILE_MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.css': 'text/css; charset=utf-8',
}

export function readProjectFile(projectPath, rel) {
  const root = path.resolve(projectPath)
  const clean = String(rel || '').replace(/\\/g, '/').replace(/^\/+/, '')
  if (!clean || clean.includes('..')) throw new Error('非法路径')
  const ext = path.extname(clean).toLowerCase()
  const mime = FILE_MIME[ext]
  if (!mime) throw new Error('这个文件类型不在预览白名单里')
  const abs = path.join(root, ...clean.split('/'))
  if (!relInside(root, abs)) throw new Error('非法路径')
  if (!isFile(abs)) throw new Error('文件不存在')
  const stat = fs.statSync(abs)
  if (stat.size > 20 * 1024 * 1024) throw new Error('文件太大')
  return { rel: clean, mime, content: fs.readFileSync(abs) }
}
