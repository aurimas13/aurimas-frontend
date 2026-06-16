import DOMPurify from 'dompurify';

/**
 * Sanitize an HTML string before it is injected via dangerouslySetInnerHTML.
 *
 * Blog content is authored as light markdown and converted to HTML, but it is
 * stored in a database and rendered to every visitor. Running it through
 * DOMPurify is defense-in-depth against stored XSS: it strips <script>, inline
 * event handlers (onerror, onclick, ...), javascript: URLs and other vectors
 * while keeping the formatting tags the blog actually uses.
 */
const ALLOWED_TAGS = [
  'a', 'b', 'strong', 'i', 'em', 'u', 's', 'del', 'mark', 'small', 'sup', 'sub',
  'p', 'br', 'span', 'div', 'blockquote', 'pre', 'code',
  'ul', 'ol', 'li', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'iframe',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'title', 'class', 'id',
  'src', 'alt', 'width', 'height', 'loading',
  'allow', 'allowfullscreen', 'frameborder', 'style',
];

export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Only allow http(s)/mailto links and relative paths — blocks javascript: etc.
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ['target'],
  });
};

// Force every link to open safely and prevent reverse-tabnabbing / referrer leaks.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
  if (node.tagName === 'IFRAME') {
    // Restrict embeds (YouTube/Spotify) to trusted hosts.
    const src = node.getAttribute('src') || '';
    const ok = /^https:\/\/(www\.youtube\.com|youtube\.com|www\.youtube-nocookie\.com|open\.spotify\.com|player\.vimeo\.com)\//.test(src);
    if (!ok) node.remove();
  }
});

export default sanitizeHtml;
