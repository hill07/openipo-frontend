export default function IPOStatsGrid({ ipo }) {

    // Formatting Helpers
    // Formatting Helpers
    const formatCurrency = (val) => val ? `₹${val.toLocaleString('en-IN')}` : 'TBA';
    const formatCrores = (val) => val ? `₹${val.toLocaleString('en-IN')} Cr` : 'TBA';

    const items = [
        {
            label: 'Price Band',
            value: ipo.priceBand?.min && ipo.priceBand?.max
                ? `₹${ipo.priceBand.min.toLocaleString('en-IN')} - ₹${ipo.priceBand.max.toLocaleString('en-IN')}`
                : formatCurrency(ipo.priceBand?.min)
        },
        { label: 'Lot Size', value: ipo.lotSize ? `${ipo.lotSize.toLocaleString('en-IN')} Shares` : 'TBA' },
        { label: 'Total Issue Size', value: formatCrores(ipo.issueSize?.cr || ipo.issueBreakdown?.total?.cr) },
        { label: 'Fresh Issue', value: formatCrores(ipo.issueBreakdown?.fresh?.cr) },
        { label: 'Offer for Sale', value: formatCrores(ipo.issueBreakdown?.ofs?.cr) },
        { label: 'Face Value', value: formatCurrency(ipo.faceValue) },
        { label: 'Face Value', value: formatCurrency(ipo.faceValue) },
        // Retail Allocation removed as requested
        { label: 'Listing At', value: ipo.listingAt?.join(', ') || 'BSE, NSE' },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5">IPO Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                {items.map((item, i) => (
                    <div key={i} className="flex flex-col p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{item.label}</span>
                        <span className="text-base font-bold text-slate-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
