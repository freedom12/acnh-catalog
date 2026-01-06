<script setup lang="ts">
import { UI_TEXT } from "../constants";
import { getConstrunctionTypeName } from "../services/dataService";
import type { Construction } from "../types/construction";
import { formatPrice } from "../utils/common";
import BaseCard from "./BaseCard.vue";
import SourceList from "./SourceList.vue";

interface Props {
  data: Construction;
}

const props = defineProps<Props>();

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, "_blank");
};
</script>

<template>
  <BaseCard
    colorClass="card--brown"
    :version="props.data.ver"
    :images="[props.data.image]"
    :displayName="props.data.name"
    :shape="'rounded'"
    @click="handleClick"
  >
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">
        {{ getConstrunctionTypeName(props.data.type) }}
      </span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
      <SourceList class="detail-value" :sources="props.data.source" />
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value price">
        {{ formatPrice(props.data.buy) }} {{ UI_TEXT.CURRENCY }}
      </span>
    </div>
  </BaseCard>
</template>
