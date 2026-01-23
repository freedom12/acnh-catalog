/**
 * 配方相关映射表
 */
import { RecipeType } from '../../types/recipe';

export const RecipeTypeNameMap: Record<RecipeType, string> = {
  [RecipeType.Tools]: '工具',
  [RecipeType.Housewares]: '家具',
  [RecipeType.Miscellaneous]: '小物件',
  [RecipeType.WallMounted]: '壁挂物',
  [RecipeType.CeilingDecor]: '天花板',
  [RecipeType.Wallpaper]: '墙壁',
  [RecipeType.Floors]: '地板',
  [RecipeType.Rugs]: '地垫',
  [RecipeType.Equipment]: '装备',
  [RecipeType.Other]: '其他',
  [RecipeType.Savory]: '食物',
  [RecipeType.Sweet]: '点心',
};
