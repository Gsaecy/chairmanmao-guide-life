/**
 * 历史记录面板 Webview 入口
 */
import './globals.css';

(function () {
  const vscode = acquireVsCodeApi();

  const app = document.getElementById('root')!;
  renderApp();

  function renderApp() {
    app.innerHTML = `
      <div class="p-4 max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-4 border-b border-red-200 pb-2">
          <h1 class="text-lg font-bold text-red-800">📋 历史对话记录</h1>
          <button id="btnRefresh" class="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
            刷新
          </button>
        </div>
        <div id="sessionsList" class="space-y-2">
          <p class="text-sm text-gray-400 text-center py-8">加载中...</p>
        </div>
      </div>
    `;

    document.getElementById('btnRefresh')?.addEventListener('click', () => {
      vscode.postMessage({ command: 'refresh' });
    });
  }

  function renderSessions(sessions: any[]) {
    const container = document.getElementById('sessionsList');
    if (!container) return;

    if (!sessions || sessions.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-3xl mb-2">📭</div>
          <p class="text-sm text-gray-400">暂无历史对话</p>
          <p class="text-xs text-gray-300 mt-1">开始一个新的对话吧</p>
        </div>
      `;
      return;
    }

    container.innerHTML = sessions
      .map(
        (session) => `
      <div class="bg-white border border-red-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer session-card"
           data-session-id="${escapeHtml(session.id)}">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-sm font-bold text-red-800 mb-1">${escapeHtml(session.title || '未命名对话')}</h3>
            <p class="text-xs text-gray-500">
              创建：${escapeHtml(formatDate(session.createdAt))} 
              ${session.updatedAt ? `· 更新：${escapeHtml(formatDate(session.updatedAt))}` : ''}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              阶段：${escapeHtml(getPhaseName(session.currentPhase))} · ${session.messages?.length || 0} 条消息
            </p>
          </div>
          <button class="delete-btn text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                  data-session-id="${escapeHtml(session.id)}"
                  title="删除">
            ✕
          </button>
        </div>
      </div>
    `
      )
      .join('');

    // 绑定点击事件
    container.querySelectorAll('.session-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        // 如果点击了删除按钮，不触导航
        if (target.classList.contains('delete-btn')) return;
        
        const sessionId = card.getAttribute('data-session-id');
        if (sessionId) {
          vscode.postMessage({ command: 'selectSession', payload: { sessionId } });
        }
      });
    });

    container.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sessionId = (btn as HTMLElement).getAttribute('data-session-id');
        if (sessionId && confirm('确定要删除这个对话吗？此操作不可恢复。')) {
          vscode.postMessage({ command: 'deleteSession', payload: { sessionId } });
        }
      });
    });
  }

  function formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}`;
  }

  function getPhaseName(phase: string): string {
    const map: Record<string, string> = {
      understanding: '全面了解',
      contradiction: '主要矛盾',
      strategy: '战略战术',
      practice: '实践指导',
      summary: '总结报告',
    };
    return map[phase] || phase;
  }

  function escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // ------------ Message Handling ------------
  window.addEventListener('message', (event) => {
    const message = event.data;

    switch (message.command) {
      case 'loadHistory':
        renderSessions(message.payload);
        break;
    }
  });
})();