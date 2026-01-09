<script setup lang="ts">
import type { Music } from '../types/music';
import BaseCard from './BaseCard.vue';
import { useAudioPlayer } from '../composables/useAudioPlayer';
import { BASE_PATH } from '../config';
import { computed } from 'vue';

interface Props {
  data: Music;
}

const props = defineProps<Props>();
const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, '_blank');
};

const getAudioPath = (type: 'live' | 'radio') => {
  const folder = type === 'live' ? 'live' : 'radio';
  return `${BASE_PATH}sound/music/${folder}/${props.data.rawName}.mp3`;
};

const isCurrentlyPlaying = (type: 'live' | 'radio') => {
  return computed(() => {
    const audioPath = getAudioPath(type);
    return currentTrack.value?.url === audioPath && isPlaying.value;
  });
};

const handlePlayClick = (e: Event, type: 'live' | 'radio') => {
  e.stopPropagation();
  const audioPath = getAudioPath(type);
  const title = type === 'radio' ? `${props.data.name} (Radio)` : props.data.name;
  playTrack({ url: audioPath, title });
};

const isLivePlaying = isCurrentlyPlaying('live');
const isRadioPlaying = isCurrentlyPlaying('radio');
</script>

<template>
  <BaseCard
    colorClass="card--blue"
    :variant="'dark'"
    :version="props.data.ver"
    :images="[props.data.image]"
    :displayName="props.data.name"
    :shape="'square'"
    @click="handleClick"
  >
    <div class="music-actions">
      <button @click="(e) => handlePlayClick(e, 'live')" class="play-button">
        <span class="play-icon">{{ isLivePlaying ? '⏸' : '▶' }}</span> 现场
      </button>
      <button
        v-if="props.data.hasRadio"
        @click="(e) => handlePlayClick(e, 'radio')"
        class="play-button play-button--radio"
      >
        <span class="play-icon">{{ isRadioPlaying ? '⏸' : '▶' }}</span> 广播
      </button>
    </div>
  </BaseCard>
</template>

<style scoped>
.detail-row {
  display: flex;
  gap: 8px;
  padding: 4px 0;
  font-size: 14px;
}

.label {
  color: #666;
  flex-shrink: 0;
}

.value {
  color: #333;
  word-break: break-word;
}

.music-actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.play-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.play-button--radio {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 2px 8px rgba(240, 147, 251, 0.3);
}

.play-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.play-button--radio:hover {
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4);
}

.play-button:active {
  transform: translateY(0);
}

.play-icon {
  font-size: 12px;
}
</style>
