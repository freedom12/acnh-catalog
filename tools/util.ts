import * as fs from 'fs';
import * as path from 'path';
import { Color, Gender, ItemSize, Version } from '../src/types';

/**
 * 递归移除对象中的 null 和 undefined 字段
 */
export function removeNullFields(obj: any): any {
  if (obj === null || obj === undefined) return undefined;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(removeNullFields).filter((item) => item !== undefined);
  }
  const cleaned: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = removeNullFields(obj[key]);
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

export function processImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  const CDN_PREFIX = 'https://acnhcdn.com/';
  let url = imageUrl;
  if (url.startsWith(CDN_PREFIX)) {
    url = url.substring(CDN_PREFIX.length);
  }
  if (url.endsWith('.png')) {
    url = url.substring(0, url.length - 4);
  }
  return url;
}

const __dirname = path.join(process.cwd(), 'tools');
const outputPath = path.join(__dirname, '..', 'public', 'config');

export function save(data: any, outputName: string) {
  fs.writeFileSync(
    path.join(outputPath, outputName),
    // JSON.stringify(data.map(removeNullFields), null, 2),
    JSON.stringify(data.map(removeNullFields)),
    'utf-8'
  );
}

export const versionMap: Record<string, Version> = {
  '1.0.0': Version.The100,
  '1.1.0': Version.The110,
  '1.10.0': Version.The1100,
  '1.11.0': Version.The1110,
  '1.2.0': Version.The120,
  '1.3.0': Version.The130,
  '1.4.0': Version.The140,
  '1.5.0': Version.The150,
  '1.6.0': Version.The160,
  '1.7.0': Version.The170,
  '1.8.0': Version.The180,
  '1.9.0': Version.The190,
  '2.0.0': Version.The200,
  '2.0.4': Version.The204,
};

export const sizeMap: Record<string, ItemSize> = {
  '0.5x1': ItemSize.The05X1,
  '1.5x1.5': ItemSize.The15X15,
  '1x0.5': ItemSize.The1X05,
  '1x1': ItemSize.The1X1,
  '1x1.5': ItemSize.The1X15,
  '1x2': ItemSize.The1X2,
  '2x0.5': ItemSize.The2X05,
  '2x1': ItemSize.The2X1,
  '2x1.5': ItemSize.The2X15,
  '2x2': ItemSize.The2X2,
  '3x1': ItemSize.The3X1,
  '3x2': ItemSize.The3X2,
  '3x3': ItemSize.The3X3,
  '4x3': ItemSize.The4X3,
  '4x4': ItemSize.The4X4,
  '5x5': ItemSize.The5X5,
};

export const colorMap: Record<string, Color> = {
  Aqua: Color.Aqua,
  Beige: Color.Beige,
  Black: Color.Black,
  Blue: Color.Blue,
  Brown: Color.Brown,
  Colorful: Color.Colorful,
  Gray: Color.Gray,
  Green: Color.Green,
  Orange: Color.Orange,
  Pink: Color.Pink,
  Purple: Color.Purple,
  Red: Color.Red,
  White: Color.White,
  Yellow: Color.Yellow,
};

export const genderMap: Record<string, Gender> = {
  Male: Gender.Male,
  Female: Gender.Female,
};