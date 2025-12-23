<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useItemsData } from '../composables/useItemsData';
import { useItemsFilter } from '../composables/useItemsFilter';
import { loadVillagersData, loadNPCsData } from '../services/dataService';
import type { Villager, NPC } from '../types';
import type { TabType } from '../components/TabSelector.vue';
import TabSelector from '../components/TabSelector.vue';
import FilterControls from '../components/FilterControls.vue';
import ItemsGrid from '../components/ItemsGrid.vue';
import VillagersGrid from '../components/VillagersGrid.vue';
import NPCsGrid from '../components/NPCsGrid.vue';
import Pagination from '../components/Pagination.vue';
import StatsDisplay from '../components/StatsDisplay.vue';

// 当前选中的标签
const activeTab = ref<TabType>('items');

// 使用数据加载组合函数
const { allItems, loading, error, loadData } = useItemsData();

// 村民和NPC数据
const allVillagers = ref<Villager[]>([]);
const allNPCs = ref<NPC[]>([]);
const villagersLoading = ref(false);
const npcsLoading = ref(false);
const villagersError = ref('');
const npcsError = ref('');

// 使用筛选和分页组合函数
const {
  filters,
  sortValue,
  itemsPerPage,
  currentPage,
  filteredItems,
  totalPages,
  itemsToDisplay,
  handleFilterChange,
  handleSortChange,
  handlePageChange,
  handlePerPageChange
} = useItemsFilter(allItems);

// 计算拥有的物品数量
const ownedItemsCount = computed(() => 
  allItems.value.filter(item => item.owned).length
);

// 监听数据加载完成，初始化筛选列表
watch(allItems, (newItems) => {
  if (newItems.length > 0) {
    filteredItems.value = [...newItems];
  }
});

// 监听标签切换，加载对应数据
watch(activeTab, async (newTab) => {
  if (newTab === 'villagers' && allVillagers.value.length === 0) {
    await loadVillagers();
  } else if (newTab === 'npcs' && allNPCs.value.length === 0) {
    await loadNPCs();
  }
});

// 加载村民数据
const loadVillagers = async () => {
  try {
    villagersLoading.value = true;
    villagersError.value = '';
    allVillagers.value = await loadVillagersData();
    villagersLoading.value = false;
  } catch (err) {
    console.error('加载村民数据失败:', err);
    villagersError.value = '加载村民数据失败';
    villagersLoading.value = false;
  }
};

// 加载NPC数据
const loadNPCs = async () => {
  try {
    npcsLoading.value = true;
    npcsError.value = '';
    allNPCs.value = await loadNPCsData();
    npcsLoading.value = false;
  } catch (err) {
    console.error('加载NPC数据失败:', err);
    npcsError.value = '加载NPC数据失败';
    npcsLoading.value = false;
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="container">
    <header>
      <h1>🍃 动物森友会目录 🍃</h1>
      <p class="subtitle">浏览和搜索你喜欢的内容</p>
    </header>

    <TabSelector v-model:active-tab="activeTab" />

    <!-- Items Tab -->
    <template v-if="activeTab === 'items'">
      <div v-if="loading" class="loading">正在加载物品数据...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <template v-else>
        <FilterControls
          v-model:filters="filters"
          v-model:sortValue="sortValue"
          v-model:perPage="itemsPerPage"
          :all-items="allItems"
          @filter-change="handleFilterChange"
          @sort-change="handleSortChange"
          @per-page-change="handlePerPageChange"
        />

        <StatsDisplay
          :total-items="allItems.length"
          :displayed-items="filteredItems.length"
          :owned-items="ownedItemsCount"
        />

        <ItemsGrid :items="itemsToDisplay" :color-filter="filters.colorFilter" />

        <Pagination
          v-if="totalPages > 1 || itemsPerPage !== filteredItems.length"
          :current-page="currentPage"
          :total-pages="totalPages"
          :per-page="itemsPerPage"
          :items-count="filteredItems.length"
          @page-change="handlePageChange"
        />
      </template>
    </template>

    <!-- Villagers Tab -->
    <template v-else-if="activeTab === 'villagers'">
      <div v-if="villagersLoading" class="loading">正在加载村民数据...</div>
      <div v-else-if="villagersError" class="error">{{ villagersError }}</div>
      <template v-else>
        <div class="stats">
          <p class="stat-item">共 {{ allVillagers.length }} 位村民</p>
        </div>
        <VillagersGrid :villagers="allVillagers" />
      </template>
    </template>

    <!-- NPCs Tab -->
    <template v-else-if="activeTab === 'npcs'">
      <div v-if="npcsLoading" class="loading">正在加载NPC数据...</div>
      <div v-else-if="npcsError" class="error">{{ npcsError }}</div>
      <template v-else>
        <div class="stats">
          <p class="stat-item">共 {{ allNPCs.length }} 位NPC</p>
        </div>
        <NPCsGrid :npcs="allNPCs" />
      </template>
    </template>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #4a9b4f;
  font-size: 2.5em;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 1.1em;
  margin-top: 10px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}

.error {
  color: #e74c3c;
}

.stats {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-item {
  font-size: 1.1em;
  color: #4a9b4f;
  font-weight: 600;
  margin: 0;
}
</style>
