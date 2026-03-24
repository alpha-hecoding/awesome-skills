# wechat-article-maker 配置

## 文章创作默认设置

### 基础配置
- 作者：AI观察
- 主题：grace
- 发布方式：api

### AI 生成默认参数
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

## 浏览器配置

- Chrome 配置文件路径：~/.chrome-wechat
- Chrome 可执行路径：/usr/bin/google-chrome

## 微信 API 配置

注意：敏感信息建议使用 .env 文件，不要写在 EXTEND.md 中

- API 凭证位置：.awesome-skills/.env
- IP 白名单：已配置

## 高级设置

### 封面图生成
- 默认宽度：900
- 默认高度：500
- 渐变起始色：#667eea
- 渐变结束色：#764ba2

### 图片处理
- 最大宽度：1920
- 最大高度：1080
- 强制清洗元数据：false
- 自动重试上传：true

### Markdown 渲染
- 代码高亮主题：github
- 数学公式支持：true
- 目录生成：true
- 脚注支持：true
