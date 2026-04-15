# Profile 个人卡片页

面向后续维护者的架构与扩展说明。

---

## 1. 概览

Profile 页是一个全屏背景 + 玻璃态卡片的个人展示页面，设计参考 `cpai-e/vite-project`。数据完全存储在 `SiteConfig` 中，不引入新的 API 端点或数据库表。

**涉及三个包：**

| 包 | 角色 |
|------|------|
| `server` | Zod schema 定义数据结构，复用 `GET/PUT /api/site-config` |
| `render` | SolidJS 前端渲染页面 |
| `console` | Vue 管理后台，配置页面内容 |

---

## 2. 数据模型

定义在 `server/src/lib/site-config-schema.ts`，挂载在 `siteConfig.renderUi.pages.profile` 下。

```
siteConfig
├── nickname          ← Profile 页复用
├── avatarUrl         ← Profile 页复用
├── description       ← Profile 页复用
└── renderUi.pages.profile
    ├── backgroundUrl: string     （预留，暂未启用）
    └── content: ProfileContentBlock[]
```

### 内容块类型（discriminated union，按 `type` 区分）

| type | 字段 | 渲染效果 |
|------|------|----------|
| `item-list` | `items: ProfileItem[]` | 方形玻璃卡片网格，每项含 symbol/color/title/description/link |
| `tag-list` | `tags: ProfileTag[]` | 药丸标签行，symbol + 彩色文字 |
| `title` | `text: string` | 大号白色标题文字 |

**ProfileItem 字段：** `symbol`（文字符号）、`color`（图标底色）、`title`、`description`、`link`

**ProfileTag 字段：** `symbol`（文字符号）、`text`、`color`（文字颜色）

> 图标使用纯文本符号（emoji / unicode），未来计划统一图标系统时只需修改渲染部分。

---

## 3. 布局系统

### 3.1 layout-profile

文件：`render/src/lib/layoutConfig.ts` + `render/src/App.scss`

路由 `/profile` 映射到 `layout-profile` class，与 `layout-default`、`layout-detail` 并列。

**效果：**
- `.hero` 高度从默认 635px 过渡到 `100vh`（CSS transition `0.4s`）
- `.hero-title` 保持原始高度但 `opacity: 0; visibility: hidden`（原地淡出）
- `.page-content` 通过 `margin-top: calc(-100vh + 54px)` 叠在背景图上
- 入场动画：`visibility: hidden` + `transform: translateY(20px)`，延迟 0.4s 后滑入（不使用 opacity，避免破坏子元素 `backdrop-filter`）

### 3.2 为什么不用 opacity 做入场

`backdrop-filter` 在父元素 `opacity < 1` 时失效（浏览器将父级合成为独立层，blur 的对象变成该层而非实际背景）。因此 profile 入场使用 `visibility` + `transform` 替代。

---

## 4. 文件结构

```
render/src/
├── pages/
│   ├── Profile.tsx          # 页面主组件：info 区 + 内容块循环
│   └── Profile.scss         # 页面布局（25%/75% 双栏，响应式）
├── components/profile/
│   ├── ProfileItemList.tsx   # item-list 类型：方形玻璃卡片网格
│   ├── ProfileItemList.scss
│   ├── ProfileTagList.tsx    # tag-list 类型：药丸标签行
│   ├── ProfileTagList.scss
│   ├── ProfileSectionTitle.tsx  # title 类型：大号白色文字
│   └── ProfileSectionTitle.scss
├── lib/layoutConfig.ts       # 新增 /profile → layout-profile
├── routes.tsx                # 新增 Route path="/profile"
├── App.scss                  # 新增 .layout-profile 样式块

server/src/lib/
└── site-config-schema.ts     # 新增 profileItem/Tag/ContentBlock schema

console/src/
├── pages/profile.vue         # 内容块管理页面
└── App.vue                   # 导航菜单新增"个人页"
```

---

## 5. 设计语言

Profile 页与博客主站使用不同的视觉风格（白底博客 vs 暗色玻璃态），以下是 Profile 页的专属设计 token：

| 元素 | 值 |
|------|------|
| 页面文字色 | `#eeeeee` |
| 玻璃卡片背景 | `rgba(255, 255, 255, 0.11)` |
| 玻璃卡片边框 | `2px solid rgba(255, 255, 255, 0.18)` |
| 玻璃卡片模糊 | `backdrop-filter: blur(20px) brightness(1)` |
| 标签背景 | `rgba(255, 255, 255, 0.3)`，文字用 tag 自身 color |
| 标签圆角 | `calc(infinity * 1px)`（全圆药丸） |
| 卡片圆角 | `2.5rem` |
| 卡片尺寸 | `220px` 正方形（`aspect-ratio: 1/1`） |
| 图标底色区 | `56px` 正方形，`border-radius: 30%` |
| 标题 | `30px` 白色粗体，`text-shadow` |
| 描述文字 | `rgba(255, 255, 255, 0.5)` / `rgba(255, 255, 255, 0.8)` |
| 头像 | `160px` 圆形，`border: 1px solid rgba(255,255,255,0.5)` |

---

## 6. 扩展指南

### 6.1 新增内容块类型

需要改 3 个地方：

**1) Schema** — `server/src/lib/site-config-schema.ts`

在 `profileContentBlockSchema` 的 `discriminatedUnion` 中新增一项：

```typescript
export const profileContentBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('item-list'), items: z.array(profileItemSchema) }),
  z.object({ type: z.literal('tag-list'), tags: z.array(profileTagSchema) }),
  z.object({ type: z.literal('title'), text: z.string() }),
  // ↓ 新增
  z.object({ type: z.literal('image-banner'), url: z.string(), alt: z.string() }),
])
```

**2) Render 组件** — `render/src/components/profile/` + `render/src/pages/Profile.tsx`

创建新组件文件，然后在 `Profile.tsx` 的 `ContentBlock` 中添加 `<Match>` 分支：

```tsx
<Match when={props.block.type === 'image-banner' && props.block}>
  {(b) => {
    const block = b() as Extract<ProfileContentBlock, { type: 'image-banner' }>
    return <ProfileImageBanner url={block.url} alt={block.alt} />
  }}
</Match>
```

**3) Console 编辑 UI** — `console/src/pages/profile.vue`

在 `addBlock` 函数中添加新类型的初始值，在 template 中添加对应的编辑表单（`<template v-if="block.type === 'image-banner'">`）。同时更新 `blockTypeLabel` 和 `blockTypeColor`。

### 6.2 修改 Profile 页布局

布局定义在 `Profile.scss`：
- 桌面端：flex-row，左侧 info 25%，右侧 content 75%
- 移动端（`< 1024px`）：flex-column，全宽堆叠

### 6.3 未来图标系统迁移

当前 `symbol` 字段为纯文本（emoji / unicode 字符）。统一图标系统后：
- Schema 中 `symbol: z.string()` 可改为 `icon: z.string()` 或保持 symbol 兼容
- 只需修改 `ProfileItemList.tsx` 和 `ProfileTagList.tsx` 中渲染 symbol 的 `<span>` 为新的图标组件

---

## 7. Console 管理页

路径：`console/src/pages/profile.vue`，通过 `vite-plugin-pages` 文件路由自动注册为 `/profile`。

功能：
- 背景图 URL 配置（预留）
- 内容块增删、拖拽排序（vuedraggable）
- 每种块类型有对应的编辑表单
- Ctrl+S 快捷保存
- 数据通过 `GET/PUT /api/site-config` 读写，保存时合并到完整 siteConfig 后提交
