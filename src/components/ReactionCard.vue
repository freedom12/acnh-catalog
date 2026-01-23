<script setup lang="ts">
import type { Reaction } from '../types/reaction';
import { UI_TEXT } from '../constants';
import BaseCard from './BaseCard.vue';
import DetailRow from './common/DetailRow.vue';
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
    <DetailRow label="活动">
      <ActivityList :activitys="props.data.acts" />
    </DetailRow>
    <DetailRow :label="UI_TEXT.LABELS.SOURCE">
      <SourceList :sources="props.data.source" :sourceNotes="props.data.sourceNotes" />
    </DetailRow>
  </BaseCard>
</template>
