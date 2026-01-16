export const ActivityType = {
  CalendarSeason: 1,
  CraftingSeason: 2,
  BloomingSeason: 3,
  ZodiacSeason: 4,
  BasegameEvent: 5,
  SpecialEvent: 6,
  NookShoppingEvent: 7,
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export interface Activity {
  id: string;
  order: number;
  name: string;
  // rawName: string;
  group: string;
  // ver: Version;
  type: ActivityType;
}
