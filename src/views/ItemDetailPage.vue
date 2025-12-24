<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItemsData } from "../composables/useItemsData";
import { ItemModel } from "../models";
import {
  getSourceName,
  getTagName,
  getCategoryName,
  getColorName,
} from "../services/dataService";
import MaterialItem from "../components/MaterialItem.vue";
import ColorBlock from "../components/ColorBlock.vue";

const route = useRoute();
const router = useRouter();
const { allItems, loading, error, loadData } = useItemsData();

// 获取物品ID
const itemId = computed(() => Number(route.params.id));

// 查找当前物品
const currentItem = computed(() =>
  allItems.value.find((item) => item.id === itemId.value)
);

// 创建 ItemModel 实例
const itemModel = computed(() =>
  currentItem.value ? new ItemModel(currentItem.value) : null
);

// 获取物品详细信息
const displayImage = computed(() => itemModel.value?.getDisplayImage() || "");
const displayName = computed(() => itemModel.value?.getDisplayName() || "");
const displayId = computed(() => itemModel.value?.getDisplayId() || "");
const displayColors = computed(() => itemModel.value?.getDisplayColors() || []);
const version = computed(() => itemModel.value?.getVersion() || "");
const size = computed(() => itemModel.value?.getSize() || "");
const sources = computed(() => itemModel.value?.getSources() || []);
const seriesName = computed(() => itemModel.value?.getSeriesName() || "");
const tag = computed(() => itemModel.value?.getTag() || "");
const buyPrice = computed(() => itemModel.value?.getBuyPrice());
const sellPrice = computed(() => itemModel.value?.getSellPrice());
const isDIY = computed(() => itemModel.value?.isDIY() || false);
const isCustomizable = computed(
  () => itemModel.value?.isCustomizable() || false
);
const isOutdoor = computed(() => itemModel.value?.isOutdoor() || false);
const isInteractive = computed(() => itemModel.value?.isInteractive() || false);
const hhaPoints = computed(() => itemModel.value?.getHHAPoints());
const stackSize = computed(() => itemModel.value?.getStackSize() || 1);

// 获取配方数据
const recipeData = computed(() => currentItem.value?.recipe);
const hasMaterials = computed(() => {
  return (
    recipeData.value?.materials &&
    Object.keys(recipeData.value.materials).length > 0
  );
});

// 获取原始数据中的更多信息
const rawData = computed(() => currentItem.value?.originalData);
const kitCost = computed(() => rawData.value?.kitCost);
const cyrusPrice = computed(() => rawData.value?.cyrusCustomizePrice);
const exchangePrice = computed(() => rawData.value?.exchangePrice);
const exchangeCurrency = computed(() => rawData.value?.exchangeCurrency);
const surface = computed(() => rawData.value?.surface);
const seasonEvent = computed(() => rawData.value?.seasonEvent);
const hhaCategory = computed(() => rawData.value?.hhaCategory);
const speakerType = computed(() => rawData.value?.speakerType);
const lightingType = computed(() => rawData.value?.lightingType);
const foodPower = computed(() => rawData.value?.foodPower);
const concepts = computed(() => rawData.value?.concepts || []);
const setName = computed(() => rawData.value?.set);

// 获取所有变体
const allVariants = computed(() => {
  if (!itemModel.value) return [];
  const variants = itemModel.value.getVariantGroups();

  // 将变体展平为列表，每个图案作为一个独立项
  const flatVariants: Array<{
    variantName: string;
    patternName: string;
    imageUrl: string;
    id: number;
    colors: string[];
  }> = [];

  variants.forEach((variant) => {
    variant.patterns.forEach((pattern) => {
      flatVariants.push({
        variantName: variant.variantName,
        patternName: pattern.patternName,
        imageUrl: pattern.imageUrl,
        id: pattern.id,
        colors: pattern.colors,
      });
    });
  });

  return flatVariants;
});

// 拥有状态
const isOwned = computed(() => itemModel.value?.owned || false);

const formatPrice = (price: number): string => {
  return price.toLocaleString("zh-CN");
};

// 返回首页
const goBack = () => {
  router.push("/");
};

// 跳转到Nookipedia页面
const goToNookipedia = () => {
  if (currentItem.value?.originalData?.name) {
    const itemName = currentItem.value.originalData.name;
    // 将空格替换为下划线，构建Nookipedia URL格式：Item:ItemName_(New_Horizons)
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
</script>

<template>
  <div class="detail-container">
    <div v-if="loading" class="loading">正在加载物品数据...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!currentItem" class="error">未找到该物品</div>

    <template v-else>
      <div class="header">
        <button class="back-btn" @click="goBack">← 返回列表</button>
        <h1>物品详情</h1>
      </div>

      <div class="detail-content">
        <div class="image-section">
          <div
            class="main-image"
            @click="goToNookipedia"
            title="点击查看Nookipedia页面"
          >
            <img :src="displayImage" :alt="displayName" />
          </div>
          <div class="owned-badge" :class="{ owned: isOwned }">
            <span class="owned-icon">{{ isOwned ? "✓" : "✗" }}</span>
            <span class="owned-text">{{ isOwned ? "已拥有" : "未拥有" }}</span>
          </div>
        </div>

        <div class="info-section">
          <div class="title-section">
            <h2>{{ displayName }}</h2>
            <div v-if="version !== '未知版本'" class="version-badge">
              {{ version }}
            </div>
          </div>

          <!-- 基础信息 -->
          <div class="info-grid">
            <div class="info-item">
              <label>物品ID:</label>
              <span>{{ displayId || "N/A" }}</span>
            </div>

            <div class="info-item">
              <label>分类:</label>
              <span>{{ getCategoryName(currentItem.category) }}</span>
            </div>

            <div v-if="size !== '未知尺寸'" class="info-item">
              <label>尺寸:</label>
              <span>📏 {{ size }}</span>
            </div>

            <div v-if="displayColors.length > 0" class="info-item">
              <label>颜色:</label>
              <div class="color-display">
                <span
                  v-for="(color, idx) in displayColors"
                  :key="idx"
                  class="color-tag"
                >
                  {{ getColorName(color) }}
                </span>
                <ColorBlock :displayColors="displayColors" />
              </div>
            </div>

            <div v-if="sources.length > 0" class="info-item full-width">
              <label>来源:</label>
              <span
                >📍 {{ sources.map((s) => getSourceName(s)).join(", ") }}</span
              >
            </div>

            <div v-if="tag" class="info-item">
              <label>标签:</label>
              <span>🏷️ {{ getTagName(tag) }}</span>
            </div>

            <div v-if="seriesName !== '无系列'" class="info-item">
              <label>系列:</label>
              <span>📦 {{ seriesName }}</span>
            </div>

            <div v-if="buyPrice" class="info-item">
              <label>购买价格:</label>
              <span class="price">💰 {{ formatPrice(buyPrice) }} 铃钱</span>
            </div>

            <div v-if="sellPrice" class="info-item">
              <label>出售价格:</label>
              <span class="price">💵 {{ formatPrice(sellPrice) }} 铃钱</span>
            </div>

            <div v-if="exchangePrice && exchangeCurrency" class="info-item">
              <label>兑换价格:</label>
              <span class="price"
                >🎫 {{ formatPrice(exchangePrice) }}
                {{ exchangeCurrency }}</span
              >
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
              <div v-if="isDIY" class="feature-badge diy">🔨 可DIY制作</div>
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
                <span class="price">💰 {{ formatPrice(cyrusPrice) }} 铃钱</span>
              </div>
            </div>
          </div>

          <!-- 其他属性 -->
          <div
            v-if="
              hhaPoints ||
              hhaCategory ||
              seasonEvent ||
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

              <div v-if="seasonEvent" class="info-item">
                <label>季节活动:</label>
                <span>🎉 {{ seasonEvent }}</span>
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
          <div v-if="concepts.length > 0 || setName" class="concepts-section">
            <h3>主题与套装</h3>
            <div class="info-grid">
              <div v-if="concepts.length > 0" class="info-item full-width">
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
      <div v-if="recipeData" class="recipe-section">
        <h3>🔨 DIY配方</h3>
        <div class="recipe-content">
          <div class="recipe-header">
            <div v-if="recipeData.image" class="recipe-image">
              <img :src="recipeData.image" :alt="recipeData.name" />
            </div>
            <div class="recipe-basic-info">
              <h4>{{ recipeData.name }}</h4>
              <div class="recipe-info-grid">
                <div
                  v-if="recipeData.source && recipeData.source.length > 0"
                  class="recipe-info-item"
                >
                  <label>配方来源:</label>
                  <span
                    >📍
                    {{
                      recipeData.source.map((s) => getSourceName(s)).join(", ")
                    }}</span
                  >
                </div>
                <div v-if="recipeData.seasonEvent" class="recipe-info-item">
                  <label>季节活动:</label>
                  <span>🎉 {{ recipeData.seasonEvent }}</span>
                </div>
                <div v-if="recipeData.sell" class="recipe-info-item">
                  <label>出售价格:</label>
                  <span class="price"
                    >💵 {{ formatPrice(recipeData.sell) }} 铃钱</span
                  >
                </div>
                <div v-if="recipeData.versionAdded" class="recipe-info-item">
                  <label>添加版本:</label>
                  <span>{{ recipeData.versionAdded }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 材料列表 -->
          <div v-if="hasMaterials" class="materials-section">
            <h4>所需材料</h4>
            <div class="materials-grid">
              <MaterialItem
                v-for="(quantity, material) in recipeData.materials"
                :key="material"
                :material="material"
                :quantity="quantity"
              />
            </div>
          </div>

          <div v-if="recipeData.sourceNotes" class="recipe-notes">
            <strong>备注:</strong> {{ recipeData.sourceNotes }}
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
                :src="variant.imageUrl"
                :alt="`${variant.variantName} - ${variant.patternName}`"
              />
            </div>
            <div class="variant-info">
              <div class="variant-id-row">
                <span class="variant-id-text">ID: {{ variant.id }}</span>
                <ColorBlock
                  v-if="variant.colors.length > 0"
                  :displayColors="variant.colors"
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
</template>

<style scoped>
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  padding: 10px 20px;
  background: #4a9b4f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #3d8042;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 4px 12px rgba(74, 155, 79, 0.2);
}

.main-image::after {
  content: "🔗 查看详情";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(74, 155, 79, 0.9);
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
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
    rgba(255, 255, 255, 0.3),
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
  box-shadow: 0 4px 16px rgba(74, 155, 79, 0.3);
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
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.owned-badge.owned .owned-icon {
  background: rgba(255, 255, 255, 0.25);
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
  margin: 0 0 15px 0;
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
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #ffd54f;
}

.recipe-section h3 {
  margin: 0 0 20px 0;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.recipe-basic-info h4 {
  margin: 0 0 15px 0;
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.materials-section h4 {
  margin: 0 0 15px 0;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.variants-section h3 {
  margin: 0 0 20px 0;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
}

.variant-name {
  font-weight: 500;
  color: #333;
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

@media (max-width: 968px) {
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

@media (max-width: 768px) {
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
