import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from '../utils/crypto';

describe('crypto', () => {
  describe('encrypt', () => {
    it('should encrypt a string', () => {
      const plaintext = 'my-secret-api-key-12345';
      const encrypted = encrypt(plaintext);
      
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should return empty string for empty input', () => {
      expect(encrypt('')).toBe('');
    });
  });

  describe('decrypt', () => {
    it('should decrypt an encrypted string', () => {
      const plaintext = 'my-secret-api-key-12345';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });

    it('should return empty string for empty input', () => {
      expect(decrypt('')).toBe('');
    });

    it('should handle various string lengths', () => {
      const short = 'abc';
      const medium = 'this is a medium length string';
      const long = 'this is a very long string that should still work correctly with the encryption and decryption';
      
      expect(decrypt(encrypt(short))).toBe(short);
      expect(decrypt(encrypt(medium))).toBe(medium);
      expect(decrypt(encrypt(long))).toBe(long);
    });

    it('should handle special characters', () => {
      const special = '!@#$%^&*()_+-={}[]|:;"<>?,./ ';
      expect(decrypt(encrypt(special))).toBe(special);
    });
  });
});
