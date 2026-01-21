<script setup lang="ts">
import { computed } from 'vue';
import { useVillagersData } from '../composables/useVillagersData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import VillagerCard from '../components/VillagerCard.vue';
import FilterSection from '../components/FilterSection.vue';
import { Gender, Hobby, Personality, Species } from '../types/villager';
import { Version } from '../types/item';
import {
  getGenderName,
  getHobbyName,
  getPersonalityName,
  getSpeciesName,
  getVersionName,
} from '../services/dataService';
import { useItemsData } from '../composables';

const { loadData: loadItems } = useItemsData();
const { allVillagers, loading, error, loadData:loadVillagers } = useVillagersData();
const filters = computed(() => [
  {
    label: '种族',
    value: 'species',
    options: Object.values(Species).map((species) => ({
      value: species,
      label: getSpeciesName(species),
    })),
  },
  {
    label: '性别',
    value: 'gender',
    options: Object.values(Gender).map((gender) => ({
      value: gender,
      label: getGenderName(gender),
    })),
  },
  {
    label: '性格',
    value: 'personality',
    options: Object.values(Personality).map((personality) => ({
      value: personality,
      label: getPersonalityName(personality),
    })),
  },
  {
    label: '爱好',
    value: 'hobby',
    options: Object.values(Hobby).map((hobby) => ({
      value: hobby,
      label: getHobbyName(hobby),
    })),
  },
  {
    label: '版本',
    value: 'ver',
    options: Object.values(Version).reverse().map((version) => ({
      value: version,
      label: getVersionName(version),
    })),
  },
]);
const { filteredData, handleFiltersChanged } = useFilter(allVillagers);

function onLoad() {
  loadVillagers();
  loadItems();
}
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="onLoad"
    :datas="filteredData"
    :per-page="100"
    :card-component="VillagerCard"
  >
    <template #filters>
      <FilterSection
        :filters="filters"
        :total-count="allVillagers.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
