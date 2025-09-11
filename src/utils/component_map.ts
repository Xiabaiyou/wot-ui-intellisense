import * as vscode from "vscode";
import { loadComponentSchema } from "./schema-loader";
import {
  GenericComponentCompletionProvider,
  GenericComponentHoverProvider,
} from "../providers/component-factory";

interface ComponentConfig {
  tag: string;
  module?: string;
  triggers?: string[];
  docSource?: string; // 添加文档来源字段
}

// 组件映射表
// 组件映射表
export const COMPONENT_MAP: ComponentConfig[] = [
  { tag: "wd-action-sheet" },
  { tag: "wd-backtop" },
  { tag: "wd-badge" },
  { tag: "wd-button" },
  { tag: "wd-calendar" },
  { tag: "wd-calendar-view"},
  { tag: "wd-card" },
  { tag: "wd-cell", docSource: "cell" },
  { tag: "wd-cell-group", docSource: "cell" },
  { tag: "wd-checkbox",docSource: "checkbox"  },
  { tag: "wd-checkbox-group", docSource: "checkbox" },
  { tag: "wd-circle" },
  { tag: "wd-col", docSource: "layout" },
  { tag: "wd-col-picker" },
  { tag: "wd-collapse-item", docSource: "collapse" },
  { tag: "wd-collapse", docSource: "collapse" },
  { tag: "wd-config-provider" },
  { tag: "wd-count-down" },
  { tag: "wd-count-to" },
  { tag: "wd-curtain" },
  { tag: "wd-datetime-picker" },
  { tag: "wd-datetime-picker-view" },
  { tag: "wd-divider" },
  { tag: "wd-drop-menu" },
  { tag: "wd-drop-menu-item", docSource: "drop-menu" },
  { tag: "wd-fab" },
  { tag: "wd-floating-panel" },
  { tag: "wd-form" },
  { tag: "wd-gap" },
  { tag: "wd-grid" },
  { tag: "wd-grid-item", docSource: "grid" },
  { tag: "wd-icon" },
  { tag: "wd-img" },
  { tag: "wd-img-cropper"},
  { tag: "wd-index-anchor", docSource: "index-bar" },
  { tag: "wd-index-bar" },
  { tag: "wd-input-number" },
  { tag: "wd-input" },
  { tag: "wd-keyboard" },
  { tag: "wd-layout" },
  { tag: "wd-loading" },
  { tag: "wd-loadmore" },
  { tag: "wd-message-box" },
  { tag: "wd-navbar" },
  { tag: "wd-navbar-capsule", docSource: "navbar" },
  { tag: "wd-notice-bar" },
  { tag: "wd-number-keyboard" },
  { tag: "wd-overlay" },
  { tag: "wd-pagination" },
  { tag: "wd-password-input" },
  { tag: "wd-picker" },
  { tag: "wd-picker-view"},
  { tag: "wd-popover" },
  { tag: "wd-popup" },
  { tag: "wd-progress" },
  { tag: "wd-radio" },
  { tag: "wd-radio-group", docSource: "radio" },
  { tag: "wd-rate" },
  { tag: "wd-resize" },
  { tag: "wd-root-portal" },
  { tag: "wd-row", docSource: "layout" },
  { tag: "wd-search" },
  { tag: "wd-segmented" },
  { tag: "wd-select-picker" },
  { tag: "wd-sidebar" },
  { tag: "wd-sidebar-item", docSource: "sidebar" },
  { tag: "wd-signature" },
  { tag: "wd-skeleton" },
  { tag: "wd-slider" },
  { tag: "wd-sort-button" },
  { tag: "wd-status-tip" },
  { tag: "wd-step", docSource: "steps" },
  { tag: "wd-steps" },
  { tag: "wd-sticky", docSource: "sticky" },
  { tag: "wd-sticky-box", docSource: "sticky" },
  { tag: "wd-swipe-action" },
  { tag: "wd-swiper" },
  { tag: "wd-swiper-nav", docSource: "swiper" },
  { tag: "wd-switch" },
  { tag: "wd-tab", docSource: "tabs" },
  { tag: "wd-tabbar" },
  { tag: "wd-tabbar-item", docSource: "tabbar" },
  { tag: "wd-table" },
  { tag: "wd-table-col", docSource: "table" },
  { tag: "wd-tabs" },
  { tag: "wd-tag" },
  { tag: "wd-text" },
  { tag: "wd-textarea" },
  { tag: "wd-toast" },
  { tag: "wd-tooltip" },
  { tag: "wd-transition" },
  { tag: "wd-upload" },
  { tag: "wd-notify"},
  { tag: "wd-watermark" },
  { tag: "wd-guide" },
];

// 默认触发字符
export const DEFAULT_TRIGGERS = ["<", " ", ":", '"', "'"];

// 动态导入所有组件提供者
export async function loadComponentProviders(tag: string, modulePath: string) {
  try {
    const componentName = tag.replace("wd-", "");
    // 查找组件配置
    const componentConfig = COMPONENT_MAP.find((item) => item.tag === tag);
    // 传递文档来源参数
    const componentMeta = loadComponentSchema(
      componentName,
      componentConfig?.docSource
    );

    return {
      provider: new GenericComponentCompletionProvider(tag, componentMeta),
      hover: new GenericComponentHoverProvider(tag, componentMeta),
    };
  } catch (error) {
    console.error(`Failed to load component providers for ${tag}:`, error);
    throw error;
  }
}

// 根据标签名获取类名
function getComponentClassName(tag: string): string {
  // 移除 'wd-' 前缀并转换为大驼峰命名
  return tag
    .substring(3)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join("");
}
