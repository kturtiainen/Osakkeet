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
      timerId = setTimeout(async () => {
        if (cancelled) return;
        await performRefresh();
        // Check again after async refresh - component could have unmounted during refresh
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!cancelled) {
          schedule();
        }
      }, ms);
    };

    schedule();

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, []); // Empty dependency array - runs only once on mount
}
