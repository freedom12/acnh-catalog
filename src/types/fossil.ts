import type { Price } from '../services/dataService';
import type { ItemSize } from './item';

export const FossilType = {
  PZ: 1,
  MZ: 2,
  CZ: 3,
} as const;

export type FossilType = (typeof FossilType)[keyof typeof FossilType];

export interface Fossil {
  name: string;
  type: FossilType;
  parts: {
    id: number;
    name: string;
    image: string;
    size: ItemSize;
    sell: Price;
  }[];
  desc: string;
}

const FossilTypeNameMap: Record<FossilType, string> = {
  [FossilType.PZ]: '古生代',
  [FossilType.MZ]: '中生代',
  [FossilType.CZ]: '新生代',
};

export function getFossilTypeName(type: FossilType): string {
  return FossilTypeNameMap[type];
}
