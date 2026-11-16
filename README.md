# gd-product-kit

DSH 插件：**搞定产品设计包 · VibeCoding 项目工作台**。

> 开源仓库：https://github.com/Alpha961/gd-product-kit ｜ MIT

左侧栏一个入口，进去是项目列表；点开一个项目，是它的版本卡、五件套、待办、点子、体检和动态。新建项目时按 3 步向导生成调研分析和五件套模板；关键动作派发到项目自己的工作区，开新会话完成。

> 插件负责壳和按钮，Skill 负责“派发之后怎么干活”。两者之间的契约见 `docs/按钮与派发规格.md`。

## 安装

已经装进本机 web profile：

```powershell
dsh plugin --profile web add link:E:/WORK/gd-product-kit
```

装完**重启一次 `dsh web`**（宿主路由和客户端入口都要重新加载；只刷新页面不一定够）。重启后左侧栏出现「搞定产品设计包」。之后改 `lib/` 里的代码也要重启。

`dsh` 不在 PATH 时，用本机 npx 缓存里的：

```powershell
& "C:\Users\Mayn\AppData\Local\npm-cache\_npx\1e7f6d9597241db0\node_modules\.bin\dsh.cmd" plugin --profile web add link:E:/WORK/gd-product-kit
```

## 打开

刷新 Web GUI → 左侧栏「搞定产品设计包」→ 主区工作台。

- 第一次打开会读 `~/.dsh/storages/gd-product-kit/registry.json`。
- 默认扫描 `E:\AI`、`E:\WORK`；「导入项目」会列出候选，勾选导入。没有 `.gd/project.json` 的项目点「补作业」，派发 D2 让 AI 读现有文档生成项目卡。
- 铺板快算已映射：`E:\AI\铺板快算\.gd\project.json`。

## 数据放哪

| 数据 | 位置 |
|---|---|
| 项目状态（单一真相） | `<项目>/.gd/project.json` |
| 五件套 | `<项目>/docs/` + `AGENTS.md` |
| 项目目录索引 | `~/.dsh/storages/gd-product-kit/registry.json` |
| 插件宿主接口 | `/gd-product-kit/api/*` |
| 项目图片等静态文件 | `/gd-product-kit/files?path=...&rel=...`（只放行图片/字体/CSS） |
| 面板样式 | `/gd-product-kit/static/style.css` |

## 目录

```
lib/
  index.js       宿主半：webServer API、静态样式
  project.js     项目读取 / 创建 / 更新 / 五件套发现 / git / 发布地址探测
  registry.js    项目目录注册与扫描
  client.js      浏览器半：左栏入口 + 主区工作台（shadow DOM + 现有 CSS）
  style.css      工作台样式
templates/       五件套 + 4 个可选模板
skills/          gd-product-kit 的 SKILL.md + prompts/schema
docs/            按钮与派发规格、课程 2.0 模板清单
mock/            设计阶段 HTML 样板（六件套时期，仅供对照，不是运行时依赖）
mock/shots/      设计样板截图（不含真实数据）
```

## 现在能做什么

- 项目列表：全部 / 进行中 / 暂停 / 已归档，搜索，切换。
- 导入项目：扫描根目录 → 勾选导入；没有 project.json 的走「补作业」D2。
- 版本卡：版本号、状态、发布轨道、下一步。
- 五件套：已有格式绿标签、缺失灰色文字；点行打开抽屉，HTML / MD 两个 tab；「一键补充」派发 D5；HTML 里的相对图片通过 `/files` 路由重写。
- 待办：派发 D4、打开关联文档、内联表单追加待办。
- 点子：升为待办、打开点子池。
- 体检：重新体检、发布地址检测、卡点计数。
- 新建项目：3 步 10 字段（5 个必填）→ 目录可用 DSH 原生目录选择器 → 生成 `.gd/project.json`、已填调研分析（§1–§5）、PRD/线框图/设计规范/AGENTS + 4 个可选模板 → 派发 D1 补全 §6 需求池。
- 继续做：派发 D3，新会话带版本目标、next、待办/卡点、五件套路径。
- 数据过期：派发 D8 回顾最近提交。
- 归档 / 恢复、更新 project.json 的 todo / idea。
- 派发总是：当前选中项目目录 → 有工作区就复用，没有就 `workspaces.create` → 新会话 → `uiWorkspace.openSession`。

## v0.2 变化（2026-11-16）

- **六件套 → 五件套**：「需求调研」与「需求池」合并成一份 `docs/调研分析.md`（§1–§5 讲人，§6 讲需求池），对外五份产出：调研分析 / PRD / 线框图 / 设计规范 / 工作区整理。
- **D1 改为补全 §6**：向导仍只填 §1–§5；「创建并开始」派发 D1 补全需求池，不动已写的人的部分。
- **D5 的提取口径**：调研分析的需求池优先从现有需求调研 / PRD / 版本记录 / 点子池提取，不重新生成、不编造。
- **模板**：新增 `templates/调研分析.md`；移除 `demand.md` / `backlog.md`。旧项目的 `需求调研.md` 仍可被识别（兼容）。
- **数据迁移**：铺板快算已按新口径生成 `docs/调研分析.md`、`docs/调研分析.html`，project.json 的 `artifacts.demand` 指向它。

## 流程测试（2026-11-16）

用一个虚构产品「装修账本」（`E:\WORK\装修账本`，有 README、访谈记录、报价表、版本记录，没有 `.gd`）跑了一遍：

1. **D2 补作业**：读现有文档 → 写出 `.gd/project.json`（名称 / 类型 / v0.3.1 开发中 / 5 个产物路径留空 / 3 条待办 / 2 个点子 / 版本历史）。
2. **D5 一键补充**：按五件套模板从现有文档提取 → 生成 `调研分析.md`（含 §6 需求池）、`PRD.md`、`线框图.md/.html`、`设计规范.md`、`AGENTS.md`，并用 `artifact.html` 壳生成 4 份 HTML 阅读版。
3. **校验**：`readProjectState` 返回 5/5 MD、5/5 HTML，版本卡、待办、点子、体检计数正常。
4. **顺手修**：模板线框图图例的色块 `display:inline-block`（之前图例显示成细线）。

结果记录见 `docs/流程测试-2026-11-16.md`。

## 已知限制（v0.2）

1. **「在 DSH 侧栏打开」需要会话表面**：全局面板下 `sidebarRight.openResource` 会报 `no session surface is mounted`；所以五件套先用面板内的抽屉预览，抽屉底部的「在 DSH 侧栏打开」只在会话选中的情况下可用。
2. **HTML 阅读版的资源**：`img[src]` / `srcset` / `<style>` / 元素 `style` 属性 / 本地 `<link rel="stylesheet">` 里的相对路径都已重写；本地 CSS 会被拉取内联，`url()` 按 CSS 文件目录重写。CSS `@import` 还没处理。
3. **D2 的真实派发**：流程已用虚构项目在脚本层跑通；在面板里点「补作业」派发到新会话的那一步，要重启 DSH 后再点一次才算真验证。
4. **五件套的 HTML 依赖 AI 生成**：D5 / D7 按模板产出 HTML，没有内置的 MD→HTML 编译器；测试时用了一个临时脚本转换（未入库）。
5. **客户端改动要重启 DSH**（或重新安装/刷新）；npx 安装没有 client HMR。
6. 测试时创建过 `.test-wizard` 工作区，项目目录和该工作区已删；铺板快算下留了两个 `gd · 铺板快算 · 继续做` 测试会话，可以删或忽略。

## 验证

- 宿主 API：`GET /gd-product-kit/api/health`、`/api/state`、`/api/project?path=...&probe=1`、`/api/scan`、`/api/artifact`、`/api/doc`。
- 真实 DSH：3081 临时实例已跑通左栏入口、项目页、五件套抽屉、新建向导、继续做派发；设计样板截图在 `mock/shots/`（真实运行截图含本机工作区信息，不入公开仓库）。
- 五件套模型：`node` 直接 import `lib/project.js` 校验 `readProjectState`（装修账本 5/5、铺板快算 5/5）；`createProject` 生成的模板清单已核对。
- 测试会话：验证派发时在「铺板快算」下生成过 `gd · 铺板快算 · 继续做`，可以删除或忽略。
- 验证时创建过 `.test-wizard` 工作区，项目目录已删；可在左侧栏右键删除该工作区。

## 开源

按 2026-11-16 的决定直接开源，许可证 MIT（`LICENSE`）。发布前还要：

1. 过一遍 `mock/shots/` 截图和 `docs/课程2.0-模板清单.md`，确认没有不适合公开的内容；
2. `git init` → 建公开仓库（建议 `Alpha961/gd-product-kit`）→ push；
3. 发版前重启 DSH，在面板里把「导入 → 补作业 → 一键补充」真实点一遍。
