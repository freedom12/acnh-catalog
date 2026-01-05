<script setup lang="ts">
import { onMounted } from "vue";
import { useMessageCardsData } from "../composables/useMessageCardsData";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import MessageCard from "../components/MessageCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Grid from "../components/Grid.vue";

const { allMessageCards, loading, error, loadData } = useMessageCardsData();
const { filteredData, handleFiltersChanged } = useFilter(allMessageCards);
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">
      {{ DATA_LOADING.MESSAGE_CARDS || "正在加载消息卡片数据..." }}
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <template v-else>
      <FilterSection @filters-changed="handleFiltersChanged">
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length
            }}{{ UI_TEXT.STATS.MESSAGE_CARDS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="filteredData" :card-component="MessageCard" />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
