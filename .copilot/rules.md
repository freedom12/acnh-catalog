# ACNH 目录项目的 GitHub Copilot 规则

此文件包含 GitHub Copilot 在这个动物森友会：新地平线目录项目中生成代码时应遵循的指南。

## 项目概述
- **框架**：Vue 3 配合 Composition API
- **语言**：TypeScript
- **构建工具**：Vite
- **样式**：CSS 模块和作用域样式
- **数据源**：`public/` 目录中的 JSON 文件

## 编码标准

### TypeScript
- 始终为所有新代码使用 TypeScript
- 在 `src/types/` 目录中定义接口和类型
- 使用严格类型；避免 `any` 类型
- 从 `src/types/index.ts` 导出类型

### Vue 组件
- 使用 Composition API (`<script setup lang="ts">`)
- 组件名称应为 PascalCase
- 文件名应为 PascalCase.vue
- 使用作用域样式 (`<style scoped>`)
- 从相对路径导入组件

### 组合函数
- 将可重用逻辑放在 `src/composables/`
- 为组合函数名称使用 `use` 前缀（例如，`useArtworkData`）
- 返回响应式 ref 和计算属性
- 处理加载状态和错误

### 数据管理
- 数据从 `public/` 目录中的 JSON 文件加载
- 使用 `fetch` 或 `import` 加载数据
- 在组合函数中缓存数据以避免重复加载
- 处理加载和错误状态

### 文件结构
- 组件：`src/components/`
- 视图/页面：`src/views/`
- 组合函数：`src/composables/`
- 类型：`src/types/`
- 工具：`src/utils/`
- 样式：`src/styles/`

### 命名约定
- 变量：camelCase
- 函数：camelCase
- 类/接口：PascalCase
- 文件：组件使用 PascalCase，其他使用 camelCase
- 常量：UPPER_SNAKE_CASE

### 导入
- 为项目文件使用相对导入
- 分组导入：外部库优先，然后是内部模块
- 如果配置了路径别名，请使用（例如，`@/` 表示 `src/`）

### 响应式状态
- 对基本值使用 `ref()`
- 对对象使用 `reactive()`
- 对派生状态使用 `computed()`
- 避免直接突变；使用方法

### 错误处理
- 始终在异步操作中处理潜在错误
- 提供用户友好的错误消息
- 在适当的地方使用 try-catch 块

### 性能
- 在可能的情况下对组件使用懒加载
- 为大数据集实现分页
- 通过适当使用 key 避免不必要的重新渲染

### 可访问性
- 添加适当的 ARIA 属性
- 确保键盘导航支持
- 为图像提供替代文本

### 测试
- 为组合函数和工具编写单元测试
- 使用 Vue Test Utils 进行组件测试
- 目标是良好的测试覆盖率

## 特定项目模式

### 卡片组件
- 为一致性扩展 `BaseCard.vue`
- 使用适当格式显示项目数据
- 包含悬停效果和过渡

### 过滤组件
- 使用带防抖的响应式过滤器
- 支持多个过滤条件
- 更新 URL 查询参数以实现可共享链接

### 网格布局
- 使用 `Grid.vue` 组件显示项目
- 实现响应式设计
- 支持不同卡片大小

### 分页
- 为大数据集使用 `Pagination.vue`
- 正确计算总页数
- 处理边界情况（第一页/最后一页）

## 代码生成指南
- 生成完整、功能性的代码
- 包含适当的错误处理
- 遵循项目中现有的代码风格
- 使用现有的工具和常量
- 避免生成重复代码
- 优先使用组合函数而不是内联逻辑

## 常量和文本
- 使用 `src/constants/index.ts` 中的常量
- 如果需要，支持国际化
- 保持 UI 文本集中化

请记住，在提交之前审查和测试所有生成的代码。