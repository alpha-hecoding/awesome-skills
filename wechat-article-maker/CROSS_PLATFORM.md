# 跨平台使用指南

本技能完全支持 Windows、macOS 和 Linux 三大操作系统。

## 平台兼容性

| 功能 | Windows | macOS | Linux |
|------|---------|-------|-------|
| 依赖安装 | ✅ | ✅ | ✅ |
| API 发布 | ✅ | ✅ | ✅ |
| 浏览器发布 | ✅ | ✅ | ✅ |
| 图文发布 | ✅ | ✅ | ✅ |
| 封面生成 | ✅ | ✅ | ✅ |
| Markdown 转换 | ✅ | ✅ | ✅ |

## 命令对照表

### 依赖安装

| 平台 | 命令 |
|------|------|
| Unix/Linux/macOS | `${SKILL_DIR}/bin/install-deps.sh` |
| Windows | `${SKILL_DIR}\bin\install-deps.bat` |

### API 发布

| 平台 | 命令 |
|------|------|
| Unix/Linux/macOS | `${SKILL_DIR}/bin/wechat-api article.md --inline-css` |
| Windows | `${SKILL_DIR}\bin\wechat-api.bat article.md --inline-css` |

### 浏览器发布

| 平台 | 命令 |
|------|------|
| Unix/Linux/macOS | `${SKILL_DIR}/bin/wechat-article --html article.html` |
| Windows | `${SKILL_DIR}\bin\wechat-article.bat --html article.html` |

### 封面生成

| 平台 | 命令 |
|------|------|
| Unix/Linux/macOS | `${SKILL_DIR}/bin/generate-cover --title "标题" --output cover.jpg` |
| Windows | `${SKILL_DIR}\bin\generate-cover.bat --title "标题" --output cover.jpg` |

### Markdown 转换

| 平台 | 命令 |
|------|------|
| Unix/Linux/macOS | `${SKILL_DIR}/bin/md-to-wechat article.md --theme grace` |
| Windows | `${SKILL_DIR}\bin\md-to-wechat.bat article.md --theme grace` |

## AI Agent 平台检测

AI Agent 应该使用以下逻辑自动检测平台并选择正确的命令：

### Bash 脚本检测

```bash
#!/bin/bash
# 检测操作系统并设置脚本扩展名
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OS" == "Windows_NT" ]]; then
    # Windows 环境
    SCRIPT_EXT=".bat"
    PATH_SEP="\\"
else
    # Unix/Linux/macOS 环境
    SCRIPT_EXT=""
    PATH_SEP="/"
fi

# 使用检测到的扩展名
"${SKILL_DIR}${PATH_SEP}bin${PATH_SEP}wechat-api${SCRIPT_EXT}" article.md --inline-css
```

### Python 脚本检测

```python
import os
import platform
import subprocess

# 检测操作系统
is_windows = platform.system() == 'Windows' or os.name == 'nt'

# 设置命令
skill_dir = '/path/to/wechat-article-maker'
if is_windows:
    script_ext = '.bat'
    path_sep = '\\'
else:
    script_ext = ''
    path_sep = '/'

# 构建命令
cmd = f'{skill_dir}{path_sep}bin{path_sep}wechat-api{script_ext}'

# 执行
subprocess.run([cmd, 'article.md', '--inline-css'])
```

### Node.js 脚本检测

```javascript
const os = require('os');
const { spawn } = require('child_process');
const path = require('path');

// 检测操作系统
const isWindows = os.platform() === 'win32';

// 设置命令
const skillDir = '/path/to/wechat-article-maker';
const scriptExt = isWindows ? '.bat' : '';
const cmd = path.join(skillDir, 'bin', `wechat-api${scriptExt}`);

// 执行
const child = spawn(cmd, ['article.md', '--inline-css'], {
  stdio: 'inherit'
});
```

## 运行时检测

无论在哪个平台，脚本都会自动检测并使用最佳运行时：

### Unix/Linux/macOS

使用 `bin/run.sh`（Shell 脚本）：

```
1. 检查 bun       → 最快
2. 检查 tsx       → 快速
3. 检查 ts-node   → 传统
4. 检查本地 tsx   → 备用
```

### Windows

使用 `bin/run.js`（Node.js 脚本）：

```
1. 检查 bun       → 最快
2. 检查 tsx       → 快速
3. 检查 ts-node   → 传统
4. 检查本地 tsx   → 备用（.cmd 文件）
```

## 路径分隔符

不同平台使用不同的路径分隔符：

| 平台 | 路径分隔符 | 示例 |
|------|-----------|------|
| Unix/Linux/macOS | `/` | `/home/user/project/bin/wechat-api` |
| Windows | `\` | `C:\Users\user\project\bin\wechat-api.bat` |

**注意**：在命令行中使用时：
- Unix/Linux/macOS 使用单斜杠 `/`
- Windows 可以使用反斜杠 `\` 或正斜杠 `/`

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

### Windows: "不是内部或外部命令"

**问题**：执行 `.bat` 文件时报错

**解决**：
1. 确保使用完整路径或 `cd` 到 `bin/` 目录
2. 使用 `call` 命令：`call bin\wechat-api.bat`
3. 或在 PowerShell 中使用 `.\bin\wechat-api.bat`

### Unix/Linux/macOS: "Permission denied"

**问题**：脚本没有执行权限

**解决**：
```bash
chmod +x bin/*
```

### 路径包含空格

**问题**：路径中包含空格导致错误

**解决**：使用引号包裹路径

```bash
# Unix/Linux/macOS
"/path/with spaces/bin/wechat-api" article.md

# Windows
"C:\path\with spaces\bin\wechat-api.bat" article.md
```

## 测试跨平台兼容性

验证在不同平台上的安装：

### Unix/Linux/macOS

```bash
cd /path/to/wechat-article-maker
bin/install-deps.sh
bin/wechat-api --help
```

### Windows

```cmd
cd C:\path\to\wechat-article-maker
bin\install-deps.bat
bin\wechat-api.bat --help
```

## 总结

- ✅ **完全跨平台** - Windows、macOS、Linux 都支持
- ✅ **自动检测** - 运行时和平台自动适配
- ✅ **双脚本方案** - `.sh` 用于 Unix，`.bat` 用于 Windows
- ✅ **统一接口** - 所有平台使用相同的参数和选项
- ✅ **AI 友好** - 提供平台检测逻辑供 AI Agent 使用
