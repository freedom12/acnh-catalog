/**
 * 物品渲染模块
 */

import { CONFIG } from './config.js';

/**
 * 创建物品卡片HTML
 */
export function createItemCard(item) {
    // 优先使用 animal-crossing 提供的图片 URL
    const imagePath = item.hasVariations && item.variations[0].imageUrl ? item.variations[0].imageUrl : item.imageUrl;
    const id = item.hasVariations && item.variations[0].id ? item.variations[0].id : item.id;
    const itemId = `item-${id}`;
    
    // 生成变体圆点HTML
    let variationDots = '';
    if (item.hasVariations && item.variations.length > 1) {
        variationDots = `
            <div class="variation-dots">
                ${item.variations.map((v, index) => 
                    `<span class="variation-dot ${index === 0 ? 'active' : ''}" 
                           data-index="${index}"
                           title="${v.name || '变体 ' + (index + 1)}">
                        ${index + 1}
                    </span>`
                ).join('')}
            </div>
        `;
    }
    
    return `
        <div class="item-card ${item.owned ? 'item-owned' : ''}" id="${itemId}" data-item='${JSON.stringify(item).replace(/'/g, "&apos;")}'>
            <img src="${imagePath}" 
                 alt="${item.name}" 
                 class="item-image"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="item-image missing" style="display:none;">无图片</div>
            <div class="item-name">${item.name}${item.hasVariations && item.variations[0].name ? ' - ' + item.variations[0].name : ''}</div>
            <div class="item-id">ID: ${id || 'N/A'}</div>
            ${item.DiyRecipe ? '<div class="item-recipe">可DIY</div>' : ''}
            ${item.owned ? '<div class="owned-badge">已拥有</div>' : ''}
            ${variationDots}
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
    
    // 添加变体切换事件监听
    setupVariationListeners(container);
    
    return true;
}

/**
 * 设置变体切换监听器
 */
function setupVariationListeners(container) {
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('variation-dot')) {
            const dot = e.target;
            const card = dot.closest('.item-card');
            const itemData = JSON.parse(card.dataset.item);
            const variantIndex = parseInt(dot.dataset.index);
            
            // 切换激活状态
            card.querySelectorAll('.variation-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            // 更新图片和名称
            const variation = itemData.variations[variantIndex];
            const img = card.querySelector('.item-image');
            const nameEl = card.querySelector('.item-name');
            
            img.src = variation.imageUrl;
            img.style.display = 'block';
            img.nextElementSibling.style.display = 'none';
            
            nameEl.textContent = itemData.name + (variation.name ? ' - ' + variation.name : '');

            // 更新id
            const idEl = card.querySelector('.item-id');
            idEl.textContent = `ID: ${variation.id || itemData.id || 'N/A'}`;
        }
    });
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
