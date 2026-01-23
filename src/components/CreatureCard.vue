<script setup lang="ts">
import type { Creature } from '../types/creature';
import { UI_TEXT } from '../constants';
import BaseCard from './BaseCard.vue';
import DetailRow from './common/DetailRow.vue';
import InlineIcon from './common/InlineIcon.vue';
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
  selectable?: boolean;
  selectionKey?: string;
}>();

const getMonths = (creature: Creature): string => {
  const hemisphere = creature.hemispheres[props.hemisphere];
  const months = hemisphere.months;
  if (!months || months.length === 0) return '无';
  if (months.length === 12) return '全年';
  const sortedMonths = [...months].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sortedMonths[0]!;
  let end = sortedMonths[0]!;
  for (let i = 1; i < sortedMonths.length; i++) {
    if (sortedMonths[i] === end + 1) {
      end = sortedMonths[i]!;
    } else {
      ranges.push(start === end ? `${start}月` : `${start}月-${end}月`);
      start = sortedMonths[i]!;
      end = sortedMonths[i]!;
    }
  }
  ranges.push(start === end ? `${start}月` : `${start}月-${end}月`);
  return ranges.join(', ');
};

const hourToString = (hour: number): string => {
  if (hour === 0) return '0AM';
  if (hour === 12) return '12PM';
  if (hour < 12) return `${hour}AM`;
  return `${hour - 12}PM`;
};

const getTime = (creature: Creature): string => {
  const hemisphere = creature.hemispheres[props.hemisphere];
  const hours = hemisphere.hours;
  if (!hours || hours.length === 0) return '无';
  if (hours.length === 24) return '全天';
  const sortedHours = [...hours].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sortedHours[0]!;
  let end = sortedHours[0]!;
  for (let i = 1; i < sortedHours.length; i++) {
    if (sortedHours[i] === end + 1) {
      end = sortedHours[i]!;
    } else {
      ranges.push(
        start === end
          ? hourToString(start)
          : `${hourToString(start)}-${hourToString(end)}`
      );
      start = sortedHours[i]!;
      end = sortedHours[i]!;
    }
  }
  ranges.push(
    start === end ? hourToString(start) : `${hourToString(start)}-${hourToString(end)}`
  );
  return ranges.join(', ');
};

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, '_blank');
};

const colorClass = computed(() => {
  switch (props.data.type) {
    case 1:
      return 'card--red';
    case 2:
      return 'card--blue';
    case 3:
      return 'card--yellow';
    default:
      return 'card--green';
  }
});

const currentMonth = new Date().getMonth() + 1;
const currentHour = new Date().getHours();

const isCurrentMonthAvailable = computed(() => {
  const hemisphere = props.data.hemispheres[props.hemisphere];
  return hemisphere.months.includes(currentMonth);
});

const isCurrentTimeAvailable = computed(() => {
  if (!isCurrentMonthAvailable.value) return false;
  const hemisphere = props.data.hemispheres[props.hemisphere];
  return hemisphere.hours.includes(currentHour);
});

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
    :selectionKey="selectionKey"
    :getSelectId="() => props.data.id"
    shape="rounded"
    @click="handleClick"
  >
    <DetailRow label="分类">
      {{ getCreatureTypeName(props.data.type) }}
      <InlineIcon
        :src="getCreatureTypeIcon(props.data.type)"
        :alt="getCreatureTypeName(props.data.type)"
        gray
      />
    </DetailRow>
    <DetailRow
      label="月份"
      :value="getMonths(props.data)"
      :variant="isCurrentMonthAvailable ? 'bg-highlight value-highlight' : ''"
    />
    <DetailRow
      label="时间"
      :value="getTime(props.data)"
      :variant="isCurrentTimeAvailable ? 'bg-highlight value-highlight' : ''"
    />
    <DetailRow label="解锁" :value="props.data.unlock" />
    <DetailRow label="出现概率" :value="props.data.rate" />
    <DetailRow v-if="props.data.shadowSize" label="阴影尺寸" :value="props.data.shadowSize" />
    <DetailRow v-if="props.data.difficulty" label="捕获难度" :value="props.data.difficulty" />
    <DetailRow v-if="props.data.weather" label="天气" :value="props.data.weather" />
    <DetailRow v-if="props.data.whereHow" label="地点" :value="props.data.whereHow" layout="full" />
    <DetailRow label="捕获台词" :value="props.data.catchPhrase" layout="full" />
    <DetailRow label="描述" :value="props.data.desc" layout="full" />
    <DetailRow label="尺寸" :value="getSizeWithIcon(props.data.size)" />
    <DetailRow
      :label="UI_TEXT.LABELS.PRICE"
      :value="getPriceWithIcon(props.data.sell)"
      variant="value-highlight"
    />
  </BaseCard>
</template>
