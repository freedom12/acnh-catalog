<script setup lang="ts">
import ViewSelector from '../components/ViewSelector.vue';
</script>

<template>
  <div>
    <ViewSelector />

    <!-- 通过路由显示对应视图 -->
    <RouterView />
  </div>
</template>
