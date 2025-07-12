const sanitizeHtml = require('sanitize-html');

// Configure sanitize-html options for rich text
const sanitizeOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'u', 's',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'div', 'span'
  ],
  allowedAttributes: {
    'a': ['href', 'title', 'target'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'code': ['class'],
    'pre': ['class'],
    'div': ['class'],
    'span': ['class']
  },
  allowedSchemes: ['http', 'https', 'data'],
  allowedClasses: {
    'code': ['language-*', 'hljs', '*'],
    'pre': ['language-*', 'hljs', '*'],
    'div': ['highlight', 'code-block', '*'],
    'span': ['highlight', 'keyword', 'string', 'comment', '*']
  },
  transformTags: {
    'a': (tagName, attribs) => {
      // Ensure external links open in new tab
      if (attribs.href && !attribs.href.startsWith('/')) {
        attribs.target = '_blank';
        attribs.rel = 'noopener noreferrer';
      }
      return { tagName, attribs };
    },
    'img': (tagName, attribs) => {
      // Validate image URLs and add security attributes
      if (attribs.src) {
        // Only allow certain image formats
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasValidExtension = allowedExtensions.some(ext => 
          attribs.src.toLowerCase().includes(ext)
        );
        
        if (!hasValidExtension && !attribs.src.startsWith('data:')) {
          return { tagName: 'p', text: '[Invalid image]' };
        }
      }
      return { tagName, attribs };
    }
  }
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} content - The HTML content to sanitize
 * @returns {string} - Sanitized HTML content
 */
const sanitizeContent = (content) => {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  return sanitizeHtml(content, sanitizeOptions);
};

/**
 * Extract image URLs from HTML content
 * @param {string} content - The HTML content to parse
 * @returns {string[]} - Array of image URLs
 */
const extractImageUrls = (content) => {
  if (!content || typeof content !== 'string') {
    return [];
  }
  
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const urls = [];
  let match;
  
  while ((match = imgRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
};

/**
 * Validate if a URL is a valid image URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid image URL
 */
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasValidExtension = allowedExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  return hasValidExtension || url.startsWith('data:image/');
};

module.exports = {
  sanitizeContent,
  extractImageUrls,
  isValidImageUrl
}; 