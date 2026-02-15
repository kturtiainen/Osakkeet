import { describe, it, expect } from 'vitest';
import { validateSymbol, validateShares, validatePrice, validateStock, sanitizeSymbol, isValidStock } from '../utils/validation';

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

    it('should reject Infinity', () => {
      expect(validateShares(Infinity)).toBe(false);
      expect(validateShares(-Infinity)).toBe(false);
      expect(validateShares(parseFloat('1e999'))).toBe(false); // becomes Infinity
    });

    it('should reject values above upper bound', () => {
      expect(validateShares(1e15)).toBe(true); // at limit
      expect(validateShares(1e15 + 1)).toBe(false); // above limit
      expect(validateShares(1e16)).toBe(false);
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

    it('should reject Infinity', () => {
      expect(validatePrice(Infinity)).toBe(false);
      expect(validatePrice(-Infinity)).toBe(false);
      expect(validatePrice(parseFloat('1e999'))).toBe(false); // becomes Infinity
    });

    it('should reject values above upper bound', () => {
      expect(validatePrice(1e15)).toBe(true); // at limit
      expect(validatePrice(1e15 + 1)).toBe(false); // above limit
      expect(validatePrice(1e16)).toBe(false);
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

  describe('isValidStock', () => {
    it('should accept valid stock objects', () => {
      expect(isValidStock({
        symbol: 'NOKIA.HE',
        shares: 100,
        purchasePrice: 4.50
      })).toBe(true);

      expect(isValidStock({
        symbol: 'AAPL',
        shares: 0.5,
        purchasePrice: 150.00
      })).toBe(true);
    });

    it('should reject stock with missing symbol', () => {
      expect(isValidStock({
        shares: 100,
        purchasePrice: 4.50
      })).toBe(false);
    });

    it('should reject stock with empty symbol', () => {
      expect(isValidStock({
        symbol: '',
        shares: 100,
        purchasePrice: 4.50
      })).toBe(false);
    });

    it('should reject stock with invalid shares', () => {
      expect(isValidStock({
        symbol: 'NOKIA.HE',
        shares: 0,
        purchasePrice: 4.50
      })).toBe(false);

      expect(isValidStock({
        symbol: 'NOKIA.HE',
        shares: -10,
        purchasePrice: 4.50
      })).toBe(false);

      expect(isValidStock({
        symbol: 'NOKIA.HE',
        purchasePrice: 4.50
      })).toBe(false);
    });

    it('should reject stock with invalid purchase price', () => {
      expect(isValidStock({
        symbol: 'NOKIA.HE',
        shares: 100,
        purchasePrice: 0
      })).toBe(false);

      expect(isValidStock({
        symbol: 'NOKIA.HE',
        shares: 100,
        purchasePrice: -5
      })).toBe(false);

      expect(isValidStock({
        symbol: 'NOKIA.HE',
        shares: 100
      })).toBe(false);
    });

    it('should reject stock with wrong data types', () => {
      expect(isValidStock({
        symbol: 123,
        shares: 100,
        purchasePrice: 4.50
      } as unknown as { symbol?: string; shares?: number; purchasePrice?: number })).toBe(false);

      expect(isValidStock({
        symbol: 'NOKIA.HE',
        shares: '100',
        purchasePrice: 4.50
      } as unknown as { symbol?: string; shares?: number; purchasePrice?: number })).toBe(false);

      expect(isValidStock({
        symbol: 'NOKIA.HE',
        shares: 100,
        purchasePrice: '4.50'
      } as unknown as { symbol?: string; shares?: number; purchasePrice?: number })).toBe(false);
    });
  });
});
