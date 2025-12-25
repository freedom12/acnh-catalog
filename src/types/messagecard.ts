/**
 * 消息卡片类型定义
 */

export interface MessageCard {
  sourceSheet: string;
  name: string;
  image: string;
  buy: number | null;
  backColor: string | null;
  bodyColor: string;
  headColor: string;
  footColor: string;
  penColor1: string;
  penColor2: string;
  penColor3: string;
  penColor4: string;
  startDate: string | null;
  endDate: string | null;
  nhStartDate: string | null;
  nhEndDate: string | null;
  shStartDate: string | null;
  shEndDate: string | null;
  uniqueEntryId: string;
}