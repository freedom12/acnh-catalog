import type { Version } from "./item";

export interface Music {
  id: number;
  order: number;
  name: string;
  rawName: string;
  image: string;
  ver: Version;
  hasRadio: boolean;
  mood: string;
}