<script setup lang="ts">
import VersionBadge from './VersionBadge.vue';

interface Props {
  colorClass: string;
  version?: string | null;
  image: string;
  displayName: string;
}

defineProps<Props>();
</script>

<template>
  <div class="card" :class="colorClass">
    <VersionBadge :version="version" />
    <div class="card-image-wrapper">
      <img :src="image" :alt="displayName" class="card-image" />
    </div>
    <div class="card-info">
      <slot name="name">
        <h3 class="card-name">{{ displayName }}</h3>
      </slot>
      <div class="card-details">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style>
@import '../styles/Card.css';
</style>