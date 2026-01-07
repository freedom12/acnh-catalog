/**
 * 颜色变换工具函数（支持 #RGB 和 #RRGGBB 格式）
 * @param hex 颜色字符串
 * @param percent 亮度调整比例，取值范围 -1 到 1
 *                0: 原色
 *                正值: 向白色过渡
 *                负值: 向黑色过渡
 *                1: 接近白色
 *                -1: 接近黑色
 *                保持色相和饱和度不变
 */
export function adjustBrightness(hex: string, percent = 0): string {
  if (!hex) return "#000000";
  
  // 移除 # 并规范化为 6 位格式
  let c = hex.replace("#", "").toLowerCase();
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  if (c.length !== 6) return "#000000";
  
  // 解析 RGB
  const num = parseInt(c, 16);
  let r = ((num >> 16) & 0xff) / 255;
  let g = ((num >> 8) & 0xff) / 255;
  let b = (num & 0xff) / 255;
  
  // RGB 转 HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // 调整亮度，保持色相不变
  if (percent > 0) {
    // 向白色过渡
    l = l + (1 - l) * percent;
  } else if (percent < 0) {
    // 向黑色过渡
    l = l * (1 + percent);
  }
  
  // HSL 转 RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r2, g2, b2;
  if (s === 0) {
    r2 = g2 = b2 = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r2 = hue2rgb(p, q, h + 1/3);
    g2 = hue2rgb(p, q, h);
    b2 = hue2rgb(p, q, h - 1/3);
  }
  
  // 转换回 RGB 值
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}

/**
 * 连接数组元素为字符串
 * @param arr 字符串数组
 * @param separator 分隔符，默认为逗号
 * @param fallback 数组为空时的回退值
 * @returns 连接后的字符串
 */
export function joinArray(
  arr: string[] | undefined,
  separator = ", ",
  fallback = "--"
): string {
  if (!arr || arr.length === 0) return fallback;
  return arr.join(separator);
}

/**
 * 延迟执行
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

/**
 * 将hex颜色转换为RGB
 * @param hex 颜色字符串
 * @returns RGB数组
 */
function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  let normalizedHex = c;
  if (c.length === 3) {
    normalizedHex = c
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const num = parseInt(normalizedHex, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return [r, g, b];
}

/**
 * 计算颜色的相对亮度
 * @param rgb RGB数组
 * @returns 相对亮度值
 */
function getRelativeLuminance(rgb: [number, number, number]): number {
  const normalized = rgb.map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  const [r, g, b] = normalized;
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

/**
 * 计算两个颜色之间的对比度
 * @param color1 颜色1
 * @param color2 颜色2
 * @returns 对比度比率
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(hexToRgb(color1));
  const lum2 = getRelativeLuminance(hexToRgb(color2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 从颜色数组中选择与背景色对比度最高的颜色
 * @param backgroundColor 背景色
 * @param colors 候选颜色数组
 * @returns 对比度最高的颜色
 */
export function selectHighestContrastColor(
  backgroundColor: string,
  colors: string[]
): string {
  if (!colors || colors.length === 0) {
    return "#000000";
  }
  
  let bestColor: string = colors[0]!;
  let highestContrast = 0;
  
  for (const color of colors) {
    try {
      const contrast = getContrastRatio(backgroundColor, color);
      if (contrast > highestContrast) {
        highestContrast = contrast;
        bestColor = color;
      }
    } catch {
      // 忽略无效颜色
      continue;
    }
  }
  
  return bestColor;
}
