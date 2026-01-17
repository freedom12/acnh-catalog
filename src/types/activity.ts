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

export type RangeDate =
  | [number, number, number, number]
  | [number, number, number]
  | [number, number];
export type WeekdayDate = [number, number, number];

export interface Activity {
  id: string;
  order: number;
  name: string;
  // rawName: string;
  group: string;
  // ver: Version;
  type: ActivityType;
  dateType: 'range' | 'weekday' | 'special';
  date?: RangeDate | WeekdayDate;
  nhDate?: RangeDate | WeekdayDate;
  shDate?: RangeDate | WeekdayDate;
  years?: Record<number, RangeDate>;
  region?: string;
  flags?: string[];
}
