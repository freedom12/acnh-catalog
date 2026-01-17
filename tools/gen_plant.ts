import * as fs from 'fs';
import * as path from 'path';
import { save } from './util.js';
import { type Item, type Plant } from '../src/types/index.js';
import { genItem } from './gen_item.js';

const __dirname = path.join(process.cwd(), 'tools');

export function genPlant(items?: Item[]) {
  items = items || genItem();
  const plantCfg = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'Plants.json'), 'utf-8')
  );
  let plants: Plant[] = [];
  for (const entry of plantCfg) {
    if (!entry || typeof entry !== 'object' || !Array.isArray(entry.list)) {
      continue;
    }

    const plantType = entry.type!;
    for (const itemEntry of entry.list) {
      const itemEntryList = Array.isArray(itemEntry) ? itemEntry : [itemEntry];
      for (const itemEntry of itemEntryList) {
        let plantId = itemEntry.id;
        let product: number = itemEntry.product ?? 0;
        let seeds: number = itemEntry.seeds ?? 0;
        if (!plantId) continue;

        const item = items?.find((i) => i.id === plantId);
        if (!item) {
          console.log(`Plants.json 中未找到物品: ${plantId}`);
          continue;
        }
        plants.push({
          id: item.id,
          name: item.n,
          rawName: item.nr,
          ver: item.v,
          images: item.i,
          type: plantType,
          sell: item.sel ?? 0,
          product: product || undefined,
          seeds: seeds || undefined,
        });
      }
    }
  }
  return plants;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genPlant(), 'acnh-plants.json');
}
