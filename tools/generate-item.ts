/**
 * 从 animal-crossing 包生成数据文件
 */

import {
  items,
  achievements,
  creatures,
  construction,
  reactions,
  seasonsAndEvents,
  recipes,
  translations,
  villagers,
  npcs,
} from "animal-crossing";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
