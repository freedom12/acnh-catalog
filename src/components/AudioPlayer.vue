<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '../composables/useAudioPlayer';

const {
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isVisible,
  play,
  pause,
  seek,
  setVolume,
  close,
} = useAudioPlayer();

const formatTime = (time: number) => {
  if (!isFinite(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const progress = computed(() => {
  if (!duration.value || !isFinite(duration.value)) return 0;
  return (currentTime.value / duration.value) * 100;
});

const volumeIcon = computed(() => {
  if (volume.value === 0) return '🔇';
  if (volume.value < 0.5) return '🔉';
  return '🔊';
});

const handleProgressClick = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  seek(percent * duration.value);
};
</script>

<template>
  <transition name="player-slide">
    <div v-if="isVisible && currentTrack" class="audio-player">
      <div class="player-content">
        <div class="track-info">
          <div class="track-title">{{ currentTrack.title }}</div>
        </div>

        <div class="player-controls">
          <button @click="isPlaying ? pause() : play()" class="control-btn play-btn">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>

          <div class="progress-container">
            <span class="time">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar" @click="handleProgressClick">
              <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
            </div>
            <span class="time">{{ formatTime(duration) }}</span>
          </div>

          <div class="volume-control">
            <button class="control-btn volume-btn">{{ volumeIcon }}</button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="volume"
              @input="(e) => setVolume(parseFloat((e.target as HTMLInputElement).value))"
              class="volume-slider"
            />
          </div>

          <button @click="close" class="control-btn close-btn">✕</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 16px 24px;
}

.player-content {
  max-width: 1200px;
  margin: 0 auto;
}

.track-info {
  margin-bottom: 12px;
}

.track-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.play-btn {
  width: 48px;
  height: 48px;
  font-size: 20px;
}

.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.time {
  color: white;
  font-size: 12px;
  min-width: 40px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.1s ease;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-btn {
  font-size: 16px;
}

.volume-slider {
  width: 80px;
  height: 4px;
  appearance: none;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.close-btn {
  font-size: 20px;
}

.player-slide-enter-active,
.player-slide-leave-active {
  transition: transform 0.3s ease;
}

.player-slide-enter-from,
.player-slide-leave-to {
  transform: translateY(100%);
}

@media (max-width: 768px) {
  .audio-player {
    padding: 12px 16px;
  }

  .track-title {
    font-size: 14px;
  }

  .volume-control {
    display: none;
  }

  .time {
    font-size: 11px;
    min-width: 35px;
  }
}
</style>
