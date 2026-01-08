<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useItemsData } from "../composables/useItemsData";
import { getPriceStr, getSourceName } from "../services/dataService";
import { processImageUrl } from "../utils/imageUtils";
import MaterialItem from "./MaterialItem.vue";
import ColorBlock from "./ColorBlock.vue";
import type { Color } from "../types";
import { joinArray } from "../utils";

const props = defineProps<{
  itemId: number | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { itemIdMap, loading, error, loadData } = useItemsData();

const itemModel = computed(() =>
  props.itemId ? itemIdMap.value[props.itemId] : null
);

const isDIY = computed(() => false);
const isCustomizable = computed(() => false);
const isOutdoor = computed(() => false);
const isInteractive = computed(() => false);
const hhaPoints = computed(() => null);
const stackSize = computed(() => 1);

// 获取配方数据
const recipe = computed(() => itemModel.value?.recipe);
const recipeImageUrl = computed(() => {
  return recipe.value?.images && recipe.value.images[0]
    ? processImageUrl(recipe.value.images[0])
    : "";
});
const hasMaterials = computed(() => {
  return (
    recipe.value?.materials && Object.keys(recipe.value.materials).length > 0
  );
});

// 获取原始数据中的更多信息

const kitCost = computed(() => null);
const cyrusPrice = computed(() => null);
const surface = computed(() => null);
const activity = computed(() => null);
const hhaCategory = computed(() => null);
const speakerType = computed(() => null);
const lightingType = computed(() => null);
const foodPower = computed(() => null);
const concepts = computed(() => []);
const setName = computed(() => null);

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

  variants.forEach((variant) => {
    variant.patterns.forEach((pattern) => {
      flatVariants.push({
        variantName: variant.name,
        patternName: pattern.name,
        image: pattern.image,
        id: pattern.id,
        colors: pattern.colors,
      });
    });
  });

  return flatVariants;
});

// 拥有状态
const isOwned = computed(() => itemModel.value?.owned || false);

// 返回首页
const closeModal = () => {
  emit("close");
};

// 跳转到Nookipedia页面
const goToNookipedia = () => {
  if (itemModel.value?.name) {
    const itemName = itemModel.value.rawName;
    // 将空格替换为下划线,构建Nookipedia URL格式：Item:ItemName_(New_Horizons)
    const urlName = itemName.replace(/ /g, "_");
    window.open(
      `https://nookipedia.com/wiki/Item:${urlName}_(New_Horizons)`,
      "_blank"
    );
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
        <button class="modal-close" @click="closeModal" title="关闭">✕</button>
        <div class="detail-container">
          <div v-if="loading" class="loading">正在加载物品数据...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else-if="!itemModel" class="error">未找到该物品</div>
          <template v-else>
            <div class="detail-content">
              <div class="image-section">
                <div
                  class="main-image"
                  @click="goToNookipedia"
                  title="点击查看Nookipedia页面"
                >
                  <img
                    :src="itemModel.image"
                    :alt="itemModel.name"
                    loading="lazy"
                  />
                </div>
                <div class="owned-badge" :class="{ owned: isOwned }">
                  <span class="owned-icon">{{ isOwned ? "✓" : "✗" }}</span>
                  <span class="owned-text">{{
                    isOwned ? "已拥有" : "未拥有"
                  }}</span>
                </div>
              </div>

              <div class="info-section">
                <div class="title-section">
                  <h2>{{ itemModel.name }}</h2>
                  <div class="version-badge">
                    {{ itemModel.versionName }}
                  </div>
                </div>

                <!-- 基础信息 -->
                <div class="info-grid">
                  <div class="info-item">
                    <label>物品ID:</label>
                    <span>{{ itemModel.id }}</span>
                  </div>

                  <div class="info-item">
                    <label>分类:</label>
                    <span>{{ itemModel.typeName }}</span>
                  </div>

                  <div v-if="itemModel.size" class="info-item">
                    <label>尺寸:</label>
                    <span>📏 {{ itemModel.sizeName }}</span>
                  </div>

                  <div v-if="itemModel.colors.length > 0" class="info-item">
                    <label>颜色:</label>
                    <div class="color-display">
                      <span
                        v-for="(colorName, idx) in itemModel.colorNames"
                        :key="idx"
                        class="color-tag"
                      >
                        {{ colorName }}
                      </span>
                      <ColorBlock :colors="itemModel.colors" />
                    </div>
                  </div>

                  <div
                    v-if="itemModel.sources.length > 0"
                    class="info-item full-width"
                  >
                    <label>来源:</label>
                    <span>📍 {{ joinArray(itemModel.sourceNames) }}</span>
                  </div>

                  <div v-if="itemModel.tag" class="info-item">
                    <label>标签:</label>
                    <span>🏷️ {{ itemModel.tagName }}</span>
                  </div>

                  <div v-if="itemModel.hhaSeries" class="info-item">
                    <label>系列:</label>
                    <span>📦 {{ itemModel.hhaSeriesName }}</span>
                  </div>

                  <div class="info-item">
                    <label>购买价格:</label>
                    <span class="price">
                      💰 {{ itemModel.buyPriceStrs.join(",") || "不可购买" }}
                    </span>
                  </div>

                  <div class="info-item">
                    <label>出售价格:</label>
                    <span class="price"> 💵 {{ itemModel.sellPriceStr }} </span>
                  </div>
                </div>

                <!-- 功能特性 -->
                <div
                  v-if="
                    isDIY ||
                    isCustomizable ||
                    isOutdoor ||
                    isInteractive ||
                    surface !== undefined
                  "
                  class="features-section"
                >
                  <h3>功能特性</h3>
                  <div class="features-grid">
                    <div v-if="isDIY" class="feature-badge diy">
                      🔨 可DIY制作
                    </div>
                    <div v-if="isCustomizable" class="feature-badge customize">
                      🎨 可定制
                    </div>
                    <div v-if="isOutdoor" class="feature-badge outdoor">
                      🌳 户外物品
                    </div>
                    <div v-if="isInteractive" class="feature-badge interactive">
                      ✨ 可交互
                    </div>
                    <div v-if="surface" class="feature-badge surface">
                      📦 可放置物品
                    </div>
                  </div>
                </div>

                <!-- DIY和定制信息 -->
                <div v-if="kitCost || cyrusPrice" class="customization-section">
                  <h3>定制信息</h3>
                  <div class="info-grid">
                    <div v-if="kitCost" class="info-item">
                      <label>定制套件数量:</label>
                      <span>🔧 {{ kitCost }} 个</span>
                    </div>
                    <div v-if="cyrusPrice" class="info-item">
                      <label>Cyrus定制价格:</label>
                      <span class="price"
                        >💰 {{ getPriceStr(cyrusPrice) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 其他属性 -->
                <div
                  v-if="
                    hhaPoints ||
                    hhaCategory ||
                    activity ||
                    stackSize > 1 ||
                    speakerType ||
                    lightingType ||
                    foodPower
                  "
                  class="additional-section"
                >
                  <h3>其他属性</h3>
                  <div class="info-grid">
                    <div v-if="hhaPoints" class="info-item">
                      <label>HHA基础分数:</label>
                      <span>⭐ {{ hhaPoints }}</span>
                    </div>

                    <div v-if="hhaCategory" class="info-item">
                      <label>HHA分类:</label>
                      <span>{{ hhaCategory }}</span>
                    </div>

                    <div v-if="activity" class="info-item">
                      <label>季节活动:</label>
                      <span>🎉 {{ activity }}</span>
                    </div>

                    <div v-if="stackSize > 1" class="info-item">
                      <label>堆叠数量:</label>
                      <span>📚 {{ stackSize }}</span>
                    </div>

                    <div v-if="speakerType" class="info-item">
                      <label>音响类型:</label>
                      <span>🔊 {{ speakerType }}</span>
                    </div>

                    <div v-if="lightingType" class="info-item">
                      <label>照明类型:</label>
                      <span>💡 {{ lightingType }}</span>
                    </div>

                    <div v-if="foodPower" class="info-item">
                      <label>食物能量:</label>
                      <span>🍎 {{ foodPower }}</span>
                    </div>
                  </div>
                </div>

                <!-- 概念和套装 -->
                <div
                  v-if="concepts.length > 0 || setName"
                  class="concepts-section"
                >
                  <h3>主题与套装</h3>
                  <div class="info-grid">
                    <div
                      v-if="concepts.length > 0"
                      class="info-item full-width"
                    >
                      <label>主题概念:</label>
                      <div class="concepts-list">
                        <span
                          v-for="(concept, idx) in concepts"
                          :key="idx"
                          class="concept-tag"
                        >
                          {{ concept }}
                        </span>
                      </div>
                    </div>

                    <div v-if="setName" class="info-item">
                      <label>套装:</label>
                      <span>🎁 {{ setName }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- DIY配方展示 - 在变体之上 -->
            <div v-if="recipe" class="recipe-section">
              <h3>🔨 DIY配方</h3>
              <div class="recipe-content">
                <div class="recipe-header">
                  <div v-if="recipeImageUrl" class="recipe-image">
                    <img
                      :src="recipeImageUrl"
                      :alt="recipe.name"
                      loading="lazy"
                    />
                  </div>
                  <div class="recipe-basic-info">
                    <h4>{{ recipe.name }}</h4>
                    <div class="recipe-info-grid">
                      <div
                        v-if="recipe.source && recipe.source.length > 0"
                        class="recipe-info-item"
                      >
                        <label>配方来源:</label>
                        <span
                          >📍
                          {{
                            recipe.source
                              .map((s) => getSourceName(s))
                              .join(", ")
                          }}</span
                        >
                      </div>
                      <div v-if="recipe.activity" class="recipe-info-item">
                        <label>季节活动:</label>
                        <span>🎉 {{ recipe.activity }}</span>
                      </div>
                      <div v-if="recipe.sell" class="recipe-info-item">
                        <label>出售价格:</label>
                        <span class="price"
                          >💵 {{ getPriceStr(recipe.sell) }}</span
                        >
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
                  <h4>所需材料</h4>
                  <div class="materials-grid">
                    <MaterialItem
                      v-for="(quantity, material) in recipe.materials"
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
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use "../styles/view-styles";

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
  transform: scale(0.9) translateY(20px);
}

/* 模态框遮罩层 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 10px;
  overflow-y: auto;
}

/* 模态框容器 */
.modal-container {
  position: relative;
  background: #f5f5f5;
  border-radius: var(--border-radius-xl);
  max-width: 1000px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 40px rgb(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

/* 滚动区域 */
.detail-container {
  padding: 15px 20px;
  overflow: hidden auto;
  flex: 1;
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

/* 关闭按钮 */
.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  border: none;
  background: rgb(0, 0, 0, 0.6);
  color: white;
  font-size: 24px;
  line-height: 1;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;
  padding: 0;
  flex-shrink: 0;
}

.modal-close:hover {
  background: rgb(0, 0, 0, 0.8);
  transform: rotate(90deg) scale(1.1);
}

.header {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.header h1 {
  color: #4a9b4f;
  margin: 0;
}

.detail-content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgb(0, 0, 0, 0.1);
}

.image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.main-image:hover {
  background: #e8f5e9;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgb(74, 155, 79, 0.2);
}

.main-image::after {
  content: "🔗 查看详情";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgb(74, 155, 79, 0.9);
  color: white;
  padding: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s;
}

.main-image:hover::after {
  opacity: 1;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.owned-badge {
  width: 100%;
  padding: 16px 24px;
  border: 3px solid #e0e0e0;
  background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgb(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  color: #999;
}

.owned-badge::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.owned-badge:hover::before {
  left: 100%;
}

.owned-badge.owned {
  background: linear-gradient(135deg, #66bb6a 0%, #4a9b4f 100%);
  border-color: #4a9b4f;
  color: white;
  box-shadow: 0 4px 16px rgb(74, 155, 79, 0.3);
  transform: translateY(-2px);
}

.owned-icon {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgb(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.owned-badge.owned .owned-icon {
  background: rgb(255, 255, 255, 0.25);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.owned-text {
  font-size: 18px;
  letter-spacing: 0.5px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.title-section h2 {
  margin: 0;
  color: #333;
  font-size: 2em;
}

.version-badge {
  background: #ff9800;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.info-item span {
  color: #333;
  font-size: 16px;
}

.color-display {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.color-tag {
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
  color: #555;
}

.price {
  color: #4a9b4f;
  font-weight: 600;
}

/* 功能特性样式 */
.features-section,
.customization-section,
.additional-section,
.concepts-section,
.variants-section {
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.features-section h3,
.customization-section h3,
.additional-section h3,
.concepts-section h3,
.variants-section h3 {
  margin: 0 0 15px;
  color: #333;
}

.features-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feature-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.feature-badge.diy {
  background: #fff3e0;
  color: #e65100;
}

.feature-badge.customize {
  background: #f3e5f5;
  color: #6a1b9a;
}

.feature-badge.outdoor {
  background: #e8f5e9;
  color: #2e7d32;
}

.feature-badge.interactive {
  background: #e3f2fd;
  color: #1565c0;
}

.feature-badge.surface {
  background: #fce4ec;
  color: #c2185b;
}

/* 概念标签 */
.concepts-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.concept-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 500;
}

/* DIY配方展示样式 */
.recipe-section {
  margin-top: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgb(0, 0, 0, 0.1);
  border: 2px solid #ffd54f;
}

.recipe-section h3 {
  margin: 0 0 20px;
  color: #e65100;
  font-size: 1.5em;
}

.recipe-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recipe-header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
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
  box-shadow: 0 2px 8px rgb(0, 0, 0, 0.1);
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.recipe-basic-info h4 {
  margin: 0 0 15px;
  color: #333;
  font-size: 1.3em;
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

.materials-section {
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgb(0, 0, 0, 0.05);
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
.variants-section {
  margin-top: 30px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgb(0, 0, 0, 0.1);
}

.variants-section h3 {
  margin: 0 0 20px;
  color: #333;
  font-size: 1.5em;
}

.variants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.variant-card {
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.variant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgb(0, 0, 0, 0.15);
  border-color: #4a9b4f;
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

.variants-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.variant-item {
  padding: 10px 15px;
  background: #f5f5f5;
  border-radius: 6px;
  display: flex;
  gap: 8px;
  align-items: center;

  .variant-name {
    font-weight: 500;
    color: #333;
  }
}

.pattern-count {
  color: #666;
  font-size: 14px;
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

@media (width <= 968px) {
  .detail-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .main-image {
    max-width: 400px;
    margin: 0 auto;
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
  .info-grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .variants-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .recipe-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
