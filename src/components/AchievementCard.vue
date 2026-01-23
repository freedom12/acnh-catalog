<script setup lang="ts">
import type { Achievement } from '../types/achievement';
import VersionBadge from './VersionBadge.vue';
import { computed, ref } from 'vue';
import { getImgUrl } from '../services/dataService';
import { useAchievementDetailModal } from '../composables/useAchievementDetailModal';

const props = defineProps<{
  data: Achievement;
}>();

const { openModal } = useAchievementDetailModal();

const handleClick = () => {
  openModal(props.data.id);
};

const getIconSrc = (index: number) => {
  const typeLower = props.data.type.toLowerCase();
  if (props.data.isSeq) {
    return getImgUrl(`img/icon/achievement/${typeLower}.png`);
  } else {
    return getImgUrl(`img/icon/achievement/${typeLower}${index + 1}.png`);
  }
};

const lineHeight = 10;
const containerRef = ref<HTMLElement>();
const containerWidth = computed(() => containerRef.value?.clientWidth || 400);
const containerHeight = computed(() => containerRef.value?.clientHeight || 150);
const sizes = [100, 75, 70, 65, 65, 55];
const iconSize = computed(() => sizes[props.data.tiers.length - 1] || 65);
const positions = computed(() => {
  const length = props.data.tiers.length;
  const centerX = containerWidth.value / 2;
  const centerY = containerHeight.value / 2;

  const isZigzag = length > 3;
  const pos = [];

  const gapX = isZigzag ? -15 : 10;
  const gapY = isZigzag ? gapX * 1.7 : 0;
  const totalWidth = iconSize.value * length + gapX * (length - 1);
  const offset = centerX - totalWidth / 2;
  for (let i = 0; i < length; i++) {
    const x = offset + i * (iconSize.value + gapX) + iconSize.value / 2;
    const y = centerY + (i % 2 === 0 ? -gapY : gapY);
    const angle = length > 1 ? (Math.random() - 0.5) * 20 : 0;
    pos.push({ x, y, angle });
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
  <div class="achievement-card" @click="handleClick">
    <div class="card-inner">
      <VersionBadge :version="props.data.ver" />
      <div class="card-info">
        <h3 class="card-name">{{ props.data.name }}</h3>
        <div
          ref="containerRef"
          v-if="props.data.tiers && props.data.tiers.length > 0"
          class="tiers-container"
          :style="{
            '--icon-size': iconSize + 'px',
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
              left: `${(positions[index]?.x || 0) - iconSize / 2}px`,
              top: `${(positions[index]?.y || 0) - iconSize / 2}px`,
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
              left: `${(positions[index]?.x || 0) - iconSize / 2}px`,
              top: `${(positions[index]?.y || 0) - iconSize / 2}px`,
            }"
          >
            <img
              :src="getIconSrc(index)"
              :alt="`等级 ${tier.num}`"
              :style="{
                transform: `rotate(${positions[index]?.angle || 0}deg)`,
              }"
            />
          </div>
          <div
            v-for="(tier, index) in props.data.tiers"
            :key="'index-' + tier.num"
            class="tier-lab"
            :style="{
              left: `${positions[index]?.x || 0}px`,
              top: `${(positions[index]?.y || 0) + iconSize / 2}px`,
              transform: 'translateX(-50%)',
            }"
            aria-hidden="true"
          >
            <template v-if="tier.num"> {{ tier.num }} </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

.achievement-card {
  background: #e0f7fa;
  border: 10px solid white;
  border-radius: var(--border-radius-xl);
  padding: 0;
  box-shadow: 0 2px 4px rgb(0, 0, 0, 0.05);
  text-align: center;
  transition: var(--transition-normal);
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgb(0, 0, 0, 0.1);
  }

  .card-inner {
    position: relative;
    padding: var(--spacing-md);
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  .tier-lab {
    position: absolute;
    font-size: 0.8rem;
    color: var(--secondary-color);
    white-space: nowrap;
  }

  .card-info {
    width: 100%;
  }

  .card-name {
    margin: 20px 0 0;
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
  }
}
</style>
