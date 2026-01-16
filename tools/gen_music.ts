import * as fs from 'fs';
import * as path from 'path';
import { processImageUrl, save } from './util.js';
import { type Item } from '../src/types/index.js';
import type { Music } from '../src/types/music.js';
import { getAcnhLocale } from './acnh/index.js';
import { genItem } from './gen_item.js';

const __dirname = path.join(process.cwd(), 'tools');

export function genMusic(items?: Item[]) {
  items = items || genItem();
  const musicCfg = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'Music.json'), 'utf-8')
  );
  let musics: Music[] = [];
  for (const entry of musicCfg) {
    const item = items?.find((i) => i.rawName === entry.rawName);
    if (!item) {
      console.log(`音乐未找到物品: ${entry.rawName}`);
      continue;
    }
    let mood = entry.mood;
    mood = mood
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/-/g, '_')
      .replace(/\./g, '')
      .replace(/'/g, '')
      .replace(/!/g, '');
    mood = getAcnhLocale(mood, 'mmd') || entry.mood;

    const music: Music = {
      id: item.id,
      order: entry.order || 0,
      name: entry.name,
      rawName: item.rawName,
      image: processImageUrl(
        item.images?.[1] || 'https://acnhcdn.com/latest/NpcBromide/NpcSpTkkA.png'
      ),
      ver: item.ver,
      mood: mood || '',
      hasRadio: item.images?.[1] ? true : false,
    };
    musics.push(music);
  }
  musics.sort((a, b) => {
    return a.order - b.order;
  });
  return musics;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genMusic(), 'acnh-musics.json');
}
