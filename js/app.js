/**
 * 主应用入口
 */

import { CONFIG, loadTranslations } from './config.js';
import {
  loadItemsData,
  loadCatalogData,
  processItemsData,
} from './dataLoader.js';
import {
  filterItems,
  sortItems,
  populateCategoryFilter,
  populateVersionFilter,
  populateSourceFilter,
  populateSizeFilter,
  populateTagFilter,
  populateColorFilter,
  populateSeriesFilter,
} from './filters.js';
import { renderItems, updateStats, updatePagination } from './itemRenderer.js';

class ACNHCatalogApp {
  constructor() {
    this.allItems = [];
    this.filteredItems = [];
    this.currentPage = 1;
    this.itemsPerPage = CONFIG.PAGINATION.DEFAULT_PER_PAGE;

    this.init();
  }

  async init() {
    try {
      const json = localStorage.getItem('data');
      const data = !json ? undefined : JSON.parse(json);
      await loadTranslations();
      await this.loadData(data);
      this.setupEventListeners();
      this.updateDisplay();
      if (data) {
        this.displayDataTime(data, true);
      }
    } catch (error) {
      this.showError('加载数据失败，请确保 items_CNzh.json 文件存在');
      console.error('Error loading data:', error);
    }
  }

  async loadData(myOwnData) {
    const acnhItems = await loadItemsData();
    const ownedItemsSet = await loadCatalogData(myOwnData);

    this.allItems = processItemsData(acnhItems, ownedItemsSet);
    this.filteredItems = [...this.allItems];

    populateCategoryFilter(this.allItems);
    populateVersionFilter(this.allItems);
    populateSourceFilter(this.allItems);
    populateSizeFilter(this.allItems);
    populateTagFilter(this.allItems);
    populateColorFilter(this.allItems);
    populateSeriesFilter(this.allItems);
  }

  setupEventListeners() {
    // 搜索框
    document.getElementById('searchInput').addEventListener('input', () => {
      this.handleFilterChange();
    });

    // 分类筛选
    document.getElementById('categoryFilter').addEventListener('change', () => {
      this.handleFilterChange();
    });

    // 拥有状态筛选
    document.getElementById('ownedFilter').addEventListener('change', () => {
      this.handleFilterChange();
    });

    // 版本筛选
    document.getElementById('versionFilter').addEventListener('change', () => {
      this.handleFilterChange();
    });
    // 版本筛选
    document.getElementById('versionFilter').addEventListener('change', () => {
      this.handleFilterChange();
    });

    // 来源筛选
    document.getElementById('sourceFilter').addEventListener('change', () => {
      this.handleFilterChange();
    });

    // 尺寸筛选
    document.getElementById('sizeFilter').addEventListener('change', () => {
      this.handleFilterChange();
    });

    // 标签筛选
    document.getElementById('tagFilter').addEventListener('change', () => {
      this.handleFilterChange();
    });

    // 颜色筛选
    document.getElementById('colorFilter').addEventListener('change', () => {
      this.handleFilterChange();
    });

    // 系列筛选
    document.getElementById('seriesFilter').addEventListener('change', () => {
      this.handleFilterChange();
    });

    // 排序
    document.getElementById('sortSelect').addEventListener('change', () => {
      this.handleSortChange();
    });

    // 每页显示数量
    document.getElementById('perPageSelect').addEventListener('change', () => {
      this.currentPage = 1;
      this.updateDisplay();
    });

    // 分页按钮
    document.getElementById('firstPage').addEventListener('click', () => {
      this.currentPage = 1;
      this.updateDisplay();
    });
    document.getElementById('prevPage').addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateDisplay();
      }
    });
    document.getElementById('nextPage').addEventListener('click', () => {
      const totalPages = this.getTotalPages();
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.updateDisplay();
      }
    });
    document.getElementById('lastPage').addEventListener('click', () => {
      this.currentPage = this.getTotalPages();
      this.updateDisplay();
    });

    // 上传控件
    document.getElementById('uploadBtn').addEventListener('click', () => {
      document.getElementById('uploadInput').click();
    });
    document
      .getElementById('uploadInput')
      .addEventListener('change', (eInput) => {
        const file = eInput.target.files[0];
        if (!file) return;
        this.readDataFromFile(file);
      });
  }

  handleFilterChange() {
    const searchTerm = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const ownedFilter = document.getElementById('ownedFilter').value;
    const versionFilter = document.getElementById('versionFilter').value;
    const sourceFilter = document.getElementById('sourceFilter').value;
    const sizeFilter = document.getElementById('sizeFilter').value;
    const tagFilter = document.getElementById('tagFilter').value;
    const colorFilter = document.getElementById('colorFilter').value;
    const seriesFilter = document.getElementById('seriesFilter').value;

    this.filteredItems = filterItems(
      this.allItems,
      searchTerm,
      category,
      ownedFilter,
      versionFilter,
      sourceFilter,
      sizeFilter,
      tagFilter,
      colorFilter,
      seriesFilter
    );
    this.handleSortChange();
    this.currentPage = 1;
    this.updateDisplay();
  }

  handleSortChange() {
    const sortValue = document.getElementById('sortSelect').value;
    this.filteredItems = sortItems(this.filteredItems, sortValue);
    this.updateDisplay();
  }

  getTotalPages() {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  getItemsToDisplay() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.filteredItems.length
    );
    return this.filteredItems.slice(startIndex, endIndex);
  }

  updateDisplay() {
    const container = document.getElementById('itemsContainer');
    const perPageValue = document.getElementById('perPageSelect').value;

    this.itemsPerPage =
      perPageValue === 'all'
        ? this.filteredItems.length
        : parseInt(perPageValue);

    const totalPages = this.getTotalPages();
    const itemsToDisplay = this.getItemsToDisplay();

    // 更新统计信息
    updateStats(this.allItems, this.filteredItems);

    // 渲染物品
    const hasItems = renderItems(itemsToDisplay, container);

    // 更新分页
    if (hasItems) {
      updatePagination(
        this.currentPage,
        totalPages,
        perPageValue,
        this.filteredItems.length,
        this.itemsPerPage
      );
    } else {
      document.getElementById('pagination').style.display = 'none';
    }
  }

  readDataFromFile(file) {
    const reader = new FileReader();
    reader.onload = async (eReader) => {
      try {
        const data = JSON.parse(eReader.target.result);
        await this.loadData(data);
        this.handleFilterChange();
        this.displayDataTime(data);
        localStorage.setItem('data', eReader.target.result);
      } catch (err) {
        alert('数据解析失败！');
      } finally {
        eInput.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  displayDataTime(data, isLast = false) {
    const strTime = `${new Date(data.updated_at * 1000)
      .toISOString()
      .slice(0, 10)}`;
    document.getElementById('dateInfo').innerText = `${
      isLast ? '上次' : ''
    }已导入 ${strTime} 同步的数据`;
  }

  showError(message) {
    document.getElementById(
      'itemsContainer'
    ).innerHTML = `<div class="no-results">${message}</div>`;
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new ACNHCatalogApp();
});
