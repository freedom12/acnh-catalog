# 实现计划：代码重构

## 概述

本实现计划将 ACNH 目录应用的代码重构分解为可执行的任务。重构按照依赖关系排序，确保每个任务都能在前置任务完成后独立执行。

## 任务

- [x] 1. 创建通用数据加载工厂函数
  - [x] 1.1 创建 `src/composables/core/useDataLoader.ts`
    - 实现 `createDataLoader<T, R>` 工厂函数
    - 实现 `LoadingStatus` 类型和状态管理
    - 实现 Promise 去重和缓存逻辑
    - 实现 `getIds` ID 映射表生成
    - 实现 `transform` 数据转换
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [ ]* 1.2 编写 useDataLoader 属性测试
    - **Property 1: DataLoader 状态转换正确性**
    - **Property 2: DataLoader 请求去重和缓存**
    - **Property 3: DataLoader 错误恢复**
    - **Property 4: DataLoader ID 映射表生成**
    - **Property 5: DataLoader 数据转换**
    - **Validates: Requirements 1.2-1.8**

  - [x] 1.3 重构 `useCreaturesData.ts` 使用 useDataLoader
    - 作为第一个迁移示例，验证工厂函数可用性
    - 保持公开 API 不变
    - _Requirements: 1.9_

  - [x] 1.4 重构其他数据加载 composables
    - 重构 `useAchievementsData.ts`
    - 重构 `useRecipesData.ts`
    - 重构 `useMusicData.ts`
    - 重构 `useVillagersData.ts`
    - 重构 `useArtworkData.ts`
    - 重构 `useFossilsData.ts`
    - 重构 `useNPCsData.ts`
    - 重构 `usePlantsData.ts`
    - 重构 `useReactionsData.ts`
    - 重构 `useConstructionData.ts`
    - 重构 `useMessageCardsData.ts`
    - _Requirements: 1.9_

  - [x] 1.5 重构 `useItemsData.ts` 使用 useDataLoader
    - 处理 ItemModel 转换和变体 ID 映射
    - 保留 `updateCatalogData` 方法
    - _Requirements: 1.7, 1.8, 1.9_

- [x] 2. 检查点 - 确保数据加载重构正常工作
  - 确保所有测试通过，如有问题请询问用户

- [x] 3. 创建 DetailRow 和 InlineIcon 组件
  - [x] 3.1 创建 `src/components/common/InlineIcon.vue`
    - 实现 `InlineIconProps` 接口
    - 支持 src、alt、title、gray、size 属性
    - 应用现有 `inline-icon` 样式类
    - _Requirements: 2.5_

  - [x] 3.2 创建 `src/components/common/DetailRow.vue`
    - 实现 `DetailRowProps` 接口
    - 支持 label/value 的文本和 HTML 渲染
    - 支持 layout（default/full/center）属性
    - 支持 variant（default/highlight）属性
    - 支持默认插槽
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 3.3 编写 DetailRow 和 InlineIcon 单元测试
    - **Property 6: DetailRow 内容渲染**
    - **Property 7: InlineIcon 图标渲染**
    - **Property 8: DetailRow 布局和样式**
    - **Validates: Requirements 2.1-2.5**

  - [x] 3.4 在 CreatureCard 中试用 DetailRow 组件
    - 作为第一个迁移示例
    - 验证视觉外观一致性
    - _Requirements: 2.6_

  - [x] 3.5 在其他卡片组件中应用 DetailRow
    - 重构 ItemCard.vue
    - 重构 RecipeCard.vue
    - 重构 VillagerCard.vue
    - 重构 ArtworkCard.vue
    - 重构 FossilCard.vue
    - 重构 MusicCard.vue
    - 重构 PlantCard.vue
    - 重构 ConstructionCard.vue
    - 重构 NPCCard.vue
    - 重构 ReactionCard.vue
    - _Requirements: 2.6_

- [x] 4. 检查点 - 确保组件重构正常工作
  - 确保所有测试通过，如有问题请询问用户

- [x] 5. 创建枚举工厂函数
  - [x] 5.1 创建 `src/types/utils/enumFactory.ts`
    - 实现 `createEnum` 函数
    - 实现 `createEnumNameMap` 函数
    - 支持自定义起始值
    - _Requirements: 3.1, 3.4, 3.5_

  - [ ]* 5.2 编写枚举工厂属性测试
    - **Property 9: 枚举工厂值生成**
    - **Validates: Requirements 3.4, 3.5**

  - [x] 5.3 重构 `src/types/item.ts` 使用枚举工厂
    - 重构 ItemType、Version、ItemSize、Color 等枚举
    - 保持枚举值和类型兼容性
    - _Requirements: 3.6_

- [x] 6. 拆分数据服务模块
  - [x] 6.1 创建 `src/services/mappings/` 目录和文件
    - 创建 `itemMappings.ts`（ItemTypeNameMap、versionNameMap、itemSizeNameMap、colorNameMap、CatalogNameMap）
    - 创建 `creatureMappings.ts`（CreatureTypeNameMap）
    - 创建 `villagerMappings.ts`（PersonalityNameMap、HobbyNameMap、SpeciesNameMap、ConstellationNameMap）
    - 创建 `recipeMappings.ts`（RecipeTypeNameMap）
    - 创建 `constructionMappings.ts`（ConstructionTypeNameMap）
    - 创建 `plantMappings.ts`（PlantTypeNameMap）
    - 创建 `currencyMappings.ts`（CurrencyNameMap）
    - 创建 `index.ts` 重新导出所有映射
    - _Requirements: 4.1, 4.3_

  - [ ]* 6.2 创建 `src/services/formatters/` 目录和文件
    - 创建 `priceFormatter.ts`（getPriceStr、getPriceWithIcon、getCusCost）
    - 创建 `iconFormatter.ts`（getImgUrl、getSizeIcon、getCatalogIcon、getCurrencyIcon、getCreatureTypeIcon 等）
    - 创建 `sizeFormatter.ts`（getSizeName、getSizeWithIcon）
    - 创建 `translationFormatter.ts`（getTranslation、getSourceName、getTagName 等）
    - 创建 `index.ts` 重新导出所有格式化函数
    - _Requirements: 4.2, 4.4_

  - [x] 6.3 将数据加载函数移至各自的 composables
    - 每个 `useXXXData.ts` 现在包含自己的 loader 函数
    - `dataService.ts` 仅保留 `loadTranslations` 和 `loadCatalogData`
    - _Requirements: 4.5_

  - [x] 6.4 清理 `src/services/dataService.ts`
    - 移除所有 `loadXXXData` 函数（已移至 composables）
    - 保留映射表、格式化函数、`loadTranslations`、`loadCatalogData`
    - _Requirements: 4.6, 4.7_

  - [ ]* 6.5 编写数据服务向后兼容性测试
    - **Property 10: 数据服务向后兼容性**
    - **Validates: Requirements 4.7**

- [x] 7. 检查点 - 确保数据服务拆分正常工作
  - 确保所有测试通过，如有问题请询问用户

- [x] 8. 优化样式组织
  - [x] 8.1 分析样式文件重叠
    - 检查 card-styles.scss、view-styles.scss、style.scss 的内容
    - 识别重复和冗余样式
    - _Requirements: 5.1_

  - [x] 8.2 整合重复样式到 7-1 架构
    - 将重复样式移至对应的 components/ 或 utilities/ 目录
    - 更新 main.scss 导入
    - _Requirements: 5.2, 5.3_

  - [x] 8.3 简化 style.scss
    - 移除冗余内容
    - 仅保留向后兼容的导出
    - _Requirements: 5.5_

  - [x] 8.4 验证样式文件命名规范
    - 确保所有文件遵循 7-1 架构命名规范
    - _Requirements: 5.7_

- [x] 9. 最终检查点 - 确保所有重构正常工作
  - 运行完整测试套件
  - 验证应用功能正常
  - 确保所有测试通过，如有问题请询问用户

## 注意事项

- 标记 `*` 的任务为可选任务，可跳过以加快 MVP 进度
- 每个任务都引用了具体的需求以便追溯
- 检查点任务用于验证阶段性成果
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况
