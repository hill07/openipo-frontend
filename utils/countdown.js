/**
 * Countdown Timer Utility for IPO Closing (16:00 IST cutoff)
 * Uses Asia/Kolkata timezone handling
 */

/**
 * Get current time in IST (Asia/Kolkata)
 */
export function getISTNow() {
  const now = new Date();
  // Convert to IST by getting time in IST timezone string
  const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(istString);
}

/**
 * Get IPO close deadline (16:00 IST on close date)
 */
export function getCloseDeadline(closeDate) {
  if (!closeDate) return null;
  
  const date = new Date(closeDate);
  // Set to 16:00 IST on the close date
  const closeDeadline = new Date(date);
  closeDeadline.setHours(16, 0, 0, 0);
  
  return closeDeadline;
}

/**
 * Calculate countdown to IPO close (16:00 IST cutoff)
 * Returns: { hours, minutes, seconds, isExpired, formatted }
 */
export function getCloseCountdown(closeDate) {
  if (!closeDate) return null;
  
  const deadline = getCloseDeadline(closeDate);
  const now = new Date();
  
  const diff = deadline - now;
  
  if (diff <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formatted: "Closed at 4:00 PM"
    };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return {
    hours,
    minutes,
    seconds,
    isExpired: false,
    formatted: hours > 0 
      ? `Closes in ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`
      : `Closes in ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
  };
}

/**
 * Check if IPO closes today (date only, ignore time)
 */
export function isClosingToday(closeDate) {
  if (!closeDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const close = new Date(closeDate);
  close.setHours(0, 0, 0, 0);
  
  return today.getTime() === close.getTime();
}
