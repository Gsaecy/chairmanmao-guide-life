/**
 * 对话面板 Webview 入口
 */
import './globals.css';

(function () {
  const vscode = acquireVsCodeApi();
  let streamingBuffer = '';
  let isStreaming = false;
  let currentPhase = 'understanding';
  let sessionLoaded = false;

  // DOM elements
  const app = document.getElementById('root')!;
  renderApp();

  function renderApp() {
    app.innerHTML = `
      <div class="flex flex-col h-screen bg-red-50">
        <!-- Header -->
        <header class="bg-red-800 text-red-50 px-4 py-2 flex items-center justify-between">
          <div>
            <h1 class="text-sm font-bold tracking-wider">★ 毛选思想指导</h1>
            <p id="phaseLabel" class="text-xs text-red-200 mt-0.5">第一阶段 · 全面了解</p>
          </div>
          <div class="flex gap-2">
            <button id="btnHistory" class="text-xs bg-red-700 hover:bg-red-600 px-2 py-1 rounded" title="对话历史">📋</button>
            <button id="btnSettings" class="text-xs bg-red-700 hover:bg-red-600 px-2 py-1 rounded" title="设置">⚙</button>
            <button id="btnNewSession" class="text-xs bg-yellow-600 hover:bg-yellow-500 px-2 py-1 rounded" title="新对话">＋新对话</button>
          </div>
        </header>

        <!-- Principles Strip -->
        <div class="bg-red-100 border-b border-red-200 px-3 py-1.5 overflow-x-auto">
          <div class="flex gap-3 text-xs text-red-900 whitespace-nowrap">
            <span class="font-bold">核心原则：</span>
            <span>①认清形势</span><span>·</span>
            <span>②调查研究</span><span>·</span>
            <span>③主要矛盾</span><span>·</span>
            <span>④战略战术</span><span>·</span>
            <span>⑤群众路线</span><span>·</span>
            <span>⑥游击战术</span><span>·</span>
            <span>⑦知行合一</span><span>·</span>
            <span>⑧实事求是</span><span>·</span>
            <span>⑨统一战线</span><span>·</span>
            <span>⑩自我革新</span>
          </div>
        </div>

        <!-- Messages -->
        <div id="messagesContainer" class="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-red-50 to-yellow-50">
          <div id="placeholderMsg" class="text-center text-red-400 py-16">
            <div class="text-4xl mb-3">★</div>
            <p class="text-sm font-bold">没有调查，就没有发言权</p>
            <p class="text-xs mt-2">告诉我你面临的问题，让我们一起用实事求是的方法来分析</p>
          </div>
          <div id="loadingIndicator" class="hidden flex justify-start">
            <div class="bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
              <span class="animate-pulse">正在思考...</span>
            </div>
          </div>
        </div>

        <!-- Phase Navigation -->
        <div class="bg-white border-t border-red-200 px-3 py-1.5 flex items-center justify-between">
          <div class="flex items-center gap-1 text-xs">
            <span class="text-red-700 font-bold">对话阶段：</span>
            <span id="phaseIndicator" class="bg-red-100 text-red-800 px-2 py-0.5 rounded">
              全面了解
            </span>
          </div>
          <button id="btnAdvance" class="text-xs bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed">
            推进阶段 ▶
          </button>
        </div>

        <!-- Input Area -->
        <div class="bg-white border-t border-red-300 px-3 py-2">
          <div class="flex gap-2">
            <textarea id="inputBox" 
              class="flex-1 resize-none border border-red-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-300"
              rows="2" 
              placeholder="同志，请说说你面临的具体情况..."
            ></textarea>
            <div class="flex flex-col gap-1">
              <button id="btnSend" class="bg-red-700 hover:bg-red-800 text-white px-4 py-1.5 rounded text-sm font-bold" title="发送消息">
                发送
              </button>
              <button id="btnAbort" class="hidden bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded text-xs" title="停止生成">
                停止
              </button>
              <button id="btnExport" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1.5 rounded text-xs" title="导出报告">
                导出
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    bindEvents();
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

    // 如果还没创建会话，先创建
    if (!sessionLoaded) {
      const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
      vscode.postMessage({ command: 'createSession', payload: { title } });
      sessionLoaded = true;
    }

    // 添加用户消息到界面
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
    
    // 移除占位消息
    const placeholder = getEl('placeholderMsg');
    if (placeholder) placeholder.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'}`;
    
    const bubbleClass = role === 'user'
      ? 'bg-red-700 text-white rounded-lg px-4 py-2 max-w-[80%] text-sm shadow'
      : 'bg-white border border-red-200 rounded-lg px-4 py-2 max-w-[80%] text-sm text-gray-800 shadow';
    
    msgDiv.innerHTML = `<div class="${bubbleClass}">${formatContent(content)}</div>`;
    
    // 在 loading 指示器前插入
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
    // 查找最后一个 assistant bubble，如果它的内容是空的流式文本
    const bubbles = container.querySelectorAll('.flex.justify-start .bg-white');
    const lastBubble = bubbles[bubbles.length - 1];
    if (lastBubble && lastBubble.getAttribute('data-is-stream') === 'true') {
      return lastBubble as HTMLElement;
    }
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex justify-start';
    const bubble = document.createElement('div');
    bubble.className = 'bg-white border border-red-200 rounded-lg px-4 py-2 max-w-[80%] text-sm text-gray-800 shadow';
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
    // 简单的 Markdown 渲染
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function startStreaming() {
    isStreaming = true;
    streamingBuffer = '';
    const btnSend = getEl('btnSend') as HTMLButtonElement;
    const btnAbort = getEl('btnAbort');
    if (btnSend) btnSend.disabled = true;
    if (btnAbort) btnAbort.classList.remove('hidden');
    
    // 显示 loading
    const loading = getEl('loadingIndicator');
    if (loading) loading.classList.remove('hidden');
    const placeholder = getEl('placeholderMsg');
    if (placeholder) placeholder.remove();
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
    
    // 标记流式气泡完成
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
        // 重新渲染历史消息
        renderHistoryMessages(message.payload.messages);
        break;

      case 'streamStart':
        startStreaming();
        break;

      case 'assistantMessage':
        {
          const { text, done } = message.payload;
          if (!done) {
            const bubble = getOrCreateStreamBubble();
            streamingBuffer += text;
            bubble.innerHTML = formatContent(streamingBuffer);
          } else {
            stopStreaming();
            const streamBubble = document.querySelector('[data-is-stream="true"]');
            if (streamBubble) {
              streamBubble.removeAttribute('data-is-stream');
              streamBubble.innerHTML = formatContent(message.payload.text);
            }
          }
          const container = getEl('messagesContainer')!;
          container.scrollTop = container.scrollHeight;
        }
        break;

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
    const title = prompt('请为这次对话起一个标题：', '');
    if (title && title.trim()) {
      sessionLoaded = false;
      // 清空消息列表
      const container = getEl('messagesContainer')!;
      container.innerHTML = `
        <div id="placeholderMsg" class="text-center text-red-400 py-16">
          <div class="text-4xl mb-3">★</div>
          <p class="text-sm font-bold">没有调查，就没有发言权</p>
          <p class="text-xs mt-2">告诉我你面临的问题，让我们一起用实事求是的方法来分析</p>
        </div>
        <div id="loadingIndicator" class="hidden flex justify-start">
          <div class="bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
            <span class="animate-pulse">正在思考...</span>
          </div>
        </div>
      `;
      updatePhase('understanding', '第一阶段 · 全面了解');
      vscode.postMessage({ command: 'createSession', payload: { title: title.trim() } });
    }
  }

  function showReportDialog(report: string) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    overlay.innerHTML = `
      <div class="bg-white rounded-lg shadow-2xl w-[80%] max-h-[80%] flex flex-col">
        <div class="bg-red-800 text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
          <span class="font-bold">对话总结报告</span>
          <button class="text-white hover:text-yellow-300 text-xl leading-none" id="closeReport">&times;</button>
        </div>
        <div class="p-4 overflow-y-auto flex-1 text-sm whitespace-pre-wrap" style="max-height:60vh;">${formatContent(report)}</div>
        <div class="p-3 border-t flex justify-end">
          <button id="copyReport" class="bg-red-700 hover:bg-red-800 text-white px-4 py-1.5 rounded text-sm mr-2">复制</button>
          <button id="dismissReport" class="bg-gray-300 hover:bg-gray-400 px-4 py-1.5 rounded text-sm">关闭</button>
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
    errorDiv.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 rounded px-4 py-2 text-sm">⚠ ${message}</div>`;
    container.appendChild(errorDiv);
    container.scrollTop = container.scrollHeight;
  }

  function renderHistoryMessages(messages: any[]) {
    const container = getEl('messagesContainer')!;
    container.innerHTML = `<div id="loadingIndicator" class="hidden flex justify-start">
      <div class="bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
        <span class="animate-pulse">正在思考...</span>
      </div>
    </div>`;
    
    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        addMessage(msg.role, msg.content);
      }
    }
  }

  // "openHistory" message
  function promptNewSession() {
    showNewSessionDialog();
  }
})();