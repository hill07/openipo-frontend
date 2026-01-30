import { useState, useEffect } from 'react';
import { Users, Info } from 'lucide-react';

const SubscriptionInfo = ({ data, onChange }) => {
    // 1. Config
    const CATEGORIES_CONFIG = [
        { key: 'QIB', label: 'QIB', isDefault: true, hasAnchor: true },
        { key: 'HNI', label: 'HNI / NII', isDefault: true },
        { key: 'Retail', label: 'Retail', isDefault: true, smeLabel: 'Individual' },
        { key: 'Employee', label: 'Employee', isDefault: false },
        { key: 'Shareholder', label: 'Shareholder', isDefault: false },
        { key: 'Policyholder', label: 'Policyholder', isDefault: false },
        { key: 'MarketMaker', label: 'Market Maker', isDefault: false, smeDefault: true, isReservationOnly: true },
    ];

    const isSME = data.type === 'SME';

    // 2. Initialize Defaults
    useEffect(() => {
        const hasRes = data.reservations && data.reservations.length > 0;
        const hasSub = data.subscription?.categories && data.subscription.categories.length > 0;

        if (!hasRes && !hasSub) {
            const newReservations = [];
            const newCategories = [];

            CATEGORIES_CONFIG.forEach(c => {
                const shouldEnable = c.isDefault || (isSME && c.smeDefault);

                if (shouldEnable) {
                    newReservations.push({
                        enabled: true,
                        category: c.key,
                        sharesOffered: '',
                        anchorShares: ''
                    });

                    if (!c.isReservationOnly) {
                        newCategories.push({
                            enabled: true,
                            category: c.key,
                            sharesOffered: '',
                            appliedShares: ''
                        });
                    }
                }
            });

            onChange('root', 'reservations', newReservations);
            onChange('subscription', 'categories', newCategories);
        }
    }, [isSME]); // Re-run if type changes to apply sme defaults if empty

    // 3. Helper to get state
    const getCategoryState = (catKey) => {
        const res = data.reservations?.find(r => r.category === catKey) || {};
        const sub = data.subscription?.categories?.find(c => c.category === catKey) || {};

        // Enabled if present in either array (logic: if it's in the array, it's enabled/selected)
        const isEnabled = (!!data.reservations?.find(r => r.category === catKey)) ||
            (!!data.subscription?.categories?.find(c => c.category === catKey));

        return {
            enabled: isEnabled,
            sharesOffered: res.sharesOffered ?? sub.sharesOffered ?? '',
            appliedShares: sub.appliedShares ?? '',
            anchorShares: res.anchorShares ?? '',
            times: sub.times || ''
        };
    };

    // 4. Handle Changes
    const updateCategory = (catKey, field, value) => {
        const config = CATEGORIES_CONFIG.find(c => c.key === catKey);
        const newReservations = [...(data.reservations || [])];
        const newCategories = [...(data.subscription?.categories || [])];

        let resIndex = newReservations.findIndex(r => r.category === catKey);
        let subIndex = newCategories.findIndex(c => c.category === catKey);

        if (field === 'enabled') {
            const isEnabled = value;
            if (isEnabled) {
                // Add if missing
                if (resIndex === -1) {
                    newReservations.push({ enabled: true, category: catKey, sharesOffered: '', anchorShares: '' });
                }
                if (!config.isReservationOnly && subIndex === -1) {
                    newCategories.push({ enabled: true, category: catKey, sharesOffered: '', appliedShares: '' });
                }
            } else {
                // Remove if disabled
                if (resIndex !== -1) newReservations.splice(resIndex, 1);
                if (subIndex !== -1) newCategories.splice(subIndex, 1);
            }
        } else {
            // Update fields
            if (resIndex === -1) {
                // Should not happen if input is shown, but safe guard
                newReservations.push({ enabled: true, category: catKey, sharesOffered: '', anchorShares: '' });
                resIndex = newReservations.length - 1;
            }
            if (!config.isReservationOnly && subIndex === -1 && field !== 'anchorShares') {
                newCategories.push({ enabled: true, category: catKey, sharesOffered: '', appliedShares: '' });
                subIndex = newCategories.length - 1;
            }

            if (field === 'sharesOffered') {
                newReservations[resIndex].sharesOffered = value;
                if (!config.isReservationOnly && subIndex !== -1) {
                    newCategories[subIndex].sharesOffered = value;
                }
            } else if (field === 'appliedShares') {
                if (subIndex !== -1) newCategories[subIndex].appliedShares = value;
            } else if (field === 'anchorShares') {
                newReservations[resIndex].anchorShares = value;
            }
        }

        onChange('root', 'reservations', newReservations);
        onChange('subscription', 'categories', newCategories);
    };

    // 5. Daily Data (Preserved)
    const handleDayChange = (index, field, value) => {
        const newDays = [...(data.subscription?.days || [])];
        if (!newDays[index]) newDays[index] = {};
        newDays[index][field] = value;
        onChange('subscription', 'days', newDays);
    };
    const addDay = () => onChange('subscription', 'days', [...(data.subscription?.days || []), { day: `Day ${(data.subscription?.days?.length || 0) + 1}`, date: '', qib: '', retail: '', hni: '', total: '' }]);
    const removeDay = (index) => {
        const newDays = [...(data.subscription?.days || [])];
        newDays.splice(index, 1);
        onChange('subscription', 'days', newDays);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users size={20} /> Subscription & Reservations</h3>

            <div className="bg-slate-950/30 p-6 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-white font-semibold">Categories</h4>
                    <div className="text-xs text-slate-500 font-mono">
                        Total Shares: <span className="text-emerald-400">{data.issueBreakdown?.total?.shares || data.issueSize?.shares || 0}</span>
                        {' | '}
                        Total Applied: <span className="text-blue-400">{data.subscription?.totalApplied || 0}</span>
                        {' | '}
                        Total Times: <span className="text-amber-400">{data.subscription?.totalTimes || 0}x</span>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <div className="col-span-3">Category</div>
                        <div className="col-span-3">Shares Offered</div>
                        <div className="col-span-1 text-center"></div>
                        <div className="col-span-3">Applied (Bids)</div>
                        <div className="col-span-1 text-center">x</div>
                        <div className="col-span-1"></div>
                    </div>

                    {CATEGORIES_CONFIG.map(cat => {
                        const { enabled, sharesOffered, appliedShares, anchorShares, times } = getCategoryState(cat.key);
                        const label = (isSME && cat.smeLabel) ? cat.smeLabel : cat.label;

                        return (
                            <div key={cat.key} className={`rounded-xl border transition-all duration-200 ${enabled ? 'bg-slate-900/80 border-slate-700 shadow-sm' : 'bg-slate-950/30 border-slate-800/30 opacity-60'}`}>
                                <div className="p-3 grid grid-cols-12 gap-4 items-start">
                                    {/* Checkbox & Name */}
                                    <div className="col-span-3 flex items-center gap-3 pt-2">
                                        <input
                                            type="checkbox"
                                            checked={enabled}
                                            onChange={(e) => updateCategory(cat.key, 'enabled', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                                        />
                                        <span className={`text-sm font-bold ${enabled ? 'text-white' : 'text-slate-500'}`}>{label}</span>
                                    </div>

                                    {enabled && (
                                        <>
                                            {/* Shares Offered */}
                                            <div className="col-span-3 space-y-2">
                                                <input
                                                    type="number"
                                                    placeholder="Offered"
                                                    value={sharesOffered}
                                                    onChange={e => updateCategory(cat.key, 'sharesOffered', e.target.value)}
                                                    className="w-full bg-slate-950 border border-slate-700/50 rounded px-3 py-2 text-slate-300 text-sm font-mono focus:border-blue-500/50"
                                                />
                                                {cat.hasAnchor && (
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            placeholder="Anchor Shares"
                                                            value={anchorShares}
                                                            onChange={e => updateCategory(cat.key, 'anchorShares', e.target.value)}
                                                            className="w-full bg-slate-950/50 border border-slate-800 rounded px-3 py-1.5 text-slate-400 text-xs font-mono focus:border-amber-500/30"
                                                        />
                                                        <div className="absolute right-2 top-1.5 text-[10px] text-amber-500/50 font-bold uppercase pointer-events-none">Anchor</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Spacer */}
                                            <div className="col-span-1"></div>

                                            {/* Applied */}
                                            <div className="col-span-3">
                                                {!cat.isReservationOnly && (
                                                    <input
                                                        type="number"
                                                        placeholder="Applied"
                                                        value={appliedShares}
                                                        onChange={e => updateCategory(cat.key, 'appliedShares', e.target.value)}
                                                        className="w-full bg-slate-900 border border-slate-700/50 rounded px-3 py-2 text-white text-sm font-mono focus:border-emerald-500/50"
                                                    />
                                                )}
                                                {cat.isReservationOnly && (
                                                    <div className="text-xs text-slate-600 italic py-2">Not Subscribable</div>
                                                )}
                                            </div>

                                            {/* Times */}
                                            <div className="col-span-1 flex items-center justify-center pt-2">
                                                {!cat.isReservationOnly && (
                                                    <span className={`text-sm font-bold ${Number(times) > 1 ? 'text-emerald-400' : 'text-slate-500'}`}>{times}x</span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Daily Data Section */}
            <div className="bg-slate-950/30 p-6 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-semibold">Daily Subscription Status</h4>
                    <button type="button" onClick={addDay} className="text-blue-400 text-xs font-bold border border-blue-500/30 rounded px-2 py-1 hover:bg-blue-500/10">+ Add Day</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
                                <th className="p-2">Day</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">QIB</th>
                                <th className="p-2">Retail</th>
                                <th className="p-2">HNI</th>
                                <th className="p-2">Total</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300">
                            {(data.subscription?.days || []).map((day, idx) => (
                                <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-900/50">
                                    <td className="p-2"><input value={day.day || ''} onChange={e => handleDayChange(idx, 'day', e.target.value)} className="w-16 bg-transparent border-b border-dashed border-slate-700 focus:border-blue-500 outline-hidden" /></td>
                                    <td className="p-2"><input type="date" value={day.date ? new Date(day.date).toISOString().split('T')[0] : ''} onChange={e => handleDayChange(idx, 'date', e.target.value)} className="bg-transparent text-xs" /></td>
                                    <td className="p-2"><input type="number" step="0.01" value={day.qib || ''} onChange={e => handleDayChange(idx, 'qib', e.target.value)} className="w-20 bg-transparent border-b border-dashed border-slate-700 text-center" /></td>
                                    <td className="p-2"><input type="number" step="0.01" value={day.retail || ''} onChange={e => handleDayChange(idx, 'retail', e.target.value)} className="w-20 bg-transparent border-b border-dashed border-slate-700 text-center" /></td>
                                    <td className="p-2"><input type="number" step="0.01" value={day.hni || ''} onChange={e => handleDayChange(idx, 'hni', e.target.value)} className="w-20 bg-transparent border-b border-dashed border-slate-700 text-center" /></td>
                                    <td className="p-2"><input type="number" step="0.01" value={day.total || ''} onChange={e => handleDayChange(idx, 'total', e.target.value)} className="w-20 bg-transparent border-b border-dashed border-slate-700 text-center font-bold text-white" /></td>
                                    <td className="p-2"><button type="button" onClick={() => removeDay(idx)} className="text-red-400 hover:text-red-300">×</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionInfo;
