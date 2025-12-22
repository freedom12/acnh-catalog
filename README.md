# 动物森友会物品目录 🍃

一个用于浏览和管理《集合啦！动物森友会》物品的网页应用。

## 功能特性

- 📱 响应式设计，支持各种屏幕尺寸
- 🔍 实时搜索物品名称
- 🏷️ 按分类筛选物品
- 🔄 多种排序方式（名称、价格、ID）
- ✅ 标记已拥有的物品
- 📄 分页显示（可选择每页显示数量）
- 📊 统计信息（总物品数、已拥有数量、总价值）
- 🖼️ 从 CDN 加载物品图片（基于 animal-crossing 数据库）

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

这将启动一个本地服务器并自动打开浏览器访问 http://localhost:8000

### 其他命令

- `npm run dev` - 启动服务器但不自动打开浏览器
- `npm run serve` - 使用 Python 启动服务器（需要安装 Python）

## 项目结构

```
acnh-catalog/
├── index.html              # 主页面
├── css/
│   └── style.css          # 样式文件
├── js/
│   ├── app.js             # 主应用逻辑
│   ├── config.js          # 配置文件
│   ├── dataLoader.js      # 数据加载模块
│   ├── filters.js         # 筛选和排序模块
│   └── itemRenderer.js    # 物品渲染模块
├── items_CNzh.json        # 物品数据（中文）
├── catalog_items.json     # 已拥有的物品数据
├── package.json           # npm 项目配置
├── .gitignore            # Git 忽略文件
└── README.md             # 项目说明文档
```

## 数据说明

### items_CNzh.json

包含所有物品的详细信息：
- `name`: 物品名称
- `id`: 物品ID
- `internal_name`: 内部名称
- `price`: 价格
- `DiyRecipe`: DIY配方ID（可选）
- `category`: 物品分类

### catalog_items.json

包含已拥有的物品信息：
- `label`: 物品名称（用于匹配）
- `unique_id`: 唯一ID
- `price`: 价格
- 其他属性...

## 技术栈

- HTML5
- CSS3（使用 Flexbox 和 Grid 布局）
- 原生 JavaScript（ES6+ Modules）
- Fetch API

## 项目架构

项目采用模块化设计，代码分离为以下几个部分：

- **config.js**: 应用配置（数据路径、分页设置、排序选项等）
- **dataLoader.js**: 负责加载和处理 JSON 数据
- **filters.js**: 物品筛选和排序逻辑
- **itemRenderer.js**: 物品卡片渲染和 UI 更新
- **app.js**: 主应用类，协调各模块工作

## 浏览器支持

- Chrome/Edge（推荐）
- Firefox
- Safari
- 其他现代浏览器

## 开发说明

本项目使用纯前端技术，无需后端服务器。所有数据都存储在 JSON 文件中。

### 图片来源

物品图片从 [acnhcdn.com](https://acnhcdn.com) CDN 加载。本项目依赖 [animal-crossing](https://github.com/Norviah/animal-crossing) npm 包提供的数据结构，图片通过物品的 `internal_name` 字段从 CDN 获取。

### 如何添加新物品

1. 编辑 `items_CNzh.json` 添加物品信息（确保包含正确的 `internal_name` 字段）
2. 图片会自动从 CDN 加载，无需本地存储

### 如何标记已拥有的物品

编辑 `catalog_items.json`，在 `items` 数组中添加物品信息。物品会根据 `label` 字段（物品名称）自动匹配。

## License

MIT


## 相关链接
https://github.com/Norviah/acnh-images
https://github.com/phecdaDia/ACNH
https://github.com/Norviah/animal-crossing