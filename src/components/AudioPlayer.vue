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

const toggleMute = () => {
  setVolume(volume.value > 0 ? 0 : 0.5);
};

const handleProgressClick = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  seek(percent * duration.value);
};
</script>

<template>
  <transition name="player-fade">
    <div
      v-if="isVisible && currentTrack"
      class="audio-player"
      role="complementary"
      aria-label="音频播放器"
    >
      <div class="player-surface">
        <button
          class="primary-btn"
          :aria-label="isPlaying ? '暂停' : '播放'"
          @click="isPlaying ? pause() : play()"
        >
          {{ isPlaying ? '⏸' : '▶' }}
        </button>

        <div class="info-block">
          <div class="track-title" :title="currentTrack.title">{{ currentTrack.title }}</div>
          <div class="progress-combo">
            <span class="time">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar" @click="handleProgressClick">
              <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
            </div>
            <span class="time">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <div class="controls-block">
          <div class="volume-row">
            <button
              class="volume-icon"
              type="button"
              aria-label="静音切换"
              @click="toggleMute"
            >
              {{ volumeIcon }}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="volume"
              @input="(e) => setVolume(parseFloat((e.target as HTMLInputElement).value))"
              class="volume-slider"
              aria-label="调整音量"
            />
          </div>
          <button class="icon-btn close-btn" @click="close" aria-label="关闭音频播放器">■</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.audio-player {
  position: fixed;
  right: var(--spacing-xl);
  bottom: calc(var(--spacing-xl) + 50px + var(--spacing-sm));
  width: min(460px, 92vw);
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 1001;
}

.player-surface {
  position: relative;
  width: 56px;
  height: 56px;
  padding: 0;
  display: grid;
  grid-template-columns: auto;
  place-items: center center;
  gap: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border-radius: 50%;
  border: 1px solid rgb(255, 255, 255, 0.14);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  transition: width 0.25s ease, height 0.25s ease, border-radius 0.25s ease,
    padding 0.25s ease, gap 0.25s ease;
}

.audio-player:hover .player-surface,
.audio-player:focus-within .player-surface {
  width: 100%;
  height: 78px;
  padding: 12px 72px 12px 16px;
  border-radius: 999px;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
}

.primary-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgb(255, 255, 255, 0.15);
  color: white;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  padding-bottom: 2px; /* 视觉微调，让符号看起来居中 */
}

.primary-btn:hover {
  background: rgb(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.audio-player:hover .primary-btn,
.audio-player:focus-within .primary-btn {
  position: absolute;
  left: auto;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.info-block,
.controls-block {
  opacity: 0;
  max-width: 0;
  pointer-events: none;
  transition: opacity 0.2s ease 0.05s, max-width 0.25s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-block {
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.controls-block {
  gap: 10px;
}

.audio-player:hover .info-block,
.audio-player:focus-within .info-block,
.audio-player:hover .controls-block,
.audio-player:focus-within .controls-block {
  opacity: 1;
  max-width: 999px;
  pointer-events: auto;
}

.track-title {
  font-size: 14px;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.icon-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgb(255, 255, 255, 0.12);
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.close-btn {
  width: 48px;
  height: 48px;
  font-size: 18px;
  background: rgb(255, 255, 255, 0.18);
}

.close-btn:hover {
  background: rgb(255, 255, 255, 0.26);
}

.icon-btn:hover {
  background: rgb(255, 255, 255, 0.2);
}

.progress-combo {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 240px;
  flex: 1;
}

.time {
  font-size: 12px;
  min-width: 42px;
  text-align: center;
  color: rgb(255, 255, 255, 0.85);
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgb(255, 255, 255, 0.2);
  border-radius: 999px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 999px;
  transition: width 0.1s ease;
}

.volume-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-icon {
  font-size: 16px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.volume-icon:hover {
  background: rgb(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.volume-slider {
  width: 40px;
  height: 3px;
  appearance: none;
  -webkit-appearance: none;
  background: rgb(255, 255, 255, 0.25);
  border-radius: 999px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgb(0, 0, 0, 0.2);
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgb(0, 0, 0, 0.2);
}

.player-fade-enter-active,
.player-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.player-fade-enter-from,
.player-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (width <= 768px) {
  .audio-player {
    right: var(--spacing-lg);
    bottom: calc(var(--spacing-lg) + 58px);
    width: min(360px, 94vw);
    height: 78px;
    justify-content: flex-end;
  }

  .player-surface {
    height: 70px;
  }

  .audio-player:hover .player-surface,
  .audio-player:focus-within .player-surface {
    height: 74px;
    padding: 12px 68px 12px 14px;
  }

  .audio-player:hover .primary-btn,
  .audio-player:focus-within .primary-btn {
    left: auto;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .track-title {
    max-width: 120px;
  }

  .time {
    min-width: 38px;
  }
}
</style>
