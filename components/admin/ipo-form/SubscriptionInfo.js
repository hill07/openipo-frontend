import { Users, PlusCircle, Trash2 } from 'lucide-react';

const SubscriptionInfo = ({ data, onChange }) => {

    // Fixed Categories List
    const FIXED_CATEGORIES = [
        "QIB",
        "NII (HNI)",
        "NII (Small HNI)",
        "NII (Big HNI)",
        "Retail",
        "Employee",
        "Total"
    ];

    // Helper to check if category exists in data
    const getCategoryData = (name) => {
        return data.subscription?.categories?.find(c => c.name === name) || null;
    };

    // Toggle/Update Category
    const handleCategoryChange = (name, field, value) => {
        let currentCategories = [...(data.subscription?.categories || [])];
        const index = currentCategories.findIndex(c => c.name === name);

        let newData = {};

        if (index >= 0) {
            // Update existing
            newData = { ...currentCategories[index], [field]: value };

            // Auto-calculate Times if Bid/Offered changed
            // REMOVED AUTOMATION AS REQUESTED
            /*
            if (field === 'sharesBid' || field === 'sharesOffered') {
                const offered = field === 'sharesOffered' ? Number(value) : Number(newData.sharesOffered || 0);
                const bid = field === 'sharesBid' ? Number(value) : Number(newData.sharesBid || 0);
                if (offered > 0 && bid > 0) {
                    newData.subscriptionTimes = (bid / offered).toFixed(2);
                }
            }
            */


            currentCategories[index] = newData;
        } else {
            // Init new
            newData = { name, subscriptionTimes: '', sharesBid: '', sharesOffered: '', [field]: value };
            // REMOVED AUTOMATION AS REQUESTED
            /*
            if (field === 'sharesBid' || field === 'sharesOffered') {
                const offered = field === 'sharesOffered' ? Number(value) : 0;
                const bid = field === 'sharesBid' ? Number(value) : 0;
                if (offered > 0 && bid > 0) {
                    newData.subscriptionTimes = (bid / offered).toFixed(2);
                }
            }
            */
            currentCategories.push(newData);
        }
        onChange('subscription', 'categories', currentCategories);
    };

    const toggleCategory = (name) => {
        let currentCategories = [...(data.subscription?.categories || [])];
        const index = currentCategories.findIndex(c => c.name === name);

        if (index >= 0) {
            currentCategories.splice(index, 1);
        } else {
            // Check if we have reservation data to pre-fill?
            const resMatch = data.reservations?.find(r => r.name?.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(r.name?.toLowerCase()));

            currentCategories.push({
                name,
                subscriptionTimes: '',
                sharesBid: '',
                sharesOffered: resMatch ? resMatch.sharesOffered : ''
            });
        }
        onChange('subscription', 'categories', currentCategories);
    };

    // Reservations
    const handleReservationChange = (index, field, value) => {
        const newArr = [...(data.reservations || [])];
        if (!newArr[index]) newArr[index] = {};

        // Update field
        newArr[index][field] = value;

        // Auto-Calc Logic - REMOVED AS REQUESTED
        /*
        const totalShares = Number(data.issueBreakdown?.total?.shares || 0);

        if (totalShares > 0) {
            if (field === 'sharesOffered') {
                // Calc %
                const shares = Number(value);
                if (!isNaN(shares)) {
                    newArr[index].percentage = ((shares / totalShares) * 100).toFixed(2) + '%';
                }
            } else if (field === 'percentage') {
                // Calc Shares
                // Remove % sign if present
                const pctVal = parseFloat(value.replace('%', ''));
                if (!isNaN(pctVal)) {
                    newArr[index].sharesOffered = Math.round((pctVal / 100) * totalShares);
                }
            }
        }
        */

        // Sync with Subscription if name matches known categories - REMOVED AS REQUESTED
        /*
        const resName = newArr[index].name;
        if (resName && (field === 'sharesOffered' || field === 'percentage')) {
            // Find subscription category with similar name
            // Simple mapping: 'QIB' -> 'QIB'
            // 'Retail' -> 'Retail'
            // 'Employee' -> 'Employee'
            const shares = newArr[index].sharesOffered;

            // Try to find exact or partial match in FIXED_CATEGORIES
            const matchCat = FIXED_CATEGORIES.find(c =>
                c.toLowerCase() === resName.toLowerCase() ||
                (resName.toLowerCase().includes('retail') && c === 'Retail') ||
                (resName.toLowerCase().includes('qib') && c === 'QIB') ||
                (resName.toLowerCase().includes('employee') && c === 'Employee')
            );

            if (matchCat) {
                // Update subscription category safely
                updateSubscriptionOffer(matchCat, shares);
            }
        }
        */

        onChange('root', 'reservations', newArr);
    };

    const updateSubscriptionOffer = (catName, shares) => {
        // We need to call the parent onChange, but we can't easily chain it inside generic handler without referencing fresh state.
        // Actually we have `data` prop which is fresh on render, but might be stale inside closure if not careful.
        // However, here we are inside render cycle functions.
        // We need to update `subscription.categories`
        let cats = [...(data.subscription?.categories || [])];
        const idx = cats.findIndex(c => c.name === catName);

        if (idx >= 0) {
            cats[idx] = { ...cats[idx], sharesOffered: shares };
            // Recalc times
            if (cats[idx].sharesBid && shares > 0) {
                cats[idx].subscriptionTimes = (Number(cats[idx].sharesBid) / Number(shares)).toFixed(2);
            }
        } else {
            // Maybe don't auto-add if not enabled? Or auto-add? 
            // Let's auto-add if we are robust. 
            // For now, only update if exists to avoid UI clutter of unwanted cats.
            // Or better: If user adds reservation 'Retail', they probably want 'Retail' subscription tracking.
            cats.push({ name: catName, sharesOffered: shares, sharesBid: '', subscriptionTimes: '' });
        }

        // Tricky: we are calling onChange for 'reservations' AND 'subscription'. 
        // If we call onChange twice in quick succession, React batching might work, or one might overwrite other if `data` is stale.
        // `onChange` implementation in `IPOForm` uses `setFormData(prev => ...)` so it is safe for concurrent updates if `section` is different.
        // YES, `onChange` uses functional state update.
        onChange('subscription', 'categories', cats);
    };

    const addReservation = () => {
        onChange('root', 'reservations', [...(data.reservations || []), { name: '', sharesOffered: '', percentage: '' }]);
    };

    const removeReservation = (index) => {
        const newArr = [...(data.reservations || [])];
        newArr.splice(index, 1);
        onChange('root', 'reservations', newArr);
    };

    // --- Lot Distribution (Basis of Allotment) ---
    const addLotDistribution = () => {
        onChange('root', 'lotDistribution', [...(data.lotDistribution || []), { category: '', lots: '', shares: '', amount: '', reserved: '' }]);
    };

    const removeLotDistribution = (index) => {
        const newArr = [...(data.lotDistribution || [])];
        newArr.splice(index, 1);
        onChange('root', 'lotDistribution', newArr);
    };

    const handleLotDistChange = (index, field, value) => {
        const newArr = [...(data.lotDistribution || [])];
        if (!newArr[index]) newArr[index] = {};
        newArr[index][field] = value;
        onChange('root', 'lotDistribution', newArr);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users size={20} /> Subscription & Reservations</h3>

            {/* Reservations Table (Moved Up as Source of Truth) */}
            <div className="bg-slate-950/30 p-6 rounded-xl border border-slate-800 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">Reservations <span className="text-slate-500 text-xs font-normal">(Auto-calcs % based on Total Issue)</span></h4>
                    <button type="button" onClick={addReservation} className="flex items-center gap-2 text-blue-400 text-sm font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20">
                        <PlusCircle size={14} /> Add Category
                    </button>
                </div>
                <div className="space-y-2">
                    <div className="flex gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-1">
                        <span className="flex-1">Category</span>
                        <span className="flex-1">Shares Offered</span>
                        <span className="w-24">% of Issue</span>
                        <span className="w-8"></span>
                    </div>
                    {data.reservations?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                            <input placeholder="Name (e.g. Retail)" value={item.name || ''} onChange={e => handleReservationChange(idx, 'name', e.target.value)} className="flex-1 bg-slate-950 border border-slate-700/50 rounded px-3 py-2 text-white text-sm" />
                            <input type="number" placeholder="Shares" value={item.sharesOffered || ''} onChange={e => handleReservationChange(idx, 'sharesOffered', e.target.value)} className="flex-1 bg-slate-950 border border-slate-700/50 rounded px-3 py-2 text-white text-sm font-mono" />
                            <input placeholder="%" value={item.percentage || ''} onChange={e => handleReservationChange(idx, 'percentage', e.target.value)} className="w-24 bg-slate-950 border border-slate-700/50 rounded px-3 py-2 text-white text-sm text-right" />
                            <button type="button" onClick={() => removeReservation(idx)} className="text-slate-500 hover:text-red-400 p-2 rounded transition-colors"><Trash2 size={16} /></button>
                        </div>
                    ))}
                    {(!data.reservations || data.reservations.length === 0) && (
                        <div className="text-center text-slate-600 text-xs py-4 italic">No reservation categories added yet.</div>
                    )}
                </div>
            </div>

            {/* Subscription Grid */}
            <div className="bg-slate-950/30 p-6 rounded-xl border border-slate-800">
                <h4 className="text-white font-semibold mb-6">Live Subscription Tracking</h4>

                <div className="space-y-1">
                    {/* Header */}
                    <div className="flex items-center gap-4 px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <div className="w-40">Category</div>
                        <div className="flex-1 grid grid-cols-3 gap-2">
                            <span>Offered</span>
                            <span>Applied (Bid)</span>
                            <span>Times (x)</span>
                        </div>
                    </div>

                    {FIXED_CATEGORIES.map(cat => {
                        const catData = getCategoryData(cat);
                        const isEnabled = !!catData;

                        return (
                            <div key={cat} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${isEnabled ? 'bg-slate-900/80 border-slate-700 shadow-sm' : 'bg-slate-950/30 border-slate-800/30 opacity-60 grayscale'}`}>
                                <div className="flex items-center gap-3 w-40">
                                    <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={() => toggleCategory(cat)}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                                    />
                                    <span className={`text-sm font-bold ${isEnabled ? 'text-white' : 'text-slate-500'}`}>{cat}</span>
                                </div>
                                <div className="flex-1 grid grid-cols-3 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Offered"
                                        disabled={!isEnabled}
                                        value={catData?.sharesOffered || ''}
                                        onChange={e => handleCategoryChange(cat, 'sharesOffered', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700/50 rounded px-3 py-2 text-slate-300 text-sm font-mono disabled:opacity-30"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Bids"
                                        disabled={!isEnabled}
                                        value={catData?.sharesBid || ''}
                                        onChange={e => handleCategoryChange(cat, 'sharesBid', e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700/50 rounded px-3 py-2 text-white text-sm font-mono disabled:opacity-30 focus:border-blue-500/50 transition-colors"
                                    />
                                    <input
                                        type="number"
                                        placeholder="x"
                                        disabled={false} // Manually editable now
                                        value={catData?.subscriptionTimes || ''}
                                        onChange={e => handleCategoryChange(cat, 'subscriptionTimes', e.target.value)}
                                        className="w-full bg-slate-950/50 border border-transparent rounded px-3 py-2 text-emerald-400 font-bold text-sm text-center"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Daily Subscription Data */}
            <div className="bg-slate-950/30 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-white font-semibold flex items-center gap-2">Daily Subscription Status</h4>
                    <button type="button" onClick={() => {
                        const current = data.subscription?.days || [];
                        onChange('subscription', 'days', [...current, { day: `Day ${current.length + 1}`, date: '', qib: '', retail: '', hni: '', shni: '', bhni: '', total: '' }]);
                    }} className="flex items-center gap-2 text-blue-400 text-sm font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20">
                        <PlusCircle size={14} /> Add Day
                    </button>
                </div>

                <div className="overflow-x-auto min-h-[150px]">
                    <div className="min-w-[800px] space-y-2">
                        <div className="flex gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">
                            <span className="w-20">Day</span>
                            <span className="w-32">Date</span>
                            <span className="flex-1 text-center">QIB</span>
                            <span className="flex-1 text-center">Retail</span>
                            <span className="flex-1 text-center">HNI</span>
                            <span className="flex-1 text-center">SHNI</span>
                            <span className="flex-1 text-center">BHNI</span>
                            <span className="flex-1 text-center">Total</span>
                            <span className="w-8"></span>
                        </div>
                        {(data.subscription?.days || []).map((day, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                                <input className="w-20 bg-slate-950 border border-slate-700/50 rounded px-2 py-1 text-white text-xs" value={day.day || ''} onChange={e => {
                                    const newDays = [...(data.subscription?.days || [])];
                                    newDays[idx].day = e.target.value;
                                    onChange('subscription', 'days', newDays);
                                }} placeholder="Day X" />

                                <input type="date" className="w-32 bg-slate-950 border border-slate-700/50 rounded px-2 py-1 text-white text-xs" value={day.date ? new Date(day.date).toISOString().split('T')[0] : ''} onChange={e => {
                                    const newDays = [...(data.subscription?.days || [])];
                                    newDays[idx].date = e.target.value;
                                    onChange('subscription', 'days', newDays);
                                }} />

                                {['qib', 'retail', 'hni', 'shni', 'bhni', 'total'].map(k => (
                                    <input key={k} type="number" step="0.01" className="flex-1 min-w-[60px] bg-slate-950 border border-slate-700/50 rounded px-2 py-1 text-white text-xs text-center" placeholder={k.toUpperCase()} value={day[k] || ''} onChange={e => {
                                        const newDays = [...(data.subscription?.days || [])];
                                        newDays[idx][k] = e.target.value;
                                        onChange('subscription', 'days', newDays);
                                    }} />
                                ))}

                                <button type="button" onClick={() => {
                                    const newDays = [...(data.subscription?.days || [])];
                                    newDays.splice(idx, 1);
                                    onChange('subscription', 'days', newDays);
                                }} className="text-slate-500 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                            </div>
                        ))}
                        {(!data.subscription?.days || data.subscription.days.length === 0) && (
                            <div className="text-center text-slate-600 text-xs py-8 italic">No daily data added.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Basis of Allotment (Lot Distribution) */}
            <div className="bg-slate-950/30 p-6 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">Basis of Allotment <span className="text-slate-500 text-xs font-normal">(Post-Listing Data)</span></h4>
                    <button type="button" onClick={addLotDistribution} className="flex items-center gap-2 text-blue-400 text-sm font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20">
                        <PlusCircle size={14} /> Add Row
                    </button>
                </div>
                <div className="space-y-2">
                    <div className="flex gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-1">
                        <span className="flex-1">Category</span>
                        <span className="w-24 text-center">Lots</span>
                        <span className="w-24 text-center">Shares</span>
                        <span className="w-32 text-right">Amount (₹)</span>
                        <span className="w-24 text-right">Ratio/Res</span>
                        <span className="w-8"></span>
                    </div>
                    {data.lotDistribution?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                            <input
                                placeholder="Category (e.g. Retail)"
                                value={item.category || ''}
                                onChange={e => handleLotDistChange(idx, 'category', e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-700/50 rounded px-3 py-2 text-white text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Lots"
                                value={item.lots || ''}
                                onChange={e => handleLotDistChange(idx, 'lots', e.target.value)}
                                className="w-24 bg-slate-950 border border-slate-700/50 rounded px-3 py-2 text-white text-center text-sm font-mono"
                            />
                            <input
                                type="number"
                                placeholder="Shares"
                                value={item.shares || ''}
                                onChange={e => handleLotDistChange(idx, 'shares', e.target.value)}
                                className="w-24 bg-slate-950 border border-slate-700/50 rounded px-3 py-2 text-white text-center text-sm font-mono"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={item.amount || ''}
                                onChange={e => handleLotDistChange(idx, 'amount', e.target.value)}
                                className="w-32 bg-slate-950 border border-slate-700/50 rounded px-3 py-2 text-white text-right text-sm font-mono"
                            />
                            <input
                                placeholder="Ratio"
                                value={item.reserved || ''}
                                onChange={e => handleLotDistChange(idx, 'reserved', e.target.value)}
                                className="w-24 bg-slate-950 border border-slate-700/50 rounded px-3 py-2 text-white text-right text-sm"
                            />
                            <button type="button" onClick={() => removeLotDistribution(idx)} className="text-slate-500 hover:text-red-400 p-2 rounded transition-colors"><Trash2 size={16} /></button>
                        </div>
                    ))}
                    {(!data.lotDistribution || data.lotDistribution.length === 0) && (
                        <div className="text-center text-slate-600 text-xs py-4 italic">No basis of allotment data added.</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default SubscriptionInfo;
