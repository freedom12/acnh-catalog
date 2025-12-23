import type { Item, VariantGroup, Pattern, RawItem } from '../types';
import { ref, type Ref } from 'vue';
import * as itemHelpers from '../utils/itemHelpers';

/**
 * 物品数据工厂类
 * 提供从 RawItem 创建 Item 的静态方法
 */
export class ItemFactory {
  /**
   * 从原始数据创建 Item
   * @param rawItem 原始物品数据
   * @param ownedData 拥有物品数据
   * @returns Item 数据对象
   */
  static createItem(
    rawItem: RawItem,
    ownedData?: { ownedNames: Set<string>; ownedIds: Set<string> }
  ): Item {
    const name = rawItem.translations?.cNzh || rawItem.name;
    
    // 处理变体
    const variantGroups = ItemFactory.processVariations(rawItem);
    
    // 获取默认显示属性
    const { id, imageUrl, colors } = ItemFactory.getDefaultDisplayProperties(rawItem, variantGroups);
    
    // 检查是否拥有
    const owned = ownedData 
      ? ItemFactory.checkIfOwned(name, rawItem.internalId, rawItem.uniqueEntryId, ownedData)
      : false;

    return {
      name,
      id,
      category: rawItem.sourceSheet || "Other",
      imageUrl,
      colors,
      owned,
      variantGroups,
      versionAdded: rawItem.versionAdded,
      source: rawItem.source,
      size: rawItem.size,
      tag: rawItem.tag,
      series: rawItem.series,
      originalData: rawItem,
    };
  }

  /**
   * 处理变体数据
   */
  private static processVariations(rawItem: RawItem): VariantGroup[] {
    if (!rawItem.variations || rawItem.variations.length === 0) {
      return [];
    }

    const variantMap = new Map<string, VariantGroup>();

    rawItem.variations.forEach((v) => {
      const variantName = v.variantTranslations?.cNzh || v.variation || "";

      if (!variantMap.has(variantName)) {
        variantMap.set(variantName, {
          variantName: variantName,
          patterns: [],
        });
      }
      
      const variant = variantMap.get(variantName)!;
      variant.patterns.push({
        patternName: v.patternTranslations?.cNzh || v.pattern || "",
        imageUrl: v.image || v.storageImage || v.closetImage || v.framedImage || rawItem.inventoryImage || '',
        id: v.internalId || rawItem.internalId,
        uniqueEntryId: v.uniqueEntryId,
        colors: v.colors || rawItem.colors || [],
      });
    });

    return Array.from(variantMap.values());
  }

  /**
   * 获取物品的默认显示属性
   */
  private static getDefaultDisplayProperties(
    rawItem: RawItem,
    variantGroups: VariantGroup[]
  ): { id: number; imageUrl: string; colors: string[] } {
    let id = rawItem.internalId;
    let imageUrl = rawItem.image || rawItem.storageImage || rawItem.closetImage || 
                   rawItem.framedImage || rawItem.inventoryImage || '';
    let colors = rawItem.colors || [];

    // 如果有变体，使用第一个变体的第一个图案
    if (variantGroups.length > 0) {
      const firstVariant = variantGroups[0];
      if (firstVariant && firstVariant.patterns.length > 0) {
        const firstPattern = firstVariant.patterns[0];
        if (firstPattern) {
          id = firstPattern.id || id;
          imageUrl = firstPattern.imageUrl || imageUrl;
          colors = firstPattern.colors || colors;
        }
      }
    }

    return { id, imageUrl, colors };
  }

  /**
   * 检查物品是否被拥有
   */
  private static checkIfOwned(
    name: string,
    internalId: number,
    uniqueEntryId: string,
    ownedData: { ownedNames: Set<string>; ownedIds: Set<string> }
  ): boolean {
    const { ownedNames, ownedIds } = ownedData;
    return ownedNames.has(name) || 
           ownedIds.has(String(internalId)) || 
           ownedIds.has(uniqueEntryId);
  }
}

/**
 * 物品模型类
 * 封装物品数据的访问逻辑，提供便捷的 API
 * 用于需要业务逻辑和状态管理的场景
 */
export class ItemModel {
  private readonly _data: Item;
  // 响应式状态
  private _currentVariantIndex: Ref<number>;
  private _currentPatternIndex: Ref<number>;

  constructor(item: Item) {
    this._data = item;
    this._currentVariantIndex = ref(0);
    this._currentPatternIndex = ref(0);
  }

  /**
   * 获取原始数据
   */
  get raw(): Item {
    return this._data;
  }

  // ============ 基础属性访问 ============

  /**
   * 物品名称
   */
  get name(): string {
    return this._data.name;
  }

  /**
   * 物品ID
   */
  get id(): number {
    return this._data.id;
  }

  /**
   * 物品分类
   */
  get category(): string {
    return this._data.category;
  }

  /**
   * 是否已拥有
   */
  get owned(): boolean {
    return this._data.owned;
  }

  /**
   * 设置拥有状态
   */
  set owned(value: boolean) {
    this._data.owned = value;
  }

  // ============ 可选属性安全访问 ============

  /**
   * 获取版本信息（安全访问）
   */
  getVersion(): string {
    return itemHelpers.getItemVersion(this._data);
  }

  /**
   * 获取尺寸信息（安全访问）
   */
  getSize(): string {
    return itemHelpers.getItemSize(this._data);
  }

  /**
   * 获取标签（安全访问）
   */
  getTag(): string {
    return this._data.tag || '';
  }

  /**
   * 获取系列ID（安全访问）
   */
  getSeries(): string {
    return this._data.series || '';
  }

  /**
   * 获取系列名称（翻译后，安全访问）
   * 注意：需要配合翻译服务使用，这里只返回原始 series 值
   */
  getSeriesName(): string {
    return this._data.series || '无系列';
  }

  /**
   * 获取来源列表（安全访问）
   */
  getSources(): string[] {
    return itemHelpers.getItemSources(this._data);
  }

  /**
   * 检查是否有指定来源
   */
  hasSource(source: string): boolean {
    return itemHelpers.hasSource(this._data, source);
  }

  /**
   * 获取颜色列表（安全访问）
   */
  getColors(): string[] {
    return this._data.colors || [];
  }

  /**
   * 检查是否包含指定颜色
   */
  hasColor(color: string): boolean {
    return itemHelpers.hasColor(this._data, color);
  }

  // ============ 变体相关 ============

  /**
   * 是否有变体
   */
  get hasVariations(): boolean {
    return itemHelpers.hasVariations(this._data);
  }

  /**
   * 获取变体组列表
   */
  getVariantGroups(): VariantGroup[] {
    return this._data.variantGroups || [];
  }

  /**
   * 获取变体总数
   */
  getVariantCount(): number {
    return this.getVariantGroups().length;
  }

  /**
   * 是否有多个变体
   */
  hasMultipleVariants(): boolean {
    return itemHelpers.hasMultipleVariants(this._data);
  }

  /**
   * 当前变体是否有多个图案
   */
  hasPatterns(): boolean {
    const variant = this.getCurrentVariant();
    return variant ? variant.patterns.length > 1 : false;
  }

  /**
   * 获取当前选中的变体索引
   */
  getVariantIndex(): number {
    return this._currentVariantIndex.value;
  }

  /**
   * 设置当前变体索引
   */
  setVariantIndex(index: number): void {
    if (index >= 0 && index < this.getVariantCount()) {
      this._currentVariantIndex.value = index;
      this._currentPatternIndex.value = 0; // 切换变体时重置图案
    }
  }

  /**
   * 获取当前选中的图案索引
   */
  getPatternIndex(): number {
    return this._currentPatternIndex.value;
  }

  /**
   * 设置当前图案索引
   */
  setPatternIndex(index: number): void {
    const currentVariant = this.getCurrentVariant();
    if (currentVariant && index >= 0 && index < currentVariant.patterns.length) {
      this._currentPatternIndex.value = index;
    }
  }

  /**
   * 获取当前选中的变体
   */
  getCurrentVariant(): VariantGroup | null {
    const variants = this.getVariantGroups();
    if (variants.length === 0) return null;
    
    const index = Math.max(0, Math.min(this._currentVariantIndex.value, variants.length - 1));
    return variants[index] || null;
  }

  /**
   * 获取当前选中的图案
   */
  getCurrentPattern(): Pattern | null {
    const variant = this.getCurrentVariant();
    if (!variant || variant.patterns.length === 0) return null;
    
    const index = Math.max(0, Math.min(this._currentPatternIndex.value, variant.patterns.length - 1));
    return variant.patterns[index] || null;
  }

  /**
   * 根据索引获取变体
   */
  getVariantByIndex(index: number): VariantGroup | null {
    const variants = this.getVariantGroups();
    return variants[index] || null;
  }

  /**
   * 根据名称获取变体
   */
  getVariantByName(name: string): VariantGroup | null {
    return this.getVariantGroups().find(v => v.variantName === name) || null;
  }

  // ============ 显示属性（根据当前选中的变体/图案） ============

  /**
   * 获取当前显示的图片URL
   */
  getDisplayImage(): string {
    const pattern = this.getCurrentPattern();
    return pattern?.imageUrl || this._data.imageUrl;
  }

  /**
   * 获取当前显示的ID
   */
  getDisplayId(): number {
    const pattern = this.getCurrentPattern();
    return pattern?.id || this._data.id;
  }

  /**
   * 获取当前显示的颜色列表
   */
  getDisplayColors(): string[] {
    const pattern = this.getCurrentPattern();
    return pattern?.colors || this.getColors();
  }

  /**
   * 获取当前显示的完整名称（包含变体和图案）
   */
  getDisplayName(): string {
    const parts = [this.name];
    
    const variant = this.getCurrentVariant();
    if (variant?.variantName) {
      parts.push(variant.variantName);
    }
    
    const pattern = this.getCurrentPattern();
    if (pattern?.patternName) {
      parts.push(pattern.patternName);
    }
    
    return parts.join(' - ');
  }

  // ============ 原始数据访问 ============

  /**
   * 获取购买价格
   */
  getBuyPrice(): number | null {
    return this._data.originalData?.buy ?? null;
  }

  /**
   * 获取出售价格
   */
  getSellPrice(): number | null {
    return this._data.originalData?.sell ?? null;
  }

  /**
   * 是否可DIY
   */
  isDIY(): boolean {
    return this._data.originalData?.diy ?? false;
  }

  /**
   * 是否可定制
   */
  isCustomizable(): boolean {
    const bodyCustomize = this._data.originalData?.bodyCustomize ?? false;
    const patternCustomize = this._data.originalData?.patternCustomize ?? false;
    return bodyCustomize || patternCustomize;
  }

  /**
   * 是否为户外物品
   */
  isOutdoor(): boolean {
    return this._data.originalData?.outdoor ?? false;
  }

  /**
   * 是否可交互
   */
  isInteractive(): boolean {
    return this._data.originalData?.interact ?? false;
  }

  /**
   * 获取HHA基础分数
   */
  getHHAPoints(): number | null {
    return this._data.originalData?.hhaBasePoints ?? null;
  }

  /**
   * 获取堆叠数量
   */
  getStackSize(): number {
    return this._data.originalData?.stackSize ?? 1;
  }

  // ============ 工具方法 ============

  /**
   * 根据颜色筛选查找匹配的变体和图案
   */
  findVariantByColor(color: string): { variantIndex: number; patternIndex: number } | null {
    return itemHelpers.findColorVariantIndex(this._data, color);
  }

  /**
   * 切换到指定颜色的变体
   */
  switchToColorVariant(color: string): boolean {
    const match = this.findVariantByColor(color);
    if (match) {
      this.setVariantIndex(match.variantIndex);
      this.setPatternIndex(match.patternIndex);
      // 更新显示属性
      const pattern = this.getCurrentPattern();
      if (pattern) {
        this._data.id = pattern.id;
        this._data.imageUrl = pattern.imageUrl;
      }
      return true;
    }
    return false;
  }

  /**
   * 克隆物品模型
   */
  clone(): ItemModel {
    return new ItemModel({ ...this._data });
  }

  /**
   * 转换为JSON
   */
  toJSON(): Item {
    return this._data;
  }

  /**
   * 从普通对象创建物品模型
   */
  static fromJSON(data: Item): ItemModel {
    return new ItemModel(data);
  }

  /**
   * 批量创建物品模型
   */
  static fromArray(items: Item[]): ItemModel[] {
    return items.map(item => new ItemModel(item));
  }
}
