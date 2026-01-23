<script setup lang="ts">
export interface InlineIconProps {
  /** 图标 URL */
  src: string;
  /** alt 文本，默认为空 */
  alt?: string;
  /** title 提示文本 */
  title?: string;
  /** 是否使用灰色滤镜 */
  gray?: boolean;
  /** 图标尺寸：small, default, large */
  size?: 'small' | 'default' | 'large';
}

defineProps<InlineIconProps>();
</script>

<template>
  <img
    :src="src"
    :alt="alt || ''"
    :title="title"
    class="inline-icon"
    :class="{
      gray: gray,
      small: size === 'small',
      large: size === 'large',
    }"
    loading="lazy"
  />
</template>
