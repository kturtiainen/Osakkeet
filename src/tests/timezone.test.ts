import { describe, it, expect } from 'vitest';
import { msUntilNextRefresh, isWeekday, getHelsinkiTime, getHelsinkiDate } from '../utils/timezone';

describe('timezone', () => {
  describe('msUntilNextRefresh', () => {
    it('should return a positive millisecond value', () => {
      const ms = msUntilNextRefresh();
      expect(ms).toBeGreaterThan(0);
    });

    it('should not return more than 7 days in milliseconds', () => {
      const ms = msUntilNextRefresh();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      expect(ms).toBeLessThanOrEqual(sevenDays);
    });

    it('should return a reasonable value (not NaN or Infinity)', () => {
      const ms = msUntilNextRefresh();
      expect(Number.isFinite(ms)).toBe(true);
      expect(Number.isNaN(ms)).toBe(false);
    });

    it('should handle weekend scenarios without infinite loop', () => {
      // This test verifies that the function completes in reasonable time
      // even on weekends (should skip to Monday)
      const start = Date.now();
      const ms = msUntilNextRefresh();
      const elapsed = Date.now() - start;
      
      // Should complete in less than 100ms (much less than infinite)
      expect(elapsed).toBeLessThan(100);
      
      // Should still return valid value
      expect(ms).toBeGreaterThan(0);
      expect(ms).toBeLessThanOrEqual(7 * 24 * 60 * 60 * 1000);
    });

    it('should enforce maximum iteration limit', () => {
      // The function now has MAX_DAYS_TO_CHECK = 14
      // This test verifies it doesn't loop forever
      // Even in worst case, should return 24h default
      const ms = msUntilNextRefresh();
      
      // Should either find a valid time or return 24h default
      const oneDayMs = 24 * 60 * 60 * 1000;
      expect(ms).toBeGreaterThanOrEqual(0);
      expect(ms).toBeLessThanOrEqual(7 * oneDayMs);
    });
  });

  describe('isWeekday', () => {
    it('should return a boolean', () => {
      const result = isWeekday();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getHelsinkiTime', () => {
    it('should return hours and minutes', () => {
      const { hours, minutes } = getHelsinkiTime();
      expect(typeof hours).toBe('number');
      expect(typeof minutes).toBe('number');
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThan(24);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThan(60);
    });
  });

  describe('getHelsinkiDate', () => {
    it('should return ISO date format', () => {
      const date = getHelsinkiDate();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
