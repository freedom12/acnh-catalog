/**
 * 物品相关映射表
 */
import {
  ItemType,
  Version,
  ItemSize,
  Color,
  Catalog,
  Currency,
  KitType,
} from '../../types/item';

export const ItemTypeNameMap: Record<ItemType, string> = {
  [ItemType.Housewares]: '家具/家具',
  [ItemType.Miscellaneous]: '家具/小物件',
  [ItemType.WallMounted]: '家具/壁挂物',
  [ItemType.CeilingDecor]: '家具/天花板',
  [ItemType.InteriorStructures]: '家具/室内结构',
  [ItemType.Tops]: '服饰/上装',
  [ItemType.Bottoms]: '服饰/下装',
  [ItemType.DressUp]: '服饰/套装',
  [ItemType.Headwear]: '服饰/头戴物',
  [ItemType.Accessories]: '服饰/饰品',
  [ItemType.Socks]: '服饰/袜子',
  [ItemType.Shoes]: '服饰/鞋子',
  [ItemType.Bags]: '服饰/包包',
  [ItemType.Umbrellas]: '服饰/雨伞',
  [ItemType.Wetsuits]: '服饰/潜水服',
  [ItemType.ToolsGoods]: '工具',
  [ItemType.Fencing]: '栅栏',
  [ItemType.Wallpaper]: '壁纸',
  [ItemType.Floors]: '地板',
  [ItemType.Rugs]: '地垫',
  [ItemType.Creatures]: '博物馆/生物',
  [ItemType.Fossils]: '博物馆/化石',
  [ItemType.Artwork]: '博物馆/艺术品',
  [ItemType.Gyroids]: '陶俑',
  [ItemType.Music]: '音乐',
  [ItemType.Photos]: '照片',
  [ItemType.Posters]: '海报',
  [ItemType.Other]: '其他',
};

export const VersionNameMap: Record<Version, string> = {
  [Version.The100]: '1.0.0',
  [Version.The110]: '1.1.0',
  [Version.The120]: '1.2.0',
  [Version.The130]: '1.3.0',
  [Version.The140]: '1.4.0',
  [Version.The150]: '1.5.0',
  [Version.The160]: '1.6.0',
  [Version.The170]: '1.7.0',
  [Version.The180]: '1.8.0',
  [Version.The190]: '1.9.0',
  [Version.The1100]: '1.10.0',
  [Version.The1110]: '1.11.0',
  [Version.The200]: '2.0.0',
  [Version.The204]: '2.0.4',
  [Version.The300]: '3.0.0',
};

export const ItemSizeNameMap: Record<ItemSize, string> = {
  [ItemSize.The05X1]: '0.5x1',
  [ItemSize.The1X05]: '1x0.5',
  [ItemSize.The1X1]: '1x1',
  [ItemSize.The1X15]: '1x1.5',
  [ItemSize.The15X15]: '1.5x1.5',
  [ItemSize.The1X2]: '1x2',
  [ItemSize.The2X05]: '2x0.5',
  [ItemSize.The2X1]: '2x1',
  [ItemSize.The2X15]: '2x1.5',
  [ItemSize.The2X2]: '2x2',
  [ItemSize.The3X1]: '3x1',
  [ItemSize.The3X2]: '3x2',
  [ItemSize.The3X3]: '3x3',
  [ItemSize.The4X3]: '4x3',
  [ItemSize.The4X4]: '4x4',
  [ItemSize.The5X5]: '5x5',
};

export const ColorNameMap: Record<Color, string> = {
  [Color.Red]: '红色',
  [Color.Orange]: '橙色',
  [Color.Yellow]: '黄色',
  [Color.Green]: '绿色',
  [Color.Blue]: '蓝色',
  [Color.Aqua]: '青色',
  [Color.Purple]: '紫色',
  [Color.Pink]: '粉色',
  [Color.White]: '白色',
  [Color.Black]: '黑色',
  [Color.Gray]: '灰色',
  [Color.Brown]: '棕色',
  [Color.Beige]: '米色',
  [Color.Colorful]: '彩色',
};

export const CatalogNameMap: Record<Catalog, string> = {
  [Catalog.NotInCatalog]: '不在目录中',
  [Catalog.NotForSale]: '非卖品',
  [Catalog.ForSale]: '售卖品',
  [Catalog.Seasonal]: '限定品',
};

export const CurrencyNameMap: Record<Currency, string> = {
  [Currency.Bells]: '铃钱',
  [Currency.HeartCrystals]: '爱的结晶',
  [Currency.NookMiles]: 'Nook里程',
  [Currency.NookPoints]: 'Nook点数',
  [Currency.Poki]: '波金',
  [Currency.HotelTickets]: '旅店券',
};

export const KitTypeNameMap: Record<KitType, string> = {
  [KitType.Normal]: '改造工具组',
  [KitType.Pumpkin]: '南瓜',
  [KitType.RainbowFeather]: '彩虹羽毛',
};
