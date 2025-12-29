import type { Color, ItemSize, ItemType, Version } from "./item";

export interface Artwork {
  id: number;
  //   order: number;
  name: string;
  rawName: string;
  image: string;
  texture?: string;
  ver: Version;
  size: ItemSize;
  colors: Color[];
  title: string;
  artist: string;
  age: string;
  technique: string;
  desc: string;
  itemType: ItemType;
  source: string[];
  buy: number;
  sell: number;
  fake?: {
    id: number;
    image: string;
    texture?: string;
  };
}