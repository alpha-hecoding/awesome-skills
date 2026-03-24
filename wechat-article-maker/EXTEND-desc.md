# wechat-article-maker 配置文件示例

本文档展示所有可用的配置项及其说明。实际使用时，只需保留需要的配置项即可。

---

## 文章创作默认设置

### 基础配置（必配）

```yaml
作者: AI观察                    # 文章作者名
主题: grace                   # Markdown 转 HTML 的主题
                              # 可选值: default（传统）, grace（优雅，推荐）, simple（简洁）
发布方式: api                 # 默认发布方式
                              # 可选值: api（快速，推荐）, browser（可视化）
```

---

## AI 生成默认参数（流程1专用）

以下参数仅在使用技能创作新文章时生效（流程1）。

```yaml
文章风格: guide                # 文章结构风格
                              # 可选值:
                              #   - guide（指南型，全面系统，推荐）
                              #   - tutorial（教程型，步骤清晰）
                              #   - analysis（分析型，深入透彻）
                              #   - story（故事型，情境代入）

文章长度: medium               # 文章字数
                              # 可选值:
                              #   - short（2000-3000字）
                              #   - medium（3000-5000字，推荐）
                              #   - long（5000-8000字）

技术深度: intermediate         # 技术深度
                              # 可选值:
                              #   - beginner（入门，多用比喻）
                              #   - intermediate（中级，平衡理论与实践，推荐）
                              #   - advanced（高级，深入细节）

包含代码示例: true             # 是否包含可运行的代码示例
                              # 可选值: true, false

启用网络调研: true             # 是否使用 WebSearch 调研关键词
                              # 可选值: true（推荐）, false
```

---

## 自动操作（推荐配置）

```yaml
自动生成封面: true             # 文章无图时自动生成封面图
                              # 可选值: true（推荐）, false

自动清洗图片: true             # 自动移除图片元数据（AIGC标记、Exif等）
                              # 可选值: true（推荐）, false

自动内联样式: true             # 自动转换 CSS 为内联样式（微信要求）
                              # 可选值: true（推荐）, false

发布前确认: true               # 发布前询问用户确认
                              # 可选值: true（推荐）, false（自动发布）
```

---

## 浏览器配置（可选）

仅在使用浏览器方式发布时需要配置。

```yaml
# Chrome 浏览器配置
Chrome 配置文件路径: ~/.chrome-wechat
                              # Chrome 用户数据目录（避免冲突）
                              # macOS: ~/.chrome-wechat
                              # Windows: %USERPROFILE%\.chrome-wechat
                              # Linux: ~/.chrome-wechat

Chrome 可执行路径: auto        # Chrome 可执行文件路径
                              # auto（自动查找）
                              # macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
                              # Windows: C:\Program Files\Google\Chrome\Application\chrome.exe
                              # Linux: /usr/bin/google-chrome
```

---

## 封面图生成配置（可选）

自定义封面图生成参数。

```yaml
封面图宽度: 900                # 封面图宽度（像素）
                              # 微信推荐: 900px（2:1 比例）

封面图高度: 500                # 封面图高度（像素）
                              # 微信推荐: 500px（2:1 比例）

渐变起始色: "#667eea"          # 封面背景渐变起始颜色
                              # 格式: #RRGGBB
                              # 推荐配色:
                              #   - 紫色系: #667eea → #764ba2
                              #   - 蓝色系: #4facfe → #00f2fe
                              #   - 绿色系: #43e97b → #38f9d7
                              #   - 橙色系: #fa709a → #fee140
                              #   - 深蓝系: #30cfd0 → #330867

渐变结束色: "#764ba2"          # 封面背景渐变结束颜色
                              # 格式: #RRGGBB
```

---

## 图片处理配置（可选）

自定义图片处理参数。

```yaml
图片最大宽度: 1920             # 自动调整超大图片的最大宽度
                              # 推荐值: 1920px

图片最大高度: 1080             # 自动调整超大图片的最大高度
                              # 推荐值: 1080px

强制清洗元数据: false          # 是否强制清洗所有图片元数据
                              # 可选值: true, false（仅上传失败时清洗，推荐）

自动重试上传: true             # 上传失败（错误 40113）时自动清洗并重试
                              # 可选值: true（推荐）, false
```

---

## Markdown 渲染配置（可选）

自定义 Markdown 渲染引擎参数。

```yaml
代码高亮主题: github           # 代码块高亮主题
                              # 可选值: github, atom-one-dark, monokai 等

数学公式支持: true             # 是否支持 KaTeX 数学公式
                              # 可选值: true, false

目录生成: true                 # 是否自动生成目录
                              # 可选值: true, false

脚注支持: true                 # 是否支持脚注
                              # 可选值: true, false
```

---

## 微信 API 配置

⚠️ **重要提示**：敏感信息请勿写入 EXTEND.md，应使用 `.env` 文件。

```yaml
# API 凭证位置（仅供参考，不要直接写入凭证）
API 凭证位置: .awesome-skills/.env
                              # 项目级: .awesome-skills/.env
                              # 用户级: ~/.awesome-skills/.env

IP 白名单状态: 已配置          # 是否已在微信公众号后台配置 IP 白名单
                              # 配置地址: mp.weixin.qq.com → 开发 → 基本配置 → IP白名单
```

---

## 完整配置示例

以下是一份生产环境可用的完整配置：

```markdown
# wechat-article-maker 配置

## 基础配置

- 作者：AI观察
- 主题：grace
- 发布方式：api

## AI 生成默认参数

- 文章风格：guide
- 文章长度：medium
- 技术深度：intermediate
- 包含代码示例：true
- 启用网络调研：true

## 自动操作

- 自动生成封面：true
- 自动清洗图片：true
- 自动内联样式：true
- 发布前确认：true

## 封面图生成

- 宽度：900
- 高度：500
- 渐变起始色：#667eea
- 渐变结束色：#764ba2
```

---

## 最小配置示例

如果只需要基本功能：

```markdown
# wechat-article-maker 配置

- 作者：AI观察
- 主题：grace
- 发布方式：api
```

---

## 配置优先级

```
命令行参数 > 环境变量 > 项目级 EXTEND.md > 用户级 EXTEND.md > 默认值
```

示例：
- 命令行：`--theme simple`
- 环境变量：`WECHAT_THEME=grace`
- 项目级：`.awesome-skills/wechat-article-maker/EXTEND.md`
- 用户级：`~/.awesome-skills/wechat-article-maker/EXTEND.md`
- 默认值：`grace`

---

## 配置文件位置

### 项目级配置（推荐）

```bash
# 位置
项目根目录/.awesome-skills/wechat-article-maker/EXTEND.md

# 创建命令
mkdir -p .awesome-skills/wechat-article-maker
cat > .awesome-skills/wechat-article-maker/EXTEND.md << 'EOF'
# wechat-article-maker 配置

- 作者：AI观察
- 主题：grace
- 发布方式：api
EOF
```

### 用户级配置（跨项目共享）

```bash
# 位置
~/.awesome-skills/wechat-article-maker/EXTEND.md

# 创建命令
mkdir -p ~/.awesome-skills/wechat-article-maker
cat > ~/.awesome-skills/wechat-article-maker/EXTEND.md << 'EOF'
# wechat-article-maker 配置

- 作者：AI观察
- 主题：grace
- 发布方式：api
EOF
```

---

## 常见问题

### Q1: 敏感信息应该放在哪里？

❌ 不要写在 EXTEND.md 中：
- 微信 AppID / AppSecret
- API Token
- 密码

✅ 应放在 `.env` 文件中：
```bash
# .awesome-skills/.env
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
```

### Q2: 配置修改后需要重启吗？

不需要。配置会在每次运行时重新读取。

### Q3: 如何验证配置是否生效？

目前没有直接的验证命令，但可以在技能运行时观察是否符合预期行为。

---

## 版本信息

- **配置文件版本**：1.0.0
- **适用技能版本**：wechat-article-maker v2.0.0+
- **最后更新**：2026-03-24