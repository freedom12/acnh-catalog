<script setup lang="ts">
import type { Achievement } from '../types/achievement';
import VersionBadge from './VersionBadge.vue';
import { computed, ref } from 'vue';
import { getImgUrl } from '../services/dataService';

const props = defineProps<{
  data: Achievement;
}>();

const handleClick = () => {
  // 可以添加点击处理，比如打开详情
};

const getIconSrc = (index: number) => {
  const typeLower = props.data.type.toLowerCase();
  if (props.data.isSeq) {
    return getImgUrl(`/img/icon/achievement/${typeLower}.png`);
  } else {
    return getImgUrl(`/img/icon/achievement/${typeLower}${index + 1}.png`);
  }
};

const containerRef = ref<HTMLElement>();

const containerWidth = computed(() => containerRef.value?.clientWidth || 400);

const iconSize = 60;
const singleIconSize = 100;
const gap = 16;
const spacing = iconSize + gap;
const containerHeight = 150;
const containerBorder = 10;
const lineHeight = 10;

const currentIconSize = computed(() =>
  props.data.tiers.length === 1 ? singleIconSize : iconSize
);

const positions = computed(() => {
  const length = props.data.tiers.length;
  const width = containerWidth.value;
  const centerX = width / 2;
  const centerY = containerHeight / 2;

  const isZigzag = length > 3;
  const pos = [];

  if (isZigzag) {
    const offset = (length - 1) * 25 + 30;
    for (let i = 0; i < length; i++) {
      const x = centerX - offset + i * 50 + iconSize / 2 - containerBorder / 2;
      const y = (i % 2 === 0 ? 75 : 25) + iconSize / 2;
      const angle = length > 1 ? (Math.random() - 0.5) * 20 : 0; // -5 to 5 degrees
      pos.push({ x, y, angle });
    }
  } else {
    const totalWidth = (length - 1) * spacing + iconSize;
    const startX = centerX - totalWidth / 2;
    for (let i = 0; i < length; i++) {
      const x = startX + i * spacing + iconSize / 2 - containerBorder / 2;
      const y = centerY;
      const angle = length > 1 ? (Math.random() - 0.5) * 20 : 0;
      pos.push({ x, y, angle });
    }
  }
  return pos;
});

const lines = computed(() => {
  const lns: { x: number; y: number; width: number; angle: number }[] = [];
  const pos = positions.value;
  for (let i = 0; i < pos.length - 1; i++) {
    const p1 = pos[i]!;
    const p2 = pos[i + 1]!;
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    lns.push({ x: x1, y: y1 - lineHeight / 2, width: distance, angle });
  }
  return lns;
});
</script>

<template>
  <div class="achievement-card card" @click="handleClick">
    <VersionBadge :version="props.data.ver" />
    <div class="card-info">
      <h3 class="card-name">{{ props.data.name }}</h3>
      <div
        ref="containerRef"
        v-if="props.data.tiers && props.data.tiers.length > 0"
        class="tiers-container"
        :style="{
          '--icon-size': iconSize + 'px',
          '--single-icon-size': singleIconSize + 'px',
          '--line-height': lineHeight + 'px',
        }"
      >
        <div
          v-for="(line, index) in lines"
          :key="'line-' + index"
          class="connection-line"
          :style="{
            left: `${line.x}px`,
            top: `${line.y}px`,
            width: `${line.width}px`,
            transform: `rotate(${line.angle}rad)`,
          }"
          v-if="props.data.isSeq"
        ></div>
        <div
          v-for="(tier, index) in props.data.tiers"
          :key="tier.num"
          class="tier-icon-bg"
          :class="{
            'single-icon': props.data.tiers.length === 1,
          }"
          :style="{
            left: `${(positions[index]?.x || 0) - currentIconSize / 2}px`,
            top: `${(positions[index]?.y || 0) - currentIconSize / 2}px`,
          }"
        ></div>

        <div
          v-for="(tier, index) in props.data.tiers"
          :key="tier.num"
          class="tier-icon"
          :class="{
            'single-icon': props.data.tiers.length === 1,
          }"
          :style="{
            left: `${(positions[index]?.x || 0) - currentIconSize / 2}px`,
            top: `${(positions[index]?.y || 0) - currentIconSize / 2}px`,
          }"
          :title="`等级${index + 1} ${tier.num}: ${tier.reward} 点 - ${tier.modifier}`"
        >
          <img
            :src="getIconSrc(index)"
            :alt="`等级 ${tier.num}`"
            :style="{
              transform: `rotate(${positions[index]?.angle || 0}deg)`,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../styles/card-styles';

.achievement-card {
  background: #dda0dd;
  border: 10px solid white;
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  text-align: center;
  transition: var(--transition-normal);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px var(--shadow-color);
  }

  .card-info {
    width: 100%;
  }

  .card-name {
    margin: 20px 0 0 0;
    font-size: 1.1rem;
    font-weight: bold;
    // color: brown;
  }

  .tiers-container {
    position: relative;
    height: 150px;
    width: 100%;
  }

  .connection-line {
    position: absolute;
    height: var(--line-height);
    background: white;
    transform-origin: 0 50%;
    // z-index: 1;
  }

  .tier-icon-bg {
    width: var(--icon-size);
    height: var(--icon-size);
    border-radius: 50%;
    position: absolute;
    overflow: hidden;
    background: white;
    &.single-icon {
      width: var(--single-icon-size);
      height: var(--single-icon-size);
    }
  }

  .tier-icon {
    width: var(--icon-size);
    height: var(--icon-size);
    position: absolute;
    overflow: hidden;
    transition:
      transform 0.3s ease,
      border-color 0.3s ease;

    &:hover {
      border-color: var(--main-color);
      transform: scale(1.3);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.single-icon {
      width: var(--single-icon-size);
      height: var(--single-icon-size);
    }
  }
}
</style>
