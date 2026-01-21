import type { Gender, Hobby, Version } from './index';

/**
 * NPC数据类型
 */
export interface NPC {
  id: string;
  order: number;
  name: string;
  rawName: string;
  images: string[];
  ver: Version;
  gender: Gender;
  birthday: string;

  hobby: Hobby;
  umbrella?: number;
  umbrellaHHP?: number;

  nameColor: string;
  bubbleColor: string;
}
