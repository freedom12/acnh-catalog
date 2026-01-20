import {
  ItemSourceSheet as OldItemSourceSheet,
  type Item as OldItem,
} from 'animal-crossing/lib/types/Item';
import { items as oldItems } from 'animal-crossing';
import { ItemSize } from '../src/types/item.js';
import { ItemType, Version } from '../src/types/item.js';
import { colorMap, processImageUrl, save, sizeMap, versionMap } from './util.js';
import type { Artwork } from '../src/types/index.js';

const sourceSheetMap: Record<string, ItemType> = {
  Accessories: ItemType.Accessories,
  Artwork: ItemType.Artwork,
  Bags: ItemType.Bags,
  Bottoms: ItemType.Bottoms,
  'Ceiling Decor': ItemType.CeilingDecor,
  'Clothing Other': ItemType.Wetsuits,
  'Dress-Up': ItemType.DressUp,
  Fencing: ItemType.Fencing,
  Floors: ItemType.Floors,
  Fossils: ItemType.Fossils,
  Gyroids: ItemType.Gyroids,
  Headwear: ItemType.Headwear,
  Housewares: ItemType.Housewares,
  Miscellaneous: ItemType.Miscellaneous,
  Music: ItemType.Music,
  Other: ItemType.Other,
  Photos: ItemType.Photos,
  Posters: ItemType.Posters,
  Rugs: ItemType.Rugs,
  Shoes: ItemType.Shoes,
  Socks: ItemType.Socks,
  'Tools/Goods': ItemType.ToolsGoods,
  Tops: ItemType.Tops,
  Umbrellas: ItemType.Umbrellas,
  'Wall-mounted': ItemType.WallMounted,
  Wallpaper: ItemType.Wallpaper,
  Creature: ItemType.Creatures,
};

export function genArtwork() {
  let fakeArtworks = new Map<string, OldItem>();
  let realArtworks = new Map<string, OldItem>();
  for (const oldItem of oldItems) {
    if (oldItem.sourceSheet === OldItemSourceSheet.Artwork) {
      if (oldItem.genuine === true) {
        realArtworks.set(oldItem.name, oldItem);
      } else {
        fakeArtworks.set(oldItem.name, oldItem);
      }
    }
  }

  let artworks: Artwork[] = [];
  for (const [name, realArtwork] of realArtworks) {
    const fakeArtwork = fakeArtworks.get(name);
    const l = realArtwork.artist!.split(',');

    const newArtwork: Artwork = {
      id: realArtwork.internalId!,
      name: realArtwork.translations!.cNzh,
      rawName: realArtwork.name,
      image: processImageUrl(realArtwork.image!),
      texture: realArtwork.highResTexture
        ? processImageUrl(realArtwork.highResTexture)
        : undefined,
      ver: realArtwork.versionAdded
        ? versionMap[realArtwork.versionAdded]
        : Version.The100,
      size: realArtwork.size ? sizeMap[realArtwork.size] : ItemSize.The1X1,
      colors: Array.from(
        new Set(
          (realArtwork.colors || [])
            .map((c) => colorMap[c])
            .filter((c) => c !== undefined)
        )
      ),
      title: realArtwork.realArtworkTitle!,
      artist: l[0]!.trim(),
      age: l[1]!.trim(),
      technique: l[2]!.trim(),
      desc: realArtwork.description![0]!,
      itemType: sourceSheetMap[realArtwork.category!],
      source: realArtwork.source!,
      buy: realArtwork.buy!,
      sell: realArtwork.sell!,
      fake: fakeArtwork
        ? {
            id: fakeArtwork.internalId || 0,
            image: processImageUrl(fakeArtwork.image!),
            texture: fakeArtwork.highResTexture
              ? processImageUrl(fakeArtwork.highResTexture)
              : undefined,
          }
        : undefined,
    };
    artworks.push(newArtwork);
  }
  artworks.sort((a, b) => a.id - b.id);
  return artworks;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genArtwork(), 'acnh-artworks.json');
}
