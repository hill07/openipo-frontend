export default function IPOFinancials({ financials }) {
    if (!financials || !financials.table || financials.table.length === 0) return null;

    // Reverse to show latest first if needed, usually passed correct from backend
    const data = financials.table;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Financial Performance</h3>
            <p className="text-sm text-slate-500 mb-6">Figures in ₹ Crores unless specified</p>

            <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Period</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">Assets</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">Total Income</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">PAT</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">EBITDA</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">Net Worth</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">Reserves</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">Total Borrowing</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                <td className="py-3 px-4 text-sm font-bold text-slate-700 whitespace-nowrap">{row.period}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{row.assets}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{row.totalIncome}</td>
                                <td className="py-3 px-4 text-sm font-bold text-slate-900 text-right">{row.pat}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{row.ebitda}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{row.netWorth}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{row.reservesSurplus}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{row.totalBorrowing}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* KPIs */}
            {financials.kpis && financials.kpis.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['roe', 'roce', 'eps', 'ronw'].map(metric => {
                        const val = financials.kpis[0][metric]; // Taking latest
                        if (!val) return null;
                        return (
                            <div key={metric} className="p-3 bg-slate-50 rounded-lg">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">{metric}</div>
                                <div className="text-lg font-bold text-slate-900">{val}{metric === 'eps' ? '' : '%'}</div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
