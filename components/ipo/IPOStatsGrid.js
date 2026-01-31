import Link from "next/link";
import { formatIndianNumber } from '../../utils/formatters';

// Formatting Helpers
const formatCurrency = (val) => val ? `₹${val.toLocaleString('en-IN')}` : 'TBA';
const formatCrores = (val) => val ? `₹${val.toLocaleString('en-IN')} Cr` : 'TBA';

export default function IPOStatsGrid({ ipo }) {
    if (!ipo) return null;

    const items = [
        {
            label: 'Price Band',
            value: (
                <div className="flex flex-col leading-tight">
                    <span>
                        {ipo.priceBand?.min && ipo.priceBand?.max
                            ? `₹${ipo.priceBand.min.toLocaleString('en-IN')} - ₹${ipo.priceBand.max.toLocaleString('en-IN')}`
                            : formatCurrency(ipo.priceBand?.min)}
                    </span>
                    {ipo.lotSize && (
                        <span className="text-[10px] text-slate-500 font-medium">
                            {ipo.lotSize} Shares
                        </span>
                    )}
                </div>
            )
        },
        { label: 'Lot Size', value: ipo.lotSize ? `${ipo.lotSize.toLocaleString('en-IN')} Shares` : 'TBA' },
        {
            label: 'Total Issue Size',
            value: (
                <div className="flex flex-col leading-tight">
                    <span>{formatCrores(ipo.issueSize?.cr || ipo.issueBreakdown?.total?.cr)}</span>
                    {(ipo.issueSize?.shares || ipo.issueBreakdown?.total?.shares) && (
                        <span className="text-[10px] text-slate-500 font-medium">
                            {formatIndianNumber(ipo.issueSize?.shares || ipo.issueBreakdown?.total?.shares)} Shares
                        </span>
                    )}
                </div>
            )
        },
        {
            label: 'Fresh Issue',
            value: (
                <div className="flex flex-col leading-tight">
                    <span>{formatCrores(ipo.issueBreakdown?.fresh?.cr)}</span>
                    {ipo.issueBreakdown?.fresh?.shares && (
                        <span className="text-[10px] text-slate-500 font-medium">
                            {formatIndianNumber(ipo.issueBreakdown?.fresh?.shares)} Shares
                        </span>
                    )}
                </div>
            )
        },
        {
            label: 'Offer for Sale',
            value: (
                <div className="flex flex-col leading-tight">
                    <span>{formatCrores(ipo.issueBreakdown?.ofs?.cr)}</span>
                    {ipo.issueBreakdown?.ofs?.shares && (
                        <span className="text-[10px] text-slate-500 font-medium">
                            {formatIndianNumber(ipo.issueBreakdown?.ofs?.shares)} Shares
                        </span>
                    )}
                </div>
            )
        },
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
                        <div className="text-sm font-bold text-slate-900">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}