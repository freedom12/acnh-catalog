<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  'catalog-uploaded': [data: { items: Array<{ label: string; unique_id: number }> }];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const uploadStatus = ref<string>('');
const isUploading = ref(false);

const handleFileSelect = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  if (!file.name.endsWith('.json')) {
    uploadStatus.value = '请选择 JSON 文件';
    return;
  }

  isUploading.value = true;
  uploadStatus.value = '正在读取文件...';

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // 验证数据格式
    if (!data.items || !Array.isArray(data.items)) {
      uploadStatus.value = '文件格式错误：缺少 items 数组';
      isUploading.value = false;
      return;
    }

    // 验证数组中的项
    const isValid = data.items.every((item: any) => item.label && item.unique_id);

    if (!isValid) {
      uploadStatus.value = '文件格式错误：items 中缺少必要字段';
      isUploading.value = false;
      return;
    }

    uploadStatus.value = `成功加载 ${data.items.length} 个物品`;
    emit('catalog-uploaded', data);

    // 3秒后清除状态消息
    setTimeout(() => {
      uploadStatus.value = '';
    }, 3000);
  } catch (error) {
    uploadStatus.value =
      '文件解析失败：' + (error instanceof Error ? error.message : '未知错误');
  } finally {
    isUploading.value = false;
    // 清空文件输入，允许重复上传相同文件
    if (target) {
      target.value = '';
    }
  }
};
</script>

<template>
  <div class="catalog-uploader">
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileChange"
    />

    <button class="action-btn success" :disabled="isUploading" @click="handleFileSelect">
      <span>{{ isUploading ? '正在上传...' : '上传数据文件' }}</span>
    </button>

    <div
      v-if="uploadStatus"
      class="upload-status"
      :class="{
        error: uploadStatus.includes('错误') || uploadStatus.includes('失败'),
      }"
    >
      {{ uploadStatus }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/view-styles';

.catalog-uploader {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upload-status {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: 13px;
  background-color: var(--gradient-success-light);
  color: #2e7d32;
  border: 1px solid var(--success-color);
  white-space: nowrap;
}

.upload-status.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid var(--danger-color);
}
</style>
