/**
 * 植物相关映射表
 */
import { PlantType } from '../../types';

export const PlantTypeNameMap: Record<PlantType, string> = {
  [PlantType.Tree]: '树木',
  [PlantType.Bush]: '灌木',
  [PlantType.Crop]: '作物',
  [PlantType.Flower]: '花朵',
  [PlantType.Mushroom]: '菌类',
  [PlantType.Other]: '其他',
};
