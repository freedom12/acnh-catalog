<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useItemsData } from "../composables/useItemsData";

const props = defineProps({
  itemName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 100,
  },
});

const router = useRouter();
const { itemNameMap } = useItemsData();

const item = computed(() => itemNameMap.value[props.itemName]);
const chineseName = computed(() => item.value?.name || "");

const showPreview = ref(false);

const handleMouseOver = () => {
  if (props.size < 100) showPreview.value = true;
};

const handleMouseLeave = () => {
  showPreview.value = false;
};

const handleClick = () => {
  if (item.value?.id) router.push(`/item/${item.value.id}`);
};
</script>

<template>
  <div
    class="item-icon-container"
    :style="{ width: props.size + 'px' }"
    :class="{ 'item-icon-clickable': item?.id }"
    @click="handleClick"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <img
      v-if="item?.image"
      :src="item.image"
      :alt="props.itemName"
      :style="{ width: props.size + 'px', height: props.size + 'px' }"
      class="item-icon"
      loading="lazy"
    />
    <transition name="preview">
      <div v-if="showPreview" class="preview-overlay">
        <img
          v-if="item?.image"
          :src="item.image"
          alt="preview"
          class="preview-icon"
          loading="lazy"
        />
        <hr v-if="chineseName" class="preview-separator" />
        <span v-if="chineseName" class="preview-name">{{ chineseName }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.item-icon {
  object-fit: contain;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.item-icon-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.item-icon-container.item-icon-clickable {
  cursor: pointer;
}

.preview-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: auto;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 10;
  padding: 4px;
}

.preview-icon {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 4px;
}

.preview-separator {
  width: 100%;
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: -2px 0 -2px 0;
}

.preview-name {
  font-size: 14px;
  text-align: center;
  overflow: visible;
  text-overflow: unset;
  white-space: normal;
  word-wrap: break-word;
  color: #333;
  padding: 0 4px;
  max-width: 92px;
}

.preview-enter-active,
.preview-leave-active {
  transition: all 0.3s ease;
}

.preview-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.preview-enter-to {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.preview-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.preview-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}
</style>
