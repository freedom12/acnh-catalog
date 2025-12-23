/**
 * 类型定义文件
 * 包含应用中使用的所有 TypeScript 接口和类型定义
 */

/**
 * 翻译接口
 * 包含物品在不同语言版本中的名称
 */
export interface Translation {
  sourceSheet: string;
  id: string | number;
  eUde?: string;      // 德语（欧洲）
  eUen?: string;      // 英语（欧洲）
  eUit?: string;      // 意大利语（欧洲）
  eUnl?: string;      // 荷兰语（欧洲）
  eUru?: string;      // 俄语（欧洲）
  eUfr?: string;      // 法语（欧洲）
  eUes?: string;      // 西班牙语（欧洲）
  uSen?: string;      // 英语（美国）
  uSfr?: string;      // 法语（美国）
  uSes?: string;      // 西班牙语（美国）
  jPja?: string;      // 日语
  kRko?: string;      // 韩语
  tWzh?: string;      // 繁体中文（台湾）
  cNzh?: string;      // 简体中文（中国）
  plural?: boolean;   // 是否为复数形式
}

/**
 * 图案接口
 * 表示物品的一个具体图案（如家具的不同花纹）
 */
export interface Pattern {
  patternName: string;      // 图案名称
  imageUrl: string;         // 图案图片URL
  id: number;               // 图案ID
  uniqueEntryId: string;    // 唯一条目ID
  colors: string[];         // 图案颜色列表
}

/**
 * 变体组接口
 * 表示物品的一个变体（如家具的不同款式）
 * 一个变体可以包含多个图案
 */
export interface VariantGroup {
  variantName: string;      // 变体名称
  patterns: Pattern[];      // 该变体的所有图案
}

/**
 * 物品接口
 * 表示游戏中的一个物品
 */
export interface Item {
  name: string;                 // 物品名称
  id: number;                   // 物品ID
  category: string;             // 物品分类
  imageUrl: string;             // 物品图片URL
  colors: string[];             // 物品颜色列表
  owned: boolean;               // 是否已拥有
  variantGroups: VariantGroup[]; // 变体组列表
  hasVariations: boolean;       // 是否有变体
  vIndex: number;               // 当前选中的变体索引
  pIndex: number;               // 当前选中的图案索引
  versionAdded?: string;        // 添加版本
  source?: string[];            // 获取来源
  size?: string;                // 物品尺寸
  tag?: string;                 // 物品标签
  series?: string;              // 所属系列
  seriesName?: string;          // 系列名称（翻译后）
  originalData?: RawItem;       // 原始数据
}

/**
 * 原始物品数据接口
 * 从 JSON 文件中直接加载的物品数据结构
 */
export interface RawItem {
  sourceSheet: string;              // 数据来源表
  name: string;                     // 物品名称
  image?: string;                   // 物品图片
  storageImage?: string;            // 存储图片
  closetImage?: string;             // 衣柜图片
  framedImage?: string;             // 框架图片
  inventoryImage?: string;          // 库存图片
  variation?: string;               // 变体
  bodyTitle?: string;               // 主体标题
  pattern?: string;                 // 图案
  patternTitle?: string;            // 图案标题
  diy: boolean;                     // 是否可DIY
  bodyCustomize: boolean;           // 主体可定制
  patternCustomize: boolean;        // 图案可定制
  stackSize?: number;               // 堆叠数量
  kitCost?: number;                 // 套件成本
  kitType?: string;                 // 套件类型
  cyrusCustomizePrice?: number;     // Cyrus定制价格
  buy?: number;                     // 购买价格
  sell?: number;                    // 出售价格
  size?: string;                    // 尺寸
  surface: boolean;                 // 是否可放置在表面
  exchangePrice?: number;           // 兑换价格
  exchangeCurrency?: string;        // 兑换货币
  source?: string[];                // 获取来源
  sourceNotes?: string;             // 来源备注
  seasonEvent?: string;             // 季节活动
  seasonEventExclusive?: boolean;   // 是否为活动专属
  hhaBasePoints?: number;           // HHA基础分数
  hhaCategory?: string;             // HHA分类
  interact: boolean;                // 是否可交互
  tag?: string;                     // 标签
  outdoor: boolean;                 // 是否为户外物品
  speakerType?: string;             // 音响类型
  lightingType?: string;            // 照明类型
  foodPower?: number;               // 食物能量
  catalog?: string;                 // 目录
  versionAdded?: string;            // 添加版本
  unlocked: boolean;                // 是否已解锁
  filename: string;                 // 文件名
  variantId?: string;               // 变体ID
  internalId: number;               // 内部ID
  uniqueEntryId: string;            // 唯一条目ID
  seriesTranslations?: Translation; // 系列翻译
  translations?: Translation;       // 物品翻译
  colors?: string[];                // 颜色列表
  concepts?: string[];              // 概念列表
  set?: string;                     // 套装
  series?: string;                  // 系列
  recipe?: any;                     // 配方
  variations?: RawVariation[];      // 变体列表
}

/**
 * 原始变体数据接口
 * 物品变体的原始数据结构
 */
export interface RawVariation {
  variation?: string;               // 变体名称
  pattern?: string;                 // 图案名称
  image?: string;                   // 图片
  storageImage?: string;            // 存储图片
  closetImage?: string;             // 衣柜图片
  framedImage?: string;             // 框架图片
  inventoryImage?: string;          // 库存图片
  internalId?: number;              // 内部ID
  uniqueEntryId: string;            // 唯一条目ID
  colors?: string[];                // 颜色列表
  variantTranslations?: Translation; // 变体翻译
  patternTranslations?: Translation; // 图案翻译
}

/**
 * 目录物品接口
 * 用户拥有的物品数据结构
 */
export interface CatalogItem {
  label: string;        // 物品标签
  unique_id: string;    // 唯一ID
}

/**
 * 翻译数据接口
 * 包含各种类型的翻译映射
 */
export interface Translations {
  categories: Record<string, string>;  // 分类翻译
  sources: Record<string, string>;     // 来源翻译
  colors: Record<string, string>;      // 颜色翻译
  tags: Record<string, string>;        // 标签翻译
  series: Record<string, string>;      // 系列翻译
}

/**
 * 筛选选项接口
 * 定义物品筛选的各种条件
 */
export interface FilterOptions {
  searchTerm: string;              // 搜索关键词
  category: string;                // 分类筛选
  ownedFilter: 'all' | 'owned' | 'not-owned';  // 拥有状态筛选
  versionFilter: string;           // 版本筛选
  sourceFilter: string;            // 来源筛选
  sizeFilter: string;              // 尺寸筛选
  tagFilter: string;               // 标签筛选
  colorFilter: string;             // 颜色筛选
  seriesFilter: string;            // 系列筛选
}

/**
 * 排序选项接口
 * 定义排序方式的显示信息
 */
export interface SortOption {
  value: string;   // 排序值
  label: string;   // 显示标签
}
