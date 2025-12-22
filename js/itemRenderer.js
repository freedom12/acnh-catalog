/**
 * 物品渲染模块
 */

import { CONFIG } from './config.js';

/**
 * 创建物品卡片HTML
 */
export function createItemCard(item) {
    const imagePath = item.imageUrl;
    const itemId = `item-${item.id}`;
    
    // 生成两层变体选择器HTML
    let variationControls = '';
    if (item.hasVariations && item.variantGroups.length > 0) {
        // 第一层：variant（款式/颜色）
        const hasMultipleVariants = item.variantGroups.length > 1;
        const hasPatterns = item.variantGroups[0].patterns.length > 1;
        
        if (hasMultipleVariants) {
            variationControls += `
                <div class="variation-row variant-row">
                    <span class="variation-label">款式:</span>
                    <div class="variation-dots">
                        ${item.variantGroups.map((vg, vIndex) => 
                            `<span class="variation-dot variant-dot ${vIndex === 0 ? 'active' : ''}" 
                                   data-variant-index="${vIndex}"
                                   data-pattern-index="0"
                                   title="${vg.variantName || '款式 ' + (vIndex + 1)}">
                                ${vIndex + 1}
                            </span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
        
        // 第二层：pattern（图案）
        if (hasPatterns) {
            variationControls += `
                <div class="variation-row pattern-row">
                    <span class="variation-label">图案:</span>
                    <div class="variation-dots">
                        ${item.variantGroups[0].patterns.map((p, pIndex) => 
                            `<span class="variation-dot pattern-dot ${pIndex === 0 ? 'active' : ''}" 
                                   data-variant-index="0"
                                   data-pattern-index="${pIndex}"
                                   title="${p.patternName || '图案 ' + (pIndex + 1)}">
                                ${pIndex + 1}
                            </span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    // 获取当前显示的名称
    let displayName = item.name;
    if (item.hasVariations && item.variantGroups.length > 0) {
        const variant = item.variantGroups[0];
        if (variant.variantName) displayName += ` - ${variant.variantName}`;
        if (variant.patterns[0].patternName) displayName += ` - ${variant.patterns[0].patternName}`;
    }
    
    // 获取版本信息
    const versionAdded = item.originalData?.versionAdded || '';
    const versionBadge = versionAdded ? `<div class="version-badge">${versionAdded}</div>` : '';
    
    return `
        <div class="item-card ${item.owned ? 'item-owned' : ''}" id="${itemId}" data-item='${JSON.stringify(item).replace(/'/g, "&apos;")}'>
            ${versionBadge}
            <img src="${imagePath}" 
                 alt="${item.name}" 
                 class="item-image"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="item-image missing" style="display:none;">无图片</div>
            <div class="item-name">${displayName}</div>
            <div class="item-id">ID: ${item.id || 'N/A'}</div>
            ${item.DiyRecipe ? '<div class="item-recipe">可DIY</div>' : ''}
            ${variationControls}
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
            
            const variantIndex = parseInt(dot.dataset.variantIndex);
            const patternIndex = parseInt(dot.dataset.patternIndex);
            
            // 如果点击的是 variant 圆点
            if (dot.classList.contains('variant-dot')) {
                // 切换 variant 激活状态
                card.querySelectorAll('.variant-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // 重新生成 pattern 圆点（如果有）
                const patternRow = card.querySelector('.pattern-row .variation-dots');
                if (patternRow && itemData.variantGroups[variantIndex].patterns.length > 1) {
                    patternRow.innerHTML = itemData.variantGroups[variantIndex].patterns.map((p, pIndex) => 
                        `<span class="variation-dot pattern-dot ${pIndex === 0 ? 'active' : ''}" 
                               data-variant-index="${variantIndex}"
                               data-pattern-index="${pIndex}"
                               title="${p.patternName || '图案 ' + (pIndex + 1)}">
                            ${pIndex + 1}
                        </span>`
                    ).join('');
                }
                
                // 使用第一个 pattern
                updateItemDisplay(card, itemData, variantIndex, 0);
            }
            // 如果点击的是 pattern 圆点
            else if (dot.classList.contains('pattern-dot')) {
                // 切换 pattern 激活状态
                card.querySelectorAll('.pattern-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // 更新显示
                updateItemDisplay(card, itemData, variantIndex, patternIndex);
            }
        }
    });
}

/**
 * 更新物品显示
 */
function updateItemDisplay(card, itemData, variantIndex, patternIndex) {
    const variant = itemData.variantGroups[variantIndex];
    const pattern = variant.patterns[patternIndex];
    
    const img = card.querySelector('.item-image');
    const nameEl = card.querySelector('.item-name');
    const idEl = card.querySelector('.item-id');
    
    // 更新图片
    img.src = pattern.imageUrl;
    img.style.display = 'block';
    img.nextElementSibling.style.display = 'none';
    
    // 更新名称
    let displayName = itemData.name;
    if (variant.variantName) displayName += ` - ${variant.variantName}`;
    if (pattern.patternName) displayName += ` - ${pattern.patternName}`;
    nameEl.textContent = displayName;
    
    // 更新ID
    idEl.textContent = `ID: ${pattern.id || itemData.id || 'N/A'}`;
}

/**
 * 更新统计信息
 */
export function updateStats(allItems, filteredItems) {
    document.getElementById('totalItems').textContent = allItems.length.toLocaleString();
    document.getElementById('displayedItems').textContent = filteredItems.length.toLocaleString();
    
    const ownedCount = allItems.filter(item => item.owned).length;
    document.getElementById('ownedItems').textContent = ownedCount.toLocaleString();
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
