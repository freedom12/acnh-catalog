<template>
  <div class="hhp-view">
    <h1 class="title">快乐家乐园</h1>
    <div class="island-grid">
      <div v-for="row in 7" :key="row" class="island-row">
        <img
          v-for="col in 7"
          :key="col"
          :src="getImgUrl(`/img/hhp_island_icon/hhp_island_${row}_${col}_icon.png`)"
          :alt="`${row}-${col}`"
          class="island-icon"
          :class="{ transparent: row === 4 && col === 4 }"
          @click="openModal(row, col)"
          :style="{ cursor: row === 4 && col === 4 ? 'default' : 'pointer' }"
        />
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <button class="nav-button" @click="navigateIsland(-1)">&larr;</button>
          <h2>{{ selectedIsland?.row }} - {{ selectedIsland?.col }}</h2>
          <button class="nav-button" @click="navigateIsland(1)">&rarr;</button>
        </div>
        <div class="image-grid">
          <div v-for="i in 4" :key="i" class="image-item">
            <img
              :src="
                getImgUrl(
                  `/img/hhp_island_img/hhp_island_${selectedIsland?.row}_${selectedIsland?.col}_${i}_img.jpg`
                )
              "
              :alt="`${selectedIsland?.row}-${selectedIsland?.col} view ${i}`"
              class="modal-image"
            />
            <img
              :src="getImgUrl(`/img/icon/season_${i}.png`)"
              :alt="['春', '夏', '秋', '冬'][i - 1]"
              class="season-icon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getImgUrl } from '../services/dataService';

const showModal = ref(false);
const selectedIsland = ref<{ row: number; col: number } | null>(null);

const openModal = (row: number, col: number) => {
  if (row === 4 && col === 4) return; // Skip 4-4 position
  selectedIsland.value = { row, col };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedIsland.value = null;
};

const navigateIsland = (direction: number) => {
  if (!selectedIsland.value) return;

  const { row, col } = selectedIsland.value;
  const totalPositions = 49; // 7x7 grid
  const skipIndex = 24; // 4-4 position (0-based: (4-1)*7 + (4-1) = 21 + 3 = 24)

  // Convert current position to linear index
  let currentIndex = (row - 1) * 7 + (col - 1);

  // Find next valid index
  let nextIndex = currentIndex;
  do {
    nextIndex = (nextIndex + direction + totalPositions) % totalPositions;
  } while (nextIndex === skipIndex);

  // Convert back to row/col
  const nextRow = Math.floor(nextIndex / 7) + 1;
  const nextCol = (nextIndex % 7) + 1;

  selectedIsland.value = { row: nextRow, col: nextCol };
};
</script>

<style scoped>
.hhp-view {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .title {
    margin-bottom: 40px;
  }
}

.island-grid {
  display: flex;
  flex-direction: column;
  gap: 0; /* Tight packing */
  align-items: center;
}

.island-row {
  display: flex;
  gap: 0; /* Tight packing */
  margin-top: -33px;
  margin-bottom: -33px; /* Overlap rows by 20px */
}

.island-icon {
  width: 252px; /* Assuming icons are 64x64, adjust if needed */
  height: 232px;
  object-fit: cover;
  margin-left: -35px;
  margin-right: -35px; /* Overlap icons horizontally by 20px */
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.island-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  filter: brightness(1.1);
  z-index: 10;
}

.island-icon.transparent {
  opacity: 0;
  cursor: default;
}

.island-icon.transparent:hover {
  transform: none;
  box-shadow: none;
  filter: none;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 26px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-button {
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background: #e0e0e0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.season-icon {
  margin-top: 8px;
  width: 32px;
  height: 32px;
  object-fit: contain;
}
</style>
