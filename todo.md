# Todo List

## UI Tasks

- [x] Canvas 与 ChatGPT & Gemini 保持一致，占据页面的右侧空间，而不是覆盖在 Flow 上（先试验，若好用，即确定）
- [x] 移动端，Canvas 占据整个屏幕，sidebar 要 responsive
- [x] Flow page 中，顶部的样式需要研究怎么改
- [ ] 了解 Sidebar 常见的样式，和实现方式
- [ ] Goal Page 顶部，引入AI来获取该 Goal 的内容，然后总结一句正能量鼓励文字，显示在顶部区域

## Feature Tasks

- [ ] Flow 记忆节点位置与连线（连线真的需要记忆吗？）
- [ ] Flow 更改连线功能
- [x] Flow 搜索定位节点功能
- [ ] Flow 更改布局功能（很简单，更改传递给 dagrejs 的参数即可）
- [ ] Flow CRUD 节点时，等待途中冻结 Flow，操作结束（成功或失败）后再恢复（增加 UX，也方便探测性能）
- [ ] Flow 方向键移动
- [ ] Canvas 顶部工具栏取消，放到编辑行的左边一个可以消失可以出现的按钮，类似飞书文档
- [ ] Canvas 修复在点击节点切换 tiptap editor 内容的时候，出现的 flushSync 报错问题；修复后才可以做 tab 功能
- [ ] Canvas 切换 tab，区分：笔记 / 感想 / 思考 等等，并且 tab 之间可以通过“链接”的方式互相引用跳转
- [ ] Canvas 想想如何添加 AI Agent
- [ ] Canvas 内部的布局样式，参考 ChatGPT 的 Canvas
- [ ] Canvas 文字内容加密
- [ ] Canvas 设置访问密码（访问密码在传输过程中的加密，可以参考 TLS 协商中 pre-master secret 的过程）
- [ ] Canvas resizeable，可以像 resize 浏览器窗口一样 resize Canvas
- [ ] Canvas 中添加表格模块
- [ ] Canvas tiptap editor 区分内容区别然后更新的功能，现在使用 JSON.stirngify 一个大对象做到的，效率很低下，应该使用 \_id，这肯定是唯一的且不同的
- [ ] Canvas 保存 tiptap 内容的时候，Canvas header 部分出现保存的 loading 圈圈，保存成功之后显示成功然后消失
- [ ] Reverse Roadmap 登录功能

## Unclear Tasks

- [ ] 统计每个 `tree` 的信息（节点数等），或是在 Flow 中增加一个绝对定位的类似切换布局方式的按钮来控制显示，或者在 Dashboard 中可视化统计（使用 D3.js）

## Bug Fix Tasks

- [ ] Tiptap 点击节点 68d66e95b74abaddfef3e5a5 后，后端查询时间很长（mongodb compass 中在 rr-node-content 查询这个ID需要很久），为什么一个线性查询会这么久？后续看看所谓的添加索引
