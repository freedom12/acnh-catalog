<script setup lang="ts">
import type { Creature } from '../types/creature';
import { UI_TEXT } from '../constants';
import BaseCard from './BaseCard.vue';
import { computed } from 'vue';
import { processImageUrl } from '../utils/imageUtils';
import {
  getPriceWithIcon,
  getCreatureTypeName,
  getCreatureTypeIcon,
  getSizeWithIcon,
} from '../services/dataService';

const props = defineProps<{
  data: Creature;
  hemisphere: 'north' | 'south';
}>();

// 获取月份信息
const getMonths = (creature: Creature): string => {
  const hemisphere = creature.hemispheres[props.hemisphere];
  return hemisphere.months.join(', ');
};

// 获取时间信息
const getTime = (creature: Creature): string => {
  const hemisphere = creature.hemispheres[props.hemisphere];
  return hemisphere.time.join(', ');
};

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, '_blank');
};

// 根据生物类型选择颜色主题
const colorClass = computed(() => {
  switch (props.data.type) {
    case 1: // Insects
      return 'card--red';
    case 2: // Fish
      return 'card--blue';
    case 3: // SeaCreatures
      return 'card--yellow';
    default:
      return 'card--green';
  }
});

// 当前月份
const currentMonth = new Date().getMonth() + 1;

// 当前小时（0-23）
const currentHour = new Date().getHours();

// 检查当前月份是否可捕捉
const isCurrentMonthAvailable = computed(() => {
  const hemisphere = props.data.hemispheres[props.hemisphere];
  return hemisphere.monthsArray.includes(currentMonth);
});

// 检查当前时间是否可用（仅当月份可用时）
const isCurrentTimeAvailable = computed(() => {
  if (!isCurrentMonthAvailable.value) return false;
  const hemisphere = props.data.hemispheres[props.hemisphere];
  return hemisphere.timeArray.includes(currentHour);
});

// 检查当前月份是否可捕捉
const variant = computed(() => {
  return isCurrentTimeAvailable.value ? 'dark' : 'light';
});
</script>

<template>
  <BaseCard
    :colorClass="colorClass"
    :variant="variant"
    :version="props.data.ver"
    :images="props.data.images.map(processImageUrl)"
    :displayName="props.data.name"
    shape="rounded"
    @click="handleClick"
  >
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">
        {{ getCreatureTypeName(props.data.type) }}
        <img
          :src="getCreatureTypeIcon(props.data.type)"
          :alt="getCreatureTypeName(props.data.type)"
          class="inline-icon gray"
          loading="lazy"
        />
      </span>
    </div>
    <div class="detail-row" :class="{ highlight: isCurrentMonthAvailable }">
      <span class="detail-label">月份</span>
      <span class="detail-value" :class="{ highlight: isCurrentMonthAvailable }">{{
        getMonths(props.data)
      }}</span>
    </div>
    <div class="detail-row" :class="{ highlight: isCurrentTimeAvailable }">
      <span class="detail-label">时间</span>
      <span class="detail-value" :class="{ highlight: isCurrentTimeAvailable }">{{
        getTime(props.data)
      }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">解锁</span>
      <span class="detail-value">{{ props.data.unlock }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">出现概率</span>
      <span class="detail-value">{{ props.data.rate }}</span>
    </div>
    <div v-if="props.data.shadowSize" class="detail-row">
      <span class="detail-label">阴影尺寸</span>
      <span class="detail-value">{{ props.data.shadowSize }}</span>
    </div>
    <div v-if="props.data.difficulty" class="detail-row">
      <span class="detail-label">捕获难度</span>
      <span class="detail-value">{{ props.data.difficulty }}</span>
    </div>
    <div v-if="props.data.weather" class="detail-row">
      <span class="detail-label">天气</span>
      <span class="detail-value">{{ props.data.weather }}</span>
    </div>
    <div v-if="props.data.whereHow" class="detail-row full">
      <span class="detail-label">地点</span>
      <span class="detail-value">{{ props.data.whereHow }}</span>
    </div>
    <div class="detail-row full">
      <span class="detail-label">捕获台词</span>
      <span class="detail-value">{{ props.data.catchPhrase }}</span>
    </div>
    <div class="detail-row full">
      <span class="detail-label">描述</span>
      <span class="detail-value">{{ props.data.desc }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">尺寸</span>
      <span class="detail-value" v-html="getSizeWithIcon(props.data.size)"> </span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value highlight" v-html="getPriceWithIcon(props.data.sell)">
      </span>
    </div>
  </BaseCard>
</template>
