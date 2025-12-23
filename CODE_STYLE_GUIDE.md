# Vue 3 + TypeScript 代码风格指南

本项目遵循以下代码风格和最佳实践。

## 1. 组件命名

### 组件文件
- 使用 PascalCase（大驼峰）命名
- 示例：`FilterControls.vue`、`ItemCard.vue`

### 组合函数文件
- 使用 camelCase（小驼峰）命名
- 以 `use` 开头
- 示例：`useFilterOptions.ts`、`useItemVariants.ts`

## 2. TypeScript 规范

### 类型导入
```typescript
// ✅ 推荐：使用 type 关键字导入类型
import type { Item, FilterOptions } from '../types';

// ❌ 避免：混合导入类型和值
import { Item, ref } from 'vue';
```

### 接口定义
```typescript
// ✅ 推荐：使用 interface 定义对象类型
export interface Item {
  name: string;
  id: number;
}

// ✅ 推荐：为公共接口添加注释
/**
 * 物品接口
 * 表示游戏中的一个物品
 */
export interface Item {
  name: string;  // 物品名称
  id: number;    // 物品ID
}
```

### 函数类型注解
```typescript
// ✅ 推荐：明确的参数和返回值类型
function processItem(item: RawItem): Item {
  // ...
}

// ✅ 推荐：异步函数返回 Promise
async function loadData(): Promise<Item[]> {
  // ...
}
```

## 3. Vue 组合式 API

### 组合函数结构
```typescript
// ✅ 推荐的组合函数结构
export function useItemVariants(item: Item) {
  // 1. 响应式状态
  const vIndex = ref(0);
  const pIndex = ref(0);

  // 2. 计算属性
  const currentVariant = computed(() => {
    // ...
  });

  // 3. 方法
  const selectVariant = (index: number): void => {
    // ...
  };

  // 4. 返回公共API
  return {
    vIndex,
    pIndex,
    currentVariant,
    selectVariant
  };
}
```

### 组件 setup 结构
```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue';
import type { Item } from '../types';

// 2. Props 和 Emits
const props = defineProps<{
  item: Item;
}>();

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();

// 3. 组合函数
const { data, loading } = useData();

// 4. 本地状态
const count = ref(0);

// 5. 计算属性
const doubled = computed(() => count.value * 2);

// 6. 方法
const increment = () => {
  count.value++;
};

// 7. 生命周期钩子
onMounted(() => {
  // ...
});
</script>
```

## 4. 注释规范

### JSDoc 注释
```typescript
/**
 * 筛选物品列表
 * @param allItems 所有物品
 * @param filters 筛选条件
 * @returns 筛选后的物品列表
 */
export function filterItems(allItems: Item[], filters: FilterOptions): Item[] {
  // ...
}
```

### 行内注释
```typescript
// ✅ 推荐：解释"为什么"而不是"是什么"
const colors = firstPattern.colors || colors;  // 使用图案颜色，如果没有则使用物品颜色

// ❌ 避免：描述显而易见的代码
const colors = item.colors;  // 获取物品颜色
```

## 5. 命名约定

### 变量和函数
```typescript
// ✅ 推荐：使用有意义的名称
const filteredItems = filterItems(allItems, filters);
const currentVariant = getCurrentVariant();

// ❌ 避免：使用缩写或单字母变量（除了循环计数器）
const fItems = filter(all, f);
const cv = getCurVar();
```

### 布尔值
```typescript
// ✅ 推荐：使用 is/has/should 前缀
const hasVariations = item.variations.length > 0;
const isLoading = loading.value;
const shouldDisplay = count > 0;

// ❌ 避免：不清晰的布尔值命名
const variations = item.variations.length > 0;
const loading = true;
```

### 常量
```typescript
// ✅ 推荐：使用 UPPER_SNAKE_CASE
const MAX_ITEMS_PER_PAGE = 100;
const DEFAULT_SORT_ORDER = 'asc';

// ✅ 推荐：对于配置对象，使用 PascalCase
export const CONFIG = {
  PAGINATION: {
    DEFAULT_PER_PAGE: 100
  }
} as const;
```

## 6. 代码组织

### 文件结构
```
src/
├── components/       # Vue 组件
├── composables/      # 可复用的组合函数
├── services/         # 业务逻辑和数据处理
├── types/            # TypeScript 类型定义
├── config/           # 配置常量
└── assets/           # 静态资源
```

### 导入顺序
```typescript
// 1. Vue 核心
import { ref, computed, onMounted } from 'vue';

// 2. 第三方库
// import someLib from 'some-lib';

// 3. 类型导入
import type { Item, FilterOptions } from '../types';

// 4. 本地导入
import { useFilterOptions } from '../composables/useFilterOptions';
import { filterItems } from '../services/filterService';
```

## 7. 最佳实践

### 计算属性 vs 方法
```typescript
// ✅ 推荐：对于依赖响应式数据的值，使用计算属性
const displayName = computed(() => {
  return `${item.name} - ${variant.name}`;
});

// ❌ 避免：对于需要缓存的值，不要使用方法
function getDisplayName() {
  return `${item.name} - ${variant.name}`;
}
```

### 响应式数据
```typescript
// ✅ 推荐：对于对象和数组，使用 ref
const items = ref<Item[]>([]);
const filter = ref<FilterOptions>({});

// ✅ 推荐：对于简单值，也使用 ref
const count = ref(0);
const isLoading = ref(false);
```

### 错误处理
```typescript
// ✅ 推荐：提供有意义的错误信息和降级方案
async function loadData(): Promise<Item[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('加载数据失败:', error);
    return []; // 降级方案：返回空数组
  }
}
```

### 数组和对象操作
```typescript
// ✅ 推荐：使用展开运算符进行浅拷贝
const sortedItems = [...items];

// ✅ 推荐：使用数组方法进行转换
const names = items.map(item => item.name);
const owned = items.filter(item => item.owned);

// ❌ 避免：直接修改原数组
items.sort(); // 这会修改原数组
```

### 条件渲染
```vue
<!-- ✅ 推荐：使用 v-if 用于条件性渲染 -->
<div v-if="loading">加载中...</div>
<div v-else-if="error">{{ error }}</div>
<div v-else>{{ content }}</div>

<!-- ✅ 推荐：使用 v-show 用于频繁切换 -->
<div v-show="isVisible">内容</div>
```

## 8. 性能优化

### 计算属性缓存
```typescript
// ✅ 推荐：使用计算属性自动缓存
const expensiveValue = computed(() => {
  return items.value.reduce((sum, item) => sum + item.price, 0);
});

// ❌ 避免：在模板中进行复杂计算
// <div>{{ items.reduce((sum, item) => sum + item.price, 0) }}</div>
```

### 列表渲染
```vue
<!-- ✅ 推荐：使用 key 优化列表渲染 -->
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>

<!-- ✅ 推荐：使用懒加载图片 -->
<img :src="item.image" loading="lazy" :alt="item.name">
```

## 9. 代码审查检查清单

- [ ] 所有函数都有类型注解
- [ ] 公共接口有 JSDoc 注释
- [ ] 没有 `any` 类型（除非必要）
- [ ] 错误处理完善
- [ ] 命名清晰且一致
- [ ] 没有未使用的导入和变量
- [ ] 遵循单一职责原则
- [ ] 组件和函数长度适中（< 200 行）

## 10. 提交信息规范

使用约定式提交（Conventional Commits）：

```
feat: 添加物品颜色筛选功能
fix: 修复分页计算错误
refactor: 重构筛选服务逻辑
docs: 更新 README 文档
style: 优化代码格式
perf: 优化物品列表渲染性能
test: 添加筛选功能单元测试
```

## 参考资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/zh/)
- [Vue 3 组合式 API 风格指南](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
