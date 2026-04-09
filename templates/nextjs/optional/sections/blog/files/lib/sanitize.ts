import DOMPurify from "isomorphic-dompurify";

// Allowed HTML tags for blog content
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "a",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote",
  "img", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
];

// Allowlist of permitted HTML attributes
const ALLOWED_ATTR = ["href", "title", "target", "rel", "src", "alt", "width", "height", "loading"];

/**
 * Sanitize raw HTML from the API before rendering with dangerouslySetInnerHTML.
 * Strips all tags/attributes not on the allowlist.
 */
export function sanitizeBlogContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORCE_BODY: true,
  });
}
