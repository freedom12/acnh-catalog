import type { Price } from '../services/dataService';
import type { Version } from './item';

export interface Plant {
  id: number;
  name: string;
  rawName: string;
  ver: Version;
  images: string[];
  type: string;
  sell: Price;
  product?: number;
  seeds?: number;
}
