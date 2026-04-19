/**
 * Security utility for frontend input validation and sanitization.
 * Designed to mitigate entry-level SQL injection attempts and XSS.
 */

export const sanitizeSQL = (input: string): string => {
  if (!input) return '';
  
  // 1. Remove common SQL injection characters/patterns
  // This is a defense-in-depth measure; real prevention must be on the backend.
  let sanitized = input
    .replace(/--/g, '')       // SQL Comments
    .replace(/\/\*/g, '')     // SQL Block Comments start
    .replace(/\*\//g, '')     // SQL Block Comments end
    .replace(/;/g, '')        // Statement separators
    .replace(/['"]/g, '')     // Quote marks (to prevent escaping strings)
    .replace(/\\/g, '');      // Escaping characters

  // 2. Remove dangerous SQL keywords (case insensitive)
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'TRUNCATE', 
    'UNION', 'ALTER', 'EXEC', 'EXECUTE', 'INFORMATION_SCHEMA'
  ];
  
  const keywordRegex = new RegExp(`\\b(${sqlKeywords.join('|')})\\b`, 'gi');
  sanitized = sanitized.replace(keywordRegex, '');

  return sanitized.trim();
};

/**
 * Strict alphanumeric sanitizer for usernames.
 */
export const sanitizeUsername = (username: string): string => {
  return username.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30);
};

/**
 * Basic Email format validation before processing.
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
