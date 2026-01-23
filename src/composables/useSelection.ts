import { ref } from 'vue';

const STORAGE_KEY = 'acnh-catalog-selections';

interface SelectionData {
  [key: string]: { [id: string]: boolean };
}

const selections = ref<SelectionData>({});

// 从localStorage加载数据
const loadSelections = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      selections.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load selections from localStorage:', error);
  }
};

// 保存到localStorage
const saveSelections = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections.value));
  } catch (error) {
    console.error('Failed to save selections to localStorage:', error);
  }
};

// 初始化加载
loadSelections();

export { selections, saveSelections };

export const useSelection = (key: string) => {
  if (!key) {
    throw new Error('Selection key is required');
  }

  // 确保key存在
  if (!selections.value[key]) {
    selections.value[key] = {};
  }

  const isSelected = (id: string | number) => {
    return (selections.value[key] && selections.value[key][String(id)]) === true;
  };

  const toggleSelected = (id: string | number) => {
    const idStr = String(id);
    if (!selections.value[key]) {
      selections.value[key] = {};
    }
    selections.value[key][idStr] = !selections.value[key][idStr];
    saveSelections();
  };

  const setSelected = (id: string | number, selected: boolean) => {
    const idStr = String(id);
    if (!selections.value[key]) {
      selections.value[key] = {};
    }
    selections.value[key][idStr] = selected;
    saveSelections();
  };

  const getSelectedIds = () => {
    return Object.keys(selections.value[key] || {}).filter(id => selections.value[key]?.[id]);
  };

  const clearSelections = () => {
    selections.value[key] = {};
    saveSelections();
  };

  return {
    isSelected,
    toggleSelected,
    setSelected,
    getSelectedIds,
    clearSelections,
  };
};