import { villagers as oldVillagers } from 'animal-crossing';
import { colorMap, genderMap, processImageUrl, save, versionMap } from './util.js';
import {
  Hobby,
  Personality,
  Species,
  type Item,
  type Villager,
} from '../src/types/index.js';
import { genItem } from './gen_item.js';

const personalityMap: Record<string, Personality> = {
  Cranky: Personality.Cranky,
  Jock: Personality.Jock,
  Lazy: Personality.Lazy,
  Smug: Personality.Smug,
  Normal: Personality.Normal,
  Peppy: Personality.Peppy,
  Snooty: Personality.Snooty,
  'Big Sister': Personality.BigSister,
};

const hobbyMap: Record<string, Hobby> = {
  Education: Hobby.Education,
  Fashion: Hobby.Fashion,
  Fitness: Hobby.Fitness,
  Music: Hobby.Music,
  Nature: Hobby.Nature,
  Play: Hobby.Play,
};

const speciesMap: Record<string, Species> = {
  Alligator: Species.Alligator,
  Anteater: Species.Anteater,
  Bear: Species.Bear,
  'Bear cub': Species.BearCub,
  Bird: Species.Bird,
  Bull: Species.Bull,
  Cat: Species.Cat,
  Chicken: Species.Chicken,
  Cow: Species.Cow,
  Deer: Species.Deer,
  Dog: Species.Dog,
  Duck: Species.Duck,
  Eagle: Species.Eagle,
  Elephant: Species.Elephant,
  Frog: Species.Frog,
  Goat: Species.Goat,
  Gorilla: Species.Gorilla,
  Hamster: Species.Hamster,
  Hippo: Species.Hippo,
  Horse: Species.Horse,
  Kangaroo: Species.Kangaroo,
  Koala: Species.Koala,
  Lion: Species.Lion,
  Monkey: Species.Monkey,
  Mouse: Species.Mouse,
  Octopus: Species.Octopus,
  Ostrich: Species.Ostrich,
  Penguin: Species.Penguin,
  Pig: Species.Pig,
  Rabbit: Species.Rabbit,
  Rhinoceros: Species.Rhinoceros,
  Sheep: Species.Sheep,
  Squirrel: Species.Squirrel,
  Tiger: Species.Tiger,
  Wolf: Species.Wolf,
};

/**
 * 从字符串中提取3个数字，如果缺少后两个则用0填充
 * @param str 输入字符串，如 "3122,2_0" 或 "7142"
 * @returns 三个数字的数组
 */
function processFurnitureString(str: string | number): [number, number, number] {
  const parts = String(str).split(',');
  const first = Number(parts[0]);
  if (parts.length > 1) {
    const secondParts = parts[1].split('_');
    return [first, Number(secondParts[0] || 0), Number(secondParts[1] || 0)];
  } else {
    return [first, 0, 0];
  }
}

export function genVillager(items?: Item[]) {
  items = items || genItem();
  let itemMap = new Map<string, Item>();
  for (const item of items) {
    itemMap.set(item.rawName, item);
  }
  let villagers: Villager[] = [];
  for (const oldVillager of oldVillagers) {
    const newVillager: Villager = {
      id: oldVillager.filename,
      name: oldVillager.translations?.cNzh || oldVillager.name,
      rawName: oldVillager.name,
      images: [
        processImageUrl(oldVillager.iconImage),
        processImageUrl(oldVillager.photoImage),
      ].filter((url) => url !== ''),
      ver: versionMap[oldVillager.versionAdded],
      species: speciesMap[oldVillager.species],
      gender: genderMap[oldVillager.gender],
      personality: personalityMap[oldVillager.personality],
      subtype: oldVillager.subtype,
      hobby: hobbyMap[oldVillager.hobby],
      birthday: oldVillager.birthday,
      styles: Array.from(new Set(oldVillager.styles)),
      colors: Array.from(new Set(oldVillager.colors.map((c) => colorMap[c]))),
      catchphrase: oldVillager.catchphrases.cNzh,
      saying: oldVillager.favoriteSaying,

      song: itemMap.get(oldVillager.favoriteSong)?.id || 0,
      cloting: itemMap.get(oldVillager.defaultClothing)?.id || 0,
      umbrella: itemMap.get(oldVillager.defaultUmbrella)?.id || 0,
      wallpaper: itemMap.get(oldVillager.wallpaper)?.id || 0,
      flooring: itemMap.get(oldVillager.flooring)?.id || 0,
      furnitures: oldVillager.furnitureList,
      diyWorkbench: processFurnitureString(String(oldVillager.diyWorkbench)),
      kitchenware: processFurnitureString(String(oldVillager.kitchenEquipment)),
      houseImage: oldVillager.houseImage
        ? processImageUrl(oldVillager.houseImage)
        : undefined,
      bubbleColor: oldVillager.bubbleColor,
      nameColor: oldVillager.nameColor,
    };
    villagers.push(newVillager);
  }
  villagers.sort((a, b) => a.id.localeCompare(b.id));
  return villagers;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genVillager(), 'acnh-villagers.json');
}
