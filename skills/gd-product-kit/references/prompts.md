# 派发提示词 · D1–D8

> 这份文件是《按钮与派发规格.md》第 4 节的原样拷贝，插件派发时用的就是这里的文本。
> **提示词改动以本文为准**：要改提示词，改这里，再回写规格文档；两边不一致时以本文为准。
> 动作的执行流程（读什么、产出、回写、禁止）见 SKILL.md 第 2 节；本文只放提示词。

## 4. 派发动作与提示词

> 下面所有 `{{...}}` 由插件填入；`<...>` 是说明，不进入 prompt。
> 每个 prompt 开头带动作标记，方便 Skill 路由和用户回看。

### D1｜新建项目 · 第一个会话（B35）

- **目标工作区**：新建项目目录（创建完成后）。
- **上下文**：向导已填的 `调研分析.md`（§1–§5）、新建的 `project.json`、`AGENTS.md`、§6 需求池空骨架。
- **提示词**：

```text
[gd-product-kit · new-project]
项目：{{name}}（{{kind}}）
目录：{{path}}
第一版核心任务：{{version.goal}}

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
完成后更新 .gd/project.json 的 artifacts 和 next，并告诉我 P0 有几条、需要我拍板什么。
```

- **产出**：`docs/调研分析.md`（只改 §6）`/.html`；`project.json.artifacts` / `next` 更新。
- **UI 回写**：五件套「调研分析」变绿；`next` 显示在版本卡；P0 条数回到会话里由人确认。

### D2｜导入项目 · 补作业（B38）

- **目标工作区**：被导入项目目录。
- **上下文**：现有 `README`、`docs/`、版本记录、发布清单、点子池、`git log -30`。
- **提示词**：

```text
[gd-product-kit · import-backfill]
项目：{{name}}
目录：{{path}}

读现有材料：README、docs/ 下的文档、版本记录、发布清单、点子池、git log 最近 30 条。
把现状汇总成 .gd/project.json：
- name / kind / 一句话
- version：从版本记录或 package.json 推断；没有就 v0.1 + 构思
- release.url：从发布清单或 README 找
- artifacts：五件套对应路径；没有就 null
- todos / ideas：从点子池、TODO、发布清单提取，保留原文件链接
- next：根据最近提交和未完成项给一句建议
只写 .gd/project.json，不改任何已有文档。
最后用 10 行列出你的推断依据（哪一条来自哪个文件），等我确认。
```

- **产出**：`project.json` 初次生成；不生成/不修改五件套正文。
- **UI 回写**：项目卡、版本卡、待办、五件套状态出现；缺失项走“一键补充”。

### D3｜继续做 / 恢复并继续（B08）

- **目标工作区**：当前项目目录。
- **上下文**：版本、goal、next、未完成待办、卡点、五件套路径。
- **提示词**：

```text
[gd-product-kit · resume]
继续项目：{{name}}（{{path}}）
当前版本：{{version.label}} · {{version.state}}
版本目标：{{version.goal}}
下一步：{{version.next}}
未完成待办：{{todos}}
卡点：{{blockers}}
五件套：{{artifact paths}}

先读 .gd/project.json 和相关文档，用 5 行以内回答：
1. 现在卡在哪；
2. 建议先做哪一件；
3. 需要我拍板什么。
我确认后再动手；不要一次改多个文件。
```

- **暂停项目**：先本地写 `state=开发中`，再派发同一 prompt。
- **产出**：先判断，不直接改文件；用户确认后再执行。

### D4｜派发一条待办（B12）

- **目标工作区**：当前项目目录。
- **上下文**：这条待办、所属版本、关联文档。
- **提示词**：

```text
[gd-product-kit · todo]
项目：{{name}}（{{path}}）
执行待办：{{todo.title}}
所属版本：{{version.label}} · {{version.state}}
版本目标：{{version.goal}}
关联文档：{{todo.doc}}

先读 .gd/project.json 和关联文档，然后：
1. 复述你理解的验收标准（3 行内）；
2. 列改动清单（文件级）；
3. 我确认后再改；完成后更新 project.json 里这条待办的状态和 next。
不要顺手做其它待办。
```

- **产出**：待办状态 `todo → doing → done`；需要文档变更的，同步更新。
- **UI 回写**：派发后按钮 loading；`project.json.todos[]` 更新后卡片变色。

### D5｜一键补充（B11）

- **目标工作区**：当前项目目录。
- **上下文**：缺失清单（文件 + 缺 md/html），已有文件不动。
- **提示词**：

```text
[gd-product-kit · fill-artifacts]
项目：{{name}}（{{path}}）
当前版本：{{version.label}} · {{version.state}}
缺失清单：{{list：文件 + 缺 md / html}}

按模板补齐，不覆盖已有内容：
- 缺 md：从现有文档 / git / 代码里提取（调研分析的需求池优先从现有需求调研 / PRD / 版本记录 / 点子池提取），找不到依据的段落写「TODO: 待补」；
- 缺 html：把同名 md 生成 HTML 阅读版，套 templates/artifact.html；
- 每份产出同时保留 .md 和 .html。

完成后更新 .gd/project.json 的 artifacts，并列出补了哪些、哪些留 TODO。
```

- **产出**：缺失文件；`project.json.artifacts` 更新。
- **UI 回写**：绿色标签出现；体检里的计数变绿。

### D6｜生成单份产出（B30，两份都缺）

- **目标工作区**：当前项目目录。
- **上下文**：该产出在项目里的相关文件（PRD、线框图、规范等）。
- **提示词**：

```text
[gd-product-kit · artifact]
项目：{{name}}（{{path}}）
产出：{{artifact.title}}
输出：docs/{{file}}.md 和 docs/{{file}}.html
依据：{{related files}}

按 templates/{{file}}.md 的结构写，同时产出 HTML 阅读版（套 templates/artifact.html）。
不要编造；找不到依据的段落写「TODO: 待补」。
完成后更新 .gd/project.json 的 artifacts 和 next。
```

### D7｜把 MD 生成 HTML（B30，只有 MD）

- **目标工作区**：当前项目目录。
- **提示词**：

```text
[gd-product-kit · artifact-html]
项目：{{name}}（{{path}}）
把 docs/{{file}}.md 生成 docs/{{file}}.html。
要求：套 templates/artifact.html；保留标题层级、表格、代码块；相对链接不改；内容以 md 为准。
只做这一份，不改 md，不改其它文件。
```

### D8｜数据过期 · 回顾（B21）

- **目标工作区**：当前项目目录。
- **提示词**：

```text
[gd-product-kit · review-stale]
项目：{{name}}（{{path}}）
.gd/project.json 最后更新：{{updatedAt}}；之后有 {{n}} 条提交。

读 project.json、git log（since {{updatedAt}}）、最近会话标题，给一份 10 行以内的更新建议：
- 哪些待办已经完成；
- 哪些提交没有记进版本；
- next 应该改成什么。
先只给建议，不要写 project.json；我确认后再更新。
```
