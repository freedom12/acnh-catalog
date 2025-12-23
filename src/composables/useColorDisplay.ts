import { computed, type ComputedRef } from 'vue';
import { COLOR_MAP } from '../config';

/**
 * 组合函数：处理颜色显示逻辑
 */
export function useColorDisplay(colors: ComputedRef<string[]>) {
  /**
   * 生成彩虹渐变颜色
   */
  const getRainbowGradient = (currentDeg: number, sectionDeg: number): string[] => {
    const rainbowColors = ['#e74c3c', '#e67e22', '#f1c40f', '#27ae60', '#1abc9c', '#3498db', '#9b59b6'];
    const rainbowStep = sectionDeg / (rainbowColors.length - 1);
    
    return rainbowColors.map((color, i) => 
      `${color} ${currentDeg + rainbowStep * i}deg`
    );
  };

  /**
   * 生成单色渐变
   */
  const getSolidColorGradient = (color: string, currentDeg: number, endDeg: number): string[] => {
    const colorValue = COLOR_MAP[color] || '#ccc';
    return [
      `${colorValue} ${currentDeg}deg`,
      `${colorValue} ${endDeg}deg`
    ];
  };

  /**
   * 计算圆锥渐变样式
   */
  const conicGradientStyle = computed(() => {
    const colorList = colors.value;
    
    if (colorList.length === 0) {
      return '';
    }
    
    const sectionDeg = 360 / colorList.length;
    const gradientStops: string[] = [];
    let currentDeg = 0;
    
    colorList.forEach(color => {
      const endDeg = currentDeg + sectionDeg;
      
      if (color === 'Colorful') {
        gradientStops.push(...getRainbowGradient(currentDeg, sectionDeg));
      } else {
        gradientStops.push(...getSolidColorGradient(color, currentDeg, endDeg));
      }
      
      currentDeg = endDeg;
    });
    
    return `conic-gradient(from -135deg, ${gradientStops.join(', ')})`;
  });

  return {
    conicGradientStyle
  };
}
