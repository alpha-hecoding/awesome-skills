# WeChat Article Maker

智能创作并发布微信公众号文章的完整工具 - 整合AI生成与完整发布流程。

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue.svg)](https://github.com)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-orange.svg)](package.json)

## 🌟 核心特性

### 双重能力

**模式A：完整创作流程**
```
关键词/URL → AI生成 → HTML → 图片清洗 → 发布
```

**模式B：直接发布流程**
```
HTML/MD文件/链接 → 清洗 → 发布（跳过生成）
```

### 功能亮点

- ✅ **AI 文章生成** - 基于关键词或链接智能生成文章
- ✅ **模板驱动创作** - 内置开篇、结尾、语言风格模板
- ✅ **参数化配置** - 支持长度、深度、风格等多维度配置
- ✅ **完全跨平台** - Windows、macOS、Linux 原生支持
- ✅ **零配置运行** - 使用 `npx -y bun` 自动下载运行时
- ✅ **依赖自动安装** - 首次运行时自动安装所需依赖
- ✅ **链接发布** - 下载并转换外部文章
- ✅ **Markdown 转换** - 支持多主题（default/grace/simple）
- ✅ **图片自动清洗** - 移除 AIGC 标记，符合微信规范
- ✅ **CSS 内联转换** - 自动转换样式为内联格式
- ✅ **封面图生成** - 无系统依赖，纯 Node.js 实现
- ✅ **灵活的凭证传递** - 支持配置文件、环境变量、命令行参数

## 🚀 快速开始

### 使用技能（推荐）

```
/wechat-article-maker 写一篇关于 Docker 容器化的文章
```

技能会自动识别输入类型：
- **文本/关键词** → AI生成文章 → 发布
- **链接** → 直接下载发布（跳过生成）
- **Markdown文件** → 直接渲染发布（跳过生成）
- **HTML文件** → 直接发布（跳过生成）

### 配置 API 凭证（可选）

如果计划使用 API 方式发布，需要配置微信 API 凭证：

**Unix/Linux/macOS**:
```bash
mkdir -p .awesome-skills
cat > .awesome-skills/.env << 'ENVEOF'
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret
ENVEOF
```

**Windows (CMD)**:
```cmd
mkdir .awesome-skills
echo WECHAT_APP_ID=your_app_id > .awesome-skills\.env
echo WECHAT_APP_SECRET=your_app_secret >> .awesome-skills\.env
```

**或在命令行直接传递**（最灵活）：
```bash
npx -y bun scripts/wechat-api.ts article.md --app-id wx123456 --app-secret abc123 --inline-css
```

### 命令行直接发布

```bash
# 发布 Markdown 文章
npx -y bun scripts/wechat-api.ts article.md --inline-css

# 生成封面图
npx -y bun scripts/generate-cover.ts --title "文章标题" --output cover.jpg

# Markdown 转 HTML
npx -y bun scripts/md-to-wechat.ts article.md --theme grace
```

**注意**：首次运行时会自动下载 Bun 和安装依赖，请耐心等待。

## 📁 目录结构

```
wechat-article-maker/
├── scripts/                  # TypeScript 源代码
│   ├── wechat-api.ts        # API 发布
│   ├── wechat-article.ts    # 浏览器发布
│   ├── wechat-browser.ts    # 图文发布
│   ├── wechat-agent-browser.ts  # Agent 浏览器发布
│   ├── generate-cover.ts    # 封面生成
│   ├── md-to-wechat.ts      # Markdown 转换
│   ├── image-utils.ts       # 图片处理工具
│   ├── ensure-deps.ts       # 依赖自动安装
│   ├── cdp.ts               # Chrome DevTools Protocol 工具
│   ├── copy-to-clipboard.ts # 剪贴板复制
│   ├── paste-from-clipboard.ts # 剪贴板粘贴
│   └── md/                  # Markdown 渲染引擎
│       ├── render.ts        # 核心渲染
│       ├── themes/          # 主题样式（5种）
│       │   ├── base.css
│       │   ├── default.css
│       │   ├── grace.css
│       │   ├── simple.css
│       │   └── hljs-github.css
│       ├── extensions/      # 扩展插件（10个）
│       │   ├── alert.ts     # GitHub 风格提示块
│       │   ├── footnotes.ts # 脚注支持
│       │   ├── katex.ts     # 数学公式
│       │   ├── toc.ts       # 目录生成
│       │   ├── infographic.ts # 信息图
│       │   ├── ruby.ts      # 注音
│       │   ├── slider.ts    # 滑块
│       │   ├── plantuml.ts  # UML 图表
│       │   ├── markup.ts    # 标记扩展
│       │   └── index.ts
│       └── utils/           # 工具函数
│           └── languages.ts # 语言配置
├── templates/                # 文章创作模板库
│   ├── opening_patterns.md  # 开篇模式库
│   ├── closing_patterns.md  # 结尾模式库
│   ├── language_rules.md    # 语言风格规则
│   └── structure_guide.md   # 结构模板
├── styles/                   # 文章样式
│   └── base_style.css       # 基础样式
├── examples/                 # 示例文章
│   ├── beginner_article.html
│   ├── intermediate_article.html
│   └── advanced_article.html
├── references/              # 参考文档
│   ├── article-posting.md   # 文章发布说明
│   └── image-text-posting.md # 图文发布说明
├── SKILL.md                 # 完整技能文档
├── SKILL-old.md             # 旧版技能文档
├── EXTEND-example.md        # 扩展配置示例
├── EXTEND-desc.md           # 扩展配置说明
├── package.json             # 依赖锁定
├── CROSS_PLATFORM.md        # 跨平台使用说明
├── USAGE.md                 # 使用指南
└── README.md                # 项目说明
```

## 📖 文档

- [SKILL.md](SKILL.md) - 完整技能文档（包含所有工作流程）
- [CROSS_PLATFORM.md](CROSS_PLATFORM.md) - 跨平台详细说明

## 🎨 主题样式

内置三种主题：

| 主题 | 风格 | 适用场景 |
|------|------|---------|
| `default` | 传统排版，标题居中带底边 | 正式文章、行业报告 |
| `grace` | 文字阴影，圆角卡片，精致引用（推荐）| 科普文章、个人博客 |
| `simple` | 现代极简，清爽留白 | 教程、短文 |

## 🤖 AI 生成参数

使用技能创作文章时，支持以下参数：

| 参数 | 必需 | 默认值 | 选项 |
|------|------|--------|------|
| input_type | ✅ | - | `keyword`, `url` |
| content | ✅ | - | 关键词字符串或 URL |
| length | ❌ | medium | `short`(2-3k字), `medium`(3-5k字), `long`(5-8k字) |
| depth | ❌ | intermediate | `beginner`, `intermediate`, `advanced` |
| style | ❌ | guide | `tutorial`, `guide`, `analysis`, `story` |
| include_code | ❌ | true | `true`, `false` |
| enable_research | ❌ | true | `true`, `false` |

**示例**：
```
/wechat-article-generator --input_type=keyword --content="Docker容器化" --length=medium --depth=intermediate --style=guide
```

## 💡 使用示例

### 创作新文章（AI 生成）

```
用户：写一篇关于 Docker 容器化的文章

Agent：
✓ WebSearch 调研关键词
✓ 询问参数
✓ 生成 3500 字文章（guide风格，中级深度）
✓ 转换为 HTML
✓ 清洗图片
✓ 发布到微信

结果：草稿已保存
```

### 发布链接文章（跳过生成）

```
用户：发布这篇文章到公众号：https://blog.example.com/docker

Agent：
✓ 下载文章 HTML 和图片
✓ 清洗图片元数据
✓ CSS 内联转换
✓ 发布到微信

结果：草稿已保存（无生成步骤）
```

### 发布 Markdown 文件（跳过生成）

```bash
# 发布 Markdown 文章
npx -y bun scripts/md-to-wechat.ts article.md --theme grace
npx -y bun scripts/wechat-api.ts article.html --inline-css
```

### 发布文章（带自定义封面）

```bash
# 1. 生成封面
npx -y bun scripts/generate-cover.ts --title "AI 编程助手的未来" --output cover.jpg

# 2. 发布文章
npx -y bun scripts/wechat-api.ts article.md \
  --cover cover.jpg \
  --title "AI 编程助手的未来" \
  --summary "探讨 AI 如何改变编程方式" \
  --inline-css
```

## 🔧 运行方式

所有脚本通过 `npx -y bun` 运行：

- **自动下载 Bun** - 如果未安装，npx 会自动下载
- **自动安装依赖** - 脚本首次运行时自动安装所需 npm 包
- **跨平台统一** - Windows、macOS、Linux 使用相同命令

## 🌍 平台兼容性

| 功能 | Windows | macOS | Linux |
|------|---------|-------|-------|
| 依赖自动安装 | ✅ | ✅ | ✅ |
| AI 文章生成 | ✅ | ✅ | ✅ |
| API 发布 | ✅ | ✅ | ✅ |
| 浏览器发布 | ✅ | ✅ | ✅ |
| 图文发布 | ✅ | ✅ | ✅ |
| 封面生成 | ✅ | ✅ | ✅ |
| Markdown 转换 | ✅ | ✅ | ✅ |

## ⚙️ 依赖说明

**核心依赖**（自动安装）：
- `front-matter` - Frontmatter 解析
- `highlight.js` - 代码高亮
- `marked` - Markdown 渲染引擎
- `reading-time` - 阅读时间计算
- `juice` - CSS 内联转换

**可选依赖**（封面图生成）：
- `@napi-rs/canvas` - 高性能图片生成（推荐）
- `sharp` - 图片处理库

**降级策略**：如果可选依赖未安装，自动生成 SVG 格式封面（微信支持）。

## 🐛 故障排查

### 首次运行较慢

**问题**：首次运行时需要下载 Bun 和安装依赖

**解决**：这是正常现象，等待完成即可。后续运行会更快。

### 依赖安装失败

**问题**：网络问题导致 npm install 失败

**解决**：
1. 检查网络连接
2. 配置 npm 镜像：`npm config set registry https://registry.npmmirror.com`
3. 重试命令

### 更多问题

参见 [SKILL.md](SKILL.md) 的故障排查部分。

## 📝 许可证

MIT

## 🙏 致谢

整合自以下技能的功能：
- `wechat-article-generator` - AI 文章生成、模板库、样式系统
- `wechat-article-writer` - 内容理解与创作
- `baoyu-post-to-wechat` - 发布流程与技术实现

## 📦 版本历史

### v2.0.0 (2026-03-24)

**重大更新**：整合 wechat-article-generator 与 wechat-article-maker

- ✅ 新增 AI 文章生成能力（基于 generator）
- ✅ 新增模板库（开篇、结尾、语言风格、结构）
- ✅ 新增参数化配置（长度、深度、风格、代码、调研）
- ✅ 保留独立发布能力（HTML/MD/链接直接发布）
- ✅ 新增 package.json 依赖锁定
- ✅ 新增示例文章

---

**开始使用，创作精彩文章！** 🚀