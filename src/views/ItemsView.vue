<script setup lang="ts">
import { computed } from 'vue';
import { useItemsData } from '../composables/useItemsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import FilterSection, { type Filter } from '../components/FilterSection.vue';
import ItemCard from '../components/ItemCard.vue';
import CatalogUploader from '../components/CatalogUploader.vue';
import {
  getItemTypeName,
  getVersionName,
  getSizeName,
  getColorName,
  getSourceName,
  getHHASeriesName,
  getHHAConceptName,
  getHHASetName,
  getHHACategoryName,
  getClothingThemeName,
  getClothingStyleName,
  getTagName,
} from '../services/dataService';
import { ItemType, Version, ItemSize, Color } from '../types/item';

const { allItems, loading, error, loadData, updateCatalogData } = useItemsData();

const filters = computed<Filter[]>(() => {
  const itemsArray = allItems.value;

  // 类型选项
  const typesOptions = Object.values(ItemType).map((type) => ({
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

  // 来源选项
  const sourcesSet = new Set<string>();
  itemsArray.forEach((item) => {
    item.sources.forEach((s) => sourcesSet.add(s));
  });
  const sourcesOptions = [...sourcesSet]
    .map((source) => ({
      value: source,
      label: getSourceName(source),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // 标签选项
  const tagsSet = new Set(
    itemsArray
      .map((item) => {
        if (item.tag && item.type == ItemType.Other) {
          return item.tag;
        } else {
          return null;
        }
      })
      .filter((t): t is string => !!t)
  );
  const tagsOptions = [...tagsSet]
    .map((tag) => ({
      value: tag,
      label: tag + ' - ' + getTagName(tag),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // HHA主题选项
  const seriesSet = new Set(
    itemsArray.map((item) => item.hhaSeries).filter((s): s is string => !!s)
  );
  const seriesOptions = [...seriesSet]
    .map((ser) => ({
      value: ser,
      label: getHHASeriesName(ser),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // HHA场景选项
  const conceptsSet = new Set<string>();
  itemsArray.forEach((item) => {
    item.hhaConcepts.forEach((concept) => conceptsSet.add(concept));
  });
  const conceptsOptions = [...conceptsSet]
    .map((concept) => ({
      value: concept,
      label: getHHAConceptName(concept),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // HHA套组选项
  const setsSet = new Set(
    itemsArray.map((item) => item.hhaSet).filter((s): s is string => !!s)
  );
  const setsOptions = [...setsSet]
    .map((set) => ({
      value: set,
      label: getHHASetName(set),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // HHA分类选项
  const categoriesSet = new Set(
    itemsArray.map((item) => item.hhaCategory).filter((c): c is string => !!c)
  );
  const categoriesOptions = [...categoriesSet]
    .map((category) => ({
      value: category,
      label: getHHACategoryName(category),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // 服饰主题选项
  const themesSet = new Set<string>();
  itemsArray.forEach((item) => {
    item.clothingThemes.forEach((theme) => themesSet.add(theme));
  });
  const themesOptions = [...themesSet]
    .map((theme) => ({
      value: theme,
      label: getClothingThemeName(theme),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // 服饰风格选项
  const stylesSet = new Set<string>();
  itemsArray.forEach((item) => {
    item.clothingStyles.forEach((style) => stylesSet.add(style));
  });
  const stylesOptions = [...stylesSet]
    .map((style) => ({
      value: style,
      label: getClothingStyleName(style),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  return [
    { label: '类型', value: 'typesFilter', options: typesOptions },
    { label: '拥有状态', value: 'ownedFilter', options: ownedOptions },
    { label: '版本', value: 'versionFilter', options: versionsOptions },
    { label: '尺寸', value: 'sizeFilter', options: sizesOptions },
    { label: '颜色', value: 'colorFilter', options: colorsOptions },
    { label: '来源', value: 'sourceFilter', options: sourcesOptions },
    { label: '标签', value: 'tagFilter', options: tagsOptions },
    { label: 'HHA主题', value: 'seriesFilter', options: seriesOptions },
    { label: 'HHA场景', value: 'conceptsFilter', options: conceptsOptions },
    { label: 'HHA套组', value: 'setFilter', options: setsOptions },
    { label: 'HHA分类', value: 'categoryFilter', options: categoriesOptions },
    { label: '服饰主题', value: 'themeFilter', options: themesOptions },
    { label: '服饰风格', value: 'styleFilter', options: stylesOptions },
  ];
});
const { filteredData, handleFiltersChanged } = useFilter(
  allItems,
  (item, searchQuery, selectedFilters) => {
    // 搜索筛选
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(lowerQuery)) {
        return false;
      }
    }

    // 类型筛选
    if (selectedFilters.typesFilter) {
      if (!item.matchesType(selectedFilters.typesFilter as ItemType)) return false;
    }

    // 拥有状态筛选
    if (selectedFilters.ownedFilter !== undefined) {
      if (item.owned !== (selectedFilters.ownedFilter === 1)) return false;
    }

    // 版本筛选
    if (selectedFilters.versionFilter) {
      if (!item.matchesVersion(selectedFilters.versionFilter as Version)) return false;
    }

    // 尺寸筛选
    if (selectedFilters.sizeFilter) {
      if (!item.matchesSize(selectedFilters.sizeFilter as ItemSize)) return false;
    }

    // 颜色筛选 - 使用matchesColor并切换到匹配的变体
    if (selectedFilters.colorFilter) {
      const color = selectedFilters.colorFilter as Color;
      if (!item.matchesColor(color)) {
        return false;
      }
      // 切换到第一个符合条件的变体
      item.switchToColorVariant(color);
    }

    // 来源筛选
    if (selectedFilters.sourceFilter) {
      if (!item.matchesSource(selectedFilters.sourceFilter as string)) return false;
    }

    // 标签筛选
    if (selectedFilters.tagFilter) {
      if (!item.matchesTag(selectedFilters.tagFilter as string)) return false;
    }

    // HHA主题筛选
    if (selectedFilters.seriesFilter) {
      if (!item.matchesSeries(selectedFilters.seriesFilter as string)) return false;
    }

    // HHA场景筛选
    if (selectedFilters.conceptsFilter) {
      if (!item.matchesConcept(selectedFilters.conceptsFilter as string)) return false;
    }

    // HHA套组筛选
    if (selectedFilters.setFilter) {
      if (!item.matchesSet(selectedFilters.setFilter as string)) return false;
    }

    // HHA分类筛选
    if (selectedFilters.categoryFilter) {
      if (!item.matchesCategory(selectedFilters.categoryFilter as string)) return false;
    }

    // 服饰主题筛选
    if (selectedFilters.themeFilter) {
      if (!item.matchesTheme(selectedFilters.themeFilter as string)) return false;
    }

    // 服饰风格筛选
    if (selectedFilters.styleFilter) {
      if (!item.matchesStyle(selectedFilters.styleFilter as string)) return false;
    }

    return true;
  },
  'replace' // 使用 replace 模式完全替换默认筛选
);

const sortedItems = computed(() => {
  return [...filteredData.value].sort((a, b) => {
    const typeDiff = a.type - b.type;
    if (typeDiff !== 0) return typeDiff;

    const orderDiff = a.order - b.order;
    if (orderDiff !== 0) return orderDiff;

    const nameDiff = a.name.localeCompare(b.name, 'zh-CN');
    if (nameDiff !== 0) return nameDiff;

    return a.id - b.id;
  });
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
    :card-component="ItemCard"
  >
    <template #filters>
      <FilterSection
        :filters="filters"
        :total-count="allItems.length"
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
