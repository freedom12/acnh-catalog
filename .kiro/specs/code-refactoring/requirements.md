# 需求文档

## 简介

本文档定义了 ACNH 目录应用的代码重构需求。该应用使用 Vue 3 + TypeScript + SCSS 构建，当前存在大量重复代码和组织不当的问题。本次重构旨在提高代码可维护性、减少重复、改善项目结构，同时保持向后兼容性和现有功能行为不变。

## 术语表

- **Composable**: Vue 3 组合式 API 中的可复用逻辑函数
- **DataLoader**: 通用数据加载器，封装加载状态、错误处理、缓存和 Promise 去重逻辑
- **DetailRow**: 卡片组件中用于显示标签-值对的行组件
- **枚举工厂**: 用于批量创建类型安全枚举的工厂函数
- **7-1 架构**: SCSS 项目组织模式，包含 7 个文件夹和 1 个主入口文件
- **映射表**: 将枚举值映射到显示名称或图标路径的对象

## 需求

### 需求 1：Composables 数据加载重构

**用户故事：** 作为开发者，我希望有一个通用的数据加载工厂函数，以便减少 12+ 个数据加载 composables 中的重复代码。

#### 验收标准

1. THE DataLoader_Factory SHALL 提供 `useDataLoader<T>` 泛型工厂函数
2. WHEN 使用 DataLoader_Factory 创建数据加载器时，THE DataLoader_Factory SHALL 通过 status ref 管理加载状态（idle/loading/success/error）
3. WHEN 数据加载失败时，THE DataLoader_Factory SHALL 设置 status 为 'error' 并在 error ref 中存储错误信息
4. WHEN 多次调用同一数据加载器的 loadData 方法时，THE DataLoader_Factory SHALL 实现 Promise 去重，避免重复请求
5. WHEN 数据已加载完成后再次调用 loadData 时，THE DataLoader_Factory SHALL 直接返回缓存数据，不发起新请求
6. IF 数据加载失败，THEN THE DataLoader_Factory SHALL 重置加载状态，允许重试
7. THE DataLoader_Factory SHALL 支持可选的 ID 映射表生成功能，通过 getIds 函数返回主 ID 和额外 ID 数组
8. THE DataLoader_Factory SHALL 支持可选的数据转换函数
9. WHEN 重构完成后，THE System SHALL 保持所有现有 composables 的公开 API 不变

### 需求 2：卡片组件 DetailRow 抽象

**用户故事：** 作为开发者，我希望有一个统一的 DetailRow 组件，以便减少 10+ 个卡片组件中重复的详情行渲染逻辑。

#### 验收标准

1. THE DetailRow_Component SHALL 接受 label（标签）属性用于显示行标签，支持文本和 HTML（以 '<' 开头自动识别）
2. THE DetailRow_Component SHALL 接受 value 属性用于显示行内容，支持文本和 HTML（以 '<' 开头自动识别）
3. THE DetailRow_Component SHALL 支持 layout 属性用于设置布局模式（default/full/center）
4. THE DetailRow_Component SHALL 支持 variant 属性用于设置样式变体（default/highlight）
5. THE DetailRow_Component SHALL 支持默认插槽用于自定义内容渲染
5. THE InlineIcon_Component SHALL 作为独立组件处理图标渲染，支持 src、alt、title、gray、size 属性
6. WHEN 重构完成后，THE System SHALL 保持所有卡片组件的视觉外观不变

### 需求 3：类型定义枚举工厂

**用户故事：** 作为开发者，我希望有一个枚举工厂函数，以便简化 `src/types/item.ts` 中 13 个重复模式的枚举定义。

#### 验收标准

1. THE Enum_Factory SHALL 提供 `createEnum` 函数用于创建类型安全的枚举对象
2. WHEN 使用 createEnum 创建枚举时，THE Enum_Factory SHALL 生成 `as const` 类型的对象
3. THE Enum_Factory SHALL 自动生成对应的 TypeScript 类型定义
4. THE Enum_Factory SHALL 支持数字值枚举（从 1 开始递增）
5. THE Enum_Factory SHALL 支持自定义起始值
6. WHEN 重构完成后，THE System SHALL 保持所有枚举的值和类型兼容性

### 需求 4：数据服务拆分

**用户故事：** 作为开发者，我希望将超过 1000 行的 `dataService.ts` 拆分为更小的模块，以便提高代码可维护性和可读性。

#### 验收标准

1. THE DataService_Refactor SHALL 创建 `services/mappings/` 目录存放所有名称映射表
2. THE DataService_Refactor SHALL 创建 `services/formatters/` 目录存放所有格式化函数
3. THE DataService_Refactor SHALL 将 20+ 个名称映射表（如 ItemTypeNameMap、versionNameMap 等）移至 mappings 目录
4. THE DataService_Refactor SHALL 将格式化函数（如 getPriceWithIcon、getSizeWithIcon 等）移至 formatters 目录
5. THE DataService_Refactor SHALL 保留数据加载函数在主 dataService.ts 中
6. THE DataService_Refactor SHALL 通过 index.ts 重新导出所有公开 API
7. WHEN 重构完成后，THE System SHALL 保持所有现有导入路径的向后兼容性

### 需求 5：样式组织优化

**用户故事：** 作为开发者，我希望整合重叠的样式文件，以便完善 7-1 架构的样式分层。

#### 验收标准

1. THE Style_Refactor SHALL 分析 card-styles.scss、view-styles.scss、style.scss 之间的重叠
2. THE Style_Refactor SHALL 将重复样式整合到 7-1 架构的对应目录中
3. THE Style_Refactor SHALL 确保 main.scss 作为唯一的全局样式入口
4. THE Style_Refactor SHALL 保留 card-styles.scss 和 view-styles.scss 作为组件级别的样式入口
5. THE Style_Refactor SHALL 移除 style.scss 中的冗余内容，仅保留必要的向后兼容导出
6. WHEN 重构完成后，THE System SHALL 保持所有组件的视觉外观不变
7. THE Style_Refactor SHALL 确保所有样式文件遵循 7-1 架构的命名和组织规范
