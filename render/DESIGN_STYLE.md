# render 前端设计风格参考

面向后续维护者的速查说明，依据当前 `render/src` 实现整理；新增页面或样式时建议先对照本文与现有 SCSS。

---

## 1. 整体气质

- **定位**：偏「杂志感」的博客前台，以可读内容与留白为主，而不是后台式高密度 UI。
- **基底**：浅灰页面底（`--bg`）+ 白色圆角内容块（`--card-bg`），层次主要靠间距、字号和细分割线，而非厚重阴影。
- **首屏**：全宽 hero 大图 + 自上而下渐变遮罩，标题区居中；主内容区通过负 `margin-top`「叠」在 hero 上，形成连贯纵深感。
- **点缀**：紫色系（`--accent`）用于链接、引用块等局部强调；hero 标题里有一处黄色高亮字母（`App.scss` 中的 `.hero-title-accent`）。

---

## 2. 主题变量（`:root`，`index.scss`）

| 变量 | 用途 |
|------|------|
| `--text` / `--text-h` | 默认正文色 / 标题与强调正文 |
| `--bg` / `--card-bg` | 页面背景 / 卡片背景 |
| `--border` | 分割线、表格线 |
| `--code-bg` | 行内代码、表格表头底等 |
| `--accent` / `--accent-bg` / `--accent-border` | 主强调色及其浅底、描边态 |
| `--shadow` | 卡片 hover 等轻阴影 |
| `--tag-color` / `--tag-border` | 列表与详情中分类、标签色（偏蓝） |
| `--title-color` / `--summary-color` / `--date-color` | 标题、摘要、日期元信息 |
| `--sans` / `--heading` / `--mono` | 正文字体栈、标题栈、等宽栈 |

说明：`color-scheme: light dark` 已声明，但暗色主题下 `:root` 变量覆盖仍整段注释，**当前仅按浅色交付**。`--social-bg` 等在侧栏可用范围内预留。

---

## 3. 字体与排版

- **全局**：`html :root` 上 `font: 18px/145%`，`letter-spacing: 0.18px`；`≤1024px` 时降为 `16px`。
- **全局 `h1` / `h2`**（`index.scss`）：大标题与二级标题使用 `--heading`，字重 500；**注意**：文章列表卡片与详情页标题在各自 SCSS 里另设字重与字号，并不完全等同全局 `h1`。
- **正文阅读区**（`PostDetail.scss` 的 `.article-body`）：`Inter`, `Noto Sans SC` 与 `var(--sans)` 组合，`line-height: 1.85`；列表卡片摘要同样倾向该组合。
- **元信息**：分类/标签/日期多用 **12px、大写、`letter-spacing` 偏大**（列表与详情数值略有差异，属刻意扫读层级）。
- **代码**：正文内 `` ` `` 用 `--code-bg`；`pre` 块为深色背景 `#1e1e2e`、浅色字，与正文区对比强。
- **外链字体**：`index.scss` 顶部 Google Fonts 的 `@import` 为注释状态，但样式里仍写 `'Inter'`、`'Work Sans'` 等；**实际会回退到 `--sans` 等栈**，若需保证字形一致需恢复加载或改栈。

---

## 4. 布局

- **App 壳层**：固定顶栏 `NavBar` + 下方 `section.hero`（背景图 + overlay + 标题）+ `Suspense` 子路由；路由切换在客户端用 `solid-transition-group` 包一层（见下节）。
- **主列表**（`PostList.scss`）：`.content-grid` 为 `grid-template-columns: 1fr 320px`，`max-width: 1200px`，`gap: 32px`，**`margin: -219px auto 60px`** 与 hero 重叠；`≤1024px` 单栏并减小负边距与左右 padding；`≤640px` 再收一档。
- **文章详情**（`PostDetail.scss`）：外层 `.detail-page` 同样 **`margin-top: -219px`**；内层 `.detail-grid` 与列表同宽同栏比例；小屏下 `margin-top` 等微调与列表略有不同，以保持正文区节奏。
- **侧栏**（`Sidebar.scss`）：纵向 `gap: 14px`；`≤1024px` 多为横向 `flex-wrap` 排列；`≤640px` 再改回纵排。

---

## 5. 组件模式

- **导航栏**（`NavBar.scss`）：默认透明叠在 hero 上，文案白色；滚动后 `.nav--scrolled` 为半透明浅灰 + `backdrop-filter`；在文章详情路径下继续向下滚动累积一定距离后出现 `.nav--compact`（更矮、更小字号）。
- **文章卡片**（`PostCard`）：白底、`border-radius: 17px`、内边距约 `25px`、默认无阴影，**`:hover` 使用 `var(--shadow)`**；封面区固定宽约 `269px`、`border-radius: 9px`；小屏改为竖向且封面高度约 `180px`。
- **详情主卡片**（`.detail-article`）：与列表卡片圆角量级一致（`17px`），头图 `10px` 圆角；元信息 + `h1.article-title` + 封面 + `.article-body` 分区 padding 清晰。
- **侧栏卡片**：`ProfileCard` 白底大圆角（`18px`）；`LinkCard` 为**可传入背景色**的彩条块（默认 `#FF6699`），白字图标与文案；`NowPlayingCard` 以底图/占位灰 `#E6E8EA` 为主、角标与控制区叠在图上。

---

## 6. 交互动效

- **路由过渡**（`App.scss`）：`.fade-enter/exit` 约 `0.25s`，含 `opacity` 与 `translateY(10px)`，模式为 `outin`（见 `App.tsx`）。
- **导航**：`nav` 上 `transition: all 0.2s`；链接与图标 hover 多为 **透明度变化**。
- **正文链接**（`.article-body a`）：下划线颜色过渡，hover 时拉满 `--accent`。
- **原则**：动效短、位移小，避免夸张缩放或长 easing；卡片以阴影变化为主。

---

## 7. 内容型页面

- **首页列表**：`PostList` + `content-grid`，主列文章卡片循环，侧栏固定组合（资料 / 正在播放 / 单条 `LinkCard` 示例）。
- **文章详情**：`PostDetail` 输出服务端/接口提供的 `innerHTML`；`.article-body` 内对 `h1`–`h6`、`p`、`a`、`blockquote`、`pre`/`code`、`table`、`img`、`hr`、`figure` 等均有阅读向样式（引用块左侧 `--accent` 竖线 + `--accent-bg` 底等）。
- **归档**：路由 `/archive` 已在 `routes.tsx` 与导航中注册，**当前 `Archive.tsx` / `Archive.scss` 为空实现**，视觉规范待补齐后应与列表/详情共享 token 与栅格习惯。

---

## 8. 已知不一致 / 技术债（样式向）

- **归档页**：有入口无页面内容与样式。
- **导航占位**：「友链」「关于」与品牌部分链接仍指向 `/#` 或未单独页面，与侧栏真实内容未完全对齐。
- **明暗色**：`color-scheme` 与注释掉的暗色变量不同步，不要假设已支持系统暗色。
- **字体名 vs `@import`**：样式写死家族名但 Web 字体未加载时表现依赖系统回退。
- **硬编码色**：如 hero 上 `#fff` / `#ffea00`、`ProfileCard` 的 `#585858`、`pre` 的深色主题色等，与 token 并存；新代码优先走变量，旧区逐步收敛即可。
- **文案语言**：部分 `fallback` 与空状态为英文（如 `Loading…`、`No posts yet.`），与中文导航并存。

---

## 9. 后续改动建议

1. **先复用 `:root` 变量**，再考虑局部新色；白底 + 浅灰底 + 紫强调是当前主叙事。
2. **新内容页**：优先复用「hero + 负 margin 主栅格 + `320px` 侧栏 + `1024`/`640` 断点」这一套，避免另起一套 max-width。
3. **新「信息块」**：形状上靠近现有卡片（圆角 `16px`–`18px`、hover 轻阴影），密度不要超过详情正文区。
4. **Markdown/富文本**：扩展样式时改 `PostDetail.scss` 的 `.article-body` 选择器树，保持与现有标题下划线、引用、代码块一致。
5. **动效**：延续短过渡；需要更强反馈时优先改颜色/边框，而非长动画。
6. **上架归档或新路由**：补全组件后再把侧栏、导航与路由文案对齐，并统一加载/空状态文案语言策略。

如需对照实现，优先阅读：`index.scss`、`App.scss`、`NavBar.scss`、`PostList.scss`、`PostDetail.scss`、`PostCard.scss`、`components/sidebar/*.scss`。
