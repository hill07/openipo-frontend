export default function IPOFinancials({ financials, type }) {
    if (!financials || !financials.table || financials.table.length === 0) return null;

    const data = financials.table; // Array of objects { period, assets, ... }

    // Define the metrics to display as rows
    const metrics = [
        { key: 'assets', label: 'Assets' },
        { key: 'totalIncome', label: 'Total Income' },
        { key: 'pat', label: 'PAT' },
        { key: 'ebitda', label: 'EBITDA' },
        { key: 'netWorth', label: 'Net Worth' },
        { key: 'reservesSurplus', label: 'Reserves' },
        { key: 'totalBorrowing', label: 'Total Borrowing' },
    ];

    let kpiMetrics = [];

    if (type === 'SME') {
        kpiMetrics = [
            { key: 'roe', label: 'ROE (%)' },
            { key: 'roce', label: 'ROCE (%)' },
            { key: 'eps', label: 'EPS (₹)' },
            { key: 'pePre', label: 'P/E (Pre)' },
            { key: 'pePost', label: 'P/E (Post)' },
        ];
    } else {
        // Default / MAINBOARD
        kpiMetrics = [
            { key: 'ronw', label: 'RoNW (%)' },
            { key: 'eps', label: 'EPS (₹)' },
            { key: 'pePre', label: 'P/E (Pre)' },
            { key: 'pePost', label: 'P/E (Post)' },
        ];
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Financial Performance</h3>
            <p className="text-sm text-slate-500 mb-6">Figures in ₹ Crores unless specified</p>

            <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Metric</th>
                            {data.map((col, i) => (
                                <th key={i} className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">
                                    {col.period}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((metric, i) => (
                            <tr key={metric.key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                <td className={`py-2 px-2 text-xs font-bold text-slate-700 whitespace-nowrap ${metric.key === 'pat' ? 'text-slate-900' : ''
                                    }`}>
                                    {metric.label}
                                </td>
                                {data.map((col, j) => (
                                    <td key={j} className={`py-2 px-2 text-xs font-medium text-right whitespace-nowrap ${metric.key === 'pat' ? 'font-bold text-slate-900' : 'text-slate-600'
                                        }`}>
                                        {col[metric.key] !== undefined && col[metric.key] !== null ? col[metric.key] : '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* KPIs Table */}
            {financials.kpis && financials.kpis.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Key Performance Indicators</h3>
                    <div className="overflow-x-auto rounded-lg border border-slate-100">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">KPI</th>
                                    {financials.kpis.map((col, i) => (
                                        <th key={i} className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">
                                            {col.period}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {kpiMetrics.map((metric) => (
                                    <tr key={metric.key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                        <td className="py-3 px-4 text-sm font-bold text-slate-700 whitespace-nowrap">
                                            {metric.label}
                                        </td>
                                        {financials.kpis.map((col, j) => (
                                            <td key={j} className="py-3 px-4 text-sm font-medium text-slate-600 text-right whitespace-nowrap">
                                                {col[metric.key] !== undefined && col[metric.key] !== null ? col[metric.key] : '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
