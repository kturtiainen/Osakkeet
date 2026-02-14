import { useEffect, useCallback } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { usePrices } from './usePrices';
import { getHelsinkiDate, isWeekday, msUntilNextRefresh, getHelsinkiTime } from '../utils/timezone';

/**
 * Hook for automatic daily price refresh at 14:00 Helsinki time (weekdays only)
 */
export function useDailyRefresh(onRefresh?: () => void) {
  const lastRefreshDate = usePortfolioStore((state) => state.lastRefreshDate);
  const { refreshPrices } = usePrices();

  const performRefresh = useCallback(async () => {
    const success = await refreshPrices();
    if (success && onRefresh) {
      onRefresh();
    }
  }, [refreshPrices, onRefresh]);

  const scheduleNextRefresh = useCallback(() => {
    const ms = msUntilNextRefresh();
    
    const timerId = setTimeout(() => {
      performRefresh();
      // Schedule the next one after this completes
      scheduleNextRefresh();
    }, ms);

    return timerId;
  }, [performRefresh]);

  useEffect(() => {
    // Check if we should refresh now
    const today = getHelsinkiDate();
    const { hours } = getHelsinkiTime();
    
    // If it's a weekday, past 14:00, and we haven't refreshed today yet
    if (isWeekday() && hours >= 14 && lastRefreshDate !== today) {
      performRefresh();
    }

    // Schedule next automatic refresh
    const timerId = scheduleNextRefresh();

    return () => {
      clearTimeout(timerId);
    };
  }, [lastRefreshDate, performRefresh, scheduleNextRefresh]);
}
