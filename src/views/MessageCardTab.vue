<script setup lang="ts">
import { onMounted } from "vue";
import { useMessageCardsData } from "../composables/useMessageCardsData";
import { DATA_LOADING } from "../constants";
import MessageCard from "../components/MessageCard.vue";
import Grid from "../components/Grid.vue";

// 使用数据加载组合函数
const { allMessageCards, loading, error, loadData } = useMessageCardsData();

// 组件挂载时加载数据
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
      <div class="stats">
        <span class="stat-item">
          共 {{ allMessageCards.length }} 张消息卡片
        </span>
      </div>
      <Grid :datas="allMessageCards" :card-component="MessageCard" />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
