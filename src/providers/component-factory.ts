import * as vscode from 'vscode';
import { ComponentMeta } from '../utils/schema-loader';
import { ComponentCompletionProvider, ComponentHoverProvider, ComponentDiagnosticProvider } from './../utils/index';

/**
 * 通用组件完成项提供者
 */
export class GenericComponentCompletionProvider extends ComponentCompletionProvider {
  protected componentName: string;
  protected componentMeta: ComponentMeta;
  
  constructor(componentName: string, componentMeta: ComponentMeta) {
    super();
    this.componentName = componentName;
    this.componentMeta = componentMeta;
  }

  protected getTagSnippet(isKebab = true): vscode.SnippetString {
    const tagName = isKebab ? this.componentName : this.componentName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    return new vscode.SnippetString(`${tagName}$0></${tagName}>`);
  }
}

/**
 * 通用组件悬停提供者
 */
export class GenericComponentHoverProvider extends ComponentHoverProvider {
  protected componentName: string;
  protected componentMeta: ComponentMeta;
  
  constructor(componentName: string, componentMeta: ComponentMeta) {
    super();
    this.componentName = componentName;
    this.componentMeta = componentMeta;
  }
}

/**
 * 通用组件诊断提供者
 */
export class GenericComponentDiagnosticProvider extends ComponentDiagnosticProvider {
  protected componentName: string;
  protected componentMeta: ComponentMeta;
  
  constructor(componentName: string, componentMeta: ComponentMeta) {
    super();
    this.componentName = componentName;
    this.componentMeta = componentMeta;
  }

  protected getAdditionalDiagnostics?(tag: string, range: vscode.Range, diagnostics: vscode.Diagnostic[]): void {
    // 默认实现不添加额外诊断
  }
}