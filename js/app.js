/**
 * 主应用入口
 */

import { CONFIG } from './config.js';
import { loadItemsData, loadCatalogData, mergeItemsData } from './dataLoader.js';
import { filterItems, sortItems, populateCategoryFilter } from './filters.js';
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
            await this.loadData();
            this.setupEventListeners();
            this.updateDisplay();
        } catch (error) {
            this.showError('加载数据失败，请确保 items_CNzh.json 文件存在');
            console.error('Error loading data:', error);
        }
    }
    
    async loadData() {
        const itemsData = await loadItemsData();
        const ownedItemsSet = await loadCatalogData();
        
        this.allItems = mergeItemsData(itemsData, ownedItemsSet);
        this.filteredItems = [...this.allItems];
        
        populateCategoryFilter(this.allItems);
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
    }
    
    handleFilterChange() {
        const searchTerm = document.getElementById('searchInput').value;
        const category = document.getElementById('categoryFilter').value;
        const ownedFilter = document.getElementById('ownedFilter').value;
        
        this.filteredItems = filterItems(this.allItems, searchTerm, category, ownedFilter);
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
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredItems.length);
        return this.filteredItems.slice(startIndex, endIndex);
    }
    
    updateDisplay() {
        const container = document.getElementById('itemsContainer');
        const perPageValue = document.getElementById('perPageSelect').value;
        
        this.itemsPerPage = perPageValue === 'all' 
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
    
    showError(message) {
        document.getElementById('itemsContainer').innerHTML = 
            `<div class="no-results">${message}</div>`;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ACNHCatalogApp();
});
