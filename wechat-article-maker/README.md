# WeChat Article Maker

智能创作并发布微信公众号文章的完整工具。

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue.svg)](https://github.com)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🌟 特性

- ✅ **完全跨平台** - Windows、macOS、Linux 原生支持
- ✅ **智能运行时检测** - 自动选择最佳运行时（bun/tsx/ts-node/node）
- ✅ **内容创作** - AI 辅助生成文章
- ✅ **链接发布** - 下载并转换外部文章
- ✅ **Markdown 转换** - 支持多主题（default/grace/simple）
- ✅ **图片自动清洗** - 移除 AIGC 标记，符合微信规范
- ✅ **CSS 内联转换** - 自动转换样式为内联格式
- ✅ **封面图生成** - 无系统依赖，纯 Node.js 实现
- ✅ **灵活的凭证传递** - 支持配置文件、环境变量、命令行参数

## 🚀 快速开始

### 安装依赖

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
cd /path/to/wechat-article-maker
bin/install-deps.sh
```
</details>

<details>
<summary><b>Windows</b></summary>

```cmd
cd C:\path\to\wechat-article-maker
bin\install-deps.bat
```
</details>

### 配置 API 凭证

<details>
<summary><b>方法 1: 配置文件（推荐）</b></summary>

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
</details>

<details>
<summary><b>方法 2: 命令行参数（最灵活）</b></summary>

直接在命令中传递凭证，无需配置文件：

```bash
# Unix/Linux/macOS
bin/wechat-api article.md --app-id wx123456 --app-secret abc123 --inline-css

# Windows
bin\wechat-api.bat article.md --app-id wx123456 --app-secret abc123 --inline-css
```
</details>

### 开始使用

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
# 发布 Markdown 文章
bin/wechat-api article.md --inline-css

# 生成封面图
bin/generate-cover --title "文章标题" --output cover.jpg

# Markdown 转 HTML
bin/md-to-wechat article.md --theme grace
```
</details>

<details>
<summary><b>Windows</b></summary>

```cmd
REM 发布 Markdown 文章
bin\wechat-api.bat article.md --inline-css

REM 生成封面图
bin\generate-cover.bat --title "文章标题" --output cover.jpg

REM Markdown 转 HTML
bin\md-to-wechat.bat article.md --theme grace
```
</details>

## 📁 目录结构

```
wechat-article-maker/
├── bin/                      # 可执行脚本（跨平台）
│   ├── wechat-api (.bat)    # API 发布
│   ├── wechat-article (.bat) # 浏览器发布
│   ├── generate-cover (.bat) # 封面生成
│   ├── md-to-wechat (.bat)   # Markdown 转换
│   └── install-deps (.sh/.bat) # 依赖安装
├── scripts/                  # TypeScript 源代码
│   ├── md/themes/           # 主题样式（3种）
│   ├── package.json         # 依赖配置
│   └── *.ts                 # 业务逻辑
└── references/              # 参考文档
```

## 📖 文档

- [SKILL.md](SKILL.md) - 完整技能文档（包含所有工作流程）
- [USAGE.md](USAGE.md) - 详细使用指南（带跨平台示例）
- [CROSS_PLATFORM.md](CROSS_PLATFORM.md) - 跨平台详细说明
- [STRUCTURE.md](STRUCTURE.md) - 目录结构说明

## 🎨 主题样式

内置三种主题：

| 主题 | 风格 | 适用场景 |
|------|------|---------|
| `default` | 传统排版，标题居中带底边 | 正式文章、行业报告 |
| `grace` | 文字阴影，圆角卡片，精致引用（推荐）| 科普文章、个人博客 |
| `simple` | 现代极简，清爽留白 | 教程、短文 |

## 💡 使用示例

### 发布文章（带自定义封面）

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
# 1. 生成封面
bin/generate-cover --title "AI 编程助手的未来" --output cover.jpg

# 2. 发布文章
bin/wechat-api article.md \
  --cover cover.jpg \
  --title "AI 编程助手的未来" \
  --summary "探讨 AI 如何改变编程方式" \
  --inline-css
```
</details>

<details>
<summary><b>Windows</b></summary>

```cmd
REM 1. 生成封面
bin\generate-cover.bat --title "AI 编程助手的未来" --output cover.jpg

REM 2. 发布文章
bin\wechat-api.bat article.md --cover cover.jpg --title "AI 编程助手的未来" --summary "探讨 AI 如何改变编程方式" --inline-css
```
</details>

### 使用不同主题

```bash
# Unix/Linux/macOS
bin/md-to-wechat article.md --theme default  # 经典主题
bin/md-to-wechat article.md --theme grace    # 优雅主题（推荐）
bin/md-to-wechat article.md --theme simple   # 简洁主题

# Windows
bin\md-to-wechat.bat article.md --theme default
bin\md-to-wechat.bat article.md --theme grace
bin\md-to-wechat.bat article.md --theme simple
```

## 🔧 运行时支持

脚本会自动检测并使用最佳运行时：

1. **Bun** ⚡ - 最快（推荐）
2. **tsx** 🚀 - 快速 TypeScript 运行器
3. **ts-node** 📦 - 传统方案
4. **node + 本地 tsx** 🔄 - 从 node_modules 加载

无需手动配置，开箱即用！

## 🌍 平台兼容性

| 功能 | Windows | macOS | Linux |
|------|---------|-------|-------|
| 依赖安装 | ✅ | ✅ | ✅ |
| API 发布 | ✅ | ✅ | ✅ |
| 浏览器发布 | ✅ | ✅ | ✅ |
| 图文发布 | ✅ | ✅ | ✅ |
| 封面生成 | ✅ | ✅ | ✅ |
| Markdown 转换 | ✅ | ✅ | ✅ |

## ⚙️ 依赖说明

**必需依赖**（自动安装）：
- `markdown-it` - Markdown 渲染引擎
- `juice` - CSS 内联转换
- `tsx` - TypeScript 运行器

**可选依赖**（封面图生成）：
- `@napi-rs/canvas` - 高性能图片生成（推荐）
- `sharp` - 图片处理库

**降级策略**：如果可选依赖未安装，自动生成 SVG 格式封面（微信支持）。

## 🐛 故障排查

### 依赖未安装

```bash
# Unix/Linux/macOS
bin/install-deps.sh

# Windows
bin\install-deps.bat
```

### 运行时未找到

安装 Node.js（>= 18.0.0）或 Bun：
- Node.js: https://nodejs.org
- Bun: https://bun.sh

### 更多问题

参见 [USAGE.md](USAGE.md) 的故障排查部分。

## 📝 许可证

MIT

## 🙏 致谢

整合自以下技能的功能：
- `wechat-article-writer` - 内容理解与创作
- `baoyu-post-to-wechat` - 发布流程与技术实现

---

**开始使用，创作精彩文章！** 🚀
