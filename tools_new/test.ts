import * as fs from 'fs';
import * as path from 'path';

const __dirname = path.join(process.cwd(), 'tools_new');
// 读取data.json文件
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'));
const targets = data.data.wetsuits;

let keys = new Set<string>();
for (const [id, value] of Object.entries(targets)) {
  // console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);
  for (const key of Object.keys(value as Record<string, unknown>)) {
    keys.add(key);
  }
}
console.log(Array.from(keys).sort());

//筛选出key = value的项
function filter(key: string, value: unknown) {
  let results = [];
  for (const [, item] of Object.entries(targets)) {
    let data = item as Record<string, unknown>;
    if (data[key] === value) {
      results.push(data);
    }
  }
  return results;
}

// const result = filter('stk', 0);
// result.sort((a, b) => {
//   const locA = a['loc'] as Record<string, string>;
//   const locB = b['loc'] as Record<string, string>;
//   const locAName = locA['zh-cn'] || locA['zh'];
//   const locBName = locB['zh-cn'] || locB['zh'];
//   return locAName.localeCompare(locBName, 'zh-CN');
// });
// for (const item of result) {
//   const loc = item['loc'] as Record<string, string>;
//   console.log(loc['zh-cn'] || loc['zh'], loc['en']);
// }
// console.log('Total items:', result.length);


function collect(key: string) {
  let set = new Set();
  for (const [, item] of Object.entries(targets)) {
    let data = item as Record<string, unknown>;
    if (data[key] !== undefined) {
        set.add(data[key]);
    }
  }
  return set;
}
// let set = collect('var');
// let arr = Array.from(set).sort();
// for (const value of arr) {
//   console.log(value);
// }





// 将结果写入到tools_new/tmp.txt文件中，每行一个
// fs.writeFileSync(path.join(__dirname, 'tmp.txt'), Array.from(keys).sort().join('\n'), 'utf-8');
