export const calculateIpoStatus = (dates, now = new Date()) => {
    if (!dates) return 'UPCOMING';

    const open = dates.open ? new Date(dates.open) : null;
    const close = dates.close ? new Date(dates.close) : null;
    const allotment = dates.allotment ? new Date(dates.allotment) : null;
    const listing = dates.listing ? new Date(dates.listing) : null;

    if (listing && now >= listing) return 'LISTED';
    if (allotment && now >= allotment) return 'ALLOTMENT';
    if (close && now > close) return 'CLOSED';
    if (open && close && now >= open && now <= close) return 'OPEN';
    if (open && now < open) return 'UPCOMING';

    return 'UPCOMING';
};

export const computeFrontendDerivedFields = (data) => {
    const newData = { ...data };

    // 1. Min Investment
    const maxPrice = Number(newData.priceBand?.max);
    const lotSize = Number(newData.lotSize);
    if (!isNaN(maxPrice) && !isNaN(lotSize) && maxPrice > 0 && lotSize > 0) {
        newData.minInvestment = maxPrice * lotSize;
    }

    // 2. GMP Derived
    const gmpCurrent = Number(newData.gmp?.current || 0);
    if (!newData.gmp) newData.gmp = {};

    if (!isNaN(maxPrice) && maxPrice > 0) {
        newData.gmp.percent = Number(((gmpCurrent / maxPrice) * 100).toFixed(2));
        newData.gmp.estListingPrice = maxPrice + gmpCurrent;
    } else {
        // Clear if invalid
        newData.gmp.percent = '';
        newData.gmp.estListingPrice = '';
    }

    // 3. Status (Visual only, usually not saved back to form state as string if form uses dates, 
    // but useful if we want to show it or if we store it)
    // The form stores 'status'.
    if (newData.dates) {
        newData.status = calculateIpoStatus(newData.dates);
    }

    // 4. Dynamic Calculations (Totals & Times)

    // A. Reservations (Shares Offered & Percentage)
    let totalIssueShares = 0;
    if (Array.isArray(newData.reservations)) {
        // Calculate Total Issue Shares
        // Priority: issueBreakdown.total.shares > issueSize.shares > Sum of Reservations
        const breakdownTotal = Number(newData.issueBreakdown?.total?.shares);
        const issueSizeTotal = Number(newData.issueSize?.shares);

        // If neither is available, fallback to sum of reservations (though usually issueSize should be there)
        const sumReservations = newData.reservations.reduce((acc, r) => (r.enabled !== false ? acc + (Number(r.sharesOffered) || 0) : acc), 0);

        totalIssueShares = breakdownTotal || issueSizeTotal || sumReservations;

        // Calculate Percentages
        newData.reservations.forEach(r => {
            if (r.enabled !== false && totalIssueShares > 0) {
                const shares = Number(r.sharesOffered) || 0;
                // Add a transient 'percentage' field for UI display only
                r.percentage = ((shares / totalIssueShares) * 100).toFixed(2);
            } else {
                r.percentage = '';
            }
        });
    }

    // B. Subscription (Times)
    // B. Subscription (Times)
    if (newData.subscription && Array.isArray(newData.subscription.categories)) {
        let totalOffered = 0;
        let totalApplied = 0;

        newData.subscription.categories.forEach(cat => {
            if (cat.enabled !== false) {
                // MarketMaker Excluded
                if (cat.category === 'MarketMaker') return;

                const offered = Number(cat.sharesOffered) || 0;
                const applied = Number(cat.appliedShares) || 0;
                let effectiveOffered = offered;

                // QIB Logic: Subtract Anchor
                if (cat.category === 'QIB') {
                    const qibRes = newData.reservations?.find(r => r.category === 'QIB');
                    const anchor = Number(qibRes?.anchorShares) || 0;
                    effectiveOffered = Math.max(0, offered - anchor);
                }

                // Category Times
                if (effectiveOffered > 0) {
                    cat.times = (applied / effectiveOffered).toFixed(2);
                } else {
                    cat.times = '';
                }

                totalOffered += effectiveOffered;
                totalApplied += applied;
            }
        });

        // Total Times
        if (totalOffered > 0) {
            newData.subscription.totalTimes = (totalApplied / totalOffered).toFixed(2);
            newData.subscription.totalOffered = totalOffered;
            newData.subscription.totalApplied = totalApplied;
        } else {
            newData.subscription.totalTimes = ''; // Display empty if 0
        }

        // Remove old summary if present
        delete newData.subscription.summary;
    }

    return newData;
};
