/**
 * 从 animal-crossing 包生成数据文件
 */

const { items, achievements, construction } = require('animal-crossing');
const fs = require('fs');
const path = require('path');

// 先查看第一个物品的结构
console.log('📦 第一个物品的完整结构：');
console.log(JSON.stringify(items[0], null, 2));
console.log('\n可用的属性：', Object.keys(items[0]));

// 创建 internalId 到 imageUrl 的映射
const imageMap = {};

items.forEach(item => {
    if (item.internalId && item.image) {
        imageMap[item.internalId] = item.image;
    }
});

// 将映射写入 JSON 文件
const imageMapPath = path.join(__dirname, 'acnh-image-map.json');
fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2));

// 保存完整的 items 数据
const itemsPath = path.join(__dirname, 'acnh-items.json');
fs.writeFileSync(itemsPath, JSON.stringify(items, null, 2));

// 保存 achievements 数据
const achievementsPath = path.join(__dirname, 'acnh-achievements.json');
fs.writeFileSync(achievementsPath, JSON.stringify(achievements, null, 2));

// 保存 construction 数据
const constructionPath = path.join(__dirname, 'acnh-construction.json');
fs.writeFileSync(constructionPath, JSON.stringify(construction, null, 2));

console.log(`✅ 已生成图片映射文件: ${imageMapPath}`);
console.log(`📊 共 ${Object.keys(imageMap).length} 个物品图片`);
console.log(`✅ 已生成物品数据: ${itemsPath}`);
console.log(`📊 共 ${items.length} 个物品`);
console.log(`✅ 已生成成就数据: ${achievementsPath}`);
console.log(`📊 共 ${achievements.length} 个成就`);
console.log(`✅ 已生成建筑数据: ${constructionPath}`);
console.log(`📊 共 ${construction.length} 个建筑项目`);
