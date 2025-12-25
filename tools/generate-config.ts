/**
 * 从 animal-crossing 包生成数据文件
 */

import {
  items,
  achievements,
  creatures,
  construction,
  reactions,
  seasonsAndEvents,
  recipes,
  translations,
  villagers,
  npcs,
} from "animal-crossing";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const itemsPath = path.join(__dirname, "..", "public", "acnh-items.json");
// 删除items中sourceSheet = Message Cards的项
const filteredItems = items.filter(
  (item) => item.sourceSheet !== "Message Cards"
);
// 读取Interior Structures.json中的数据 并合并到filteredItems
const interiorStructuresPath = path.join(
  __dirname,
  "..",
  "public",
  "config",
  "Interior Structures.json"
);
const interiorStructures = JSON.parse(
  fs.readFileSync(interiorStructuresPath, "utf-8")
);
const mergedItems = filteredItems.concat(interiorStructures);
fs.writeFileSync(itemsPath, JSON.stringify(mergedItems, null, 2));

const achievementsPath = path.join(
  __dirname,
  "..",
  "public",
  "config",
  "acnh-achievements.json"
);
fs.writeFileSync(achievementsPath, JSON.stringify(achievements, null, 2));

const constructionPath = path.join(
  __dirname,
  "..",
  "public",
  "config",
  "acnh-construction.json"
);
fs.writeFileSync(constructionPath, JSON.stringify(construction, null, 2));

const creaturesPath = path.join(__dirname, "..", "public", "config", "acnh-creatures.json");
fs.writeFileSync(creaturesPath, JSON.stringify(creatures, null, 2));

const reactionsPath = path.join(__dirname, "..", "public", "config", "acnh-reactions.json");
fs.writeFileSync(reactionsPath, JSON.stringify(reactions, null, 2));

const recipesPath = path.join(__dirname, "..", "public", "config", "acnh-recipes.json");
fs.writeFileSync(recipesPath, JSON.stringify(recipes, null, 2));

const seasonsAndEventsPath = path.join(
  __dirname,
  "..",
  "public",
  "config",
  "acnh-seasons-and-events.json"
);
fs.writeFileSync(
  seasonsAndEventsPath,
  JSON.stringify(seasonsAndEvents, null, 2)
);

const translationsPath = path.join(
  __dirname,
  "..",
  "public",
  "config",
  "acnh-translations.json"
);
fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2));

const villagersPath = path.join(__dirname, "..", "public", "config", "acnh-villagers.json");
fs.writeFileSync(villagersPath, JSON.stringify(villagers, null, 2));

const npcsPath = path.join(__dirname, "..", "public", "config", "acnh-npcs.json");
fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2));

console.log(`✅ 已生成物品数据: ${itemsPath}`);
console.log(`📊 共 ${items.length} 个物品`);
console.log(`✅ 已生成成就数据: ${achievementsPath}`);
console.log(`📊 共 ${achievements.length} 个成就`);
console.log(`✅ 已生成建筑数据: ${constructionPath}`);
console.log(`📊 共 ${construction.length} 个建筑项目`);
console.log(`✅ 已生成生物数据: ${creaturesPath}`);
console.log(`📊 共 ${creatures.length} 个生物`);
console.log(`✅ 已生成反应数据: ${reactionsPath}`);
console.log(`📊 共 ${reactions.length} 个反应`);
console.log(`✅ 已生成季节和活动数据: ${seasonsAndEventsPath}`);
console.log(`📊 共 ${seasonsAndEvents.length} 个季节和活动`);
console.log(`✅ 已生成配方数据: ${recipesPath}`);
console.log(`📊 共 ${recipes.length} 个配方`);
console.log(`✅ 已生成翻译数据: ${translationsPath}`);
console.log(`📊 共 ${Object.keys(translations).length} 种语言`);
console.log(`✅ 已生成村民数据: ${villagersPath}`);
console.log(`📊 共 ${villagers.length} 个村民`);
console.log(`✅ 已生成 NPC 数据: ${npcsPath}`);
console.log(`📊 共 ${npcs.length} 个 NPC`);
