# WeChat Article Maker

智能创作并发布微信公众号文章的完整工具。

## 快速开始

### 1. 安装依赖

```bash
cd scripts
./install-deps.sh
```

或手动安装：

```bash
cd scripts
npm install
```

### 2. 配置 API 凭证

创建 `.awesome-skills/.env` 文件：

```bash
mkdir -p .awesome-skills
cat > .awesome-skills/.env << 'ENVEOF'
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret
ENVEOF
```

### 3. 开始使用

```bash
# 发布 Markdown 文章
npx -y bun scripts/wechat-api.ts article.md --inline-css

# 使用命令行传递凭证
npx -y bun scripts/wechat-api.ts article.md \
  --app-id wx123456 \
  --app-secret abc123 \
  --inline-css
```

## 功能特性

- ✅ 内容创作（AI 辅助生成文章）
- ✅ 链接发布（下载并转换外部文章）
- ✅ Markdown 转 HTML（支持多主题）
- ✅ 图片自动清洗（移除 AIGC 标记）
- ✅ CSS 内联转换（符合微信规范）
- ✅ 封面图生成（无系统依赖）
- ✅ 灵活的 API 发布方式

## 依赖说明

**必需**：
- Node.js >= 18.0.0 或 Bun
- markdown-it（自动安装）
- juice（自动安装）

**可选**（封面图生成）：
- @napi-rs/canvas 或 sharp
- 如未安装，自动降级为 SVG 格式

## 详细文档

完整使用说明请查看 [SKILL.md](SKILL.md)

## 许可证

MIT
