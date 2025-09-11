import * as vscode from 'vscode';

// ======================== 工具函数 ========================
// 转义正则表达式特殊字符
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 驼峰式转短横线式
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

// 短横线式转驼峰式
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * 判断光标是否在标签名上（支持驼峰和短横线式）
 */
export function isOnTagName(
  document: vscode.TextDocument,
  position: vscode.Position,
  tagName: string
): boolean {
  const line = document.lineAt(position);
  const lineText = line.text;
  const cursorOffset = position.character;

  // 1. 向左查找 '<'
  let tagStart = -1;
  for (let i = cursorOffset; i >= 0; i--) {
    if (lineText[i] === '<') {
      tagStart = i;
      break;
    }
  }
  if (tagStart === -1) return false;

  // 2. 同时匹配驼峰和短横线式
  const kebabTagName = camelToKebab(tagName);
  const tagRegex = new RegExp(`^<\\/?(${escapeRegExp(tagName)}|${escapeRegExp(kebabTagName)})`);
  
  const tagPrefix = lineText.substring(tagStart);
  const match = tagPrefix.match(tagRegex);
  
  if (!match) return false;
  
  // 3. 计算标签名的实际位置范围
  const actualTagName = match[1];
  const actualTagStart = tagStart + match[0].indexOf(actualTagName);
  const actualTagEnd = actualTagStart + actualTagName.length;
  
  // 4. 检查光标是否在标签名范围内
  return cursorOffset >= actualTagStart && cursorOffset < actualTagEnd;
}

/**
 * 获取光标所在属性名及标签名（支持驼峰和短横线式）
 */
export function getAttributeInfoAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): { attrName: string; tagName: string; isEvent: boolean; isDynamic: boolean } | null {

  /* ---------- 1. 找到标签开始、结束位置（跨行） ---------- */
  let openAngle = -1;
  // 向前找最近的 <
  for (let line = position.line; line >= 0; line--) {
    const txt = document.lineAt(line).text;
    const col = line === position.line ? position.character : txt.length - 1;
    for (let i = col; i >= 0; i--) {
      if (txt[i] === '<') {
        openAngle = document.offsetAt(new vscode.Position(line, i));
        break;
      }
    }
    if (openAngle !== -1) break;
  }
  if (openAngle === -1) return null;

  let closeAngle = -1;
  // 向后找最近的 >
  for (let line = position.line, lineCount = document.lineCount; line < lineCount; line++) {
    const txt = document.lineAt(line).text;
    const startCol = line === position.line ? position.character : 0;
    for (let i = startCol; i < txt.length; i++) {
      if (txt[i] === '>') {
        closeAngle = document.offsetAt(new vscode.Position(line, i)) + 1;
        break;
      }
    }
    if (closeAngle !== -1) break;
  }
  if (closeAngle === -1) return null; // 没找到闭合

  /* ---------- 2. 取出完整标签文本 ---------- */
  const tagRange = new vscode.Range(document.positionAt(openAngle), document.positionAt(closeAngle));
  const tagContent = document.getText(tagRange); // 跨行也一次性拿到

  /* ---------- 3. 以下是你原来的逻辑 ---------- */
  const tagNameMatch = tagContent.match(/^<([a-zA-Z0-9-]+)/);
  if (!tagNameMatch) return null;
  const tagName = tagNameMatch[1];

  const cursorOffset = document.offsetAt(position) - openAngle; // 光标在 tagContent 里的偏移
  // 改进的正则表达式，支持带值的属性
  const attrRegex = /(?:v-bind:|v-on:|@|:)?([a-zA-Z0-9-_.]+)(?:=("[^"]*"|'[^']*'|[^>\s]*))?/g;
  let match;
  
  while ((match = attrRegex.exec(tagContent)) !== null) {
    const fullMatch = match[0];
    const rawAttrName = match[1];
    // 使用原始属性名（保持kebab-case格式）
    const attrName = rawAttrName;
    const attrStart = match.index;
    const attrEnd   = attrStart + fullMatch.length;
    
    if (cursorOffset >= attrStart && cursorOffset <= attrEnd) {
      return {
        attrName, // 保持原始格式用于匹配
        tagName,
        isEvent: fullMatch.startsWith('@') || fullMatch.startsWith('v-on:'),
        isDynamic: fullMatch.startsWith(':') || fullMatch.startsWith('v-bind:'),
      };
    }
  }
  return null;
}

// ======================== 补全提供者 ========================
/**
 * 通用组件完成项提供者基类（支持驼峰和短横线式属性）
 */
export abstract class ComponentCompletionProvider implements vscode.CompletionItemProvider {
  protected abstract componentName: string;
  protected abstract componentMeta: any;

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    const linePrefix = document.lineAt(position).text.substring(0, position.character);

    // 1. 组件标签补全（支持驼峰和短横线式）
    const kebabComponentName = camelToKebab(this.componentName);
    const tagRegex = new RegExp(`<(${this.componentName.replace(/-/g, '(-)?')}|${kebabComponentName}(\\s+[^>]*)?)?$`);
    if (linePrefix.match(tagRegex)) {
      // 创建两种形式的标签补全
      const items: vscode.CompletionItem[] = [];
      
      // 驼峰式标签
      // const camelItem = new vscode.CompletionItem(
      //   this.componentName,
      //   vscode.CompletionItemKind.Class
      // );
      // camelItem.documentation = new vscode.MarkdownString(this.componentMeta.documentation);
      // camelItem.insertText = this.getTagSnippet(false);
      // camelItem.detail = "wot uni 组件 - 驼峰式标签";
      // items.push(camelItem);
      
      // 短横线式标签
      const kebabItem = new vscode.CompletionItem(
        kebabComponentName,
        vscode.CompletionItemKind.Class
      );
      kebabItem.documentation = new vscode.MarkdownString(this.componentMeta.documentation);
      kebabItem.insertText = this.getTagSnippet(true);
      kebabItem.detail = "wot uni 组件";
      items.push(kebabItem);
      
      return items;
    }

    // 2. 属性补全（增强支持所有Vue写法）
    const attrContextRegex = new RegExp(`<(${this.componentName}|${kebabComponentName})\\b[^>]*$`);
    const eventContextRegex = /(@|v-on:)[a-zA-Z0-9-]*$/;
    const dynamicAttrContextRegex = /(:|v-bind:)[a-zA-Z0-9-]*$/;
    
    if (linePrefix.match(attrContextRegex)) {
      const items: vscode.CompletionItem[] = [];
      
      // 静态属性补全（同时提供驼峰式和短横线式）
      this.componentMeta.props.forEach((prop: any) => {
        // 驼峰式补全项
        const camelItem = this.createPropCompletionItem(prop, false);
        items.push(camelItem);
        
        // 短横线式补全项
        const kebabItem = this.createPropCompletionItem(prop, true);
        items.push(kebabItem);
      });
      
      // 动态属性补全（同时提供两种形式）
      this.componentMeta.props.forEach((prop: any) => {
        // 驼峰式动态绑定
        const camelDynamicItem = this.createDynamicPropItem(prop, false);
        items.push(camelDynamicItem);
        
        // 短横线式动态绑定
        const kebabDynamicItem = this.createDynamicPropItem(prop, true);
        items.push(kebabDynamicItem);
      });
      
      // 事件补全（同时提供两种形式）
      this.componentMeta.events?.forEach((event: any) => {
        // 驼峰式事件
        const camelEventItem = this.createEventItem(event, false);
        items.push(camelEventItem);
        
        // 短横线式事件
        const kebabEventItem = this.createEventItem(event, true);
        items.push(kebabEventItem);
      });
      
      return items;
    }
    
    // 3. 事件上下文补全（当输入@或v-on:时）
    if (linePrefix.match(eventContextRegex)) {
      const items: vscode.CompletionItem[] = [];
      
      this.componentMeta.events?.forEach((event: any) => {
        // 驼峰式事件名
        const camelItem = new vscode.CompletionItem(
          event.name,
          vscode.CompletionItemKind.Event
        );
        camelItem.documentation = event.description;
        camelItem.insertText = new vscode.SnippetString(`${event.name}="\${1:handler}"`);
        camelItem.detail = "驼峰式事件";
        items.push(camelItem);
        
        // 短横线式事件名
        const kebabItem = new vscode.CompletionItem(
          camelToKebab(event.name),
          vscode.CompletionItemKind.Event
        );
        kebabItem.documentation = event.description;
        kebabItem.insertText = new vscode.SnippetString(`${camelToKebab(event.name)}="\${1:handler}"`);
        kebabItem.detail = "短横线式事件";
        items.push(kebabItem);
      });
      
      return items;
    }
    
    // 4. 动态属性上下文补全（当输入:或v-bind:时）
    if (linePrefix.match(dynamicAttrContextRegex)) {
      const items: vscode.CompletionItem[] = [];
      
      this.componentMeta.props.forEach((prop: any) => {
        // 驼峰式属性名
        const camelItem = new vscode.CompletionItem(
          prop.name,
          vscode.CompletionItemKind.Property
        );
        camelItem.documentation = prop.description;
        camelItem.insertText = new vscode.SnippetString(`${prop.name}="\${1:value}"`);
        camelItem.detail = "驼峰式属性";
        items.push(camelItem);
        
        // 短横线式属性名
        const kebabItem = new vscode.CompletionItem(
          camelToKebab(prop.name),
          vscode.CompletionItemKind.Property
        );
        kebabItem.documentation = prop.description;
        kebabItem.insertText = new vscode.SnippetString(`${camelToKebab(prop.name)}="\${1:value}"`);
        kebabItem.detail = "短横线式属性";
        items.push(kebabItem);
      });
      
      return items;
    }

    return [];
  }

  // 创建属性补全项（支持两种命名方式）
  private createPropCompletionItem(prop: any, isKebabCase: boolean): vscode.CompletionItem {
    const propName = isKebabCase ? camelToKebab(prop.name) : prop.name;
    const item = new vscode.CompletionItem(
      propName,
      vscode.CompletionItemKind.Property
    );
    item.documentation = prop.description;
    item.detail = isKebabCase ? "短横线式属性" : "驼峰式属性";
    
    if (prop.type === 'enum') {
      item.insertText = new vscode.SnippetString(
        `${propName}="\${1|${prop.values!.join(',')}|}"`
      );
    } else if (prop.type === 'boolean') {
      // 布尔属性支持简写（仅驼峰式）
      if (!isKebabCase) {
        const booleanItem = new vscode.CompletionItem(
          prop.name,
          vscode.CompletionItemKind.Property
        );
        booleanItem.documentation = prop.description;
        booleanItem.insertText = prop.name;
        booleanItem.detail = "驼峰式属性（简写）";
        return booleanItem;
      }
      item.insertText = new vscode.SnippetString(`${propName}="\${1|true,false|}"`);
    } else {
      item.insertText = new vscode.SnippetString(`${propName}="$1"`);
    }
    
    return item;
  }

  // 创建动态属性补全项
  private createDynamicPropItem(prop: any, isKebabCase: boolean): vscode.CompletionItem {
    const propName = isKebabCase ? camelToKebab(prop.name) : prop.name;
    const prefix = ':';
    
    const item = new vscode.CompletionItem(
      `${prefix}${propName}`,
      vscode.CompletionItemKind.Property
    );
    
    item.documentation = new vscode.MarkdownString(
      `**动态绑定** (${isKebabCase ? '短横线式' : '驼峰式'})\n\n${prop.description}\n\n类型: ${prop.type}`
    );
    
    item.insertText = new vscode.SnippetString(`${prefix}${propName}="\${1:value}"`);
    item.detail = isKebabCase ? "短横线式动态属性" : "驼峰式动态属性";
    
    return item;
  }

  // 创建事件补全项
  private createEventItem(event: any, isKebabCase: boolean): vscode.CompletionItem {
    const eventName = isKebabCase ? camelToKebab(event.name) : event.name;
    const prefix = '@';
    
    const item = new vscode.CompletionItem(
      `${prefix}${eventName}`,
      vscode.CompletionItemKind.Event
    );
    
    item.documentation = new vscode.MarkdownString(
      `**事件** (${isKebabCase ? '短横线式' : '驼峰式'})\n\n${event.description}`
    );
    
    item.insertText = new vscode.SnippetString(`${prefix}${eventName}="\${1:handler}"`);
    item.detail = isKebabCase ? "短横线式事件" : "驼峰式事件";
    
    return item;
  }

  protected abstract getTagSnippet(isKebabCase: boolean): vscode.SnippetString;
}

// ======================== 悬停提供者 ========================
/**
 * 通用组件悬停提供者基类（支持驼峰和短横线式属性）
 */
export abstract class ComponentHoverProvider implements vscode.HoverProvider {
  protected abstract componentMeta: any;
  protected abstract componentName: string;

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.ProviderResult<vscode.Hover> {
    try {
      
      // 1. 检查是否在标签名上（支持驼峰和短横线式）
      const kebabComponentName = camelToKebab(this.componentName);
      if (isOnTagName(document, position, this.componentName) || 
          isOnTagName(document, position, kebabComponentName)) {
        const markdown = new vscode.MarkdownString();
        markdown.isTrusted = true;
        markdown.supportHtml = true;
        markdown.appendMarkdown(this.componentMeta.documentation);
        return new vscode.Hover(markdown);
      }

      // 2. 检查是否在属性上（支持所有Vue写法）
      const attrInfo = getAttributeInfoAtPosition(document, position);
      
      // 修复组件名称匹配逻辑
      if (attrInfo && (attrInfo.tagName === this.componentName.replace('wd-', '') || 
                      attrInfo.tagName === kebabComponentName || 
                      attrInfo.tagName === kebabComponentName.replace('wd-', ''))) {
        
        // 处理通用属性
        if (attrInfo.attrName === 'customClass') {
          const markdown = new vscode.MarkdownString();
          markdown.isTrusted = true;
          markdown.supportHtml = true;
          markdown.appendMarkdown('### 外部样式类\n\n');
          markdown.appendMarkdown('`custom-class` 自定义样式类名，用于覆盖组件默认样式\n\n');
          markdown.appendMarkdown('**类型**: string\n\n');
          return new vscode.Hover(markdown);
        }
        
        if (attrInfo.attrName === 'customStyle') {
          const markdown = new vscode.MarkdownString();
          markdown.isTrusted = true;
          markdown.supportHtml = true;
          markdown.appendMarkdown('### 外部样式类\n\n');
          markdown.appendMarkdown('`custom-style` 自定义样式，用于覆盖组件默认样式\n\n');
          markdown.appendMarkdown('**类型**: string\n\n');
          return new vscode.Hover(markdown);
        }

        let prop, event;
        
        // 同时匹配驼峰式和短横线式
        const findProp = (name: string) => 
          this.componentMeta.props.find((p: any) => 
            p.name === name || camelToKebab(p.name) === name || kebabToCamel(p.name) === name
          );
        
        const findEvent = (name: string) => 
          this.componentMeta.events?.find((e: any) => 
            e.name === name || camelToKebab(e.name) === name || kebabToCamel(e.name) === name
          );
          
        if (attrInfo.isEvent) {
          event = findEvent(attrInfo.attrName);
          if (!event) {
            // 尝试短横线式匹配
            const kebabName = camelToKebab(attrInfo.attrName);
            event = findEvent(kebabName);
          }
          
          if (!event) {
            // 尝试驼峰式匹配
            const camelName = kebabToCamel(attrInfo.attrName);
            event = findEvent(camelName);
          }
          
          if (event) {
            const markdown = new vscode.MarkdownString();
            markdown.isTrusted = true;
            markdown.supportHtml = true;
            
            markdown.appendMarkdown(`### ${attrInfo.isDynamic ? '动态事件' : '事件'} \`${event.name}\`\n\n`);
            markdown.appendMarkdown(`${event.description}\n\n`);
            markdown.appendMarkdown(`**类型**: 事件处理器\n\n`);
            
            if (event.arguments) {
              markdown.appendMarkdown(`**事件参数**: \n`);
              event.arguments.forEach((arg: any) => {
                markdown.appendMarkdown(`- \`${arg.name}\`: ${arg.type} - ${arg.description}\n`);
              });
              markdown.appendMarkdown('\n');
            }
            
            return new vscode.Hover(markdown);
          }
        } else {
          // 属性悬停
          prop = findProp(attrInfo.attrName);
          
          if (!prop) {
            // 尝试短横线式匹配
            const kebabName = camelToKebab(attrInfo.attrName);
            prop = findProp(kebabName);
          }
          
          if (!prop) {
            // 尝试驼峰式匹配
            const camelName = kebabToCamel(attrInfo.attrName);
            prop = findProp(camelName);
          }
          
          if (prop) {
            const markdown = new vscode.MarkdownString();
            markdown.isTrusted = true;
            markdown.supportHtml = true;
            
            markdown.appendMarkdown(`### ${attrInfo.isDynamic ? '动态属性' : '属性'} \`${prop.name}\`\n\n`);
            markdown.appendMarkdown(`${prop.description}\n\n`);
            markdown.appendMarkdown(`**类型**: ${prop.type}\n\n`);
            
            if (prop.values) {
              markdown.appendMarkdown(`**可选值**: ${prop.values.join(', ')}\n\n`);
            }
            
            if (prop.default) {
              markdown.appendMarkdown(`**默认值**: ${prop.default}\n\n`);
            }
            
            return new vscode.Hover(markdown);
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error in provideHover:', error);
      return null;
    }
  }
}

// ======================== 诊断提供者 ========================
/**
 * 通用组件诊断提供者基类（支持驼峰和短横线式属性）
 */
export abstract class ComponentDiagnosticProvider {
  protected abstract componentName: string;
  protected abstract componentMeta: any;
  protected diagnosticCollection!: vscode.DiagnosticCollection;

  constructor() {
    vscode.workspace.onDidChangeTextDocument(e => this.updateDiagnostics(e.document));
  }

  protected initialize() {
    if (!this.diagnosticCollection) {
      this.diagnosticCollection = vscode.languages.createDiagnosticCollection(this.componentName);
    }
  }

  public updateDiagnostics(document: vscode.TextDocument) {
    if (document.languageId !== 'html' && document.languageId !== 'vue') return;

    this.initialize();

    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const regex = this.getTagRegex();
    let match;

    while ((match = regex.exec(text))) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      const range = new vscode.Range(startPos, endPos);

      this.checkAttributeValues(match[0], range, diagnostics);
      this.checkDuplicateAttributes(match[0], range, diagnostics);
      this.checkEventHandlers(match[0], range, diagnostics);
      this.checkBooleanAttributes(match[0], range, diagnostics);
      
      // 调用额外的诊断方法
      if (this.getAdditionalDiagnostics) {
        this.getAdditionalDiagnostics(match[0], range, diagnostics);
      }
    }

    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  protected getTagRegex(): RegExp {
    const kebabComponentName = camelToKebab(this.componentName);
    return new RegExp(`<(${this.componentName}|${kebabComponentName})\\s+[^>]*>`, 'g');
  }

  protected checkAttributeValues(tag: string, range: vscode.Range, diagnostics: vscode.Diagnostic[]) {
    this.componentMeta.props
      .filter((prop: any) => prop.type === 'enum')
      .forEach((prop: any) => {
        // 同时检查驼峰式和短横线式
        const propNames = [prop.name, camelToKebab(prop.name)];
        
        propNames.forEach(propName => {
          // 检查静态属性
          const staticAttrMatch = tag.match(new RegExp(`${propName}=["']([^"']+)["']`));
          if (staticAttrMatch && !prop.values.includes(staticAttrMatch[1])) {
            diagnostics.push({
              severity: vscode.DiagnosticSeverity.Error,
              range: range,
              message: `无效的 ${propName} 属性值: ${staticAttrMatch[1]}`,
              source: 'wot-uni-helper'
            });
          }
          
          // 检查动态属性值（需要静态值的情况）
          const dynamicAttrMatch = tag.match(new RegExp(`:${propName}=["']([^"']+)["']`));
          if (dynamicAttrMatch && !prop.values.includes(dynamicAttrMatch[1])) {
            diagnostics.push({
              severity: vscode.DiagnosticSeverity.Warning,
              range: range,
              message: `动态属性 :${propName} 使用了静态值，建议使用变量`,
              source: 'wot-uni-helper'
            });
          }
        });
      });
  }

  protected checkDuplicateAttributes(tag: string, range: vscode.Range, diagnostics: vscode.Diagnostic[]) {
    const attrs = tag.match(/(?:v-bind:|v-on:|@|:)?([a-zA-Z0-9-_.]+)=?/g) || [];
    const attrMap = new Map<string, string>();
    
    attrs.forEach(attr => {
      const match = attr.match(/(?:v-bind:|v-on:|@|:)?([a-zA-Z0-9-_.]+)/);
      if (!match) return;
      
      const rawName = match[1];
      // 标准化属性名（统一转为驼峰式）
      const normalizedName = kebabToCamel(rawName);
      
      if (attrMap.has(normalizedName)) {
        const originalRawName = attrMap.get(normalizedName);
        diagnostics.push({
          severity: vscode.DiagnosticSeverity.Warning,
          range: range,
          message: `重复的属性: ${originalRawName} 和 ${rawName} 都映射到 ${normalizedName}`,
          source: 'wot-uni-helper'
        });
      } else {
        attrMap.set(normalizedName, rawName);
      }
    });
  }

  protected checkEventHandlers(tag: string, range: vscode.Range, diagnostics: vscode.Diagnostic[]) {
    this.componentMeta.events?.forEach((event: any) => {
      // 同时检查驼峰式和短横线式
      const eventNames = [event.name, camelToKebab(event.name)];
      
      eventNames.forEach(eventName => {
        const eventRegex = new RegExp(`(@|v-on:)${eventName}=["']([^"']*)["']`);
        const match = tag.match(eventRegex);
        
        if (match) {
          const handler = match[2];
          // 简单检查处理器是否有效
          if (!handler.trim()) {
            diagnostics.push({
              severity: vscode.DiagnosticSeverity.Error,
              range: range,
              message: `事件 ${eventName} 缺少处理器`,
              source: 'wot-uni-helper'
            });
          } else if (!handler.includes('(') && !handler.includes(')') && !handler.startsWith('$event')) {
            diagnostics.push({
              severity: vscode.DiagnosticSeverity.Warning,
              range: range,
              message: `事件处理器应包含括号: ${handler}()`,
              source: 'wot-uni-helper'
            });
          }
        }
      });
    });
  }

  protected checkBooleanAttributes(tag: string, range: vscode.Range, diagnostics: vscode.Diagnostic[]) {
    this.componentMeta.props
      .filter((prop: any) => prop.type === 'boolean')
      .forEach((prop: any) => {
        // 同时检查驼峰式和短横线式
        const propNames = [prop.name, camelToKebab(prop.name)];
        
        propNames.forEach(propName => {
          // 检查静态布尔属性是否有值
          const staticAttrMatch = tag.match(new RegExp(`${propName}=["']([^"']*)["']`));
          if (staticAttrMatch) {
            const value = staticAttrMatch[1];
            if (value && value !== 'true' && value !== 'false') {
              diagnostics.push({
                severity: vscode.DiagnosticSeverity.Warning,
                range: range,
                message: `布尔属性 ${propName} 应使用简写或动态绑定`,
                source: 'wot-uni-helper'
              });
            }
          }
        });
      });
  }

  protected abstract getAdditionalDiagnostics?(tag: string, range: vscode.Range, diagnostics: vscode.Diagnostic[]): void;
}