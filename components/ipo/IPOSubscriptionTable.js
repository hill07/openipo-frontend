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
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Offered</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Bids</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Times (x)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscription.categories.map((cat, i) => (
                            <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-4 text-sm font-bold text-slate-700">{cat.name}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{cat.sharesOffered ? formatIndianNumber(cat.sharesOffered) : '-'}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{cat.sharesBid ? formatIndianNumber(cat.sharesBid) : '-'}</td>
                                <td className={`py-3 px-4 text-sm font-bold text-right ${cat.subscriptionTimes > 10 ? 'text-green-600' : 'text-slate-900'
                                    }`}>
                                    {cat.subscriptionTimes}x
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
