import * as vscode from 'vscode';
import { loadComponentSchema } from './schema-loader';
import { GenericComponentCompletionProvider, GenericComponentHoverProvider } from '../providers/component-factory';

interface ComponentConfig {
  tag: string;
  module?: string;
  triggers?: string[];
  docSource?: string; // 添加文档来源字段
}

// 组件映射表
export const COMPONENT_MAP: ComponentConfig[] = [
  { tag: 'wd-action-sheet'},
  { tag: 'wd-backtop'},
  { tag: 'wd-badge'},
  { tag: 'wd-button' },
  { tag: 'wd-calendar'},
  { tag: 'wd-card'},
  { tag: 'wd-cell',docSource:'cell'},
  { tag: 'wd-cell-group',docSource:'cell'},
  { tag: 'wd-checkbox'},
  { tag: 'wd-circle'},
  { tag: 'wd-col-picker'},
  { tag: 'wd-collapse-item', docSource: 'collapse'},
  { tag: 'wd-collapse', docSource: 'collapse'},
  { tag: 'wd-config-provider'},
  { tag: 'wd-count-down'},
  { tag: 'wd-count-to'},
  { tag: 'wd-curtain'},
  { tag: 'wd-datetime-picker' },
  { tag: 'wd-divider'},
  { tag: 'wd-drop-menu'},
  { tag: 'wd-fab'},
  { tag: 'wd-floating-panel' },
  { tag: 'wd-form'},
  { tag: 'wd-gap'},
  { tag: 'wd-grid'},
  { tag: 'wd-icon'},
  { tag: 'wd-img' },
  { tag: 'wd-index-bar'},
  { tag: 'wd-input-number', module: './wd-input-number' },
  { tag: 'wd-input', module: './wd-input' },
  { tag: 'wd-keyboard', module: './wd-keyboard' },
  { tag: 'wd-layout', module: './wd-layout' },
  { tag: 'wd-loading', module: './wd-loading' },
  { tag: 'wd-loadmore', module: './wd-loadmore' },
  { tag: 'wd-message-box', module: './wd-message-box' },
  { tag: 'wd-navbar', module: './wd-navbar' },
  { tag: 'wd-notice-bar', module: './wd-notice-bar' },
  { tag: 'wd-number-keyboard', module: './wd-number-keyboard' },
  { tag: 'wd-overlay', module: './wd-overlay' },
  { tag: 'wd-pagination', module: './wd-pagination' },
  { tag: 'wd-password-input', module: './wd-password-input' },
  { tag: 'wd-picker', module: './wd-picker' },
  { tag: 'wd-popover', module: './wd-popover' },
  { tag: 'wd-popup', module: './wd-popup' },
  { tag: 'wd-progress', module: './wd-progress' },
  { tag: 'wd-radio', module: './wd-radio' },
  { tag: 'wd-rate', module: './wd-rate' },
  { tag: 'wd-resize', module: './wd-resize' },
  { tag: 'wd-root-portal', module: './wd-root-portal' },
  { tag: 'wd-search', module: './wd-search' },
  { tag: 'wd-segmented', module: './wd-segmented' },
  { tag: 'wd-select-picker', module: './wd-select-picker' },
  { tag: 'wd-sidebar', module: './wd-sidebar' },
  { tag: 'wd-signature', module: './wd-signature' },
  { tag: 'wd-skeleton', module: './wd-skeleton' },
  { tag: 'wd-slider', module: './wd-slider' },
  { tag: 'wd-sort-button', module: './wd-sort-button' },
  { tag: 'wd-status-tip', module: './wd-status-tip' },
  { tag: 'wd-steps', module: './wd-steps' },
  { tag: 'wd-swipe-action' },
  { tag: 'wd-swiper' },
  { tag: 'wd-switch'},
  { tag: 'wd-tabbar'},
  { tag: 'wd-table'},
  { tag: 'wd-table-col', docSource: 'table'}, // 指定文档来源为 table.md
  { tag: 'wd-tabs'},
  { tag: 'wd-tag'},
  { tag: 'wd-text' },
  { tag: 'wd-textarea'},
  { tag: 'wd-toast' },
  { tag: 'wd-tooltip'},
  { tag: 'wd-transition'},
  { tag: 'wd-upload'},
  { tag: 'wd-watermark'}
];

// 默认触发字符
export const DEFAULT_TRIGGERS = ["<", " ", ":", '"', "'"];

// 动态导入所有组件提供者
export async function loadComponentProviders(tag: string, modulePath: string) {
  try {
    const componentName = tag.replace('wd-', '');
    // 查找组件配置
    const componentConfig = COMPONENT_MAP.find(item => item.tag === tag);
    // 传递文档来源参数
    const componentMeta = loadComponentSchema(componentName, componentConfig?.docSource);
    
    return {
      provider: new GenericComponentCompletionProvider(tag, componentMeta),
      hover: new GenericComponentHoverProvider(tag, componentMeta)
    };
  } catch (error) {
    console.error(`Failed to load component providers for ${tag}:`, error);
    throw error;
  }
}

// 根据标签名获取类名
function getComponentClassName(tag: string): string {
  // 移除 'wd-' 前缀并转换为大驼峰命名
  return tag.substring(3)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.substring(1))
    .join('');
}