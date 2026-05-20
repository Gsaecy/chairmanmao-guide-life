/**
 * 对话面板 Webview 入口 - Apple 风格简洁界面
 */
import './globals.css';

(function () {
  const vscode = acquireVsCodeApi();
  let streamingBuffer = '';
  let isStreaming = false;
  let currentPhase = 'understanding';
  let sessionLoaded = false;
  let isSidebar = false; // 是否侧边栏模式

  // 流式渲染防抖
  let rafPending = false;
  let rafId: number | null = null;

  function scheduleStreamRender() {
    if (rafPending) return;
    rafPending = true;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafPending = false;
      rafId = null;
      const bubble = document.querySelector('[data-is-stream="true"]') as HTMLElement;
      if (!bubble) return;
      const clean = filterGarbled(streamingBuffer);
      bubble.innerHTML = formatContent(clean);
      const container = getEl('messagesContainer')!;
      container.scrollTop = container.scrollHeight;
    });
  }

  const app = document.getElementById('root')!;
  renderApp();

  function renderApp() {
    app.innerHTML = `
      <div class="flex flex-col h-screen bg-[var(--vscode-editor-background)] font-sans" style="color: var(--vscode-editor-foreground);">
        <!-- Header -->
        <header class="bg-[var(--vscode-sideBar-background)]/80 border-b border-[var(--vscode-sideBar-border)] px-5 py-3 flex items-center justify-between flex-shrink-0" style="backdrop-filter: blur(20px);">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[var(--vscode-button-background)] flex items-center justify-center text-[var(--vscode-button-foreground)] text-sm font-bold">★</div>
            <div>
              <h1 class="text-sm font-semibold leading-tight" style="color: var(--vscode-editor-foreground);">毛选思想指导</h1>
              <p id="phaseLabel" class="text-[11px] leading-tight" style="color: var(--vscode-descriptionForeground);">第一阶段 · 全面了解</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button id="btnHistory" class="text-xs px-2.5 py-1.5 rounded-full transition-colors" style="color: var(--vscode-descriptionForeground);" title="对话历史">
              <span class="text-[11px]">📋 历史</span>
            </button>
            <button id="btnSettings" class="text-xs px-2.5 py-1.5 rounded-full transition-colors" style="color: var(--vscode-descriptionForeground);" title="设置">
              <span class="text-[11px]">⚙ 设置</span>
            </button>
            <button id="btnNewSession" class="text-xs bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] text-[var(--vscode-button-foreground)] px-3 py-1.5 rounded-full font-medium transition-colors">
              ＋ 新对话
            </button>
          </div>
        </header>

        <!-- Principles Strip -->
        <div class="bg-[var(--vscode-sideBar-background)] border-b border-[var(--vscode-sideBar-border)] px-4 py-2 overflow-x-auto flex-shrink-0">
          <div class="flex gap-2 text-[11px] whitespace-nowrap items-center" style="color: var(--vscode-descriptionForeground);">
            <span class="font-semibold" style="color: var(--vscode-editor-foreground);">核心原则</span>
            <span style="color: var(--vscode-input-border);">|</span>
            <span>认清形势</span><span style="color: var(--vscode-input-border);">·</span>
            <span>调查研究</span><span style="color: var(--vscode-input-border);">·</span>
            <span>主要矛盾</span><span style="color: var(--vscode-input-border);">·</span>
            <span>战略战术</span><span style="color: var(--vscode-input-border);">·</span>
            <span>群众路线</span><span style="color: var(--vscode-input-border);">·</span>
            <span>游击战术</span><span style="color: var(--vscode-input-border);">·</span>
            <span>知行合一</span><span style="color: var(--vscode-input-border);">·</span>
            <span>实事求是</span><span style="color: var(--vscode-input-border);">·</span>
            <span>统一战线</span><span style="color: var(--vscode-input-border);">·</span>
            <span>自我革新</span>
          </div>
        </div>

        <!-- Messages -->
        <div id="messagesContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-4" style="background: var(--vscode-editor-background);">
          <div id="placeholderMsg" class="text-center py-20">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style="background: var(--vscode-sideBar-background); box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <span class="text-2xl">★</span>
            </div>
            <p class="text-base font-semibold mb-1" style="color: var(--vscode-editor-foreground);">没有调查，就没有发言权</p>
            <p class="text-sm max-w-xs mx-auto" style="color: var(--vscode-descriptionForeground);">告诉我你面临的问题，让我们一起用实事求是的方法来分析</p>
          </div>
          <div id="loadingIndicator" class="hidden flex justify-start">
            <div class="border px-4 py-3 text-sm rounded-lg" style="background: var(--vscode-sideBar-background); border-color: var(--vscode-sideBar-border); color: var(--vscode-descriptionForeground);">
              <span class="inline-flex items-center gap-2">
                <span class="w-2 h-2 rounded-full animate-pulse" style="background: var(--vscode-button-background);"></span>
                正在思考...
              </span>
            </div>
          </div>
        </div>

        <!-- Phase Navigation -->
        <div class="border-t px-4 py-2 flex items-center justify-between flex-shrink-0" style="background: var(--vscode-sideBar-background); border-color: var(--vscode-sideBar-border);">
          <div class="flex items-center gap-2 text-xs" style="color: var(--vscode-descriptionForeground);">
            <span class="font-medium" style="color: var(--vscode-editor-foreground);">对话阶段</span>
            <span id="phaseIndicator" class="px-2.5 py-1 rounded-full text-[11px] font-medium" style="background: var(--vscode-button-background); color: var(--vscode-button-foreground);">
              全面了解
            </span>
          </div>
          <button id="btnAdvance" class="text-xs px-3 py-1 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium" style="background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground);">
            推进阶段 →
          </button>
        </div>

        <!-- Input Area (非侧边栏模式) -->
        <div id="inputArea" class="bg-[var(--vscode-sideBar-background)] border-t border-[var(--vscode-sideBar-border)] px-4 py-3 flex-shrink-0">
          <div class="flex gap-2 items-end">
            <textarea id="inputBox" 
              class="flex-1 resize-y border border-[var(--vscode-input-border)] rounded-lg px-4 py-3 text-sm bg-[var(--vscode-input-background)] text-[var(--vscode-input-foreground)] focus:outline-none focus:border-[var(--vscode-focusBorder)] focus:ring-1 focus:ring-[var(--vscode-focusBorder)] transition-colors placeholder:text-[var(--vscode-input-placeholderForeground)]"
              rows="5" 
              placeholder="同志，请说说你面临的具体情况..."
            ></textarea>
            <div class="flex flex-col gap-1.5 flex-shrink-0">
              <button id="btnSend" class="bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] text-[var(--vscode-button-foreground)] px-5 py-3 rounded-lg text-sm font-semibold transition-colors">
                发送
              </button>
              <button id="btnAbort" class="hidden bg-[var(--vscode-button-secondaryBackground)] hover:bg-[var(--vscode-button-secondaryHoverBackground)] text-[var(--vscode-button-secondaryForeground)] px-5 py-3 rounded-lg text-xs font-medium transition-colors" title="停止生成">
                停止
              </button>
              <button id="btnExport" class="bg-[var(--vscode-button-secondaryBackground)] hover:bg-[var(--vscode-button-secondaryHoverBackground)] text-[var(--vscode-button-secondaryForeground)] px-5 py-3 rounded-lg text-xs font-medium transition-colors" title="导出报告">
                导出
              </button>
            </div>
          </div>
          <p class="text-[10px] text-[var(--vscode-descriptionForeground)] mt-1.5">Enter 发送 · Shift+Enter 换行</p>
        </div>

        <!-- 使用说明 (侧边栏模式) -->
        <div id="usageArea" class="hidden border-t px-4 py-3 flex-shrink-0" style="background: var(--vscode-sideBar-background); border-color: var(--vscode-sideBar-border);">
          <div class="text-xs space-y-2" style="color: var(--vscode-descriptionForeground);">
            <p class="font-semibold text-sm mb-2" style="color: var(--vscode-editor-foreground);">📖 使用方法</p>
            <div class="flex items-start gap-2">
              <span class="font-bold flex-shrink-0" style="color: var(--vscode-button-background);">1.</span>
              <span>点击上方 <span class="px-2 py-0.5 rounded text-[10px] font-medium" style="background: var(--vscode-button-background); color: var(--vscode-button-foreground);">＋ 新对话</span> 开始新会话</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-bold flex-shrink-0" style="color: var(--vscode-button-background);">2.</span>
              <span>在打开的编辑面板中描述你的问题，AI 会按照六阶段法引导分析</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-bold flex-shrink-0" style="color: var(--vscode-button-background);">3.</span>
              <span>每个阶段完成后可手动推进到下一阶段，也可自动推进</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-bold flex-shrink-0" style="color: var(--vscode-button-background);">4.</span>
              <span>完成后可导出 <span class="px-1 rounded text-[10px]" style="background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground);">对话总结报告</span></span>
            </div>
            <div class="border-t pt-2 mt-2" style="border-color: var(--vscode-sideBar-border);">
              <p class="text-[11px] italic" style="color: var(--vscode-descriptionForeground);">"没有调查，就没有发言权" —— 毛泽东</p>
            </div>
          </div>
        </div>
      </div>
    `;
    bindEvents();
    toggleSidebarMode(); // 确保初始状态正确
  }

  function toggleSidebarMode() {
    const inputArea = getEl('inputArea');
    const usageArea = getEl('usageArea');
    if (!inputArea || !usageArea) return;
    if (isSidebar) {
      inputArea.classList.add('hidden');
      usageArea.classList.remove('hidden');
    } else {
      inputArea.classList.remove('hidden');
      usageArea.classList.add('hidden');
    }
  }

  function bindEvents() {
    setEl('btnSend', 'click', handleSend);
    setEl('btnAbort', 'click', handleAbort);
    setEl('btnNewSession', 'click', promptNewSession);
    setEl('btnSettings', 'click', () => vscode.postMessage({ command: 'openSettings' }));
    setEl('btnHistory', 'click', () => vscode.postMessage({ command: 'openHistory' }));
    setEl('btnAdvance', 'click', () => vscode.postMessage({ command: 'advancePhase' }));
    setEl('btnExport', 'click', () => vscode.postMessage({ command: 'exportReport' }));
    
    const inputBox = getEl('inputBox') as HTMLTextAreaElement;
    inputBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  function setEl(id: string, event: string, handler: () => void) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
  }

  function getEl(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  function handleSend() {
    if (isStreaming) return;
    const inputBox = getEl('inputBox') as HTMLTextAreaElement;
    const content = inputBox.value.trim();
    if (!content) return;

    if (!sessionLoaded) {
      const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
      vscode.postMessage({ command: 'createSession', payload: { title } });
      sessionLoaded = true;
    }

    addMessage('user', content);
    inputBox.value = '';
    
    vscode.postMessage({ command: 'sendMessage', payload: { content } });
  }

  function handleAbort() {
    vscode.postMessage({ command: 'abort' });
    stopStreaming();
  }

  function addMessage(role: 'user' | 'assistant', content: string) {
    const container = getEl('messagesContainer')!;
    
    const placeholder = getEl('placeholderMsg');
    if (placeholder) placeholder.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' ? 'flex justify-end' : 'flex justify-start';
    
    const bubbleClass = role === 'user'
      ? 'rounded-2xl rounded-br-lg px-4 py-2.5 max-w-[80%] text-sm leading-relaxed'
      : 'border rounded-2xl rounded-bl-lg px-4 py-2.5 max-w-[80%] text-sm leading-relaxed';
    
    const bubbleStyle = role === 'user'
      ? `background: var(--vscode-button-background); color: var(--vscode-button-foreground);`
      : `background: var(--vscode-sideBar-background); border-color: var(--vscode-sideBar-border); color: var(--vscode-editor-foreground);`;
    
    msgDiv.innerHTML = `<div class="${bubbleClass}" style="${bubbleStyle}">${formatContent(content)}</div>`;
    
    const loading = getEl('loadingIndicator');
    if (loading) {
      container.insertBefore(msgDiv, loading);
    } else {
      container.appendChild(msgDiv);
    }
    container.scrollTop = container.scrollHeight;
    return msgDiv;
  }

  function getOrCreateStreamBubble(): HTMLElement {
    const container = getEl('messagesContainer')!;
    const bubbles = container.querySelectorAll('.flex.justify-start .bg-white');
    const lastBubble = bubbles[bubbles.length - 1];
    if (lastBubble && lastBubble.getAttribute('data-is-stream') === 'true') {
      return lastBubble as HTMLElement;
    }
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex justify-start';
    const bubble = document.createElement('div');
    bubble.className = 'border rounded-2xl rounded-bl-lg px-4 py-2.5 max-w-[80%] text-sm leading-relaxed';
    bubble.style.cssText = 'background: var(--vscode-sideBar-background); border-color: var(--vscode-sideBar-border); color: var(--vscode-editor-foreground);';
    bubble.setAttribute('data-is-stream', 'true');
    msgDiv.appendChild(bubble);
    
    const loading = getEl('loadingIndicator');
    if (loading) {
      container.insertBefore(msgDiv, loading);
    } else {
      container.appendChild(msgDiv);
    }
    return bubble;
  }

  function formatContent(text: string): string {
    // 渲染 Markdown 基本格式
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm text-brand-700">$1</code>')
      .replace(/\n/g, '<br>');
  }

  function startStreaming() {
    isStreaming = true;
    streamingBuffer = '';
    const btnSend = getEl('btnSend') as HTMLButtonElement;
    const btnAbort = getEl('btnAbort');
    if (btnSend) btnSend.disabled = true;
    if (btnAbort) btnAbort.classList.remove('hidden');
    
    const loading = getEl('loadingIndicator');
    if (loading) loading.classList.remove('hidden');
    const placeholder = getEl('placeholderMsg');
    if (placeholder) placeholder.remove();
  }

  // 过滤流式输出中可能泄漏的思考标记和乱码字符
  function filterGarbled(text: string): string {
    return text
      // 去除 DeepSeek R1 思考链标记
      .replace(/<\|begin_of_thought\|>[\s\S]*?<\|end_of_thought\|>/g, '')
      .replace(/<\|begin_of_thought\|>[\s\S]*/g, '')
      .replace(/思考过程[：:][\s\S]*?(?=\n[^思考])/g, '')
      // 去除反思标记
      .replace(/<\|reflection\|>[\s\S]*?<\|reflection_end\|>/g, '')
      // 去除多余的思考前缀
      .replace(/^(嗯|好|让|我来|首先[，,])[\s\S]{0,50}(?=(\n|$))/g, '')
      // 清理连续空行
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function stopStreaming() {
    isStreaming = false;
    streamingBuffer = '';
    const btnSend = getEl('btnSend') as HTMLButtonElement;
    const btnAbort = getEl('btnAbort');
    if (btnSend) btnSend.disabled = false;
    if (btnAbort) btnAbort.classList.add('hidden');
    
    const loading = getEl('loadingIndicator');
    if (loading) loading?.classList.add('hidden');
    
    const streamBubble = document.querySelector('[data-is-stream="true"]');
    if (streamBubble) {
      streamBubble.removeAttribute('data-is-stream');
    }
  }

  function updatePhase(phase: string, label: string) {
    currentPhase = phase;
    const phaseLabel = getEl('phaseLabel');
    const phaseIndicator = getEl('phaseIndicator');
    if (phaseLabel) phaseLabel.textContent = label;
    if (phaseIndicator) phaseIndicator.textContent = label.split('·')[1]?.trim() || label;
  }

  // ------------ Message Handling ------------
  window.addEventListener('message', (event) => {
    const message = event.data;
    
    switch (message.command) {
      case 'promptNewSession':
        showNewSessionDialog();
        break;

      case 'sessionCreated':
        sessionLoaded = true;
        vscode.setState({ sessionId: message.payload.id });
        break;

      case 'loadSession':
        sessionLoaded = true;
        vscode.setState({ sessionId: message.payload.id });
        currentPhase = message.payload.currentPhase;
        updatePhase(currentPhase, '');
        renderHistoryMessages(message.payload.messages);
        break;

      case 'showWelcome':
        // 侧边栏模式 —— 处理 ChatViewProvider 发送的欢迎信息
        isSidebar = true;
        toggleSidebarMode();
        {
          const placeholder = getEl('placeholderMsg');
          if (placeholder) {
            const phases = message.payload.phases || [];
            const phaseItems = phases.map((p: any) => 
              `<span class="inline-flex items-center gap-1 text-xs text-gray-500"><span>${p.icon}</span>${p.name}</span>`
            ).join('<span class="text-gray-300">→</span>');
            placeholder.innerHTML = `
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-apple mb-4">
                <span class="text-2xl">★</span>
              </div>
              <p class="text-base font-semibold text-gray-800 mb-1">${message.payload.title}</p>
              <p class="text-sm text-gray-400 max-w-xs mx-auto mb-4">${message.payload.subtitle}</p>
              <div class="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">${phaseItems}</div>
            `;
          }
        }
        break;

      case 'streamStart':
        startStreaming();
        break;

      case 'assistantMessage': {
        const { text, done } = message.payload;
        if (!text) break;
        if (!done) {
          getOrCreateStreamBubble();
          streamingBuffer += text;
          scheduleStreamRender();
        } else {
          stopStreaming();
          const streamBubble = document.querySelector('[data-is-stream="true"]');
          if (streamBubble) {
            streamBubble.removeAttribute('data-is-stream');
            // done 时强制立即渲染最终内容
            const clean = filterGarbled(streamingBuffer || text);
            streamBubble.innerHTML = formatContent(clean);
          }
          streamingBuffer = '';
        }
        const container = getEl('messagesContainer')!;
        container.scrollTop = container.scrollHeight;
        break;
      }

      case 'streamEnd':
        stopStreaming();
        break;

      case 'phaseChange':
        updatePhase(message.payload.phase, message.payload.label);
        break;

      case 'reportReady':
        showReportDialog(message.payload);
        break;

      case 'error':
        stopStreaming();
        showError(message.payload);
        break;
    }
  });

  function showNewSessionDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50';
    overlay.innerHTML = `
      <div class="bg-white rounded-2xl shadow-apple-lg w-[400px] p-6 animate-in fade-in zoom-in">
        <h3 class="text-base font-semibold text-gray-900 mb-4">新建对话</h3>
        <label class="block text-sm text-gray-600 mb-1">对话标题</label>
        <input id="newTitleInput" type="text" class="w-full border border-gray-200 rounded-apple px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 mb-4" placeholder="输入对话标题..." />
        <div class="flex justify-end gap-2">
          <button id="cancelNewSession" class="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-apple transition-colors">取消</button>
          <button id="confirmNewSession" class="px-4 py-2 text-sm bg-brand-600 text-white hover:bg-brand-700 rounded-apple font-medium transition-colors">开始对话</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#newTitleInput') as HTMLInputElement;
    input.focus();
    
    overlay.querySelector('#cancelNewSession')?.addEventListener('click', () => overlay.remove());
    overlay.querySelector('#confirmNewSession')?.addEventListener('click', () => {
      const title = input.value.trim();
      if (title) {
        sessionLoaded = false;
        const container = getEl('messagesContainer')!;
        container.innerHTML = `
          <div id="placeholderMsg" class="text-center py-20">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-apple mb-4">
              <span class="text-2xl">★</span>
            </div>
            <p class="text-base font-semibold text-gray-800 mb-1">没有调查，就没有发言权</p>
            <p class="text-sm text-gray-400 max-w-xs mx-auto">告诉我你面临的问题，让我们一起用实事求是的方法来分析</p>
          </div>
          <div id="loadingIndicator" class="hidden flex justify-start">
            <div class="bg-white border border-gray-200 rounded-apple px-4 py-3 text-sm text-gray-500 shadow-sm">
              <span class="inline-flex items-center gap-2">
                <span class="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
                正在思考...
              </span>
            </div>
          </div>
        `;
        updatePhase('understanding', '第一阶段 · 全面了解');
        vscode.postMessage({ command: 'createSession', payload: { title } });
        overlay.remove();
      }
    });
  }

  function showReportDialog(report: string) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50';
    overlay.innerHTML = `
      <div class="bg-white rounded-2xl shadow-apple-lg w-[85%] max-h-[80%] flex flex-col">
        <div class="px-5 py-3 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
          <span class="font-semibold text-gray-900">对话总结报告</span>
          <button class="text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors" id="closeReport">×</button>
        </div>
        <div class="p-5 overflow-y-auto flex-1 text-sm whitespace-pre-wrap leading-relaxed" style="max-height:55vh;">${formatContent(report)}</div>
        <div class="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button id="copyReport" class="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-apple text-sm font-medium transition-colors">复制</button>
          <button id="dismissReport" class="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-apple text-sm transition-colors">关闭</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('closeReport')?.addEventListener('click', () => overlay.remove());
    document.getElementById('dismissReport')?.addEventListener('click', () => overlay.remove());
    document.getElementById('copyReport')?.addEventListener('click', () => {
      navigator.clipboard.writeText(report);
    });
  }

  function showError(message: string) {
    const container = getEl('messagesContainer')!;
    const placeholder = getEl('placeholderMsg');
    if (placeholder) placeholder.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'flex justify-center';
    errorDiv.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 rounded-apple px-4 py-2.5 text-sm">⚠ ${message}</div>`;
    container.appendChild(errorDiv);
    container.scrollTop = container.scrollHeight;
  }

  function renderHistoryMessages(messages: any[]) {
    const container = getEl('messagesContainer')!;
    container.innerHTML = `<div id="loadingIndicator" class="hidden flex justify-start">
      <div class="bg-white border border-gray-200 rounded-apple px-4 py-3 text-sm text-gray-500 shadow-sm">
        <span class="inline-flex items-center gap-2">
          <span class="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
          正在思考...
        </span>
      </div>
    </div>`;
    
    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        addMessage(msg.role, msg.content);
      }
    }
  }

  function promptNewSession() {
    showNewSessionDialog();
  }
})();