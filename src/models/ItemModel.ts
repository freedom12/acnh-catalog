import { type Item, type Variant, type Pattern, type Price } from '../types';
import { reactive } from 'vue';
import { processImageUrl } from '../utils/imageUtils';
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
  getItemVariantTitle,
  getPriceWithIcon,
  getCusCost,
  getCatalogName,
  getImgUrl,
} from '../services/dataService';
import {
  Color,
  Version,
  ItemSize,
  FurnitureTypes,
  ClothingTypes,
  ItemType,
  getItemTagOrder,
  getHousewareTagGroupIndex,
  getMiscellaneousTagGroupIndex,
  Catalog,
  InteractType,
  SpeakerType,
  LightType,
  SoundType,
  VfxType,
} from '../types/item';
import { RecipeType, type Recipe } from '../types/recipe';
import { useRecipesData } from '../composables/useRecipesData';
import { useActivitysData } from '../composables/useActivitysData';

const { recipeIdMap } = useRecipesData();
const { getGroupsByIds, getGroupName } = useActivitysData();
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

  get order(): number {
    return this._data.o ?? 999999;
  }

  get name(): string {
    return this._data.n;
  }

  get rawName(): string {
    return this._data.nr;
  }

  get images(): string[] {
    return this._data.i.map((img) => processImageUrl(img));
  }

  get image(): string {
    return this.images[0] || '';
  }

  get icon(): string {
    if (this._data.ic) {
      return processImageUrl(this._data.ic);
    }
    if (this._data.ict) {
      return getImgUrl(`img/icon/inventory/${this._data.ict}.png`);
    }
    return this.image;
  }

  get hasIcon(): boolean {
    return this.icon !== this.image;
  }

  get type(): ItemType {
    return this._data.t;
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
    return ItemTypeNameMap[this.type] || '未知分类';
  }

  get typeNameShort(): string {
    const l = this.typeName.split('/');
    return l[l.length - 1] || this.typeName;
  }

  get version(): Version {
    return this._data.v;
  }

  get versionName(): string {
    return versionNameMap[this.version] || '未知版本';
  }

  get size(): ItemSize | undefined {
    return this._data.s;
  }

  get sizeName(): string {
    if (this.size === undefined) return '未知尺寸';
    return itemSizeNameMap[this.size] || '未知尺寸';
  }
  get colors(): Color[] {
    return this._data.c;
  }

  hasColor(color: Color): boolean {
    return this.colors.includes(color);
  }

  get colorNames(): string[] {
    return this.colors.map((color) => getColorName(color) || '');
  }

  get catalog(): Catalog {
    return this._data.cat;
  }

  get catalogName(): string {
    return getCatalogName(this.catalog);
  }

  get buyPrices(): Price[] {
    let prices: Price[] = [];
    if (this._data.buy !== undefined && (this._data.buy as number) >= 0) {
      prices.push(this._data.buy);
    }
    if (this._data.exc !== undefined) {
      prices.push(this._data.exc);
    }
    return prices;
  }

  get buyPriceStrs(): string[] {
    return this.buyPrices
      .map((price) => getPriceWithIcon(price))
      .filter((str) => str !== '');
  }

  get sellPrice(): Price | null {
    return this._data.sel || null;
  }

  get sellPriceStr(): string {
    return getPriceWithIcon(this.sellPrice) || '不可出售';
  }

  get tag(): string {
    return this._data.tag || '';
  }

  get tagName(): string {
    return getTagName(this.tag) || '--';
  }

  get tagOrder(): number {
    return getItemTagOrder(this.tag);
  }

  get sources(): string[] {
    return this._data.srcs || [];
  }

  hasSource(source: string): boolean {
    return this.sources.includes(source);
  }

  get sourceNames(): string[] {
    return this.sources.map((s) => getSourceName(s) || s);
  }

  get sourceNotes(): string[] {
    return this._data.srcN || [];
  }

  get sourceWithNotes(): Array<{ name: string; note?: string }> {
    return this.sources.map((source, index) => ({
      name: getSourceName(source) || source,
      note: this.sourceNotes[index] || undefined,
    }));
  }

  get activitys(): string[] {
    return this._data.acts || [];
  }

  get activityGroups(): string[] {
    return getGroupsByIds(this._data.acts || []);
  }

  get activityGroupNames(): string[] {
    return this.activityGroups.map((group) => getGroupName(group, true) || group);
  }

  get hhaPoints(): number | null {
    return this._data.hpt || null;
  }

  get hhaSeries(): string {
    return this._data.hser || '';
  }

  get hhaSeriesName(): string {
    return getHHASeriesName(this.hhaSeries) || '--';
  }

  get hhaConcepts(): string[] {
    return this._data.hcpt || [];
  }

  get hhaConceptNames(): string[] {
    return this.hhaConcepts.map((c) => getHHAConceptName(c) || c);
  }

  get hhaSet(): string {
    return this._data.hset || '';
  }

  get hhaSetName(): string {
    return getHHASetName(this.hhaSet) || '--';
  }

  get hhaCategory(): string {
    return this._data.hcat || '';
  }

  get hhaCategoryName(): string {
    return getHHACategoryName(this.hhaCategory) || '--';
  }

  get clothingThemes(): string[] {
    return this._data.thms || [];
  }

  get clothingThemeNames(): string[] {
    return this.clothingThemes.map((t) => getClothingThemeName(t) || t);
  }

  get clothingStyles(): string[] {
    return this._data.stls || [];
  }

  get clothingStyleNames(): string[] {
    return this.clothingStyles.map((s) => getClothingStyleName(s) || s);
  }

  get recipeId(): number | null {
    return this._data.diy || null;
  }

  get canDIY(): boolean {
    return !!this.recipeId;
  }

  get diyType(): number {
    if (!this.canDIY) return 0;
    const recipe = this.recipe;
    if (!recipe) return 0;
    if (recipe.type === RecipeType.Savory || recipe.type === RecipeType.Sweet) {
      return 2;
    } else {
      return 1;
    }
  }

  get recipe(): Recipe | null {
    if (!this.recipeId) return null;
    return recipeIdMap.value[this.recipeId] || null;
  }

  get foodPower(): number | null {
    return this._data.fd || null;
  }

  get isFood(): boolean {
    return this.foodPower !== null;
  }

  get stackSize(): number | null {
    return this._data.ss || null;
  }

  get isStackable(): boolean {
    return this.stackSize !== null && this.stackSize > 1;
  }

  get useTimes(): number | null {
    return this._data.us || null;
  }

  get isHandable(): boolean {
    return this.useTimes !== null;
  }

  get isOutdoorFurniture(): boolean {
    return this._data.iod === true;
  }

  get isSurfaceFurniture(): boolean {
    return this._data.isf === true;
  }

  get isDoorDecoFurniture(): boolean {
    return this._data.idd === true;
  }

  get interactType(): InteractType | null {
    return this._data.it || null;
  }
  get hasInteract(): boolean {
    return this.interactType !== null;
  }

  get speakerType(): SpeakerType | null {
    return this._data.st || null;
  }
  get hasSpeaker(): boolean {
    return this.speakerType !== null;
  }

  get lightType(): LightType | null {
    return this._data.lt || null;
  }
  get hasLight(): boolean {
    return this.lightType !== null;
  }

  get soundType(): SoundType | null {
    return this._data.sdt || null;
  }
  get hasSound(): boolean {
    return this.soundType !== null;
  }

  get vfxType(): VfxType | null {
    return this._data.vfxt || null;
  }
  get hasVfx(): boolean {
    return this.vfxType !== null;
  }

  // ============ 变体相关 ============
  get vTitle(): string {
    return this._data.vt || '';
  }
  get vTitleName(): string {
    return getItemVariantTitle(this.vTitle) || '样式';
  }
  get pTitle(): string {
    return this._data.pt || '';
  }
  get pTitleName(): string {
    return getItemVariantTitle(this.pTitle) || '图案';
  }
  get hasVariations(): boolean {
    return this.variantCount > 1;
  }

  get variantGroups(): Variant[] {
    return this._data.vs || [];
  }

  get variantCount(): number {
    return this.variantGroups.length;
  }

  get hasPatterns(): boolean {
    const variant = this.currentVariant;
    return variant ? variant.length > 1 : false;
  }

  get patternCount(): number {
    const variant = this.currentVariant;
    return variant ? variant.length : 0;
  }

  get canCustomize(): boolean {
    return this.canCustomizeVariant || this.canCustomizePattern;
  }

  get canCustomizeVariant(): boolean {
    return (
      this.hasVariations &&
      (this.canCustomizeVariantByCyrus || this.canCustomizeVariantBySelf)
    );
  }

  get canCustomizeVariantBySelf(): boolean {
    if (!this._data.iv) return false;
    return this._data.iv[0] === 1 || this.indexCustomizeVariantOnlyByCyrus !== null;
  }

  get canCustomizeVariantByCyrus(): boolean {
    if (!this._data.iv) return false;
    return this._data.iv[1] > 0;
  }

  get indexCustomizeVariantOnlyByCyrus(): number | null {
    if (!this._data.iv) return null;
    const index = this._data.iv[2];
    return index !== undefined ? index : null;
  }

  isCustomizeVariantOnlyByCyrus(vIndex: number): boolean {
    if (this.canCustomizeVariantByCyrus && !this.canCustomizeVariantBySelf) {
      return true;
    }
    let index = this.indexCustomizeVariantOnlyByCyrus;
    if (index === null) return false;
    return vIndex === index;
  }

  get canCustomizePattern(): boolean {
    return this.hasPatterns && (this._data.ip ? this._data.ip[0] === 1 : false);
  }

  get canCustomizePatternWithSableDesign(): boolean {
    return this._data.ip ? this._data.ip[1] === 1 : false;
  }
  get canCustomizePatternWithMyDesign(): boolean {
    return this._data.ip ? this._data.ip[2] === 1 : false;
  }

  get cusCostStrs(): string[] {
    if (!this._data.iv) return [];
    const [_, price, __] = this._data.iv;
    const parts: string[] = [];
    if (price) {
      parts.push(getPriceWithIcon(price));
    }
    if (!this._data.cus) return parts;
    const [kitCost, ___] = this._data.cus;
    if (kitCost) {
      parts.push(getCusCost(this._data.cus));
    }
    return parts;
  }

  get variantIndex(): number {
    return this._state.currentVariantIndex;
  }

  set variantIndex(index: number) {
    if (index >= 0 && index < this.variantCount) {
      this._state.currentVariantIndex = index;
      this.patternIndex = this.patternIndex;
    }
  }

  get patternIndex(): number {
    return this._state.currentPatternIndex;
  }

  set patternIndex(index: number) {
    const currentVariant = this.currentVariant;
    if (currentVariant && index >= 0 && index < currentVariant.length) {
      this._state.currentPatternIndex = index;
    } else {
      this._state.currentPatternIndex = 0;
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
    if (!variant || variant.length === 0) return null;

    const index = Math.max(
      0,
      Math.min(this._state.currentPatternIndex, variant.length - 1)
    );
    return variant[index] || null;
  }

  getVName(vIndex?: number): string {
    vIndex = vIndex !== undefined ? vIndex : this.variantIndex;
    if (this._data.vn && vIndex >= 0 && vIndex < this._data.vn.length) {
      return this._data.vn[vIndex] || '无';
    }
    return '无';
  }

  getPName(pIndex?: number): string {
    pIndex = pIndex !== undefined ? pIndex : this.patternIndex;
    if (this._data.pn && pIndex >= 0 && pIndex < this._data.pn.length) {
      return this._data.pn[pIndex] || '无';
    }
    return '无';
  }

  getDisplayId(): number {
    const pattern = this.currentPattern;
    return pattern?.id || this.id;
  }

  getDisplayColors(): Color[] {
    const pattern = this.currentPattern;
    return pattern?.c || this.colors;
  }

  getDisplayImages(): string[] {
    return this.getPatternImages();
  }

  getDisplayName(): string {
    const parts = [this.name];
    if (this._data.vn) {
      parts.push(this._data.vn[this.variantIndex] || '');
    }
    if (this._data.pn) {
      parts.push(this._data.pn[this.patternIndex] || '');
    }
    return parts.join(' - ');
  }

  getPatternById(id: number): Pattern | null {
    for (const variantGroup of this.variantGroups) {
      for (const pattern of variantGroup) {
        if (pattern.id === id) {
          return pattern;
        }
      }
    }
    return null;
  }

  getPattern(vIndex?: number, pIndex?: number): Pattern | null {
    let vIdx = vIndex !== undefined ? vIndex : this.variantIndex;
    let pIdx = pIndex !== undefined ? pIndex : this.patternIndex;
    const variants = this.variantGroups;
    if (vIdx < 0 || vIdx >= variants.length) return null;
    const variant = variants[vIdx];
    if (!variant) return null;
    if (pIdx < 0 || pIdx >= variant.length) return null;
    return variant[pIdx] || null;
  }

  getPatternImagesById(id: number): string[] {
    let vIndex = 0;
    let pIndex = 0;

    for (const variantGroup of this.variantGroups) {
      for (const pattern of variantGroup) {
        if (pattern.id === id) {
          return this.getPatternImages(vIndex, pIndex);
        }
        pIndex++;
      }
      vIndex++;
    }
    return this.images;
  }

  getPatternImages(vIndex?: number, pIndex?: number): string[] {
    let vIdx = vIndex !== undefined ? vIndex : this.variantIndex;
    let pIdx = pIndex !== undefined ? pIndex : this.patternIndex;
    let images = [...this.images];
    let pattern = this.getPattern(vIndex, pIndex);
    if (pattern && pattern.i) {
      images = pattern.i;
    }
    images = images.map((img) => {
      if (img.includes('0_0')) {
        img = img.replace('0_0', `${vIdx}_${pIdx}`);
      }
      return processImageUrl(img);
    });
    return images;
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
        for (let pIdx = 0; pIdx < variant.length; pIdx++) {
          const pattern = variant[pIdx];
          if (pattern?.c.includes(color)) {
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

  switchToIdVariant(id: number): boolean {
    const pattern = this.getPatternById(id);
    if (pattern) {
      const variants = this.variantGroups;
      for (let vIdx = 0; vIdx < variants.length; vIdx++) {
        const variant = variants[vIdx];
        if (variant) {
          const pIdx = variant.findIndex((p) => p.id === id);
          if (pIdx >= 0) {
            this.variantIndex = vIdx;
            this.patternIndex = pIdx;
            return true;
          }
        }
      }
    }
    return false;
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

  matchesCatalog(catalog?: Catalog): boolean {
    if (!catalog) return true;
    return this.catalog === catalog;
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
    return this.clothingThemes.includes(theme);
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

  matchesActivity(activity: string): boolean {
    if (!activity) return true;
    return this.activityGroups.includes(activity);
  }

  matchesId(id: number): boolean {
    if (!id) return true;
    if (this.id === id) return true;
    for (const variantGroup of this.variantGroups) {
      for (const pattern of variantGroup) {
        if (pattern.id === id) {
          return true;
        }
      }
    }
    return false;
  }

  get subtype(): number {
    if (!this.tag) return 0;
    if (this.type === ItemType.Housewares) {
      const tag = this.tag;
      const groupIndex = getHousewareTagGroupIndex(tag);
      if (groupIndex) return groupIndex;
    } else if (this.type === ItemType.Miscellaneous) {
      const tag = this.tag;
      const groupIndex = getMiscellaneousTagGroupIndex(tag);
      if (groupIndex) return groupIndex;
    } else if (this.type === ItemType.CeilingDecor) {
      const tag = this.tag;
      if (tag === 'CeilingLamp') {
        return 1;
      } else if (tag === 'CeilingEtc') {
        return 2;
      }
    } else if (this.type === ItemType.Wallpaper || this.type === ItemType.Floors) {
      if (this._data.vfxt) {
        return 2;
      } else {
        return 1;
      }
    } else if (this.type === ItemType.Creatures) {
      const tag = this.tag;
      if (tag === 'Insects') {
        return 1;
      } else if (tag === 'Fish') {
        return 2;
      } else if (tag === 'Sea Creatures') {
        return 3;
      }
    }
    return 0;
  }
}
