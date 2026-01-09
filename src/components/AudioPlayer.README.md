# AudioPlayer 音频播放器组件

全局音频播放器组件，用于播放环境音和其他音频文件。

## 特性

- ✅ 全局唯一单例
- ✅ 播放/暂停控制
- ✅ 进度条显示和拖动
- ✅ 音量控制
- ✅ 时间显示
- ✅ 优雅的动画效果
- ✅ 响应式设计

## 使用方法

### 1. 在 App.vue 中添加全局组件

```vue
<template>
  <div>
    <!-- 其他组件 -->
    <AudioPlayer />
  </div>
</template>

<script setup>
import AudioPlayer from './components/AudioPlayer.vue';
</script>
```

### 2. 在任何组件中使用播放器

```vue
<script setup>
import { useAudioPlayer } from '@/composables/useAudioPlayer';

const { playTrack } = useAudioPlayer();

const handleClick = () => {
  playTrack({
    title: '环境音: 海',
    url: '/sound/soundscape/1.flac'
  });
};
</script>

<template>
  <button @click="handleClick">播放音频</button>
</template>
```

## API

### useAudioPlayer()

返回值：

- `currentTrack` - 当前播放的音轨 (readonly)
- `isPlaying` - 是否正在播放 (readonly)
- `currentTime` - 当前播放时间 (readonly)
- `duration` - 音频总时长 (readonly)
- `volume` - 当前音量 (readonly)
- `isVisible` - 播放器是否可见 (readonly)
- `playTrack(track)` - 播放新音轨
- `play()` - 播放当前音轨
- `pause()` - 暂停播放
- `seek(time)` - 跳转到指定时间
- `setVolume(vol)` - 设置音量 (0-1)
- `close()` - 关闭播放器
- `stop()` - 停止播放并关闭

### AudioTrack 接口

```typescript
interface AudioTrack {
  title: string;  // 显示标题
  url: string;    // 音频文件URL
}
```

## 示例

### MiscView.vue 中的使用

```vue
<script setup>
import { useAudioPlayer } from '../composables/useAudioPlayer';

const { playTrack } = useAudioPlayer();

const playSoundscape = (soundscape) => {
  if (!soundscape.audio) return;
  playTrack({
    title: `环境音: ${soundscape.name}`,
    url: `${baseUrl}sound/soundscape/${soundscape.audio}`,
  });
};
</script>

<template>
  <div @click="playSoundscape(soundscape)">
    {{ soundscape.name }}
  </div>
</template>
```

## 样式自定义

播放器默认固定在底部，使用渐变背景。可以通过修改 `AudioPlayer.vue` 中的样式来自定义外观。

## 注意事项

- 播放器是全局单例，同一时间只能播放一个音频
- 点击同一音频会切换播放/暂停状态
- 关闭播放器会暂停播放但保留当前状态
- 停止播放会清除当前音轨并关闭播放器
