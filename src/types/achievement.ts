import type { Version } from './item';

export interface Tier {
  num: number;
  reward: number;
  modifier: string;
  nouns: string[];
}

export interface Achievement {
  id: number;
  order: number;
  name: string;
  rawName: string;
  ver: Version;
  type: string;
  desc: string;
  criteria: string;
  isSeq: boolean;
  tiers: Tier[];
}
