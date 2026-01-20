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
            if (cellObj.f.startsWith('IMAGE(')) {
              const match = cellObj.f.match(/IMAGE\((.+)\)/);
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
  const translations: { [sheetName: string]: { [key: string]: Record<string, string> } } =
    {};

  sheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
    }) as any[][];

    const sheetTranslations: { [key: string]: Record<string, string> } = {};
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

// const itemSheetNames = [
//   'Housewares',
//   'Miscellaneous',
//   'Wall-mounted',
//   'Ceiling Decor',
//   'Interior Structures',
//   'Wallpaper',
//   'Floors',
//   'Rugs',
//   'Photos',
//   'Posters',
//   'ToolsGoods',
//   'Fencing',
//   'Tops',
//   'Bottoms',
//   'Dress-Up',
//   'Headwear',
//   'Accessories',
//   'Socks',
//   'Shoes',
//   'Bags',
//   'Umbrellas',
//   'Clothing Other',
//   'Music',
//   'Fish',
//   'Sea Creatures',
//   'Fossils',
//   'Artwork',
//   'Gyroids',
//   'Other',
// ];

const sheetDatas = loadDataExcel();
const translations = loadTransExcel();

export function getSheetDatas() {
  return sheetDatas;
}

export function getTrans(sheet: string, id: string, lang: string = 'CNzh'): string | null {
  const sheetTrans = translations[sheet];
  if (sheetTrans && sheetTrans[id] && sheetTrans[id][lang]) {
    return sheetTrans[id][lang];
  }
  return null;
}
