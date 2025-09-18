/**
 * 种子数据配置
 * 定义要生成的测试数据结构
 */

export interface SeedNodeData {
  title: string;
  description?: string;
  children?: SeedNodeData[];
}

export interface SeedRootData {
  title: string;
  description?: string;
  children?: SeedNodeData[];
}

/**
 * 生成随机的 Tiptap 内容
 * @param title 节点标题
 * @param description 节点描述
 * @returns 符合 Tiptap 结构的内容对象
 */
export function generateRandomContent(
  title: string,
  description?: string,
): any {
  // 基础段落内容
  const paragraphs = [
    `这是关于 "${title}" 的详细内容。在这里您可以添加更多关于这个主题的信息和说明。`,
    description ? `正如描述中提到的：${description}` : '',
    '您可以在这里添加更多详细信息，包括文本、图片、链接等内容。',
    '这个编辑器支持多种内容格式，包括标题、段落、列表、引用等。',
  ].filter((p) => p.length > 0);

  // 随机决定是否添加列表
  const shouldAddList = Math.random() > 0.5;

  // 随机决定是否添加引用
  const shouldAddBlockquote = Math.random() > 0.7;

  // 随机决定是否添加图片
  const shouldAddImage = Math.random() > 0.8;

  const content: any[] = [
    {
      type: 'heading',
      attrs: {
        level: 1,
      },
      content: [
        {
          type: 'text',
          text: title,
        },
      ],
    },
  ];

  // 添加段落
  paragraphs.forEach((paragraph) => {
    if (paragraph) {
      content.push({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: paragraph,
          },
        ],
      });
    }
  });

  // 随机添加列表
  if (shouldAddList) {
    content.push({
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '这是列表项目 1',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '这是列表项目 2',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '这是列表项目 3',
                },
              ],
            },
          ],
        },
      ],
    });
  }

  // 随机添加引用
  if (shouldAddBlockquote) {
    content.push({
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '这是一个引用块，可以用来突出显示重要的信息或名言。',
            },
          ],
        },
      ],
    });
  }

  // 随机添加图片（使用占位符）
  if (shouldAddImage) {
    content.push({
      type: 'paragraph',
    });

    content.push({
      type: 'image',
      attrs: {
        src: `https://placehold.co/600x400?text=${  encodeURIComponent(title)}`,
        alt: title,
        title,
        width: 600,
        height: 400,
      },
    });
  }

  return {
    type: 'doc',
    content,
  };
}

/**
 * 种子数据定义
 * 这里定义了要生成的所有根节点和对应的思维导图树结构
 */
export const SEED_DATA: SeedRootData[] = [
  {
    title: '前端开发技能树',
    description: '全栈前端开发学习路径，从基础到高级的完整技能体系',
    children: [
      {
        title: 'HTML & CSS 基础',
        description: '网页结构和样式基础，现代前端开发的根基',
        children: [
          {
            title: 'HTML5 语义化标签',
            description: '掌握现代HTML标签使用，提升网页可访问性和SEO',
          },
          {
            title: 'CSS3 新特性',
            description: '动画、变换、网格布局、弹性盒子等现代CSS技术',
          },
          {
            title: '响应式设计',
            description: '移动端适配、媒体查询、流式布局设计原则',
          },
          {
            title: 'CSS预处理器',
            description: 'Sass、Less等预处理器的使用和最佳实践',
          },
        ],
      },
      {
        title: 'JavaScript 核心',
        description: 'JS语言核心概念和高级特性，现代前端开发必备',
        children: [
          {
            title: 'ES6+ 语法',
            description: '箭头函数、解构赋值、模块化、类等现代JS语法',
          },
          {
            title: '异步编程',
            description: 'Promise、async/await、事件循环、微任务宏任务',
          },
          {
            title: 'DOM 操作',
            description: '元素选择、事件处理、动态内容操作和性能优化',
          },
          {
            title: '函数式编程',
            description: '高阶函数、闭包、纯函数、不可变性等概念',
          },
        ],
      },
      {
        title: 'React 生态',
        description: 'React框架及其生态系统，现代前端开发主流选择',
        children: [
          {
            title: 'React 基础',
            description: '组件、状态管理、生命周期、JSX语法',
          },
          {
            title: 'React Hooks',
            description: 'useState、useEffect、useContext等钩子函数',
          },
          {
            title: 'Next.js',
            description: '全栈React框架，SSR、SSG、API路由等功能',
          },
          {
            title: '状态管理',
            description: 'Redux、Zustand、Context API等状态管理方案',
          },
        ],
      },
      {
        title: '工程化工具',
        description: '现代前端开发工具链和最佳实践',
        children: [
          {
            title: '构建工具',
            description: 'Webpack、Vite、Rollup等模块打包工具',
          },
          {
            title: '代码质量',
            description: 'ESLint、Prettier、TypeScript等代码规范工具',
          },
          {
            title: '测试框架',
            description: 'Jest、React Testing Library、Cypress等测试工具',
          },
        ],
      },
    ],
  },
  {
    title: '后端开发路线',
    description: 'Node.js后端开发学习计划，构建可扩展的服务端应用',
    children: [
      {
        title: 'Node.js 基础',
        description: '服务端JavaScript运行环境，后端开发基础',
        children: [
          {
            title: '模块系统',
            description: 'CommonJS和ES模块，包管理和依赖处理',
          },
          {
            title: '文件系统操作',
            description: 'fs模块、路径处理、文件读写和流操作',
          },
          {
            title: 'HTTP服务器',
            description: '创建和配置Web服务器，处理请求和响应',
          },
          {
            title: '异步编程',
            description: '事件循环、回调、Promise在服务端的应用',
          },
        ],
      },
      {
        title: 'NestJS 框架',
        description: '企业级Node.js框架，构建可维护的大型应用',
        children: [
          {
            title: '依赖注入',
            description: '控制反转、模块化设计、服务提供者模式',
          },
          {
            title: 'RESTful API',
            description: 'API设计原则、路由处理、中间件使用',
          },
          {
            title: '数据库集成',
            description: 'MongoDB、MySQL等数据库操作和ORM使用',
          },
          {
            title: '认证授权',
            description: 'JWT、OAuth、权限控制和安全最佳实践',
          },
        ],
      },
      {
        title: '数据库设计',
        description: '数据建模和数据库优化',
        children: [
          {
            title: 'MongoDB',
            description: 'NoSQL数据库设计、聚合查询、索引优化',
          },
          {
            title: 'SQL数据库',
            description: 'MySQL、PostgreSQL关系型数据库设计',
          },
          {
            title: '缓存策略',
            description: 'Redis缓存、内存缓存、缓存失效策略',
          },
        ],
      },
    ],
  },
  {
    title: '数据科学入门',
    description: 'Python数据分析和机器学习，从数据到洞察的完整流程',
    children: [
      {
        title: 'Python 基础',
        description: 'Python编程语言基础，数据科学的编程基础',
        children: [
          {
            title: '语法基础',
            description: '变量、函数、类和模块，Python核心语法',
          },
          {
            title: '数据结构',
            description: '列表、字典、集合、元组等内置数据类型',
          },
          {
            title: '面向对象',
            description: '类、继承、多态、封装等OOP概念',
          },
        ],
      },
      {
        title: '数据分析',
        description: '数据处理、清洗、分析和可视化',
        children: [
          {
            title: 'Pandas',
            description: '数据处理和分析库，DataFrame操作',
          },
          {
            title: 'NumPy',
            description: '数值计算库，多维数组操作',
          },
          {
            title: 'Matplotlib',
            description: '数据可视化，图表绘制和定制',
          },
          {
            title: 'Seaborn',
            description: '统计数据可视化，高级图表库',
          },
        ],
      },
      {
        title: '机器学习',
        description: '机器学习算法和模型训练',
        children: [
          {
            title: 'Scikit-learn',
            description: '机器学习库，分类、回归、聚类算法',
          },
          {
            title: '特征工程',
            description: '数据预处理、特征选择和特征构造',
          },
          {
            title: '模型评估',
            description: '交叉验证、性能指标、模型选择',
          },
        ],
      },
    ],
  },
  {
    title: '移动端开发',
    description: 'iOS和Android移动应用开发技能树',
    children: [
      {
        title: 'React Native',
        description: '跨平台移动应用开发框架',
        children: [
          {
            title: '基础组件',
            description: 'View、Text、Image等基础UI组件',
          },
          {
            title: '导航系统',
            description: 'React Navigation路由和页面管理',
          },
          {
            title: '原生模块',
            description: '桥接原生功能，平台特定代码',
          },
        ],
      },
      {
        title: 'Flutter',
        description: 'Google跨平台移动开发框架',
        children: [
          {
            title: 'Dart语言',
            description: 'Flutter开发语言基础',
          },
          {
            title: 'Widget系统',
            description: 'Flutter UI组件和布局系统',
          },
          {
            title: '状态管理',
            description: 'Provider、Bloc等状态管理方案',
          },
        ],
      },
    ],
  },
  {
    title: 'DevOps与部署',
    description: '开发运维一体化，自动化部署和运维管理',
    children: [
      {
        title: '容器化技术',
        description: 'Docker和Kubernetes容器编排',
        children: [
          {
            title: 'Docker基础',
            description: '容器创建、镜像构建、容器管理',
          },
          {
            title: 'Kubernetes',
            description: '容器编排、服务发现、负载均衡',
          },
        ],
      },
      {
        title: 'CI/CD',
        description: '持续集成和持续部署',
        children: [
          {
            title: 'GitHub Actions',
            description: '自动化工作流、代码检查、自动部署',
          },
          {
            title: 'Jenkins',
            description: '企业级CI/CD平台配置和使用',
          },
        ],
      },
      {
        title: '云服务',
        description: '云平台服务和架构设计',
        children: [
          {
            title: 'AWS基础',
            description: 'EC2、S3、RDS等核心服务',
          },
          {
            title: '微服务架构',
            description: '服务拆分、API网关、服务治理',
          },
        ],
      },
    ],
  },
];
