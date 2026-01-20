import type { Color, Version } from './index';

export const Gender = {
  Female: 1,
  Male: 2,
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const Personality = {
  Cranky: 1,
  Jock: 2,
  Lazy: 3,
  Smug: 4,
  Normal: 5,
  Peppy: 6,
  Snooty: 7,
  BigSister: 8,
} as const;
export type Personality = (typeof Personality)[keyof typeof Personality];

export const PersonalitySubtype = {
  A: 'A',
  B: 'B',
} as const;
export type PersonalitySubtype =
  (typeof PersonalitySubtype)[keyof typeof PersonalitySubtype];

export const Hobby = {
  Education: 1,
  Fashion: 2,
  Fitness: 3,
  Music: 4,
  Nature: 5,
  Play: 6,
} as const;
export type Hobby = (typeof Hobby)[keyof typeof Hobby];

export const Species = {
  Alligator: 1,
  Anteater: 2,
  Bear: 3,
  BearCub: 4,
  Bird: 5,
  Bull: 6,
  Cat: 7,
  Chicken: 8,
  Cow: 9,
  Deer: 10,
  Dog: 11,
  Duck: 12,
  Eagle: 13,
  Elephant: 14,
  Frog: 15,
  Goat: 16,
  Gorilla: 17,
  Hamster: 18,
  Hippo: 19,
  Horse: 20,
  Kangaroo: 21,
  Koala: 22,
  Lion: 23,
  Monkey: 24,
  Mouse: 25,
  Octopus: 26,
  Ostrich: 27,
  Penguin: 28,
  Pig: 29,
  Rabbit: 30,
  Rhinoceros: 31,
  Sheep: 32,
  Squirrel: 33,
  Tiger: 34,
  Wolf: 35,
} as const;
export type Species = (typeof Species)[keyof typeof Species];

/**
 * 村民数据类型
 */
export interface Villager {
  id: string;
  name: string;
  rawName: string;
  images: string[];
  ver: Version;
  gender: Gender;
  species: Species;
  personality: Personality;
  subtype: PersonalitySubtype;
  hobby: Hobby;
  birthday: string;
  styles: string[];
  colors: Color[];
  catchphrase: string;
  saying: string;

  song: number;
  clothing: number;
  umbrella: number;
  furnitures: number[];
  wallpaper: number;
  flooring: number;
  diyWorkbench: [number, number, number];
  kitchenware: [number, number, number];
  houseImage?: string;

  nameColor: string;
  bubbleColor: string;
}
