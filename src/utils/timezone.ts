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
  const helsinkiTime = new Intl.DateTimeFormat('fi-FI', {
    timeZone: 'Europe/Helsinki',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
  
  const [hours, minutes] = helsinkiTime.split(':').map(Number);
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
  
  if (currentMinutes >= targetMinutes || !isWeekday()) {
    // If it's past 14:00 today or weekend, find next weekday
    daysToAdd = 1;
    while (true) {
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
  }
  
  // Calculate milliseconds
  const msInDay = 24 * 60 * 60 * 1000;
  const msUntilTarget = (targetMinutes - currentMinutes) * 60 * 1000;
  
  if (daysToAdd === 0) {
    return msUntilTarget;
  } else {
    return (daysToAdd * msInDay) + msUntilTarget;
  }
}
