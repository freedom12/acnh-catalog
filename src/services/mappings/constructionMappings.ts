/**
 * 建筑相关映射表
 */
import { ConstructionType } from '../../types/construction';

export const ConstructionTypeNameMap: Record<ConstructionType, string> = {
  [ConstructionType.Roof]: '屋顶',
  [ConstructionType.Siding]: '墙壁',
  [ConstructionType.Door]: '门',
  [ConstructionType.Mailbox]: '信箱',
  [ConstructionType.Bridge]: '桥梁',
  [ConstructionType.Incline]: '斜坡',
};
