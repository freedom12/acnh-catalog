/**
 * 物品渲染模块
 */

import { CONFIG } from './config.js';

/**
 * 创建物品卡片HTML
 */
export function createItemCard(item) {
    const imageId = item.id[0] || item.internal_name || 'unknown';
    const imagePath = `${CONFIG.IMAGES.BASE_PATH}${imageId}${CONFIG.IMAGES.EXTENSION}`;
    
    return `
        <div class="item-card ${item.owned ? 'item-owned' : ''}">
            <img src="${imagePath}" 
                 alt="${item.name}" 
                 class="item-image"
                 onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="item-image missing" style="display:none;">无图片</div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">${(item.price || 0).toLocaleString()}</div>
            <div class="item-id">ID: ${item.id[0] || 'N/A'}</div>
            ${item.DiyRecipe ? '<div class="item-recipe">可DIY</div>' : ''}
            ${item.owned ? '<div class="owned-badge">已拥有</div>' : ''}
        </div>
    `;
}

/**
 * 渲染物品列表
 */
export function renderItems(items, container) {
    if (items.length === 0) {
        container.innerHTML = '<div class="no-results"><div>😢</div><h2>没有找到匹配的物品</h2></div>';
        return false;
    }
    
    container.innerHTML = items.map(item => createItemCard(item)).join('');
    return true;
}

/**
 * 更新统计信息
 */
export function updateStats(allItems, filteredItems) {
    document.getElementById('totalItems').textContent = allItems.length.toLocaleString();
    document.getElementById('displayedItems').textContent = filteredItems.length.toLocaleString();
    
    const ownedCount = allItems.filter(item => item.owned).length;
    document.getElementById('ownedItems').textContent = ownedCount.toLocaleString();
    
    const totalValue = filteredItems.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('totalValue').textContent = totalValue.toLocaleString();
}

/**
 * 更新分页控件
 */
export function updatePagination(currentPage, totalPages, perPageValue, itemsCount, itemsPerPage) {
    const paginationEl = document.getElementById('pagination');
    
    if (perPageValue !== 'all' && itemsCount > itemsPerPage) {
        paginationEl.style.display = 'flex';
        document.getElementById('pageInfo').textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
        document.getElementById('firstPage').disabled = currentPage === 1;
        document.getElementById('prevPage').disabled = currentPage === 1;
        document.getElementById('nextPage').disabled = currentPage === totalPages;
        document.getElementById('lastPage').disabled = currentPage === totalPages;
    } else {
        paginationEl.style.display = 'none';
    }
}
