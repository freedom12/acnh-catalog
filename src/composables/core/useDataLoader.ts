import { ref, type Ref } from 'vue';

/**
 * 数据加载状态枚举
 */
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * 数据加载器配置选项
 */
export interface DataLoaderOptions<T, R = T> {
  /** 数据加载函数 */
  loader: () => Promise<T[]>;
  /** 可选的数据转换函数 */
  transform?: (item: T) => R;
  /**
   * 可选的 ID 提取函数，用于生成 ID 映射表
   * 返回一个 ID 数组：第一个是主 ID，其余是额外 ID（如变体 ID）
   * 所有 ID 都会映射到同一个数据项
   */
  getIds?: (item: R) => (number | string)[];
  /** 加载失败时的错误消息 */
  errorMessage?: string;
}

/**
 * 数据加载器返回值
 */
export interface DataLoaderReturn<R> {
  /** 所有数据项 */
  data: Ref<R[]>;
  /** ID 到数据项的映射表 */
  idMap: Ref<Record<number | string, R>>;
  /** 加载状态 */
  status: Ref<LoadingStatus>;
  /** 错误信息（仅在 status 为 'error' 时有值） */
  error: Ref<string>;
  /** 加载数据方法 */
  loadData: () => Promise<void>;
}

/**
 * 创建数据加载器工厂函数
 *
 * @example
 * // 简单用法
 * const useCreaturesData = createDataLoader({
 *   loader: loadCreaturesData,
 * });
 *
 * @example
 * // 带转换和 ID 映射
 * const useItemsData = createDataLoader({
 *   loader: loadItemsData,
 *   transform: (item) => new ItemModel(item),
 *   getIds: (model) => [model.id, ...model.getVariantIds()],
 * });
 */
export function createDataLoader<T, R = T>(
  options: DataLoaderOptions<T, R>
): () => DataLoaderReturn<R> {
  const { loader, transform, getIds, errorMessage = '加载数据失败' } = options;

  // 全局单例状态
  const data = ref<R[]>([]) as Ref<R[]>;
  const idMap = ref<Record<number | string, R>>({}) as Ref<Record<number | string, R>>;
  const status = ref<LoadingStatus>('idle');
  const error = ref('');

  // 内部状态，用于 Promise 去重
  let loadingPromise: Promise<void> | null = null;

  const loadData = async (): Promise<void> => {
    // 已加载成功，直接返回缓存
    if (status.value === 'success') {
      return;
    }

    // 正在加载中，返回现有 Promise（去重）
    if (loadingPromise) {
      return loadingPromise;
    }

    loadingPromise = (async () => {
      try {
        status.value = 'loading';
        error.value = '';

        const rawData = await loader();

        // 转换数据
        const transformedData: R[] = transform
          ? rawData.map(transform)
          : (rawData as unknown as R[]);

        // 生成 ID 映射表
        if (getIds) {
          const newIdMap: Record<number | string, R> = {};
          transformedData.forEach((item) => {
            const ids = getIds(item);
            ids.forEach((id) => {
              newIdMap[id] = item;
            });
          });
          idMap.value = newIdMap;
        }

        data.value = transformedData;
        status.value = 'success';
      } catch (err) {
        error.value = errorMessage;
        status.value = 'error';
        console.error(errorMessage + ':', err);
        // 失败时重置 Promise，允许重试
        loadingPromise = null;
      }
    })();

    return loadingPromise;
  };

  // 返回 composable 函数
  return () => ({
    data,
    idMap,
    status,
    error,
    loadData,
  });
}
