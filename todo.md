# Todo List

## Todos

- [ ] Reverse Roadmap 用户登录功能，如何做权限管理
- [ ] API 做一个定时任务，定期导出数据库的文档，到本地
- [ ] Canvas 中添加表格模块
- [ ] Canvas Bubble Menu 增加文本对齐方式功能（左对齐、居中、右对齐）
- [ ] Canvas 添加 TableOfContents extension，以在文档中导航标题
- [ ] Canvas 切换 tab，区分：笔记 / 感想 / 思考 等等，并且 tab 之间可以通过“链接”的方式互相引用跳转
- [ ] Canvas 在中文输入，打出字母的时候，onUpdate 也触发了，想想解决方法
  > 我记得渡一有个视频讲过，是讲的 debounce
- [ ] Canvas Content 文字内容加密
- [ ] Canvas 设置每个节点 Content 的访问密码（访问密码在传输过程中的加密，可以参考 TLS 协商中 pre-master secret 的过程）
- [ ] Canvas 想想如何添加 AI Agent
- [ ] Canvas 打开/关闭的动画效果，会导致 Canvas 内容在宽度较小时被挤压，要做一个类似渐变消失的效果
- [ ] Flow CRUD 节点时，等待途中冻结 Flow，操作结束（成功或失败）后再恢复（增加 UX，也方便探测性能）
  > Optimistic UI + 局部 Loading 标识
  > 用户点击“新增节点”时，先立即在前端添加节点（假设成功）。同时发送后端请求。如果失败 → 显示 toast/error，并 revert。
  > 视觉效果通常是：节点半透明 + loading spinner；其他节点可继续操作；Flow 不会整体锁住。
  > Figma / Notion / Miro / Draw.io / React Flow Pro demos 都是这种方式
  > 现在仅我个人使用，我当然会注意，所以该功能并不着急，要紧的是核心功能的开发，所以照此思路排优先级
- [ ] Flow 节点的 toolbar 添加一个打开 Canvas 的按钮，以后通过该按钮控制 Canvas 开关
- [ ] Flow Canvas 关闭的时候搜索定位节点，将节点定位在距离 Flow 左侧 1/4 视口宽度的位置；Canvas 打开的时候正常 center
- [ ] Flow 跟节点能够创建另外一个跟节点，当前的跟节点变为其子节点
- [ ] Flow 记忆节点位置与连线，更改节点连线等功能
- [ ] Flow Goal Page 顶部，引入AI来获取该 Goal 的内容，然后总结一句正能量鼓励文字，显示在顶部区域
- [ ] Flow 能够链接到其他的目标，在本目标中的其他目标，渲染为 subflow
- [ ] Sidebar 也和 Flow 同样的搜索功能，快捷键 cmd+k 是 sidebar，cmd+j 是 Flow；这就要解决 cmd+j 快捷键和 chrome extension 的冲突了
- [ ] Sidebar 了解 Sidebar 常见的样式，和实现方式（似乎没必要了）
- [ ] Sidebar roots 部分请求数据时候的交互

## Unclear Tasks

- [ ] 统计每个 `tree` 的信息（节点数等），或是在 Flow 中增加一个绝对定位的类似切换布局方式的按钮来控制显示，或者在 Dashboard 中可视化统计（使用 D3.js）

## Bug Fix Tasks

- [ ] Canvas 中，点击的节点，如果其 content 存在图片，那么 tiptap 初始化之后，会出现 flushSync 的报错
- [ ] Canvas Bubble Menu UX 有些问题。在选中文本后，BubbleMenu 出现 OK 没问题，然后点击其中的 dropdown 组件，BubbleMenu 消失，dropdown item 显示到了屏幕左上角，坐标 (0, 0) 的地方
- [ ] Tiptap 编辑了内容后，直接关闭 Canvas，然后打开同样的节点；使用的是 React-Query 的缓存数据，而不是最新数据
  > 难搞哦！

## Done

- [x] Canvas 打开/关闭 来一个动画效果
- [x] Flow fitView 的时候来一个丝滑的动画
- [x] Flow 节点，固定宽高（因为 description 设置了 overflow 显示 ...），要考虑 Flow zoom in/out 的时候节点尺寸实际上也在变化，那么初始时候设置的宽高有什么意义呢？
  > 默认设置的宽高仅用于 dagre 计算布局，节点使用的是 React-Flow 的默认宽高
  > 实际渲染的节点尺寸由 rr-node-card css 决定（设置了最小最大宽度）
- [x] Flow 更改布局功能（很简单，更改传递给 dagrejs 的参数即可）
  > 不那么简单。初步实现了更改布局的功能：1. 代码很丑陋，局限于已有 useEffect 依赖数组新增依赖会报错；2. 样式很丑陋。连线非常丑
  > 所以暂时放弃此功能的后续开发
- [x] Tiptap editor 为什么会意外的保存上一个节点的 Content 为当前的节点 Content？
  > 难以 debug 复现
- [x] Canvas 为了防止意外的保存不匹配的节点 Content，可以在调用 saveContent 的时候判断是否这个内容的 \_id 与 节点的 node.content 相同。如果相同有更新时才保存，否则不保存。
  > 目前只能祈祷使用的时候，等待 update 后再切换节点了，否则肯定会出现该情况。貌似是因为点击太频繁节奏太快，导致react渲染没跟上，保存了上次渲染的content
  > 这个问题似乎又有些思路：问题就在于，加载了 Canvas ，Tiptap 设置了 content 之后，为什么 onUpdate 仍然会执行？
  > 搞清楚这个问题，意外保存的问题似乎就迎刃而解了
  > 愈发清晰。Tiptap 实例初始化之后，onCreate 执行将 tiptap content 设置为获取到的 content；然后 onUpdate 执行了！That's the point
  > 哈哈，没想到如此简单就解决了，只需要设置 editor.command.setContent 方法中的第二个参数中的 emitUpdate 配置
- [x] Canvas 与 ChatGPT & Gemini 保持一致，占据页面的右侧空间，而不是覆盖在 Flow 上（先试验，若好用，即确定）
- [x] Canvas 移动端，Canvas 占据整个屏幕，sidebar 要 responsive
- [x] Canvas 顶部工具栏取消，放到编辑行的左边一个可以消失可以出现的按钮，类似飞书文档
- [x] Canvas 修复在点击节点切换 tiptap editor 内容的时候，出现的 flushSync 报错问题；修复后才可以做 tab 功能
  > flushSync 不是因为切换节点而出现的，很可能与图片有关。目前切换节点 tiptap 实例重新创建，内容与节点匹配的问题已解决（通过 dataUpdatedAt 作为 key(每个节点的该字段不同) 强制 React 重渲染）
- [x] Canvas 内部的布局样式，参考 ChatGPT 的 Canvas
- [x] Canvas tiptap editor 区分内容区别然后更新的功能，现在使用 JSON.stirngify 一个大对象做到的，效率很低下，应该使用 \_id，这肯定是唯一的且不同的
  > flushSync & 切换节点 tiptap content 不变的问题目前愈发清晰；所以重构了 Canvas 逻辑，这个问题不再存在
- [x] Canvas 保存 tiptap 内容的时候，Canvas header 部分出现保存的 loading 圈圈，保存成功之后显示成功然后消失
- [x] Flow page 中，顶部的样式需要研究怎么改
- [x] Flow 搜索定位节点功能

# Deprecated

- [?] Flow 整个区域方向键移动，React-Flow 默认选中节点后，方向键可以控制点移动
  > 没必要了吧？
- [?] Canvas resizeable，可以像 resize 浏览器窗口一样 resize Canvas
  > 不做了
- [ ] Tiptap 点击节点 68d66e95b74abaddfef3e5a5 后，后端查询时间很长（mongodb compass 中在 rr-node-content 查询这个ID需要很久），为什么一个线性查询会这么久？后续看看所谓的添加索引
  > 似乎是部分包含图片的 rr-node-content 查询非常慢！为什么呢？
  > 今天又不慢了，真是奇怪；很可能是因为网络延迟
  > 非常可能是，包含图片的请求体太大了，网络传输的时候延迟高导致
