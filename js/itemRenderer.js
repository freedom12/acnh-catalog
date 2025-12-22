/**
 * 物品渲染模块
 */

import { CONFIG, getSourceName, getTagName } from './config.js';

// 颜色映射表
const COLOR_MAP = {
    'Red': '#e74c3c',
    'Orange': '#e67e22',
    'Yellow': '#f1c40f',
    'Green': '#27ae60',
    'Blue': '#3498db',
    'Aqua': '#1abc9c',
    'Purple': '#9b59b6',
    'Pink': '#ff69b4',
    'White': '#ecf0f1',
    'Black': '#2c3e50',
    'Gray': '#95a5a6',
    'Brown': '#8b6f47',
    'Beige': '#d4c5b9',
};

/**
 * 生成颜色块HTML
 */
function generateColorBlock(colors) {
    if (colors.length === 0) return '';
    
    const sectionDeg = 360 / colors.length;
    let gradientStops = [];
    let currentDeg = 0;
    
    colors.forEach(color => {
        const endDeg = currentDeg + sectionDeg;
        
        if (color === 'Colorful') {
            // Colorful 扇形：填充彩虹渐变
            const rainbowColors = ['#e74c3c', '#e67e22', '#f1c40f', '#27ae60', '#1abc9c', '#3498db', '#9b59b6'];
            const rainbowStep = sectionDeg / (rainbowColors.length - 1);
            rainbowColors.forEach((c, i) => {
                gradientStops.push(`${c} ${currentDeg + rainbowStep * i}deg`);
            });
        } else {
            // 普通颜色扇形
            const colorValue = COLOR_MAP[color] || '#ccc';
            gradientStops.push(`${colorValue} ${currentDeg}deg`);
            gradientStops.push(`${colorValue} ${endDeg}deg`);
        }
        
        currentDeg = endDeg;
    });
    
    const gradient = `conic-gradient(from -135deg, ${gradientStops.join(', ')})`;
    return `<span class="color-block" style="background: ${gradient};"></span>`;
}

/**
 * 创建物品卡片HTML
 */
export function createItemCard(item) {
    const vIndex = item.vIndex || 0;
    const pIndex = item.pIndex || 0;
    
    // 根据vIndex和pIndex获取当前应该显示的变体
    let currentVariant = null;
    let currentPattern = null;
    let imagePath = item.imageUrl;
    let displayId = item.id;
    let displayColors = item.colors || [];
    
    if (item.hasVariations && item.variantGroups && item.variantGroups.length > 0) {
        currentVariant = item.variantGroups[vIndex] || item.variantGroups[0];
        if (currentVariant && currentVariant.patterns && currentVariant.patterns.length > 0) {
            currentPattern = currentVariant.patterns[pIndex] || currentVariant.patterns[0];
            if (currentPattern) {
                imagePath = currentPattern.imageUrl;
                displayId = currentPattern.id;
                displayColors = currentPattern.colors || [];
            }
        }
    }
    
    const itemId = `item-${displayId}`;
    
    // 生成两层变体选择器HTML
    let variationControls = '';
    if (item.hasVariations && item.variantGroups.length > 0) {
        // 第一层：variant（款式/颜色）
        const hasMultipleVariants = item.variantGroups.length > 1;
        const hasPatterns = item.variantGroups[vIndex].patterns.length > 1;
        
        if (hasMultipleVariants) {
            variationControls += `
                <div class="variation-row variant-row">
                    <span class="variation-label">款式:</span>
                    <div class="variation-dots">
                        ${item.variantGroups.map((vg, vIdx) => 
                            `<span class="variation-dot variant-dot ${vIdx === vIndex ? 'active' : ''}" 
                                   data-variant-index="${vIdx}"
                                   data-pattern-index="0"
                                   title="${vg.variantName || '款式 ' + (vIdx + 1)}">
                                ${vIdx + 1}
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
                        ${item.variantGroups[vIndex].patterns.map((p, pIdx) => 
                            `<span class="variation-dot pattern-dot ${pIdx === pIndex ? 'active' : ''}" 
                                   data-variant-index="${vIndex}"
                                   data-pattern-index="${pIdx}"
                                   title="${p.patternName || '图案 ' + (pIdx + 1)}">
                                ${pIdx + 1}
                            </span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    // 获取当前显示的名称
    let displayName = item.name;
    if (currentVariant) {
        if (currentVariant.variantName) displayName += ` - ${currentVariant.variantName}`;
        if (currentPattern && currentPattern.patternName) displayName += ` - ${currentPattern.patternName}`;
    }
    
    // 获取版本信息
    const versionAdded = item.originalData?.versionAdded || '';
    const versionBadge = versionAdded ? `<div class="version-badge">${versionAdded}</div>` : '';
    
    // 获取来源信息
    const sources = item.originalData?.source || [];
    const sourceTextCN = sources.length > 0 ? sources.map(s => getSourceName(s)).join(', ') : '';
    const sourceTextEN = sources.length > 0 ? sources.join(', ') : '';
    const sourceBadge = sourceTextCN ? `<div class="source-info" title="${sourceTextEN}">📍 ${sourceTextCN}</div>` : '';
    
    // 获取尺寸信息
    const size = item.originalData?.size || '';
    
    // 生成颜色块HTML
    let colorBlocks = '';
    if (displayColors.length > 0) {
        colorBlocks = generateColorBlock(displayColors);
    }
    
    const sizeInfo = (size || displayColors.length > 0) ? `<div class="size-tag-info">${size ? '📏 ' + size : ''}${size && displayColors.length > 0 ? ' ' : ''}${colorBlocks}</div>` : '';
    
    // 获取标签和系列信息
    const tag = item.originalData?.tag || '';
    const tagName = tag ? getTagName(tag) : '';
    const seriesName = item.seriesName || '';
    const tagSeriesInfo = (tag || seriesName) ? `<div class="tag-series-info">${tagName ? '🏷️ ' + tagName : ''}${tagName && seriesName ? ' · ' : ''}${seriesName ? '📦 ' + seriesName : ''}</div>` : '';
    
    return `
        <div class="item-card ${item.owned ? 'item-owned' : ''}" id="${itemId}" data-item='${JSON.stringify(item).replace(/'/g, "&apos;")}'>
            ${versionBadge}
            <img src="${imagePath}" 
                 alt="${item.name}" 
                 class="item-image"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="item-image missing" style="display:none;">无图片</div>
            <div class="item-name">${displayName}</div>
            <div class="item-id">ID: ${displayId || 'N/A'}</div>
            ${sourceBadge}
            ${sizeInfo}
            ${tagSeriesInfo}
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
                // 更新itemData的索引
                itemData.vIndex = variantIndex;
                itemData.pIndex = 0;  // 切换variant时重置为第一个pattern
                
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
                
                // 更新card的data-item
                card.dataset.item = JSON.stringify(itemData).replace(/'/g, "&apos;");
                
                // 更新显示
                updateItemDisplay(card, itemData);
            }
            // 如果点击的是 pattern 圆点
            else if (dot.classList.contains('pattern-dot')) {
                // 更新itemData的索引
                itemData.vIndex = variantIndex;
                itemData.pIndex = patternIndex;
                
                // 切换 pattern 激活状态
                card.querySelectorAll('.pattern-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // 更新card的data-item
                card.dataset.item = JSON.stringify(itemData).replace(/'/g, "&apos;");
                
                // 更新显示
                updateItemDisplay(card, itemData);
            }
        }
    });
}

/**
 * 更新物品显示
 */
function updateItemDisplay(card, itemData) {
    const vIndex = itemData.vIndex || 0;
    const pIndex = itemData.pIndex || 0;
    
    const variant = itemData.variantGroups[vIndex];
    const pattern = variant.patterns[pIndex];
    
    const img = card.querySelector('.item-image');
    const nameEl = card.querySelector('.item-name');
    const idEl = card.querySelector('.item-id');
    const sizeTagEl = card.querySelector('.size-tag-info');
    
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
    
    // 更新颜色块
    if (sizeTagEl && pattern.colors) {
        const size = itemData.originalData?.size || '';
        const tag = itemData.originalData?.tag || '';
        const tagName = tag ? getTagName(tag) : '';
        const colors = pattern.colors || [];
        
        // 生成颜色块HTML
        let colorBlocks = '';
        if (colors.length > 0) {
            colorBlocks = generateColorBlock(colors);
        }
        
        const sizeTagInfo = (size || tagName || colors.length > 0) ? `${size ? '📏 ' + size : ''}${size && tagName ? ' · ' : ''}${tagName ? '🏷️ ' + tagName : ''}${(size || tagName) && colors.length > 0 ? ' ' : ''}${colorBlocks}` : '';
        sizeTagEl.innerHTML = sizeTagInfo;
    }
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
