import type { Price } from './index';
import type { Version } from './item';

export const PlantType = {
  Tree: 1,
  Bush: 2,
  Crop: 3,
  Flower: 4,
  Mushroom: 5,
  Other: 6,
} as const;
export type PlantType = (typeof PlantType)[keyof typeof PlantType];
export interface Plant {
  id: number;
  name: string;
  rawName: string;
  ver: Version;
  images: string[];
  type: PlantType;
  sell: Price;
  product?: number;
  seeds?: number;
}
