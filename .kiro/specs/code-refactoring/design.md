# 设计文档

## 概述

本设计文档描述了 ACNH 目录应用的代码重构方案。重构目标是减少代码重复、改善项目结构、提高可维护性，同时保持向后兼容性。

重构范围包括：
1. 创建通用数据加载工厂函数
2. 抽象卡片组件的 DetailRow
3. 简化枚举定义模式
4. 拆分数据服务模块
5. 优化样式组织结构

## 架构

### 整体架构变更

```
src/
├── composables/
│   ├── core/                    # 新增：核心 composables
│   │   └── useDataLoader.ts     # 通用数据加载工厂
│   ├── useItemsData.ts          # 重构：使用 useDataLoader
│   ├── useCreaturesData.ts      # 重构：使用 useDataLoader
│   └── ...
├── components/
│   ├── common/                  # 新增：通用组件
│   │   ├── DetailRow.vue        # 详情行组件
│   │   └── InlineIcon.vue       # 内联图标组件
│   ├── ItemCard.vue             # 重构：使用 DetailRow
│   └── ...
├── types/
│   ├── utils/                   # 新增：类型工具
│   │   └── enumFactory.ts       # 枚举工厂
│   └── item.ts                  # 重构：使用枚举工厂
├── services/
│   ├── mappings/                # 新增：名称映射
│   │   ├── index.ts
│   │   ├── itemMappings.ts
│   │   ├── creatureMappings.ts
│   │   └── ...
│   ├── formatters/              # 新增：格式化函数
│   │   ├── index.ts
│   │   ├── priceFormatter.ts
│   │   ├── iconFormatter.ts
│   │   └── ...
│   ├── loaders/                 # 新增：数据加载函数
│   │   └── index.ts
│   └── dataService.ts           # 重构：重新导出
└── styles/
    ├── main.scss                # 保持：全局入口
    ├── card-styles.scss         # 保持：卡片样式入口
    ├── view-styles.scss         # 保持：视图样式入口
    └── style.scss               # 简化：仅向后兼容
```

## 组件和接口

### 1. useDataLoader 工厂函数

```typescript
// src/composables/core/useDataLoader.ts

import { ref, type Ref } from 'vue';

/**
 * 数据加载器配置选项
 */
export interface DataLoaderOptions<T, R = T> {
  /** 数据加载函数 */
  loader: () => Promise<T[]>;
  /** 可选的数据转换函数 */
  transform?: (item: T) => R;
  /** 
   * 可选的 ID 提取函数，用于生成 ID 映射表
   * 返回一个 ID 数组：第一个是主 ID，其余是额外 ID（如变体 ID）
   * 所有 ID 都会映射到同一个数据项
   * 
   * 示例：
   * - 简单情况：(item) => [item.id]
   * - 带变体：(model) => [model.id, ...model.getVariantIds()]
   */
  getIds?: (item: R) => (number | string)[];
  /** 加载失败时的错误消息 */
  errorMessage?: string;
  /** 是否使用全局单例模式（跨组件共享状态） */
  singleton?: boolean;
}

/**
 * 数据加载状态枚举
 */
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * 数据加载器返回值
 */
export interface DataLoaderReturn<R> {
  /** 所有数据项 */
  data: Ref<R[]>;
  /** ID 到数据项的映射表 */
  idMap: Ref<Record<number | string, R>>;
  /** 
   * 加载状态
   * - 'idle': 初始状态，未开始加载
   * - 'loading': 正在加载中
   * - 'success': 加载成功
   * - 'error': 加载失败
   */
  status: Ref<LoadingStatus>;
  /** 错误信息（仅在 status 为 'error' 时有值） */
  error: Ref<string>;
  /** 加载数据方法 */
  loadData: () => Promise<void>;
}

/**
 * 创建数据加载器工厂函数
 */
export function createDataLoader<T, R = T>(
  options: DataLoaderOptions<T, R>
): () => DataLoaderReturn<R>;
```

### 2. DetailRow 组件

```typescript
// src/components/common/DetailRow.vue

export interface DetailRowProps {
  /** 
   * 行标签，支持多种类型：
   * - string: 直接显示文本
   * - 以 '<' 开头的字符串: 作为 HTML 渲染
   */
  label?: string;
  /** 
   * 行值，支持多种类型：
   * - string/number: 直接显示文本
   * - 以 '<' 开头的字符串: 作为 HTML 渲染（可包含 InlineIcon 组件）
   */
  value?: string | number;
  /** 
   * 布局模式
   * - 'default': 默认布局（标签和值并排）
   * - 'full': 全宽显示（值独占一行）
   * - 'center': 居中显示
   */
  layout?: 'default' | 'full' | 'center';
  /** 
   * 样式变体
   * - 'default': 默认样式
   * - 'highlight': 高亮显示值
   */
  variant?: 'default' | 'highlight';
}
```

### 3. InlineIcon 组件

```typescript
// src/components/common/InlineIcon.vue

export interface InlineIconProps {
  /** 图标 URL */
  src: string;
  /** alt 文本，默认为空 */
  alt?: string;
  /** title 提示文本 */
  title?: string;
  /** 是否使用灰色滤镜 */
  gray?: boolean;
  /** 图标尺寸，默认继承 inline-icon 类的尺寸 */
  size?: number;
}
```

**使用示例：**
```vue
<!-- 简单用法 -->
<DetailRow label="分类" value="家具" />

<!-- 带图标（通过 HTML 值） -->
<DetailRow 
  label="分类" 
  :value="`家具 <img src='${iconUrl}' class='inline-icon gray' />`" 
/>

<!-- 使用插槽自定义内容 -->
<DetailRow label="分类">
  <span>家具</span>
  <InlineIcon :src="iconUrl" alt="家具" gray />
</DetailRow>

<!-- 全宽布局 + 高亮 -->
<DetailRow label="描述" value="这是一段很长的描述" layout="full" variant="highlight" />
```

**设计说明：**
1. DetailRow 专注于行布局和样式修饰
2. InlineIcon 独立处理图标渲染逻辑
3. 通过插槽或 HTML 值组合使用，保持灵活性
4. 现有代码中的 `<img class="inline-icon">` 可逐步迁移到 InlineIcon 组件

### 4. 枚举工厂函数

```typescript
// src/types/utils/enumFactory.ts

/**
 * 创建类型安全的枚举对象
 * @param keys 枚举键名数组
 * @param startValue 起始值（默认为 1）
 * @returns 枚举对象
 */
export function createEnum<T extends string>(
  keys: readonly T[],
  startValue: number = 1
): { readonly [K in T]: number } & { readonly [key: number]: T };

/**
 * 创建枚举名称映射表
 * @param enumObj 枚举对象
 * @param names 名称数组（与枚举键顺序对应）
 * @returns 枚举值到名称的映射表
 */
export function createEnumNameMap<E extends Record<string, number>>(
  enumObj: E,
  names: readonly string[]
): Record<E[keyof E], string>;
```

### 5. 数据服务模块结构

```typescript
// src/services/mappings/index.ts
export * from './itemMappings';
export * from './creatureMappings';
export * from './villagerMappings';
export * from './recipeMappings';
export * from './constructionMappings';
export * from './plantMappings';

// src/services/formatters/index.ts
export * from './priceFormatter';
export * from './iconFormatter';
export * from './sizeFormatter';
export * from './translationFormatter';

// src/services/loaders/index.ts
export * from './dataLoaders';

// src/services/dataService.ts (重构后)
// 重新导出所有公开 API 以保持向后兼容
export * from './mappings';
export * from './formatters';
export * from './loaders';
```

## 数据模型

### DataLoader 内部状态

DataLoader 工厂函数内部维护的状态（不直接暴露给使用者）：

```typescript
// 内部状态，用于 Promise 去重和缓存控制
let loadingPromise: Promise<void> | null = null;
```

**说明：**
- `DataLoaderReturn` 是公开 API，定义了 composable 返回给使用者的接口
- 内部只需要一个 `loadingPromise` 变量来实现 Promise 去重
- `status` ref 已经包含了所有状态信息（idle/loading/success/error）

### DetailRow 渲染逻辑

DetailRow 组件内部渲染逻辑：
1. 检测 label/value 是否以 `<` 开头，决定使用 `v-text` 还是 `v-html`
2. 根据 layout 属性添加对应的 CSS 类（`detail-row--full`、`detail-row--center`）
3. 根据 variant 属性添加对应的 CSS 类（`highlight`）
4. 如果有默认插槽内容，优先渲染插槽内容

## 正确性属性

*正确性属性是一种特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### Property 1: DataLoader 状态转换正确性

*对于任意* 数据加载器和任意加载操作，状态转换应遵循：idle → loading → success/error。加载开始时 status 应为 'loading'，成功完成后应为 'success'，失败后应为 'error' 且 error 包含错误信息。

**Validates: Requirements 1.2, 1.3**

### Property 2: DataLoader 请求去重和缓存

*对于任意* 数据加载器，当同时发起多次 loadData 调用时，实际的网络请求应该只有一次；当数据已加载完成后再次调用 loadData，不应发起新的网络请求。

**Validates: Requirements 1.4, 1.5**

### Property 3: DataLoader 错误恢复

*对于任意* 数据加载器，当加载失败后，loadingPromise 应被重置为 null，允许后续重试调用发起新请求。

**Validates: Requirements 1.6**

### Property 4: DataLoader ID 映射表生成

*对于任意* 数据数组和 getIds 函数，生成的 idMap 应包含所有返回的 ID（包括主 ID 和额外 ID），且每个 ID 都能正确检索到对应的数据项。

**Validates: Requirements 1.7**

### Property 5: DataLoader 数据转换

*对于任意* 数据数组和 transform 函数，输出的 data 数组中每个元素应该是原始元素经过 transform 函数转换后的结果。

**Validates: Requirements 1.8**

### Property 6: DetailRow 内容渲染

*对于任意* label 和 value 组合，DetailRow 组件应正确渲染标签和对应内容；当 value 以 '<' 开头时应作为 HTML 渲染。

**Validates: Requirements 2.1, 2.2**

### Property 7: InlineIcon 图标渲染

*对于任意* InlineIcon 属性组合，组件应渲染带有正确 src、alt、title 属性的图标元素，并根据 gray 属性应用灰色滤镜。

**Validates: Requirements 2.5**

### Property 8: DetailRow 布局和样式

*对于任意* layout 和 variant 属性组合，组件应添加对应的 CSS 类名。

**Validates: Requirements 2.3, 2.4**

### Property 9: 枚举工厂值生成

*对于任意* 键名数组和起始值，createEnum 生成的枚举对象中，每个键对应的值应从起始值开始递增。

**Validates: Requirements 3.4, 3.5**

### Property 10: 数据服务向后兼容性

*对于任意* 现有的 dataService 导入路径和导出名称，重构后应仍然可以正常导入和使用。

**Validates: Requirements 4.7**

## 错误处理

### DataLoader 错误处理

1. **网络错误**: 捕获 fetch 异常，设置 error ref，重置 loadingPromise 允许重试
2. **数据转换错误**: 在 transform 函数中捕获异常，记录错误并跳过该项
3. **ID 冲突**: 当多个数据项有相同 ID 时，后者覆盖前者，记录警告日志

### DetailRow 错误处理

1. **空值处理**: 当 value 和 htmlValue 都为空时，显示默认插槽内容或空字符串
2. **图标加载失败**: 使用 onerror 处理图标加载失败，隐藏图标元素

### 枚举工厂错误处理

1. **空数组**: 当传入空键名数组时，返回空对象
2. **重复键名**: 当键名数组有重复时，抛出错误

## 测试策略

### 双重测试方法

本重构采用单元测试和属性测试相结合的方式：

- **单元测试**: 验证具体示例、边界情况和错误条件
- **属性测试**: 验证跨所有输入的通用属性

### 属性测试配置

- 使用 `fast-check` 作为属性测试库
- 每个属性测试最少运行 100 次迭代
- 每个测试用注释标记对应的设计属性
- 标记格式: **Feature: code-refactoring, Property {number}: {property_text}**

### 测试文件结构

```
src/
├── composables/
│   └── core/
│       └── __tests__/
│           └── useDataLoader.spec.ts
├── components/
│   └── common/
│       └── __tests__/
│           └── DetailRow.spec.ts
├── types/
│   └── utils/
│       └── __tests__/
│           └── enumFactory.spec.ts
└── services/
    └── __tests__/
        └── dataService.spec.ts
```

### 单元测试覆盖

1. **useDataLoader**
   - 基本加载流程
   - 并发调用去重
   - 缓存命中
   - 错误处理和重试
   - ID 映射表生成
   - 数据转换

2. **DetailRow**
   - 各属性组合渲染
   - 插槽内容渲染
   - HTML 内容渲染
   - 样式类应用

3. **枚举工厂**
   - 基本枚举生成
   - 自定义起始值
   - 名称映射表生成

4. **数据服务**
   - 向后兼容性导入测试
   - 各模块正确导出

### 属性测试覆盖

每个正确性属性对应一个属性测试，使用 fast-check 生成随机输入验证属性成立。

