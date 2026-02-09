export default function IPOCompanyInfo({ address, leadManagers, marketMaker, strengths, weaknesses }) {
    if (!address && (!leadManagers || leadManagers.length === 0) && (!strengths || strengths.length === 0)) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Company Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Contact & Managers */}
                <div className="flex flex-col gap-6">
                    {address && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Registered Address</h4>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{address}</p>
                        </div>
                    )}

                    {leadManagers && leadManagers.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Lead Managers</h4>
                            <ul className="text-sm text-slate-700 list-disc list-inside">
                                {leadManagers.map((lm, i) => (
                                    <li key={i}>{lm}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {marketMaker && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Market Maker</h4>
                            <p className="text-sm text-slate-700 font-medium">{marketMaker}</p>
                        </div>
                    )}
                </div>

                {/* Right: Strengths & Risks */}
                <div className="flex flex-col gap-6">
                    {strengths && strengths.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-green-600 uppercase mb-2">Company Strengths</h4>
                            <ul className="space-y-2">
                                {strengths.map((str, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>{str}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {weaknesses && weaknesses.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-red-500 uppercase mb-2">Key Risks</h4>
                            <ul className="space-y-2">
                                {weaknesses.map((weak, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                                        <span className="text-red-400 mt-0.5">⚠</span>
                                        <span>{weak}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
