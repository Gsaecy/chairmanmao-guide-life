/**
 * 设置面板 Webview 入口
 */
import './globals.css';

(function () {
  const vscode = acquireVsCodeApi();
  let currentConfig: any = {};

  const app = document.getElementById('root')!;
  renderApp();

  function renderApp() {
    app.innerHTML = `
      <div class="p-4 max-w-lg mx-auto">
        <h1 class="text-lg font-bold text-red-800 mb-4 border-b border-red-200 pb-2">⚙ 毛选思想指导 — 设置</h1>

        <!-- API 设置 -->
        <section class="mb-6">
          <h2 class="text-sm font-bold text-red-700 mb-2">🔑 API 设置</h2>
          
          <label class="block text-xs text-gray-600 mb-1">API 服务地址</label>
          <input id="apiBaseUrl" type="text" class="w-full border border-red-300 rounded px-3 py-1.5 text-sm mb-3 focus:outline-none focus:border-red-500" 
            placeholder="https://api.deepseek.com" />

          <label class="block text-xs text-gray-600 mb-1">API Key</label>
          <input id="apiKey" type="password" class="w-full border border-red-300 rounded px-3 py-1.5 text-sm mb-3 focus:outline-none focus:border-red-500" 
            placeholder="sk-..." />

          <label class="block text-xs text-gray-600 mb-1">模型名称</label>
          <input id="model" type="text" class="w-full border border-red-300 rounded px-3 py-1.5 text-sm mb-4 focus:outline-none focus:border-red-500" 
            placeholder="deepseek-chat" />

          <button id="btnTest" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1.5 rounded text-sm w-full">
            测试连接
          </button>
          <div id="testResult" class="hidden text-xs mt-2 p-2 rounded"></div>
        </section>

        <!-- 对话设置 -->
        <section class="mb-6">
          <h2 class="text-sm font-bold text-red-700 mb-2">💬 对话设置</h2>

          <label class="block text-xs text-gray-600 mb-1">Temperature（0-2，建议 0.7）</label>
          <input id="temperature" type="range" class="w-full mb-3" min="0" max="2" step="0.1" value="0.7" />
          <div class="text-xs text-gray-500 mb-3">
            当前值：<span id="tempValue">0.7</span>
          </div>

          <label class="block text-xs text-gray-600 mb-1">最大 Token 数</label>
          <input id="maxTokens" type="number" class="w-full border border-red-300 rounded px-3 py-1.5 text-sm mb-4 focus:outline-none focus:border-red-500" 
            placeholder="4096" />
        </section>

        <!-- 风格偏好 -->
        <section class="mb-6">
          <h2 class="text-sm font-bold text-red-700 mb-2">🎨 风格偏好</h2>
          <select id="style" class="w-full border border-red-300 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none focus:border-red-500">
            <option value="balanced">平衡融合（推荐）</option>
            <option value="maoxuan">偏重毛选原教旨主义</option>
            <option value="yedinying">偏重叶子农/丁元英方法论</option>
          </select>
          <p id="styleDesc" class="text-xs text-gray-500 mb-3">
            自然地融合毛选思想与叶子农/丁元英方法论。在分析矛盾格局时多用毛选框架；在分析个人条件时多用"见路不走"框架。
          </p>
        </section>

        <!-- 联网搜索设置 -->
        <section class="mb-6">
          <h2 class="text-sm font-bold text-red-700 mb-2">🌐 联网搜索（可选）</h2>

          <label class="flex items-center gap-2 mb-3">
            <input id="webSearchEnabled" type="checkbox" class="rounded" />
            <span class="text-xs text-gray-600">启用联网搜索功能</span>
          </label>

          <div id="searchSettings" class="hidden">
            <label class="block text-xs text-gray-600 mb-1">搜索引擎（可自定义输入）</label>
            <input id="searchEngine" type="text" class="w-full border border-red-300 rounded px-3 py-1.5 text-sm mb-3 focus:outline-none focus:border-red-500" 
              placeholder="serpapi / bing / anysearch / 自定义..." list="searchEngineList" />
            <datalist id="searchEngineList">
              <option value="serpapi">
              <option value="bing">
              <option value="anysearch">
            </datalist>

            <label class="block text-xs text-gray-600 mb-1">搜索 API Key</label>
            <input id="searchApiKey" type="password" class="w-full border border-red-300 rounded px-3 py-1.5 text-sm mb-4 focus:outline-none focus:border-red-500" 
              placeholder="搜索 API Key" />
          </div>
        </section>

        <!-- 存储设置 -->
        <section class="mb-6">
          <h2 class="text-sm font-bold text-red-700 mb-2">📁 存储路径（可选）</h2>
          <input id="storagePath" type="text" class="w-full border border-red-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-500" 
            placeholder="留空使用默认路径" />
        </section>

        <!-- 操作按钮 -->
        <div class="flex gap-3 pt-4 border-t border-red-200">
          <button id="btnSave" class="flex-1 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-sm font-bold">
            保存设置
          </button>
          <button id="btnReset" class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm">
            恢复默认
          </button>
        </div>
      </div>
    `;
    bindEvents();
  }

  function bindEvents() {
    setEl('btnSave', 'click', handleSave);
    setEl('btnReset', 'click', handleReset);
    setEl('btnTest', 'click', handleTest);
    setEl('temperature', 'input', handleTempChange);
    setEl('webSearchEnabled', 'change', handleSearchToggle);
    setEl('style', 'change', handleStyleChange);
  }

  function setEl(id: string, event: string, handler: (e?: any) => void) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
  }

  function getEl(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  function getVal(id: string): string {
    return (getEl(id) as HTMLInputElement | HTMLSelectElement)?.value || '';
  }

  function setVal(id: string, value: string) {
    const el = getEl(id) as HTMLInputElement | HTMLSelectElement;
    if (el) el.value = value;
  }

  function getChecked(id: string): boolean {
    return (getEl(id) as HTMLInputElement)?.checked || false;
  }

  function setChecked(id: string, value: boolean) {
    const el = getEl(id) as HTMLInputElement;
    if (el) el.checked = value;
  }

  function loadConfig(config: any) {
    currentConfig = { ...config };
    setVal('apiBaseUrl', config.apiBaseUrl || 'https://api.deepseek.com');
    setVal('apiKey', config.apiKey || '');
    setVal('model', config.model || 'deepseek-chat');
    setVal('maxTokens', String(config.maxTokens || 4096));
    setVal('temperature', String(config.temperature || 0.7));
    setVal('style', config.style || 'balanced');
    setVal('storagePath', config.storagePath || '');
    setChecked('webSearchEnabled', config.webSearchEnabled || false);
    setVal('searchEngine', config.searchEngine || 'serpapi');
    setVal('searchApiKey', config.searchApiKey || '');
    
    (getEl('tempValue') as HTMLElement).textContent = String(config.temperature || 0.7);
    updateStyleDesc(config.style || 'balanced');
    toggleSearchSettings(config.webSearchEnabled);
  }

  function collectConfig(): any {
    return {
      apiBaseUrl: getVal('apiBaseUrl'),
      apiKey: getVal('apiKey'),
      model: getVal('model'),
      temperature: parseFloat(getVal('temperature')),
      maxTokens: parseInt(getVal('maxTokens'), 10),
      style: getVal('style'),
      storagePath: getVal('storagePath'),
      webSearchEnabled: getChecked('webSearchEnabled'),
      searchEngine: getVal('searchEngine'),
      searchApiKey: getVal('searchApiKey'),
    };
  }

  function handleSave() {
    const config = collectConfig();
    vscode.postMessage({ command: 'saveConfig', payload: config });
  }

  function handleReset() {
    loadConfig({
      apiBaseUrl: 'https://api.deepseek.com',
      apiKey: '',
      model: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 4096,
      style: 'balanced',
      storagePath: '',
      webSearchEnabled: false,
      searchEngine: 'serpapi',
      searchApiKey: '',
    });
  }

  function handleTest() {
    const config = collectConfig();
    if (!config.apiKey) {
      showTestResult(false, '请先输入 API Key');
      return;
    }
    vscode.postMessage({ command: 'testConnection', payload: config });
  }

  function showTestResult(success: boolean, message: string) {
    const el = getEl('testResult');
    if (!el) return;
    el.classList.remove('hidden');
    el.className = el.className.replace(/bg-\w+-\d+/, '') + 
      (success ? ' bg-green-100 text-green-800' : ' bg-red-100 text-red-800');
    el.textContent = message;
  }

  function handleTempChange(e: any) {
    const val = e.target?.value || 0.7;
    const el = getEl('tempValue') as HTMLElement;
    if (el) el.textContent = val;
  }

  function handleSearchToggle() {
    toggleSearchSettings(getChecked('webSearchEnabled'));
  }

  function toggleSearchSettings(enabled: boolean) {
    const el = getEl('searchSettings');
    if (el) {
      el.className = enabled ? '' : 'hidden';
    }
  }

  function handleStyleChange() {
    const style = getVal('style');
    updateStyleDesc(style);
  }

  function updateStyleDesc(style: string) {
    const desc = getEl('styleDesc');
    if (!desc) return;
    const descriptions: Record<string, string> = {
      balanced: '自然地融合毛选思想与叶子农/丁元英方法论。在分析矛盾格局时多用毛选框架；在分析个人条件时多用"见路不走"框架。',
      maoxuan: '更多直接引用毛泽东选集原文，使用毛选中常见的表达方式。语言风格更偏向革命年代的政治论述风。',
      yedinying: '更多使用叶子农"见路不走"和丁元英"文化属性"的概念框架。少用政治术语，多谈因果、条件、实事求是。',
    };
    desc.textContent = descriptions[style] || descriptions.balanced;
  }

  // ------------ Message Handling ------------
  window.addEventListener('message', (event) => {
    const message = event.data;
    
    switch (message.command) {
      case 'loadConfig':
        loadConfig(message.payload);
        break;
      case 'testResult':
        showTestResult(message.payload.success, message.payload.message);
        break;
    }
  });
})();