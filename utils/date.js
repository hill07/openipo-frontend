/**
 * Date formatting utilities
 */

/**
 * Format date to short format: "09 Jan 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";
    
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return "—";
  }
}

/**
 * Format date to ISO string for inputs (date type)
 */
export function formatDateForInput(dateStr) {
  if (!dateStr) return "";
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    
    // Format as YYYY-MM-DD for input[type="date"]
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}

/**
 * Format datetime to ISO string for inputs (datetime-local type)
 */
export function formatDateTimeForInput(dateStr) {
  if (!dateStr) return "";
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    
    // Format as YYYY-MM-DDTHH:mm for input[type="datetime-local"]
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
}

/**
 * Parse datetime from input string (YYYY-MM-DDTHH:mm)
 */
export function parseDateTimeFromInput(inputStr) {
  if (!inputStr) return null;
  
  try {
    const date = new Date(inputStr);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

/**
 * Parse date from input string (YYYY-MM-DD)
 */
export function parseDateFromInput(inputStr) {
  if (!inputStr) return null;
  
  try {
    const date = new Date(inputStr + 'T00:00:00');
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}
