/**
 * 消息卡片类型定义
 */

export interface MessageCard {
  sourceSheet: string;
  name: string;
  image: string;
  buy?: number;
  backColor?: string;
  bodyColor: string;
  headColor: string;
  footColor: string;
  penColor1: string;
  penColor2: string;
  penColor3: string;
  penColor4: string;
  startDate?: string;
  endDate?: string;
  nhStartDate?: string;
  nhEndDate?: string;
  shStartDate?: string;
  shEndDate?: string;
  uniqueEntryId: string;
}