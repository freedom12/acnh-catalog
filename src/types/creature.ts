import type { Price } from '../services/dataService';
import { Color, type ItemSize, type Version } from './index';

export const CreatureType = {
  Insects: 1,
  Fish: 2,
  SeaCreatures: 3,
} as const;

export type CreatureType = (typeof CreatureType)[keyof typeof CreatureType];
/**
 * 半球时间信息
 */
export interface HemisphereInfo {
  time: string[];
  timeArray: Array<number[] | number>;
  months: string[];
  monthsArray: number[];
}

/**
 * 生物数据类型（昆虫、鱼类等）
 */
export interface Creature {
  type: CreatureType;
  id: number;
  order: number;
  name: string;
  rawName: string;
  images: string[];
  ver: Version;
  size: ItemSize;
  colors: Color[];
  sell: Price;
  whereHow?: string;
  weather?: string;
  hemispheres: {
    north: HemisphereInfo;
    south: HemisphereInfo;
  };
  catchPhrase: string;
  desc: string;
}
