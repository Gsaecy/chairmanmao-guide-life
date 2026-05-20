# Mao's Thought Guidance

**AI guidance powered by Mao's Selected Works - analyze problems with pragmatic, clear-headed methodology.**

| VS Code | Version | License |
|---------|---------|--------|
| >=1.85.0 | 0.2.1 | MIT |

---

## What's New in v0.2.1

- 🖼️ **Fixed Icon Display** - Added `img-src vscode-resource:` to CSP policies for ChatPanel, ChatViewProvider, and HistoryPanel
- 📐 **Sidebar Layout Refined** - Usage instructions moved to bottom fixed area (`flex-shrink-0`)
- 🔗 **History View Chat Fix** - Added `maoxuan-guidance.loadSession` command; clicking "View Chat" in history now correctly loads sessions
- 📦 **Dev Packaging** - Updated webpack configs, package scripts, and VSIX build pipeline

### Previous v0.2.0
- ✨ **Redesigned Sidebar Navigation** - Clean status display (extension name + style mode + API readiness) with three action buttons (New Chat / History / Settings), welcome icon, and step-by-step usage guide
- 🎨 **Full Theme Adaptation** - History & Settings panels now use VSCode CSS variables; no more hardcoded red/white colors; all input fields have subtle shadows
- ⚡ **Independent Chat Panel** - New sessions open directly in editor panel; no more sidebar UI flickering or lost session titles
- 🔧 **Streaming Performance** - 100ms RAF debounce prevents character-by-character rendering, giving smooth text flow
- 📋 **Improved History Panel** - Enhanced color contrast, card hover shadows, Delete button with confirmation dialog
- 🧹 **Code Cleanup** - Removed sidebar-specific logic from chat panel; sidebar now uses dedicated `sidebar.ts` webview

---

## Introduction

Mao's Thought Guidance is a VS Code extension that uses Mao's Selected Works core principles as its foundation. Whether you face career dilemmas, startup decisions, relationship challenges, or life direction questions, it guides you through layered analysis with concise, sharp insights.

---

## Ten Core Principles

| # | Principle | Meaning |
|---|-----------|---------|
| 1 | Know the situation | Distinguish friend from foe |
| 2 | No investigation, no right to speak | Facts first, no empty talk |
| 3 | Grasp the principal contradiction | Find the key leverage point |
| 4 | Strategy + tactics combined | Bold direction, solid execution |
| 5 | Mass line | Align goals with everyone's interests |
| 6 | Guerrilla tactics | Avoid strength, strike weakness |
| 7 | Learn through practice | Act and reflect, unite knowing and doing |
| 8 | Seek truth from facts | Start from actual conditions |
| 9 | United front | Unite the many, isolate the few |
| 10 | Self-renewal | Constant reflection and growth |

---

## Features

### Intelligent Conversation
- Six-phase progressive questioning: Understanding → Contradiction → Conditions → Strategy → Tactics → Reflection
- Multi-turn dialogue, going deeper without rushing to conclusions
- Concise, powerful replies that hit the core

### Intuitive Sidebar Navigation
- **Status Bar**: Extension name + current style mode + API readiness indicator
- **Quick Actions**: New Chat | History | Settings (3 buttons)
- **Welcome Guide**: Problem statement and step-by-step usage instructions
- **Independent Editor Panels**: Each chat session opens in its own panel for clarity

### Theme-adaptive UI
- Clean design that follows VS Code system theme (dark/light)
- All input fields include subtle shadows (`0 1px 3px rgba(0,0,0,0.08)`)
- Activity bar sidebar with streamlined navigation
- Settings & History panels automatically styled

### Three Style Modes
- **Mao Originalist** - Focus on Mao's classic texts
- **Ye Zinong / Ding Yuanying** - Focus on methodology and logic  
- **Balanced Fusion** - Best of both (recommended)

### Flexible Configuration
- Default support for **DeepSeek** API, compatible with all OpenAI-format APIs
- Optional web search (SerpAPI / Bing / AnySearch)
- Configurable temperature, max tokens, and model selection

### Report Export
- One-click export of analysis reports as **Markdown**

### History Management
- Auto-saves all conversations with timestamps
- View, search, and delete history records with smooth UI
- Phase tracking for each conversation

---

## Quick Start

### 1. Install
```bash
code --install-extension ChairmanMao-guide-life-0.2.1.vsix
```

### 2. Configure API
1. Look for "Mao's Thought" in the VS Code Activity Bar (sidebar)
2. Click the ⚙ **Settings** button
3. Fill in your API Key from [platform.deepseek.com](https://platform.deepseek.com)
4. Click **Save Settings** and you're ready to start

### 3. Start Chatting
1. Click **+ New Chat** in the sidebar
2. Enter your situation/problem (this becomes the chat title)
3. Press Enter and describe your situation in detail
4. The AI will guide you through six analytical phases

---

## Configuration

| Key | Description | Default |
|-----|-------------|---------|
| API Base URL | API endpoint | https://api.deepseek.com |
| API Key | Authentication token | - |
| Model | Model name | deepseek-chat |
| Temperature | Creativity (0-2) | 0.7 |
| Max Tokens | Response length | 4096 |
| Style | Analysis mode | balanced |
| Web Search | Enable web queries | disabled |

---

## Development

```bash
git clone https://github.com/Gsaecy/chairmanmao-guide-life.git
cd extension
npm install
npm run compile
npm run package
```

---

## Support

- 📖 [GitHub Issues](https://github.com/Gsaecy/chairmanmao-guide-life/issues)
- 💬 Feedback welcomed

---

## License

MIT

---

## Changelog

### v0.2.1
- Fixed icon display: added `img-src` CSP policies
- Sidebar usage guide moved to bottom fixed area
- History "View Chat" button now loads sessions via new `loadSession` command
- Updated GitHub repo URL to lowercase

### v0.1.9
- Style binding: select style (Mao/Ye/Balanced) when creating session, persists per session
- Sidebar close button: return to welcome page with one click
- History buttons: text buttons replacing icons for consistency
- Welcome page: custom image support (media/welcome-icon.png)

### v0.1.8
- Auto-focus input box after creating new session, display session title in header
- All dialogs follow VS Code theme colors (editorWidget variables)
- Enter key submits session title
- Click backdrop to close dialogs

### v0.1.7
- Fix streaming output character-by-character jitter (RAF debounce + data-is-stream selector fix)
- Sidebar now shows usage guide, input hidden
- Simplify filterGarbled to prevent content loss during streaming
- Fix history page phase name mapping for all 7 phases
- Fix history page message count display

### v0.1.6
- Fix ServiceWorker load error: CSS extraction via MiniCssExtractPlugin

### v0.1.5
- New layout: responsive message area, auto phase labeling
- English description to fix encoding issues
- Sidebar phase navigation removed

### v0.1.4
- Input box enlarged, vertical resize supported
- Full VS Code theme adaptation
- History page: View Conversation button, Clear Record button
- Fixed missing panel icon and streaming output issues

### v0.1.3
- New Apple-style clean UI
- Sidebar shows guidance content

---

## License

MIT License (c) 2025 Gsaecy
