<script setup lang="ts">
import { UI_TEXT } from '../constants';
import {
  getPriceWithIcon,
  getConstructionTypeName,
  getConstructionTypeIcon,
} from '../services/dataService';
import type { Construction } from '../types/construction';
import BaseCard from './BaseCard.vue';
import DetailRow from './common/DetailRow.vue';
import InlineIcon from './common/InlineIcon.vue';
import SourceList from './SourceList.vue';

const props = defineProps<{
  data: Construction;
}>();

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/House_customization`, '_blank');
};
</script>

<template>
  <BaseCard
    colorClass="card--gray"
    :version="props.data.ver"
    :images="[props.data.image]"
    :displayName="props.data.name"
    :shape="'rounded'"
    @click="handleClick"
  >
    <DetailRow label="分类">
      {{ getConstructionTypeName(props.data.type) }}
      <InlineIcon
        :src="getConstructionTypeIcon(props.data.type)"
        :alt="getConstructionTypeName(props.data.type)"
        gray
      />
    </DetailRow>
    <DetailRow :label="UI_TEXT.LABELS.SOURCE">
      <SourceList :sources="props.data.source" />
    </DetailRow>
    <DetailRow
      label="购买"
      :value="getPriceWithIcon(props.data.buy) || '不可购买'"
      variant="value-highlight"
    />
  </BaseCard>
</template>
