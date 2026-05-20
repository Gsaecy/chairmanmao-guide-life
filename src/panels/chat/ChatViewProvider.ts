import * as vscode from 'vscode';
import { StorageManager } from '../../backend/storage';
import { DialogueManager } from '../../backend/dialogue';
import { SessionData } from '../../types';

/**
 * 侧边栏 Webview View Provider
 * 在侧边栏中显示对话界面
 */
export class ChatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'maoxuan.chatPanel';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _storage: StorageManager,
    private readonly _dialogue: DialogueManager
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, 'dist'),
        vscode.Uri.joinPath(this._extensionUri, 'media'),
      ],
    };

    webviewView.webview.html = this._getHtmlContent(webviewView.webview);
    this._setMessageListener(webviewView);

    // 显示引导内容
    webviewView.webview.postMessage({
      command: 'showWelcome',
      payload: {
        title: '没有调查，就没有发言权',
        subtitle: '告诉我你面临的问题，让我们一起用实事求是的方法来分析',
        phases: [
          { name: '全面了解', icon: '🔍', desc: '说清你的情况和条件' },
          { name: '矛盾分析', icon: '⚡', desc: '抓主要矛盾' },
          { name: '条件评估', icon: '📊', desc: '立足自身条件' },
          { name: '战略建议', icon: '🧭', desc: '方向性判断' },
          { name: '战术行动', icon: '🎯', desc: '具体可执行步骤' },
          { name: '反思迭代', icon: '🔄', desc: '审视盲区' },
        ],
      },
    });
  }

  private _setMessageListener(webviewView: vscode.WebviewView): void {
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'createSession': {
          try {
            const session = this._dialogue.startNewSession(message.payload.title);
            webviewView.webview.postMessage({
              command: 'sessionCreated',
              payload: session,
            });
          } catch (err) {
            vscode.window.showErrorMessage(`创建对话失败: ${err}`);
          }
          break;
        }

        case 'sendMessage': {
          try {
            webviewView.webview.postMessage({ command: 'streamStart' });
            await this._dialogue.sendMessage(message.payload.content);
            webviewView.webview.postMessage({ command: 'streamEnd' });
          } catch (err) {
            webviewView.webview.postMessage({
              command: 'error',
              payload: err instanceof Error ? err.message : '发送消息失败',
            });
          }
          break;
        }

        case 'abort':
          this._dialogue.abort();
          webviewView.webview.postMessage({ command: 'streamEnd' });
          break;

        case 'advancePhase':
          this._dialogue.advancePhase();
          break;

        case 'exportReport': {
          try {
            const report = this._dialogue.generateReport();
            const session = this._dialogue.getCurrentSession();
            if (session) {
              this._storage.saveReport(session.id, report, 'md');
            }
            webviewView.webview.postMessage({
              command: 'reportReady',
              payload: report,
            });
          } catch (err) {
            vscode.window.showErrorMessage(`生成报告失败: ${err}`);
          }
          break;
        }

        case 'openSettings':
          vscode.commands.executeCommand('maoxuan-guidance.openSettings');
          break;

        case 'openHistory':
          vscode.commands.executeCommand('maoxuan-guidance.openHistory');
          break;

        case 'newSession':
          webviewView.webview.postMessage({ command: 'promptNewSession' });
          break;
      }
    });

    // 监听 dialogue 事件
    this._dialogue.onMessage((text, done) => {
      webviewView.webview.postMessage({
        command: 'assistantMessage',
        payload: { text, done },
      });
    });

    this._dialogue.onPhaseChange((phase, label) => {
      webviewView.webview.postMessage({
        command: 'phaseChange',
        payload: { phase, label },
      });
    });
  }

  public loadSession(session: SessionData): void {
    if (this._view) {
      this._view.webview.postMessage({
        command: 'loadSession',
        payload: session,
      });
      this._view.show(true);
    }
  }

  public newSession(): void {
    if (this._view) {
      this._view.webview.postMessage({ command: 'promptNewSession' });
      this._view.show(true);
    }
  }

  public reveal(): void {
    if (this._view) {
      this._view.show(true);
    }
  }

  private _getHtmlContent(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'chat.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'chat.css')
    );

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src ${webview.cspSource};">
  <link href="${styleUri}" rel="stylesheet">
  <title>毛选思想指导</title>
</head>
<body>
  <div id="root"></div>
  <script src="${scriptUri}"></script>
</body>
</html>`;
  }
}