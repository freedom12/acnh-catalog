<script setup lang="ts">
import type { Recipe } from '../types/recipe';
import { UI_TEXT } from '../constants';
import { useItemsData } from '../composables/useItemsData';
import { getChineseText, formatPrice, joinArray } from '../utils/common';
import BaseCard from './BaseCard.vue';
import { useRouter } from 'vue-router';

interface Props {
    data: Recipe;
}

const props = defineProps<Props>();
const router = useRouter();
const { itemNameMap } = useItemsData();

// 获取材料信息
const getMaterialInfo = (materialKey: string) => {
    // 在所有物品中查找材料名称对应的物品
    const materialItem = itemNameMap.value[materialKey];

    // 返回材料的名称、图标和ID
    return {
        name: materialItem?.name || materialKey,
        imageUrl: materialItem?.imageUrl || '',
        id: materialItem?.id
    };
};

// 跳转到材料详情页
const goToMaterial = (materialKey: string) => {
    const materialInfo = getMaterialInfo(materialKey);
    if (materialInfo.id) {
        router.push(`/item/${materialInfo.id}`);
    }
};

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.name}`, '_blank');
};
</script>

<template>
    <BaseCard
        colorClass="card--orange"
        :version="props.data.versionAdded"
        :image="props.data.image"
        :displayName="getChineseText(props.data)"
        @click="handleClick"
    >
        <div class="detail-row">
            <span class="detail-label">分类</span>
            <span class="detail-value">{{ props.data.category }}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
            <span class="detail-value price">{{ formatPrice(props.data.sell) }} {{ UI_TEXT.CURRENCY }}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
            <span class="detail-value">{{ joinArray(props.data.source) }}</span>
        </div>
        <div v-if="props.data.materials && Object.keys(props.data.materials).length > 0" class="materials-section">
            <span class="materials-label">所需材料</span>
            <div class="materials-list">
                <div v-for="(quantity, material) in props.data.materials" :key="material" class="material-item"
                    :class="{ 'material-clickable': getMaterialInfo(material).id }"
                    @click="goToMaterial(material)">
                    <div class="material-info">
                        <img v-if="getMaterialInfo(material).imageUrl"
                            :src="getMaterialInfo(material).imageUrl" :alt="getMaterialInfo(material).name"
                            class="material-icon" />
                        <span class="material-name">{{ getMaterialInfo(material).name }}</span>
                    </div>
                    <span class="material-quantity">× {{ quantity }}</span>

                </div>
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

.material-item.material-clickable {
    cursor: pointer;
}

.material-item.material-clickable:hover {
    border-color: #ff9800;
    transform: translateX(3px);
    box-shadow: 0 2px 6px rgba(255, 152, 0, 0.15);
}

.material-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.material-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    background: #f5f5f5;
    border-radius: 4px;
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