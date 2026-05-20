# 毛选思想指导 (Mao's Thought Guidance)

<div align="center">

**以毛泽东选集核心思想为指导，帮助你在复杂现实中做最清醒的判断与选择。**

[![VS Code](https://img.shields.io/badge/VS%20Code-%3E%3D1.85.0-blue)](https://code.visualstudio.com/)
[![Version](https://img.shields.io/badge/version-0.1.5-brightgreen)](https://github.com/Gsaecy/ChairmanMao-guide-life)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)

</div>

---

## 📖 简介

**毛选思想指导** 是一个 VS Code 扩展，以毛泽东选集核心思想为灵魂，化身"毛选思想分身"与你对话。不论你面临职场困境、创业抉择、人际关系还是人生方向问题，都会引导你层层剖析，给出简洁直击要害的分析与建议。

同时融合**叶子农与丁元英思想综合剖析**中的方法论视角，提供多元化的思想工具。

> 🎨 v0.1.5 全新布局重构：自适应宽度、自动标注阶段、英文描述修复。

---

## 🧠 十大核心原则

| # | 原则 | 内涵 |
|---|------|------|
| ① | **认清形势** | 分清敌我，方向才对 |
| ② | **没有调查就没有发言权** | 重事实，不空谈 |
| ③ | **抓主要矛盾** | 抓住关键，全局盘活 |
| ④ | **战略与战术结合** | 战略敢赢，战术做实 |
| ⑤ | **群众路线** | 把目标变成大家的利益 |
| ⑥ | **游击战术** | 避实击虚，不硬碰硬 |
| ⑦ | **在实践中学习** | 边干边学，知行合一 |
| ⑧ | **实事求是** | 一切从实际出发 |
| ⑨ | **统一战线** | 团结多数，孤立少数 |
| ⑩ | **自我革新** | 常自省，常更新 |

---

## ✨ 功能特色

### 🗣️ 智能对话
- **三阶段渐进式提问**：全面了解 → 分析矛盾 → 制定对策与总结
- 毛选化身逐步引导，确保全面了解问题后再给出建议
- 多轮对话，层层深入，不急于下结论
- **回复简洁有力**，直击要害，不含思考过程

### 🎨 Apple 风格界面
- 简洁干净的 Apple 官网风格设计
- 活动栏侧边栏 + 独立编辑器面板，双模式随心切换
- 侧边栏默认显示使用引导，新手友好

### 🎨 三种风格切换
- **毛选原教旨** — 偏重毛泽东选集经典论述
- **叶子农/丁元英** — 偏重方法论与逻辑思辨
- **平衡融合** — 两者兼顾

### 🔧 灵活配置
- 默认支持 **DeepSeek** API，兼容所有 OpenAI 格式 API
- 用户自行配置 API Key、Base URL、模型
- 支持联网搜索（SerpAPI / Bing，可选启用）

### 📊 报告导出
- 一键导出分析报告为 **Markdown** 或 **PDF**
- 完整记录对话内容与分析结论

### 📂 历史管理
- 自动保存所有对话历史
- 支持搜索、查看、删除历史记录
- 对话存储路径可自定义

---

## 🚀 快速开始

### 1. 安装
从 VS Code 扩展市场搜索 **"毛选思想指导"** 安装，或下载 `.vsix` 文件手动安装：
```bash
code --install-extension ChairmanMao-guide-life-0.1.5.vsix
```

### 2. 配置 API
1. 点击 VS Code 活动栏中的 **毛选思想指导** 图标
2. 在对话面板中点击齿轮图标 ⚙ 打开设置
3. 填入 API 信息：
   - **API Base URL**：`https://api.deepseek.com`（默认）
   - **API Key**：从 [platform.deepseek.com](https://platform.deepseek.com) 获取
   - **Model**：`deepseek-chat`
4. 保存后即可开始对话

### 3. 开始咨询
直接描述你面临的问题，毛选分身会开始引导你深入剖析。

### 4. 快捷命令
| 命令 | 说明 |
|------|------|
| `毛选思想指导: 新建会话` | 开始新咨询会话 |
| `毛选思想指导: 打开对话` | 打开独立对话面板 |
| `毛选思想指导: 打开历史记录` | 浏览过往对话 |
| `毛选思想指导: 打开设置` | 配置 API 和偏好 |
| `毛选思想指导: 导出分析报告` | 导出 Markdown/PDF |
| `毛选思想指导: 清理历史记录` | 清空历史数据 |

---

## ⚙️ 配置项

| 配置键 | 说明 | 默认值 |
|--------|------|--------|
| `maoxuan.apiKey` | API Key | — |
| `maoxuan.apiBaseUrl` | API 地址 | `https://api.deepseek.com` |
| `maoxuan.model` | 模型名称 | `deepseek-chat` |
| `maoxuan.temperature` | 温度参数 (0-2) | `0.7` |
| `maoxuan.maxTokens` | 最大输出 Token | `4096` |
| `maoxuan.style` | 对话风格 (maoxuan/yedinying/balanced) | `balanced` |
| `maoxuan.storagePath` | 对话存储路径 | `~/.maoxuan-guidance` |
| `maoxuan.webSearchEnabled` | 启用联网搜索 | `true` |
| `maoxuan.searchApiKey` | 搜索引擎 API Key | — |
| `maoxuan.searchEngine` | 搜索引擎 (serpapi/bing) | `serpapi` |

---

## 🏗️ 开发

```bash
# 克隆仓库
git clone https://github.com/Gsaecy/ChairmanMao-guide-life.git
cd ChairmanMao-guide-life

# 安装依赖
npm install

# 开发模式（自动监听）
npm run watch

# 生产构建
npm run vscode:prepublish

# 打包 VSIX
npm run package

# 安装到本地 VSCode 测试
code --install-extension ChairmanMao-guide-life-0.1.5.vsix
```

**技术栈**：TypeScript · Webpack · Tailwind CSS · VS Code Extension API

---

## 📋 更新日志

### v0.1.5
- 🎨 **全新布局重构**：新建对话按钮置于顶部，消息区自适应宽度（最大680px居中）
- 🏷️ **自动标注阶段**：每条 AI 回复自动显示当前对话阶段标签
- 🌐 **英文描述修复**：扩展介绍改为英文，修复中文编码问号乱码问题
- 🗑️ 侧边栏移除「对话阶段」导航模块，更简洁
- 🎯 导出报告按钮移至阶段导航栏，方便即时导出

### v0.1.4
- 🎨 **UI 全面优化**：输入框默认增大（5行），支持垂直拖拽调整
- 🌗 **跟随 VS Code 主题**：整个界面使用主题 CSS 变量，深色/浅色主题自动适配
- 📋 **历史页面优化**：新增「查看对话」按钮，可直接进入历史对话继续交流
- 🗑️ 删除按钮改为「清除该记录」文字，操作更清晰
- 🐛 修复面板图标缺失导致问号乱码的问题
- 🐛 修复流式输出逐字刷屏问题（requestAnimationFrame 防抖）

### v0.1.3
- 🎨 全新 Apple 风格简洁 UI
- 🔧 侧边栏默认显示引导内容，不再空白
- 🐛 修复回复中出现乱码文字的问题
- 📏 回复更简洁，去掉思考过程，直击要害

### v0.1.0 - 0.1.2
- 初始发布
- 三阶段渐进式对话
- 三种风格切换
- 报告导出、历史管理

---

## 📜 许可

MIT License © 2025 Gsaecy

---

<div align="center">

**"没有调查就没有发言权" — 毛泽东**

*先看清问题全貌，再做清醒抉择。*

</div>