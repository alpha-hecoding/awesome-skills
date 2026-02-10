# 跨平台使用指南

本技能完全支持 Windows、macOS 和 Linux 三大操作系统。

## 平台兼容性

| 功能 | Windows | macOS | Linux |
|------|---------|-------|-------|
| 依赖自动安装 | ✅ | ✅ | ✅ |
| API 发布 | ✅ | ✅ | ✅ |
| 浏览器发布 | ✅ | ✅ | ✅ |
| 图文发布 | ✅ | ✅ | ✅ |
| 封面生成 | ✅ | ✅ | ✅ |
| Markdown 转换 | ✅ | ✅ | ✅ |

## 统一的运行方式

所有平台使用相同的命令格式：

```bash
npx -y bun "${SKILL_DIR}/scripts/<script>.ts" [options]
```

### 命令示例

| 功能 | 命令 |
|------|------|
| API 发布 | `npx -y bun "${SKILL_DIR}/scripts/wechat-api.ts" article.md --inline-css` |
| 浏览器发布 | `npx -y bun "${SKILL_DIR}/scripts/wechat-article.ts" --html article.html` |
| 封面生成 | `npx -y bun "${SKILL_DIR}/scripts/generate-cover.ts" --title "标题" --output cover.jpg` |
| Markdown 转换 | `npx -y bun "${SKILL_DIR}/scripts/md-to-wechat.ts" article.md --theme grace` |
| 图文发布 | `npx -y bun "${SKILL_DIR}/scripts/wechat-browser.ts" --markdown article.md --images ./images/` |

**注意**：`npx -y bun` 会自动下载并使用 Bun 运行时，无需手动安装。

## 依赖管理

依赖会在脚本首次运行时自动安装：

1. 脚本检测所需依赖
2. 如果缺失，自动运行 `npm install --no-save <package>`
3. 安装完成后继续执行脚本

**必需依赖**（自动安装）：
- `front-matter` - Frontmatter 解析
- `highlight.js` - 代码高亮
- `marked` - Markdown 渲染引擎
- `reading-time` - 阅读时间计算
- `juice` - CSS 内联转换

**可选依赖**（用于封面图生成）：
- `@napi-rs/canvas` - 高性能图片生成
- `sharp` - 图片处理库

## 环境变量

环境变量的设置方式因平台而异：

### Unix/Linux/macOS

```bash
export WECHAT_APP_ID=wx123456
export WECHAT_APP_SECRET=abc123
```

### Windows CMD

```cmd
set WECHAT_APP_ID=wx123456
set WECHAT_APP_SECRET=abc123
```

### Windows PowerShell

```powershell
$env:WECHAT_APP_ID="wx123456"
$env:WECHAT_APP_SECRET="abc123"
```

## 配置文件路径

配置文件位置是跨平台的：

| 配置 | 位置 |
|------|------|
| 项目级 | `.awesome-skills/.env` |
| 用户级 | `~/.awesome-skills/.env`（Unix）<br>`%USERPROFILE%\.awesome-skills\.env`（Windows）|

## 常见问题

### 路径包含空格

**问题**：路径中包含空格导致错误

**解决**：使用引号包裹路径

```bash
npx -y bun "/path/with spaces/scripts/wechat-api.ts" article.md
```

### 首次运行较慢

**问题**：首次运行时需要下载 Bun 和安装依赖

**解决**：这是正常现象，等待完成即可。后续运行会更快。

### 依赖安装失败

**问题**：网络问题导致 npm install 失败

**解决**：
1. 检查网络连接
2. 配置 npm 镜像：`npm config set registry https://registry.npmmirror.com`
3. 重试命令

## 总结

- ✅ **完全跨平台** - Windows、macOS、Linux 都支持
- ✅ **统一命令** - 所有平台使用相同的 `npx -y bun` 命令
- ✅ **自动依赖** - 依赖在首次运行时自动安装
- ✅ **零配置** - 无需手动安装 Bun 或依赖
- ✅ **AI 友好** - 简单的命令格式，易于 AI Agent 使用
