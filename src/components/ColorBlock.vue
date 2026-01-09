<template>
  <span class="color-block" :style="blockStyle"></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { COLOR_MAP } from '../config';
import { Color } from '../types';

// 彩虹颜色常量
const RAINBOW_COLORS = [
  '#e74c3c',
  '#e67e22',
  '#f1c40f',
  '#27ae60',
  '#1abc9c',
  '#3498db',
  '#9b59b6',
];

interface Props {
  colors?: Color[];
  size?: number;
}

const props = defineProps<Props>();

/**
 * 生成圆锥渐变样式
 */
const blockStyle = computed(() => {
  const colors = props.colors || [];
  if (colors.length === 0) return {};

  const sectionDeg = 360 / colors.length;
  const gradientStops: string[] = [];
  let currentDeg = 0;

  colors.forEach((color) => {
    const endDeg = currentDeg + sectionDeg;

    if (color === Color.Colorful) {
      // 生成彩虹渐变
      const rainbowStep = sectionDeg / (RAINBOW_COLORS.length - 1);
      RAINBOW_COLORS.forEach((rainbowColor, i) => {
        gradientStops.push(`${rainbowColor} ${currentDeg + rainbowStep * i}deg`);
      });
    } else {
      // 生成单色渐变
      const colorValue = COLOR_MAP[color];
      gradientStops.push(`${colorValue} ${currentDeg}deg`, `${colorValue} ${endDeg}deg`);
    }

    currentDeg = endDeg;
  });

  return {
    background: `conic-gradient(from -135deg, ${gradientStops.join(', ')})`,
    width: `${props.size || 30}px`,
    height: `${props.size || 30}px`,
  };
});
</script>

<style scoped lang="scss">
.color-block {
  border-radius: 50%;
  border: 2px solid #ddd;
  flex-shrink: 0;
  display: inline-block;
}
</style>
