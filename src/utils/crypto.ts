/**
 * Simple encryption/decryption utility for API keys
 * Uses Base64 encoding with a simple XOR cipher for basic obfuscation
 * Note: This is NOT secure encryption - it's just obfuscation to prevent
 * casual viewing in browser DevTools. For production, use proper encryption.
 */

const SALT = 'osakesalkku-v2-2026'; // Simple salt for XOR

/**
 * Encrypt a string using XOR cipher and Base64 encoding
 */
export function encrypt(text: string): string {
  if (!text) return '';
  
  try {
    const encrypted = Array.from(text)
      .map((char, i) => {
        const saltChar = SALT.charCodeAt(i % SALT.length);
        return String.fromCharCode(char.charCodeAt(0) ^ saltChar);
      })
      .join('');
    
    return btoa(encrypted);
  } catch {
    // If encryption fails, return original (graceful degradation)
    return text;
  }
}

/**
 * Decrypt a string using Base64 decoding and XOR cipher
 */
export function decrypt(encrypted: string): string {
  if (!encrypted) return '';
  
  try {
    const decoded = atob(encrypted);
    const decrypted = Array.from(decoded)
      .map((char, i) => {
        const saltChar = SALT.charCodeAt(i % SALT.length);
        return String.fromCharCode(char.charCodeAt(0) ^ saltChar);
      })
      .join('');
    
    return decrypted;
  } catch {
    // If decryption fails, assume it's unencrypted (backward compatibility)
    return encrypted;
  }
}
