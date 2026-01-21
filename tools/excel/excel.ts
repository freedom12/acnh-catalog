import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelFilePath = path.join(
  __dirname,
  'Data Spreadsheet for Animal Crossing New Horizons.xlsx'
);
const outputDir = path.join(__dirname, 'output');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function loadDataExcel() {
  // 读取Excel文件
  const workbook = XLSX.readFile(excelFilePath, { cellFormula: true });

  // 获取所有sheet名称，并去掉第一个
  const sheetNames = workbook.SheetNames.slice(1);
  const sheetDatas: { [key: string]: any[] } = {};
  sheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    // 将sheet转换为JSON数组（数组格式以便处理公式）
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
    }) as any[][];

    // 处理=IMAGE()公式
    rawData.forEach((row: any[], rowIndex: number) => {
      row.forEach((cell: any, colIndex: number) => {
        if (cell === null || cell === '') {
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
          const cellObj = worksheet[cellRef];
          if (cellObj && cellObj.f) {
            if (cellObj.f.match(/^IMAGE\(/i)) {
              const match = cellObj.f.match(/IMAGE\((.+)\)/i);
              if (match) {
                let url = match[1];
                if (url.startsWith('"') && url.endsWith('"')) {
                  url = url.slice(1, -1);
                }
                row[colIndex] = url;
              }
            }
          }
        }
      });
    });

    // 使用第一行作为字段名创建对象数组
    const headers = rawData[0] as string[];
    const dataRows = rawData.slice(1);

    // 过滤掉空行
    const filteredRows = dataRows.filter((row: any[]) =>
      row.some((cell) => cell !== null && cell !== undefined && cell !== '')
    );

    // 创建对象数组
    const objectData = filteredRows.map((row: any[]) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    sheetDatas[sheetName] = objectData;
    // 如果有数据，写入JSON文件
    //   if (objectData.length > 0) {
    //     const outputFilePath = path.join(outputDir, `${sheetName}.json`);
    //     fs.writeFileSync(outputFilePath, JSON.stringify(objectData, null, 2));
    //     console.log(`Exported ${sheetName} to ${outputFilePath}`);
    //   }
  });
  return sheetDatas;
}

function loadTransExcel() {
  const transFilePath = path.join(__dirname, 'ACNH Translations [v3.0.0].xlsx');
  const workbook = XLSX.readFile(transFilePath, { cellFormula: true });
  const sheetNames = workbook.SheetNames.slice(1); // 除了第一个 sheet，其他都是翻译
  const translations: Record<string, Record<string, Record<string, string>>> = {};

  sheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
    }) as any[][];

    const sheetTranslations: Record<string, Record<string, string>> = {};
    // 假设第一行是 header，跳过
    const header = rawData[0];
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      const id = row[0];
      sheetTranslations[id] = {};
      for (let j = 1; j < header.length; j++) {
        sheetTranslations[id][header[j]] = row[j];
      }
    }
    translations[sheetName] = sheetTranslations;
  });

  return translations;
}

const iconTypeMap: Record<number, string> = {};
function mergeTranslations(
  translations: Record<string, Record<string, Record<string, string>>>
) {
  const iconTypeSet = new Set<string>();
  const merged: Record<string, Record<number | string, Record<string, string>>> = {};
  let keys = [
    'Furniture',
    'Bug Models',
    'Fish Models',
    'Wallpaper',
    'Floors',
    'Rugs',
    'Door Deco',
    'Fencing',
    'Event Items',
    'Etc',
    'Gyroids',
    'Dishes',
    'Tools',
    'Bugs',
    'Fish',
    'Sea Creatures',
    'Fossils',
    'Art',
    'Music',
    'Crafting Items',
    'Shells',
    'Plants',
    'Turnips',
    'Money',
    'Harvs Island Items',
    'Photos',
    'Posters',
    'Umbrellas',
  ];
  merged['Items'] = {};
  for (const key of keys) {
    const translation = translations[key];
    for (const [idstr, trans] of Object.entries(translation)) {
      const l = idstr.split('_');
      if (l.length !== 2) {
        if (l.length === 3 && l[2] === 'pl') {
        } else {
          console.warn(`Unexpected id format: ${idstr} in sheet ${key}`);
        }
        continue;
      }
      if (isNaN(Number(l[1]))) {
        console.warn(`Invalid number in id: ${idstr} in sheet ${key}`);
        continue;
      }
      const id = Number(l[1]);
      const iconType = l[0];
      iconTypeSet.add(iconType);
      iconTypeMap[id] = iconType;
      if (merged['Items'][id]) {
        console.warn(`Duplicate id ${id} in Items from sheet ${key}`);
        continue;
      }
      merged['Items'][id] = trans;
    }
  }
  keys = [
    'Tops',
    'Bottoms',
    'Dress-Up',
    'Accessories',
    'Caps',
    'Helmets',
    'Socks',
    'Shoes',
    'Wetsuits',
    'Bags',
    'Handbags',
  ];
  merged['Clothing'] = {};
  for (const key of keys) {
    const translation = translations[key];
    for (const [idstr, trans] of Object.entries(translation)) {
      const id = Number(idstr);
      if (merged['Clothing'][id]) {
        console.warn(`Duplicate id ${id} in Clothing from sheet ${key}`);
        continue;
      }
      merged['Clothing'][id] = trans;
    }
  }

  merged['Clothing Variant'] = {};
  for (const key of keys) {
    const translation = translations[key + ' Variants'];
    for (const [idstr, trans] of Object.entries(translation)) {
      const l = idstr.split('_');
      if (l.length !== 3) {
        console.warn(`Unexpected id format: ${idstr} in sheet Clothing Variant`);
        continue;
      }
      const groupId = Number(l[0]);
      if (isNaN(groupId)) {
        console.warn(`Invalid number in id: ${idstr} in sheet Clothing Variant`);
        continue;
      }
      const id = Number(l[2]);
      const iconType = l[1];
      iconTypeSet.add(iconType);
      iconTypeMap[id] = iconType;
      if (isNaN(id)) {
        console.warn(`Invalid number in id: ${idstr} in sheet Clothing Variant`);
        continue;
      }
      const key = `${groupId}_${id}`;
      if (merged['Clothing Variant'][key]) {
        console.warn(`Duplicate id ${key} in sheet Clothing Variant`);
        continue;
      }
      merged['Clothing Variant'][key] = trans;
    }
  }

  const iconTypesArray = Array.from(iconTypeSet);
  const iconTypesFilePath = path.join(outputDir, 'iconTypes.txt');
  fs.writeFileSync(iconTypesFilePath, iconTypesArray.join('\n'));

  merged['Item Variant Types'] = {};
  for (const [idstr, trans] of Object.entries(translations['Item Variant Types'])) {
    const l = idstr.split('_');
    if (l.length !== 2) {
      console.warn(`Unexpected id format: ${idstr} in sheet Item Variant Types`);
      continue;
    }
    if (isNaN(Number(l[1]))) {
      console.warn(`Invalid number in id: ${idstr} in sheet Item Variant Types`);
      continue;
    }
    const id = Number(l[1]);
    if (merged['Item Variant Types'][id]) {
      console.warn(`Duplicate id ${id} in sheet Item Variant Types`);
      continue;
    }
    merged['Item Variant Types'][id] = trans;
  }
  merged['Item Pattern Types'] = {};
  for (const [idstr, trans] of Object.entries(translations['Item Pattern Types'])) {
    const l = idstr.split('_');
    if (l.length !== 2) {
      console.warn(`Unexpected id format: ${idstr} in sheet Item Pattern Types`);
      continue;
    }
    if (isNaN(Number(l[1]))) {
      console.warn(`Invalid number in id: ${idstr} in sheet Item Pattern Types`);
      continue;
    }
    const id = Number(l[1]);
    if (merged['Item Pattern Types'][id]) {
      console.warn(`Duplicate id ${id} in sheet Item Pattern Types`);
      continue;
    }
    merged['Item Pattern Types'][id] = trans;
  }

  merged['Item Variant Names'] = {};
  for (const [idstr, trans] of Object.entries(translations['Item Variant Names'])) {
    const l = idstr.split('_');
    if (l.length !== 3) {
      console.warn(`Unexpected id format: ${idstr} in sheet Item Variant Names`);
      continue;
    }
    if (isNaN(Number(l[1])) || isNaN(Number(l[2]))) {
      console.warn(`Invalid number in id: ${idstr} in sheet Item Variant Names`);
      continue;
    }
    const id = Number(l[1]);
    const subId = Number(l[2]);
    const key = `${id}_${subId}`;
    if (merged['Item Variant Names'][key]) {
      console.warn(`Duplicate id ${key} in sheet Item Variant Names`);
      continue;
    }
    merged['Item Variant Names'][key] = trans;
  }
  merged['Item Pattern Names'] = {};
  for (const [idstr, trans] of Object.entries(translations['Item Pattern Names'])) {
    const l = idstr.split('_');
    if (l.length !== 3) {
      console.warn(`Unexpected id format: ${idstr} in sheet Item Pattern Names`);
      continue;
    }
    if (isNaN(Number(l[1])) || isNaN(Number(l[2]))) {
      console.warn(`Invalid number in id: ${idstr} in sheet Item Pattern Names`);
      continue;
    }
    const id = Number(l[1]);
    const subId = Number(l[2]);
    const key = `${id}_${subId}`;
    if (merged['Item Pattern Names'][key]) {
      console.warn(`Duplicate id ${key} in sheet Item Pattern Names`);
      continue;
    }
    merged['Item Pattern Names'][key] = trans;
  }

  return merged;
}

const sheetDatas = loadDataExcel();
const translations = loadTransExcel();
const mergedTranslations = mergeTranslations(translations);
console.log('Loaded sheet data and translations.');
export function getSheetDatas() {
  return sheetDatas;
}

export function getTransDatas() {
  return translations;
}

export function getMergedTransDatas() {
  return mergedTranslations;
}

export function getTrans(
  sheet: string,
  id: string | number,
  lang: string = 'CNzh'
): string | null {
  let str = mergedTranslations?.[sheet]?.[id]?.[lang];
  if (str) {
    return str;
  }
  str = translations?.[sheet]?.[id]?.[lang];
  if (str) {
    return str;
  }
  return null;
}

export function getIconType(id: number): string {
  return iconTypeMap[id];
}