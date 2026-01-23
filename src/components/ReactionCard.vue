<script setup lang="ts">
import type { Reaction } from '../types/reaction';
import { UI_TEXT } from '../constants';
import BaseCard from './BaseCard.vue';
import ActivityList from './ActivityList.vue';
import SourceList from './SourceList.vue';


const props = defineProps<{
  data: Reaction;
  selectable?: boolean;
  selectionKey?: string;
}>();

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/Reaction`, '_blank');
};
</script>

<template>
  <BaseCard
    colorClass="card--purple"
    variant="dark"
    :version="props.data.ver"
    :images="[props.data.image]"
    :displayName="props.data.name"
    :selectionKey="selectionKey"
    :getSelectId="() => props.data.id"
    @click="handleClick"
  >
    <div class="detail-row">
      <span class="detail-label">活动</span>
      <ActivityList
        class="detail-value"
        :activitys="props.data.acts"
      />
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
      <SourceList
        class="detail-value"
        :sources="props.data.source"
        :sourceNotes="props.data.sourceNotes"
      />
    </div>
  </BaseCard>
</template>
