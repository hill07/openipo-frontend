import { Coins } from 'lucide-react';

const IssueDetails = ({ data, onChange }) => {

    // Helper to update nested 'issueBreakdown' 
    const handleBreakdownChange = (section, field, value) => {
        const currentSection = data.issueBreakdown?.[section] || {};
        onChange('issueBreakdown', section, { ...currentSection, [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Coins size={20} /> Issue Details & Prices</h3>

            {/* Price & Lot */}
            <div className="bg-slate-950/30 p-6 rounded-xl border border-slate-800">
                <h4 className="text-white font-semibold mb-4">Price & Lot Size</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Min Price (₹)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                            value={data.priceBand?.min || ''}
                            onChange={e => onChange('priceBand', 'min', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Max Price (₹)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                            value={data.priceBand?.max || ''}
                            onChange={e => onChange('priceBand', 'max', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Lot Size</label>
                        <input
                            type="number"
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                            value={data.lotSize || ''}
                            onChange={e => onChange('root', 'lotSize', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Face Value (₹)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                            value={data.faceValue || ''}
                            onChange={e => onChange('root', 'faceValue', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Issue Breakdown */}
            <div className="bg-slate-950/30 p-6 rounded-xl border border-slate-800">
                <h4 className="text-white font-semibold mb-4">Issue Size Breakdown</h4>

                {/* Total */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                        <label className="block text-xs font-bold text-blue-400 uppercase mb-2 tracking-wide">Total Issue</label>
                        <div className="space-y-2">
                            <input placeholder="Amount (Cr)" type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" value={data.issueBreakdown?.total?.cr || ''} onChange={e => handleBreakdownChange('total', 'cr', e.target.value)} />
                            <input placeholder="Shares" type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" value={data.issueBreakdown?.total?.shares || ''} onChange={e => handleBreakdownChange('total', 'shares', e.target.value)} />
                        </div>
                    </div>

                    {/* Fresh */}
                    <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                        <label className="block text-xs font-bold text-emerald-400 uppercase mb-2 tracking-wide">Fresh Issue</label>
                        <div className="space-y-2">
                            <input placeholder="Amount (Cr)" type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" value={data.issueBreakdown?.fresh?.cr || ''} onChange={e => handleBreakdownChange('fresh', 'cr', e.target.value)} />
                            <input placeholder="Shares" type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" value={data.issueBreakdown?.fresh?.shares || ''} onChange={e => handleBreakdownChange('fresh', 'shares', e.target.value)} />
                        </div>
                    </div>

                    {/* OFS */}
                    <div className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/10">
                        <label className="block text-xs font-bold text-amber-400 uppercase mb-2 tracking-wide">Offer For Sale</label>
                        <div className="space-y-2">
                            <input placeholder="Amount (Cr)" type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" value={data.issueBreakdown?.ofs?.cr || ''} onChange={e => handleBreakdownChange('ofs', 'cr', e.target.value)} />
                            <input placeholder="Shares" type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" value={data.issueBreakdown?.ofs?.shares || ''} onChange={e => handleBreakdownChange('ofs', 'shares', e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Other Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Listing At</label>
                    <div className="flex flex-wrap gap-2">
                        {['NSE', 'BSE', 'NSE SME', 'BSE SME'].map(ex => (
                            <button
                                key={ex}
                                type="button"
                                onClick={() => {
                                    const current = data.exchanges || [];
                                    const exists = current.includes(ex);
                                    let newArr;
                                    if (exists) newArr = current.filter(X => X !== ex);
                                    else newArr = [...current, ex];
                                    onChange('root', 'exchanges', newArr);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${data.exchanges?.includes(ex)
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                                    }`}
                            >
                                {ex}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Min Investment (₹)</label>
                    <input
                        type="number"
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={data.minInvestment || ''}
                        onChange={e => onChange('root', 'minInvestment', e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Share Holding Pre Issue (%)</label>
                    <input
                        type="number"
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={data.shareHolding?.pre || ''}
                        onChange={e => onChange('shareHolding', 'pre', e.target.value)}
                        placeholder="e.g. 98.5"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Share Holding Post Issue (%)</label>
                    <input
                        type="number"
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={data.shareHolding?.post || ''}
                        onChange={e => onChange('shareHolding', 'post', e.target.value)}
                        placeholder="e.g. 72.5"
                    />
                </div>
            </div>

        </div>
    );
}

export default IssueDetails;
