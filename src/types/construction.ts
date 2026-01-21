import type { Price } from './index';
import type { Version } from './index';

export const ConstructionType = {
  Roof: 1,
  Siding: 2,
  Door: 3,
  Mailbox: 4,
  Bridge: 5,
  Incline: 6,
  // Other: 7,
} as const;

export type ConstructionType = (typeof ConstructionType)[keyof typeof ConstructionType];
/**
 * 改建数据类型
 */
export interface Construction {
  id: number;
  order: number;
  name: string;
  rawName: string;
  image: string;
  ver: Version;
  type: ConstructionType;
  buy?: Price;
  source: string[];
}
