import * as fs from 'fs';
import * as path from 'path';
import { processImageUrl, save } from './util.js';
import type { Music } from '../src/types/music.js';
import { getAcnhLocale } from './acnh/index.js';
import { getSheetDatas } from './excel/excel.js';

const __dirname = path.join(process.cwd(), 'tools');

export function genMusic() {
  const sheetDatas = getSheetDatas();
  const musicSheetDatas = sheetDatas['Music'];
  const musicCfg = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'Music.json'), 'utf-8')
  );
  let musics: Music[] = [];
  for (const entry of musicCfg) {
    const data = musicSheetDatas?.find((data) => data['Name'] === entry.rawName);
    if (!data) {
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
    let image =
      data['Album Image'] && data['Album Image'] !== 'NA'
        ? data['Album Image']
        : 'https://acnhcdn.com/latest/NpcBromide/NpcSpTkkA.png';
    const music: Music = {
      id: data.id,
      order: entry.order || 0,
      name: entry.name,
      rawName: entry.rawName,
      image: processImageUrl(image),
      ver: data.v,
      mood: mood || '',
      hasRadio: data['Album Image'] && data['Album Image'] !== 'NA' ? true : false,
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
