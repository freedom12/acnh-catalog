<script setup lang="ts">
import { UI_TEXT } from "../constants";
import { getPriceWithIcon, getConstructionTypeName } from "../services/dataService";
import type { Construction } from "../types/construction";
import BaseCard from "./BaseCard.vue";
import SourceList from "./SourceList.vue";

const props = defineProps<{
  data: Construction;
}>();

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, "_blank");
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
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">
        {{ getConstructionTypeName(props.data.type) }}
      </span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
      <SourceList class="detail-value" :sources="props.data.source" />
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value highlight" v-html="getPriceWithIcon(props.data.buy) || '不可购买'">
      </span>
    </div>
  </BaseCard>
</template>
