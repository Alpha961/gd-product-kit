window.__ModuleLoader__.load({
  id: "gd-product-kit",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    const React = require("react");
    const h = React.createElement;

    const PANEL_ID = "gd-product-kit";
    const API = "/gd-product-kit/api";
    const STYLE = "/gd-product-kit/static/style.css";

    const ART_META = {
      demand: { title: "调研分析", file: "调研分析", desc: "人 · 场景 · 困难 · 需求池 P0/P1/P2" },
      prd: { title: "PRD", file: "PRD", desc: "这一版做什么、不做什么" },
      wireframe: { title: "线框图", file: "线框图", desc: "页面清单 · 主流程 · 跨页规则" },
      design: { title: "设计规范", file: "设计规范", desc: "颜色 · 字号 · 间距 · 组件" },
      agents: { title: "工作区整理", file: "AGENTS", desc: "目录 · 命令 · 回写约定" },
    };
    const STATE_LABEL = { doing: "进行中", todo: "待做", blocked: "卡点" };
    const STATE_TONE = { doing: "blue", todo: "gray", blocked: "amber" };
    const ACTION_LABEL = {
      "new-project": "补全调研分析",
      resume: "继续做",
      todo: "派发待办",
      fill: "一键补充",
      review: "回顾最近提交",
      artifact: "生成单份产出",
      "import-backfill": "补作业",
    };

    const ICON_GRID = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>';
    const ICON_SEARCH = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2"/></svg>';

    const SHELL = `
      <main class="wb">
        <header class="wb-head">
          <div class="wb-title">
            <div class="wb-ico">${ICON_GRID}</div>
            <div>
              <div class="wb-t">搞定产品设计包</div>
              <div class="wb-s">VibeCoding 项目工作台 · gd-product-kit</div>
            </div>
          </div>
          <div class="search">
            ${ICON_SEARCH}
            <input id="q" placeholder="搜索项目…" autocomplete="off">
          </div>
          <div class="wb-actions">
            <button class="btn ghost" type="button" data-action="import">导入项目</button>
            <button class="btn primary" type="button" data-action="wiz-open">＋ 新建项目</button>
          </div>
        </header>
        <div class="wb-body">
          <aside class="plist" id="plist"></aside>
          <section class="detail" id="detail"></section>
        </div>
      </main>

      <div class="modal" id="wizard" aria-label="新建项目">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="wiz-title">
          <div class="wiz-head">
            <div>
              <div class="wiz-kicker" id="wiz-kicker">新建项目 · 1/3</div>
              <h2 id="wiz-title">先想清楚，再动手</h2>
            </div>
            <button class="close" type="button" aria-label="关闭" data-action="wiz-close">×</button>
          </div>
          <div class="wiz-steps" id="wiz-steps"></div>
          <div class="wiz-body" id="wiz-body"></div>
          <div class="wiz-foot">
            <button class="btn ghost" type="button" data-action="wiz-close">取消</button>
            <span class="spacer"></span>
            <button class="btn" type="button" data-action="wiz-prev" id="wiz-prev">上一步</button>
            <button class="btn primary" type="button" data-action="wiz-next" id="wiz-next">下一步</button>
          </div>
        </div>
      </div>

      <div class="modal" id="importer" aria-label="导入项目">
        <div class="modal-card" role="dialog" aria-modal="true" style="width:720px">
          <div class="wiz-head">
            <div>
              <div class="wiz-kicker" id="import-kicker">导入项目</div>
              <h2 id="import-title">扫描已有项目</h2>
            </div>
            <button class="close" type="button" aria-label="关闭" data-action="import-close">×</button>
          </div>
          <div class="wiz-body" id="import-body"></div>
          <div class="wiz-foot">
            <button class="btn ghost" type="button" data-action="import-close">取消</button>
            <span class="spacer"></span>
            <button class="btn" type="button" data-action="import-select-all" id="import-all">全选</button>
            <button class="btn primary" type="button" data-action="import-selected" id="import-selected">导入选中</button>
          </div>
        </div>
      </div>

      <div class="modal" id="confirm" aria-label="确认">
        <div class="modal-card" role="dialog" aria-modal="true" style="width:440px">
          <div class="wiz-head">
            <div>
              <div class="wiz-kicker">确认</div>
              <h2 id="confirm-title"></h2>
            </div>
            <button class="close" type="button" aria-label="关闭" data-action="confirm-close">×</button>
          </div>
          <div class="wiz-body" style="padding-top:4px">
            <p id="confirm-message" style="font-size:12.5px;line-height:1.7;color:var(--text2);margin:0"></p>
          </div>
          <div class="wiz-foot">
            <button class="btn ghost" type="button" data-action="confirm-close">取消</button>
            <span class="spacer"></span>
            <button class="btn primary" type="button" id="confirm-ok" data-action="confirm-ok">确认</button>
          </div>
        </div>
      </div>

      <aside class="drawer" id="drawer" aria-label="侧边栏预览"></aside>
      <div class="toast" id="toast" role="status"></div>

    `;

    let shadow = null;
    let ctxRef = null;

    const state = {
      projects: [],
      roots: [],
      detail: null,
      selected: null,
      filter: "all",
      q: "",
      loading: true,
      error: null,
      toastTimer: null,
      drawer: null,
      importer: { open: false, loading: false, error: null, candidates: [], selected: new Set() },
      todoDraft: { open: false, title: "" },
      confirm: { open: false, title: "", message: "", label: "确认", action: "", danger: false },
    };

    const wizard = {
      open: false,
      step: 1,
      data: {
        name: "", kind: "小程序", dir: "",
        user: "", background: "", problem: "", workaround: "", goal: "",
        coreTask: "", notDoing: "",
      },
    };
    const WIZ_TITLES = ["先想清楚，再动手", "他是谁，卡在哪", "第一版只承诺一件事"];
    const WIZ_STEPS = ["项目", "用户", "第一版"];

    const $id = (id) => (shadow ? shadow.getElementById(id) : null);
    const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const escAttr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

    function icon(name, size = 14) {
      const paths = {
        alert: '<path d="M12 4l9 16H3z"/><path d="M12 9v4M12 16.5v.5"/>',
        check: '<path d="M5 12l5 5 9-10"/>',
        clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
        doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
      };
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ""}</svg>`;
    }

    function toast(message) {
      const el = $id("toast");
      if (!el) return;
      el.textContent = message;
      el.classList.add("on");
      clearTimeout(state.toastTimer);
      state.toastTimer = setTimeout(() => el.classList.remove("on"), 2400);
    }

    async function api(path, options = {}) {
      const res = await fetch(API + path, {
        headers: { "content-type": "application/json" },
        ...options,
      });
      const data = await res.json().catch(() => ({ ok: false, error: "响应不是 JSON" }));
      if (!res.ok || data.ok === false) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    }

    function normPath(p) {
      return String(p || "").replace(/\\/g, "/").toLowerCase();
    }

    function counts() {
      const live = state.projects.filter((p) => !p.archived);
      return {
        all: live.length,
        active: live.filter((p) => !p.paused).length,
        paused: live.filter((p) => p.paused).length,
        archived: state.projects.filter((p) => p.archived).length,
      };
    }

    function visibleProjects() {
      let list = state.projects.filter((p) => {
        if (state.filter === "archived") return p.archived;
        if (p.archived) return false;
        if (state.filter === "paused") return p.paused;
        if (state.filter === "active") return !p.paused;
        return true;
      });
      const q = state.q.trim().toLowerCase();
      if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
      return list;
    }

    async function loadState(keepSelection = true) {
      state.loading = true;
      state.error = null;
      renderAll();
      try {
        const data = await api("/state");
        state.projects = data.projects || [];
        state.roots = data.roots || [];
        const exists = state.projects.some((p) => p.path === state.selected);
        if (!keepSelection || !exists) state.selected = state.projects[0]?.path || null;
        if (state.selected) await loadDetail();
        else state.detail = null;
      } catch (error) {
        state.error = error.message;
      } finally {
        state.loading = false;
        renderAll();
      }
    }

    async function loadDetail() {
      const path = state.selected;
      if (!path) {
        state.detail = null;
        renderDetail();
        return;
      }
      try {
        const data = await api(`/project?path=${encodeURIComponent(path)}&probe=1`);
        if (state.selected === path) state.detail = data.project;
      } catch (error) {
        toast("读取项目失败：" + error.message);
      }
      renderDetail();
    }

    async function selectProject(path) {
      state.selected = path;
      state.detail = state.projects.find((p) => p.path === path) || null;
      state.drawer = null;
      renderAll();
      await loadDetail();
    }

    function toneDot(tone) {
      return tone === "amber" ? "amber" : tone === "blue" ? "blue" : tone === "green" ? "green" : "gray";
    }

    /* ------------------------------ list ------------------------------ */
    function renderList() {
      const host = $id("plist");
      if (!host) return;
      if (state.error) {
        host.innerHTML = `<div class="plist-empty">读取失败<br>${esc(state.error)}<br><br><button class="btn sm" data-action="reload">重试</button></div>`;
        return;
      }
      if (state.loading && !state.projects.length) {
        host.innerHTML = `<div class="plist-empty">正在读取项目…</div>`;
        return;
      }
      if (!state.projects.length) {
        host.innerHTML = `
          <div class="plist-head">
            <div class="plist-title">项目 <span>0</span></div>
            <div class="filters">
              <button class="on">全部 <em>0</em></button>
              <button>进行中 <em>0</em></button>
              <button>暂停 <em>0</em></button>
              <button>已归档 <em>0</em></button>
            </div>
          </div>
          <div class="plist-empty">还没有项目<br><br>点右上角「导入项目」，<br>或新建一个项目。</div>
          <div class="plist-foot">扫描：${esc(state.roots.join(" · ") || "E:\\AI · E:\\WORK")} <button data-action="import">重新扫描</button></div>
        `;
        return;
      }
      const c = counts();
      const list = visibleProjects();
      const chips = [
        ["all", "全部", c.all],
        ["active", "进行中", c.active],
        ["paused", "暂停", c.paused],
        ["archived", "已归档", c.archived],
      ].map(([f, label, n]) => `<button class="${state.filter === f ? "on" : ""}" data-action="filter" data-filter="${f}">${label} <em>${n}</em></button>`).join("");
      const roots = state.roots.length ? state.roots.join(" · ") : "E:\\AI · E:\\WORK";
      host.innerHTML = `
        <div class="plist-head">
          <div class="plist-title">项目 <span>${c.all}</span></div>
          <div class="filters">${chips}</div>
        </div>
        <div class="plist-scroll">
          ${list.length ? list.map(projectRow).join("") : '<div class="plist-empty">没有匹配的项目</div>'}
        </div>
        <div class="plist-foot">扫描：${esc(roots)} <button data-action="import">重新扫描</button></div>
      `;
    }

    function projectRow(p) {
      const job = p.version || {};
      const todos = (p.todos || []).filter((t) => t.state !== "done").length;
      const blocked = (p.todos || []).filter((t) => t.state === "blocked").length;
      const steps = job.track || [];
      const done = steps.filter((s) => s.s === "done").length;
      const active = steps.filter((s) => s.s === "active").length;
      const pct = steps.length ? Math.round(((done + active * 0.5) / steps.length) * 100) : 0;
      const bar = steps.length ? `<div class="pbar ${job.state?.includes("暂停") || p.archived ? "paused" : ""}"><i style="width:${pct}%"></i></div>` : "";
      return `<button class="prow ${state.selected === p.path ? "on" : ""} ${job.state?.includes("暂停") ? "paused" : ""}" data-action="select" data-id="${escAttr(p.path)}">
        <div class="prow-top">
          <span class="dot ${toneDot(job.tone)}"></span>
          <span class="prow-name">${esc(p.name)}</span>
          <span class="prow-ver">${esc(job.label || "v0.1")}</span>
        </div>
        <div class="prow-sub">
          <span class="chip ${job.tone || "gray"}">${esc(job.state || "构思")}</span>
          <span>待办 ${todos}${blocked ? ` · 卡点 ${blocked}` : ""}</span>
          <span class="prow-time">${esc(p.updated || "未生成")}</span>
        </div>
        ${bar}
      </button>`;
    }

    /* ------------------------------ detail ------------------------------ */
    function renderDetail() {
      const host = $id("detail");
      if (!host) return;
      if (state.loading && !state.detail) {
        host.innerHTML = `<div class="detail-inner empty-wrap"><div class="empty"><h2>正在读取项目…</h2><p>读 .gd/project.json 和五件套状态。</p></div></div>`;
        return;
      }
      if (state.error) {
        host.innerHTML = `<div class="detail-inner empty-wrap"><div class="empty"><h2>读取失败</h2><p>${esc(state.error)}</p><div class="empty-actions"><button class="btn primary" data-action="reload">重试</button></div></div></div>`;
        return;
      }
      const p = state.detail;
      if (!p) {
        host.innerHTML = emptyDetail();
        return;
      }
      const keys = Object.keys(ART_META);
      const missing = keys.filter((k) => !p.artifacts?.[k]?.md || !p.artifacts?.[k]?.html).length;
      host.innerHTML = `
        <div class="detail-inner">
          ${banner(p)}
          <div class="dhead">
            <div>
              <h1>${esc(p.name)}<span class="kind"><span class="chip gray">${esc(p.kind)}</span></span></h1>
              <div class="path">${esc(p.path)}</div>
              <div class="dsub">${releaseLine(p)}</div>
            </div>
            <div class="dhead-right">
              ${p.archived ? "" : `<button class="btn primary" data-action="resume">${p.paused ? "恢复并继续" : "▶ 继续做"}</button>`}
              <button class="btn icon" aria-label="更多" data-action="more">···</button>
            </div>
          </div>
          <div class="cols">
            <div class="main">
              ${versionCard(p)}
              ${artifactsCard(p, missing)}
              ${ideasCard(p)}
            </div>
            <aside class="side">
              ${todosCard(p)}
              ${healthCard(p)}
              ${dynamicsCard(p)}
            </aside>
          </div>
        </div>
      `;
    }

    function emptyDetail() {
      return `<div class="detail-inner empty-wrap">
        <div class="empty">
          <div class="empty-ill"><i></i><i></i><i></i><i></i></div>
          <h2>还没有项目</h2>
          <p>点右上角「导入项目」扫描已有项目，或「＋ 新建项目」从用户画像开始。</p>
          <div class="empty-actions">
            <button class="btn primary" data-action="import">扫描目录导入</button>
            <button class="btn" data-action="wiz-open">新建项目</button>
          </div>
          <div class="empty-hint">扫描根目录：${esc(state.roots.join(" · ") || "E:\\AI · E:\\WORK")}</div>
        </div>
      </div>`;
    }

    function banner(p) {
      if (p.archived) {
        return bannerEl("gray", "已归档，只读。取消归档后才能继续更新。", "取消归档", "ask-restore");
      }
      if (p.paused) {
        return bannerEl("gray", "已暂停。恢复时从「下一步」继续，五件套不会丢。", "恢复项目", "ask-restore");
      }
      if (p.stale) {
        return bannerEl("amber", `project.json ${esc(p.updated)}没更新，下面的状态可能已经过期。`, "让 AI 回顾最近提交", "review-stale");
      }
      if (p.release?.url && p.release?.probe === "fail") {
        return bannerEl("red", `发布地址打不开：${esc(p.release.url)}。`, "重新检测", "recheck");
      }
      return "";
    }

    function bannerEl(tone, text, label, action) {
      return `<div class="banner ${tone}">
        ${icon("alert", 15)}
        <div class="b-msg">${text}</div>
        <button class="btn sm b-act" data-action="${action}">${label}</button>
      </div>`;
    }

    function releaseLine(p) {
      if (p.release?.url) {
        const bad = p.release.probe === "fail";
        return `<span>发布：</span><a href="${escAttr(p.release.url)}" target="_blank" rel="noreferrer">${esc(p.release.url)}</a>${bad ? '<span class="bad">打不开</span>' : ""}`;
      }
      return `<span>发布：未发布</span>`;
    }

    function versionCard(p) {
      const v = p.version || {};
      const track = (v.track || []).length
        ? `<div class="track">${v.track.map((s) => `<div class="tstep ${s.s}"><span class="tdot"></span><b>${esc(s.n)}</b></div>`).join("")}</div>`
        : `<div class="vempty">还没有发布轨道</div>`;
      const next = v.next ? `<div class="nextline"><span>下一步</span><b>${esc(v.next)}</b></div>` : "";
      return `<div class="card">
        <div class="card-head"><h2>当前版本</h2></div>
        <div class="vline">
          <span class="ver">${esc(v.label || "v0.1")}</span>
          <span class="chip ${v.tone || "gray"}">${esc(v.state || "构思")}</span>
        </div>
        ${track}
        ${next}
      </div>`;
    }

    function artifactsCard(p, missing) {
      const locked = p.archived || p.paused;
      const rows = Object.entries(ART_META).map(([key, meta]) => {
        const a = p.artifacts?.[key] || {};
        return `<button class="art" data-action="open-artifact" data-key="${key}">
          <span class="art-name">${meta.title}</span>
          <span class="art-fmts">
            ${a.html ? '<span class="fmt on">HTML</span>' : '<span class="fmt miss">缺失 HTML</span>'}
            ${a.md ? '<span class="fmt on">MD</span>' : '<span class="fmt miss">缺失 MD</span>'}
          </span>
        </button>`;
      }).join("");
      return `<div class="card">
        <div class="card-head">
          <h2>五件套</h2>
          <span class="hint">HTML + MD · 点击在右侧栏打开</span>
          ${missing && !locked ? '<div class="act"><button class="btn sm" data-action="fill">一键补充</button></div>' : ""}
        </div>
        <div class="arts">${rows}</div>
      </div>`;
    }

    function todosCard(p) {
      const locked = p.archived || p.paused;
      const form = state.todoDraft.open && !locked
        ? `<div class="todo-form">
            <input id="todo-title" value="${escAttr(state.todoDraft.title)}" placeholder="待办标题">
            <button class="btn sm primary" type="button" data-action="todo-save">保存</button>
            <button class="btn sm ghost" type="button" data-action="todo-cancel">取消</button>
          </div>`
        : "";
      const rows = (p.todos || []).length
        ? p.todos.map((t) => `<div class="todo ${t.state === "blocked" ? "blocked" : ""}">
            <div class="todo-top">
              <span class="chip ${STATE_TONE[t.state] || "gray"}">${STATE_LABEL[t.state] || t.state}</span>
              <span class="todo-title">${esc(t.title)}</span>
            </div>
            <div class="todo-bot">
              ${t.doc ? `<button class="doclink" data-action="open-doc" data-rel="${escAttr(t.doc)}">${esc(t.docName || t.doc)}</button>` : ""}
              <button class="btn sm" ${locked ? "disabled" : ""} data-action="dispatch-todo" data-id="${escAttr(t.id)}">派发</button>
            </div>
          </div>`).join("")
        : `<div class="empty-note" style="padding:4px 0">${icon("check", 13)} 没有待办。去点子池挑一个。</div>`;
      return `<div class="card">
        <div class="card-head">
          <h2>待办与卡点</h2>
          <span class="hint">${(p.todos || []).length} 条</span>
          <div class="act"><button class="btn sm" title="添加待办" ${locked ? "disabled" : ""} data-action="add-todo">＋</button></div>
        </div>
        ${form}
        ${rows}
      </div>`;
    }

    function ideasCard(p) {
      const locked = p.archived || p.paused;
      const rows = (p.ideas || []).length
        ? p.ideas.map((it) => `<div class="idea">
            <span class="num">${esc(it.id)}</span>
            <div class="idea-main">
              <span class="idea-title">${esc(it.title)}</span>
              <span class="idea-desc">${esc(it.desc || "")}</span>
              ${it.doc ? `<button class="doclink" data-action="open-doc" data-rel="${escAttr(it.doc)}">点子池.md</button>` : ""}
            </div>
            <span class="chip ${it.p === "高" ? "red" : it.p === "中" ? "amber" : "gray"}">${esc(it.p || "中")}</span>
            <div class="idea-actions">
              <button class="btn sm" ${locked ? "disabled" : ""} data-action="promote" data-id="${escAttr(it.id)}">升为待办</button>
            </div>
          </div>`).join("")
        : `<div class="empty-note">${icon("check", 13)} 还没有点子。点子池是文档，插件只读它。</div>`;
      return `<div class="card">
        <div class="card-head">
          <h2>点子池</h2>
          <span class="hint">${(p.ideas || []).length} 条 · 来自 点子池.md</span>
          <div class="act"><button class="btn sm" data-action="open-doc" data-rel="docs/产品迭代/点子池.md">打开文档</button></div>
        </div>
        ${rows}
      </div>`;
    }

    function healthCard(p) {
      const h = p.health || {};
      const linkState = h.hasUrl ? (h.linkOk === true ? "ok" : h.linkOk === false ? "bad" : "miss") : "miss";
      const linkText = h.hasUrl ? (h.linkOk === true ? "可访问" : h.linkOk === false ? "打不开" : "未检测") : "未配置";
      const row = (state, label, val) => `<div class="health-row"><span class="hdot ${state}"></span><span>${label}</span><span class="val">${val}</span></div>`;
      return `<div class="card">
        <div class="card-head">
          <h2>项目体检</h2>
          <span class="hint">缺什么，点哪补</span>
          <div class="act"><button class="btn sm" data-action="recheck">重新体检</button></div>
        </div>
        <div class="health">
          ${row(h.md === 5 ? "ok" : "miss", "五件套 MD", `${h.md || 0}/5`)}
          ${row(h.html === 5 ? "ok" : "miss", "HTML 阅读版", `${h.html || 0}/5`)}
          ${row(linkState, "发布地址", linkText)}
          ${row((h.blocked || 0) ? "miss" : "ok", "卡点", String(h.blocked || 0))}
        </div>
        <div class="data-foot">${icon("clock", 11)} project.json · ${esc(p.updated || "未生成")}由 ${esc(p.updater || "—")} 更新</div>
      </div>`;
    }

    function dynamicsCard(p) {
      const commits = (p.commits || []).length
        ? p.commits.map((c) => `<div class="side-row"><span class="hash">${esc(c.h)}</span><span class="msg">${esc(c.m)}</span><span class="t">${esc(c.t)}</span></div>`).join("")
        : `<div class="muted">暂无提交</div>`;
      const hist = (p.history || []).length
        ? p.history.map((x) => `<div class="side-row"><span class="ver" style="font-size:10px">${esc(x.v)}</span><span class="chip ${x.tone || "gray"}">${esc(x.s)}</span><span class="t">${esc(x.t)}</span></div>`).join("")
        : `<div class="muted">暂无版本</div>`;
      return `<div class="card">
        <div class="card-head"><h2>项目动态</h2><span class="hint">git · 版本</span></div>
        <div class="dyn">
          <div class="dyn-label">最近提交</div>${commits}
          <div class="dyn-label">版本历史</div>${hist}
        </div>
      </div>`;
    }

    /* ------------------------------ wizard ------------------------------ */
    function openWizard(step = 1) {
      wizard.open = true;
      wizard.step = Math.min(3, Math.max(1, step));
      renderWizard();
    }
    function closeWizard() {
      wizard.open = false;
      const el = $id("wizard");
      if (el) el.classList.remove("on");
    }
    function saveWizardFields() {
      if (!shadow) return;
      shadow.querySelectorAll("#wizard [data-wiz]").forEach((el) => {
        wizard.data[el.dataset.wiz] = el.value;
      });
    }
    function wizNote(text) {
      return `<div class="wiz-note">${icon("alert", 13)}<div>${text}</div></div>`;
    }
    function wizardStep1() {
      const d = wizard.data;
      const kinds = ["小程序", "网站", "App", "插件", "其他"];
      return `${wizNote("先把「给谁、解决什么」写清楚，再让 AI 写代码。这个向导只做课程 03 的前半段：用户画像 + 项目边界。")}
      <div class="wiz-grid">
        <div class="field"><label>项目名 <b class="req">*</b></label><input data-wiz="name" value="${escAttr(d.name)}" placeholder="例：expense-log"></div>
        <div class="field"><label>类型</label><div class="typechips">${kinds.map((k) => `<button class="${d.kind === k ? "on" : ""}" data-action="wiz-kind" data-kind="${k}">${k}</button>`).join("")}</div></div>
      </div>
      <div class="field"><label>项目目录 <b class="req">*</b></label>
        <div class="dirrow"><input data-wiz="dir" value="${escAttr(d.dir)}" placeholder="E:\\WORK\\projects\\my-product">
          <button class="btn" data-action="wiz-pick-dir">选择</button></div>
        <div class="hint">会在这里生成 .gd/project.json、docs/ 和 AGENTS.md；已有文件不覆盖。</div>
      </div>`;
    }
    function wizardStep2() {
      const d = wizard.data;
      return `${wizNote("先找问题，别急着想功能。写一个具体的人、一次具体的麻烦；不要写「拍照上传、时间线」这种解法。")}
      <div class="field"><label>给谁用 <b class="req">*</b></label><input data-wiz="user" value="${escAttr(d.user)}" placeholder="例：30 岁、一个月出差 2–3 次、习惯先攒票据的销售"><div class="hint">一个具体的人，或一类边界清楚的人；不要写「所有人」。</div></div>
      <div class="field"><label>这个人的背景（可选）</label><textarea data-wiz="background" placeholder="平时几点上下班、什么时候有空、在什么环境里做这件事；时间/精力/预算的限制">${esc(d.background)}</textarea></div>
      <div class="field"><label>最麻烦的一件事 <b class="req">*</b></label><textarea data-wiz="problem" placeholder="具体到：什么时候、在哪、发生了什么、卡在哪">${esc(d.problem)}</textarea></div>
      <div class="field"><label>现在怎么应付（可选）</label><textarea data-wiz="workaround" placeholder="备忘录、相册、Excel、问同事……现在的办法是什么">${esc(d.workaround)}</textarea></div>
      <div class="field"><label>他想要的结果（可选）</label><textarea data-wiz="goal" placeholder="用他自己的话说，不写功能名">${esc(d.goal)}</textarea></div>`;
    }
    function wizardStep3() {
      const d = wizard.data;
      return `${wizNote("第一版只承诺一件事。先让这个人把一件事从头做完，再谈功能。")}
      <div class="field"><label>第一版核心任务 <b class="req">*</b></label><textarea data-wiz="coreTask" placeholder="例：记下这一次照料，下次想不起来的时候能找到它">${esc(d.coreTask)}</textarea></div>
      <div class="field"><label>这一版不做什么（可选）</label><textarea data-wiz="notDoing" style="min-height:80px" placeholder="一行一条；例：不做社区、不做植物识别">${esc(d.notDoing)}</textarea></div>
      <div class="genbox">
        <div class="gen-title">创建后会生成</div>
        <ul>
          <li>docs/调研分析.md（上半部分已按你填的写好，下半部分需求池留空）</li>
          <li>docs/PRD.md、docs/线框图.html、docs/设计规范.md（空模板）</li>
          <li>AGENTS.md、.gd/project.json</li>
          <li>docs/发布清单.md、PLAN.md、README.md、docs/验收记录.md（可选模板）</li>
        </ul>
        <div class="hint">然后自动开新会话：读调研分析，补全 §6 需求池。PRD / 线框图 / 设计规范先不写。</div>
      </div>`;
    }
    function renderWizard() {
      const host = $id("wizard");
      if (!host) return;
      if (!wizard.open) {
        host.classList.remove("on");
        return;
      }
      host.classList.add("on");
      $id("wiz-kicker").textContent = `新建项目 · ${wizard.step}/3`;
      $id("wiz-title").textContent = WIZ_TITLES[wizard.step - 1];
      $id("wiz-steps").innerHTML = WIZ_STEPS.map((label, i) => {
        const n = i + 1;
        const cls = n === wizard.step ? "on" : n < wizard.step ? "done" : "";
        return `<div class="wstep ${cls}"><i>${n < wizard.step ? "✓" : n}</i>${label}</div>${n < 3 ? '<div class="wline"></div>' : ""}`;
      }).join("");
      $id("wiz-body").innerHTML = [wizardStep1, wizardStep2, wizardStep3][wizard.step - 1]();
      $id("wiz-prev").disabled = wizard.step === 1;
      $id("wiz-next").textContent = wizard.step === 3 ? "创建并开始" : "下一步";
    }
    function wizValidate() {
      const d = wizard.data;
      if (wizard.step === 1) {
        if (!d.name.trim()) return "先填项目名";
        if (!d.dir.trim()) return "先填项目目录";
      }
      if (wizard.step === 2) {
        if (!d.user.trim()) return "先写「给谁用」";
        if (!d.problem.trim()) return "先写「最麻烦的一件事」";
      }
      if (wizard.step === 3 && !d.coreTask.trim()) return "先写「第一版核心任务」";
      return "";
    }
    async function createWizardProject() {
      saveWizardFields();
      const err = wizValidate();
      if (err) {
        toast(err);
        return;
      }
      const button = $id("wiz-next");
      if (button) button.disabled = true;
      try {
        const res = await api("/create", { method: "POST", body: JSON.stringify(wizard.data) });
        closeWizard();
        toast(`已创建「${wizard.data.name}」，正在打开调研分析会话…`);
        state.selected = res.state.path;
        await loadState(true);
        state.detail = res.state;
        renderAll();
        await dispatchAction("new-project", res.state);
      } catch (error) {
        toast("创建失败：" + error.message);
      } finally {
        if (button) button.disabled = false;
      }
    }

    /* ------------------------------ open / dispatch ------------------------------ */
    function fileAddress(abs) {
      const normalized = String(abs).replace(/\\/g, "/");
      const encoded = normalized.split("/").map((s) => encodeURIComponent(s)).join("/").replace(/%3A/gi, ":");
      return `dsh-resource://file/absolute/${encoded}`;
    }

    async function openFile(rel, quiet = false) {
      const p = state.detail;
      if (!p || !rel) {
        if (!quiet) toast("文件路径为空");
        return false;
      }
      const abs = p.path + "\\" + String(rel).replace(/\//g, "\\");
      try {
        const sidebar = ctxRef.get("sidebarRight");
        if (sidebar && typeof sidebar.openResource === "function") {
          sidebar.openResource(fileAddress(abs));
          return true;
        }
      } catch (error) {
        if (!quiet) toast("右侧栏打开失败：" + error.message);
        return false;
      }
      if (!quiet) toast("右侧栏不可用，文件：" + rel);
      return false;
    }

    function basename(rel) {
      return String(rel || "").split("/").pop() || rel;
    }

    function dirnameRel(rel) {
      const s = String(rel || "").replace(/\\/g, "/");
      const i = s.lastIndexOf("/");
      return i >= 0 ? s.slice(0, i) : "";
    }

    function resolveRel(base, rel) {
      if (!rel || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(rel)) return null;
      const parts = (base ? base.split("/") : []).concat(rel.split("/"));
      const out = [];
      for (const part of parts) {
        if (!part || part === ".") continue;
        if (part === "..") out.pop();
        else out.push(part);
      }
      return out.join("/");
    }

    function projectFileUrl(projectPath, rel) {
      return `/gd-product-kit/files?path=${encodeURIComponent(projectPath)}&rel=${encodeURIComponent(rel)}`;
    }

    async function openArtifact(key) {
      const p = state.detail;
      if (!p) return;
      const meta = ART_META[key];
      const a = p.artifacts?.[key] || {};
      if (!a.md && !a.html) {
        toast("还没有文件，先用「一键补充」");
        return;
      }
      const base = `/artifact?path=${encodeURIComponent(p.path)}&key=${encodeURIComponent(key)}&format=`;
      try {
        const [htmlData, mdData] = await Promise.all([
          a.html ? api(base + "html") : null,
          a.md ? api(base + "md") : null,
        ]);
        const rel = (htmlData && htmlData.rel) || (mdData && mdData.rel) || "";
        state.drawer = {
          kind: "artifact",
          key,
          title: meta.title,
          rel,
          path: p.path,
          base: dirnameRel(rel),
          hasHtml: Boolean(htmlData),
          hasMd: Boolean(mdData),
          html: htmlData ? htmlData.content : null,
          md: mdData ? mdData.content : null,
          tab: htmlData ? "html" : "md",
        };
        renderDrawer();
      } catch (error) {
        toast("读取失败：" + error.message);
      }
    }

    async function openDoc(rel) {
      const p = state.detail;
      if (!p || !rel) return;
      try {
        const data = await api(`/doc?path=${encodeURIComponent(p.path)}&rel=${encodeURIComponent(rel)}`);
        state.drawer = {
          kind: "doc",
          title: basename(rel),
          rel: data.rel || rel,
          content: data.content,
        };
        renderDrawer();
      } catch (error) {
        toast("读取失败：" + error.message);
      }
    }

    function closeDrawer() {
      state.drawer = null;
      renderDrawer();
    }

    function rewriteCssUrls(css, d) {
      return String(css || "").replace(/url\(\s*(['"]?)([^)'"]+?)\1\s*\)/gi, (match, quote, url) => {
        const resolved = resolveRel(d.base, String(url).trim());
        return resolved ? `url("${projectFileUrl(d.path, resolved)}")` : match;
      });
    }

    async function injectDrawerHtml(html, d) {
      const el = $id("drawer-content");
      if (!el) return;
      try {
        const parsed = new DOMParser().parseFromString(html, "text/html");
        parsed.querySelectorAll("script").forEach((s) => s.remove());
        for (const link of [...parsed.querySelectorAll('link[rel~="stylesheet"][href]')]) {
          const href = link.getAttribute("href");
          const resolved = resolveRel(d.base, href);
          if (!resolved) continue;
          try {
            const res = await fetch(projectFileUrl(d.path, resolved));
            if (!res.ok) continue;
            const css = await res.text();
            const style = parsed.createElement("style");
            style.textContent = rewriteCssUrls(css, { ...d, base: dirnameRel(resolved) });
            link.replaceWith(style);
          } catch {
            /* 拉不到就保留原 link，让后面的重写兜底 */
          }
        }
        for (const node of parsed.querySelectorAll("img[src], source[src], link[href]")) {
          const attr = node.hasAttribute("src") ? "src" : "href";
          const value = node.getAttribute(attr);
          const resolved = resolveRel(d.base, value);
          if (resolved) node.setAttribute(attr, projectFileUrl(d.path, resolved));
        }
        for (const node of parsed.querySelectorAll("[srcset]")) {
          const value = node.getAttribute("srcset");
          if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value.trim())) continue;
          const rewritten = value
            .split(",")
            .map((part) => {
              const bits = part.trim().split(/\s+/);
              const resolved = resolveRel(d.base, bits[0]);
              if (!resolved) return part.trim();
              bits[0] = projectFileUrl(d.path, resolved);
              return bits.join(" ");
            })
            .join(", ");
          node.setAttribute("srcset", rewritten);
        }
        for (const style of parsed.querySelectorAll("style")) {
          style.textContent = rewriteCssUrls(style.textContent, d);
        }
        for (const node of parsed.querySelectorAll("[style]")) {
          node.setAttribute("style", rewriteCssUrls(node.getAttribute("style"), d));
        }
        const styles = [...parsed.querySelectorAll("style")].map((s) => s.textContent).join("\n");
        el.innerHTML = `<style>${styles}</style>${parsed.body.innerHTML}`;
      } catch {
        el.innerHTML = `<pre class="md">${esc(html)}</pre>`;
      }
    }

    function drawerHead(title, rel) {
      return `<div class="dhead2">
        <span class="ico">${icon("doc", 15)}</span>
        <div><h3>${esc(title)}</h3><div class="dpath">${esc(rel)}</div></div>
        <button class="close" type="button" aria-label="关闭" data-action="drawer-close">×</button>
      </div>`;
    }

    function drawerFoot(d) {
      return `<div class="dnote">右侧栏预览 · 内容来自项目文件</div>
        <div class="dfoot">
          <button class="btn primary" type="button" data-action="drawer-sidebar">在 DSH 侧栏打开</button>
          <button class="btn ghost" type="button" data-action="drawer-copy">复制路径</button>
          <span class="spacer"></span>
          <span class="chip gray">${d.kind === "doc" ? "MD" : d.tab === "html" ? "HTML" : "MD"}</span>
        </div>`;
    }

    function renderDrawer() {
      const host = $id("drawer");
      if (!host) return;
      const d = state.drawer;
      if (!d) {
        host.classList.remove("on");
        host.innerHTML = "";
        return;
      }
      host.classList.add("on");
      if (d.kind === "doc") {
        host.innerHTML = `
          ${drawerHead(d.title, d.rel)}
          <div class="dbody"><pre class="md">${esc(d.content)}</pre></div>
          ${drawerFoot(d)}
        `;
        return;
      }
      const tabs = [];
      if (d.hasHtml || d.hasMd) tabs.push(`<button class="dtab ${d.tab === "html" ? "on" : ""}" data-action="drawer-tab" data-tab="html">HTML 阅读版</button>`);
      if (d.hasMd) tabs.push(`<button class="dtab ${d.tab === "md" ? "on" : ""}" data-action="drawer-tab" data-tab="md">MD 源文</button>`);
      let body = "";
      if (d.tab === "html") {
        body = d.html
          ? `<div class="dbody" id="drawer-content"></div>`
          : `<div class="dbody"><div class="drawer-empty">
              ${icon("alert", 22)}
              <h4>还没有 HTML 阅读版</h4>
              <p>MD 已经在了。生成一份 HTML 阅读版，内容以 MD 为准。</p>
              <button class="btn primary" data-action="drawer-gen" data-key="${escAttr(d.key)}" data-format="html">生成 HTML</button>
            </div></div>`;
      } else {
        body = d.md
          ? `<div class="dbody"><pre class="md">${esc(d.md)}</pre></div>`
          : `<div class="dbody"><div class="drawer-empty">
              ${icon("alert", 22)}
              <h4>还没有 MD 源文</h4>
              <p>让 AI 按模板补齐这一份，再生成 HTML。</p>
              <button class="btn primary" data-action="drawer-gen" data-key="${escAttr(d.key)}" data-format="md">让 AI 生成</button>
            </div></div>`;
      }
      host.innerHTML = `
        ${drawerHead(d.title, d.rel)}
        <div class="dtabs">${tabs.join("")}</div>
        ${body}
        ${drawerFoot(d)}
      `;
      if (d.tab === "html" && d.html) injectDrawerHtml(d.html, d).catch(() => {});
    }

    function todoText(p) {
      const list = (p.todos || []).filter((t) => t.state !== "done");
      return list.length ? list.map((t) => `- ${t.title}（${STATE_LABEL[t.state] || t.state}）`).join("\n") : "- 无";
    }
    function blockerText(p) {
      const list = (p.todos || []).filter((t) => t.state === "blocked");
      return list.length ? list.map((t) => `- ${t.title}`).join("\n") : "- 无";
    }
    function artifactText(p) {
      return Object.entries(ART_META).map(([key, meta]) => {
        const a = p.artifacts?.[key] || {};
        return `- ${meta.title}：${a.mdPath || "缺 md"} / ${a.htmlPath || "缺 html"}`;
      }).join("\n");
    }
    function missingArtifactText(p) {
      const parts = [];
      for (const [key, meta] of Object.entries(ART_META)) {
        const a = p.artifacts?.[key] || {};
        const dir = key === "agents" ? "" : "docs/";
        if (!a.md) parts.push(`- ${dir}${meta.file}.md（缺失）`);
        if (!a.html) parts.push(`- ${dir}${meta.file}.html（缺失）`);
      }
      return parts.length ? parts.join("\n") : "- 无";
    }

    function promptFor(action, p, extra = {}) {
      if (action === "new-project") {
        return `[gd-product-kit · new-project]
项目：${p.name}（${p.kind}）
目录：${p.path}
第一版核心任务：${p.version?.goal || "（见 docs/调研分析.md）"}

先读 .gd/project.json、AGENTS.md、docs/调研分析.md。
调研分析 §1–§5 已经写了：给谁用、这个人的背景、最麻烦的一件事、现在怎么应付、想要的结果。
不要重复问这些；只问缺失的，最多 2 个问题。

任务：补全 docs/调研分析.md 的 §6 需求池：
1. 先概括用户、具体场景、困难、现有办法和目标；区分资料、推断和假设，不编造访谈。
2. 选定第一版核心任务，描述从开始到完成的完整过程；逐个检查添加、记录、查看、纠错、留存在本项目是否必要。
3. 再列需求：每条写问题、用户结果、解法、可检查的验收方式、优先级、理由和假设。P0 只放完成核心任务必需的，不要全是 P0。
4. 写清第一版范围、限制和试用计划。
只改 docs/调研分析.md 的 §6，不动 §1–§5；同时生成 docs/调研分析.html 阅读版。
不要写 PRD / 线框图 / 设计规范，不要改需求调研部分。
完成后更新 .gd/project.json 的 artifacts 和 next，并告诉我 P0 有几条、需要我拍板什么。`;
      }
      if (action === "import-backfill") {
        return `[gd-product-kit · import-backfill]
项目：${p.name}
目录：${p.path}

读现有材料：README、docs/ 下的文档、版本记录、发布清单、点子池、git log 最近 30 条。
把现状汇总成 .gd/project.json：
- name / kind / 一句话
- version：从版本记录或 package.json 推断；没有就 v0.1 + 构思
- release.url：从发布清单或 README 找
- artifacts：五件套对应路径；没有就 null
- todos / ideas：从点子池、TODO、发布清单提取，保留原文件链接
- next：根据最近提交和未完成项给一句建议
只写 .gd/project.json，不改任何已有文档。
最后用 10 行列出你的推断依据（哪一条来自哪个文件），等我确认。`;
      }
      if (action === "resume") {
        return `[gd-product-kit · resume]
继续项目：${p.name}（${p.path}）
当前版本：${p.version?.label || "v0.1"} · ${p.version?.state || "构思"}
版本目标：${p.version?.goal || "（见调研分析）"}
下一步：${p.version?.next || "（未填）"}
未完成待办：
${todoText(p)}
卡点：
${blockerText(p)}
五件套：
${artifactText(p)}

先读 .gd/project.json 和相关文档，用 5 行以内回答：
1. 现在卡在哪；
2. 建议先做哪一件；
3. 需要我拍板什么。
我确认后再动手；不要一次改多个文件。`;
      }
      if (action === "todo") {
        const t = extra.todo || {};
        return `[gd-product-kit · todo]
项目：${p.name}（${p.path}）
执行待办：${t.title || "（未命名）"}
所属版本：${p.version?.label || "v0.1"} · ${p.version?.state || "构思"}
版本目标：${p.version?.goal || "（见调研分析）"}
关联文档：${t.doc || "（无）"}

先读 .gd/project.json 和关联文档，然后：
1. 复述你理解的验收标准（3 行内）；
2. 列改动清单（文件级）；
3. 我确认后再改；完成后更新 project.json 里这条待办的状态和 next。
不要顺手做其它待办。`;
      }
      if (action === "fill") {
        return `[gd-product-kit · fill-artifacts]
项目：${p.name}（${p.path}）
当前版本：${p.version?.label || "v0.1"} · ${p.version?.state || "构思"}
缺失清单：
${missingArtifactText(p)}

按模板补齐，不覆盖已有内容：
- 缺 md：从现有文档 / git / 代码里提取，找不到依据的段落写「TODO: 待补」；
- 缺 html：把同名 md 生成 HTML 阅读版，套 templates/artifact.html；
- 每份产出同时保留 .md 和 .html。
完成后更新 .gd/project.json 的 artifacts，并列出补了哪些、哪些留 TODO。`;
      }
      if (action === "review") {
        return `[gd-product-kit · review-stale]
项目：${p.name}（${p.path}）
.gd/project.json 最后更新：${p.updated || "未知"}；之后有 ${(p.commits || []).length} 条提交。

读 project.json、git log（从上次更新到现在）、最近会话标题，给一份 10 行以内的更新建议：
- 哪些待办已经完成；
- 哪些提交没有记进版本；
- next 应该改成什么。
先只给建议，不要写 project.json；我确认后再更新。`;
      }
      if (action === "artifact") {
        const key = extra.key;
        const meta = ART_META[key] || { title: key, file: key };
        const a = p.artifacts?.[key] || {};
        if (extra.format === "html" && a.md) {
          return `[gd-product-kit · artifact-html]
项目：${p.name}（${p.path}）
把 ${a.mdPath || "docs/" + meta.file + ".md"} 生成 docs/${meta.file}.html。
要求：套 templates/artifact.html；保留标题层级、表格、代码块；相对链接不改；内容以 md 为准。
只做这一份，不改 md，不改其它文件。`;
        }
        return `[gd-product-kit · artifact]
项目：${p.name}（${p.path}）
产出：${meta.title}
输出：docs/${meta.file}.md 和 docs/${meta.file}.html
依据：${artifactText(p)}

按 templates/${meta.file}.md 的结构写，同时产出 HTML 阅读版（套 templates/artifact.html）。
不要编造；找不到依据的段落写「TODO: 待补」。
完成后更新 .gd/project.json 的 artifacts 和 next。`;
      }
      throw new Error("未知派发动作：" + action);
    }

    async function dispatchAction(action, p = state.detail, extra = {}) {
      const workspaces = ctxRef.get("workspaces");
      const ui = ctxRef.get("uiWorkspace");
      const sessions = ctxRef.get("sessions");
      if (!workspaces || !ui || !sessions) throw new Error("DSH 会话服务未就绪");
      const prompt = promptFor(action, p, extra);
      let ws = (workspaces.list.getSnapshot().items || []).find((w) => normPath(w.path) === normPath(p.path));
      if (!ws) ws = await workspaces.create({ path: p.path });
      const sessionId = await ui.connectWorkspace(ws.workspaceId);
      const ref = sessions.retain(sessionId, { source: "controllerOperation" });
      let binding;
      try {
        binding = await ref.ready;
        if (!binding || !binding.session) throw new Error("会话未就绪");
        const label = ACTION_LABEL[action] || action;
        try {
          await binding.session.rename(`gd · ${p.name} · ${label}`);
        } catch {
          /* 改名失败不影响派发 */
        }
        const result = await binding.session.prompt([{ type: "text", text: prompt }], "queue");
        if (result && result.ok === false) throw new Error(String(result.error || "prompt 被拒绝"));
        if (typeof ui.openSession === "function") ui.openSession(sessionId);
        else if (typeof ui.openWorkspace === "function") await ui.openWorkspace(ws.workspaceId);
        toast(`已派发「${label}」到新会话`);
      } finally {
        setTimeout(() => ref.release(), 1000);
      }
    }

    async function openImport() {
      state.importer.open = true;
      state.importer.loading = true;
      state.importer.error = null;
      renderImport();
      try {
        const data = await api("/scan");
        state.importer.candidates = data.candidates || [];
      } catch (error) {
        state.importer.error = error.message;
      } finally {
        state.importer.loading = false;
        renderImport();
      }
    }

    function closeImport() {
      state.importer.open = false;
      renderImport();
    }

    function openConfirm(title, message, label, action, danger = false) {
      state.confirm = { open: true, title, message, label, action, danger };
      renderConfirm();
    }

    function closeConfirm() {
      state.confirm.open = false;
      renderConfirm();
    }

    function renderConfirm() {
      const host = $id("confirm");
      if (!host) return;
      if (!state.confirm.open) {
        host.classList.remove("on");
        return;
      }
      host.classList.add("on");
      $id("confirm-title").textContent = state.confirm.title;
      $id("confirm-message").textContent = state.confirm.message;
      const ok = $id("confirm-ok");
      ok.textContent = state.confirm.label;
      ok.className = `btn ${state.confirm.danger ? "danger" : "primary"}`;
    }

    function renderImport() {
      const host = $id("importer");
      if (!host) return;
      if (!state.importer.open) {
        host.classList.remove("on");
        return;
      }
      host.classList.add("on");
      const imp = state.importer;
      const kicker = $id("import-kicker");
      const title = $id("import-title");
      const body = $id("import-body");
      if (kicker) kicker.textContent = `扫描：${state.roots.join(" · ") || "E:\\AI · E:\\WORK"}`;
      if (title) title.textContent = "扫描已有项目";
      if (imp.loading) {
        body.innerHTML = `<div class="empty-note">正在扫描 ${esc(state.roots.join(" · "))}…</div>`;
      } else if (imp.error) {
        body.innerHTML = `<div class="empty-note">扫描失败：${esc(imp.error)}<br><br><button class="btn sm" data-action="import">重试</button></div>`;
      } else if (!imp.candidates.length) {
        body.innerHTML = `<div class="empty-note">没有发现候选项目。扫描根目录：${esc(state.roots.join(" · "))}。</div>`;
      } else {
        const rows = imp.candidates.map((c) => {
          const checked = imp.selected.has(c.path) ? "checked" : "";
          const disabled = c.registered ? "disabled" : "";
          const badges = c.registered
            ? '<span class="import-badge ok">已导入</span>'
            : '<span class="import-badge">未导入</span>';
          const pj = c.hasProjectJson
            ? '<span class="import-badge ok">有 project.json</span>'
            : '<span class="import-badge warn">需补作业</span>';
          const marks = (c.markers || []).map((m) => `<span class="import-badge">${esc(m)}</span>`).join("");
          const actions = [];
          if (!c.registered) actions.push(`<button class="btn sm" data-action="import-one" data-path="${escAttr(c.path)}">导入</button>`);
          if (c.hasProjectJson && c.registered) actions.push(`<button class="btn sm" data-action="import-open" data-path="${escAttr(c.path)}">打开</button>`);
          if (!c.hasProjectJson) actions.push(`<button class="btn sm" data-action="import-one" data-path="${escAttr(c.path)}" data-backfill="1">${c.registered ? "补作业" : "导入并补作业"}</button>`);
          return `<div class="import-row">
            <input type="checkbox" class="import-check" data-action="import-toggle" data-path="${escAttr(c.path)}" ${checked} ${disabled}>
            <div class="import-main">
              <div class="import-name">${esc(c.name)}</div>
              <div class="import-path">${esc(c.path)}</div>
              <div class="import-badges">${badges}${pj}${marks}</div>
            </div>
            <div class="import-actions">${actions.join("")}</div>
          </div>`;
        }).join("");
        body.innerHTML = `<div class="import-note">勾选后「导入选中」只登记，不派发。没有 project.json 的项目点「补作业」，派发 D2 让 AI 读现有文档生成项目卡。</div><div class="import-list">${rows}</div>`;
      }
      const all = $id("import-all");
      const sel = $id("import-selected");
      if (all) all.textContent = imp.selected.size && imp.selected.size === imp.candidates.filter((c) => !c.registered).length ? "取消全选" : "全选";
      if (sel) {
        sel.textContent = imp.selected.size ? `导入选中（${imp.selected.size}）` : "导入选中";
        sel.disabled = !imp.selected.size;
      }
    }

    async function importOne(path, backfill = false) {
      try {
        await api("/import", { method: "POST", body: JSON.stringify({ paths: [path] }) });
        await loadState();
        closeImport();
        if (backfill) {
          const data = await api(`/project?path=${encodeURIComponent(path)}&probe=1`);
          state.selected = path;
          state.detail = data.project;
          renderAll();
          await dispatchAction("import-backfill", data.project);
        } else {
          state.selected = path;
          await selectProject(path);
          toast("已导入");
        }
      } catch (error) {
        toast("导入失败：" + error.message);
      }
    }

    async function importSelected() {
      const paths = [...state.importer.selected];
      if (!paths.length) {
        toast("先勾选项目");
        return;
      }
      try {
        await api("/import", { method: "POST", body: JSON.stringify({ paths }) });
        state.importer.selected.clear();
        await loadState();
        toast(`已导入 ${paths.length} 个项目`);
        await openImport();
      } catch (error) {
        toast("导入失败：" + error.message);
      }
    }

    async function updateProject(action, payload = {}) {
      try {
        await api("/update", { method: "POST", body: JSON.stringify({ path: state.detail.path, action, payload }) });
        await loadState(true);
        await loadDetail();
      } catch (error) {
        toast("更新失败：" + error.message);
      }
    }

    /* ------------------------------ events ------------------------------ */
    async function onClick(event) {
      const el = event.target.closest("[data-action]");
      if (!el) return;
      const action = el.dataset.action;
      const p = state.detail;
      try {
        if (action === "select") {
          await selectProject(el.dataset.id);
          return;
        }
        if (action === "filter") {
          state.filter = el.dataset.filter;
          renderList();
          return;
        }
        if (action === "reload") {
          await loadState();
          return;
        }
        if (action === "import") {
          await openImport();
          return;
        }
        if (action === "import-close") {
          closeImport();
          return;
        }
        if (action === "import-toggle") {
          const pth = el.dataset.path;
          if (state.importer.selected.has(pth)) state.importer.selected.delete(pth);
          else state.importer.selected.add(pth);
          renderImport();
          return;
        }
        if (action === "import-select-all") {
          const unregistered = state.importer.candidates.filter((c) => !c.registered).map((c) => c.path);
          if (state.importer.selected.size === unregistered.length && unregistered.length) state.importer.selected.clear();
          else for (const pth of unregistered) state.importer.selected.add(pth);
          renderImport();
          return;
        }
        if (action === "import-selected") {
          await importSelected();
          return;
        }
        if (action === "import-one") {
          await importOne(el.dataset.path, el.dataset.backfill === "1");
          return;
        }
        if (action === "import-open") {
          closeImport();
          await selectProject(el.dataset.path);
          return;
        }
        if (action === "wiz-open") {
          openWizard(1);
          return;
        }
        if (action === "wiz-close") {
          closeWizard();
          return;
        }
        if (action === "wiz-kind") {
          saveWizardFields();
          wizard.data.kind = el.dataset.kind;
          renderWizard();
          return;
        }
        if (action === "wiz-pick-dir") {
          saveWizardFields();
          const ui = ctxRef.get("uiWorkspace");
          if (ui && typeof ui.pickDirectory === "function") {
            try {
              const dir = await ui.pickDirectory();
              if (dir) {
                wizard.data.dir = dir;
                renderWizard();
              }
            } catch (error) {
              toast("目录选择失败：" + error.message);
            }
          } else {
            toast("目录选择器不可用，直接填路径");
          }
          return;
        }
        if (action === "wiz-prev") {
          saveWizardFields();
          if (wizard.step > 1) {
            wizard.step--;
            renderWizard();
          }
          return;
        }
        if (action === "wiz-next") {
          saveWizardFields();
          const err = wizValidate();
          if (err) {
            toast(err);
            return;
          }
          if (wizard.step < 3) {
            wizard.step++;
            renderWizard();
          } else {
            await createWizardProject();
          }
          return;
        }
        if (action === "open-artifact") {
          if (!p) return;
          await openArtifact(el.dataset.key);
          return;
        }
        if (action === "open-doc") {
          await openDoc(el.dataset.rel);
          return;
        }
        if (action === "drawer-close") {
          closeDrawer();
          return;
        }
        if (action === "drawer-tab") {
          if (state.drawer) {
            state.drawer.tab = el.dataset.tab;
            renderDrawer();
          }
          return;
        }
        if (action === "drawer-copy") {
          if (state.drawer) {
            try {
              await navigator.clipboard.writeText(state.drawer.rel);
              toast("已复制路径");
            } catch {
              toast(state.drawer.rel);
            }
          }
          return;
        }
        if (action === "drawer-sidebar") {
          if (state.drawer) await openFile(state.drawer.rel);
          return;
        }
        if (action === "drawer-gen") {
          if (!p) return;
          await dispatchAction("artifact", p, { key: el.dataset.key, format: el.dataset.format });
          return;
        }
        if (action === "resume") {
          if (!p) return;
          await dispatchAction("resume", p);
          return;
        }
        if (action === "fill") {
          if (!p) return;
          await dispatchAction("fill", p);
          return;
        }
        if (action === "dispatch-todo") {
          if (!p) return;
          const todo = (p.todos || []).find((t) => t.id === el.dataset.id);
          if (todo) await dispatchAction("todo", p, { todo });
          return;
        }
        if (action === "review-stale") {
          if (!p) return;
          await dispatchAction("review", p);
          return;
        }
        if (action === "recheck") {
          await loadDetail();
          return;
        }
        if (action === "restore") {
          await updateProject("restore");
          return;
        }
        if (action === "ask-restore") {
          if (!p) return;
          openConfirm(
            p.archived ? "取消归档" : "恢复项目",
            p.archived
              ? `把「${p.name}」从已归档列表移回进行中？归档期间没有改过任何文件。`
              : `恢复「${p.name}」？会从当前版本和「下一步」继续。`,
            p.archived ? "取消归档" : "恢复",
            "restore",
            false,
          );
          return;
        }
        if (action === "add-todo") {
          if (!p) return;
          state.todoDraft = { open: true, title: "" };
          renderDetail();
          setTimeout(() => $id("todo-title")?.focus(), 0);
          return;
        }
        if (action === "todo-cancel") {
          state.todoDraft = { open: false, title: "" };
          renderDetail();
          return;
        }
        if (action === "todo-save") {
          const title = ($id("todo-title")?.value || "").trim();
          if (!title) {
            toast("先写待办标题");
            return;
          }
          state.todoDraft = { open: false, title: "" };
          await updateProject("addTodo", { title });
          return;
        }
        if (action === "promote") {
          if (!p) return;
          const idea = (p.ideas || []).find((it) => it.id === el.dataset.id);
          if (idea) await updateProject("promoteIdea", { title: idea.title, doc: idea.doc || "" });
          return;
        }
        if (action === "more") {
          if (!p) return;
          if (p.archived) {
            openConfirm("取消归档", `把「${p.name}」从已归档列表移回进行中？`, "取消归档", "restore", false);
          } else {
            openConfirm(
              "归档项目",
              `归档「${p.name}」后它只读：不能派发、不能改待办。随时可以从「已归档」恢复，文件不会删。`,
              "归档",
              "archive",
              true,
            );
          }
          return;
        }
        if (action === "confirm-close") {
          closeConfirm();
          return;
        }
        if (action === "confirm-ok") {
          const next = state.confirm.action;
          closeConfirm();
          if (next === "archive") await updateProject("archive");
          else if (next === "restore") await updateProject("restore");
          return;
        }
        if (action === "toast") {
          toast(el.dataset.msg || "");
        }
      } catch (error) {
        toast(error.message || String(error));
      }
    }

    function onInput(event) {
      const el = event.target;
      if (el.id === "q") {
        state.q = el.value;
        renderList();
        return;
      }
      if (el.id === "todo-title") {
        state.todoDraft.title = el.value;
        return;
      }
      if (el.dataset && el.dataset.wiz) wizard.data[el.dataset.wiz] = el.value;
    }

    function onKey(event) {
      if (event.key !== "Escape") return;
      if (state.confirm.open) {
        closeConfirm();
        return;
      }
      if (state.drawer) {
        closeDrawer();
        return;
      }
      if (state.importer.open) {
        closeImport();
        return;
      }
      if (wizard.open) {
        closeWizard();
      }
    }

    function renderAll() {
      renderList();
      renderDetail();
      renderDrawer();
      renderImport();
      renderConfirm();
      renderWizard();
    }

    /* ------------------------------ mount ------------------------------ */
    function boot(root, ctx) {
      if (root.__gpkBooted) return;
      root.__gpkBooted = true;
      shadow = root;
      ctxRef = ctx;
      const shell = document.createElement("div");
      shell.className = "gpk-shell";
      shell.innerHTML = SHELL;
      root.appendChild(shell);
      root.addEventListener("click", onClick);
      root.addEventListener("input", onInput);
      root.addEventListener("keydown", onKey);
      loadState();
    }

    function Panel({ ctx }) {
      const ref = React.useRef(null);
      React.useEffect(() => {
        const host = ref.current;
        if (!host) return;
        let root = host.shadowRoot;
        if (!root) {
          root = host.attachShadow({ mode: "open" });
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = STYLE;
          root.appendChild(link);
          boot(root, ctx);
        }
        return () => {
          // Shadow root goes away with the host element.
        };
      }, [ctx]);
      return h("div", { ref, style: { height: "100%", minHeight: 0 } });
    }

    function Icon() {
      return h("span", {
        style: { display: "grid", placeItems: "center", width: 18, height: 18 },
        dangerouslySetInnerHTML: { __html: ICON_GRID },
      });
    }

    function apply(ctx) {
      ctx.effect(function* () {
        yield ctx.slots.inject("main", () =>
          ctx.slots.register({ name: "main", key: PANEL_ID }, () => h(Panel, { ctx })),
        );
      }, "gd-product-kit: main page");
      ctx.effect(function* () {
        yield ctx.slots.inject("sidebar.panellist", () =>
          ctx.slots.register(
            { name: "sidebar.panellist", id: PANEL_ID, order: 41, label: "搞定产品设计包" },
            Icon,
          ),
        );
      }, "gd-product-kit: sidebar entry");
    }

    exports.name = "gd-product-kit";
    exports.inject = ["slots", "layout", "sessions", "workspaces", "uiWorkspace", "sidebarRight"];
    exports.apply = apply;
    return module.exports;
  },
});
