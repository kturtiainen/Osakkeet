import { describe, it, expect } from 'vitest';
import { validateSymbol, validateShares, validatePrice, validateStock, sanitizeSymbol } from '../utils/validation';

describe('validation', () => {
  describe('validateSymbol', () => {
    it('should accept valid symbols', () => {
      expect(validateSymbol('NOKIA.HE')).toBe(true);
      expect(validateSymbol('AAPL')).toBe(true);
      expect(validateSymbol('VOLV-B.ST')).toBe(true);
      expect(validateSymbol('BRK.B')).toBe(true);
      expect(validateSymbol('A1B2C3')).toBe(true);
    });

    it('should reject invalid symbols', () => {
      expect(validateSymbol('')).toBe(false);
      expect(validateSymbol('lowercase')).toBe(false);
      expect(validateSymbol('SYMBOL WITH SPACES')).toBe(false);
      expect(validateSymbol('SYMBOL@INVALID')).toBe(false);
      expect(validateSymbol('TOOLONGSYMBOLNAMEOVER20CHARS')).toBe(false);
    });
  });

  describe('validateShares', () => {
    it('should accept positive numbers', () => {
      expect(validateShares(1)).toBe(true);
      expect(validateShares(100)).toBe(true);
      expect(validateShares(0.5)).toBe(true);
    });

    it('should reject invalid values', () => {
      expect(validateShares(0)).toBe(false);
      expect(validateShares(-1)).toBe(false);
      expect(validateShares(NaN)).toBe(false);
    });
  });

  describe('validatePrice', () => {
    it('should accept positive numbers', () => {
      expect(validatePrice(1)).toBe(true);
      expect(validatePrice(100.50)).toBe(true);
      expect(validatePrice(0.01)).toBe(true);
    });

    it('should reject invalid values', () => {
      expect(validatePrice(0)).toBe(false);
      expect(validatePrice(-1)).toBe(false);
      expect(validatePrice(NaN)).toBe(false);
    });
  });

  describe('sanitizeSymbol', () => {
    it('should convert to uppercase and trim', () => {
      expect(sanitizeSymbol('nokia.he')).toBe('NOKIA.HE');
      expect(sanitizeSymbol('  aapl  ')).toBe('AAPL');
      expect(sanitizeSymbol('Volv-B.ST')).toBe('VOLV-B.ST');
    });
  });

  describe('validateStock', () => {
    it('should validate complete stock data', () => {
      const result = validateStock('NOKIA.HE', 100, 4.50);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid symbol', () => {
      const result = validateStock('invalid symbol', 100, 4.50);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject invalid shares', () => {
      const result = validateStock('NOKIA.HE', 0, 4.50);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject invalid price', () => {
      const result = validateStock('NOKIA.HE', 100, -1);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
