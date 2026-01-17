/**
 * Watchlist Utility (localStorage-based)
 * No login required - stores IPO slugs
 */

const WATCHLIST_KEY = 'openipo_watchlist';

/**
 * Get saved IPO slugs from localStorage
 */
export function getSavedIPOs() {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem(WATCHLIST_KEY);
    if (!saved) return [];
    const slugs = JSON.parse(saved);
    return Array.isArray(slugs) ? slugs : [];
  } catch (error) {
    console.error('Error reading watchlist:', error);
    return [];
  }
}

/**
 * Check if IPO is saved
 */
export function isIPOSaved(slug) {
  const saved = getSavedIPOs();
  return saved.includes(slug);
}

/**
 * Save IPO to watchlist
 */
export function saveIPO(slug) {
  if (typeof window === 'undefined') return;
  
  try {
    const saved = getSavedIPOs();
    if (!saved.includes(slug)) {
      saved.push(slug);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(saved));
      // Dispatch custom event for components to listen
      window.dispatchEvent(new CustomEvent('watchlist-changed'));
    }
  } catch (error) {
    console.error('Error saving IPO:', error);
  }
}

/**
 * Remove IPO from watchlist
 */
export function removeIPO(slug) {
  if (typeof window === 'undefined') return;
  
  try {
    const saved = getSavedIPOs();
    const filtered = saved.filter(s => s !== slug);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
    // Dispatch custom event for components to listen
    window.dispatchEvent(new CustomEvent('watchlist-changed'));
  } catch (error) {
    console.error('Error removing IPO:', error);
  }
}

/**
 * Toggle IPO save status
 */
export function toggleIPO(slug) {
  if (isIPOSaved(slug)) {
    removeIPO(slug);
  } else {
    saveIPO(slug);
  }
}
