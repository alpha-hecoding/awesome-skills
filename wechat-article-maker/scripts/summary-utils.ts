function isMarkdownTableSeparator(line: string): boolean {
  return /^\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?$/.test(line);
}

function normalizeSummary(text: string): string {
  const cleanText = text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  return cleanText.length > 120 ? cleanText.slice(0, 117) + '...' : cleanText;
}

function isValidSummaryCandidate(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('#')) return false;
  if (trimmed.startsWith('![')) return false;
  if (trimmed.startsWith('>')) return false;
  if (trimmed.startsWith('-') || trimmed.startsWith('*')) return false;
  if (/^\d+\./.test(trimmed)) return false;
  if (trimmed.startsWith('|')) return false;
  if (isMarkdownTableSeparator(trimmed)) return false;
  if (/^`{3,}/.test(trimmed)) return false;
  return normalizeSummary(trimmed).length > 20;
}

export function extractSummaryFromMarkdown(markdown: string): string {
  const lines = markdown.split('\n');
  for (const line of lines) {
    if (isValidSummaryCandidate(line)) {
      return normalizeSummary(line);
    }
  }

  return '';
}

export function extractSummaryFromHtml(html: string): string {
  const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  for (const match of html.matchAll(paragraphRegex)) {
    const text = match[1]!
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .trim();

    if (isValidSummaryCandidate(text)) {
      return normalizeSummary(text);
    }
  }

  return '';
}
