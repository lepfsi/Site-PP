/**
 * Footnotes must be peeled before content is split into multiple ReactMarkdown
 * trees (callouts / fences break GFM footnote pairing).
 */

export interface Footnote {
  id: string;
  n: number;
  text: string;
}

export function peelFootnotes(markdown: string): { body: string; footnotes: Footnote[] } {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const footnotes: Footnote[] = [];
  const order = new Map<string, number>();
  const bodyLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const def = lines[i].match(/^\[\^([^\]]+)\]:\s*(.*)$/);
    if (def) {
      const id = def[1];
      let text = def[2].trim();
      // Optional continuation lines (indented)
      while (i + 1 < lines.length && /^[ \t]+/.test(lines[i + 1]) && lines[i + 1].trim()) {
        i += 1;
        text += " " + lines[i].trim();
      }
      if (!order.has(id)) {
        const n = order.size + 1;
        order.set(id, n);
        footnotes.push({ id, n, text });
      }
      continue;
    }
    bodyLines.push(lines[i]);
  }

  let body = bodyLines.join("\n");

  // Replace references [^id] → [n](#fn-id)
  body = body.replace(/\[\^([^\]]+)\]/g, (_m, id: string) => {
    let n = order.get(id);
    if (n == null) {
      n = order.size + 1;
      order.set(id, n);
      footnotes.push({ id, n, text: "" });
    }
    return `[${n}](#fn-${id})`;
  });

  body = body.replace(/\n{3,}/g, "\n\n").trim();
  return { body, footnotes: footnotes.filter((f) => f.text) };
}
