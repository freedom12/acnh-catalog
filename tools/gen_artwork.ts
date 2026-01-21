import { ItemSize } from '../src/types/item.js';
import { ItemType, Version } from '../src/types/item.js';
import { colorMap, processImageUrl, save, sizeMap, versionMap } from './util.js';
import type { Artwork } from '../src/types/index.js';
import { getSheetDatas, getTrans } from './excel/excel.js';

export function genArtwork() {
  let fakeArtworks = new Map<string, any>();
  let realArtworks = new Map<string, any>();

  const sheetDatas = getSheetDatas();
  const artworkSheetDatas = sheetDatas['Artwork'];
  for (const sheetData of artworkSheetDatas) {
    if (sheetData['Genuine'] === 'Yes') {
      realArtworks.set(sheetData['Name'], sheetData);
    } else {
      fakeArtworks.set(sheetData['Name'], sheetData);
    }
  }

  let artworks: Artwork[] = [];
  for (const [name, realArtwork] of realArtworks) {
    const fakeArtwork = fakeArtworks.get(name);
    const l = realArtwork['Artist']!.split(',').map((s: string) => s.trim());
    let id = Number(realArtwork['Internal ID']);
    let itemType: ItemType = ItemType.Artwork;
    if (realArtwork['Category'] === 'Housewares') {
      itemType = ItemType.Housewares;
    } else if (realArtwork['Category'] === 'Wall-mounted') {
      itemType = ItemType.WallMounted;
    }
    const artwork: Artwork = {
      id: id,
      name: getTrans('Items', id)!,
      rawName: name,
      image: processImageUrl(realArtwork['Image']),
      texture:
        realArtwork['High-Res Texture'] && realArtwork['High-Res Texture'] !== 'NA'
          ? processImageUrl(realArtwork['High-Res Texture'])
          : undefined,
      ver: realArtwork['Version Added']
        ? versionMap[realArtwork['Version Added']]
        : Version.The100,
      size: realArtwork['Size'] ? sizeMap[realArtwork['Size']] : ItemSize.The1X1,
      colors: Array.from(
        new Set([realArtwork['Color 1'], realArtwork['Color 2']].filter(Boolean))
      ).map((c) => colorMap[c]),
      title: realArtwork['Real Artwork Title'],
      artist: l[0],
      age: l[1],
      technique: l[2],
      desc: realArtwork['Description'],
      itemType: itemType,
      source: [realArtwork['Source']],
      buy: Number(realArtwork['Buy']),
      sell: Number(realArtwork['Sell']),
      fake: fakeArtwork
        ? {
            id: fakeArtwork['Internal ID'] || 0,
            image: processImageUrl(fakeArtwork['Image']!),
            texture:
              fakeArtwork['High-Res Texture'] && fakeArtwork['High-Res Texture'] !== 'NA'
                ? processImageUrl(fakeArtwork['High-Res Texture'])
                : undefined,
          }
        : undefined,
    };
    artworks.push(artwork);
  }
  artworks.sort((a, b) => a.id - b.id);
  return artworks;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genArtwork(), 'acnh-artworks.json');
}
