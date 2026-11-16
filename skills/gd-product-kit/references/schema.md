# .gd/project.json 最小字段

> 来源：《按钮与派发规格.md》第 6 节，原样收录。
> 用途：project.json 是版本、待办、产物路径的唯一来源；五件套和体检状态不写进来，由文件系统实时推导。

## 6. `.gd/project.json` 最小字段

```json
{
  "schemaVersion": 1,
  "name": "铺板快算",
  "kind": "微信小程序",
  "version": {
    "label": "v1.2.0",
    "state": "提审中",
    "goal": "6 个新计算器上架",
    "next": "真机检查 → 补发布清单 → 提审",
    "track": [
      { "name": "代码", "status": "done" },
      { "name": "体验版", "status": "done" },
      { "name": "提审", "status": "done" },
      { "name": "审核", "status": "active" },
      { "name": "发布", "status": "todo" }
    ]
  },
  "release": {
    "url": ""
  },
  "artifacts": {
    "demand": { "md": "docs/调研分析.md", "html": "docs/调研分析.html" },
    "prd": { "md": "docs/PRD.md", "html": "docs/PRD.html" },
    "wireframe": { "md": "docs/线框图.md", "html": "docs/线框图.html" },
    "design": { "md": "docs/设计规范.md", "html": "docs/设计规范.html" },
    "agents": { "md": "AGENTS.md", "html": "AGENTS.html" }
  },
  "todos": [
    { "id": "t1", "title": "真机检查 1.2.0", "state": "doing", "doc": "docs/发布清单.md" }
  ],
  "ideas": [
    { "id": "R1", "title": "细胞系库", "doc": "docs/产品迭代/点子池.md" }
  ],
  "updatedAt": "2026-11-13T18:00:00+08:00",
  "updatedBy": "ai"
}
```

- `version.goal` 不在卡片上显示，但派发时要用。
- `version.next` 显示在版本卡，是“下一步”的唯一来源。
- `state` 枚举：`构思 / 开发中 / 提审中 / 已上线 / 暂停`。
- `track[].status`：`done / active / todo`。
- `release.url` 是唯一写进项目文件的发布信息；`probe` / `lastCheckedAt` 只存在插件内存，不落盘。
- 五件套 + 体检的状态由文件系统实时推导，不存进 `project.json`。
