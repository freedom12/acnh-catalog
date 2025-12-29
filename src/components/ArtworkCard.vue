<script setup lang="ts">
import { formatPrice } from "../utils/common";
import { getItemTypeName, itemSizeNameMap } from "../services/dataService";
import type { Artwork } from "../types/artwork";
import BaseCard from "./BaseCard.vue";
import { computed, ref } from "vue";
import { processImageUrl } from "../utils/imageUtils";
import { Teleport } from "vue";

interface Props {
  data: Artwork;
}

const props = defineProps<Props>();
const hoveredImageId = ref<number | null>(null);

const imgs = computed(() => {
  let list = [
    {
      id: props.data.id,
      title: "真品",
      image: processImageUrl(props.data.image),
      texture: props.data.texture
        ? processImageUrl(props.data.texture)
        : undefined,
    },
  ];
  if (props.data.fake) {
    list.push({
      id: props.data.fake.id,
      title: "赝品",
      image: processImageUrl(props.data.fake.image),
      texture: props.data.fake.texture
        ? processImageUrl(props.data.fake.texture)
        : undefined,
    });
  }
  return list;
});

const handleImageClick = (imgId: number) => {
  hoveredImageId.value = imgId;
};

const handleClosePreview = () => {
  hoveredImageId.value = null;
};

const handlePrevImage = () => {
  const currentIndex = imgs.value.findIndex(
    (img) => img.id === hoveredImageId.value
  );
  if (currentIndex > 0) {
    hoveredImageId.value =
      imgs.value[currentIndex - 1]?.id ?? hoveredImageId.value;
  } else {
    hoveredImageId.value =
      imgs.value[imgs.value.length - 1]?.id ?? hoveredImageId.value;
  }
};

const handleNextImage = () => {
  const currentIndex = imgs.value.findIndex(
    (img) => img.id === hoveredImageId.value
  );
  if (currentIndex < imgs.value.length - 1) {
    hoveredImageId.value =
      imgs.value[currentIndex + 1]?.id ?? hoveredImageId.value;
  } else {
    hoveredImageId.value = imgs.value[0]?.id ?? hoveredImageId.value;
  }
};

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
    <template #name>
      <h3 class="card-name">{{ props.data.name }}</h3>
      <div class="artwork-images">
        <div
          v-for="img in imgs"
          :key="img.id"
          class="artwork-image-item"
          @click="handleImageClick(img.id)"
        >
          <img :src="img.image" :alt="img.title" class="thumbnail" />
          <span class="image-title">{{ img.title }}</span>
        </div>
      </div>
    </template>
    <div class="detail-row detail-row--full">
      <span class="detail-value">{{ props.data.title }}</span>
    </div>
    <div class="detail-row detail-row--full">
      <span class="detail-label">作者</span>
      <span class="detail-value--full">{{ props.data.artist }}</span>
    </div>
    <div class="detail-row detail-row--full">
      <span class="detail-label">介绍</span>
      <span class="detail-value--full">{{ props.data.desc }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">{{ getItemTypeName(props.data.itemType) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">尺寸</span>
      <span class="detail-value">{{ itemSizeNameMap[props.data.size] }}</span>
    </div>

    <!-- 预览窗口 -->
    <Teleport to="body">
      <div
        v-if="hoveredImageId !== null"
        class="preview-overlay"
        @click="handleClosePreview"
      >
        <div class="preview-content" @click.stop>
          <!-- 上一张按钮 -->
          <button
            v-if="imgs.findIndex((img) => img.id === hoveredImageId) > 0"
            class="nav-btn nav-btn-prev"
            @click="handlePrevImage"
            aria-label="上一张"
          >
            ‹
          </button>

          <img
            :src="
              imgs.find((img) => img.id === hoveredImageId)?.texture ||
              imgs.find((img) => img.id === hoveredImageId)?.image
            "
            :alt="imgs.find((img) => img.id === hoveredImageId)?.title"
            class="preview-image"
          />

          <!-- 预览标题 -->
          <div class="preview-title">
            {{ imgs.find((img) => img.id === hoveredImageId)?.title }}
          </div>

          <!-- 下一张按钮 -->
          <button
            v-if="
              imgs.findIndex((img) => img.id === hoveredImageId) <
              imgs.length - 1
            "
            class="nav-btn nav-btn-next"
            @click="handleNextImage"
            aria-label="下一张"
          >
            ›
          </button>
        </div>
      </div>
    </Teleport>
  </BaseCard>
</template>

<style scoped>
.artwork-images {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
  flex-wrap: wrap;
}

.artwork-image-item {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.image-title {
  font-size: 12px;
  color: #666;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50px;
}

.detail-value--full {
  text-align: left;
  max-width: 100%;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
}

.detail-row--full {
  display: block;
}

.detail-row--full .detail-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #666;
  text-align: left;
}

.detail-row--full .detail-value--full {
  display: block;
  padding-left: 0;
}

.hover-preview {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  background: white;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-content {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10001;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.nav-btn-prev {
  left: -60px;
}

.nav-btn-next {
  right: -60px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-title {
  margin-top: 12px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
</style>
