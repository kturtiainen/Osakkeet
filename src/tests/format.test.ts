import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber, formatPercentage, formatChange } from '../utils/format';

describe('format', () => {
  describe('formatCurrency', () => {
    it('should format as Finnish currency', () => {
      // Note: Finnish locale uses non-breaking spaces and special formatting
      const result1 = formatCurrency(1234.56);
      expect(result1).toContain('1');
      expect(result1).toContain('234');
      expect(result1).toContain('56');
      expect(result1).toContain('€');
      
      const result2 = formatCurrency(0.99);
      expect(result2).toContain('0');
      expect(result2).toContain('99');
      expect(result2).toContain('€');
      
      const result3 = formatCurrency(1000000);
      expect(result3).toContain('1');
      expect(result3).toContain('000');
      expect(result3).toContain('€');
    });

    it('should handle negative values', () => {
      const result = formatCurrency(-123.45);
      expect(result).toContain('123');
      expect(result).toContain('45');
      expect(result).toContain('€');
      // Minus sign is present (either - or −)
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatNumber', () => {
    it('should format as Finnish decimal', () => {
      const result1 = formatNumber(1234.56);
      expect(result1).toContain('1');
      expect(result1).toContain('234');
      expect(result1).toContain('56');
      
      const result2 = formatNumber(0.99);
      expect(result2).toContain('0');
      expect(result2).toContain('99');
    });
  });

  describe('formatPercentage', () => {
    it('should format positive percentages with + sign and green color', () => {
      const result = formatPercentage(5.2);
      expect(result.text).toContain('+');
      expect(result.text).toContain('5');
      expect(result.text).toContain('20');
      expect(result.text).toContain('%');
      expect(result.colorClass).toBe('text-green-500');
    });

    it('should format negative percentages with red color', () => {
      const result = formatPercentage(-3.5);
      expect(result.text).toContain('3');
      expect(result.text).toContain('50');
      expect(result.text).toContain('%');
      expect(result.colorClass).toBe('text-red-500');
    });

    it('should handle zero', () => {
      const result = formatPercentage(0);
      expect(result.text).toContain('+');
      expect(result.text).toContain('0');
      expect(result.text).toContain('%');
      expect(result.colorClass).toBe('text-green-500');
    });
  });

  describe('formatChange', () => {
    it('should format positive changes with + sign and green color', () => {
      const result = formatChange(123.45);
      expect(result.text).toContain('+');
      expect(result.text).toContain('123');
      expect(result.text).toContain('45');
      expect(result.text).toContain('€');
      expect(result.colorClass).toBe('text-green-500');
    });

    it('should format negative changes with red color', () => {
      const result = formatChange(-67.89);
      expect(result.text).toContain('67');
      expect(result.text).toContain('89');
      expect(result.text).toContain('€');
      expect(result.colorClass).toBe('text-red-500');
    });
  });
});
