/**
 * 村民相关映射表
 */
import { Personality, Hobby, Species } from '../../types';

export const PersonalityNameMap: Record<Personality, string> = {
  [Personality.Cranky]: '暴躁',
  [Personality.Jock]: '运动',
  [Personality.Lazy]: '悠闲',
  [Personality.Smug]: '自恋',
  [Personality.Normal]: '普通',
  [Personality.Peppy]: '元气',
  [Personality.Snooty]: '成熟',
  [Personality.BigSister]: '大姐姐',
} as const;

export const HobbyNameMap: Record<Hobby, string> = {
  [Hobby.Education]: '教育',
  [Hobby.Fashion]: '时尚',
  [Hobby.Fitness]: '健身',
  [Hobby.Music]: '音乐',
  [Hobby.Nature]: '自然',
  [Hobby.Play]: '游戏',
};

export const SpeciesNameMap: Record<Species, string> = {
  [Species.Alligator]: '鳄鱼',
  [Species.Anteater]: '食蚁兽',
  [Species.Bear]: '熊',
  [Species.BearCub]: '熊仔',
  [Species.Bird]: '鸟',
  [Species.Bull]: '公牛',
  [Species.Cat]: '猫',
  [Species.Chicken]: '鸡',
  [Species.Cow]: '奶牛',
  [Species.Deer]: '鹿',
  [Species.Dog]: '狗',
  [Species.Duck]: '鸭',
  [Species.Eagle]: '鹰',
  [Species.Elephant]: '大象',
  [Species.Frog]: '青蛙',
  [Species.Goat]: '山羊',
  [Species.Gorilla]: '大猩猩',
  [Species.Hamster]: '仓鼠',
  [Species.Hippo]: '河马',
  [Species.Horse]: '马',
  [Species.Kangaroo]: '袋鼠',
  [Species.Koala]: '考拉',
  [Species.Lion]: '狮子',
  [Species.Monkey]: '猴子',
  [Species.Mouse]: '老鼠',
  [Species.Octopus]: '章鱼',
  [Species.Ostrich]: '鸵鸟',
  [Species.Penguin]: '企鹅',
  [Species.Pig]: '猪',
  [Species.Rabbit]: '兔子',
  [Species.Rhinoceros]: '犀牛',
  [Species.Sheep]: '绵羊',
  [Species.Squirrel]: '松鼠',
  [Species.Tiger]: '老虎',
  [Species.Wolf]: '狼',
} as const;

// 星座枚举
export const Constellation = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
} as const;

export type Constellation = (typeof Constellation)[keyof typeof Constellation];

export const ConstellationNameMap: Record<Constellation, string> = {
  [Constellation.Aries]: '白羊座',
  [Constellation.Taurus]: '金牛座',
  [Constellation.Gemini]: '双子座',
  [Constellation.Cancer]: '巨蟹座',
  [Constellation.Leo]: '狮子座',
  [Constellation.Virgo]: '处女座',
  [Constellation.Libra]: '天秤座',
  [Constellation.Scorpio]: '天蝎座',
  [Constellation.Sagittarius]: '射手座',
  [Constellation.Capricorn]: '魔羯座',
  [Constellation.Aquarius]: '水瓶座',
  [Constellation.Pisces]: '双鱼座',
};
