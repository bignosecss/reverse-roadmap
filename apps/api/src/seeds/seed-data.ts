import { Types } from 'mongoose';
import { RrRoot } from '../schemas/rr-root.schema';
import { RrNode } from '../schemas/rr-node.schema';
import { RrTree } from '../schemas/rr-tree.schema';

/**
 * 种子数据定义
 * 包含根节点、树结构和节点的示例数据
 */

// 根节点种子数据
export const rootSeeds: Partial<RrRoot>[] = [
  {
    title: '前端开发路线图',
    status: 'active',
  },
  {
    title: '后端开发路线图',
    status: 'active',
  },
  {
    title: '全栈开发路线图',
    status: 'active',
  },
  {
    title: '移动端开发路线图',
    status: 'archived',
  },
];

/**
 * 创建节点数据的辅助函数
 * @param title 节点标题
 * @param description 节点描述
 * @param parentId 父节点ID
 * @param children 子节点数组
 * @returns RrNode对象
 */
function createNode(
  title: string,
  description?: string,
  parentId: Types.ObjectId | null = null,
  children: RrNode[] | null = null,
): RrNode {
  return {
    _id: new Types.ObjectId(),
    title,
    description,
    parentId,
    children,
  };
}

// 前端开发路线图节点数据
export const frontendNodes = {
  // 根节点
  root: createNode('前端开发基础', '掌握现代前端开发的核心技能和工具链', null),

  // 一级子节点
  htmlCss: createNode('HTML & CSS 基础', '学习网页结构和样式的基础知识'),

  javascript: createNode(
    'JavaScript 核心',
    '掌握 JavaScript 语言特性和 ES6+ 新特性',
  ),

  frameworks: createNode('前端框架', '学习主流前端框架 React、Vue、Angular'),

  tooling: createNode('工程化工具', '掌握现代前端开发工具链和构建流程'),

  // HTML & CSS 子节点
  semanticHtml: createNode('语义化 HTML', '学习 HTML5 语义化标签和最佳实践'),

  cssLayout: createNode('CSS 布局', '掌握 Flexbox、Grid 等现代布局技术'),

  responsive: createNode('响应式设计', '学习移动端适配和响应式布局'),

  // JavaScript 子节点
  es6Plus: createNode('ES6+ 特性', '掌握箭头函数、解构、模块化等新特性'),

  asyncJs: createNode('异步编程', '理解 Promise、async/await 和事件循环'),

  dom: createNode('DOM 操作', '学习 DOM API 和事件处理'),

  // 框架子节点
  react: createNode('React', '学习 React 组件化开发和生态系统'),

  vue: createNode('Vue.js', '掌握 Vue.js 渐进式框架开发'),

  // 工具链子节点
  webpack: createNode('Webpack', '学习模块打包和构建优化'),

  vite: createNode('Vite', '掌握下一代前端构建工具'),

  typescript: createNode('TypeScript', '学习静态类型检查和类型系统'),
};

// 构建前端开发路线图的树结构
export function buildFrontendTree(): RrNode {
  // 设置父子关系
  frontendNodes.htmlCss.parentId = frontendNodes.root._id;
  frontendNodes.javascript.parentId = frontendNodes.root._id;
  frontendNodes.frameworks.parentId = frontendNodes.root._id;
  frontendNodes.tooling.parentId = frontendNodes.root._id;

  // HTML & CSS 子节点
  frontendNodes.semanticHtml.parentId = frontendNodes.htmlCss._id;
  frontendNodes.cssLayout.parentId = frontendNodes.htmlCss._id;
  frontendNodes.responsive.parentId = frontendNodes.htmlCss._id;

  // JavaScript 子节点
  frontendNodes.es6Plus.parentId = frontendNodes.javascript._id;
  frontendNodes.asyncJs.parentId = frontendNodes.javascript._id;
  frontendNodes.dom.parentId = frontendNodes.javascript._id;

  // 框架子节点
  frontendNodes.react.parentId = frontendNodes.frameworks._id;
  frontendNodes.vue.parentId = frontendNodes.frameworks._id;

  // 工具链子节点
  frontendNodes.webpack.parentId = frontendNodes.tooling._id;
  frontendNodes.vite.parentId = frontendNodes.tooling._id;
  frontendNodes.typescript.parentId = frontendNodes.tooling._id;

  // 设置子节点数组
  frontendNodes.htmlCss.children = [
    frontendNodes.semanticHtml,
    frontendNodes.cssLayout,
    frontendNodes.responsive,
  ];

  frontendNodes.javascript.children = [
    frontendNodes.es6Plus,
    frontendNodes.asyncJs,
    frontendNodes.dom,
  ];

  frontendNodes.frameworks.children = [frontendNodes.react, frontendNodes.vue];

  frontendNodes.tooling.children = [
    frontendNodes.webpack,
    frontendNodes.vite,
    frontendNodes.typescript,
  ];

  // 根节点设置一级子节点
  frontendNodes.root.children = [
    frontendNodes.htmlCss,
    frontendNodes.javascript,
    frontendNodes.frameworks,
    frontendNodes.tooling,
  ];

  return frontendNodes.root;
}

// 后端开发路线图节点数据
export const backendNodes = {
  root: createNode('后端开发基础', '掌握服务端开发的核心技能和架构设计', null),

  programming: createNode('编程语言', '选择并精通一门后端编程语言'),

  database: createNode('数据库技术', '学习关系型和非关系型数据库'),

  api: createNode('API 设计', '掌握 RESTful API 和 GraphQL 设计'),

  deployment: createNode('部署运维', '学习容器化部署和云服务'),

  // 编程语言子节点
  nodejs: createNode('Node.js', '学习 JavaScript 服务端开发'),

  python: createNode('Python', '掌握 Python 和 Django/Flask 框架'),

  java: createNode('Java', '学习 Java 和 Spring 生态系统'),

  // 数据库子节点
  mysql: createNode('MySQL', '掌握关系型数据库设计和优化'),

  mongodb: createNode('MongoDB', '学习文档型数据库和 NoSQL 概念'),

  redis: createNode('Redis', '掌握缓存和会话存储'),
};

// 构建后端开发路线图的树结构
export function buildBackendTree(): RrNode {
  // 设置父子关系
  backendNodes.programming.parentId = backendNodes.root._id;
  backendNodes.database.parentId = backendNodes.root._id;
  backendNodes.api.parentId = backendNodes.root._id;
  backendNodes.deployment.parentId = backendNodes.root._id;

  // 编程语言子节点
  backendNodes.nodejs.parentId = backendNodes.programming._id;
  backendNodes.python.parentId = backendNodes.programming._id;
  backendNodes.java.parentId = backendNodes.programming._id;

  // 数据库子节点
  backendNodes.mysql.parentId = backendNodes.database._id;
  backendNodes.mongodb.parentId = backendNodes.database._id;
  backendNodes.redis.parentId = backendNodes.database._id;

  // 设置子节点数组
  backendNodes.programming.children = [
    backendNodes.nodejs,
    backendNodes.python,
    backendNodes.java,
  ];

  backendNodes.database.children = [
    backendNodes.mysql,
    backendNodes.mongodb,
    backendNodes.redis,
  ];

  // 根节点设置一级子节点
  backendNodes.root.children = [
    backendNodes.programming,
    backendNodes.database,
    backendNodes.api,
    backendNodes.deployment,
  ];

  return backendNodes.root;
}

// 树结构种子数据生成函数
export function generateTreeSeeds(
  rootIds: Types.ObjectId[],
): Partial<RrTree>[] {
  const trees: Partial<RrTree>[] = [];

  if (rootIds.length >= 1) {
    const frontendTree = buildFrontendTree();
    trees.push({
      rootId: rootIds[0],
      rootNode: frontendTree,
    });
  }

  if (rootIds.length >= 2) {
    const backendTree = buildBackendTree();
    trees.push({
      rootId: rootIds[1],
      rootNode: backendTree,
    });
  }

  // 为其他根节点创建简单的树结构
  for (let i = 2; i < rootIds.length; i++) {
    const simpleRoot = createNode(
      `示例根节点 ${i + 1}`,
      '这是一个示例根节点，可以根据需要扩展',
    );

    const childNode = createNode(
      '示例子节点',
      '这是一个示例子节点',
      simpleRoot._id,
    );

    simpleRoot.children = [childNode];

    trees.push({
      rootId: rootIds[i],
      rootNode: simpleRoot,
    });
  }

  return trees;
}
