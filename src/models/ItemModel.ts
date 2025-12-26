import type { Item, Variant, Pattern } from "../types";
import { reactive } from "vue";
import { processImageUrl } from "../utils/imageUtils";
import {
  ItemCategoryNameMap,
  versionNameMap,
  itemSizeNameMap,
  getSeriesName,
  getTagName,
  getSourceName,
  getColorName,
  getStyleName,
  getConceptName,
  getSetName,
  getThemeName,
} from "../services/dataService";
import { Color, Version, ItemSize, FurnitureCategories, ClothingCategories, ItemCategory } from "../types/item";
import { formatPrice } from "../utils/common";

export class ItemModel {
  private readonly _data: Item;
  private _state: {
    currentVariantIndex: number;
    currentPatternIndex: number;
    owned: boolean;
  };

  constructor(item: Item) {
    this._data = item;
    this._state = reactive({
      currentVariantIndex: 0,
      currentPatternIndex: 0,
      owned: false,
    });
  }

  get raw(): Item {
    return this._data;
  }

  get owned(): boolean {
    return this._state.owned;
  }

  set owned(value: boolean) {
    this._state.owned = value;
  }
  // ============ 基础属性访问 ============
  get id(): number {
    return this._data.id;
  }

  get name(): string {
    return this._data.name;
  }

  get rawName(): string {
    return this._data.rawName;
  }

  get images(): string[] {
    return this._data.images.map(processImageUrl);
  }

  get image(): string {
    return this.images[0] || "";
  }

  get category(): ItemCategory {
    return this._data.category;
  }

  get isFurniture(): boolean {
    return FurnitureCategories.includes(this.category);
  }

  get isClothing(): boolean {
    return ClothingCategories.includes(this.category);
  }

  get isMaterial(): boolean {
    return this.category === ItemCategory.Other;
  }

  get categoryName(): string {
    return ItemCategoryNameMap[this.category] || "未知分类";
  }

  get version(): Version | undefined {
    return this._data.ver;
  }

  get versionName(): string {
    if (this.version === undefined) return "未知版本";
    return versionNameMap[this.version] || "未知版本";
  }

  get size(): ItemSize | undefined {
    return this._data.size;
  }

  get sizeName(): string {
    if (this.size === undefined) return "未知尺寸";
    return itemSizeNameMap[this.size] || "未知尺寸";
  }
  get colors(): Color[] {
    return this._data.colors;
  }

  hasColor(color: Color): boolean {
    return this.colors.includes(color);
  }

  get colorNames(): string[] {
    return this.colors.map((color) => getColorName(color) || "");
  }

  get buyPrice(): number | null {
    return this._data.buy ?? null;
  }

  get buyPriceStr(): string {
    return formatPrice(this.buyPrice);
  }

  get sellPrice(): number | null {
    return this._data.sell ?? null;
  }

  get sellPriceStr(): string {
    return formatPrice(this.sellPrice);
  }

  get tag(): string {
    return this._data.tag || "";
  }

  get tagName(): string {
    return getTagName(this.tag) || "--";
  }

  get sources(): string[] {
    return this._data.source || [];
  }

  hasSource(source: string): boolean {
    return this.sources.includes(source);
  }

  get sourceNames(): string[] {
    return this.sources.map((s) => getSourceName(s) || s);
  }

  get series(): string {
    return this._data.series || "";
  }

  get seriesName(): string {
    return getSeriesName(this.series) || "--";
  }

  get themes(): string[] {
    return this._data.themes || [];
  }

  get themeNames(): string[] {
    return this.themes.map((t) => getThemeName(t) || t);
  }

  get set(): string {
    return this._data.set || "";
  }

  get setName(): string {
    return getSetName(this.set) || "--";
  }

  get styles(): string[] {
    return this._data.styles || [];
  }

  get styleNames(): string[] {
    return this.styles.map((style) => getStyleName(style) || style);
  }

  get concepts(): string[] {
    return this._data.concepts || [];
  }

  get conceptNames(): string[] {
    return this.concepts.map((concept) => getConceptName(concept) || "");
  }

  get canDIY(): boolean {
    return !!this._data.recipe;
  }
  // ============ 变体相关 ============
  get hasVariations(): boolean {
    const groups = this.variantGroups;
    return (
      groups.length > 0 &&
      (groups.length > 1 || (groups[0]?.patterns.length ?? 0) > 1)
    );
  }

  get variantGroups(): Variant[] {
    return this._data.variants || [];
  }

  get variantCount(): number {
    return this.variantGroups.length;
  }

  get hasPatterns(): boolean {
    const variant = this.currentVariant;
    return variant ? variant.patterns.length > 1 : false;
  }

  get patternCount(): number {
    const variant = this.currentVariant;
    return variant ? variant.patterns.length : 0;
  }

  get variantIndex(): number {
    return this._state.currentVariantIndex;
  }

  set variantIndex(index: number) {
    if (index >= 0 && index < this.variantCount) {
      this._state.currentVariantIndex = index;
      this._state.currentPatternIndex = 0; // 切换变体时重置图案
    }
  }

  get patternIndex(): number {
    return this._state.currentPatternIndex;
  }

  set patternIndex(index: number) {
    const currentVariant = this.currentVariant;
    if (
      currentVariant &&
      index >= 0 &&
      index < currentVariant.patterns.length
    ) {
      this._state.currentPatternIndex = index;
    }
  }

  get currentVariant(): Variant | null {
    const variants = this.variantGroups;
    if (variants.length === 0) return null;

    const index = Math.max(
      0,
      Math.min(this._state.currentVariantIndex, variants.length - 1)
    );
    return variants[index] || null;
  }

  get currentPattern(): Pattern | null {
    const variant = this.currentVariant;
    if (!variant || variant.patterns.length === 0) return null;

    const index = Math.max(
      0,
      Math.min(this._state.currentPatternIndex, variant.patterns.length - 1)
    );
    return variant.patterns[index] || null;
  }

  getDisplayId(): number {
    const pattern = this.currentPattern;
    return pattern?.id || this.id;
  }

  getDisplayColors(): Color[] {
    const pattern = this.currentPattern;
    return pattern?.colors || this.colors;
  }

  getDisplayImages(): string[] {
    const pattern = this.currentPattern;
    const imageUrl = pattern?.image || this.image;
    // 拷贝一个images数组，替换第一个元素为当前图案图片
    const images = [...this.images];
    images[0] = imageUrl;
    return images.map(processImageUrl);
  }

  getDisplayName(): string {
    const parts = [this.name];
    const variant = this.currentVariant;
    if (variant?.name) {
      parts.push(variant.name);
    }
    const pattern = this.currentPattern;
    if (pattern?.name) {
      parts.push(pattern.name);
    }
    return parts.join(" - ");
  }

  // ============ 原始数据访问 ============

  // /**
  //  * 是否可DIY
  //  */
  // isDIY(): boolean {
  //   return this._data.originalData?.diy ?? false;
  // }

  // /**
  //  * 是否可定制
  //  */
  // isCustomizable(): boolean {
  //   const bodyCustomize = this._data.originalData?.bodyCustomize ?? false;
  //   const patternCustomize = this._data.originalData?.patternCustomize ?? false;
  //   return bodyCustomize || patternCustomize;
  // }

  // /**
  //  * 是否为户外物品
  //  */
  // isOutdoor(): boolean {
  //   return this._data.originalData?.outdoor ?? false;
  // }

  // /**
  //  * 是否可交互
  //  */
  // isInteractive(): boolean {
  //   return this._data.originalData?.interact ?? false;
  // }

  // /**
  //  * 获取HHA基础分数
  //  */
  // getHHAPoints(): number | null {
  //   return this._data.originalData?.hhaBasePoints ?? null;
  // }

  // /**
  //  * 获取堆叠数量
  //  */
  // getStackSize(): number {
  //   return this._data.originalData?.stackSize ?? 1;
  // }

  // ============ 工具方法 ============

  /**
   * 根据颜色筛选查找匹配的变体和图案
   */
  findVariantByColor(
    color: Color
  ): { variantIndex: number; patternIndex: number } | null {
    // 遍历所有变体和图案
    const variants = this.variantGroups;
    if (variants.length === 0) {
      // 没有变体，检查物品本身的颜色
      return this.hasColor(color) ? { variantIndex: 0, patternIndex: 0 } : null;
    }
    // 有变体的情况
    for (let vIdx = 0; vIdx < variants.length; vIdx++) {
      const variant = variants[vIdx];
      if (variant) {
        for (let pIdx = 0; pIdx < variant.patterns.length; pIdx++) {
          const pattern = variant.patterns[pIdx];
          if (pattern?.colors.includes(color)) {
            return { variantIndex: vIdx, patternIndex: pIdx };
          }
        }
      }
    }

    return null;
  }

  /**
   * 切换到指定颜色的变体
   */
  switchToColorVariant(color: Color): boolean {
    const match = this.findVariantByColor(color);
    if (match) {
      this.variantIndex = match.variantIndex;
      this.patternIndex = match.patternIndex;
      return true;
    }
    return false;
  }

  // ============ 匹配筛选方法 ============
  matchesColor(color?: Color): boolean {
    if (color === undefined) return true;
    return !!this.findVariantByColor(color);
  }

  matchesCategory(category?: ItemCategory): boolean {
    if (category === undefined) return true;
    return this.category === category;
  }

  matchesVersion(version?: Version): boolean {
    if (version === undefined) return true;
    return this.version === version;
  }

  matchesSize(size?: ItemSize): boolean {
    if (size === undefined) return true;
    return this.size === size;
  }

  matchesTag(tag: string): boolean {
    if (!tag) return true;
    return this.tag === tag;
  }

  matchesSeries(series: string): boolean {
    if (!series) return true;
    return this.series === series;
  }

  matchesSource(source: string): boolean {
    if (!source) return true;
    return this.hasSource(source);
  }

  matchesTheme(theme: string): boolean {
    if (!theme) return true;
    return this.themes.includes(theme);
  }

  matchesStyle(style: string): boolean {
    if (!style) return true;
    return this.styles.includes(style);
  }
}
