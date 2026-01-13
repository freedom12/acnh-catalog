<script setup lang="ts">
import { computed } from 'vue';
import { useItemsData } from '../composables/useItemsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import FilterSection, { type Filter } from '../components/FilterSection.vue';
import ClothingCard from '../components/ClothingCard.vue';
import CatalogUploader from '../components/CatalogUploader.vue';
import {
  getItemTypeName,
  getVersionName,
  getSizeName,
  getColorName,
  getSourceName,
  getClothingThemeName,
  getClothingStyleName,
} from '../services/dataService';
import { ItemType, Version, ItemSize, Color, ClothingTypes } from '../types/item';

const { allItems, loading, error, loadData, updateCatalogData } = useItemsData();

const filters = computed<Filter[]>(() => {
  const itemsArray = allItems.value;

  // 类型选项 - 只显示服饰类型
  const typesOptions = Object.values(ItemType)
    .filter((type) => ClothingTypes.indexOf(type) !== -1)
    .map((type) => ({
      value: type,
      label: getItemTypeName(type),
    }));

  // 拥有状态选项
  const ownedOptions = [
    { value: 1, label: '仅已拥有' },
    { value: 2, label: '仅未拥有' },
  ];

  // 版本选项
  const versionsOptions = Object.values(Version).map((version) => ({
    value: version,
    label: getVersionName(version),
  }));

  // 尺寸选项
  const sizesOptions = Object.values(ItemSize).map((size) => ({
    value: size,
    label: getSizeName(size),
  }));

  // 颜色选项
  const colorsOptions = Object.values(Color).map((color) => ({
    value: color,
    label: getColorName(color),
  }));

  const sourcesSet = new Set<string>();
  const themesSet = new Set<string>();
  const stylesSet = new Set<string>();
  itemsArray.forEach((item) => {
    // 收集来源
    item.sources.forEach((s) => sourcesSet.add(s));
    // 收集服饰主题
    item.clothingThemes.forEach((theme) => themesSet.add(theme));
    // 收集服饰风格
    item.clothingStyles.forEach((style) => stylesSet.add(style));
  });

  // 来源选项
  const sourcesOptions = [...sourcesSet]
    .map((source) => ({
      value: source,
      label: getSourceName(source),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // 服饰主题选项
  const themesOptions = [...themesSet]
    .map((theme) => ({
      value: theme,
      label: getClothingThemeName(theme),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // 服饰风格选项
  const stylesOptions = [...stylesSet]
    .map((style) => ({
      value: style,
      label: getClothingStyleName(style),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  const filtersList: Filter[] = [
    { label: '分类', value: 'type', options: typesOptions },
    { label: '拥有状态', value: 'owned', options: ownedOptions },
    { label: '版本', value: 'version', options: versionsOptions },
    { label: '尺寸', value: 'size', options: sizesOptions },
    { label: '颜色', value: 'color', options: colorsOptions },
    { label: '来源', value: 'source', options: sourcesOptions },
    { label: '服饰主题', value: 'theme', options: themesOptions },
    { label: '服饰风格', value: 'style', options: stylesOptions },
  ];
  return filtersList;
});

const { filteredData, handleFiltersChanged } = useFilter(
  allItems,
  (item, searchQuery, selectedFilters) => {
    if (!item.isClothing) {
      return false;
    }
    // 搜索筛选
    if (searchQuery) {
      if (searchQuery.startsWith('#')) {
        if ('#' + item.id !== searchQuery) {
          return false;
        }
      } else {
        const lowerQuery = searchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(lowerQuery)) {
          return false;
        }
      }
    }

    // 类型筛选
    if (selectedFilters.type) {
      if (!item.matchesType(selectedFilters.type as ItemType)) return false;
    }

    // 拥有状态筛选
    if (selectedFilters.owned !== undefined) {
      if (item.owned !== (selectedFilters.owned === 1)) return false;
    }

    // 版本筛选
    if (selectedFilters.version) {
      if (!item.matchesVersion(selectedFilters.version as Version)) return false;
    }

    // 尺寸筛选
    if (selectedFilters.size) {
      if (!item.matchesSize(selectedFilters.size as ItemSize)) return false;
    }

    // 颜色筛选 - 使用matchesColor并切换到匹配的变体
    if (selectedFilters.color) {
      const color = selectedFilters.color as Color;
      if (!item.matchesColor(color)) {
        return false;
      }
      // 切换到第一个符合条件的变体
      item.switchToColorVariant(color);
    }

    // 来源筛选
    if (selectedFilters.source) {
      if (!item.matchesSource(selectedFilters.source as string)) return false;
    }

    // 服饰主题筛选
    if (selectedFilters.theme) {
      if (!item.matchesTheme(selectedFilters.theme as string)) return false;
    }

    // 服饰风格筛选
    if (selectedFilters.style) {
      if (!item.matchesStyle(selectedFilters.style as string)) return false;
    }

    return true;
  },
  'replace' // 使用 replace 模式完全替换默认筛选
);

const sortedItems = computed(() => {
  return [...filteredData.value].sort((a, b) => {
    const typeDiff = a.type - b.type;
    if (typeDiff !== 0) return typeDiff;

    const subtypeDiff = a.subtype - b.subtype;
    if (subtypeDiff !== 0) return subtypeDiff;

    const orderDiff = a.order - b.order;
    if (orderDiff !== 0) return orderDiff;

    const tagOrderDiff = a.tagOrder - b.tagOrder;
    if (tagOrderDiff !== 0) return tagOrderDiff;

    const nameDiff = a.name.localeCompare(b.name, 'zh-CN');
    if (nameDiff !== 0) return nameDiff;

    return a.id - b.id;
  });

  // return filteredData.value;
});

// 计算拥有的物品数量
const ownedItemsCount = computed(
  () => allItems.value.filter((item) => item.owned && item.isClothing).length
);

// 处理目录文件上传
const handleCatalogUpload = (data: {
  items: Array<{ label: string; unique_id: number }>;
}) => {
  updateCatalogData(data);
};
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="sortedItems"
    :per-page="100"
    :card-component="ClothingCard"
  >
    <template #filters>
      <FilterSection
        :filters="filters"
        :total-count="allItems.filter(item => item.isClothing).length"
        :current-count="filteredData.length"
        :extra-stats="[{ label: '已拥有', value: ownedItemsCount }]"
        @filters-changed="handleFiltersChanged"
      >
        <template #action-buttons>
          <CatalogUploader @catalog-uploaded="handleCatalogUpload" />
        </template>
      </FilterSection>
    </template>
  </DataView>
</template>