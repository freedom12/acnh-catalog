import * as fs from 'fs';
import * as path from 'path';

const __dirname = path.join(process.cwd(), 'tools', 'acnh');
const acnh_file_path = path.join(__dirname, 'acnh.json');

async function fetchData() {
  try {
    const url = 'https://catalogue.ac/data/data.json';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    fs.writeFileSync(acnh_file_path, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Data fetched and saved to acnh.json');
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }

  try {
    const url = 'https://catalogue.ac/locale/zh-cn/main.json';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    fs.writeFileSync(
      path.join(__dirname, 'main.json'),
      JSON.stringify(data, null, 2),
      'utf-8'
    );
    console.log('Data fetched and saved to main.json');
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

const shouldFetch = process.argv[2] === 'fetch';
if (shouldFetch) {
  await fetchData();
}

// 读取data.json文件
const data = JSON.parse(fs.readFileSync(acnh_file_path, 'utf-8'));
for (const [key, value] of Object.entries(data)) {
  if (typeof value === 'object') {
    fs.writeFileSync(
      path.join(__dirname, `acnh_${key}.json`),
      JSON.stringify(value, null, 2),
      'utf-8'
    );
  }
}

function convert(datas: any) {
  const maps = data.maps;
  const locale = data.locale;
  // 辅助函数：递归映射值
  function mapValue(val: any, mapEntry: any, localeEntry: any): any {
    if (typeof val === 'number') {
      let result = mapEntry[val];
      // const loc = localeEntry?.[result];
      // if (!loc) return result;
      // // 如果有localeEntry，进行本地化处理
      // result = loc['zh-cn'] || loc['zh'] || result;
      return result;
    } else if (Array.isArray(val)) {
      return val.map((sub) => mapValue(sub, mapEntry, localeEntry));
    } else {
      // 如果不是number或array，保持原样（可能不需要，但为了安全）
      return val;
    }
  }

  for (const [key, data] of Object.entries(datas)) {
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      let mapEntry = maps[key];
      let localeEntry = locale[key];
      if (key === 'pat') {
        mapEntry = maps['var'];
        localeEntry = locale['var'];
      }
      if (!mapEntry) continue;
      const mapped = mapValue(value, mapEntry, localeEntry);
      (data as Record<string, unknown>)[key] = mapped;
    }
  }
  return datas;
}

let all: Record<string, unknown> = {};
for (const [key, value] of Object.entries(data.data)) {
  if (typeof value === 'object') {
    const data = convert(value);
    fs.writeFileSync(
      path.join(__dirname, `acnh_data_${key}.json`),
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    all[key] = data;
  }
  fs.writeFileSync(
    path.join(__dirname, `acnh_data_all.json`),
    JSON.stringify(all, null, 2),
    'utf-8'
  );
}

// ==========================================================================

const targets = data.data.wetsuits;
// let keys = new Set<string>();
// for (const [id, value] of Object.entries(targets)) {
//   // console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);
//   for (const key of Object.keys(value as Record<string, unknown>)) {
//     keys.add(key);
//   }
// }
// console.log(Array.from(keys).sort());

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
