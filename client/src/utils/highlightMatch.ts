/**
 * Escapes special regex characters in a string.
 */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Splits text by query (case-insensitive) and returns segments for rendering.
 * Matching segments have match: true so they can be wrapped in <mark>.
 */
export function getHighlightSegments(text: string, query: string): { text: string; match: boolean }[] {
  if (!query.trim()) return [{ text, match: false }];
  const re = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(re);
  return parts.map((text) => ({ text, match: text.toLowerCase() === query.toLowerCase() }));
}
