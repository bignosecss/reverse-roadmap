你看到的错误信息是：

```
   1 PayloadTooLargeError: request entity too large
   2     at readStream
     (/Users/pterosaurscannotfly/code/proj/reverse-roadmap/node_modules/.pnpm/r
     aw-body@3.0.1/node_modules/raw-body/index.js:163:17)
   3     ...
   4   expected: 149372,
   5   length: 149372,
   6   limit: 102400,
   7   type: 'entity.too.large'
```

这表明你的服务器接收到了一个大小为149372字节（约146KB）的请求体，但是它设置了一个最
大限制（limit），即102400字节（100KB）。当请求体超过这个限制时，就抛出了PayloadTooLa
rgeError异常。

所以，出现这个错误的原因是：你的API端点接收到的数据量超过了服务器允许的最大值（默认
通常是100KB或更小）。

关于你提到的61KB图片：
虽然你使用的图片本身只有61KB，但在HTTP请求中，特别是上传文件时，实际传输的数据大小可
能会显著增加。这是因为数据通常会经过Base64编码后发送。

- 原始二进制数据（如图片）在Base64编码后，其大小大约会增加33%。
- 因此，一张61KB的图片，在进行Base64编码之后，它的大小可能达到约81KB。
- 如果你还把这个Base64字符串放在JSON对象里作为属性值传给服务器，再加上其他字段、键
  名等额外结构和元数据（例如{"image":
  "data:image/..."}），整个请求体的总大小很容易就突破了100KB甚至更多。

简单来说：即使原始图片不大，但通过HTTP发送时的实际负载可能因为编码方式而超出服务器设
定的上限。

解决方案

你需要调整一下服务器处理请求体大小的配置，默认限制太小了。

如果你使用的是Express框架（看起来像是这样，因为你提到了body-parser），你可以做以下操
作来解决这个问题：

方法一：修改 Express 应用程序中的 body-parser 配置

找到你的主服务文件，比如 main.ts 或者 server.js
等，并确保正确设置了中间件选项以支持更大的请求体。

    1 // 示例代码片段，请根据实际情况替换为你项目中的位置
    2 import * as bodyParser from 'body-parser';
    3
    4 const app = express();
    5
    6 // 设置 JSON 和 URL-encoded 请求体大小限制
    7 app.use(bodyParser.json({ limit: '10mb' })); // 可根据需要调整 limit 大小
    8 app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
    9

10 // 其他路由配置...

如果你使用 NestJS，则可以查看文档了解如何自定义底层 Express
实例或者使用内置的功能扩展请求解析器的大小限制。

方法二：如果是 NestJS 框架，则可以通过工厂函数配置解析器

    1 // main.ts
    2 import { NestFactory } from '@nestjs/core';
    3 import { AppModule } from './app.module';
    4
    5 async function bootstrap() {
    6   const app = await NestFactory.create(AppModule);
    7
    8   // 增加 body parser 的大小限制
    9   app.use((req, res, next) => {

10 bodyParser.json({ limit: '10mb' })(req, res, next);
11 });
12 app.use((req, res, next) => {
13 bodyParser.urlencoded({ extended: true, limit: '10mb' })(req, res,
next);
14 });
15
16 await app.listen(3000);
17 }
18 bootstrap();

或者直接在创建应用时传入选项：

    1 async function bootstrap() {
    2   const app = await NestFactory.create<NestExpressApplication>(
    3     AppModule,
    4     { bodyParser: false }, // 禁用默认中间件
    5   );
    6
    7   app.use(bodyParser.json({ limit: '10mb' }));
    8   app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    9

10 await app.listen(3000);
11 }
12 bootstrap();

方法三：如果使用 Fastify 而不是 Express，则应检查并配置 Fastify 的 payloadLimit

1 const app = await NestFactory.create<NestFastifyApplication>(
2 AppModule,
3 new FastifyAdapter(),
4 {
5 rawBody: true,
6 // 设置 bodyLimit
7 bodyLimit: 10 _ 1024 _ 1024, // 单位为字节，这里设为 10MB
8 },
9 );

记得根据你的具体技术栈选择合适的解决方案！同时注意不要将这些值设得过大以免消耗过多资
源引发安全风险。
