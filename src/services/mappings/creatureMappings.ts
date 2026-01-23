/**
 * 生物相关映射表
 */
import { CreatureType } from '../../types';

export const CreatureTypeNameMap: Record<CreatureType, string> = {
  [CreatureType.Insects]: '昆虫',
  [CreatureType.Fish]: '鱼类',
  [CreatureType.SeaCreatures]: '海洋生物',
};
