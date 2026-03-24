# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains WeChat Official Account (微信公众号) article creation skills:

1. **wechat-article-maker** - Complete tool with AI generation, Markdown rendering, image processing, and publishing (merged from generator + maker)
2. **wechat-article-skill** - Python-based skill for OpenClaw (cover generation + basic publishing)

## wechat-article-maker (TypeScript)

### Running Scripts

All scripts use `npx -y bun` (auto-downloads Bun and installs dependencies on first run):

```bash
# Publish article via API
npx -y bun scripts/wechat-api.ts article.md --inline-css

# Publish via browser automation
npx -y bun scripts/wechat-article.ts --html article.html

# Convert Markdown to HTML with theme
npx -y bun scripts/md-to-wechat.ts article.md --theme grace

# Generate cover image
npx -y bun scripts/generate-cover.ts --title "标题" --output cover.jpg

# Image-text (multi-image) publishing
npx -y bun scripts/wechat-browser.ts --markdown article.md --images ./images/
```

### Themes

- `default` - Traditional layout, centered titles with borders
- `grace` - Elegant with shadows, rounded cards (recommended)
- `simple` - Modern minimalist style

### API Credentials

Required for API publishing (3 ways to provide):

1. **Config file**: `.awesome-skills/.env` or `~/.awesome-skills/.env`
2. **Environment variables**: `WECHAT_APP_ID`, `WECHAT_APP_SECRET`
3. **CLI args**: `--app-id`, `--app-secret`

### Key Workflows

| Input | Workflow |
|-------|----------|
| Text content | Content creation → HTML → Cover → Publish |
| Single URL | Download → Clean images → Inline CSS → Publish |
| `.md` file | Parse frontmatter → Apply theme → Publish |
| `.html` file | Inline CSS → Publish |

### Image Processing

- Automatic download of remote images
- Metadata cleaning (removes AIGC/Coze markers)
- Auto-retry on upload failure (error 40113 → force clean)

### JSON/JSONC Beautification

Code blocks with language `json` or `jsonc` are automatically beautified in both:
- `md/render.ts` (Markdown rendering)
- `scripts/wechat-api.ts` (API publishing)

Features:
- Compressed single-line JSON is formatted with proper indentation (2 spaces)
- JSONC comments (`//` and `/**/`) are stripped before parsing (required for `JSON.parse`)
- Parsed and re-stringified for consistent formatting

## wechat-article-skill (Python)

### Running Scripts

```bash
pip3 install Pillow

# Generate cover
python3 scripts/create_cover.py --title "标题" --style minimal-grid --palette auto --output cover.jpg

# Generate style preview grid
python3 scripts/create_cover_preview_grid.py

# Publish draft
python3 scripts/publish_draft.py --title "标题" --content-file article.html --cover cover.jpg --appid XXX --appsecret XXX
```

### Cover Styles × Palettes

**Styles**: `minimal-grid`, `card-editorial`, `diagonal-motion`, `soft-gradient`

**Palettes**: `blue-tech`, `purple-insight`, `green-growth`, `orange-energy`, `rose-story`, `slate-pro`

### Config

Stored in `wechat-article.config.json` with app credentials, writing preferences, and cover defaults.

## Architecture

```
wechat-article-maker/
├── scripts/
│   ├── wechat-api.ts         # API publishing (image upload, draft creation)
│   ├── wechat-article.ts     # Browser automation publishing
│   ├── wechat-browser.ts     # Image-text message publishing
│   ├── wechat-agent-browser.ts  # Agent browser publishing
│   ├── generate-cover.ts     # Cover generation (@napi-rs/canvas, sharp)
│   ├── md-to-wechat.ts       # Markdown → HTML with themes
│   ├── ensure-deps.ts        # Auto-install dependencies
│   ├── image-utils.ts        # Image cleaning (sharp integration)
│   ├── cdp.ts                # Chrome DevTools Protocol utilities
│   ├── copy-to-clipboard.ts  # Clipboard copy utility
│   ├── paste-from-clipboard.ts # Clipboard paste utility
│   └── md/
│       ├── render.ts         # Markdown rendering engine
│       ├── themes/           # CSS themes (5: base, default, grace, simple, hljs-github)
│       ├── extensions/       # Plugins (10: alert, footnotes, katex, toc, etc.)
│       └── utils/            # Utility functions (languages.ts)
├── templates/                # AI article generation templates
│   ├── opening_patterns.md   # Opening hooks (pain-point patterns)
│   ├── closing_patterns.md   # Ending patterns (value summary)
│   ├── language_rules.md     # Conversational style rules
│   └── structure_guide.md    # Structure templates by style type
├── styles/                   # Article styles
│   └── base_style.css        # Base CSS for WeChat articles
├── examples/                 # Sample articles
│   ├── beginner_article.html
│   ├── intermediate_article.html
│   └── advanced_article.html
├── references/               # Reference documentation
│   ├── article-posting.md    # Article publishing guide
│   └── image-text-posting.md # Image-text publishing guide
├── SKILL.md                  # Complete skill documentation
├── SKILL-old.md              # Legacy skill documentation
├── EXTEND-example.md         # Extension config example
├── EXTEND-desc.md            # Extension config description
├── package.json              # Dependency lock file
├── CROSS_PLATFORM.md         # Cross-platform guide
├── USAGE.md                  # Usage guide
└── README.md                 # Project overview

wechat-article-skill/
├── scripts/
│   ├── create_cover.py       # Pillow-based cover generation
│   ├── create_cover_preview_grid.py
│   └── publish_draft.py      # API draft publishing
├── assets/                   # Fonts, preview images
└── references/
    └── article-style.md      # HTML inline style specification
```

## Common Issues

| Issue | Solution |
|-------|----------|
| First run slow | Normal - downloading Bun and installing deps |
| npm install fails | Set mirror: `npm config set registry https://registry.npmmirror.com` |
| Cover generates as SVG | Install optional: `npm install @napi-rs/canvas` (SVG still works) |
| Upload fails 40113 | Auto-cleans image metadata and retries |
| API error 40164 | Add server IP to WeChat whitelist in MP backend |
| Style lost | Ensure `--inline-css` flag is used |

## Best Practices

- Use `grace` theme for general content, `default` for formal articles
- Keep titles under 20 Chinese characters for sharing
- Cover image: 900x500px (2:1 ratio), under 2MB
- Always preview in draft box before publishing
- Save Markdown source files for future edits
- Use `--inline-css` for all publishing (WeChat doesn't support `<style>` tags)
