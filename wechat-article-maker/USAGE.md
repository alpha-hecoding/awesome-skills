# 使用指南

## 平台支持

✅ **Windows** | ✅ **macOS** | ✅ **Linux**

本技能完全支持跨平台使用，所有命令在三大操作系统上都能正常工作。

---

## 快速开始

### 1. 安装依赖（首次使用）

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

### 2. 运行脚本

所有脚本都会自动检测并使用最佳运行时（bun > tsx > ts-node > node）。

---

## 命令对照表

### API 方式发布文章

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
# 基本用法
./bin/wechat-api article.md --inline-css

# 使用命令行传递凭证
./bin/wechat-api article.md \
  --app-id wx123456 \
  --app-secret abc123 \
  --inline-css

# 添加标题和摘要
./bin/wechat-api article.md \
  --title "文章标题" \
  --summary "文章摘要" \
  --inline-css
```
</details>

<details>
<summary><b>Windows</b></summary>

```cmd
REM 基本用法
bin\wechat-api.bat article.md --inline-css

REM 使用命令行传递凭证
bin\wechat-api.bat article.md --app-id wx123456 --app-secret abc123 --inline-css

REM 添加标题和摘要
bin\wechat-api.bat article.md --title "文章标题" --summary "文章摘要" --inline-css
```
</details>

---

### 图片自动化处理与 AIGC 清洗

当通过 HTML 链接、HTML 文件或 Markdown 发布时，本技能会自动执行以下图片处理流程，以确保隐私安全和图片的“纯净性”：

1.  **自动下载**: 识别内容中的远程图片链接并自动下载。
2.  **元数据清洗 (Privacy Cleaning)**:
    *   **JPEG 强制清理**: 采用“白名单”机制，移除所有非必要的元数据段（如 **Exif**, **XMP**, **COM注释**）。这些段通常包含拍摄位置、设备信息以及 **AIGC (AI生成) 标记与提示词**。
    *   **PNG 深度清理**: 扫描并移除包含 `AIGC`, `Midjourney`, `DALL-E`, `parameters` 等敏感关键词的元数据块。
3.  **安全保留**: 仅保留图像解码和色彩显示所必须的核心数据（如 ICC 色彩配置文件），确保图片在公众号中的视觉效果不受影响。
4.  **自动上传**: 将清洗后的图片上传至微信素材库，并自动替换原 HTML 中的图片地址。

**为什么这很重要？**
*   **去除 AI 痕迹**: 消除图片中隐藏的 AI 生成工具信息，保证内容的原创纯净感。
*   **隐私保护**: 防止泄露拍摄地点、时间等敏感 Exif 信息。
*   **合规发布**: 避免因图片包含非法或敏感的隐藏元数据而导致文章发布失败。

---

### 浏览器方式发布

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
./bin/wechat-article --html article.html
```
</details>

<details>
<summary><b>Windows</b></summary>

```cmd
bin\wechat-article.bat --html article.html
```
</details>

---

### 生成封面图

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
# 基本用法
./bin/generate-cover --title "文章标题" --output cover.jpg

# 自定义颜色
./bin/generate-cover \
  --title "Claude Code 最佳实践" \
  --output cover.png \
  --gradient-start "#ff6b6b" \
  --gradient-end "#4ecdc4"

# 自定义尺寸
./bin/generate-cover \
  --title "文章标题" \
  --output cover.jpg \
  --width 1200 \
  --height 630
```
</details>

<details>
<summary><b>Windows</b></summary>

```cmd
REM 基本用法
bin\generate-cover.bat --title "文章标题" --output cover.jpg

REM 自定义颜色
bin\generate-cover.bat --title "Claude Code 最佳实践" --output cover.png --gradient-start "#ff6b6b" --gradient-end "#4ecdc4"

REM 自定义尺寸
bin\generate-cover.bat --title "文章标题" --output cover.jpg --width 1200 --height 630
```
</details>

---

### Markdown 转 HTML

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
# 经典主题
./bin/md-to-wechat article.md --theme default

# 优雅主题（推荐）
./bin/md-to-wechat article.md --theme grace

# 简洁主题
./bin/md-to-wechat article.md --theme simple
```
</details>

<details>
<summary><b>Windows</b></summary>

```cmd
REM 经典主题
bin\md-to-wechat.bat article.md --theme default

REM 优雅主题（推荐）
bin\md-to-wechat.bat article.md --theme grace

REM 简洁主题
bin\md-to-wechat.bat article.md --theme simple
```
</details>

---

## 运行时检测

脚本执行优先级（所有平台相同）：

1. **Bun**（最快） - 如果已安装
2. **tsx**（快速） - Node.js 环境推荐
3. **ts-node**（传统） - 经典方案
4. **node + 本地 tsx** - 从 node_modules 加载

您无需手动指定，脚本会自动选择最优方案。

---

## 配置 API 凭证

### 方法 1: 配置文件（推荐）

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
# 创建项目级配置
mkdir -p .awesome-skills
cat > .awesome-skills/.env << 'EOF'
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
EOF
```
</details>

<details>
<summary><b>Windows (CMD)</b></summary>

```cmd
REM 创建项目级配置
mkdir .awesome-skills
echo WECHAT_APP_ID=wx1234567890abcdef > .awesome-skills\.env
echo WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef >> .awesome-skills\.env
```
</details>

<details>
<summary><b>Windows (PowerShell)</b></summary>

```powershell
# 创建项目级配置
New-Item -ItemType Directory -Force -Path .awesome-skills
@"
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
"@ | Out-File -FilePath .awesome-skills\.env -Encoding UTF8
```
</details>

### 方法 2: 环境变量

<details>
<summary><b>Unix/Linux/macOS (Bash)</b></summary>

```bash
export WECHAT_APP_ID=wx1234567890abcdef
export WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
```
</details>

<details>
<summary><b>Windows (CMD)</b></summary>

```cmd
set WECHAT_APP_ID=wx1234567890abcdef
set WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
```
</details>

<details>
<summary><b>Windows (PowerShell)</b></summary>

```powershell
$env:WECHAT_APP_ID="wx1234567890abcdef"
$env:WECHAT_APP_SECRET="1234567890abcdef1234567890abcdef"
```
</details>

### 方法 3: 命令行参数（最灵活）

跨平台通用：

```bash
# Unix/Linux/macOS
./bin/wechat-api article.md \
  --app-id wx123456 \
  --app-secret abc123

# Windows
bin\wechat-api.bat article.md --app-id wx123456 --app-secret abc123
```

---

## 完整工作流示例

### 场景 1: 创作并发布新文章

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
# 1. 编写 Markdown 文章
vim my-article.md

# 2. 生成封面图
./bin/generate-cover --title "文章标题" --output cover.jpg

# 3. 转换为 HTML（可选，查看效果）
./bin/md-to-wechat my-article.md --theme grace

# 4. 发布到微信公众号
./bin/wechat-api my-article.md \
  --cover cover.jpg \
  --inline-css
```
</details>

<details>
<summary><b>Windows</b></summary>

```cmd
REM 1. 编写 Markdown 文章
notepad my-article.md

REM 2. 生成封面图
bin\generate-cover.bat --title "文章标题" --output cover.jpg

REM 3. 转换为 HTML（可选，查看效果）
bin\md-to-wechat.bat my-article.md --theme grace

REM 4. 发布到微信公众号
bin\wechat-api.bat my-article.md --cover cover.jpg --inline-css
```
</details>

### 场景 2: 使用临时凭证发布

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
./bin/wechat-api article.md \
  --app-id wx_temp_account \
  --app-secret temp_secret_key \
  --title "临时文章" \
  --inline-css
```
</details>

<details>
<summary><b>Windows</b></summary>

```cmd
bin\wechat-api.bat article.md --app-id wx_temp_account --app-secret temp_secret_key --title "临时文章" --inline-css
```
</details>

---

## 故障排查

### 运行时错误

**错误**: `No TypeScript runner found`

<details>
<summary><b>解决方案</b></summary>

**Unix/Linux/macOS**:
```bash
cd scripts
npm install
```

**Windows**:
```cmd
cd scripts
npm install
```
</details>

---

**错误**: `No JavaScript runtime found`

<details>
<summary><b>解决方案</b></summary>

安装 Node.js 或 Bun：
- Node.js: https://nodejs.org
- Bun: https://bun.sh
</details>

---

### 依赖问题

**问题**: `Cannot find module 'xxx'`

<details>
<summary><b>解决方案</b></summary>

**Unix/Linux/macOS**:
```bash
cd scripts
npm install
```

**Windows**:
```cmd
cd scripts
npm install
```
</details>

---

### 权限问题 (Unix/Linux/macOS)

**问题**: `Permission denied`

<details>
<summary><b>解决方案</b></summary>

```bash
chmod +x bin/*
```
</details>

---

### Windows 特定问题

**问题**: "不是内部或外部命令"

<details>
<summary><b>解决方案</b></summary>

1. 使用完整路径：
   ```cmd
   C:\path\to\wechat-article-maker\bin\wechat-api.bat article.md
   ```

2. 或使用 `call` 命令：
   ```cmd
   call bin\wechat-api.bat article.md
   ```

3. 在 PowerShell 中：
   ```powershell
   .\bin\wechat-api.bat article.md
   ```
</details>

---

**问题**: 路径包含空格导致错误

<details>
<summary><b>解决方案</b></summary>

使用引号包裹路径：

**Unix/Linux/macOS**:
```bash
"/path/with spaces/bin/wechat-api" article.md
```

**Windows**:
```cmd
"C:\path\with spaces\bin\wechat-api.bat" article.md
```
</details>

---

## 高级用法

### 自定义主题

<details>
<summary><b>创建自定义主题</b></summary>

1. 在 `scripts/md/themes/` 创建新的 CSS 文件：

**Unix/Linux/macOS**:
```bash
cp scripts/md/themes/grace.css scripts/md/themes/my-theme.css
vim scripts/md/themes/my-theme.css
```

**Windows**:
```cmd
copy scripts\md\themes\grace.css scripts\md\themes\my-theme.css
notepad scripts\md\themes\my-theme.css
```

2. 使用自定义主题：

**Unix/Linux/macOS**:
```bash
./bin/md-to-wechat article.md --theme my-theme
```

**Windows**:
```cmd
bin\md-to-wechat.bat article.md --theme my-theme
```
</details>

---

### 批量处理

<details>
<summary><b>Unix/Linux/macOS</b></summary>

```bash
# 批量转换 Markdown 文件
for file in articles/*.md; do
  ./bin/md-to-wechat "$file" --theme grace
done

# 批量发布
for file in articles/*.md; do
  ./bin/wechat-api "$file" --inline-css
done
```
</details>

<details>
<summary><b>Windows (PowerShell)</b></summary>

```powershell
# 批量转换 Markdown 文件
Get-ChildItem articles\*.md | ForEach-Object {
  .\bin\md-to-wechat.bat $_.FullName --theme grace
}

# 批量发布
Get-ChildItem articles\*.md | ForEach-Object {
  .\bin\wechat-api.bat $_.FullName --inline-css
}
```
</details>

---

## 参考文档

- [SKILL.md](SKILL.md) - 完整技能文档
- [CROSS_PLATFORM.md](CROSS_PLATFORM.md) - 跨平台详细说明
- [STRUCTURE.md](STRUCTURE.md) - 目录结构说明
- [README.md](README.md) - 快速开始指南

---

## 获取帮助

所有命令都支持 `--help` 参数查看详细说明：

**Unix/Linux/macOS**:
```bash
./bin/wechat-api --help
./bin/generate-cover --help
```

**Windows**:
```cmd
bin\wechat-api.bat --help
bin\generate-cover.bat --help
```

---

## 总结

- ✅ **跨平台** - Windows、macOS、Linux 完全支持
- ✅ **自动检测** - 运行时和平台自动适配
- ✅ **灵活配置** - 支持配置文件、环境变量、命令行参数
- ✅ **易于使用** - 统一的命令接口和参数
- ✅ **完善文档** - 详细的使用说明和故障排查

祝您使用愉快！🚀
