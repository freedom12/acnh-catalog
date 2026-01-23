# 样式系统架构指南

本项目采用 **7-1 SCSS 架构模式**，提供清晰、可维护、可扩展的样式系统。

## 📁 目录结构

```
src/styles/
├── abstracts/           # 抽象层（不输出CSS）
│   ├── _variables.scss  # 设计令牌
│   ├── _functions.scss  # SCSS 函数
│   ├── _mixins.scss     # 可复用混入
│   └── _index.scss
│
├── base/                # 基础层
│   ├── _reset.scss      # CSS 重置
│   ├── _typography.scss # 排版样式
│   ├── _root.scss       # CSS 变量
│   └── _index.scss
│
├── components/          # 组件层
│   ├── _card.scss       # 卡片组件
│   ├── _panel.scss      # 可折叠面板
│   ├── _detail-row.scss # 详情行
│   ├── _dot-selector.scss # 点选择器
│   ├── _icon-grid.scss  # 图标网格
│   ├── _button.scss     # 按钮
│   ├── _form.scss       # 表单
│   ├── _media.scss      # 媒体操作
│   ├── _icon.scss       # 图标
│   └── _index.scss
│
├── layout/              # 布局层
│   ├── _grid.scss       # 网格系统
│   ├── _container.scss  # 容器
│   └── _index.scss
│
├── pages/               # 页面层
│   ├── _view.scss       # 视图样式
│   └── _index.scss
│
├── utilities/           # 工具层
│   ├── _states.scss     # 状态样式
│   ├── _helpers.scss    # 辅助类
│   └── _index.scss
│
├── main.scss            # 主入口
├── style.scss           # 兼容入口
├── card-styles.scss     # 卡片组件入口
└── view-styles.scss     # 视图组件入口
```

## 🎨 核心组件

### 1. 卡片 (Card)
```html
<div class="card card--green card--variant-dark">
  <div class="card-info">
    <h3 class="card-name">名称</h3>
    <div class="card-details">...</div>
  </div>
</div>
```

### 2. 可折叠面板 (Panel)
```html
<div class="panel panel--green">
  <div class="panel-header">
    <span class="panel-title">标题</span>
    <span class="panel-toggle">▼</span>
  </div>
  <div class="panel-content">
    内容...
  </div>
</div>
```

主题色: `panel--yellow`, `panel--orange`, `panel--red`, `panel--green`, `panel--pink`, `panel--blue`

### 3. 详情行 (Detail Row)
```html
<div class="detail-row">
  <span class="detail-label">标签</span>
  <span class="detail-value">值</span>
</div>

<!-- 变体 -->
<div class="detail-row detail-row--full">...</div>
<div class="detail-row detail-row--center">...</div>
<div class="detail-row detail-row--highlight">...</div>
```

### 4. 点选择器 (Dot Selector)
```html
<div class="dot-selector">
  <span class="dot-item dot-item--yellow">1</span>
  <span class="dot-item dot-item--yellow dot-item--active">2</span>
  <span class="dot-item dot-item--yellow">3</span>
</div>
```

主题色: `dot-item--yellow`, `dot-item--pink`, `dot-item--blue`, `dot-item--green`

### 5. 图标网格 (Icon Grid)
```html
<!-- 3列网格 -->
<div class="icon-grid icon-grid--cols-3">
  <div class="icon-grid-item">
    <img src="..." />
    <span class="icon-grid-label">标签</span>
  </div>
</div>

<!-- 内联居中 -->
<div class="icon-grid icon-grid--inline">...</div>

<!-- 垂直列表 -->
<div class="icon-grid icon-grid--vertical">...</div>
```

### 6. 媒体按钮 (Media Button)
```html
<div class="media-actions">
  <button class="media-btn">
    <span class="media-btn-icon">▶</span> 播放
  </button>
  <button class="media-btn media-btn--radio">
    <span class="media-btn-icon">▶</span> 广播
  </button>
</div>
```

## 🎯 命名规范

- **组件及子元素**: 单横线 `.component-element`
- **修饰符/变体**: 双横线 `.component--modifier`

```scss
.panel              // 组件
.panel-header       // 子元素
.panel-title        // 子元素
.panel--green       // 主题修饰符
.panel--yellow      // 主题修饰符
```

## 🎨 主题色系统

| 主题 | 主色 | 基色 | 用途 |
|------|------|------|------|
| green | #4caf50 | #e8f5e9 | 默认、植物、家具 |
| yellow | #ffc107 | #fff9e6 | 变体选择、DIY |
| orange | #ff9800 | #fff3e0 | 化石、材料 |
| red | #f44336 | #ffebee | HHA、危险 |
| pink | #e91e63 | #fce4ec | 服饰 |
| blue | #2196f3 | #e3f2fd | 音乐、鱼类 |
| brown | #795548 | #efebe9 | 艺术品 |

## 📝 使用方式

### 在 Vue 组件中
```vue
<style lang="scss">
// 导入卡片相关样式
@use '../styles/card-styles.scss';
</style>
```

### 使用变量和 mixins
```vue
<style scoped lang="scss">
@use '../styles/abstracts' as *;

.my-component {
  @include flex-center;
  padding: $spacing-md;
  color: $color-primary;
}
</style>
```

## ✅ 最佳实践

1. 优先使用全局组件类，避免重复定义
2. 使用变量而非硬编码值
3. 组件特有样式使用 scoped
4. 遵循命名规范保持一致性
