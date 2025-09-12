/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// 静态导入所有组件
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerAll = registerAll;
const vscode = __importStar(__webpack_require__(2));
const component_map_1 = __webpack_require__(3);
const schema_loader_1 = __webpack_require__(4);
const component_factory_1 = __webpack_require__(8);
async function registerAll(context) {
    console.log(`Registering ${component_map_1.COMPONENT_MAP.length} components`);
    // 动态注册所有组件
    for (const { tag, docSource } of component_map_1.COMPONENT_MAP) {
        try {
            // 修复模块路径计算
            const componentName = tag.replace('wd-', '');
            // 使用通用组件提供者
            const componentMeta = (0, schema_loader_1.loadComponentSchema)(componentName, docSource);
            const provider = new component_factory_1.GenericComponentCompletionProvider(tag, componentMeta);
            const hover = new component_factory_1.GenericComponentHoverProvider(tag, componentMeta);
            // 修复选择器，使其正确匹配组件标签
            const selector = [
                { language: "vue", scheme: "file" },
                { language: "html", scheme: "file" }
            ];
            context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, provider, ...component_map_1.DEFAULT_TRIGGERS));
            context.subscriptions.push(vscode.languages.registerHoverProvider(selector, hover));
            console.log(`Successfully registered ${tag}`);
        }
        catch (error) {
            console.error(`Failed to register ${tag}:`, error);
        }
    }
    console.log(`Finished registering components`);
}


/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_TRIGGERS = exports.COMPONENT_MAP = void 0;
exports.loadComponentProviders = loadComponentProviders;
const schema_loader_1 = __webpack_require__(4);
const component_factory_1 = __webpack_require__(8);
// 组件映射表
// 组件映射表
exports.COMPONENT_MAP = [
    { tag: "wd-action-sheet" },
    { tag: "wd-backtop" },
    { tag: "wd-badge" },
    { tag: "wd-button" },
    { tag: "wd-calendar" },
    { tag: "wd-calendar-view" },
    { tag: "wd-card" },
    { tag: "wd-cell", docSource: "cell" },
    { tag: "wd-cell-group", docSource: "cell" },
    { tag: "wd-checkbox", docSource: "checkbox" },
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
    { tag: "wd-img-cropper" },
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
    { tag: "wd-picker-view" },
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
    { tag: "wd-notify" },
    { tag: "wd-watermark" },
    { tag: "wd-guide" },
];
// 默认触发字符
exports.DEFAULT_TRIGGERS = ["<", " ", ":", '"', "'"];
// 动态导入所有组件提供者
async function loadComponentProviders(tag, modulePath) {
    try {
        const componentName = tag.replace("wd-", "");
        // 查找组件配置
        const componentConfig = exports.COMPONENT_MAP.find((item) => item.tag === tag);
        // 传递文档来源参数
        const componentMeta = (0, schema_loader_1.loadComponentSchema)(componentName, componentConfig?.docSource);
        return {
            provider: new component_factory_1.GenericComponentCompletionProvider(tag, componentMeta),
            hover: new component_factory_1.GenericComponentHoverProvider(tag, componentMeta),
        };
    }
    catch (error) {
        console.error(`Failed to load component providers for ${tag}:`, error);
        throw error;
    }
}
// 根据标签名获取类名
function getComponentClassName(tag) {
    // 移除 'wd-' 前缀并转换为大驼峰命名
    return tag
        .substring(3)
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
        .join("");
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadComponentSchema = loadComponentSchema;
exports.loadComponentSchemaAsync = loadComponentSchemaAsync;
const markdown_parser_1 = __webpack_require__(5);
/**
 * 通用组件schema加载器
 * @param componentName 组件名称（不包含wd-前缀）
 * @param docSource 文档来源组件名称（可选）
 * @returns 组件元数据
 */
function loadComponentSchema(componentName, docSource) {
    try {
        // 解析组件文档，传递文档来源参数
        const componentInfo = (0, markdown_parser_1.parseComponentMarkdown)(componentName, docSource);
        // 如果解析成功，则使用解析结果；否则使用默认值
        if (componentInfo) {
            return {
                name: componentInfo.name,
                props: componentInfo.props.map(prop => ({
                    name: prop.name,
                    type: prop.type,
                    values: prop.values,
                    description: prop.description,
                    default: prop.default,
                    version: prop.version
                })),
                events: componentInfo.events.map(event => ({
                    name: event.name,
                    description: event.description,
                    version: event.version
                })),
                slots: componentInfo.slots?.map(slot => ({
                    name: slot.name,
                    description: slot.description,
                    version: slot.version
                })),
                externalClasses: componentInfo.externalClasses?.map(externalClass => ({
                    name: externalClass.name,
                    description: externalClass.description,
                    version: externalClass.version
                })),
                dataStructures: componentInfo.dataStructures?.map(structure => ({
                    name: structure.name,
                    fields: structure.fields.map(field => ({
                        name: field.name,
                        type: field.type,
                        description: field.description,
                        version: field.version
                    }))
                })),
                documentation: componentInfo.documentation
            };
        }
        // 默认值
        return {
            name: `wd-${componentName}`,
            props: [],
            events: [],
            documentation: (0, markdown_parser_1.loadComponentDoc)(componentName, docSource) // 传递文档来源参数
        };
    }
    catch (error) {
        console.error(`加载组件schema失败: ${componentName}`, error);
        return {
            name: `wd-${componentName}`,
            props: [],
            events: [],
            documentation: ''
        };
    }
}
/**
 * 异步加载组件schema
 * @param componentName 组件名称（不包含wd-前缀）
 * @param docSource 文档来源组件名称（可选）
 * @returns 组件元数据的Promise
 */
async function loadComponentSchemaAsync(componentName, docSource) {
    return loadComponentSchema(componentName, docSource);
}


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseComponentMarkdown = parseComponentMarkdown;
exports.loadComponentDoc = loadComponentDoc;
exports.loadComponentDocAsync = loadComponentDocAsync;
const fs = __importStar(__webpack_require__(6));
const path = __importStar(__webpack_require__(7));
/**
 * 处理组件属性，特别是v-model相关属性
 * @param prop 原始属性数据
 * @returns 处理后的属性数组
 */
function processComponentProp(prop) {
    // 解析属性类型
    let type = prop[2]?.toLowerCase() || "string";
    let values;
    // 如果类型是枚举类型，解析可选值
    if (type === "string" &&
        prop[3] &&
        prop[3] !== "-" &&
        prop[3].includes("/")) {
        values = prop[3]
            .split("/")
            .map((v) => v.trim())
            .filter((v) => v !== "-");
        if (values.length > 0) {
            type = "enum";
        }
    }
    const result = [];
    // 处理复合属性名，如 'v-model / modelValue' 或 'modelValue / v-model' 等
    const propNames = prop[0].split('/').map(name => name.trim().replace(/`/g, ''));
    const normalizedNames = propNames.map(name => {
        // 标准化属性名，移除反引号
        return name.replace(/`/g, '');
    });
    // 添加所有属性名作为独立属性
    normalizedNames.forEach((name, index) => {
        result.push({
            name: name,
            type,
            values,
            description: index === 0 ? (prop[1] || "") : `${prop[1] || ""}\n\n> 该属性支持 \`v-model\` 双向绑定`,
            default: prop[4] && prop[4] !== "-" ? prop[4] : undefined,
            version: prop[5] && prop[5] !== "-" ? prop[5] : undefined,
        });
    });
    // 检查是否包含v-model相关属性名
    const hasVModel = normalizedNames.some(name => name === "v-model" || name === "modelValue" || name === "model-value");
    // 如果包含v-model相关属性，确保三种形式都存在
    if (hasVModel) {
        const existingNames = new Set(normalizedNames);
        const vModelForms = [
            { name: "v-model", description: `${prop[1] || ""}\n\n> 该属性支持 \`v-model\` 双向绑定` },
            { name: "model-value", description: `${prop[1] || ""}\n\n> 该属性支持 \`v-model\` 双向绑定` },
            { name: "modelValue", description: `${prop[1] || ""}\n\n> 该属性支持 \`v-model\` 双向绑定` }
        ];
        // 确保所有v-model形式都存在
        vModelForms.forEach(form => {
            if (!existingNames.has(form.name)) {
                result.push({
                    name: form.name,
                    type,
                    values,
                    description: form.description,
                    default: prop[4] && prop[4] !== "-" ? prop[4] : undefined,
                    version: prop[5] && prop[5] !== "-" ? prop[5] : undefined,
                });
            }
        });
    }
    return result;
}
/**
 * 解析 Markdown 文档并提取组件信息
 * @param componentName 组件名称（不包含wd-前缀）
 * @param docSource 文档来源组件名称（可选）
 * @returns 组件信息对象
 */
function parseComponentMarkdown(componentName, docSource) {
    try {
        // 如果指定了文档来源，则使用来源文档
        const actualComponentName = docSource || componentName;
        // 尝试多种路径查找文档文件
        const possiblePaths = [
            // path.resolve(__dirname, `../src/component/${actualComponentName}.md`), // 开发环境
            path.resolve(__dirname, `./src/component/${actualComponentName}.md`), // 打包后运行环境
        ];
        let docPath = "";
        for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
                docPath = possiblePath;
                break;
            }
        }
        if (!docPath) {
            console.warn(`文档文件不存在，尝试路径: ${possiblePaths.join(", ")}`);
            return null;
        }
        // 读取文档内容
        const content = fs.readFileSync(docPath, "utf-8");
        // 如果是子组件且指定了文档来源，需要特殊处理
        if (docSource) {
            // 通用处理子组件情况，如 wd-table-col 从 table.md 中提取 TableColumn 相关信息
            // 将组件名从 kebab-case 转换为 PascalCase 用于匹配标题
            // 提取子组件 Attributes 表格
            const props = extractTableSection(content, "Attributes", componentName);
            // 提取子组件 Slot 表格（如果存在）
            const slots = extractTableSection(content, "Slot", componentName).concat(extractTableSection(content, "Slots", componentName));
            // 提取子组件 Events 表格（如果存在）
            const events = extractTableSection(content, "Events", componentName);
            // 提取子组件外部样式类表格（如果存在）
            const externalClasses = extractTableSection(content, "外部样式类", componentName);
            // 提取自定义数据结构表格（如 Action 数据结构、Panel 数据结构等）
            const dataStructures = extractDataStructures(content);
            // 返回子组件信息对象
            return {
                name: `wd-${componentName}`,
                props: props.reduce((acc, prop) => {
                    return acc.concat(processComponentProp(prop));
                }, []),
                events: events.map((event) => ({
                    name: event[0],
                    description: event[1] || "",
                    version: event[3] && event[3] !== "-" ? event[3] : undefined,
                })),
                slots: slots.length > 0
                    ? slots.map((slot) => ({
                        name: slot[0],
                        description: slot[1] || "",
                        version: slot[2] && slot[2] !== "-" ? slot[2] : undefined,
                    }))
                    : undefined,
                externalClasses: externalClasses.length > 0
                    ? externalClasses.map((externalClass) => ({
                        name: externalClass[0],
                        description: externalClass[1] || "",
                        version: externalClass[2] && externalClass[2] !== "-"
                            ? externalClass[2]
                            : undefined,
                    }))
                    : undefined,
                dataStructures: dataStructures.length > 0 ? dataStructures : undefined,
                documentation: content,
            };
        }
        // 提取 Attributes 表格
        const props = extractTableSection(content, "Attributes");
        // 提取 Events 表格
        const events = extractTableSection(content, "Events");
        // 提取 Slots 表格（如果存在）
        const slots = extractTableSection(content, "Slot").concat(extractTableSection(content, "Slots"));
        // 提取外部样式类表格（如果存在）
        const externalClasses = extractTableSection(content, "外部样式类");
        // 提取自定义数据结构表格（如 Action 数据结构、Panel 数据结构等）
        const dataStructures = extractDataStructures(content);
        // 返回组件信息对象
        return {
            name: `wd-${componentName}`,
            props: props.reduce((acc, prop) => {
                return acc.concat(processComponentProp(prop));
            }, []),
            events: events.map((event) => ({
                name: event[0],
                description: event[1] || "",
                version: event[3] && event[3] !== "-" ? event[3] : undefined,
            })),
            slots: slots.length > 0
                ? slots.map((slot) => ({
                    name: slot[0],
                    description: slot[1] || "",
                    version: slot[2] && slot[2] !== "-" ? slot[2] : undefined,
                }))
                : undefined,
            externalClasses: externalClasses.length > 0
                ? externalClasses.map((externalClass) => ({
                    name: externalClass[0],
                    description: externalClass[1] || "",
                    version: externalClass[2] && externalClass[2] !== "-"
                        ? externalClass[2]
                        : undefined,
                }))
                : undefined,
            dataStructures: dataStructures.length > 0 ? dataStructures : undefined,
            documentation: content,
        };
    }
    catch (error) {
        console.error(`解析文档文件失败: ${componentName}`, error);
        return null;
    }
}
/**
 * 从 Markdown 内容中提取指定标题下的表格内容
 * @param content       Markdown 全文
 * @param sectionTitle  段落标题，如 "Attributes"
 * @param componentName 组件短横线名，如 "cell"
 * @returns             表格数据数组
 */
function extractTableSection(content, sectionTitle, componentName) {
    const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    /* 公用：从第一个 '|' 到 '\n\n'，再去掉表头 */
    const sliceTable = (src, from) => {
        const end = src.indexOf('\n\n', from);
        const raw = src.substring(from, end === -1 ? src.length : end);
        const lines = raw.split('\n').filter(l => l.trim() && l.includes('|'));
        if (lines.length < 3)
            return [];
        return lines.slice(2).map(line => line.split('|')
            .map(cell => cell.trim())
            .filter((_, i, arr) => i > 0 && i < arr.length - 1)).filter(row => row.length > 0);
    };
    /* ===== 1. 精确匹配：整行等于 "## PascalCase Attributes" ===== */
    if (componentName) {
        const pascal = componentName
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join('');
        const exactReg = new RegExp(`(?:^|\\n)#{2,3}\\s*${pascal}\\s+${escape(sectionTitle)}\\s*$`, 'im');
        const m = exactReg.exec(content);
        if (m) {
            const pipe = content.indexOf('|', m.index + m[0].length);
            if (pipe !== -1)
                return sliceTable(content, pipe);
        }
    }
    /* ===== 2. 模糊匹配：行内包含组件名+标题 ===== */
    if (componentName) {
        const pascal = componentName
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join('');
        const fuzzyReg = new RegExp(`(?:^|\\n)#{2,3}\\s*\\w*${pascal}\\w*\\s+${escape(sectionTitle)}\\s*$`, 'im');
        const m = fuzzyReg.exec(content);
        if (m) {
            const pipe = content.indexOf('|', m.index + m[0].length);
            if (pipe !== -1)
                return sliceTable(content, pipe);
        }
    }
    /* ===== 3. 通用回落：纯 "## Attributes" ===== */
    const normalReg = new RegExp(`(?:^|\\n)#{2,3}\\s*${escape(sectionTitle)}\\s*$`, 'im');
    const m = normalReg.exec(content);
    if (m) {
        const pipe = content.indexOf('|', m.index + m[0].length);
        if (pipe !== -1)
            return sliceTable(content, pipe);
    }
    return [];
}
/**
 * 提取自定义数据结构信息
 * @param content Markdown 内容
 * @returns 数据结构数组
 */
function extractDataStructures(content) {
    const dataStructures = [];
    // 查找所有 "xxx 数据结构" 标题
    const dataStructureRegex = /\n## (.*?数据结构)\n\n([\s\S]*?)(?=\n## |\n### |\n\[|\Z)/g;
    let match;
    while ((match = dataStructureRegex.exec(content)) !== null) {
        const structureName = match[1].trim();
        const tableContent = match[2];
        // 解析数据结构表格
        const lines = tableContent.split("\n").filter((line) => line.trim() !== "");
        if (lines.length >= 3) {
            // 移除表头分隔行
            const dataLines = lines.slice(2);
            // 解析每行数据
            const fields = dataLines
                .map((line) => {
                const cells = line
                    .split("|")
                    .map((cell) => cell.trim())
                    .filter((cell) => cell);
                if (cells.length >= 3) {
                    return {
                        name: cells[0],
                        type: cells[2],
                        description: cells[1] || "",
                        version: cells[3] && cells[3] !== "-" ? cells[3] : undefined,
                    };
                }
                return null;
            })
                .filter((field) => field !== null);
            dataStructures.push({
                name: structureName,
                fields,
            });
        }
    }
    return dataStructures;
}
/**
 * 同步读取组件文档内容
 * @param componentName 组件名称（不包含wd-前缀）
 * @param docSource 文档来源组件名称（可选）
 * @returns 组件文档内容
 */
function loadComponentDoc(componentName, docSource) {
    try {
        // 如果指定了文档来源，则使用来源文档
        const actualComponentName = docSource || componentName;
        // 尝试多种路径查找文档文件
        const possiblePaths = [
            // path.resolve(__dirname, `../src/component/${actualComponentName}.md`), // 开发环境
            path.resolve(__dirname, `./src/component/${actualComponentName}.md`), // 打包后运行环境
        ];
        let docPath = "";
        for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
                docPath = possiblePath;
                break;
            }
        }
        if (!docPath) {
            console.warn(`文档文件不存在，尝试路径: ${possiblePaths.join(", ")}`);
            return "";
        }
        // 读取文档内容
        const content = fs.readFileSync(docPath, "utf-8");
        console.log(`加载文档: ${componentName}`);
        return content;
    }
    catch (error) {
        console.error(`读取文档文件失败: ${componentName}`, error);
        return "";
    }
}
/**
 * 异步读取组件文档内容
 * @param componentName 组件名称（不包含wd-前缀）
 * @param docSource 文档来源组件名称（可选）
 * @returns 组件文档内容
 */
async function loadComponentDocAsync(componentName, docSource) {
    try {
        // 如果指定了文档来源，则使用来源文档
        const actualComponentName = docSource || componentName;
        // 尝试多种路径查找文档文件
        const possiblePaths = [
            // path.resolve(__dirname, `../src/component/${actualComponentName}.md`), // 开发环境
            path.resolve(__dirname, `./src/component/${actualComponentName}.md`), // 打包后运行环境
        ];
        let docPath = "";
        for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
                docPath = possiblePath;
                break;
            }
        }
        if (!docPath) {
            console.warn(`文档文件不存在，尝试路径: ${possiblePaths.join(", ")}`);
            return "";
        }
        // 使用 Promise 方式读取文件
        const content = await fs.promises.readFile(docPath, "utf-8");
        return content;
    }
    catch (error) {
        console.error(`读取文档文件失败: ${componentName}`, error);
        return "";
    }
}


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GenericComponentDiagnosticProvider = exports.GenericComponentHoverProvider = exports.GenericComponentCompletionProvider = void 0;
const vscode = __importStar(__webpack_require__(2));
const index_1 = __webpack_require__(9);
/**
 * 通用组件完成项提供者
 */
class GenericComponentCompletionProvider extends index_1.ComponentCompletionProvider {
    componentName;
    componentMeta;
    constructor(componentName, componentMeta) {
        super();
        this.componentName = componentName;
        this.componentMeta = componentMeta;
    }
    getTagSnippet(isKebab = true) {
        const tagName = isKebab ? this.componentName : this.componentName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        return new vscode.SnippetString(`${tagName}$0></${tagName}>`);
    }
}
exports.GenericComponentCompletionProvider = GenericComponentCompletionProvider;
/**
 * 通用组件悬停提供者
 */
class GenericComponentHoverProvider extends index_1.ComponentHoverProvider {
    componentName;
    componentMeta;
    constructor(componentName, componentMeta) {
        super();
        this.componentName = componentName;
        this.componentMeta = componentMeta;
    }
}
exports.GenericComponentHoverProvider = GenericComponentHoverProvider;
/**
 * 通用组件诊断提供者
 */
class GenericComponentDiagnosticProvider extends index_1.ComponentDiagnosticProvider {
    componentName;
    componentMeta;
    constructor(componentName, componentMeta) {
        super();
        this.componentName = componentName;
        this.componentMeta = componentMeta;
    }
    getAdditionalDiagnostics(tag, range, diagnostics) {
        // 默认实现不添加额外诊断
    }
}
exports.GenericComponentDiagnosticProvider = GenericComponentDiagnosticProvider;


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentDiagnosticProvider = exports.ComponentHoverProvider = exports.ComponentCompletionProvider = void 0;
exports.isOnTagName = isOnTagName;
exports.getAttributeInfoAtPosition = getAttributeInfoAtPosition;
const vscode = __importStar(__webpack_require__(2));
// ======================== 工具函数 ========================
// 转义正则表达式特殊字符
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// 驼峰式转短横线式
function camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}
// 短横线式转驼峰式
function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
/**
 * 判断光标是否在标签名上（支持驼峰和短横线式）
 */
function isOnTagName(document, position, tagName) {
    const line = document.lineAt(position);
    const lineText = line.text;
    const cursorOffset = position.character;
    // 1. 向左查找 '<'
    let tagStart = -1;
    for (let i = cursorOffset; i >= 0; i--) {
        if (lineText[i] === "<") {
            tagStart = i;
            break;
        }
    }
    if (tagStart === -1)
        return false;
    // 2. 同时匹配驼峰和短横线式
    const kebabTagName = camelToKebab(tagName);
    const tagRegex = new RegExp(`^<\\/?(${escapeRegExp(tagName)}|${escapeRegExp(kebabTagName)})`);
    const tagPrefix = lineText.substring(tagStart);
    const match = tagPrefix.match(tagRegex);
    if (!match)
        return false;
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
function getAttributeInfoAtPosition(document, position) {
    /* ---------- 1. 找到标签开始、结束位置（跨行） ---------- */
    let openAngle = -1;
    // 向前找最近的 <
    for (let line = position.line; line >= 0; line--) {
        const txt = document.lineAt(line).text;
        const col = line === position.line ? position.character : txt.length - 1;
        for (let i = col; i >= 0; i--) {
            if (txt[i] === "<") {
                openAngle = document.offsetAt(new vscode.Position(line, i));
                break;
            }
        }
        if (openAngle !== -1)
            break;
    }
    if (openAngle === -1)
        return null;
    let closeAngle = -1;
    // 向后找最近的 >
    for (let line = position.line, lineCount = document.lineCount; line < lineCount; line++) {
        const txt = document.lineAt(line).text;
        const startCol = line === position.line ? position.character : 0;
        for (let i = startCol; i < txt.length; i++) {
            if (txt[i] === ">") {
                closeAngle = document.offsetAt(new vscode.Position(line, i)) + 1;
                break;
            }
        }
        if (closeAngle !== -1)
            break;
    }
    if (closeAngle === -1)
        return null; // 没找到闭合
    /* ---------- 2. 取出完整标签文本 ---------- */
    const tagRange = new vscode.Range(document.positionAt(openAngle), document.positionAt(closeAngle));
    const tagContent = document.getText(tagRange); // 跨行也一次性拿到
    /* ---------- 3. 以下是你原来的逻辑 ---------- */
    const tagNameMatch = tagContent.match(/^<([a-zA-Z0-9-]+)/);
    if (!tagNameMatch)
        return null;
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
        const attrEnd = attrStart + fullMatch.length;
        if (cursorOffset >= attrStart && cursorOffset <= attrEnd) {
            return {
                attrName, // 保持原始格式用于匹配
                tagName,
                isEvent: fullMatch.startsWith("@") || fullMatch.startsWith("v-on:"),
                isDynamic: fullMatch.startsWith(":") || fullMatch.startsWith("v-bind:"),
            };
        }
    }
    return null;
}
// ======================== 补全提供者 ========================
/**
 * 通用组件完成项提供者基类（支持驼峰和短横线式属性）
 */
class ComponentCompletionProvider {
    provideCompletionItems(document, position) {
        const linePrefix = document
            .lineAt(position)
            .text.substring(0, position.character);
        // 1. 组件标签补全（支持驼峰和短横线式）
        const kebabComponentName = camelToKebab(this.componentName);
        const tagRegex = new RegExp(`<(${this.componentName.replace(/-/g, "(-)?")}|${kebabComponentName}(\\s+[^>]*)?)?$`);
        const matchResult = linePrefix.match(tagRegex);
        if (matchResult) {
            // 创建两种形式的标签补全
            const items = [];
            // 短横线式标签
            const kebabItem = new vscode.CompletionItem(kebabComponentName, // 添加测试前缀使其更明显
            vscode.CompletionItemKind.Class);
            kebabItem.documentation = new vscode.MarkdownString(this.componentMeta.documentation);
            kebabItem.label = {
                label: kebabComponentName,
                description: 'Wot UI IntelliSense'
            },
                kebabItem.insertText = this.getTagSnippet(true);
            kebabItem.sortText = '0';
            kebabItem.preselect = true;
            kebabItem.kind = vscode.CompletionItemKind.Snippet;
            kebabItem.command = { command: 'editor.action.triggerSuggest', title: '' };
            items.push(kebabItem);
            /* 🔑 强制展开详情面板 → 第一次 Ctrl+Space 就能看到 detail */
            return items;
        }
        // 2. 属性补全（增强支持所有Vue写法）
        const attrContextRegex = new RegExp(`<(${this.componentName}|${kebabComponentName})\\b[^>]*$`);
        const eventContextRegex = /(@|v-on:)[a-zA-Z0-9-]*$/;
        const dynamicAttrContextRegex = /(:|v-bind:)[a-zA-Z0-9-]*$/;
        if (linePrefix.match(attrContextRegex)) {
            const items = [];
            // 静态属性补全（同时提供驼峰式和短横线式）
            this.componentMeta.props.forEach((prop) => {
                // 驼峰式补全项
                const camelItem = this.createPropCompletionItem(prop, false);
                items.push(camelItem);
                // 短横线式补全项
                const kebabItem = this.createPropCompletionItem(prop, true);
                items.push(kebabItem);
            });
            // 动态属性补全（同时提供两种形式）
            this.componentMeta.props.forEach((prop) => {
                // 驼峰式动态绑定
                const camelDynamicItem = this.createDynamicPropItem(prop, false);
                items.push(camelDynamicItem);
                // 短横线式动态绑定
                const kebabDynamicItem = this.createDynamicPropItem(prop, true);
                items.push(kebabDynamicItem);
            });
            // 事件补全（同时提供两种形式）
            this.componentMeta.events?.forEach((event) => {
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
            const items = [];
            this.componentMeta.events?.forEach((event) => {
                // 驼峰式事件名
                const camelItem = new vscode.CompletionItem(event.name, vscode.CompletionItemKind.Event);
                camelItem.documentation = event.description;
                camelItem.insertText = new vscode.SnippetString(`${event.name}="\${1:handler}"`);
                camelItem.detail = "驼峰式事件";
                items.push(camelItem);
                // 短横线式事件名
                const kebabItem = new vscode.CompletionItem(camelToKebab(event.name), vscode.CompletionItemKind.Event);
                kebabItem.documentation = event.description;
                kebabItem.insertText = new vscode.SnippetString(`${camelToKebab(event.name)}="\${1:handler}"`);
                kebabItem.detail = "短横线式事件";
                items.push(kebabItem);
            });
            return items;
        }
        // 4. 动态属性上下文补全（当输入:或v-bind:时）
        if (linePrefix.match(dynamicAttrContextRegex)) {
            const items = [];
            this.componentMeta.props.forEach((prop) => {
                // 驼峰式属性名
                const camelItem = new vscode.CompletionItem(prop.name, vscode.CompletionItemKind.Property);
                camelItem.documentation = prop.description;
                camelItem.insertText = new vscode.SnippetString(`${prop.name}="\${1:value}"`);
                camelItem.detail = "驼峰式属性";
                items.push(camelItem);
                // 短横线式属性名
                const kebabItem = new vscode.CompletionItem(camelToKebab(prop.name), vscode.CompletionItemKind.Property);
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
    createPropCompletionItem(prop, isKebabCase) {
        const propName = isKebabCase ? camelToKebab(prop.name) : prop.name;
        const item = new vscode.CompletionItem(propName, vscode.CompletionItemKind.Property);
        item.documentation = prop.description;
        item.detail = isKebabCase ? "短横线式属性" : "驼峰式属性";
        if (prop.type === "enum") {
            item.insertText = new vscode.SnippetString(`${propName}="\${1|${prop.values.join(",")}|}"`);
        }
        else if (prop.type === "boolean") {
            // 布尔属性支持简写（仅驼峰式）
            if (!isKebabCase) {
                const booleanItem = new vscode.CompletionItem(prop.name, vscode.CompletionItemKind.Property);
                booleanItem.documentation = prop.description;
                booleanItem.insertText = prop.name;
                booleanItem.detail = "驼峰式属性（简写）";
                return booleanItem;
            }
            item.insertText = new vscode.SnippetString(`${propName}="\${1|true,false|}"`);
        }
        else {
            item.insertText = new vscode.SnippetString(`${propName}="$1"`);
        }
        return item;
    }
    // 创建动态属性补全项
    createDynamicPropItem(prop, isKebabCase) {
        const propName = isKebabCase ? camelToKebab(prop.name) : prop.name;
        const prefix = ":";
        const item = new vscode.CompletionItem(`${prefix}${propName}`, vscode.CompletionItemKind.Property);
        item.documentation = new vscode.MarkdownString(`**动态绑定** (${isKebabCase ? "短横线式" : "驼峰式"})\n\n${prop.description}\n\n类型: ${prop.type}`);
        item.insertText = new vscode.SnippetString(`${prefix}${propName}="\${1:value}"`);
        item.detail = isKebabCase ? "短横线式动态属性" : "驼峰式动态属性";
        return item;
    }
    // 创建事件补全项
    createEventItem(event, isKebabCase) {
        const eventName = isKebabCase ? camelToKebab(event.name) : event.name;
        const prefix = "@";
        const item = new vscode.CompletionItem(`${prefix}${eventName}`, vscode.CompletionItemKind.Event);
        item.documentation = new vscode.MarkdownString(`**事件** (${isKebabCase ? "短横线式" : "驼峰式"})\n\n${event.description}`);
        item.insertText = new vscode.SnippetString(`${prefix}${eventName}="\${1:handler}"`);
        item.detail = isKebabCase ? "短横线式事件" : "驼峰式事件";
        return item;
    }
}
exports.ComponentCompletionProvider = ComponentCompletionProvider;
// ======================== 悬停提供者 ========================
/**
 * 通用组件悬停提供者基类（支持驼峰和短横线式属性）
 */
class ComponentHoverProvider {
    provideHover(document, position) {
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
            if (attrInfo &&
                (attrInfo.tagName === this.componentName.replace("wd-", "") ||
                    attrInfo.tagName === kebabComponentName ||
                    attrInfo.tagName === kebabComponentName.replace("wd-", ""))) {
                // 处理通用属性
                if (attrInfo.attrName === "customClass") {
                    const markdown = new vscode.MarkdownString();
                    markdown.isTrusted = true;
                    markdown.supportHtml = true;
                    markdown.appendMarkdown("### 外部样式类\n\n");
                    markdown.appendMarkdown("`custom-class` 自定义样式类名，用于覆盖组件默认样式\n\n");
                    markdown.appendMarkdown("**类型**: string\n\n");
                    return new vscode.Hover(markdown);
                }
                if (attrInfo.attrName === "customStyle") {
                    const markdown = new vscode.MarkdownString();
                    markdown.isTrusted = true;
                    markdown.supportHtml = true;
                    markdown.appendMarkdown("### 外部样式类\n\n");
                    markdown.appendMarkdown("`custom-style` 自定义样式，用于覆盖组件默认样式\n\n");
                    markdown.appendMarkdown("**类型**: string\n\n");
                    return new vscode.Hover(markdown);
                }
                let prop, event;
                // 同时匹配驼峰式和短横线式
                const findProp = (name) => this.componentMeta.props.find((p) => p.name === name ||
                    camelToKebab(p.name) === name ||
                    kebabToCamel(p.name) === name);
                const findEvent = (name) => this.componentMeta.events?.find((e) => e.name === name ||
                    camelToKebab(e.name) === name ||
                    kebabToCamel(e.name) === name);
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
                        markdown.appendMarkdown(`### ${attrInfo.isDynamic ? "动态事件" : "事件"} \`${event.name}\`\n\n`);
                        markdown.appendMarkdown(`${event.description}\n\n`);
                        markdown.appendMarkdown(`**类型**: 事件处理器\n\n`);
                        if (event.arguments) {
                            markdown.appendMarkdown(`**事件参数**: \n`);
                            event.arguments.forEach((arg) => {
                                markdown.appendMarkdown(`- \`${arg.name}\`: ${arg.type} - ${arg.description}\n`);
                            });
                            markdown.appendMarkdown("\n");
                        }
                        return new vscode.Hover(markdown);
                    }
                }
                else {
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
                        markdown.appendMarkdown(`### ${attrInfo.isDynamic ? "动态属性" : "属性"} \`${prop.name}\`\n\n`);
                        markdown.appendMarkdown(`${prop.description}\n\n`);
                        markdown.appendMarkdown(`**类型**: ${prop.type}\n\n`);
                        if (prop.values) {
                            markdown.appendMarkdown(`**可选值**: ${prop.values.join(", ")}\n\n`);
                        }
                        if (prop.default) {
                            markdown.appendMarkdown(`**默认值**: ${prop.default}\n\n`);
                        }
                        return new vscode.Hover(markdown);
                    }
                }
            }
            return null;
        }
        catch (error) {
            console.error("Error in provideHover:", error);
            return null;
        }
    }
}
exports.ComponentHoverProvider = ComponentHoverProvider;
// ======================== 诊断提供者 ========================
/**
 * 通用组件诊断提供者基类（支持驼峰和短横线式属性）
 */
class ComponentDiagnosticProvider {
    diagnosticCollection;
    constructor() {
        vscode.workspace.onDidChangeTextDocument((e) => this.updateDiagnostics(e.document));
    }
    initialize() {
        if (!this.diagnosticCollection) {
            this.diagnosticCollection = vscode.languages.createDiagnosticCollection(this.componentName);
        }
    }
    updateDiagnostics(document) {
        if (document.languageId !== "html" && document.languageId !== "vue")
            return;
        this.initialize();
        const diagnostics = [];
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
    getTagRegex() {
        const kebabComponentName = camelToKebab(this.componentName);
        return new RegExp(`<(${this.componentName}|${kebabComponentName})\\s+[^>]*>`, "g");
    }
    checkAttributeValues(tag, range, diagnostics) {
        this.componentMeta.props
            .filter((prop) => prop.type === "enum")
            .forEach((prop) => {
            // 同时检查驼峰式和短横线式
            const propNames = [prop.name, camelToKebab(prop.name)];
            propNames.forEach((propName) => {
                // 检查静态属性
                const staticAttrMatch = tag.match(new RegExp(`${propName}=["']([^"']+)["']`));
                if (staticAttrMatch && !prop.values.includes(staticAttrMatch[1])) {
                    diagnostics.push({
                        severity: vscode.DiagnosticSeverity.Error,
                        range: range,
                        message: `无效的 ${propName} 属性值: ${staticAttrMatch[1]}`,
                        source: "Wot UI IntelliSense",
                    });
                }
                // 检查动态属性值（需要静态值的情况）
                const dynamicAttrMatch = tag.match(new RegExp(`:${propName}=["']([^"']+)["']`));
                if (dynamicAttrMatch && !prop.values.includes(dynamicAttrMatch[1])) {
                    diagnostics.push({
                        severity: vscode.DiagnosticSeverity.Warning,
                        range: range,
                        message: `动态属性 :${propName} 使用了静态值，建议使用变量`,
                        source: "Wot UI IntelliSense",
                    });
                }
            });
        });
    }
    checkDuplicateAttributes(tag, range, diagnostics) {
        const attrs = tag.match(/(?:v-bind:|v-on:|@|:)?([a-zA-Z0-9-_.]+)=?/g) || [];
        const attrMap = new Map();
        attrs.forEach((attr) => {
            const match = attr.match(/(?:v-bind:|v-on:|@|:)?([a-zA-Z0-9-_.]+)/);
            if (!match)
                return;
            const rawName = match[1];
            // 标准化属性名（统一转为驼峰式）
            const normalizedName = kebabToCamel(rawName);
            if (attrMap.has(normalizedName)) {
                const originalRawName = attrMap.get(normalizedName);
                diagnostics.push({
                    severity: vscode.DiagnosticSeverity.Warning,
                    range: range,
                    message: `重复的属性: ${originalRawName} 和 ${rawName} 都映射到 ${normalizedName}`,
                    source: "Wot UI IntelliSense",
                });
            }
            else {
                attrMap.set(normalizedName, rawName);
            }
        });
    }
    checkEventHandlers(tag, range, diagnostics) {
        this.componentMeta.events?.forEach((event) => {
            // 同时检查驼峰式和短横线式
            const eventNames = [event.name, camelToKebab(event.name)];
            eventNames.forEach((eventName) => {
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
                            source: "Wot UI IntelliSense",
                        });
                    }
                    else if (!handler.includes("(") &&
                        !handler.includes(")") &&
                        !handler.startsWith("$event")) {
                        diagnostics.push({
                            severity: vscode.DiagnosticSeverity.Warning,
                            range: range,
                            message: `事件处理器应包含括号: ${handler}()`,
                            source: "Wot UI IntelliSense",
                        });
                    }
                }
            });
        });
    }
    checkBooleanAttributes(tag, range, diagnostics) {
        this.componentMeta.props
            .filter((prop) => prop.type === "boolean")
            .forEach((prop) => {
            // 同时检查驼峰式和短横线式
            const propNames = [prop.name, camelToKebab(prop.name)];
            propNames.forEach((propName) => {
                // 检查静态布尔属性是否有值
                const staticAttrMatch = tag.match(new RegExp(`${propName}=["']([^"']*)["']`));
                if (staticAttrMatch) {
                    const value = staticAttrMatch[1];
                    if (value && value !== "true" && value !== "false") {
                        diagnostics.push({
                            severity: vscode.DiagnosticSeverity.Warning,
                            range: range,
                            message: `布尔属性 ${propName} 应使用简写或动态绑定`,
                            source: "Wot UI IntelliSense",
                        });
                    }
                }
            });
        });
    }
}
exports.ComponentDiagnosticProvider = ComponentDiagnosticProvider;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const index_1 = __webpack_require__(1);
async function activate(context) {
    console.log('🚀 Wot UI IntelliSense 插件已激活!');
    console.log('正在注册组件...');
    await (0, index_1.registerAll)(context);
    console.log('✅ Wot UI IntelliSense 插件注册完成!');
}
async function deactivate() {
    console.log('🚫 Wot UI IntelliSense 插件已停用!');
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map