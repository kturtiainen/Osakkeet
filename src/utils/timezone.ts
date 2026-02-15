/**
 * Get current date in Helsinki timezone as ISO date string (YYYY-MM-DD)
 */
export function getHelsinkiDate(): string {
  const helsinkiTime = new Intl.DateTimeFormat('fi-FI', {
    timeZone: 'Europe/Helsinki',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  
  // Convert from DD.MM.YYYY to YYYY-MM-DD
  const [day, month, year] = helsinkiTime.split('.');
  return `${year}-${month}-${day}`;
}

/**
 * Get current time in Helsinki timezone
 */
export function getHelsinkiTime(): { hours: number; minutes: number } {
  const formatter = new Intl.DateTimeFormat('fi-FI', {
    timeZone: 'Europe/Helsinki',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(new Date());
  const hourPart = parts.find(p => p.type === 'hour');
  const minutePart = parts.find(p => p.type === 'minute');
  
  const hours = hourPart ? Number(hourPart.value) : 0;
  const minutes = minutePart ? Number(minutePart.value) : 0;
  
  return { hours, minutes };
}

/**
 * Check if today is a weekday (Monday-Friday)
 */
export function isWeekday(): boolean {
  const helsinkiDay = new Intl.DateTimeFormat('fi-FI', {
    timeZone: 'Europe/Helsinki',
    weekday: 'short',
  }).format(new Date());
  
  // In Finnish: ma, ti, ke, to, pe (weekdays) vs la, su (weekend)
  return !['la', 'su'].includes(helsinkiDay.toLowerCase());
}

/**
 * Calculate milliseconds until next weekday at 14:00 Helsinki time
 */
export function msUntilNextRefresh(): number {
  const now = new Date();
  const { hours, minutes } = getHelsinkiTime();
  
  // Create a date object for today at 14:00 Helsinki time
  const today14 = new Date();
  today14.setHours(14, 0, 0, 0);
  
  // Adjust for timezone offset
  const nowHours = hours;
  const nowMinutes = minutes;
  const currentMinutes = nowHours * 60 + nowMinutes;
  const targetMinutes = 14 * 60;
  
  let daysToAdd = 0;
  const MAX_DAYS_TO_CHECK = 14; // Don't search more than 2 weeks
  
  if (currentMinutes >= targetMinutes || !isWeekday()) {
    // If it's past 14:00 today or weekend, find next weekday
    daysToAdd = 1;
    while (daysToAdd < MAX_DAYS_TO_CHECK) {
      const checkDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      const checkDay = new Intl.DateTimeFormat('fi-FI', {
        timeZone: 'Europe/Helsinki',
        weekday: 'short',
      }).format(checkDate);
      
      if (!['la', 'su'].includes(checkDay.toLowerCase())) {
        break;
      }
      daysToAdd++;
    }
    
    // If we exhausted the loop without finding a weekday, return a safe default
    if (daysToAdd >= MAX_DAYS_TO_CHECK) {
      console.error('Failed to find next weekday within 14 days, using 24h default');
      return 24 * 60 * 60 * 1000; // Default to 24 hours
    }
  }
  
  // Calculate milliseconds
  const msInDay = 24 * 60 * 60 * 1000;
  const msUntilTarget = (targetMinutes - currentMinutes) * 60 * 1000;
  
  let result: number;
  if (daysToAdd === 0) {
    result = msUntilTarget;
  } else {
    result = (daysToAdd * msInDay) + msUntilTarget;
  }
  
  // Ensure result is reasonable (between 0 and 7 days)
  const MAX_DELAY = 7 * 24 * 60 * 60 * 1000;
  if (result < 0 || result > MAX_DELAY) {
    console.error('Invalid refresh time calculated, using 24h default', { result });
    return 24 * 60 * 60 * 1000;
  }
  
  return result;
}
