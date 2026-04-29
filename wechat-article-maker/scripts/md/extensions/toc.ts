import type { MarkedExtension } from 'marked'

/**
 * marked 插件：支持 [TOC] 语法，自动生成嵌套目录
 */
export function markedToc(): MarkedExtension {
  let headings: { text: string, depth: number, id: string }[] = []
  let headingIds = new Map<string, number>()

  function slugifyHeading(text: string): string {
    return text
      .toLowerCase()
      .replace(/<[^>]*>/g, ``)
      .replace(/&[^;]+;/g, ``)
      .replace(/[^\p{Letter}\p{Number}\s-]+/gu, ``)
      .trim()
      .replace(/\s+/g, `-`) || `section`
  }

  function getHeadingId(text: string): string {
    const base = slugifyHeading(text)
    const count = headingIds.get(base) ?? 0
    headingIds.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  }

  let firstToken = true

  return {
    walkTokens(token) {
      if (firstToken) {
        headings = []
        headingIds = new Map()
        firstToken = false
      }
      if (token.type === `heading`) {
        const text = token.text || ``
        const depth = token.depth || 1
        const id = getHeadingId(text)
        headings.push({ text, depth, id })
      }
    },
    extensions: [
      {
        name: `toc`,
        level: `block`,
        start(src) {
          // 只匹配独立一行的 [TOC]，避免误伤
          const match = src.match(/^\s*\[TOC\]\s*$/m)
          return match ? match.index : undefined
        },
        tokenizer(src) {
          const match = /^\s*\[TOC\]\s*(?:\r?\n|$)/.exec(src)
          if (match) {
            return {
              type: `toc`,
              raw: match[0],
            }
          }
        },
        renderer() {
          if (!headings.length)
            return ``
          let html = `<nav class="markdown-toc"><ul class="toc-ul toc-level-1 pl-4 border-l ml-2">`
          let lastDepth = 1
          headings.forEach(({ text, depth, id }) => {
            if (depth > lastDepth) {
              for (let i = lastDepth + 1; i <= depth; i++) {
                html += `<ul class="toc-ul toc-level-${i} pl-4 border-l ml-2">`
              }
            }
            else if (depth < lastDepth) {
              for (let i = lastDepth; i > depth; i--) {
                html += `</ul>`
              }
            }
            html += `<li class="toc-li toc-level-${depth} mb-1"><a class="text-gray-700 hover:text-blue-600 underline transition-colors" href="#${id}">${text}</a></li>`
            lastDepth = depth
          })

          for (let i = lastDepth; i > 1; i--) {
            html += `</ul>`
          }

          html += `</ul></nav>`

          firstToken = true
          return html
        },
      },
    ],
  }
}
