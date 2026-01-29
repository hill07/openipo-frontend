export default function IPOPeers({ peers }) {
    if (!peers || peers.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Peer Comparison</h3>
            <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Company</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">CMP (₹)</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">P/E Ratio</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right whitespace-nowrap">ROE (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peers.map((peer, i) => (
                            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                <td className="py-3 px-4 text-sm font-bold text-slate-700">{peer.name}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{peer.cmp ? peer.cmp.toLocaleString('en-IN') : '-'}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{peer.pe || '-'}</td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-600 text-right">{peer.roe || '-'}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
