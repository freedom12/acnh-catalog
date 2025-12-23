/**
 * 通用辅助函数
 * 提供跨模块使用的工具方法
 */

/**
 * 格式化数字为带千位分隔符的字符串
 * @param num 数字
 * @returns 格式化后的字符串，如 "1,234"
 */
export function formatNumber(num: number | null | undefined): string {
  if (num == null) return '--';
  return num.toLocaleString();
}

/**
 * 获取中文翻译文本
 * @param obj 包含translations的对象
 * @param fallback 回退值
 * @returns 中文文本或回退值
 */
export function getChineseText<T extends { translations?: { cNzh?: string }; name: string }>(
  obj: T,
  fallback?: string
): string {
  return obj.translations?.cNzh || fallback || obj.name;
}

/**
 * 安全获取数组第一个元素
 * @param arr 数组
 * @returns 第一个元素或undefined
 */
export function first<T>(arr: T[] | undefined): T | undefined {
  return arr?.[0];
}

/**
 * 连接数组元素为字符串
 * @param arr 字符串数组
 * @param separator 分隔符，默认为逗号
 * @param fallback 数组为空时的回退值
 * @returns 连接后的字符串
 */
export function joinArray(arr: string[] | undefined, separator = ', ', fallback = '未知'): string {
  if (!arr || arr.length === 0) return fallback;
  return arr.join(separator);
}

/**
 * 检查值是否为空
 * @param value 任意值
 * @returns 是否为空
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 延迟执行
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 安全的JSON解析
 * @param json JSON字符串
 * @param fallback 解析失败时的回退值
 * @returns 解析结果或回退值
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * 深度克隆对象
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 生成范围数组
 * @param start 起始值
 * @param end 结束值
 * @returns 数字数组
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
