import { Info } from 'lucide-react';

const BasicInfo = ({ data, onChange }) => {
    // Generic Handler for this section (Updates Root fields)
    const handleChange = (field, value) => {
        onChange('root', field, value);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Info size={20} /> Core Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



                {/* Slug */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">
                        Slug (URL)
                    </label>
                    <input
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={data.slug || ''}
                        onChange={e => handleChange('slug', e.target.value)}
                        placeholder="Auto-generated if empty"
                    />
                </div>

                {/* Logo URL */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">
                        Logo URL
                    </label>
                    <input
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={data.logo || ''}
                        onChange={e => handleChange('logo', e.target.value)}
                        placeholder="https://..."
                    />
                </div>

                {/* Company Name */}
                <div className="mb-4 col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide flex justify-between">
                        Company Name <span className="text-red-400 text-[10px]">*Required</span>
                    </label>
                    <input
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={data.companyName || ''}
                        onChange={e => handleChange('companyName', e.target.value)}
                        required
                        placeholder="e.g. Tata Technologies"
                    />
                </div>

                {/* Type & Issue Type */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Type</label>
                    <select
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-sm"
                        value={data.type || 'MAINBOARD'}
                        onChange={e => handleChange('type', e.target.value)}
                    >
                        <option value="MAINBOARD">Mainboard</option>
                        <option value="SME">SME</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Issue Type</label>
                    <select
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-sm"
                        value={data.issueType || 'IPO'}
                        onChange={e => handleChange('issueType', e.target.value)}
                    >
                        <option value="IPO">IPO</option>
                        <option value="FPO">FPO</option>
                    </select>
                </div>

                {/* Symbols */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">NSE Symbol</label>
                    <input
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={data.symbol?.nse || ''}
                        onChange={e => onChange('symbol', 'nse', e.target.value)}
                        placeholder="Please Enter NSE Symbol"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">BSE Symbol</label>
                    <input
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={data.symbol?.bse || ''}
                        onChange={e => onChange('symbol', 'bse', e.target.value)}
                        placeholder="Please Enter BSE Symbol"
                    />
                </div>

                {/* Status */}
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Status</label>
                    <select
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-sm"
                        value={data.status || 'UPCOMING'}
                        onChange={e => handleChange('status', e.target.value)}
                    >
                        <option value="UPCOMING">Upcoming</option>
                        <option value="OPEN">Open</option>
                        <option value="CLOSED">Closed</option>
                        <option value="ALLOTMENT">Allotment</option>
                        <option value="LISTED">Listed</option>
                    </select>
                </div>

                {/* Visibility */}
                <div className="flex flex-col gap-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Visibility</label>
                    <div className="flex items-center gap-3 h-[46px] px-4 bg-slate-900/50 border border-slate-700/50 rounded-lg">
                        <button type="button" onClick={() => handleChange('isPublished', !data.isPublished)} className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${data.isPublished ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${data.isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-sm font-bold ${data.isPublished ? 'text-emerald-400' : 'text-slate-500'}`}>{data.isPublished ? 'Published (Visible)' : 'Draft (Hidden)'}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BasicInfo;
