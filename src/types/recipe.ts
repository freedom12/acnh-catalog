import type { Price } from "../services/dataService";
import type { Version } from "./item";

/**
 * DIY配方数据类型
 */
export const RecipeType = {
  Tools: 1,
  Housewares: 2,
  Miscellaneous: 3,
  WallMounted: 4,
  CeilingDecor: 5,
  Wallpaper: 6,
  Floors: 7,
  Rugs: 8,
  Equipment: 9,
  Other: 10,
  Savory: 11,
  Sweet: 12,
} as const;

export type RecipeType = (typeof RecipeType)[keyof typeof RecipeType];

export const RecipeColor = {} as const;

export type RecipeColor = (typeof RecipeColor)[keyof typeof RecipeColor];

export interface Recipe {
  id: number;
  type: RecipeType;
  name: string;
  rawName: string;
  images: string[];
  ver: Version;
  buy?: Price;
  sell?: Price;
  cardColor?: string;
  itemId: number;
  activity?: string;
  source: string[];
  sourceNotes?: string[];
  materials: Record<string, number>;
}
