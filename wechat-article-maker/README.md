# WeChat Article Maker

智能创作并发布微信公众号文章的完整工具。

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue.svg)](https://github.com)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🌟 特性

- ✅ **完全跨平台** - Windows、macOS、Linux 原生支持
- ✅ **零配置运行** - 使用 `npx -y bun` 自动下载运行时
- ✅ **依赖自动安装** - 首次运行时自动安装所需依赖
- ✅ **内容创作** - AI 辅助生成文章
- ✅ **链接发布** - 下载并转换外部文章
- ✅ **Markdown 转换** - 支持多主题（default/grace/simple）
- ✅ **图片自动清洗** - 移除 AIGC 标记，符合微信规范
- ✅ **CSS 内联转换** - 自动转换样式为内联格式
- ✅ **封面图生成** - 无系统依赖，纯 Node.js 实现
- ✅ **灵活的凭证传递** - 支持配置文件、环境变量、命令行参数

## 🚀 快速开始

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

### 开始使用

```bash
# 1. 进入项目目录
cd /path/to/wechat-article-maker

# 2. 发布 Markdown 文章（自动安装依赖）
npx -y bun scripts/wechat-api.ts article.md --inline-css

# 3. 生成封面图
npx -y bun scripts/generate-cover.ts --title "文章标题" --output cover.jpg

# 4. Markdown 转 HTML
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
│   ├── generate-cover.ts    # 封面生成
│   ├── md-to-wechat.ts      # Markdown 转换
│   ├── ensure-deps.ts       # 依赖自动安装
│   ├── md/                  # Markdown 渲染引擎
│   │   ├── themes/          # 主题样式（3种）
│   │   └── extensions/      # 扩展插件
│   └── node_modules/        # 自动安装的依赖
├── references/              # 参考文档
├── SKILL.md                 # 完整技能文档
├── CROSS_PLATFORM.md        # 跨平台使用说明
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

## 💡 使用示例

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

### 使用不同主题

```bash
npx -y bun scripts/md-to-wechat.ts article.md --theme default  # 经典主题
npx -y bun scripts/md-to-wechat.ts article.md --theme grace    # 优雅主题（推荐）
npx -y bun scripts/md-to-wechat.ts article.md --theme simple   # 简洁主题
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
| API 发布 | ✅ | ✅ | ✅ |
| 浏览器发布 | ✅ | ✅ | ✅ |
| 图文发布 | ✅ | ✅ | ✅ |
| 封面生成 | ✅ | ✅ | ✅ |
| Markdown 转换 | ✅ | ✅ | ✅ |

## ⚙️ 依赖说明

**必需依赖**（自动安装）：
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
- `wechat-article-writer` - 内容理解与创作
- `baoyu-post-to-wechat` - 发布流程与技术实现

---

**开始使用，创作精彩文章！** 🚀
