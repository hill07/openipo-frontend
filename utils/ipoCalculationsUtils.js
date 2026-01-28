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

    // 4. Subscription Summary
    if (newData.subscription && Array.isArray(newData.subscription.categories)) {
        const summary = {
            qib: 0, retail: 0, hni: 0, shni: 0, bhni: 0, emp: 0, total: 0
        };
        let totalOffered = 0;
        let totalApplied = 0;

        newData.subscription.categories.forEach(cat => {
            const offered = Number(cat.sharesOffered) || 0;
            const applied = Number(cat.sharesBid) || 0;
            const times = Number(cat.subscriptionTimes) || 0;

            totalOffered += offered;
            totalApplied += applied;

            const name = (cat.name || '').toLowerCase();
            if (name.includes('qib')) summary.qib = times;
            else if (name.includes('retail') || name.includes('individual')) summary.retail = times;
            else if (name.includes('employee') || name.includes('emp')) summary.emp = times;
            else if (name.includes('nii') || name.includes('hni')) {
                if (name.includes('bhni') || name.includes('big')) summary.bhni = times;
                else if (name.includes('shni') || name.includes('small')) summary.shni = times;
                else summary.hni = times;
            }
        });

        // Total
        let totalTimes = 0;
        if (totalOffered > 0) {
            totalTimes = Number((totalApplied / totalOffered).toFixed(2));
        }
        summary.total = totalTimes;

        newData.subscription.summary = summary;
    }

    return newData;
};
