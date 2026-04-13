<picture>
  <source media="(prefers-color-scheme: dark)" srcset="share_assets/logo_dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="share_assets/logo.svg">
  <img alt="KTBlog" src="share_assets/logo.svg" height="40">
</picture>

一套完整的个人博客系统，采用 pnpm monorepo 管理，前后台分离。

| 包 | 职责 | 技术栈 |
|---|------|--------|
| `server` | API 服务 + SSR | Hono, Prisma 7, Node |
| `render` | 前台展示 | SolidJS, Vite |
| `console` | 管理后台 | Vue 3, Vuetify |

MySQL 存储，opaque token 认证。

## 快速开始

> 前置要求：Node 20+、pnpm 10+、MySQL

```bash
pnpm install

# 在 server/.env 中配置数据库连接
# DATABASE_URL="mysql://user:pass@localhost:3306/ktblog"

# 执行数据库迁移
cd server && npx prisma migrate deploy

# 回到根目录，启动开发环境
cd ..
pnpm dev
```

`pnpm dev` 同时启动 server（:3000）与 render 的 Vite dev server。

管理后台需单独启动：

```bash
cd console && pnpm dev
```

## 项目结构

```
├── server/
│   ├── src/
│   │   ├── routes/        # API 路由（auth, posts, stats）
│   │   ├── lib/           # Prisma client、鉴权、站点配置
│   │   ├── app.ts         # Hono 应用入口，挂载 CORS / 静态资源 / SSR
│   │   └── index.ts       # 服务启动，监听 :3000
│   └── prisma/
│       ├── schema.prisma  # 数据模型定义
│       └── migrations/
├── render/
│   └── src/
│       ├── pages/         # PostList, PostDetail, Archive …
│       ├── routes.tsx     # 前台路由
│       └── lib/api.tsx    # Hono RPC 类型化请求
├── console/
│   └── src/
│       ├── pages/         # 文件路由：posts/, setting/, about
│       └── server.ts      # API 基址配置
└── share_assets/          # 共享 logo 资源
```

## 数据模型

User → Post，Post 可关联 Category、Tag（多对多）、Series。
支持树形 Comment 与 Reaction。
SiteConfig 以单行 JSON 存储全站配置。

## API 一览

所有接口均挂载于 `/api` 路径下。

| 方法 | 路径 | 认证 | 说明 |
|------|------|:----:|------|
| POST | `/api/auth/login` | - | 登录，返回 token |
| GET | `/api/posts/` | - | 文章列表，支持分页 / 分类 / 标签筛选 |
| GET | `/api/posts/:slug` | - | 文章详情 |
| GET | `/api/posts/manage` | ✓ | 管理端文章列表 |
| GET | `/api/posts/manage/:id` | ✓ | 管理端文章详情 |
| POST | `/api/posts/` | ✓ | 创建文章 |
| PUT | `/api/posts/:id` | ✓ | 更新文章 |
| DELETE | `/api/posts/:id` | ✓ | 删除文章 |
| GET | `/api/stats/` | ✓ | 仪表盘统计 |

## 构建与部署

```bash
# 构建前台（客户端 + SSR）
cd render && pnpm build

# 构建管理后台
cd console && pnpm build

# 构建服务端
cd server && pnpm build

# 生产启动
cd server && pnpm start
```
