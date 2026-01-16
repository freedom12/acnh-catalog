import {
  recipes as oldRecipes,
} from 'animal-crossing';
import { processImageUrl, save, versionMap } from './util.js';
import { type Item } from '../src/types/index.js';
import { genItem } from './gen_item.js';
import { RecipeType, type Recipe } from '../src/types/recipe.js';

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
  let recipes: Recipe[] = [];
  for (const oldRecipe of oldRecipes) {
    let images = [];
    images.push(processImageUrl(oldRecipe.image));
    if (oldRecipe.imageSh) images.push(processImageUrl(oldRecipe.imageSh));
    let materials: [number, number][] = [];
    for (const [materialName, quantity] of Object.entries(oldRecipe.materials)) {
      const item = items.find(i => i.rawName === materialName);
      if (item) {
        materials.push([item.id, quantity]);
      } else {
        console.log(
          `配方 ${oldRecipe.translations.cNzh} 所需材料 ${materialName} 未找到对应物品`
        );
        if (materialName.indexOf('Bells') !== -1) {
          let l = materialName.split(' ');
          materials.push([7730, parseInt(l[0].replace(/,/g, ''))]);
        } else if (materialName.indexOf('turnips') !== -1) {
          let l = materialName.split(' ');
          materials.push([7734, parseInt(l[0])]);
        }
      }
    }

    const recipe: Recipe = {
      id: oldRecipe.internalId,
      type: recipeCategoryMap[oldRecipe.category],
      name: oldRecipe.translations.cNzh,
      rawName: oldRecipe.name,
      images: images,
      ver: versionMap[oldRecipe.versionAdded],
      buy: oldRecipe.buy || undefined,
      sell: oldRecipe.sell || undefined,
      source: oldRecipe.source,
      sourceNotes: oldRecipe.sourceNotes || undefined,
      itemId: oldRecipe.craftedItemInternalId,
      serialId: oldRecipe.serialId,
      cardColor: oldRecipe.cardColor || undefined,
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
