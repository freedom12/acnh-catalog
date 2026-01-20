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

export function getAcnhDiyData(id: number): Record<string, any> | null {
  let idstr = 'd' + id;
  let subMap = acnhDataCfg['diy'];
  return subMap[idstr];
}

export function getAcnhReactionData(id: number): Record<string, any> | null {
    let idstr = 'r' + id;
    let subMap = acnhDataCfg['reactions'];
    return subMap[idstr];
}

export function getAllAcnhItemData(): Record<string, Record<string, any>> {
  let ret: Record<string, Record<string, any>> = {};
  ret['housewares'] = acnhDataCfg['housewares'];
  ret['misc'] = acnhDataCfg['misc'];
  ret['wall_mounted'] = acnhDataCfg['wall_mounted'];
  ret['walls'] = acnhDataCfg['walls'];
  ret['ceiling'] = acnhDataCfg['ceiling'];
  ret['structures'] = acnhDataCfg['structures'];
  ret['floors'] = acnhDataCfg['floors'];
  ret['rugs'] = acnhDataCfg['rugs'];
  ret['other'] = acnhDataCfg['other'];
  ret['fencing'] = acnhDataCfg['fencing'];
  ret['tops'] = acnhDataCfg['tops'];
  ret['bottoms'] = acnhDataCfg['bottoms'];
  ret['dresses'] = acnhDataCfg['dresses'];
  ret['hats'] = acnhDataCfg['hats'];
  ret['accs'] = acnhDataCfg['accs'];
  ret['shoes'] = acnhDataCfg['shoes'];
  ret['socks'] = acnhDataCfg['socks'];
  ret['bags'] = acnhDataCfg['bags'];
  ret['umbrellas'] = acnhDataCfg['umbrellas'];
  ret['wetsuits'] = acnhDataCfg['wetsuits'];
  ret['fossils'] = acnhDataCfg['fossils'];
  ret['fish'] = acnhDataCfg['fish'];
  ret['bugs'] = acnhDataCfg['bugs'];
  ret['sea'] = acnhDataCfg['sea'];
  ret['art'] = acnhDataCfg['art'];
  ret['photos'] = acnhDataCfg['photos'];
  ret['posters'] = acnhDataCfg['posters'];
  ret['music'] = acnhDataCfg['music'];
  ret['gyroids'] = acnhDataCfg['gyroids'];
  ret['tools'] = acnhDataCfg['tools'];
  return ret;
}

export function getAcnhItemData(id: number, cid?: number): Record<string, any> | null {
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
    let idstr = 'c' + cid;
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