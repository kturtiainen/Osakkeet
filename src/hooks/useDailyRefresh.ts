import { useEffect, useRef } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { usePrices } from './usePrices';
import { getHelsinkiDate, isWeekday, msUntilNextRefresh, getHelsinkiTime } from '../utils/timezone';

/**
 * Hook for automatic daily price refresh at 14:00 Helsinki time (weekdays only)
 */
export function useDailyRefresh(onRefresh?: () => void) {
  const { refreshPrices } = usePrices();
  const onRefreshRef = useRef(onRefresh);
  const refreshPricesRef = useRef(refreshPrices);
  const hasCheckedTodayRef = useRef(false);

  // Update refs on every render (no re-triggers)
  onRefreshRef.current = onRefresh;
  refreshPricesRef.current = refreshPrices;

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const performRefresh = async () => {
      const success = await refreshPricesRef.current();
      if (success && onRefreshRef.current) {
        onRefreshRef.current();
      }
    };

    // Check catch-up ONLY once on mount
    if (!hasCheckedTodayRef.current) {
      hasCheckedTodayRef.current = true;
      const today = getHelsinkiDate();
      const { hours } = getHelsinkiTime();
      const lastRefreshDate = usePortfolioStore.getState().lastRefreshDate;

      if (isWeekday() && hours >= 14 && lastRefreshDate !== today) {
        void performRefresh();
      }
    }

    // Schedule next refresh
    const schedule = () => {
      const ms = msUntilNextRefresh();
      
      // Safety check: ensure ms is reasonable (positive and less than 7 days)
      const MIN_DELAY = 60 * 60 * 1000; // 1 hour minimum
      const MAX_DELAY = 7 * 24 * 60 * 60 * 1000; // 7 days maximum
      
      const safeMs = Math.max(MIN_DELAY, Math.min(ms, MAX_DELAY));
      
      if (ms !== safeMs) {
        console.warn(`Adjusted refresh delay from ${String(ms)}ms to ${String(safeMs)}ms for safety`);
      }
      
      timerId = setTimeout(async () => {
        if (cancelled) return;
        
        try {
          await performRefresh();
        } catch (error) {
          console.error('Daily refresh failed:', error);
        }
        
        // Only reschedule if not cancelled
        // Check again after async refresh - component could have unmounted during refresh
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!cancelled) {
          schedule();
        }
      }, safeMs);
    };

    schedule();

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, []); // Empty dependency array - runs only once on mount
}
