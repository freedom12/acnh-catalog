<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ENTITY_ICONS } from '../constants';

interface ViewItem {
  path: string;
  label: string;
  icon: string;
}

const route = useRoute();

const views: ViewItem[] = [
  { path: '/items', label: '物品', icon: ENTITY_ICONS.ITEMS },
  { path: '/villagers', label: '村民', icon: ENTITY_ICONS.VILLAGERS },
  { path: '/npcs', label: '角色', icon: ENTITY_ICONS.NPCS },
  { path: '/creatures', label: '生物', icon: ENTITY_ICONS.CREATURES },
  { path: '/fossils', label: '化石', icon: ENTITY_ICONS.FOSSILS },
  { path: '/artworks', label: '艺术品', icon: ENTITY_ICONS.ARTWORKS },
  { path: '/plants', label: '植物', icon: ENTITY_ICONS.PLANTS },
  { path: '/music', label: '音乐', icon: ENTITY_ICONS.MUSICS },
  { path: '/reactions', label: '表情', icon: ENTITY_ICONS.REACTIONS },
  { path: '/recipes', label: '配方', icon: ENTITY_ICONS.RECIPES },
  { path: '/constructions', label: '改建', icon: ENTITY_ICONS.CONSTRUCTION },
  { path: '/message-cards', label: '贺卡', icon: ENTITY_ICONS.MESSAGE_CARDS },
  { path: '/patterns', label: '杂项', icon: ENTITY_ICONS.MISC },
];

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<template>
  <div class="view-selector">
    <RouterLink
      v-for="view in views"
      :key="view.path"
      :to="view.path"
      :class="['view-button', { active: isActive(view.path) }]"
    >
      <span class="view-icon">{{ view.icon }}</span>
      <span class="view-label">{{ view.label }}</span>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.view-selector {
  display: flex;
  gap: 8px;
  margin-bottom: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.view-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-xl);
  background-color: white;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: var(--transition-normal);
  color: var(--secondary-color);
  text-decoration: none;
}

.view-button:hover {
  border-color: var(--primary-color);
  background-color: #f0f8f0;
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.view-button.active {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-md);
}

.view-icon {
  font-size: 1.3em;
}

.view-label {
  font-weight: 600;
}

@media (width <= 600px) {
  .view-selector {
    gap: 6px;
  }

  .view-button {
    padding: 6px 12px;
    font-size: 0.9em;
  }

  .view-icon {
    font-size: 1.1em;
  }
}
</style>
