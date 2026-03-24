# awesome-skills

Claude Code 技能集合 - 微信公众号文章创作与发布工具

## 概述

本仓库包含用于微信公众号文章创作与发布的 Claude Code 技能：

### 1. wechat-article-maker (TypeScript)

完整的微信公众号文章创作与发布工具，整合了 AI 生成、Markdown 渲染、图片处理和发布功能。

**核心功能**：
- 🤖 AI 文章生成 - 基于关键词或链接智能生成文章
- 📝 模板驱动创作 - 内置开篇、结尾、语言风格模板
- 🎨 多主题支持 - default、grace、simple 三种主题
- 🖼️ 图片处理 - 自动下载、元数据清洗、AIGC 标记移除
- 📤 多种发布方式 - API 发布、浏览器发布、图文发布
- 🔧 Markdown 扩展 - 支持 10+ 扩展插件（数学公式、脚注、目录等）

**技术栈**：
- TypeScript + Bun/Node.js
- marked + markdown-it 扩展
- sharp (图片处理)
- @napi-rs/canvas (封面生成)

**快速开始**：
```bash
# API 发布文章
npx -y bun scripts/wechat-api.ts article.md --inline-css

# Markdown 转换
npx -y bun scripts/md-to-wechat.ts article.md --theme grace

# 生成封面
npx -y bun scripts/generate-cover.ts --title "标题" --output cover.jpg
```

**详细文档**：
- [wechat-article-maker/README.md](wechat-article-maker/README.md) - 项目说明
- [wechat-article-maker/USAGE.md](wechat-article-maker/USAGE.md) - 使用指南
- [wechat-article-maker/SKILL.md](wechat-article-maker/SKILL.md) - 完整技能文档

### 2. wechat-article-skill (Python)

基于 Python 的微信公众号文章技能，提供封面生成和基础发布功能。

**核心功能**：
- 🎨 封面生成 - Pillow 实现，多种风格和配色
- 📤 API 发布 - 微信公众平台 API 对接

**技术栈**：
- Python 3
- Pillow (图片处理)

**快速开始**：
```bash
# 生成封面
python3 scripts/create_cover.py --title "标题" --style minimal-grid --output cover.jpg

# 发布草稿
python3 scripts/publish_draft.py --title "标题" --content-file article.html --cover cover.jpg
```

## 目录结构

```
awesome-skills/
├── wechat-article-maker/     # TypeScript 完整工具
│   ├── scripts/              # 源代码 (11 个脚本)
│   ├── templates/            # 文章创作模板
│   ├── styles/               # 文章样式
│   ├── examples/             # 示例文章
│   ├── references/           # 参考文档
│   └── ...
├── wechat-article-skill/     # Python 技能
│   ├── scripts/              # Python 脚本
│   ├── assets/               # 资源文件
│   └── ...
├── CLAUDE.md                 # Claude Code 项目配置
└── README.md                 # 项目说明
```

## 功能对比

| 功能 | wechat-article-maker | wechat-article-skill |
|------|---------------------|---------------------|
| **语言** | TypeScript | Python |
| **AI 生成** | ✅ | ❌ |
| **Markdown 转换** | ✅ (10+ 扩展) | ❌ |
| **封面生成** | ✅ (@napi-rs/canvas) | ✅ (Pillow) |
| **图片处理** | ✅ (sharp) | ❌ |
| **发布方式** | API + 浏览器 + 图文 | API |
| **主题支持** | 3 种 | ❌ |
| **模板库** | ✅ | ❌ |

## 快速选择

- **选择 wechat-article-maker** 如果你需要：
  - AI 生成文章内容
  - Markdown 转 HTML 并应用主题
  - 处理图片（清洗元数据、移除 AIGC 标记）
  - 使用浏览器自动化发布
  - 使用丰富的 Markdown 扩展（数学公式、脚注等）

- **选择 wechat-article-skill** 如果你：
  - 仅需要生成封面图
  - 使用 Python 环境
  - 需要简单的 API 发布功能

## 许可证

MIT

## 致谢

整合自以下项目和技能：
- wechat-article-generator
- wechat-article-writer
- baoyu-post-to-wechat