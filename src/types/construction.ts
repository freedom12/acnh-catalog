import type { Price } from "../services/dataService";
import type { Version } from "./index";

export const ConstructionType = {
  Door: 1,
  Mailbox: 2,
  Siding: 3,
  Roofing: 4,
  Bridge: 5,
  Incline: 6,
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
  buy?: Price;
  source: string[];
}
