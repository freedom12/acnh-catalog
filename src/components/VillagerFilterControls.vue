<script setup lang="ts">
import { computed } from "vue";
import type { Villager } from "../types/villager";
import { getGenderName, getHobbyName, getPersonalityName, getSpeciesName } from "../services/dataService";

const props = defineProps<{
  filters: Record<string, string>;
  allVillagers: Villager[];
}>();

const emit = defineEmits<{
  (e: "update:filters", value: Record<string, string>): void;
  (e: "filter-change"): void;
}>();

// 动态选项
const speciesOptions = computed(() => {
  const set = new Set<string>();
  props.allVillagers.forEach((v) => v.species && set.add(v.species));
  return Array.from(set);
});
const genderOptions = computed(() => {
  const set = new Set<string>();
  props.allVillagers.forEach((v) => v.gender && set.add(v.gender));
  return Array.from(set);
});
const personalityOptions = computed(() => {
  const set = new Set<string>();
  props.allVillagers.forEach((v) => v.personality && set.add(v.personality));
  return Array.from(set);
});
const hobbyOptions = computed(() => {
  const set = new Set<string>();
  props.allVillagers.forEach((v) => v.hobby && set.add(v.hobby));
  return Array.from(set);
});

const localFilters = computed({
  get: () => props.filters,
  set: (value) => {
    emit("update:filters", value);
    emit("filter-change");
  },
});
</script>

<template>
  <div class="villager-filter-controls">
    <label>种族：</label>
    <select v-model="localFilters.species">
      <option value="">全部</option>
      <option v-for="sp in speciesOptions" :key="sp" :value="sp">
        {{ getSpeciesName(sp) }}
      </option>
    </select>
    <label>性别：</label>
    <select v-model="localFilters.gender">
      <option value="">全部</option>
      <option v-for="g in genderOptions" :key="g" :value="g">
        {{ getGenderName(g) }}
      </option>
    </select>
    <label>性格：</label>
    <select v-model="localFilters.personality">
      <option value="">全部</option>
      <option v-for="p in personalityOptions" :key="p" :value="p">
        {{ getPersonalityName(p) }}
      </option>
    </select>
    <label>爱好：</label>
    <select v-model="localFilters.hobby">
      <option value="">全部</option>
      <option v-for="h in hobbyOptions" :key="h" :value="h">
        {{ getHobbyName(h) }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.villager-filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.villager-filter-controls label {
  font-weight: 600;
  margin-right: 4px;
}
.villager-filter-controls select {
  min-width: 100px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>
