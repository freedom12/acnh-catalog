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
  getColorName,
  getSourceName,
  getClothingThemeName,
  getClothingStyleName,
  getCatalogName,
} from '../services/dataService';
import { ItemType, Version, Color, ClothingTypes, Catalog } from '../types/item';
import { useActivitysData } from '../composables/useActivitysData';

const { getOptions } = useActivitysData();
const {
  allItems: _allItems,
  loading,
  error,
  loadData,
  updateCatalogData,
} = useItemsData();
const allItems = computed(() => _allItems.value.filter((item) => item.isClothing));

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
  const versionsOptions = Object.values(Version)
    .reverse()
    .map((version) => ({
      value: version,
      label: getVersionName(version),
    }));

  // 颜色选项
  const colorsOptions = Object.values(Color).map((color) => ({
    value: color,
    label: getColorName(color),
  }));

  const catalogOptions = Object.values(Catalog).map((catalog) => ({
    value: catalog,
    label: getCatalogName(catalog),
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

  // 活动选项
  const activitiesOptions = getOptions();

  const filtersList: Filter[] = [
    { label: '分类', value: 'type', options: typesOptions },
    { label: '拥有状态', value: 'owned', options: ownedOptions },
    { label: '版本', value: 'version', options: versionsOptions },
    { label: '颜色', value: 'color', options: colorsOptions },
    { label: '目录', value: 'catalog', options: catalogOptions },
    { label: '来源', value: 'source', options: sourcesOptions },
    { label: '活动', value: 'activity', options: activitiesOptions },
    { label: '服饰主题', value: 'theme', options: themesOptions },
    { label: '服饰风格', value: 'style', options: stylesOptions },
  ];
  return filtersList;
});

const { filteredData, handleFiltersChanged } = useFilter(
  allItems,
  (item, searchQuery, selectedFilters) => {
    // 搜索筛选
    if (searchQuery) {
      if (searchQuery.startsWith('#')) {
        const id = parseInt(searchQuery.slice(1), 10);
        if (!item.matchesId(id)) {
          return false;
        }
        item.switchToIdVariant(id);
      } else {
        const lowerQuery = searchQuery.toLowerCase();
        if (
          !item.name.toLowerCase().includes(lowerQuery) &&
          !item.rawName.toLowerCase().includes(lowerQuery)
        ) {
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

    // 颜色筛选 - 使用matchesColor并切换到匹配的变体
    if (selectedFilters.color) {
      const color = selectedFilters.color as Color;
      if (!item.matchesColor(color)) {
        return false;
      }
      // 切换到第一个符合条件的变体
      item.switchToColorVariant(color);
    }

    // 目录筛选
    if (selectedFilters.catalog) {
      if (!item.matchesCatalog(selectedFilters.catalog as Catalog)) return false;
    }

    // 来源筛选
    if (selectedFilters.source) {
      if (!item.matchesSource(selectedFilters.source as string)) return false;
    }

    // 活动筛选
    if (selectedFilters.activity) {
      if (!item.matchesActivity(selectedFilters.activity as string)) return false;
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

    const nameDiff = a.name.localeCompare(b.name, 'zh-CN');
    if (nameDiff !== 0) return nameDiff;

    return a.id - b.id;
  });

  // return filteredData.value;
});

// 计算拥有的物品数量
const ownedItemsCount = computed(
  () => allItems.value.filter((item) => item.owned).length
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
    selection-key="items"
  >
    <template #filters>
      <FilterSection
        :filters="filters"
        :total-count="allItems.length"
        :current-count="filteredData.length"
        :extra-stats="[{ label: '已拥有', value: ownedItemsCount }]"
        selection-key="items"
        @filters-changed="handleFiltersChanged"
      >
        <template #action-buttons>
          <CatalogUploader @catalog-uploaded="handleCatalogUpload" />
        </template>
      </FilterSection>
    </template>
  </DataView>
</template>
