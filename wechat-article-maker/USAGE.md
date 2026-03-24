# 使用指南

## 平台支持

✅ **Windows** | ✅ **macOS** | ✅ **Linux**

本技能完全支持跨平台使用，所有命令在三大操作系统上使用统一的 `npx -y bun` 格式。

---

## 快速开始

### 运行脚本

所有脚本通过 `npx -y bun` 运行，无需手动安装 Bun 或依赖：

```bash
npx -y bun scripts/<script>.ts [options]
```

首次运行时会自动下载 Bun 和安装所需依赖。

---

## 可用脚本

| 脚本 | 功能 | 用途 |
|------|------|------|
| `wechat-api.ts` | API 发布 | 通过微信 API 发布文章到草稿箱 |
| `wechat-article.ts` | 浏览器发布 | 自动化浏览器操作发布文章 |
| `wechat-browser.ts` | 图文发布 | 发布短文 + 多张图片（最多9张） |
| `wechat-agent-browser.ts` | Agent 浏览器发布 | Agent 模式的浏览器发布 |
| `md-to-wechat.ts` | Markdown 转换 | 将 Markdown 转换为微信兼容的 HTML |
| `generate-cover.ts` | 封面生成 | 生成文章封面图（支持多种格式） |
| `image-utils.ts` | 图片工具 | 图片处理和元数据清洗 |
| `ensure-deps.ts` | 依赖安装 | 自动检查并安装依赖 |
| `copy-to-clipboard.ts` | 剪贴板复制 | 复制内容到系统剪贴板 |
| `paste-from-clipboard.ts` | 剪贴板粘贴 | 从系统剪贴板粘贴内容 |
| `cdp.ts` | Chrome DevTools | Chrome DevTools Protocol 工具 |

---

## 命令对照表

### API 方式发布文章

```bash
# 基本用法
npx -y bun scripts/wechat-api.ts article.md --inline-css

# 使用命令行传递凭证
npx -y bun scripts/wechat-api.ts article.md \
  --app-id wx123456 \
  --app-secret abc123 \
  --inline-css

# 添加标题和摘要
npx -y bun scripts/wechat-api.ts article.md \
  --title "文章标题" \
  --summary "文章摘要" \
  --inline-css
```

---

### 图片自动化处理与 AIGC 清洗

当通过 HTML 链接、HTML 文件或 Markdown 发布时，本技能会自动执行以下图片处理流程，以确保隐私安全和图片的"纯净性"：

1.  **自动下载**: 识别内容中的远程图片链接并自动下载。
2.  **元数据清洗 (Privacy Cleaning)**:
    *   **JPEG 强制清理**: 采用"白名单"机制，移除所有非必要的元数据段（如 **Exif**, **XMP**, **COM注释**）。这些段通常包含拍摄位置、设备信息以及 **AIGC (AI生成) 标记与提示词**。
    *   **PNG 深度清理**: 扫描并移除包含 `AIGC`, `Midjourney`, `DALL-E`, `parameters` 等敏感关键词的元数据块。
3.  **安全保留**: 仅保留图像解码和色彩显示所必须的核心数据（如 ICC 色彩配置文件），确保图片在公众号中的视觉效果不受影响。
4.  **自动上传**: 将清洗后的图片上传至微信素材库，并自动替换原 HTML 中的图片地址。

**为什么这很重要？**
*   **去除 AI 痕迹**: 消除图片中隐藏的 AI 生成工具信息，保证内容的原创纯净感。
*   **隐私保护**: 防止泄露拍摄地点、时间等敏感 Exif 信息。
*   **合规发布**: 避免因图片包含非法或敏感的隐藏元数据而导致文章发布失败。

---

### 浏览器方式发布

```bash
npx -y bun scripts/wechat-article.ts --html article.html
```

---

### 生成封面图

```bash
# 基本用法
npx -y bun scripts/generate-cover.ts --title "文章标题" --output cover.jpg

# 自定义颜色
npx -y bun scripts/generate-cover.ts \
  --title "Claude Code 最佳实践" \
  --output cover.png \
  --gradient-start "#ff6b6b" \
  --gradient-end "#4ecdc4"

# 自定义尺寸
npx -y bun scripts/generate-cover.ts \
  --title "文章标题" \
  --output cover.jpg \
  --width 1200 \
  --height 630
```

---

### Markdown 转 HTML

```bash
# 经典主题
npx -y bun scripts/md-to-wechat.ts article.md --theme default

# 优雅主题（推荐）
npx -y bun scripts/md-to-wechat.ts article.md --theme grace

# 简洁主题
npx -y bun scripts/md-to-wechat.ts article.md --theme simple
```

---

## 运行方式

所有脚本通过 `npx -y bun` 运行：

- **自动下载 Bun** - 如果未安装，npx 会自动下载
- **自动安装依赖** - 脚本首次运行时自动安装所需 npm 包
- **跨平台统一** - Windows、macOS、Linux 使用相同命令

---

## 配置 API 凭证

### 方法 1: 配置文件（推荐）

**Unix/Linux/macOS**:
```bash
mkdir -p .awesome-skills
cat > .awesome-skills/.env << 'EOF'
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
EOF
```

**Windows (CMD)**:
```cmd
mkdir .awesome-skills
echo WECHAT_APP_ID=wx1234567890abcdef > .awesome-skills\.env
echo WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef >> .awesome-skills\.env
```

**Windows (PowerShell)**:
```powershell
New-Item -ItemType Directory -Force -Path .awesome-skills
@"
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
"@ | Out-File -FilePath .awesome-skills\.env -Encoding UTF8
```

### 方法 2: 环境变量

**Unix/Linux/macOS (Bash)**:
```bash
export WECHAT_APP_ID=wx1234567890abcdef
export WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
```

**Windows (CMD)**:
```cmd
set WECHAT_APP_ID=wx1234567890abcdef
set WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
```

**Windows (PowerShell)**:
```powershell
$env:WECHAT_APP_ID="wx1234567890abcdef"
$env:WECHAT_APP_SECRET="1234567890abcdef1234567890abcdef"
```

### 方法 3: 命令行参数（最灵活）

跨平台通用：

```bash
npx -y bun scripts/wechat-api.ts article.md \
  --app-id wx123456 \
  --app-secret abc123
```

---

## 完整工作流示例

### 场景 1: 创作并发布新文章

```bash
# 1. 编写 Markdown 文章
vim my-article.md

# 2. 生成封面图
npx -y bun scripts/generate-cover.ts --title "文章标题" --output cover.jpg

# 3. 转换为 HTML（可选，查看效果）
npx -y bun scripts/md-to-wechat.ts my-article.md --theme grace

# 4. 发布到微信公众号
npx -y bun scripts/wechat-api.ts my-article.md \
  --cover cover.jpg \
  --inline-css
```

### 场景 2: 使用临时凭证发布

```bash
npx -y bun scripts/wechat-api.ts article.md \
  --app-id wx_temp_account \
  --app-secret temp_secret_key \
  --title "临时文章" \
  --inline-css
```

---

## 故障排查

### 首次运行较慢

**问题**: 首次运行时需要下载 Bun 和安装依赖

**解决**: 这是正常现象，等待完成即可。后续运行会更快。

---

### 依赖安装失败

**问题**: `Cannot find module 'xxx'` 或网络错误

**解决**:
1. 检查网络连接
2. 配置 npm 镜像：`npm config set registry https://registry.npmmirror.com`
3. 手动安装依赖：
   ```bash
   cd scripts
   npm install front-matter highlight.js marked reading-time juice
   ```

---

### 路径包含空格导致错误

**解决**: 使用引号包裹路径

```bash
npx -y bun "/path/with spaces/scripts/wechat-api.ts" article.md
```

---

## 高级用法

### 自定义主题

1. 在 `scripts/md/themes/` 创建新的 CSS 文件：

```bash
cp scripts/md/themes/grace.css scripts/md/themes/my-theme.css
# 编辑 my-theme.css
```

2. 使用自定义主题：

```bash
npx -y bun scripts/md-to-wechat.ts article.md --theme my-theme
```

---

### 批量处理

**Unix/Linux/macOS**:
```bash
# 批量转换 Markdown 文件
for file in articles/*.md; do
  npx -y bun scripts/md-to-wechat.ts "$file" --theme grace
done

# 批量发布
for file in articles/*.md; do
  npx -y bun scripts/wechat-api.ts "$file" --inline-css
done
```

**Windows (PowerShell)**:
```powershell
# 批量转换 Markdown 文件
Get-ChildItem articles\*.md | ForEach-Object {
  npx -y bun scripts/md-to-wechat.ts $_.FullName --theme grace
}

# 批量发布
Get-ChildItem articles\*.md | ForEach-Object {
  npx -y bun scripts/wechat-api.ts $_.FullName --inline-css
}
```

---

### Markdown 扩展功能

本技能内置丰富的 Markdown 扩展插件（位于 `scripts/md/extensions/`）：

**支持的扩展**：
- **alert** - GitHub 风格提示块（Note, Warning, Important 等）
- **footnotes** - 脚注支持
- **katex** - 数学公式渲染（LaTeX 语法）
- **toc** - 自动生成目录
- **infographic** - 信息图展示
- **ruby** - 注音标记（用于日文、中文注音）
- **slider** - 滑块对比展示
- **plantuml** - UML 图表渲染
- **markup** - 标记扩展

**使用示例**：
```markdown
<!-- GitHub 风格提示 -->
> [!NOTE]
> 这是一个提示

> [!WARNING]
> 这是一个警告

<!-- 数学公式 -->
$$
E = mc^2
$$

<!-- 目录 -->
[[toc]]

<!-- 脚注 -->
这是一个引用[^1]

[^1]: 这是脚注内容
```

---

## 参考文档

- [SKILL.md](SKILL.md) - 完整技能文档（包含所有工作流程）
- [CROSS_PLATFORM.md](CROSS_PLATFORM.md) - 跨平台详细说明
- [README.md](README.md) - 快速开始指南
- [references/article-posting.md](references/article-posting.md) - 文章发布详细说明
- [references/image-text-posting.md](references/image-text-posting.md) - 图文发布详细说明
- [templates/](templates/) - 文章创作模板库
- [examples/](examples/) - 示例文章

---

## 获取帮助

所有命令都支持 `--help` 参数查看详细说明：

```bash
npx -y bun scripts/wechat-api.ts --help
npx -y bun scripts/generate-cover.ts --help
```

---

## 总结

- ✅ **跨平台** - Windows、macOS、Linux 完全支持
- ✅ **统一命令** - 所有平台使用相同的 `npx -y bun` 命令
- ✅ **自动依赖** - 依赖在首次运行时自动安装
- ✅ **零配置** - 无需手动安装 Bun 或依赖
- ✅ **灵活配置** - 支持配置文件、环境变量、命令行参数

祝您使用愉快！🚀
