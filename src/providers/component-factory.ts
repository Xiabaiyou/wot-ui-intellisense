import * as vscode from 'vscode';
import { ComponentMeta } from '../utils/schema-loader';
import { ComponentHoverProvider } from './../utils/index';
import { COMPONENT_MAP } from "../utils/component_map";
import { loadComponentSchema } from "../utils/schema-loader";
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


// 统一的组件补全提供者
export class UnifiedComponentCompletionProvider
  implements vscode.CompletionItemProvider
{
  private componentMap: Map<string, any> = new Map();

  constructor() {
    // 初始化所有组件的元数据
    for (const { tag, docSource } of COMPONENT_MAP) {
      try {
        const componentName = tag.replace("wd-", "");
        const componentMeta = loadComponentSchema(componentName, docSource);
        this.componentMap.set(tag, componentMeta);
        this.componentMap.set(componentName, componentMeta); // 同时支持驼峰式
      } catch (error) {
        console.error(`加载 ${tag}失败:`, error);
      }
    }
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    const linePrefix = document
      .lineAt(position)
      .text.substring(0, position.character);

    // 1. 检查是否是标签补全上下文（如 <wd-bu）
    const tagCompletionMatch = linePrefix.match(/<([a-zA-Z0-9-]*)$/);
    if (tagCompletionMatch) {
      return this.provideTagCompletionItems(tagCompletionMatch[1] || "");
    }

    // 2. 检查是否是属性补全上下文
    const currentTagName = this.getCurrentTagName(document, position);
    if (currentTagName) {
      // 尝试匹配完整标签名（wd-button 或 button）
      const componentMeta =
        this.componentMap.get(currentTagName) ||
        this.componentMap.get(`wd-${currentTagName}`) ||
        this.componentMap.get(currentTagName.replace(/^wd-/, ""));
      if (componentMeta) {
        return this.provideAttributeCompletionItems(
          componentMeta,
          document,
          position
        );
      }
    }

    return [];
  }

  private provideTagCompletionItems(filter: string): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    for (const [tagName, componentMeta] of this.componentMap.entries()) {
      // 只处理 wd- 前缀的标签名
      if (tagName.startsWith("wd-") && (!filter || tagName.includes(filter))) {
        const item = new vscode.CompletionItem(
          tagName,
          vscode.CompletionItemKind.Class
        );
        item.documentation = new vscode.MarkdownString(
          componentMeta.documentation
        );
        item.insertText = new vscode.SnippetString(
          `${tagName}$0></${tagName}>`
        );
        item.label = {
          label: tagName,
          description: "Wot UI IntelliSense",
        };
        item.sortText = "0";
        item.preselect = true;
        item.kind = vscode.CompletionItemKind.Snippet;
        item.command = {
          command: "editor.action.triggerSuggest",
          title: "",
        };
        items.push(item);
      }
    }

    return items;
  }

  private provideAttributeCompletionItems(
    componentMeta: any,
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.CompletionItem[] {
    // 检查是否在属性上下文中
    if (!this.isInAttributeContext(document, position)) {
      return [];
    }

    const items: vscode.CompletionItem[] = [];

    // 静态属性补全
    componentMeta.props.forEach((prop: any) => {
      // // 驼峰式属性
      // const camelItem = new vscode.CompletionItem(
      //   prop.name,
      //   vscode.CompletionItemKind.Property
      // );
      // camelItem.documentation = prop.description;
      // if (prop.type === "enum") {
      //   camelItem.insertText = new vscode.SnippetString(
      //     `${prop.name}="\${1|${prop.values!.join(",")}|}"`
      //   );
      // } else if (prop.type === "boolean") {
      //   camelItem.insertText = new vscode.SnippetString(
      //     `${prop.name}="\${1|true,false|}"`
      //   );
      // } else {
      //   camelItem.insertText = new vscode.SnippetString(`${prop.name}="$1"`);
      // }
      // camelItem.label = {
      //   label: prop.name,
      //   description: "Wot UI IntelliSense",
      // };
      // camelItem.sortText = '0';
      // camelItem.preselect = true;
      // camelItem.kind = vscode.CompletionItemKind.Snippet;
      // camelItem.command = {
      //   command: "editor.action.triggerSuggest",
      //   title: "",
      // };
      // items.push(camelItem);

      // 短横线式属性
      const kebabName = prop.name.replace(/([A-Z])/g, "-$1").toLowerCase();
      const kebabItem = new vscode.CompletionItem(
        kebabName,
        vscode.CompletionItemKind.Property
      );
      kebabItem.documentation = prop.description;
      if (prop.type === "enum") {
        kebabItem.insertText = new vscode.SnippetString(
          `${kebabName}="\${1|${prop.values!.join(",")}|}"`
        );
      } else if (prop.type === "boolean") {
        kebabItem.insertText = new vscode.SnippetString(
          `${kebabName}="\${1|true,false|}"`
        );
      } else {
        kebabItem.insertText = new vscode.SnippetString(`${kebabName}="$1"`);
      }
      kebabItem.label = {
        label: kebabName,
        description: "Wot UI IntelliSense",
      };
      kebabItem.sortText = '0';
      kebabItem.preselect = true;
      kebabItem.kind = vscode.CompletionItemKind.Snippet;
      kebabItem.command = {
        command: "editor.action.triggerSuggest",
        title: "",
      };
      items.push(kebabItem);
    });

    // 事件补全
    componentMeta.events?.forEach((event: any) => {
      // @事件
      const eventItem = new vscode.CompletionItem(
        `@${event.name}`,
        vscode.CompletionItemKind.Event
      );
      eventItem.documentation = event.description;
      eventItem.insertText = new vscode.SnippetString(`@${event.name}="$1"`);
      items.push(eventItem);

      // 短横线式事件
      const kebabEventName = event.name
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase();
      const kebabEventItem = new vscode.CompletionItem(
        `@${kebabEventName}`,
        vscode.CompletionItemKind.Event
      );
      kebabEventItem.documentation = event.description;
      kebabEventItem.insertText = new vscode.SnippetString(
        `@${kebabEventName}="$1"`
      );
      kebabEventItem.label = {
        label: `@${kebabEventName}`,
        description: "Wot UI IntelliSense",
      };
      kebabEventItem.sortText = '0';
      kebabEventItem.preselect = true;
      kebabEventItem.kind = vscode.CompletionItemKind.Snippet;
      kebabEventItem.command = {
        command: "editor.action.triggerSuggest",
        title: "",
      };
      items.push(kebabEventItem);
    });

    return items;
  }

  private getCurrentTagName(
    document: vscode.TextDocument,
    position: vscode.Position
  ): string | null {
    const lineText = document.lineAt(position).text;
    const beforeCursor = lineText.substring(0, position.character);

    // 找到最近的标签开始
    const tagStartIndex = beforeCursor.lastIndexOf("<");
    const tagEndIndex = beforeCursor.lastIndexOf(">");

    if (tagStartIndex === -1 || tagStartIndex < tagEndIndex) {
      return null;
    }

    // 提取标签名（支持不完整的标签）
    const tagContent = beforeCursor.substring(tagStartIndex + 1);
    const tagNameMatch = tagContent.match(/^([a-zA-Z0-9-]+)/);
    
    // 如果光标在标签内部，但标签尚未闭合
    if (tagNameMatch) {
      return tagNameMatch[1];
    }

    return null;
  }

  private isInAttributeContext(
    document: vscode.TextDocument,
    position: vscode.Position
  ): boolean {
    const lineText = document.lineAt(position).text;
    const beforeCursor = lineText.substring(0, position.character);

    // 标签开始后且未闭合，且不在引号内
    const tagStartIndex = beforeCursor.lastIndexOf("<");
    const tagEndIndex = beforeCursor.lastIndexOf(">");

    if (tagStartIndex === -1 || tagStartIndex < tagEndIndex) {
      return false;
    }

    // 检查引号是否闭合
    const quoteCount = (beforeCursor.match(/["']/g) || []).length;
    return quoteCount % 2 === 0;
  }
}
