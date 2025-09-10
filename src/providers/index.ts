// 静态导入所有组件

import * as vscode from "vscode";
import { COMPONENT_MAP, DEFAULT_TRIGGERS } from '../utils/component_map';
import { loadComponentSchema } from '../utils/schema-loader';
import { GenericComponentCompletionProvider, GenericComponentHoverProvider } from '../providers/component-factory';

interface ComponentEntry {
  tag: string;
  provider: vscode.CompletionItemProvider;
  hover: vscode.HoverProvider;
  triggers: string[];
}

export async function registerAll(context: vscode.ExtensionContext) {
  console.log(`Registering ${COMPONENT_MAP.length} components`);
  
  // 动态注册所有组件
  for (const { tag,docSource } of COMPONENT_MAP) {
    try {
      // 修复模块路径计算
      const componentName = tag.replace('wd-', '');
      
      // 使用通用组件提供者
      const componentMeta = loadComponentSchema(componentName,docSource);
      const provider = new GenericComponentCompletionProvider(tag, componentMeta);
      const hover = new GenericComponentHoverProvider(tag, componentMeta);
      // 修复选择器，使其正确匹配组件标签
      const selector: vscode.DocumentSelector = [
        { language: "vue", scheme: "file" },
        { language: "html", scheme: "file" }
      ];
      
      context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
          selector,
          provider,
          ...DEFAULT_TRIGGERS
        )
      );
      
      context.subscriptions.push(
        vscode.languages.registerHoverProvider(selector, hover)
      );
      
      console.log(`Successfully registered ${tag}`);
    } catch (error) {
      console.error(`Failed to register ${tag}:`, error);
    }
  }
  
  console.log(`Finished registering components`);
}