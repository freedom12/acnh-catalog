<script setup lang="ts">
import { ref } from 'vue';

const baseUrl = import.meta.env.BASE_URL;
const expandedSections = ref({
  patterns: true,
  polishings: true,
  soundscapes: true,
  patternGroups: Array(11).fill(true), // 11组，每组默认展开
});
const selectedPattern = ref<string | null>(null);
const showPatternModal = ref(false);
const croppedImages = ref<string[]>([]);

const openPatternModal = async (pattern: string) => {
  selectedPattern.value = pattern;
  showPatternModal.value = true;
  await cropPatternImages(pattern);
};

const closePatternModal = () => {
  showPatternModal.value = false;
  selectedPattern.value = null;
  croppedImages.value = [];
};

const cropPatternImages = async (pattern: string) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = `${baseUrl}img/pattern/${pattern}`;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const size = Math.min(img.width, img.height) - 2; // 去除四周1像素
  canvas.width = size;
  canvas.height = size;

  // 从(1,1)开始绘制，去除四周1像素
  ctx.drawImage(img, 1, 1, size, size, 0, 0, size, size);

  const croppedSrc = canvas.toDataURL();
  croppedImages.value = Array(9).fill(croppedSrc);
};
const patterns = [
  'pattern_1_1.png',
  'pattern_1_2.png',
  'pattern_1_3.png',
  'pattern_1_4.png',
  'pattern_1_5.png',
  'pattern_1_6.png',
  'pattern_1_7.png',
  'pattern_1_8.png',
  'pattern_1_9.png',
  'pattern_1_10.png',
  'pattern_1_11.png',
  'pattern_1_12.png',
  'pattern_1_13.png',
  'pattern_1_14.png',
  'pattern_1_15.png',
  'pattern_1_16.png',
  'pattern_1_17.png',
  'pattern_1_18.png',
  'pattern_1_19.png',
  'pattern_1_20.png',
  'pattern_2_1.png',
  'pattern_2_2.png',
  'pattern_2_3.png',
  'pattern_2_4.png',
  'pattern_2_5.png',
  'pattern_2_6.png',
  'pattern_2_7.png',
  'pattern_2_8.png',
  'pattern_2_9.png',
  'pattern_2_10.png',
  'pattern_2_11.png',
  'pattern_2_12.png',
  'pattern_2_13.png',
  'pattern_2_14.png',
  'pattern_2_15.png',
  'pattern_2_16.png',
  'pattern_2_17.png',
  'pattern_2_18.png',
  'pattern_2_20.png',
  'pattern_2_21.png',
  'pattern_3_1.png',
  'pattern_3_2.png',
  'pattern_3_3.png',
  'pattern_3_4.png',
  'pattern_3_5.png',
  'pattern_3_6.png',
  'pattern_3_7.png',
  'pattern_3_8.png',
  'pattern_3_9.png',
  'pattern_3_10.png',
  'pattern_3_11.png',
  'pattern_3_12.png',
  'pattern_3_13.png',
  'pattern_3_14.png',
  'pattern_3_15.png',
  'pattern_3_16.png',
  'pattern_3_17.png',
  'pattern_3_18.png',
  'pattern_3_19.png',
  'pattern_3_20.png',
  'pattern_4_1.png',
  'pattern_4_2.png',
  'pattern_4_3.png',
  'pattern_4_4.png',
  'pattern_4_5.png',
  'pattern_4_6.png',
  'pattern_4_7.png',
  'pattern_4_8.png',
  'pattern_4_9.png',
  'pattern_4_10.png',
  'pattern_4_11.png',
  'pattern_4_12.png',
  'pattern_4_13.png',
  'pattern_4_14.png',
  'pattern_4_15.png',
  'pattern_4_16.png',
  'pattern_4_17.png',
  'pattern_4_18.png',
  'pattern_4_19.png',
  'pattern_4_20.png',
  'pattern_5_1.png',
  'pattern_5_2.png',
  'pattern_5_3.png',
  'pattern_5_4.png',
  'pattern_5_5.png',
  'pattern_5_6.png',
  'pattern_5_7.png',
  'pattern_5_8.png',
  'pattern_5_9.png',
  'pattern_5_10.png',
  'pattern_5_11.png',
  'pattern_5_12.png',
  'pattern_5_13.png',
  'pattern_5_14.png',
  'pattern_5_15.png',
  'pattern_5_16.png',
  'pattern_5_17.png',
  'pattern_5_18.png',
  'pattern_5_19.png',
  'pattern_5_20.png',
  'pattern_6_1.png',
  'pattern_6_2.png',
  'pattern_6_3.png',
  'pattern_6_4.png',
  'pattern_6_5.png',
  'pattern_6_6.png',
  'pattern_6_7.png',
  'pattern_6_8.png',
  'pattern_6_9.png',
  'pattern_6_10.png',
  'pattern_6_11.png',
  'pattern_6_12.png',
  'pattern_6_13.png',
  'pattern_6_14.png',
  'pattern_6_15.png',
  'pattern_6_16.png',
  'pattern_6_17.png',
  'pattern_6_18.png',
  'pattern_6_19.png',
  'pattern_6_20.png',
  'pattern_7_1.png',
  'pattern_7_2.png',
  'pattern_7_3.png',
  'pattern_7_4.png',
  'pattern_7_5.png',
  'pattern_7_6.png',
  'pattern_7_7.png',
  'pattern_7_8.png',
  'pattern_7_9.png',
  'pattern_7_10.png',
  'pattern_7_11.png',
  'pattern_7_12.png',
  'pattern_7_13.png',
  'pattern_7_14.png',
  'pattern_7_15.png',
  'pattern_7_16.png',
  'pattern_7_17.png',
  'pattern_7_18.png',
  'pattern_7_19.png',
  'pattern_7_20.png',
  'pattern_8_1.png',
  'pattern_8_2.png',
  'pattern_8_3.png',
  'pattern_8_4.png',
  'pattern_8_5.png',
  'pattern_8_6.png',
  'pattern_8_7.png',
  'pattern_8_8.png',
  'pattern_8_9.png',
  'pattern_8_10.png',
  'pattern_8_11.png',
  'pattern_8_12.png',
  'pattern_8_13.png',
  'pattern_8_14.png',
  'pattern_8_15.png',
  'pattern_8_16.png',
  'pattern_8_17.png',
  'pattern_8_18.png',
  'pattern_8_19.png',
  'pattern_8_20.png',
  'pattern_9_1.png',
  'pattern_9_2.png',
  'pattern_9_3.png',
  'pattern_9_4.png',
  'pattern_9_5.png',
  'pattern_9_6.png',
  'pattern_9_7.png',
  'pattern_9_8.png',
  'pattern_9_9.png',
  'pattern_9_10.png',
  'pattern_9_11.png',
  'pattern_9_12.png',
  'pattern_9_13.png',
  'pattern_9_14.png',
  'pattern_9_15.png',
  'pattern_9_16.png',
  'pattern_9_17.png',
  'pattern_9_18.png',
  'pattern_9_19.png',
  'pattern_9_20.png',
  'pattern_10_1.png',
  'pattern_10_2.png',
  'pattern_10_3.png',
  'pattern_10_4.png',
  'pattern_10_5.png',
  'pattern_10_6.png',
  'pattern_10_7.png',
  'pattern_10_8.png',
  'pattern_10_9.png',
  'pattern_10_10.png',
  'pattern_10_11.png',
  'pattern_10_12.png',
  'pattern_10_13.png',
  'pattern_10_14.png',
  'pattern_10_15.png',
  'pattern_10_16.png',
  'pattern_10_17.png',
  'pattern_10_18.png',
  'pattern_10_19.png',
  'pattern_10_20.png',
  'pattern_11_1.png',
  'pattern_11_2.png',
  'pattern_11_3.png',
  'pattern_11_4.png',
  'pattern_11_5.png',
  'pattern_11_6.png',
  'pattern_11_7.png',
  'pattern_11_8.png',
  'pattern_11_9.png',
  'pattern_11_10.png',
  'pattern_11_11.png',
  'pattern_11_12.png',
  'pattern_11_13.png',
  'pattern_11_14.png',
  'pattern_11_15.png',
  'pattern_11_16.png',
  'pattern_11_17.png',
  'pattern_11_18.png',
  'pattern_11_19.png',
  'pattern_11_20.png',
];

// 将patterns分成每组20个，并命名组
const groupNames = [
  '波点',
  '条纹',
  '格纹A',
  '格纹B',
  '传统A',
  '传统B',
  '复古',
  '自然',
  '玩具',
  '清新',
  '种类',
];
const patternGroups = groupNames.map((name, index) => ({
  name,
  patterns: patterns.slice(index * 20, (index + 1) * 20),
}));

const polishings = [
  { name: '闪亮', file: 'polishing_1.png' },
  { name: '爱心', file: 'polishing_2.png' },
  { name: '漩涡', file: 'polishing_3.png' },
  { name: '神圣', file: 'polishing_4.png' },
  { name: '水滴', file: 'polishing_5.png' },
  { name: '温馨', file: 'polishing_6.png' },
  { name: '阴沉', file: 'polishing_7.png' },
  { name: '蒸汽', file: 'polishing_8.png' },
  { name: '寒气', file: 'polishing_9.png' },
  { name: '电流', file: 'polishing_10.png' },
  { name: '气味', file: 'polishing_11.png' },
  { name: '震动', file: 'polishing_12.png' },
  { name: '翩翩飞舞', file: 'polishing_13.png' },
  { name: '信息框', file: 'polishing_14.png' },
];

const soundscapes = [
  { name: '无', file: 'soundscape_0.png' },
  { name: '回声', file: 'soundscape_1.png' },
  { name: '海', file: 'soundscape_2.png' },
  { name: '水中', file: 'soundscape_3.png' },
  { name: '高原', file: 'soundscape_4.png' },
  { name: '森林', file: 'soundscape_5.png' },
  { name: '丛林', file: 'soundscape_6.png' },
  { name: '洞穴', file: 'soundscape_7.png' },
  { name: '风', file: 'soundscape_8.png' },
  { name: '雨', file: 'soundscape_9.png' },
  { name: '暴风雨', file: 'soundscape_10.png' },
  { name: '地面震动', file: 'soundscape_11.png' },
  { name: '广场', file: 'soundscape_12.png' },
  { name: '都会', file: 'soundscape_13.png' },
  { name: '嘈杂', file: 'soundscape_14.png' },
  { name: '欢呼', file: 'soundscape_15.png' },
  { name: '火车', file: 'soundscape_16.png' },
  { name: '施工', file: 'soundscape_17.png' },
  { name: '工厂', file: 'soundscape_18.png' },
  { name: '小巷', file: 'soundscape_19.png' },
  { name: '太空', file: 'soundscape_20.png' },
  { name: '网络', file: 'soundscape_21.png' },
  { name: '治愈', file: 'soundscape_22.png' },
  { name: '嘎嘎作响', file: 'soundscape_23.png' },
];
</script>

<template>
  <div class="misc-view">
    <section class="section">
      <h2
        @click="expandedSections.polishings = !expandedSections.polishings"
        class="section-header"
      >
        <span class="toggle-icon">{{ expandedSections.polishings ? '▼' : '▶' }}</span>
        抛光效果
      </h2>
      <transition name="slide">
        <div v-show="expandedSections.polishings" class="misc-grid">
          <div v-for="polishing in polishings" :key="polishing.file" class="misc-item">
            <img
              :src="`${baseUrl}img/polishing/${polishing.file}`"
              :alt="polishing.name"
            />
            <p class="item-name">{{ polishing.name }}</p>
          </div>
        </div>
      </transition>
    </section>

    <section class="section">
      <h2
        @click="expandedSections.soundscapes = !expandedSections.soundscapes"
        class="section-header"
      >
        <span class="toggle-icon">{{ expandedSections.soundscapes ? '▼' : '▶' }}</span>
        环境音
      </h2>
      <transition name="slide">
        <div v-show="expandedSections.soundscapes" class="misc-grid">
          <div v-for="soundscape in soundscapes" :key="soundscape.file" class="misc-item">
            <img
              :src="`${baseUrl}img/soundscape/${soundscape.file}`"
              :alt="soundscape.name"
            />
            <p class="item-name">{{ soundscape.name }}</p>
          </div>
        </div>
      </transition>
    </section>

    <section class="section">
      <h2
        @click="expandedSections.patterns = !expandedSections.patterns"
        class="section-header"
      >
        <span class="toggle-icon">{{ expandedSections.patterns ? '▼' : '▶' }}</span>
        图案样式
      </h2>
      <transition name="slide">
        <div v-show="expandedSections.patterns">
          <div
            v-for="(group, groupIndex) in patternGroups"
            :key="groupIndex"
            class="pattern-group"
          >
            <h3
              @click="
                expandedSections.patternGroups[groupIndex] =
                  !expandedSections.patternGroups[groupIndex]
              "
              class="group-header"
            >
              <span class="toggle-icon">{{
                expandedSections.patternGroups[groupIndex] ? '▼' : '▶'
              }}</span>
              {{ group.name }}
            </h3>
            <transition name="slide">
              <div v-show="expandedSections.patternGroups[groupIndex]" class="misc-grid">
                <div
                  v-for="pattern in group.patterns"
                  :key="pattern"
                  class="misc-item"
                  @click="openPatternModal(pattern)"
                >
                  <img :src="`${baseUrl}img/pattern/${pattern}`" :alt="pattern" />
                  <!-- <p>{{ pattern }}</p> -->
                </div>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </section>

    <!-- 图案预览模态框 -->
    <div v-if="showPatternModal" class="modal-overlay" @click="closePatternModal">
      <div class="modal-content" @click.stop>
        <div class="pattern-preview-grid">
          <div
            v-for="(croppedSrc, index) in croppedImages"
            :key="index"
            class="preview-item"
          >
            <img :src="croppedSrc" :alt="`Cropped pattern ${index + 1}`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.misc-view {
  padding: 20px;
}

.section {
  margin-bottom: 40px;
}

.section h2 {
  margin-bottom: 20px;
  font-size: 1.5em;
  color: var(--primary-color);
}

.section-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1.5em;
  color: var(--primary-color);
}

.toggle-icon {
  margin-right: 10px;
  font-size: 1.2em;
  transition: transform 0.2s;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.misc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.misc-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border: 3px solid #ddd;
  border-radius: var(--border-radius-xl);
  padding: 10px;
  background: white;
  box-sizing: border-box;
}

.misc-item img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  flex-shrink: 0;
}

.item-name {
  /* margin-top: 8px; */
  font-size: 0.9em;
  text-align: center;
  color: var(--text-color);
  font-weight: 500;
  background: #ddd;
  padding: 4px 20px;
  border-radius: var(--border-radius-xl);
}

.group-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 15px 0 10px 0;
  font-size: 1.2em;
  color: var(--secondary-color);
  font-weight: 600;
}

.pattern-group {
  margin-bottom: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: var(--border-radius-xl);
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.pattern-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.preview-item {
  aspect-ratio: 1;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
