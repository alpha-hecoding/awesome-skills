# 微信公众号文章生成器技能

## 技能简介

本技能能够根据关键词或链接生成符合微信公众号风格的技术文章, 保持统一的风格、架构、布局、排版和样式。

## 核心特性

✅ **双模式输入**: 支持关键词搜索调研生成和链接读取重构生成
✅ **风格一致**: 口语化表达、痛点引入、比喻说明、互动结尾
✅ **灵活配置**: 支持多种长度、深度、风格参数组合
✅ **完整输出**: 生成包含完整CSS样式的HTML文档
✅ **质量保证**: 内置多层质量检查机制

## 目录结构

```
.claude/skills/wechat-article-generator/
├── SKILL.md              # 核心技能文件(主提示词)
├── templates/            # 模板库
│   ├── opening_patterns.md   # 开篇模式库
│   ├── closing_patterns.md   # 结尾模式库
│   ├── language_rules.md     # 语言风格规则
│   └── structure_guide.md    # 指南型结构模板
├── styles/              # 样式库
│   └── base_style.css       # 基础样式
└── examples/            # 示例库
    ├── beginner_article.html    # 初级深度示例
    ├── intermediate_article.html # 中级深度示例
    └── advanced_article.html    # 高级深度示例
```

## 使用方法

### 基本用法

**方式1: 基于关键词生成**

```bash
/wechat-article-generator --input_type=keyword --content="Docker容器化"
```

**方式2: 基于URL生成**

```bash
/wechat-article-generator --input_type=url --content="https://docs.docker.com/get-started/"
```

### 参数说明

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| input_type | enum | ✅ | - | 输入类型: `keyword` 或 `url` |
| content | string | ✅ | - | 关键词或URL内容 |
| length | enum | ❌ | medium | 文章长度: `short`(2000-3000字) / `medium`(3000-5000字) / `long`(5000-8000字) |
| depth | enum | ❌ | intermediate | 技术深度: `beginner`(入门) / `intermediate`(中级) / `advanced`(高级) |
| style | enum | ❌ | guide | 文章风格: `tutorial`(教程型) / `guide`(指南型) / `analysis`(分析型) / `story`(故事型) |
| include_code | boolean | ❌ | true | 是否包含代码示例 |
| enable_research | boolean | ❌ | true | 是否进行网络调研 |

### 使用示例

**示例1: 生成中级深度的指南型文章**

```bash
/wechat-article-generator --input_type=keyword --content="Kubernetes入门" --length=medium --depth=intermediate --style=guide
```

**示例2: 生成入门级的教程型短文章**

```bash
/wechat-article-generator --input_type=keyword --content="Git基础" --length=short --depth=beginner --style=tutorial
```

**示例3: 基于URL生成长文章**

```bash
/wechat-article-generator --input_type=url --content="https://react.dev/learn" --length=long --depth=intermediate
```

**示例4: 快速生成(不调研,直接生成)**

```bash
/wechat-article-generator --input_type=keyword --content="REST API设计" --enable_research=false
```

## 文章风格说明

### 文章结构

所有生成的文章都遵循统一的结构:

1. **开篇引入**: 痛点场景 → "说实话,我之前也是这样" → 引出主题
2. **主体内容**: H2分隔的多个章节,包含实例、代码、比喻
3. **结尾总结**: 价值提炼 → 金句 → 互动问题 → 点赞号召

### 语言特点

- ✅ **口语化表达**: 使用"说实话"、"其实"、"简单来说"等
- ✅ **第一人称**: 使用"我"、"我们"建立情感连接
- ✅ **比喻说明**: 用日常生活事物比喻技术概念
- ✅ **互动性强**: 反问句、疑问句,引导思考
- ✅ **表情符号**: 适当使用✅❌🔧💡等,每段不超过2个

### 排版样式

- **主色调**: #35B378 (绿色)
- **H1标题**: 24px 绿色加粗
- **H2标题**: 18px 黑底白字
- **H3标题**: 16px 绿色加粗
- **正文**: 15px 深灰色,行高1.8
- **强调**: 绿色加粗
- **引用块**: 绿色左边框,浅紫背景
- **代码块**: 深色背景 #282c34

## 文章类型对比

| 类型 | 特点 | 适用场景 |
|------|------|---------|
| guide | 全面系统,多角度讲解 | 工具介绍、技术方案、最佳实践 |
| tutorial | 步骤清晰,循序渐进 | 操作指南、配置教程、入门教程 |
| analysis | 深入透彻,对比分析 | 技术对比、方案选择、趋势分析 |
| story | 情境代入,经验分享 | 案例分享、踩坑经历、实战故事 |

## 质量保证

技能内置多层质量检查机制:

### 内容检查
- ✅ 文章长度符合要求
- ✅ 技术深度符合定位
- ✅ 文章结构符合模板
- ✅ 技术概念准确无误

### 风格检查
- ✅ 开篇痛点引入模式
- ✅ 口语化表达占比
- ✅ 包含比喻和类比
- ✅ 结尾金句和互动

### 格式检查
- ✅ HTML格式完整
- ✅ CSS样式完整
- ✅ 代码示例清晰
- ✅ 图片说明完整

## 工作流程

### 关键词模式
```
关键词输入
  → WebSearch调研(3-5篇资料)
  → 提取核心概念和案例
  → 生成文章大纲
  → 按模板填充内容
  → 添加完整样式
  → 质量检查
  → 输出HTML文章
```

### URL模式
```
URL输入
  → WebFetch读取内容
  → 提取核心观点
  → WebSearch补充调研
  → 重构为目标风格
  → 添加完整样式
  → 质量检查
  → 输出HTML文章
```

## 注意事项

1. **原创性**: 不会直接复制参考资料,用自己的话重新表达
2. **准确性**: 技术概念准确,代码可运行
3. **实用性**: 提供可操作的建议和示例
4. **可读性**: 语言简洁流畅,避免冗长句子
5. **互动性**: 引导读者思考和参与

## 参考示例

查看 `examples/` 目录下的示例文章:

- `beginner_article.html` - OpenClaw.AI介绍,入门深度
- `intermediate_article.html` - Claude Code交互技巧,中级深度
- `advanced_article.html` - Claude Hooks详解,高级深度

## 常见问题

**Q: 生成的文章风格不一致怎么办?**

A: 检查参数设置是否正确,参考示例文章,必要时调整depth和style参数。

**Q: 技术内容不准确怎么办?**

A: 确保`enable_research=true`,让技能进行网络调研,参考官方文档。

**Q: 文章太长或太短怎么办?**

A: 调整`length`参数,选择`short`/`medium`/`long`。

**Q: 想要不同风格的文章怎么办?**

A: 调整`style`参数,选择`tutorial`/`guide`/`analysis`/`story`。

## 技能优势

1. **高度自动化**: 从调研到生成全流程自动化
2. **风格统一**: 严格遵循微信公众号文章风格
3. **灵活配置**: 支持多种参数组合
4. **质量保证**: 内置多层验证机制
5. **易于使用**: 简单命令即可生成

## 后续优化

- [ ] 智能选题推荐
- [ ] 个性化风格学习
- [ ] 多媒体内容生成
- [ ] SEO关键词优化
- [ ] 数据分析集成

## 更新日志

**v1.0.0 (2026-03-24)**
- ✅ 初始版本发布
- ✅ 支持关键词和URL两种输入模式
- ✅ 支持4种文章风格
- ✅ 支持3种长度和深度配置
- ✅ 完整的模板系统
- ✅ 风格和质量检查机制

## 许可证

本技能为内部使用技能,仅供授权用户使用。

## 联系方式

如有问题或建议,请在项目issue中提出。