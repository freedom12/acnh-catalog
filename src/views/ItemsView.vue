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
  getTagName,
  getCatalogName,
} from '../services/dataService';
import {
  ItemType,
  Version,
  ItemSize,
  Color,
  getItemTagOrder,
  ClothingTypes,
  Catalog,
} from '../types/item';
import { useActivitysData } from '../composables/useActivitysData';

const { getOptions } = useActivitysData();
const {
  allItems: _allItems,
  loading,
  error,
  loadData,
  updateCatalogData,
} = useItemsData();
const allItems = computed(() => _allItems.value.filter((item) => !item.isClothing));
const filters = computed<Filter[]>(() => {
  const itemsArray = allItems.value;

  // 类型选项
  const typesOptions = Object.values(ItemType)
    .filter((type) => ClothingTypes.indexOf(type) === -1)
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
  const versionsOptions = Object.values(Version).reverse().map((version) => ({
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

  const catalogOptions = Object.values(Catalog).map((catalog) => ({
    value: catalog,
    label: getCatalogName(catalog),
  }));

  const sourcesSet = new Set<string>();
  const seriesSet = new Set<string>();
  const conceptsSet = new Set<string>();
  const setsSet = new Set<string>();
  const categoriesSet = new Set<string>();
  const tagsSet = new Set<string>();
  itemsArray.forEach((item) => {
    // 收集来源
    item.sources.forEach((s) => sourcesSet.add(s));

    // 收集 HHA 主题
    if (item.hhaSeries) seriesSet.add(item.hhaSeries);

    // 收集 HHA 场景
    item.hhaConcepts.forEach((concept) => conceptsSet.add(concept));

    // 收集 HHA 套组
    if (item.hhaSet) setsSet.add(item.hhaSet);

    // 收集 HHA 分类
    if (item.hhaCategory) categoriesSet.add(item.hhaCategory);

    // 收集标签
    if (import.meta.env.DEV && item.tag) {
      tagsSet.add(item.tag);
    }
  });

  // 来源选项
  const sourcesOptions = [...sourcesSet]
    .map((source) => ({
      value: source,
      label: getSourceName(source),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // HHA主题选项
  const seriesOptions = [...seriesSet]
    .map((ser) => ({
      value: ser,
      label: getHHASeriesName(ser),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // HHA场景选项
  const conceptsOptions = [...conceptsSet]
    .map((concept) => ({
      value: concept,
      label: getHHAConceptName(concept),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // HHA套组选项
  const setsOptions = [...setsSet]
    .map((set) => ({
      value: set,
      label: getHHASetName(set),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // HHA分类选项
  const categoriesOptions = [...categoriesSet]
    .map((category) => ({
      value: category,
      label: getHHACategoryName(category),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

  // 活动选项
  const activitiesOptions = getOptions();

  const filtersList: Filter[] = [
    { label: '分类', value: 'type', options: typesOptions },
    { label: '拥有状态', value: 'owned', options: ownedOptions },
    { label: '版本', value: 'version', options: versionsOptions },
    { label: '尺寸', value: 'size', options: sizesOptions },
    { label: '颜色', value: 'color', options: colorsOptions },
    { label: '目录', value: 'catalog', options: catalogOptions },
    { label: '来源', value: 'source', options: sourcesOptions },
    { label: '活动', value: 'activity', options: activitiesOptions },
    { label: 'HHA主题', value: 'series', options: seriesOptions },
    { label: 'HHA场景', value: 'concept', options: conceptsOptions },
    { label: 'HHA套组', value: 'set', options: setsOptions },
    { label: 'HHA分类', value: 'category', options: categoriesOptions },
  ];

  if (import.meta.env.DEV) {
    // 标签选项
    const tagsOptions = [...tagsSet]
      .map((tag) => ({
        value: tag,
        label: tag + ' - ' + getTagName(tag),
      }))
      .sort((a, b) => {
        const order1 = getItemTagOrder(a.value);
        const order2 = getItemTagOrder(b.value);
        if (order1 !== order2) {
          return order1 - order2;
        }
        return a.label.localeCompare(b.label, 'zh-CN');
      });
    filtersList.push({ label: '标签', value: 'tag', options: tagsOptions });
  }
  return filtersList;
});

const { filteredData, handleFiltersChanged } = useFilter(
  allItems,
  (item, searchQuery, selectedFilters) => {
    // 搜索筛选
    if (searchQuery) {
      if (searchQuery.startsWith('#')) {
        if ('#' + item.id !== searchQuery) {
          return false;
        }
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

    // 标签筛选
    if (selectedFilters.tag) {
      if (!item.matchesTag(selectedFilters.tag as string)) return false;
    }

    // HHA主题筛选
    if (selectedFilters.series) {
      if (!item.matchesSeries(selectedFilters.series as string)) return false;
    }

    // HHA场景筛选
    if (selectedFilters.concept) {
      if (!item.matchesConcept(selectedFilters.concept as string)) return false;
    }

    // HHA套组筛选
    if (selectedFilters.set) {
      if (!item.matchesSet(selectedFilters.set as string)) return false;
    }

    // HHA分类筛选
    if (selectedFilters.category) {
      if (!item.matchesCategory(selectedFilters.category as string)) return false;
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
