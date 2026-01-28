/**
 * Copy IPO Summary Utility
 * Creates a formatted summary text for copying
 */

export function generateIPOSummary(ipo) {
  const lines = [];
  
  lines.push(`📊 ${ipo.companyName || 'Company Name'}`);
  lines.push('');
  
  // Price Band
  if (ipo.pricing?.priceBand) {
    lines.push(`Price Band: ${ipo.pricing.priceBand}`);
  } else {
    lines.push(`Price Band: Not announced`);
  }
  
  // Lot Size
  if (ipo.lotDetails?.lotSize) {
    lines.push(`Lot Size: ${ipo.lotDetails.lotSize} shares`);
  }
  
  // Issue Size
  if (ipo.issueDetails?.issueSizeCr) {
    lines.push(`Issue Size: ₹${ipo.issueDetails.issueSizeCr} Cr`);
  }
  
  lines.push('');
  
  // Dates
  if (ipo.dates?.open) {
    const openDate = new Date(ipo.dates.open).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    lines.push(`Open Date: ${openDate}`);
  }
  
  if (ipo.dates?.close) {
    const closeDate = new Date(ipo.dates.close).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    lines.push(`Close Date: ${closeDate}`);
  }
  
  if (ipo.dates?.allotment) {
    const allotDate = new Date(ipo.dates.allotment).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    lines.push(`Allotment Date: ${allotDate}`);
  }
  
  if (ipo.dates?.listing) {
    const listDate = new Date(ipo.dates.listing).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    lines.push(`Listing Date: ${listDate}`);
  }
  
  lines.push('');
  
  // GMP
  if (ipo.gmp?.current) {
    lines.push(`GMP: ₹${ipo.gmp.current}`);
  } else {
    lines.push(`GMP: —`);
  }
  
  // IPO Type
  if (ipo.ipoType) {
    lines.push(`Type: ${ipo.ipoType}`);
  }
  
  // Exchange
  if (ipo.exchange && ipo.exchange.length > 0) {
    lines.push(`Exchange: ${ipo.exchange.join(', ')}`);
  }
  
  lines.push('');
  lines.push(`View details: https://openipo.com/ipo/${ipo.slug}`);
  
  return lines.join('\n');
}

export async function copyIPOSummary(ipo) {
  const summary = generateIPOSummary(ipo);
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(summary);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = summary;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Error copying summary:', error);
    return false;
  }
}
