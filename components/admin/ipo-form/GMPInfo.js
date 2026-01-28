import { TrendingUp, PlusCircle, Trash2 } from 'lucide-react';

const GMPInfo = ({ data, onChange }) => {

    const handleArrayChange = (arrayName, index, field, value) => {
        const newArray = [...(data.gmp?.[arrayName] || [])];
        if (!newArray[index]) newArray[index] = {};
        newArray[index][field] = value;
        onChange('gmp', arrayName, newArray);
    };

    const addArrayItem = (arrayName, template = {}) => {
        onChange('gmp', arrayName, [...(data.gmp?.[arrayName] || []), template]);
    };

    const removeArrayItem = (arrayName, index) => {
        const newArray = [...(data.gmp?.[arrayName] || [])];
        newArray.splice(index, 1);
        onChange('gmp', arrayName, newArray);
    };

    const handleFieldChange = (field, value) => {
        onChange('gmp', field, value);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={20} /> Grey Market Premium</h3>

            <div className="mb-6 bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Current GMP (₹)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                            value={data.gmp?.current || ''}
                            onChange={e => handleFieldChange('current', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Trend</label>
                        <select
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-sm"
                            value={data.gmp?.trend || ''}
                            onChange={e => handleFieldChange('trend', e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            <option value="BULLISH">Bullish 📈</option>
                            <option value="NEUTRAL">Neutral ➖</option>
                            <option value="BEARISH">Bearish 📉</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Last Updated Text</label>
                        <input
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                            value={data.gmp?.lastUpdatedAtText || ''}
                            onChange={e => handleFieldChange('lastUpdatedAtText', e.target.value)}
                            placeholder="e.g. 2 hours ago"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Source</label>
                        <input
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                            value={data.gmp?.source || ''}
                            onChange={e => handleFieldChange('source', e.target.value)}
                            placeholder="Source Name"
                        />
                    </div>
                </div>

                {/* Derived GMP Stats */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">GMP Percentage</div>
                        <div className={`text-lg font-mono font-bold ${data.gmp?.percent > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {data.gmp?.percent ? `${data.gmp.percent}%` : '--'}
                        </div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Est. Listing Price</div>
                        <div className="text-lg font-mono font-bold text-blue-400">
                            {data.gmp?.estListingPrice ? `₹${data.gmp.estListingPrice}` : '--'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-semibold">GMP History</h4>
                <button type="button" onClick={() => addArrayItem('history', { date: '', gmp: '' })} className="flex items-center gap-2 text-blue-400 text-sm font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20">
                    <PlusCircle size={14} /> Add Entry
                </button>
            </div>
            <div className="space-y-2">
                {data.gmp?.history?.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-slate-950/30 p-3 rounded-lg border border-slate-800">
                        <input type="date" value={item.date || ''} onChange={e => handleArrayChange('history', idx, 'date', e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" />
                        <input type="number" placeholder="GMP" value={item.gmp || ''} onChange={e => handleArrayChange('history', idx, 'gmp', e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm font-bold text-emerald-400" />
                        <button type="button" onClick={() => removeArrayItem('history', idx)} className="text-red-400 hover:bg-red-500/10 p-2 rounded"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default GMPInfo;
