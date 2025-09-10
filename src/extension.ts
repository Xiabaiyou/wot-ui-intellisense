import * as vscode from 'vscode';
import { registerAll } from './providers/index';

export function activate(context: vscode.ExtensionContext) {
  console.log('Wot Uni Helper 已激活');
  registerAll(context);
}

export function deactivate() {}