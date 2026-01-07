<script setup lang="ts">
import type { Recipe } from "../types/recipe";
import { UI_TEXT } from "../constants";
import BaseCard from "./BaseCard.vue";
import MaterialItem from "./MaterialItem.vue";
import SourceList from "./SourceList.vue";
import { processImageUrl } from "../utils/imageUtils";
import { getPriceStr, getRecipeTypeName, getActivityName } from "../services/dataService";
import { useItemDetailModal } from "../composables/useItemDetailModal";

interface Props {
  data: Recipe;
}

const props = defineProps<Props>();
const { openModal } = useItemDetailModal();

const handleClick = () => {
  openModal(props.data.itemId);
};
</script>

<template>
  <BaseCard
    colorClass="card--orange"
    :version="props.data.ver"
    :images="props.data.images.map(processImageUrl)"
    :displayName="props.data.name"
    @click="handleClick"
  >
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">{{ getRecipeTypeName(props.data.type) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ "季节/庆典" }}</span>
      <span class="detail-value">{{
        getActivityName(props.data.activity || "") || "--"
      }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
      <SourceList
        class="detail-value"
        :sources="props.data.source"
        :sourceNotes="props.data.sourceNotes"
      />
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value price">
        {{ getPriceStr(props.data.sell) }}
      </span>
    </div>
    <div
      v-if="Object.keys(props.data.materials).length > 0"
      class="materials-section"
    >
      <span class="materials-label">所需材料</span>
      <div class="materials-list">
        <MaterialItem
          v-for="(quantity, material) in props.data.materials"
          :key="material"
          :material="material"
          :quantity="quantity"
        />
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
/* RecipeCard特殊样式 */
.materials-section {
  background: #fff9f0;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #ffe0b2;
  margin-top: 8px;
}

.materials-label {
  font-weight: 600;
  color: #e65100;
  font-size: 0.85em;
  display: block;
  margin-bottom: 8px;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
