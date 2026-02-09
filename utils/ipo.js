/**
 * IPO Utility Functions
 * All status calculations derived from dates - no hardcoded values
 */

export function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toStartOfDay(date) {
  if (!date) return null;
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get IPO status from dates (Upcoming/Open/Closed/Allotted/Listed)
 * This is the single source of truth for status calculation
 */
export function getIPOStatusFromDates(dates = {}) {
  const now = toStartOfDay(new Date());

  const open = toStartOfDay(parseDate(dates.open));
  const close = toStartOfDay(parseDate(dates.close));
  const allotment = toStartOfDay(parseDate(dates.allotment));
  const listing = toStartOfDay(parseDate(dates.listing));

  // If no dates available => Upcoming by default
  if (!open && !close && !allotment && !listing) return "Upcoming";

  // Listed if listing date passed
  if (listing && now >= listing) return "Listed";

  // Allotted after allotment date but before listing
  if (allotment && now >= allotment && (!listing || now < listing))
    return "Allotted";

  // Closed after close date but before allotment
  if (close && now > close && (!allotment || now < allotment))
    return "Closed";

  // Open between open and close
  if (open && close && now >= open && now <= close) return "Open";

  // Upcoming before open
  if (open && now < open) return "Upcoming";

  // fallback
  return "Upcoming";
}

export function getDaysInfo(dates = {}) {
  const now = new Date();
  const open = parseDate(dates.open);
  const close = parseDate(dates.close);

  const status = getIPOStatusFromDates(dates);

  const daysBetween = (future) =>
    Math.ceil((future - now) / (1000 * 60 * 60 * 24));

  if (status === "Upcoming" && open) {
    const d = daysBetween(open);
    if (d <= 0) return "Opens today";
    if (d === 1) return "Opens tomorrow";
    return `Opens in ${d} day${d > 1 ? "s" : ""}`;
  }

  if (status === "Open" && close) {
    const d = daysBetween(close);
    if (d <= 0) return "Closes today";
    if (d === 1) return "Closes tomorrow";
    return `${d} day${d > 1 ? "s" : ""} left`;
  }

  if (status === "Closed" && close) {
    return `Closed on ${close.toLocaleDateString("en-IN")}`;
  }

  if (status === "Allotted") return "Allotment done";
  if (status === "Listed") return "Listed in market";

  return status;
}

export function getStatusProgress(status) {
  const map = {
    Upcoming: 20,
    Open: 40,
    Closed: 60,
    Allotted: 80,
    Listed: 100,
  };
  return map[status] ?? 20;
}

export function isToday(date) {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return today.getTime() === checkDate.getTime();
}

export function isTomorrow(date) {
  if (!date) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return tomorrow.getTime() === checkDate.getTime();
}

/**
 * Calculate estimated listing price from GMP and price band
 */
export function getEstimatedListingPrice(pricing, gmp) {
  if (!pricing?.priceBand || !gmp?.current) return null;

  let upperPrice = 0;

  if (typeof pricing.priceBand === 'object' && pricing.priceBand.max) {
    upperPrice = pricing.priceBand.max;
  } else if (typeof pricing.priceBand === 'string') {
    const match = pricing.priceBand.match(/₹?\s*(\d+)\s*-\s*(\d+)/);
    if (match) {
      upperPrice = parseFloat(match[2]);
    }
  }

  if (!upperPrice) return null;
  return upperPrice + gmp.current;
}

/**
 * Calculate expected listing gain percentage
 */
export function getExpectedListingGain(pricing, gmp) {
  if (!pricing?.priceBand || !gmp?.current) return null;

  let upperPrice = 0;

  if (typeof pricing.priceBand === 'object' && pricing.priceBand.max) {
    upperPrice = pricing.priceBand.max;
  } else if (typeof pricing.priceBand === 'string') {
    const match = pricing.priceBand.match(/₹?\s*(\d+)\s*-\s*(\d+)/);
    if (match) {
      upperPrice = parseFloat(match[2]);
    }
  }

  if (!upperPrice) return null;

  const estimatedListingPrice = upperPrice + gmp.current;
  const gainPercent = (gmp.current / upperPrice) * 100;

  return {
    estimatedListingPrice,
    gainPercent: parseFloat(gainPercent.toFixed(2))
  };
}

/**
 * Calculate profit from lots
 */
export function calculateProfit(lots, lotSize, upperPrice, gmp) {
  if (!lots || !lotSize || !upperPrice || !gmp) return null;

  const shares = lots * lotSize;
  const investment = shares * upperPrice;
  const estimatedProfit = shares * gmp;
  const estimatedListingPrice = upperPrice + gmp;
  const gainPercent = (gmp / upperPrice) * 100;

  return {
    lots,
    shares,
    investment,
    estimatedProfit,
    estimatedListingPrice,
    gainPercent: parseFloat(gainPercent.toFixed(2)),
    estimatedListingPrice,
    gainPercent: parseFloat(gainPercent.toFixed(2)),
    breakEvenPrice: upperPrice
  };
}

/**
 * Check if IPO is currently open for applications
 * Logic: Open Date 10:00 AM to Close Date 4:00 PM
 */
export function isIPOApplyWindowOpen(startDate, endDate) {
  if (!startDate || !endDate) return false;

  const now = new Date();

  // Set Open Time: Start Date 10:00 AM
  const openTime = new Date(startDate);
  openTime.setHours(10, 0, 0, 0);

  // Set Close Time: End Date 4:00 PM (16:00)
  const closeTime = new Date(endDate);
  closeTime.setHours(16, 0, 0, 0);

  return now >= openTime && now <= closeTime;
}