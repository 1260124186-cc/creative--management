# 创意管理与协作系统

一个简单易用的前端创意管理与协作界面，支持创意的提交、编辑和删除操作。

## 功能特性

- ✅ 提交新创意
- ✅ 编辑已有创意
- ✅ 删除创意
- ✅ 响应式布局，支持各种屏幕尺寸
- ✅ 现代化的UI设计

## 技术栈

- **React 18** - 前端框架
- **Vite** - 构建工具
- **Playwright** - 端到端测试
- **纯CSS** - 样式设计

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:8080` 启动（已在 `vite.config.js` 中显式指定端口）。

### 3. 生产构建

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

### 4. 运行测试

```bash
# 直接运行测试，Playwright 会按配置自动启动/复用本地开发服务器
npm test
```

测试将使用 `playwright.config.ts` 中配置的 `baseURL`（当前为 `http://localhost:8080`）。

## 项目结构

```
project-folder/
├─ index.html            # HTML入口文件
├─ package.json          # 项目配置
├─ vite.config.js        # Vite配置
├─ src/
│  ├─ main.jsx           # React入口
│  ├─ App.jsx            # 主应用组件
│  └─ styles/
│     └─ App.css         # 全局样式
└─ tests/
   └─ idea-management.spec.js  # Playwright测试用例
```

## 使用说明

1. **提交新创意**：在表单中填写创意标题和描述，点击"提交创意"按钮。
2. **编辑创意**：点击创意卡片上的"编辑"按钮，修改内容后点击"更新创意"。
3. **删除创意**：点击创意卡片上的"删除"按钮。

## 测试内容

测试套件包含以下功能测试：
- 页面加载验证
- 创意提交功能
- 创意编辑功能
- 创意删除功能

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari

## License

MIT
