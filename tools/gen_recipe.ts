import { currencyMap, processImageUrl, save, versionMap } from './util.js';
import { type Item } from '../src/types/index.js';
import { genItem } from './gen_item.js';
import { RecipeType, type Recipe } from '../src/types/recipe.js';
import { getAcnhDiyData } from './acnh/index.js';
import { getSheetDatas } from './excel/excel.js';

const recipeCategoryMap: Record<string, RecipeType> = {
  Housewares: RecipeType.Housewares,
  Miscellaneous: RecipeType.Miscellaneous,
  'Wall-mounted': RecipeType.WallMounted,
  'Ceiling Decor': RecipeType.CeilingDecor,
  Equipment: RecipeType.Equipment,
  Other: RecipeType.Other,
  Floors: RecipeType.Floors,
  Rugs: RecipeType.Rugs,
  Wallpaper: RecipeType.Wallpaper,
  Tools: RecipeType.Tools,
  Sweet: RecipeType.Sweet,
  Savory: RecipeType.Savory,
};

export function genRecipe(items?: Item[]) {
  items = items || genItem();
  const itemMap = new Map<string, Item>();
  for (const item of items) {
    itemMap.set(item.nr, item);
  }
  const sheetDatas = getSheetDatas();
  const recipeSheetDatas = sheetDatas['Recipes'];
  let recipes: Recipe[] = [];
  for (const sheetData of recipeSheetDatas) {
    let id = Number(sheetData['Internal ID']);
    let itemId = Number(sheetData['Crafted Item Internal ID']);
    let item = items.find((it) => it.id === itemId);
    if (!item) {
      console.log(`配方 ${sheetData['Name']} 制作的物品 ID=${itemId} 未找到对应物品`);
      continue;
    }
    let name = item.n;
    let images = [];
    images.push(processImageUrl(sheetData['Image']));
    if (sheetData['Image SH'] && sheetData['Image SH'] !== 'NA') {
      images.push(processImageUrl(sheetData['Image SH']));
    }

    let materials: [number, number][] = [];
    for (let i = 1; i <= 6; i++) {
      const materialName = sheetData[`Material ${i}`];
      const quantity = sheetData[`#${i}`];
      if (!materialName) continue;
      const item = itemMap.get(materialName);
      if (item) {
        materials.push([item.id, quantity]);
      } else {
        console.log(`配方 ${name} 所需材料 ${materialName} 未找到对应物品`);
        if (materialName.indexOf('Bells') !== -1) {
          let l = materialName.split(' ');
          materials.push([7730, parseInt(l[0].replace(/,/g, ''))]);
        } else if (materialName.indexOf('turnips') !== -1) {
          let l = materialName.split(' ');
          materials.push([7734, parseInt(l[0])]);
        }
      }
    }
    let acnhDiyData = getAcnhDiyData(id);
    if (!acnhDiyData) {
      console.warn(`acnhDiyData not found: id=${id}, name=${name}`);
    }
    let acts = acnhDiyData?.evt;
    if (typeof acts === 'string') {
      acts = [acts];
    }
    const recipe: Recipe = {
      id: id,
      type: recipeCategoryMap[sheetData['Category']],
      name: name,
      rawName: sheetData['Name'],
      images: images,
      ver: versionMap[sheetData['Version Added']],
      buy:
        sheetData['Buy'] && sheetData['Buy'] !== 'NFS'
          ? Number(sheetData['Buy'])
          : undefined,
      sell:
        sheetData['Sell'] && sheetData['Sell'] !== 'NA'
          ? Number(sheetData['Sell'])
          : undefined,
      exc:
        sheetData['Exchange Price'] && sheetData['Exchange Price'] !== 'NA'
          ? [
              Number(sheetData['Exchange Price']),
              currencyMap[sheetData['Exchange Currency']!],
            ]
          : undefined,
      acts: acts,
      source: sheetData['Source']
        ? sheetData['Source'].split(';').map((s: string) => s.trim())
        : undefined,
      sourceNotes: sheetData['Source Notes']
        ? sheetData['Source Notes'].split(';').map((s: string) => s.trim())
        : undefined,
      itemId: itemId,
      serialId: Number(sheetData['Serial ID']),
      cardColor: sheetData['Card Color'] || undefined,
      materials: materials,
    };
    recipes.push(recipe);
  }
  recipes.sort((a, b) => {
    if (a.serialId !== b.serialId) {
      return a.serialId - b.serialId;
    }
    return a.id - b.id;
  });
  return recipes;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genRecipe(), 'acnh-recipes.json');
}
