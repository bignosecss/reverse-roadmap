# Todo List

## UI Tasks
- [x] Canvas 与 ChatGPT & Gemini 保持一致，占据页面的右侧空间，而不是覆盖在 Flow 上（先试验，若好用，即确定）
- [ ] 移动端，Canvas 占据整个屏幕，sidebar 要 responsive
- [ ] Flow page 中，顶部的样式需要研究怎么改
- [ ] 了解 Sidebar 常见的样式，和实现方式
- [ ] Goal Page 顶部，增加 Sidebar Trigger，中间的文字部分，使用AI根据当前跟节点内容生成，每天一个。这样，Goal Page 就有了三部分（横向）：1. Sidebar Trigger 2. Content related text 3. Theme switcher

## Feature Tasks
- [ ] Flow 记忆节点位置与连线（连线真的需要记忆吗？）
- [ ] Flow 更改连线功能
- [ ] Flow 搜索定位节点功能
- [ ] Flow 更改布局功能（很简单，更改传递给 dagrejs 的参数即可）
- [ ] Flow CRUD 节点时，等待途中冻结 Flow，操作结束（成功或失败）后再恢复（增加 UX，也方便探测性能）
- [ ] Flow 方向键移动
- [ ] Canvas 顶部工具栏取消，放到左边一个可以消失可以出现的按钮，类似飞书文档
- [ ] Canvas 切换 tab，区分：笔记 / 感想 / 思考 等等，并且 tab 之间可以通过“链接”的方式互相引用跳转
- [ ] Canvas 想想如何添加 AI Agent
- [ ] Canvas 内部的布局样式，参考 ChatGPT 的 Canvas
- [ ] Canvas 文字内容加密
- [ ] Canvas 设置访问密码（访问密码在传输过程中的加密，可以参考 TLS 协商中 pre-master secret 的过程）
- [ ] Canvas resizeable，可以像 resize 浏览器窗口一样 resize Canvas
- [ ] Canvas 中添加表格模块
- [ ] Canvas 随着内容的输入，当内容超过屏幕的时候，屏幕自动下移适应增多的内容，而不需要手动滑到下面
- [ ] Reverse Roadmap 登录功能
