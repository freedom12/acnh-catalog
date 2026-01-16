<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAchievementsData } from '../composables/useAchievementsData';
import { getImgUrl, getPriceWithIcon } from '../services/dataService';
import { Currency } from '../types';

const props = defineProps<{
  achievementId: number | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { achievementIdMap, loading, error, loadData } = useAchievementsData();

const achievement = computed(() =>{
  return props.achievementId !== null ? achievementIdMap.value[props.achievementId] : null;
});

const getIconSrc = (index: number) => {
  if (!achievement.value) return '';
  const typeLower = achievement.value.type.toLowerCase();
  if (achievement.value.isSeq) {
    return getImgUrl(`/img/icon/achievement/${typeLower}.png`);
  } else {
    return getImgUrl(`/img/icon/achievement/${typeLower}${index + 1}.png`);
  }
};

onMounted(() => {
  loadData();
});

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('close');
  }
};

const closeModal = () => {
  emit('close');
};

const openNookipedia = () => {
  window.open('https://nookipedia.com/wiki/Nook_Miles', '_blank');
};
</script>

<template>
  <Transition name="modal">
    <div v-if="achievementId !== null" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container">
        <button class="modal-close" @click="closeModal" title="关闭">✕</button>
        <div class="detail-container">
          <div v-if="loading" class="loading">正在加载成就数据...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else-if="!achievement" class="error">未找到该成就</div>
          <template v-else>
            <div class="detail-content">
              <div class="info-section">
                <div class="title-section">
                  <h2>{{ achievement.name }}</h2>
                </div>

                <div class="info-grid">
                  <div class="info-item full-width">
                    <label>描述:</label>
                    <span class="info-content">{{ achievement.desc }}</span>
                  </div>

                  <div class="info-item full-width">
                    <label>达成条件:</label>
                    <span class="info-content">{{ achievement.criteria }}</span>
                  </div>

                  <div class="info-item full-width">
                    <label>等级:</label>
                    <div class="tiers">
                      <div
                        v-for="(tier, index) in achievement.tiers"
                        :key="index"
                        class="tier"
                      >
                        <img
                          :src="getIconSrc(index)"
                          :alt="`等级 ${tier.num}`"
                          class="tier-icon"
                          @click="openNookipedia"
                        />
                        <div class="tier-info">
                          <div class="tier-info-row">
                            <span class="tier-info-label"> 目标：{{ tier.num }}</span>
                            <span class="tier-info-label">
                              奖励：<span v-html="getPriceWithIcon([tier.reward, Currency.NookMiles])"></span>
                            </span>
                          </div>
                          <div class="tier-info-row">
                            <span class="tier-info-label">称号：</span>
                            <span class="tier-title left">{{ tier.modifier }}</span>
                            <span v-for="noun in tier.nouns" :key="noun" class="tier-title right">
                              {{ noun }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: #e0f7fa;
  border-radius: 30px;
  border: 10px solid white;
  max-width: 800px;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 10px 30px rgb(0, 0, 0, 0.3);
  position: relative;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  color: #666;
}

.detail-container {
  padding: 20px;
  max-height: 90vh;
  overflow-y: auto;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section {
  width: 100%;
}

.title-section {
  margin-bottom: 20px;
}

.title-section h2 {
  margin: 0 0 10px;
  font-size: 24px;
  text-align: center;
}

.version-badge {
  display: inline-block;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.info-item span {
  font-size: 16px;
}

.info-content {
  background: #f9f9f9;
  border-radius: 26px;
  padding: 10px;
  display: block;
}

.tiers {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tier {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 26px;
}

.tier-icon {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.tier-icon:hover {
  transform: scale(1.2);
}

.tier-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.tier-info-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.tier-info-label {
  font-size: 16px;
}

.tier-title {
  color: #666;
  background: #d0d0d0;
  padding: 4px 8px;
  border-radius: 24px;
}

.tier-title.left {
  padding-left: 16px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.tier-title.right {
  padding-right: 16px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #dc3545;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>
