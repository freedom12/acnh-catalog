<script setup lang="ts">
import { computed, useSlots } from 'vue';

export interface DetailRowProps {
  /**
   * 行标签，支持多种类型：
   * - string: 直接显示文本
   * - 以 '<' 开头的字符串: 作为 HTML 渲染
   */
  label?: string;
  /**
   * 行值，支持多种类型：
   * - string/number: 直接显示文本
   * - 以 '<' 开头的字符串: 作为 HTML 渲染
   */
  value?: string | number;
  /**
   * 布局模式
   * - 'default': 默认布局（标签和值并排）
   * - 'full': 全宽显示（值独占一行）
   * - 'center': 居中显示
   */
  layout?: 'default' | 'full' | 'center';
  /**
   * 样式变体，支持任意组合（空格分隔）：
   * - 'bg-highlight': 背景高亮（边框）
   * - 'label-highlight': 标签高亮
   * - 'value-highlight': 值高亮
   */
  variant?: string;
}

const props = withDefaults(defineProps<DetailRowProps>(), {
  layout: 'default',
  variant: '',
});

const slots = useSlots();

// 检测是否包含 HTML 内容
const isHtml = (val: unknown): boolean => typeof val === 'string' && val.includes('<');

// 是否有插槽内容
const hasSlot = computed(() => !!slots.default);

// 解析 variant 字符串
const variants = computed(() => props.variant.split(/\s+/).filter(Boolean));

// 计算行的 CSS 类
const rowClasses = computed(() => ({
  'detail-row': true,
  'detail-row--full': props.layout === 'full',
  'detail-row--center': props.layout === 'center',
  'detail-row--bg-highlight': variants.value.includes('bg-highlight'),
}));

// 计算标签的 CSS 类
const labelClasses = computed(() => ({
  'detail-label': true,
  'detail-label--highlight': variants.value.includes('label-highlight'),
}));

// 计算值的 CSS 类
const valueClasses = computed(() => ({
  'detail-value': true,
  'detail-value--highlight': variants.value.includes('value-highlight'),
}));
</script>

<template>
  <div :class="rowClasses">
    <!-- 标签 -->
    <span v-if="label" :class="labelClasses">
      <span v-if="isHtml(label)" v-html="label"></span>
      <template v-else>{{ label }}</template>
    </span>

    <!-- 值：优先使用插槽，其次使用 value 属性 -->
    <span :class="valueClasses">
      <slot v-if="hasSlot"></slot>
      <span v-else-if="isHtml(value)" v-html="value"></span>
      <template v-else>{{ value }}</template>
    </span>
  </div>
</template>
