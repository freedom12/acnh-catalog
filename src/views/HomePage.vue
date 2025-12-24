<script setup lang="ts">
import { ref } from 'vue';
import type { TabType } from '../components/TabSelector.vue';
import TabSelector from '../components/TabSelector.vue';
import ItemsTab from './ItemsTab.vue';
import VillagersTab from './VillagersTab.vue';
import NPCsTab from './NPCsTab.vue';
import CreaturesTab from './CreaturesTab.vue';
import ReactionsTab from './ReactionsTab.vue';
import RecipesTab from './RecipesTab.vue';
import ConstructionTab from './ConstructionTab.vue';

// 当前选中的标签
const activeTab = ref<TabType>('items');
</script>

<template>
  <div class="container">
    <header>
      <h1>动物森友会目录</h1>
    </header>

    <TabSelector v-model:active-tab="activeTab" />

    <!-- 根据选中的标签显示对应内容 -->
    <ItemsTab v-if="activeTab === 'items'" />
    <VillagersTab v-else-if="activeTab === 'villagers'" />
    <NPCsTab v-else-if="activeTab === 'npcs'" />
    <CreaturesTab v-else-if="activeTab === 'creatures'" />
    <ReactionsTab v-else-if="activeTab === 'reactions'" />
    <RecipesTab v-else-if="activeTab === 'recipes'" />
    <ConstructionTab v-else-if="activeTab === 'construction'" />
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
</style>
