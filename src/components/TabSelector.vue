<script setup lang="ts">
import { ENTITY_ICONS } from '../constants';

export type TabType = 'items' | 'villagers' | 'npcs' | 'creatures' | 'reactions' | 'recipes' | 'construction';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

interface Props {
  activeTab: TabType;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:activeTab': [tab: TabType];
}>();

const tabs: Tab[] = [
  { id: 'items', label: '物品', icon: ENTITY_ICONS.ITEMS },
  { id: 'villagers', label: '村民', icon: ENTITY_ICONS.VILLAGERS },
  { id: 'npcs', label: 'NPC', icon: ENTITY_ICONS.NPCS },
  { id: 'creatures', label: '生物', icon: ENTITY_ICONS.CREATURES },
  { id: 'reactions', label: '表情', icon: ENTITY_ICONS.REACTIONS },
  { id: 'recipes', label: 'DIY配方', icon: ENTITY_ICONS.RECIPES },
  { id: 'construction', label: '改建', icon: ENTITY_ICONS.CONSTRUCTION }
];

const selectTab = (tabId: TabType) => {
  emit('update:activeTab', tabId);
};
</script>

<template>
  <div class="tab-selector">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab-button', { active: activeTab === tab.id }]"
      @click="selectTab(tab.id)"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.tab-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #666;
}

.tab-button:hover {
  border-color: #4a9b4f;
  background-color: #f0f8f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(74, 155, 79, 0.2);
}

.tab-button.active {
  border-color: #4a9b4f;
  background-color: #4a9b4f;
  color: white;
  box-shadow: 0 4px 12px rgba(74, 155, 79, 0.3);
}

.tab-icon {
  font-size: 1.3em;
}

.tab-label {
  font-weight: 600;
}

@media (max-width: 600px) {
  .tab-selector {
    gap: 8px;
  }
  
  .tab-button {
    padding: 10px 20px;
    font-size: 1em;
  }
  
  .tab-icon {
    font-size: 1.2em;
  }
}
</style>
