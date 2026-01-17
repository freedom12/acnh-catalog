/**
 * 贺卡类型定义
 */

import type { Price } from './index';
import type { Version } from './item';

export interface MessageCard {
  id: number;
  name: string;
  rawName: string;
  image: string;
  ver: Version;
  buy?: Price;
  backColor?: string;
  bodyColor: string;
  headColor: string;
  footColor: string;
  penColors: string[];
  startDate?: string;
  endDate?: string;
  nhStartDate?: string;
  nhEndDate?: string;
  shStartDate?: string;
  shEndDate?: string;
}
