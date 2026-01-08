# Repo guide for AI coding agents

Purpose: 快速让 AI 代码助手在此仓库中高效工作，聚焦架构、运行流程、数据流与常见约定。

- **运行与构建**:
  - 开发: `npm run dev` (vite)
  - 生成类型并构建: `npm run build` (先 `vue-tsc -b` 然后 `vite build`)
  - 生成数据配置: `npm run gencfg`（执行 `tools/generate-config.ts`，需要 `tsx`）
  - 样式检查: `npm run lint:style` / `npm run lint:style:fix`

- **大体架构（为什么如此组织）**:
  - 前端是 Vue 3 + TypeScript + Vite，入口为 [src/main.ts](src/main.ts#L1-L20)。
  - 路由与视图按资源类型划分，见 [src/router/index.ts](src/router/index.ts#L1-L60)。
  - 数据为静态 JSON，部署在 `public/`（`public/config/*.json` 和 `public/translations.json`），由运行时通过 fetch 加载，加载逻辑集中在 [src/services/dataService.ts](src/services/dataService.ts#L1-L40)。
  - 配置常量如数据路径使用 `import.meta.env.BASE_URL`，封装在 [src/config/index.ts](src/config/index.ts#L1-L80)，注意 BASE_PATH 用于部署子路径（例如 `/acnh-catalog/`）。

- **关键数据流与集成点**:
  - JSON 数据 -> `public/config/*.json` -> `CONFIG.DATA_FILES` -> `dataService.load*` -> 组件的 composables（如 `useItemsData`）
  - 数据生成脚本在 `tools/`，修改或更新数据时优先查看 `tools/generate-config.ts` 与 `tools/generate-config-old.ts`。
  - 图片与图标通过绝对路径引用（例如 `/acnh-catalog/img/...`），注意在本地或 CI 中 BASE_URL 可能影响路径解析。

- **代码风格与约定（项目特有）**:
  - 使用 Composition API + 可重用 composables；入口导出在 [src/composables/index.ts](src/composables/index.ts#L1-L40)。
  - 类型定义集中在 `src/types`，许多枚举（ItemType/Color/Version 等）用于渲染和映射。
  - 视图组件放在 `src/views`，可复用卡片组件在 `src/components`（例如 `ItemCard.vue`、`ArtworkCard.vue`）。
  - 资源路径由 `CONFIG.DATA_FILES` 控制，直接修改组件中硬编码路径前请优先考虑更新 `CONFIG`。

- **编辑/添加数据或新类别的明确步骤（可直接执行）**:
 1. 在 `public/config/` 添加或更新对应 JSON（遵循现有字段）。
 2. 如需生成或合并源数据，运行 `npm run gencfg`（检查 `tools/generate-config.ts`）。
 3. 更新 `CONFIG.DATA_FILES`（若文件名或路径变化），参见 [src/config/index.ts](src/config/index.ts#L1-L40)。
 4. 若新增视图/路由，添加到 [src/router/index.ts](src/router/index.ts#L1-L60) 并在 `src/views` 下创建组件。

- **常见快速任务示例**:
  - 查找某类数据如何渲染：打开 [src/services/dataService.ts](src/services/dataService.ts#L1-L40) 与相应 `use*Data` composable。
  - 添加国际化词条：编辑 `public/translations.json` 并检查 `loadTranslations()` 在 `dataService` 的使用。

- **注意事项 / 限制**:
  - 没有测试套件配置（仓库无 `test` 脚本）——不可假设存在自动化单元测试。
  - 构建依赖 `vue-tsc` 做类型检查，修改大型类型可能导致 `npm run build` 失败。
  - 运行 `gencfg` 需要在 Node 环境中可执行 `tsx`（devDependency）。

如果有特定目标（添加新视图、修复数据映射、改进打包），告诉我具体任务，我会基于此指南进行下一步实现或生成 PR patch 并运行变更验证。
