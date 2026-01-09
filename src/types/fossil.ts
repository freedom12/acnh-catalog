import type { Price } from '../services/dataService';

export interface Fossil {
  name: string;
  parts: {
    id: number;
    name: string;
    image: string;
    sell: Price;
  }[];
  desc: string;
}
