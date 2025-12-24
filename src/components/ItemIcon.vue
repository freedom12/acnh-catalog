<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useItemsData } from "../composables/useItemsData";

const props = defineProps({
  itemName: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 100
  }
});

const router = useRouter();
const { itemNameMap } = useItemsData();

const item = computed(() => {
  return itemNameMap.value[props.itemName];
});

const handleClick = () => {
  if (item.value?.id) {
    router.push(`/item/${item.value.id}`);
  }
};
</script>

<template>
  <img
    v-if="item?.imageUrl"
    :src="item.imageUrl"
    :alt="props.itemName"
    :style="{ width: props.size + 'px', height: props.size + 'px' }"
    class="item-icon"
    :class="{ 'item-icon-clickable': item?.id }"
    @click="handleClick"
  />
</template>

<style scoped>
.item-icon {
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background: white;
  transition: all 0.2s ease;
}

.item-icon-clickable {
  cursor: pointer;
}

.item-icon-clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-color: #4a9b4f;
}
</style>