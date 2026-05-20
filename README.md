# Mao's Thought Guidance

**AI guidance powered by Mao's Selected Works - analyze problems with pragmatic, clear-headed methodology.**

| VS Code | Version | License |
|---------|---------|--------|
| >=1.85.0 | 0.1.7 | MIT |

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
- Six-phase progressive questioning: Understanding -> Contradiction -> Conditions -> Strategy -> Tactics -> Reflection
- Multi-turn dialogue, going deeper without rushing to conclusions
- Concise, powerful replies that hit the core

### Theme-adaptive UI
- Clean design that follows VS Code system theme (dark/light)
- Activity bar sidebar + independent editor panel
- Sidebar shows usage guide by default

### Three Style Modes
- **Mao Originalist** - Focus on Mao's classic texts
- **Ye Zinong / Ding Yuanying** - Focus on methodology and logic
- **Balanced Fusion** - Best of both

### Flexible Configuration
- Default support for **DeepSeek** API, compatible with all OpenAI-format APIs
- Optional web search (SerpAPI / Bing / AnySearch)

### Report Export
- One-click export of analysis reports as **Markdown**

### History Management
- Auto-saves all conversations, view and delete history records

---

## Quick Start

### 1. Install
```bash
code --install-extension ChairmanMao-guide-life-0.1.7.vsix
```

### 2. Configure API
1. Click gear icon in chat panel to open Settings
2. Fill in: API Key from [platform.deepseek.com](https://platform.deepseek.com)
3. Save and start chatting

---

## Configuration

| Key | Description | Default |
|-----|-------------|---------|
| maoxuan.apiKey | API Key | - |
| maoxuan.apiBaseUrl | API Base URL | https://api.deepseek.com |
| maoxuan.model | Model name | deepseek-chat |
| maoxuan.temperature | Temperature (0-2) | 0.7 |
| maoxuan.maxTokens | Max output tokens | 4096 |
| maoxuan.style | Style (maoxuan/yedinying/balanced) | balanced |
| maoxuan.searchEngine | Search engine | serpapi |

---

## Development

```bash
git clone https://github.com/Gsaecy/ChairmanMao-guide-life.git
cd ChairmanMao-guide-life
npm install
npm run vscode:prepublish
npm run package
```

---

## Changelog

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
