export default function IPOLotSize({ lotDistribution, limits, lotSize }) {
    if ((!lotDistribution || lotDistribution.length === 0) && !limits) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Lot Size & Investment Limits</h3>

            {/* Limits Cards */}
            {limits && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {/* Retail Min */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">Retail (Min)</div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-lg font-bold text-slate-900">{limits.retail?.minLots || 1} Lot</span>
                            <span className="text-sm font-medium text-slate-600">{(limits.retail?.minLots || 1) * (lotSize || 0)} Shares</span>
                        </div>
                    </div>
                    {/* Retail Max */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">Retail (Max)</div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-lg font-bold text-slate-900">{limits.retail?.maxLots || '-'} Lots</span>
                            <span className="text-sm font-medium text-slate-600">{(limits.retail?.maxLots || 0) * (lotSize || 0)} Shares</span>
                        </div>
                    </div>
                    {/* HNI Min */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">S-HNI (Min)</div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-lg font-bold text-slate-900">{limits.shni?.minLots || '-'} Lots</span>
                            <span className="text-sm font-medium text-slate-600">{(limits.shni?.minLots || 0) * (lotSize || 0)} Shares</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Lot Distribution Table */}
            {lotDistribution && lotDistribution.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Category</th>
                                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">Lots</th>
                                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">Shares</th>
                                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lotDistribution.map((row, i) => (
                                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                    <td className="py-3 px-4 text-sm font-bold text-slate-700">{row.category}</td>
                                    <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{row.lots}</td>
                                    <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{row.shares}</td>
                                    <td className="py-3 px-4 text-sm font-bold text-slate-900 text-right">{row.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
