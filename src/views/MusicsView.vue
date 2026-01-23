<script setup lang="ts">
import { computed } from 'vue';
import { useMusicData } from '../composables/useMusicData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import MusicCard from '../components/MusicCard.vue';
import FilterSection from '../components/FilterSection.vue';
import { useAudioPlayer } from '../composables/useAudioPlayer';
import { BASE_PATH } from '../config';
import type { Music } from '../types/music';

const { data: allMusic, status, error, loadData } = useMusicData();
const loading = computed(() => status.value === 'loading');
const { filteredData, handleFiltersChanged } = useFilter(allMusic);
const { playTracks } = useAudioPlayer();

const getAudioPath = (name: string, type: 'live' | 'radio') => {
  const folder = type === 'live' ? 'live' : 'radio';
  return `${BASE_PATH}sound/music/${folder}/${name}.mp3`;
};

const playAll = (type: 'live' | 'radio') => {
  const tracks = filteredData.value
    .filter((item: Music) => (type === 'live' ? true : item.hasRadio))
    .map((item: Music) => ({
      title: type === 'radio' ? `${item.name} (Radio)` : item.name,
      url: getAudioPath(item.order + '', type),
    }));

  playTracks(tracks);
};

const hasAnyRadio = computed(() => filteredData.value.some((item: Music) => item.hasRadio));
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :per-page="100"
    :card-component="MusicCard"
    selection-key="musics"
  >
    <template #filters>
      <FilterSection
        :total-count="allMusic.length"
        :current-count="filteredData.length"
        selection-key="musics"
        @filters-changed="handleFiltersChanged"
      >
        <template #action-buttons>
          <button class="action-btn primary" @click="() => playAll('live')">
            <span>播放全部现场</span>
          </button>
          <button
            class="action-btn primary"
            :disabled="!hasAnyRadio"
            @click="() => playAll('radio')"
          >
            <span>播放全部广播</span>
          </button>
        </template>
      </FilterSection>
    </template>
  </DataView>
</template>

<style scoped lang="scss">
@use '../styles/view-styles';
</style>
