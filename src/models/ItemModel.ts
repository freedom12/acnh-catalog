import { type Item, type Variant, type Pattern } from "../types";
import { reactive } from "vue";
import { processImageUrl } from "../utils/imageUtils";
import {
  ItemTypeNameMap,
  versionNameMap,
  itemSizeNameMap,
  getHHASeriesName,
  getTagName,
  getSourceName,
  getColorName,
  getClothingStyleName,
  getHHAConceptName,
  getHHASetName,
  getClothingThemeName,
  getHHACategoryName,
  getActivityName,
  type Price,
  getItemVariantTitle,
  getPriceWithIcon,
  getCusCost,
} from "../services/dataService";
import {
  Color,
  Version,
  ItemSize,
  FurnitureTypes,
  ClothingTypes,
  ItemType,
} from "../types/item";
import type { Recipe } from "../types/recipe";
import { useRecipesData } from "../composables/useRecipesData";

const { recipeIdMap } = useRecipesData();
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

  get type(): ItemType {
    return this._data.type;
  }

  get isFurniture(): boolean {
    return FurnitureTypes.includes(this.type);
  }

  get isClothing(): boolean {
    return ClothingTypes.includes(this.type);
  }

  get isMaterial(): boolean {
    return this.type === ItemType.Other;
  }

  get typeName(): string {
    return ItemTypeNameMap[this.type] || "未知类型";
  }

  get version(): Version {
    return this._data.ver;
  }

  get versionName(): string {
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

  get buyPrices(): Price[] {
    let prices: Price[] = [];
    if (this._data.buy !== undefined && (this._data.buy as number) >= 0) {
      prices.push(this._data.buy);
    }
    if (this._data.exch !== undefined) {
      prices.push(this._data.exch);
    }
    return prices;
  }

  get buyPriceStrs(): string[] {
    return this.buyPrices
      .map((price) => getPriceWithIcon(price))
      .filter((str) => str !== "");
  }

  get sellPrice(): Price | null {
    return this._data.sell || null;
  }

  get sellPriceStr(): string {
    return getPriceWithIcon(this.sellPrice) || "不可出售";
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

  get sourceNotes(): string[] {
    return this._data.sourceNotes || [];
  }

  get sourceWithNotes(): Array<{ name: string; note?: string }> {
    return this.sources.map((source, index) => ({
      name: getSourceName(source) || source,
      note: this.sourceNotes[index] || undefined,
    }));
  }

  get activity(): string | null {
    return this._data.activity || null;
  }

  get activityName(): string {
    return getActivityName(this.activity || "") || "--";
  }

  get hhaPoints(): number | null {
    return this._data.points || null;
  }

  get hhaSeries(): string {
    return this._data.series || "";
  }

  get hhaSeriesName(): string {
    return getHHASeriesName(this.hhaSeries) || "--";
  }

  get hhaConcepts(): string[] {
    return this._data.concepts || [];
  }

  get hhaConceptNames(): string[] {
    return this.hhaConcepts.map((c) => getHHAConceptName(c) || c);
  }

  get hhaSet(): string {
    return this._data.set || "";
  }

  get hhaSetName(): string {
    return getHHASetName(this.hhaSet) || "--";
  }

  get hhaCategory(): string {
    return this._data.category || "";
  }

  get hhaCategoryName(): string {
    return getHHACategoryName(this.hhaCategory) || "--";
  }

  get closingThemes(): string[] {
    return this._data.themes || [];
  }

  get closingThemeNames(): string[] {
    return this.closingThemes.map((t) => getClothingThemeName(t) || t);
  }

  get clothingStyles(): string[] {
    return this._data.styles || [];
  }

  get clothingStyleNames(): string[] {
    return this.clothingStyles.map((s) => getClothingStyleName(s) || s);
  }

  get recipeId(): number | null {
    return this._data.recipe || null;
  }

  get canDIY(): boolean {
    return !!this.recipeId;
  }

  get recipe(): Recipe | null {
    if (!this.recipeId) return null;
    return recipeIdMap.value[this.recipeId] || null;
  }

  // ============ 变体相关 ============
  get canCustomize(): boolean {
    return !this.isClothing && this.hasVariations;
  }

  get vTitle(): string {
    return this._data.vt || "";
  }
  get vTitleName(): string {
    return getItemVariantTitle(this.vTitle) || "样式";
  }
  get pTitle(): string {
    return this._data.pt || "";
  }
  get pTitleName(): string {
    return getItemVariantTitle(this.pTitle) || "图案";
  }
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

  isVariantCusOnlyByCyrus(vIndex?: number): boolean {
    if (!this.canCustomize) return false;
    if (!this._data.iv) return true; // 图案可定制则不是纯定制
    let vIdx = vIndex === undefined ? this.variantIndex : vIndex;
    const variant = this.variantGroups[vIdx];
    if (!variant) return false;
    const pattern = variant.patterns[0];
    if (!pattern) return false;
    if (!pattern.cus) return false;
    if (pattern.cus[1][0]) return false;
    return true;
  }

  isPatternCusOnlyByCyrus(pIndex?: number): boolean {
    if (!this.canCustomize) return false;
    if (!this._data.ip) return true; // 变体可定制则不是纯定制
    let pIdx = pIndex === undefined ? this.patternIndex : pIndex;
    const variant = this.variantGroups[0];
    if (!variant) return false;
    const pattern = variant.patterns[pIdx];
    if (!pattern) return false;
    if (!pattern.cus) return false;
    if (pattern.cus[1][0]) return false;
    return true;
  }

  getCostStrs(vIndex?: number, pIndex?: number): string[] {
    const pattern = this.getPattern(vIndex, pIndex);
    if (!pattern || !pattern.cus) return [];
    const [price, cusCost] = pattern.cus;
    const parts: string[] = [];
    if (price) {
      parts.push(getPriceWithIcon(price));
    }
    if (cusCost) {
      const [kitCost, _] = cusCost;
      if (kitCost) parts.push(getCusCost(cusCost));
    }
    return parts;
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

  getPattern(vIndex?: number, pIndex?: number): Pattern | null {
    let vIdx = vIndex !== undefined ? vIndex : this.variantIndex;
    let pIdx = pIndex !== undefined ? pIndex : this.patternIndex;
    const variants = this.variantGroups;
    if (vIdx < 0 || vIdx >= variants.length) return null;
    const variant = variants[vIdx];
    if (!variant) return null;
    if (pIdx < 0 || pIdx >= variant.patterns.length) return null;
    return variant.patterns[pIdx] || null;
  }

  // ============ 匹配筛选方法 ============
  matchesColor(color?: Color): boolean {
    if (color === undefined) return true;
    return !!this.findVariantByColor(color);
  }

  matchesType(type?: ItemType): boolean {
    if (type === undefined) return true;
    return this.type === type;
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
    return this.hhaSeries === series;
  }

  matchesSource(source: string): boolean {
    if (!source) return true;
    return this.hasSource(source);
  }

  matchesTheme(theme: string): boolean {
    if (!theme) return true;
    return this.closingThemes.includes(theme);
  }

  matchesStyle(style: string): boolean {
    if (!style) return true;
    return this.clothingStyles.includes(style);
  }

  matchesConcept(concept: string): boolean {
    if (!concept) return true;
    return this.hhaConcepts.includes(concept);
  }

  matchesSet(set: string): boolean {
    if (!set) return true;
    return this.hhaSet === set;
  }

  matchesCategory(category: string): boolean {
    if (!category) return true;
    return this.hhaCategory === category;
  }
}
