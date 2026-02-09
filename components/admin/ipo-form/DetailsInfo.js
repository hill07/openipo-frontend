import { FileText, PlusCircle, Trash2, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

const DetailsInfo = ({ data, onChange }) => {

    const handleArrayChange = (arrayName, index, field, value) => {
        // For objects array (Reviewers)
        const newArray = [...(data[arrayName] || [])];
        if (!newArray[index]) newArray[index] = {};
        newArray[index][field] = value;
        onChange('root', arrayName, newArray);
    };

    const handleStringArrayChange = (arrayName, index, value) => {
        // For string array (Promoters, Strengths, Weaknesses, Objectives)
        const newArray = [...(data[arrayName] || [])];
        newArray[index] = value;
        onChange('root', arrayName, newArray);
    };

    const addArrayItem = (arrayName, template) => {
        onChange('root', arrayName, [...(data[arrayName] || []), template]);
    };

    const removeArrayItem = (arrayName, index) => {
        const newArray = [...(data[arrayName] || [])];
        newArray.splice(index, 1);
        onChange('root', arrayName, newArray);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText size={20} /> Details, Docs & Review</h3>

            {/* About & Address */}
            {/* About & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">About Company</label>
                    <textarea
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        rows={4}
                        value={data.description || ''}
                        onChange={e => onChange('root', 'description', e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Registered Address</label>
                    <textarea
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        rows={4}
                        value={data.address || ''}
                        onChange={e => onChange('root', 'address', e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Registrar Info</label>
                    <textarea
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        rows={4}
                        value={data.registrar || ''}
                        onChange={e => onChange('root', 'registrar', e.target.value)}
                        placeholder="Name, Address, Email, Phone..."
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Lead Managers</label>
                    <div className="space-y-2">
                        {(data.leadManagers || []).map((manager, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" value={manager} onChange={e => handleStringArrayChange('leadManagers', idx, e.target.value)} />
                                <button type="button" onClick={() => removeArrayItem('leadManagers', idx)} className="text-red-400 p-2"><Trash2 size={14} /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('leadManagers', '')} className="text-blue-400 text-xs font-bold flex items-center gap-1"><PlusCircle size={14} /> Add Lead Manager</button>
                    </div>
                </div>
            </div>

            {/* Docs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/30 p-6 rounded-xl border border-slate-800">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">DRHP Link</label>
                    <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" value={data.docs?.drhp || ''} onChange={e => onChange('docs', 'drhp', e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">RHP Link</label>
                    <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" value={data.docs?.rhp || ''} onChange={e => onChange('docs', 'rhp', e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Anchor Link</label>
                    <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" value={data.docs?.anchor || ''} onChange={e => onChange('docs', 'anchor', e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Basis of Allotment</label>
                    <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm" value={data.docs?.boa || ''} onChange={e => onChange('docs', 'boa', e.target.value)} />
                </div>
            </div>

            {/* Allotment Status */}
            <div className="bg-slate-950/30 p-6 rounded-xl border border-slate-800 mt-6">
                <h4 className="text-white font-semibold mb-4">Allotment Check</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Allotment Link</label>
                        <input
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                            value={data.allotment?.allotmentLink || ''}
                            onChange={e => onChange('allotment', 'allotmentLink', e.target.value)}
                            onBlur={e => {
                                let val = e.target.value.trim();
                                if (val && !val.startsWith('http')) {
                                    val = 'https://' + val;
                                    onChange('allotment', 'allotmentLink', val);
                                }
                            }}
                            placeholder="https://..."
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Allotment Declared?</label>
                        <div className="flex items-center h-10">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
                                checked={!!data.allotment?.isAllotted}
                                onChange={e => onChange('allotment', 'isAllotted', e.target.checked)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Objectives */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-semibold flex items-center gap-2">Objectives</h4>
                        <button type="button" onClick={() => addArrayItem('objectives', '')} className="text-blue-400 text-xs font-bold"><PlusCircle size={14} /></button>
                    </div>
                    <div className="space-y-2">
                        {(data.objectives || []).map((s, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" value={s} onChange={e => handleStringArrayChange('objectives', idx, e.target.value)} placeholder="Objective..." />
                                <button type="button" onClick={() => removeArrayItem('objectives', idx)} className="text-red-400 p-2"><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-semibold flex items-center gap-2"><ThumbsUp size={16} className="text-emerald-400" /> Strengths</h4>
                        <button type="button" onClick={() => addArrayItem('strengths', '')} className="text-blue-400 text-xs font-bold"><PlusCircle size={14} /></button>
                    </div>
                    <div className="space-y-2">
                        {(data.strengths || []).map((s, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" value={s} onChange={e => handleStringArrayChange('strengths', idx, e.target.value)} />
                                <button type="button" onClick={() => removeArrayItem('strengths', idx)} className="text-red-400 p-2"><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-semibold flex items-center gap-2"><ThumbsDown size={16} className="text-red-400" /> Weaknesses</h4>
                        <button type="button" onClick={() => addArrayItem('weaknesses', '')} className="text-blue-400 text-xs font-bold"><PlusCircle size={14} /></button>
                    </div>
                    <div className="space-y-2">
                        {(data.weaknesses || []).map((s, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" value={s} onChange={e => handleStringArrayChange('weaknesses', idx, e.target.value)} />
                                <button type="button" onClick={() => removeArrayItem('weaknesses', idx)} className="text-red-400 p-2"><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Promoters */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-semibold">Promoters</h4>
                    <button type="button" onClick={() => addArrayItem('promoters', '')} className="text-blue-400 text-xs font-bold"><PlusCircle size={14} /></button>
                </div>
                <div className="space-y-2">
                    {(data.promoters || []).map((promoter, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" value={promoter} onChange={e => handleStringArrayChange('promoters', idx, e.target.value)} />
                            <button type="button" onClick={() => removeArrayItem('promoters', idx)} className="text-red-400 p-2"><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default DetailsInfo;
