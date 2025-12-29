import type { Version } from "./index";

export const ConstructionType = {
  Bridge: 1,
  Door: 2,
  Incline: 3,
  Mailbox: 4,
  Roofing: 5,
  Siding: 6,
  Other: 7,
} as const;

export type ConstructionType = (typeof ConstructionType)[keyof typeof ConstructionType];
/**
 * 改建数据类型
 */
export interface Construction {
  id: number;
  name: string;
  rawName: string;
  image: string;
  ver: Version;
  type: ConstructionType;
  buy?: number;
  source: string[];
}
