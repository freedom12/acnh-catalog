import * as fs from 'fs';
import * as path from 'path';

const __dirname = path.join(process.cwd(), 'tools', 'acnh');

export function getAcnhEventsCfg() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'acnh_events.json'), 'utf-8'));
}

export function getAcnhLocaleCfg() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'acnh_locale.json'), 'utf-8'));
}

export function getAcnhDataCfg() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'acnh_data_all.json'), 'utf-8'));
}

export function getAcnhMainLocaleCfg(name?: string) {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'main.json'), 'utf-8'));
  if (!name) {
    return data;
  }
  let result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith(name)) {
      //key 去掉前缀
      const shortKey = key.substring(name.length + 1);
      result[shortKey] = value;
    }
  }
  return result;
}
let acnhMainLocaleCfg = getAcnhMainLocaleCfg();
let acnhLocaleCfg = getAcnhLocaleCfg();
export function getAcnhLocale(str: string, sub: string) {
  let loc = acnhLocaleCfg[sub]?.[str];
  if (loc) {
    return loc['zh-cn'] || loc['zh'];
  }
  let ret = acnhMainLocaleCfg[`details.${sub}.${str}`];
  return ret;
}

let acnhDataCfg = getAcnhDataCfg();
export function getAcnhData(id: number, cid?: number): Record<string, any> | null {
  if (cid === undefined) {
    let idstr = id.toString();
    for (const [_, subMap] of Object.entries(
      acnhDataCfg as Record<string, Record<string, any>>
    )) {
      if (subMap[idstr]) {
        return subMap[idstr];
      }
    }
  } else {
    let idstr = 'c' + cid.toString();
    for (const [_, subMap] of Object.entries(
      acnhDataCfg as Record<string, Record<string, any>>
    )) {
      if (subMap[idstr]) {
        let ids = subMap[idstr].iid;
        if (typeof ids === 'number') {
          ids = [ids];
        }
        if (ids && ids.includes(id)) {
          return subMap[idstr];
        }
      }
    }
  }
  return null;
}
