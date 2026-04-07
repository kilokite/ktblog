# ktblog-solid

个人博客系统。pnpm monorepo，三个包：

| 包 | 干什么 | 技术 |
|---|--------|------|
| `server` | API + SSR 宿主 | Hono, Prisma 7, Node |
| `render` | 前台页面 | SolidJS, Vite |
| `console` | 管理后台 | Vue 3, Vuetify |

数据库用 MySQL，认证走 opaque token（不用 JWT）。

## 跑起来

需要 Node 20+，pnpm 10+，一个 MySQL 实例。

```bash
pnpm install

# server/.env 里配好数据库
# DATABASE_URL="mysql://user:pass@localhost:3306/ktblog"

# 跑迁移
cd server && npx prisma migrate deploy

# 回根目录启动
cd ..
pnpm dev
```

`pnpm dev` 会同时起 server（3000）和 render 的 Vite dev server。

console 要单独跑：

```bash
cd console
pnpm dev
```

## 项目结构

```
├── server/
│   ├── src/
│   │   ├── routes/       # API 路由（auth, posts, stats）
│   │   ├── lib/          # prisma client, 鉴权, 站点配置
│   │   ├── app.ts        # Hono 应用，挂 CORS / 静态资源 / SSR
│   │   └── index.ts      # 入口，监听 3000
│   └── prisma/
│       ├── schema.prisma  # 数据模型
│       └── migrations/
├── render/
│   └── src/
│       ├── pages/        # PostList, PostDetail
│       ├── routes.tsx    # / 和 /post/:slug
│       └── lib/api.tsx   # hono client 类型化请求
├── console/
│   └── src/
│       ├── pages/        # 文件路由：posts/, setting/, about
│       └── server.ts     # API 基址配置
└── share_assets/         # 共享 logo SVG
```

## 数据模型

User → Post，Post 可挂 Category、Tag（多对多）、Series。
支持 Comment（树形回复）和 Reaction。
SiteConfig 存一行 JSON，放全站配置。

## API 概览

所有接口挂在 `/api` 下。

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | `/api/auth/login` | 否 | 登录，返回 token |
| GET | `/api/posts/` | 否 | 已发布文章列表，支持分页和分类/标签筛选 |
| GET | `/api/posts/:slug` | 否 | 单篇文章 |
| GET | `/api/posts/manage` | 是 | 管理用文章列表 |
| GET | `/api/posts/manage/:id` | 是 | 管理用单篇 |
| POST | `/api/posts/` | 是 | 创建文章 |
| PUT | `/api/posts/:id` | 是 | 更新文章 |
| DELETE | `/api/posts/:id` | 是 | 删除文章 |
| GET | `/api/stats/` | 是 | 统计数据 |

## 构建

```bash
# 构建前台（客户端 + SSR）
cd render && pnpm build

# 构建后台（输出到根 dist/public）
cd console && pnpm build

# 构建服务端
cd server && pnpm build

# 生产启动
cd server && pnpm start
```
