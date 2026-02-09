import { formatIndianNumber } from '../../utils/formatters';

export default function IPOSubscriptionTable({ subscription }) {
    if (!subscription || !subscription.categories) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Subscription Status</h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="py-2 px-2 text-xs font-bold text-slate-500 uppercase">Category</th>
                            <th className="py-2 px-2 text-xs font-bold text-slate-500 uppercase text-right">Offered</th>
                            <th className="py-2 px-2 text-xs font-bold text-slate-500 uppercase text-right">Bids</th>
                            <th className="py-2 px-2 text-xs font-bold text-slate-500 uppercase text-right">Times (x)</th>
                        </tr>
                    </thead>
                    <tbody>

                        {subscription.categories
                            .filter(cat => cat.enabled !== false && cat.category !== 'MarketMaker')
                            .map((cat, i) => {
                                const isRetail = (cat.category || cat.name) === 'Retail';
                                return (
                                    <tr key={i} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${isRetail ? 'bg-slate-50' : ''}`}>
                                        <td className={`py-2 px-2 text-xs text-slate-700 ${isRetail ? 'font-extrabold text-slate-900' : 'font-bold'}`}>{cat.category || cat.name}</td>
                                        <td className={`py-2 px-2 text-xs text-slate-600 text-right ${isRetail ? 'font-bold' : 'font-medium'}`}>{cat.sharesOffered ? formatIndianNumber(cat.sharesOffered) : '-'}</td>
                                        <td className={`py-2 px-2 text-xs text-slate-600 text-right ${isRetail ? 'font-bold' : 'font-medium'}`}>{cat.appliedShares ? formatIndianNumber(cat.appliedShares) : '-'}</td>
                                        <td className={`py-2 px-2 text-xs text-right ${Number(cat.times) > 10 ? 'text-green-600 font-bold' : (isRetail ? 'text-slate-900 font-extrabold' : 'text-slate-900 font-bold')}`}>
                                            {cat.times ? Number(cat.times).toFixed(2) + 'x' : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        {/* Total Row */}
                        <tr className="bg-slate-50 border-t border-slate-200">
                            <td className="py-2 px-2 text-xs font-extrabold text-slate-900">Total</td>
                            <td className="py-2 px-2 text-xs font-bold text-slate-800 text-right">{subscription.totalOffered ? formatIndianNumber(subscription.totalOffered) : '-'}</td>
                            <td className="py-2 px-2 text-xs font-bold text-slate-800 text-right">{subscription.totalApplied ? formatIndianNumber(subscription.totalApplied) : '-'}</td>
                            <td className="py-2 px-2 text-xs font-extrabold text-right text-slate-900">
                                {subscription.totalTimes ? `${Number(subscription.totalTimes).toFixed(2)}x` : '-'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
