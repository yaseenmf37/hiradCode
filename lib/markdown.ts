/**
 * A tiny, dependency-free Markdown → HTML renderer for blog posts.
 *
 * Every character of the author's input is HTML-escaped *first*, so raw markup
 * can never become a live tag — the output only contains the semantic elements
 * this file emits. That keeps `dangerouslySetInnerHTML` safe for first-party
 * content while still producing SEO-friendly headings, lists and paragraphs.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text: string): string {
  let s = text;
  // Images before links (image syntax is a superset of link syntax).
  s = s.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (_m, alt, url) => `<img src="${url}" alt="${alt}" loading="lazy" />`,
  );
  s = s.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, txt, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${txt}</a>`,
  );
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  return s;
}

export function renderMarkdown(md: string): string {
  const escaped = escapeHtml(md.replace(/\r\n/g, "\n"));
  const blocks = escaped.split(/\n{2,}/);
  const out: string[] = [];

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    const lines = block.split("\n");

    const heading = lines.length === 1 && block.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      // Shift down one level so article bodies never emit an <h1> (the page
      // title already owns that).
      const level = Math.min(heading[1].length + 1, 4);
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(block)) {
      out.push("<hr />");
      continue;
    }

    if (lines.every((l) => /^&gt;\s?/.test(l))) {
      const inner = lines.map((l) => l.replace(/^&gt;\s?/, "")).join(" ");
      out.push(`<blockquote>${inline(inner)}</blockquote>`);
      continue;
    }

    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      const items = lines
        .map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ""))}</li>`)
        .join("");
      out.push(`<ul>${items}</ul>`);
      continue;
    }

    if (lines.every((l) => /^\d+\.\s+/.test(l))) {
      const items = lines
        .map((l) => `<li>${inline(l.replace(/^\d+\.\s+/, ""))}</li>`)
        .join("");
      out.push(`<ol>${items}</ol>`);
      continue;
    }

    const img = block.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img) {
      const caption = img[1]
        ? `<figcaption>${inline(img[1])}</figcaption>`
        : "";
      out.push(
        `<figure><img src="${img[2]}" alt="${img[1]}" loading="lazy" />${caption}</figure>`,
      );
      continue;
    }

    out.push(`<p>${inline(lines.join(" "))}</p>`);
  }

  return out.join("\n");
}

/** Plain-text summary from Markdown, for meta descriptions / fallbacks. */
export function excerptFromMarkdown(md: string, max = 160): string {
  const text = md
    .replace(/\r\n/g, "\n")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
