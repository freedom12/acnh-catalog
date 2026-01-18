<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useItemsData } from '../composables/useItemsData';
import { getPriceWithIcon, getSourceName } from '../services/dataService';
import { processImageUrl } from '../utils/imageUtils';
import MaterialItem from './MaterialItem.vue';
import ColorBlock from './ColorBlock.vue';
import type { Color } from '../types';
import { joinArray } from '../utils';

const props = defineProps<{
  itemId?: number | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { itemIdMap, loading, error, loadData } = useItemsData();
const itemModel = computed(() => (props.itemId ? itemIdMap.value[props.itemId] : null));

// 当前选中的变体索引
const selectedVariantIndex = ref(0);

// 当前选中的变体
const selectedVariant = computed(() => {
  return allVariants.value[selectedVariantIndex.value] || null;
});

// 选择变体
const selectVariant = (index: number) => {
  selectedVariantIndex.value = index;
};

// 获取配方数据
const recipe = computed(() => itemModel.value?.recipe || null);
const recipeImageUrl = computed(() => {
  return recipe.value?.images && recipe.value.images[0]
    ? processImageUrl(recipe.value.images[0])
    : '';
});
const hasMaterials = computed(() => {
  return recipe.value?.materials && Object.keys(recipe.value.materials).length > 0;
});

// 获取所有变体
const allVariants = computed(() => {
  if (!itemModel.value) return [];
  const variants = itemModel.value.variantGroups;

  // 将变体展平为列表，每个图案作为一个独立项
  const flatVariants: Array<{
    variantName: string;
    patternName: string;
    image: string;
    id: number;
    colors: Color[];
  }> = [];

  variants.forEach((variantGroup, vIndex) => {
    variantGroup.forEach((pattern, pIndex) => {
      flatVariants.push({
        variantName: itemModel.value?.getVName(vIndex) || '',
        patternName: itemModel.value?.getPName(pIndex) || '',
        image: itemModel.value?.getPatternImages(vIndex, pIndex)[0] || '',
        id: pattern.id || itemModel.value?.id || 0,
        colors: pattern.c,
      });
    });
  });

  return flatVariants;
});

// 拥有状态
const isOwned = computed(() => itemModel.value?.owned || false);

// 返回首页
const closeModal = () => {
  emit('close');
};

// 跳转到Nookipedia页面
const goToNookipedia = () => {
  if (itemModel.value?.name) {
    const itemName = itemModel.value.rawName;
    // 将空格替换为下划线,构建Nookipedia URL格式：Item:ItemName_(New_Horizons)
    const urlName = itemName.replace(/ /g, '_');
    window.open(`https://nookipedia.com/wiki/Item:${urlName}_(New_Horizons)`, '_blank');
  }
};

// 加载数据
onMounted(() => {
  loadData();
});

// 点击遮罩层关闭
const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
};
</script>

<template>
  <Transition name="modal">
    <div v-if="itemId" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container">
        <button class="modal-close" @click="closeModal" title="关闭">×</button>
        <div class="detail-container">
          <div v-if="loading" class="loading">正在加载物品数据...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else-if="!itemModel" class="error">未找到该物品</div>
          <template v-else>
            <div class="detail-content">
              <div class="title-section">
                <h1>{{ itemModel.name }}</h1>
              </div>
              <div class="top-section">
                <div class="image-container">
                  <img
                    :src="
                      selectedVariant
                        ? processImageUrl(selectedVariant.image)
                        : itemModel.image
                    "
                    :alt="
                      selectedVariant
                        ? `${selectedVariant.variantName} - ${selectedVariant.patternName}`
                        : itemModel.name
                    "
                    class="main-image"
                    @click="goToNookipedia"
                    title="点击查看Nookipedia页面"
                    loading="lazy"
                  />
                  <div class="owned-overlay" :class="{ owned: isOwned }">
                    {{ isOwned ? '已拥有' : '未拥有' }}
                  </div>
                </div>

                <!-- 信息卡片区域 - 在图片右侧 -->
                <div class="info-card">
                  <div class="card-content">
                    <div class="info-grid">
                      <div class="info-row">
                        <div class="info-item">
                          <div class="item-label">ID:</div>
                          <div class="item-value">
                            {{ selectedVariant ? selectedVariant.id : itemModel.id }}
                          </div>
                        </div>
                        <div class="info-item">
                          <div class="item-label">分类:</div>
                          <div class="item-value">{{ itemModel.typeName }}</div>
                        </div>
                      </div>

                      <div class="info-row">
                        <div class="info-item">
                          <div class="item-label">尺寸:</div>
                          <div class="item-value">{{ itemModel.sizeName }}</div>
                        </div>
                        <div class="info-item">
                          <div class="item-label">颜色:</div>
                          <div class="item-value">
                            <ColorBlock
                              v-if="selectedVariant && selectedVariant.colors.length > 0"
                              :colors="selectedVariant.colors"
                              :size="16"
                            />
                            <template v-else>{{
                              joinArray(itemModel.colorNames)
                            }}</template>
                          </div>
                        </div>
                      </div>
                      <!-- <div class="info-row">
                        <div class="info-item full-width">
                          <div class="item-label">活动:</div>
                          <div class="item-value">
                            {{ joinArray(itemModel.activityGroupNames) }}
                          </div>
                        </div>
                      </div>

                      <div class="info-row">
                        <div class="info-item full-width">
                          <div class="item-label">来源:</div>
                          <div class="item-value">
                            {{ joinArray(itemModel.sourceNames) }}
                          </div>
                        </div>
                      </div> -->

                      <!-- <div v-if="itemModel.tag" class="info-row">
                        <div class="info-item full-width">
                          <strong>标签:</strong> {{ itemModel.tagName }}
                        </div>
                      </div> -->

                      <!-- <div v-if="itemModel.hhaSeries" class="info-row">
                        <div class="info-item full-width">
                          <strong>系列:</strong> {{ itemModel.hhaSeriesName }}
                        </div>
                      </div> -->

                      <div class="info-row">
                        <div class="info-item">
                          <div class="item-label">添加版本:</div>
                          <div class="item-value">{{ itemModel.versionName }}</div>
                        </div>
                        <div class="info-item">
                          <div class="item-label">出售价格:</div>
                          <div class="item-value" v-html="itemModel.sellPriceStr"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- DIY配方展示 - 在变体之上 -->
              <div v-if="recipe" class="recipe-section">
                <h3>DIY配方</h3>
                <div class="recipe-content">
                  <div class="recipe-header">
                    <div v-if="recipeImageUrl" class="recipe-image">
                      <img :src="recipeImageUrl" :alt="recipe.name" loading="lazy" />
                    </div>
                    <div class="recipe-basic-info">
                      <div class="recipe-info-grid">
                        <div
                          v-if="recipe.source && recipe.source.length > 0"
                          class="recipe-info-item"
                        >
                          <label>配方来源:</label>
                          <span>
                            {{ recipe.source.map((s) => getSourceName(s)).join(', ') }}
                          </span>
                        </div>
                        <div v-if="recipe.sell" class="recipe-info-item">
                          <label>出售价格:</label>
                          <span class="price" v-html="getPriceWithIcon(recipe.sell)">
                          </span>
                        </div>
                        <div v-if="recipe.ver" class="recipe-info-item">
                          <label>添加版本:</label>
                          <span>{{ recipe.ver }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 材料列表 -->
                  <div v-if="hasMaterials" class="materials-section">
                    <hr />
                    <h4>所需材料</h4>
                    <div class="materials-grid">
                      <MaterialItem
                        v-for="[material, quantity] in recipe.materials"
                        :key="material"
                        :material="material"
                        :quantity="quantity"
                      />
                    </div>
                  </div>

                  <div v-if="recipe.sourceNotes" class="recipe-notes">
                    <strong>备注:</strong> {{ recipe.sourceNotes }}
                  </div>
                </div>
              </div>

              <!-- 变体展示 - 独立区域，占据整个页面宽度 -->
              <div v-if="allVariants.length > 0" class="variants-section">
                <h3>所有变体 ({{ allVariants.length }})</h3>
                <div class="variants-grid">
                  <div
                    v-for="(variant, idx) in allVariants"
                    :key="idx"
                    class="variant-card"
                    :class="{ selected: idx === selectedVariantIndex }"
                    @click="selectVariant(idx)"
                  >
                    <div class="variant-image">
                      <img
                        :src="processImageUrl(variant.image)"
                        :alt="`${variant.variantName} - ${variant.patternName}`"
                        loading="lazy"
                      />
                    </div>
                    <div class="variant-info">
                      <div class="variant-id-row">
                        <span class="variant-id-text">ID: {{ variant.id }}</span>
                        <ColorBlock
                          v-if="variant.colors.length > 0"
                          :colors="variant.colors"
                          :size="20"
                        />
                      </div>
                      <div class="variant-name">
                        {{ variant.variantName }}
                        <span v-if="variant.patternName" class="pattern-name">
                          - {{ variant.patternName }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use '../styles/view-styles';

/* 模态框遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

/* 模态框容器 */
.modal-container {
  background: #e8f5e9;
  border-radius: 30px;
  border: 10px solid white;
  max-width: 800px;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 10px 30px rgb(0, 0, 0, 0.3);
  position: relative;
}

/* 关闭按钮 */
.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  color: #666;
}

/* 滚动区域 */
.detail-container {
  padding: 20px;
  max-height: 90vh;
  overflow-y: auto;
}

/* 自定义滚动条样式 */
.detail-container::-webkit-scrollbar {
  width: 8px;
}

.detail-container::-webkit-scrollbar-track {
  background: transparent;
}

.detail-container::-webkit-scrollbar-thumb {
  background: rgb(0, 0, 0, 0.3);
  border-radius: 4px;
}

.detail-container::-webkit-scrollbar-thumb:hover {
  background: rgb(0, 0, 0, 0.5);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.title-section {
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
  text-align: left;
}

.title-section h1 {
  margin: 0;
  color: #2e7d32;
  font-size: 2.5em;
  font-weight: bold;
}

.title-section :deep(.version-badge) {
  position: static;
}

/* 顶部区域 */
.top-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.image-container {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 15px;
  background-color: white;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s;
}

.main-image:hover {
  transform: scale(1.05);
}

.owned-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgb(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}

.owned-overlay.owned {
  background: rgb(76, 175, 80, 0.9);
}

/* 卡片区域 */
.cards-section {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  flex: 1;
}

.info-card h3 {
  margin: 0 0 15px;
  color: #2e7d32;
  font-size: 1.2em;
  border-bottom: 2px solid #c8e6c9;
  padding-bottom: 8px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.info-item {
  padding: 8px 12px;
  background: rgb(46, 125, 50, 0.05);
  border-radius: 8px;
  border: 1px solid rgb(46, 125, 50, 0.1);
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.item-label {
  font-weight: 600;
  color: #2e7d32;
  flex-shrink: 0;
}

.item-values {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-value {
  flex: 1;
  line-height: 1.4;
  text-align: right;
}

.price {
  color: #4a9b4f;
  font-weight: 600;
}

.features {
  flex-direction: row !important;
  flex-wrap: wrap;
  gap: 8px;
}

.feature {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.feature.diy {
  background: #fff3e0;
  color: #e65100;
}

.feature.customize {
  background: #f3e5f5;
  color: #6a1b9a;
}

.feature.outdoor {
  background: #e8f5e9;
  color: #2e7d32;
}

.feature.interactive {
  background: #e3f2fd;
  color: #1565c0;
}

.feature.surface {
  background: #fce4ec;
  color: #c2185b;
}

/* DIY配方展示样式 */
.recipe-section h3 {
  margin: 0 0 20px;

  // color: #e65100;
  font-size: 1.5em;
}

.recipe-content {
  display: flex;
  flex-direction: column;
  gap: 15px;

  background: white;
  border-radius: 15px;
  padding: 15px;
  border: 2px solid #e0e0e0;
}

.recipe-header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 15px;
  align-items: start;
}

.recipe-image {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.recipe-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.recipe-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recipe-info-item label {
  font-weight: 600;
  color: #666;
  font-size: 13px;
}

.recipe-info-item span {
  color: #333;
  font-size: 15px;
}

.materials-section hr {
  width: 100%;
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 15px 0;
}

.materials-section h4 {
  margin: 0 0 15px;
  color: #333;
  font-size: 1.1em;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.recipe-notes {
  padding: 15px;
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  border-radius: 6px;
  font-size: 14px;
  color: #555;
}

.recipe-notes strong {
  color: #e65100;
}

/* 变体展示样式 */
.variants-section h3 {
  margin: 0 0 20px;
  color: #333;
  font-size: 1.5em;
}

.variants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin: 0 0 20px;
}

.variant-card {
  transition: all 0.3s;
  cursor: pointer;
  background: white;
  border-radius: 15px;
  padding: 5px;
  border: 2px solid #e0e0e0;
}

.variant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgb(0, 0, 0, 0.15);
  border-color: #4a9b4f;
}

.variant-card.selected {
  border-color: #2e7d32;
  // background: rgb(46, 125, 50, 0.05);
}

.variant-image {
  width: 100%;
  aspect-ratio: 1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.variant-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.variant-info {
  padding: 10px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.variant-id-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.variant-id-text {
  font-size: 11px;
  color: #999;
}

.variant-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pattern-name {
  font-weight: 400;
  color: #666;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}

.error {
  color: #e74c3c;
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* 响应式设计 */
@media (width <= 968px) {
  .top-section {
    flex-direction: column;
    gap: 20px;
  }

  .image-container {
    width: 150px;
    height: 150px;
  }

  .title-section h1 {
    font-size: 2em;
  }

  .cards-section {
    grid-template-columns: 1fr;
  }

  .variants-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .recipe-header {
    grid-template-columns: 1fr;
  }

  .recipe-image {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }

  .materials-grid {
    grid-template-columns: 1fr;
  }
}

@media (width <= 768px) {
  .detail-content {
    padding: 20px;
    gap: 20px;
  }

  .top-section {
    gap: 15px;
  }

  .image-container {
    width: 120px;
    height: 120px;
  }

  .title-section h1 {
    font-size: 1.5em;
  }

  .cards-section {
    grid-template-columns: 1fr;
  }

  .variants-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .recipe-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
