<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useItemsData } from "../composables/useItemsData";

interface Props {
  material: string;
  quantity: number;
}

const props = defineProps<Props>();
const router = useRouter();
const { itemNameMap } = useItemsData();

const materialItem = computed(() => itemNameMap.value[props.material]);

const handleClick = () => {
  if (materialItem.value?.id) {
    router.push(`/item/${materialItem.value.id}`);
  }
};

const isClickable = computed(() => !!materialItem.value?.id);

const themeClasses = computed(() => {
  const baseClasses = ["material-item"];
  if (isClickable.value) {
    baseClasses.push("material-clickable");
  }
  return baseClasses;
});

const iconSize = computed(() => 24);
</script>

<template>
  <div :class="themeClasses" @click="handleClick">
    <div class="material-info">
      <img
        v-if="materialItem?.image"
        :src="materialItem.image"
        :alt="materialItem?.name"
        class="material-icon"
        :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
        loading="lazy"
      />
      <span class="material-name">{{ materialItem?.name }}</span>
    </div>
    <span class="material-quantity">× {{ quantity }}</span>
  </div>
</template>

<style scoped>
/* 基础样式 */
.material-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ffcc80;
  transition: all 0.2s;
}

.material-item.material-clickable:hover {
  border-color: #ff9800;
  transform: translateY(-3px);
  box-shadow: 0 2px 6px rgba(255, 152, 0, 0.15);
}

.material-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.material-icon {
  object-fit: contain;
  background: #f5f5f5;
  border-radius: 50%;
  padding: 2px;
}

.material-name {
  font-size: 0.85em;
  color: #333;
  font-weight: 500;
}

.material-quantity {
  background: #ff9800;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.8em;
}
</style>
