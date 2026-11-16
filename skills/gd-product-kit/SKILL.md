---
name: gd-product-kit
description: 搞定产品设计包的「派发后怎么干活」说明。插件里的按钮派发过来（新建项目、补作业、继续做、派发待办、一键补充、生成单份产出、生成 HTML 阅读版、回顾过期数据）时使用；也用于按五件套模板推进调研分析（含需求池）、PRD、线框图、设计规范与工作区整理。动作以 `[gd-product-kit · <action>]` 标记区分。
---

# gd-product-kit · 派发后怎么干活

## 0 这个 Skill 是什么

- **插件负责壳和按钮，Skill 负责被派发之后怎么干活。**
- 《按钮与派发规格》是**契约**：动作 id、上下文包、产出、回写字段都以它为准。本文不复述契约，只写"怎么执行"。
- 每次派发的 prompt 开头带 `[gd-product-kit · <action>]` 标记。先看标记，再照下面第 2 节对应动作走。
- 契约原文：`docs/按钮与派发规格.md`（插件仓库内，不在项目里）。
- 完整提示词：`references/prompts.md`；`.gd/project.json` 字段：`references/schema.md`。

## 1 通用规则（每个动作都适用）

1. **先读 `.gd/project.json`**：里面有版本、状态、目标、下一步、待办、产物路径。没有它就退回去找用户，不要凭空开工。
2. **区分三种东西**：资料（有出处的）、推断（从现有文件推出来的）、假设（还没验证的）。产出里分开写，推断要注明"依据哪个文件"。
3. **不编造**：不编访谈、不编用户原话、不编数字、不编没做过的验证。找不到依据就写 `TODO: 待补`，并说明缺什么。
4. **不覆盖已有文件**：只补缺的、只改这次该改的。要改别人写过的段落，先说明改哪几行、为什么。
5. **一次只做一个动作**：做完这次派发的事就停，不顺手做别的动作、不顺手改其它文档。
6. **可交付的文件同时给 MD + HTML**：MD 是源文，HTML 是阅读版（套 `templates/artifact.html`）；无 HTML 不算完成。
7. **完成后回写 `.gd/project.json`**：只改这次涉及到的字段（`artifacts` / `next` / `todos` / `updatedAt` / `updatedBy`），不动无关字段。
8. **结尾给一句人话总结**：做了什么、还缺什么、需要人拍板什么（最多 5 行）。

## 2 动作目录

> 每个动作只写六件事：触发 / 读什么 / 做什么 / 产出 / 回写 / 禁止。提示词不在这里重复。

### D1 新建项目 · 第一个会话

- **触发**：`[gd-product-kit · new-project]`，向导「创建并开始」之后。
- **读什么**：`.gd/project.json`、`AGENTS.md`、`docs/调研分析.md`（向导已填 §1–§5：给谁用、背景、最麻烦的一件事、现在怎么应付、想要的结果）。
- **做什么**：按 `templates/调研分析.md` 补全 §6 需求池——先概括用户/场景/困难/现有办法/目标，再定第一版核心任务与完整过程，再列需求（问题、结果、解法、验收、优先级、理由、假设），最后写范围、限制、试用计划。已有信息不重问，只问缺失的，最多 2 个问题。
- **产出**：`docs/调研分析.md`（只改 §6，不动 §1–§5）+ `docs/调研分析.html`。
- **回写**：`artifacts.demand`、`version.next`、`updatedAt`、`updatedBy`。
- **禁止**：不写 PRD、线框图、设计规范；不改 §1–§5；不把 P0 全塞满；不编访谈。

### D2 导入项目 · 补作业

- **触发**：`[gd-product-kit · import-backfill]`，导入流程确认后。
- **读什么**：`README`、`docs/` 下的文档、版本记录、发布清单、点子池、`git log -30`。
- **做什么**：把现状汇总成 `project.json` 的初稿：名称/类型/一句话、版本（从版本记录或 package.json 推断，没有就 `v0.1` + 构思）、`release.url`、五件套路径（没有就 `null`；旧项目只有 `需求调研.md` 就指到它）、待办与点子（保留原文件链接）、一句 `next`。
- **产出**：`.gd/project.json`；不改任何已有文档。
- **回写**：全量初始化 + `updatedAt` / `updatedBy`。
- **禁止**：不生成、不修改五件套正文；推断结果要列依据（哪条来自哪个文件），等人确认。

### D3 继续做 / 恢复并继续

- **触发**：`[gd-product-kit · resume]`。
- **读什么**：`project.json`（版本、goal、next、待办、卡点）+ 相关文档。
- **做什么**：先用 5 行以内回答三件事——现在卡在哪、建议先做哪件、需要人拍板什么。**等人确认再动手。**
- **产出**：这次只产出一段判断，不产出文件。
- **回写**：暂无（确认开工后再按 D4 的方式回写）。
- **禁止**：一上来就改文件；一次改多个文件；跳过版本目标自己另起方向。

### D4 派发一条待办

- **触发**：`[gd-product-kit · todo]`。
- **读什么**：`project.json` + 这条待办 + `todo.doc` 指向的文档。
- **做什么**：先复述验收标准（3 行内）→ 列文件级改动清单 → 等人确认 → 只做这一条 → 更新状态 `todo → doing → done`。
- **产出**：这条待办涉及的文件改动；需要文档变更的同步改文档。
- **回写**：`todos[]` 里这条的 `state`、`version.next`、`updatedAt`。
- **禁止**：不顺手做其它待办；不改无关文档；验收标准说不清就先问，不要猜着做。

### D5 一键补充缺失产出

- **触发**：`[gd-product-kit · fill-artifacts]`。
- **读什么**：缺失清单（文件 + 缺 md / html）、现有文档、git、代码。
- **做什么**：按 `templates/` 里对应模板补齐——缺 MD 从现有资料提取（调研分析的需求池优先从现有需求调研 / PRD / 版本记录 / 点子池提取），没依据的段落写 `TODO: 待补`；缺 HTML 用同名 MD 生成阅读版。
- **产出**：缺失的 MD / HTML，成对产出。
- **回写**：`artifacts` 各路径、`updatedAt`。
- **禁止**：不覆盖已有文件；不为了凑齐而编内容；不趁机改写已有条目。

### D6 生成单份产出（MD 与 HTML 都缺）

- **触发**：`[gd-product-kit · artifact]`。
- **读什么**：该产出在项目里的依据文件（调研分析 / PRD / 线框图 / 设计规范）。
- **做什么**：按 `templates/<file>.md` 的结构写正文，同时产出 HTML 阅读版（套 `templates/artifact.html`）；结构不够用可以加小节，但六节/五块的主体不要删。
- **产出**：`docs/<file>.md` + `docs/<file>.html`。
- **回写**：`artifacts` 对应项、`version.next`、`updatedAt`。
- **禁止**：不编造依据；不跨文档复制案例；不把长文写成几十页。

### D7 把 MD 生成 HTML 阅读版

- **触发**：`[gd-product-kit · artifact-html]`，只有 MD 时。
- **读什么**：`docs/<file>.md`（内容以它为准）+ `templates/artifact.html`。
- **做什么**：把 MD 转成同名单文件 HTML，保留标题层级、表格、代码块、引用，填好标题、meta、目录锚点。
- **产出**：`docs/<file>.html`。
- **回写**：`artifacts` 里这一项的 `html`、`updatedAt`。
- **禁止**：只做这一份；不改 MD；不改其它文件；不引入外部 CSS/JS/字体。

### D8 数据过期 · 回顾

- **触发**：`[gd-product-kit · review-stale]`。
- **读什么**：`project.json`、`git log`（since `updatedAt`）、最近会话标题。
- **做什么**：给一份 10 行以内的更新建议——哪些待办已完成、哪些提交没记进版本、`next` 该改成什么。
- **产出**：建议文本，先不落盘。
- **回写**：暂无；人确认后再改 `todos` / `version` / `next`。
- **禁止**：先不动 `project.json`；不自动改版本号；不把建议直接当结论写进文档。

## 3 模板路径

模板在插件根目录 `templates/`（相对本 Skill 为 `../../templates/`）。新建项目时复制，升级时只补缺、不覆盖。

| 产出 | 模板 | 项目内默认路径 |
|---|---|---|
| 调研分析（含需求池） | `templates/调研分析.md` | `docs/调研分析.md` |
| PRD | `templates/prd.md` | `docs/PRD.md` |
| 线框图 | `templates/wireframe.html` + 页面清单 | `docs/线框图.html` / `docs/线框图.md` |
| 设计规范 | `templates/design.md` | `docs/设计规范.md` |
| 工作区整理 | `templates/AGENTS.md` | `AGENTS.md` |
| HTML 阅读版外壳 | `templates/artifact.html` | `docs/<同名>.html` |
| 发布清单（可选） | `templates/发布清单.md` | `docs/发布清单.md` |
| 开发计划（可选） | `templates/PLAN.md` | `PLAN.md` |
| 项目说明（可选） | `templates/README.md` | `README.md` |
| 验收记录（可选） | `templates/验收记录.md` | `docs/验收记录.md` |

## 4 边界

- 不自己调模型、不自己发消息、不自己改版本号或发布地址。
- 不把文档正文塞进 `project.json`，只存路径。
- 不动 `.gd/` 之外的插件配置；不删项目文件，删除类操作交给人。
- `archived` 项目只读；`paused` 项目只做"恢复并继续"。
- 项目内 `AGENTS.md` 与本文冲突时，以项目内的约定为准（但"不编造、不覆盖"两条不能让）。
