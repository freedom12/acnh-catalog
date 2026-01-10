import { ref, readonly } from 'vue';

export interface AudioTrack {
  title: string;
  url: string;
}

// 全局状态（单例）
const audioElement = new Audio();
const currentTrack = ref<AudioTrack | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.7);
const isVisible = ref(false);
const playlist = ref<AudioTrack[]>([]);
const currentIndex = ref(-1);

// 设置初始音量
audioElement.volume = volume.value;

const startTrack = (track: AudioTrack) => {
  currentTrack.value = track;
  audioElement.src = track.url;
  audioElement.load();
  audioElement.play();
  isVisible.value = true;
};

const playNextInQueue = () => {
  const nextIndex = currentIndex.value + 1;
  const hasNext = playlist.value.length > 0 && nextIndex < playlist.value.length;
  if (!hasNext) return false;
  const nextTrack = playlist.value[nextIndex];
  if (!nextTrack) return false;
  currentIndex.value = nextIndex;
  startTrack(nextTrack);
  return true;
};

// 音频事件监听
audioElement.addEventListener('timeupdate', () => {
  currentTime.value = audioElement.currentTime;
});

audioElement.addEventListener('durationchange', () => {
  duration.value = audioElement.duration;
});

audioElement.addEventListener('ended', () => {
  const advanced = playNextInQueue();
  if (!advanced) {
    isPlaying.value = false;
    currentTime.value = 0;
  }
});

audioElement.addEventListener('play', () => {
  isPlaying.value = true;
});

audioElement.addEventListener('pause', () => {
  isPlaying.value = false;
});

export function useAudioPlayer() {
  const playTrack = (track: AudioTrack) => {
    // 如果是同一首歌，直接播放/暂停
    if (currentTrack.value?.url === track.url) {
      if (isPlaying.value) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      return;
    }

    // 切换新歌曲并重置播放队列
    playlist.value = [track];
    currentIndex.value = 0;
    startTrack(track);
  };

  const playTracks = (tracks: AudioTrack[], startAt = 0) => {
    if (!tracks || tracks.length === 0) return;
    const startIndex = Math.min(Math.max(startAt, 0), tracks.length - 1);
    playlist.value = [...tracks];
    currentIndex.value = startIndex;
    const startTrackItem = playlist.value[startIndex];
    if (!startTrackItem) return;
    startTrack(startTrackItem);
  };

  const play = () => {
    if (currentTrack.value) {
      audioElement.play();
    }
  };

  const pause = () => {
    audioElement.pause();
  };

  const seek = (time: number) => {
    audioElement.currentTime = time;
  };

  const setVolume = (vol: number) => {
    volume.value = vol;
    audioElement.volume = vol;
  };

  const close = () => {
    pause();
    isVisible.value = false;
  };

  const stop = () => {
    pause();
    audioElement.currentTime = 0;
    currentTrack.value = null;
    isVisible.value = false;
    playlist.value = [];
    currentIndex.value = -1;
  };

  return {
    // 只读状态
    currentTrack: readonly(currentTrack),
    isPlaying: readonly(isPlaying),
    currentTime: readonly(currentTime),
    duration: readonly(duration),
    volume: readonly(volume),
    isVisible: readonly(isVisible),
    // 方法
    playTrack,
    playTracks,
    play,
    pause,
    seek,
    setVolume,
    close,
    stop,
  };
}
