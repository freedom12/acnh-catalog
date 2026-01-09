import { ref, computed, type Ref } from 'vue';

export function usePagination<T>(datas: Ref<T[]>, perPageCount: Ref<number> = ref(100)) {
  const currentPage = ref(1);

  const totalPageCount = computed(() =>
    Math.ceil(datas.value.length / perPageCount.value)
  );

  const displayDatas = computed(() => {
    const start = (currentPage.value - 1) * perPageCount.value;
    const end = start + perPageCount.value;
    return datas.value.slice(start, end);
  });

  const handlePageChange = (page: number) => {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    currentPage,
    totalPageCount,
    displayDatas,
    handlePageChange,
  };
}
