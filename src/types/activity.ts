import type { Version } from "./item";

export const ActivityType = {
  BasegameEvent: 1,
  CraftingSeason: 2,
  NookShoppingEvent: 3,
  ShoppingSeason: 4,
  SpecialEvent: 5,
  ZodiacSeason: 6,
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export interface Activity {
  id: number;
  name: string;
  rawName: string;
  ver: Version;
  type: ActivityType;
}
