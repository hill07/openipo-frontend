import { useEffect, useState } from 'react';
import { TrendingUp, PlusCircle, Trash2 } from 'lucide-react';

const FinancialsInfo = ({ data, onChange, type }) => {

    const ROW_LABELS = {
        assets: "Assets",
        totalIncome: "Total Income",
        pat: "Profit After Tax",
        ebitda: "EBITDA",
        netWorth: "NET Worth",
        reservesSurplus: "Reserves and Surplus",
        totalBorrowing: "Total Borrowing"
    };

    const ROWS_ORDER = ['assets', 'totalIncome', 'pat', 'ebitda', 'netWorth', 'reservesSurplus', 'totalBorrowing'];

    const KPI_LABELS = {
        sme: {
            roe: 'ROE (%)',
            roce: 'ROCE (%)',
            eps: 'EPS (₹)',
            pePre: 'P/E (Pre)',
            pePost: 'P/E (Post)'
        },
        mainboard: {
            ronw: 'RoNW (%)',
            eps: 'EPS (₹)',
            pePre: 'P/E (Pre)',
            pePost: 'P/E (Post)'
        }
    };

    const getKpiKeys = (type) => {
        return type === 'SME' ? Object.keys(KPI_LABELS.sme) : Object.keys(KPI_LABELS.mainboard);
    };

    const getKpiLabel = (type, key) => {
        return type === 'SME' ? KPI_LABELS.sme[key] : KPI_LABELS.mainboard[key] || KPI_LABELS.mainboard[key] || key;
    };

    const handleTableChange = (index, field, value) => {
        const newTable = [...(data.financials?.table || [])];
        if (!newTable[index]) newTable[index] = {};

        newTable[index][field] = value;
        onChange('financials', 'table', newTable);
    };

    const addPeriod = () => {
        const template = { period: '', assets: '', revenue: '', pat: '', ebitda: '', netWorth: '', reserves: '', debt: '' };
        onChange('financials', 'table', [...(data.financials?.table || []), template]);
    };

    const removePeriod = (index) => {
        const newTable = [...(data.financials?.table || [])];
        newTable.splice(index, 1);
        onChange('financials', 'table', newTable);
    };

    // --- KPI Handlers ---
    const addKpiPeriod = () => {
        const newKpis = [...(data.financials?.kpis || [])];
        const kpiKeys = getKpiKeys(type); // Dynamically get KPI keys based on 'type' prop
        const newItem = { period: 'New Period' };
        kpiKeys.forEach(key => {
            newItem[key] = ''; // Initialize all relevant KPI keys to empty strings
        });
        newKpis.push(newItem);
        onChange('financials', 'kpis', newKpis);
    };

    const removeKpiPeriod = (index) => {
        const newKpis = [...(data.financials?.kpis || [])];
        newKpis.splice(index, 1);
        onChange('financials', 'kpis', newKpis);
    };

    const updateKpiPeriod = (index, value) => {
        const newKpis = [...(data.financials?.kpis || [])];
        if (!newKpis[index]) return;
        newKpis[index].period = value;
        onChange('financials', 'kpis', newKpis);
    };

    const updateKpiValue = (index, key, value) => {
        const newKpis = [...(data.financials?.kpis || [])];
        if (!newKpis[index]) return;
        newKpis[index][key] = value;
        onChange('financials', 'kpis', newKpis);
    };

    const getKpiValue = (index, key) => {
        return data.financials?.kpis?.[index]?.[key] || '';
    };

    // --- General Array Handlers (Used for Peers) ---
    // If arrayName is 'peers', we manipulate it at ROOT level via onChange('root', 'peers', ...)
    // Otherwise we assume it's in financials.

    const handleArrayChange = (arrayName, index, field, value) => {
        if (arrayName === 'peers') {
            const newArray = [...(data.peers || [])];
            if (!newArray[index]) newArray[index] = {};
            newArray[index][field] = value;
            onChange('root', 'peers', newArray);
        } else {
            const newArray = [...(data.financials?.[arrayName] || [])];
            if (!newArray[index]) newArray[index] = {};
            newArray[index][field] = value;
            onChange('financials', arrayName, newArray);
        }
    };

    const addArrayItem = (arrayName, template) => {
        if (arrayName === 'peers') {
            onChange('root', 'peers', [...(data.peers || []), template]);
        } else {
            onChange('financials', arrayName, [...(data.financials?.[arrayName] || []), template]);
        }
    };

    const removeArrayItem = (arrayName, index) => {
        if (arrayName === 'peers') {
            const newArray = [...(data.peers || [])];
            newArray.splice(index, 1);
            onChange('root', 'peers', newArray);
        } else {
            const newArray = [...(data.financials?.[arrayName] || [])];
            newArray.splice(index, 1);
            onChange('financials', arrayName, newArray);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={20} /> Financials {`&`} Peers</h3>

            {/* Financials Matrix Table */}
            <div className="overflow-x-auto bg-slate-950/30 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-semibold">Company Financials (In ₹ Crore)</h4>
                    <button type="button" onClick={addPeriod} className="flex items-center gap-2 text-blue-400 text-sm font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20">
                        <PlusCircle size={14} /> Add Period
                    </button>
                </div>

                <div className="min-w-[600px]">
                    <div className="flex gap-4 mb-4">
                        <div className="w-48 shrink-0 flex items-center">
                            <span className="text-xs font-bold text-slate-500 uppercase">Period Ended</span>
                        </div>
                        {(data.financials?.table || []).map((col, idx) => (
                            <div key={idx} className="w-32 shrink-0 relative group">
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-sm font-bold text-blue-400 focus:border-blue-500"
                                    placeholder="e.g. Mar-24"
                                    value={col.period || ''}
                                    onChange={e => handleTableChange(idx, 'period', e.target.value)}
                                />
                                <button
                                    onClick={() => removePeriod(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {ROWS_ORDER.map(rowKey => (
                        <div key={rowKey} className="flex gap-4 mb-3 items-center hover:bg-slate-800/10 rounded p-1">
                            <div className="w-48 shrink-0">
                                <span className="text-sm font-medium text-slate-300">{ROW_LABELS[rowKey]}</span>
                            </div>
                            {(data.financials?.table || []).map((col, idx) => (
                                <div key={idx} className="w-32 shrink-0">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded px-3 py-2 text-right text-sm text-white focus:border-blue-500"
                                        placeholder="0.00"
                                        value={col[rowKey] || ''}
                                        onChange={e => handleTableChange(idx, rowKey, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* KPI Section - Refactored for Array Structure */}
            <div className="overflow-x-auto bg-slate-950/30 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-semibold">KPIs ({type === 'SME' ? 'SME' : 'Mainboard'})</h4>
                    <button type="button" onClick={addKpiPeriod} className="flex items-center gap-2 text-blue-400 text-sm font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20">
                        <PlusCircle size={14} /> Add Period
                    </button>
                </div>

                <div className="min-w-[500px]">
                    <div className="flex gap-4 mb-4">
                        <div className="w-32 shrink-0 flex items-center">
                            <span className="text-xs font-bold text-slate-500 uppercase">Period</span>
                        </div>
                        {(data.financials?.kpis || []).map((kpiData, idx) => (
                            <div key={idx} className="w-32 shrink-0 relative group">
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-sm font-bold text-blue-400 focus:border-blue-500"
                                    placeholder="e.g. Mar-25"
                                    value={kpiData.period || ''}
                                    onChange={e => updateKpiPeriod(idx, e.target.value)}
                                />
                                <button
                                    onClick={() => removeKpiPeriod(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    type="button"
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {getKpiKeys(type).map(kpiKey => (
                        <div key={kpiKey} className="flex gap-4 mb-3 items-center hover:bg-slate-800/10 rounded p-1">
                            <div className="w-32 shrink-0">
                                <span className="text-sm font-medium text-slate-300">{getKpiLabel(type, kpiKey)}</span>
                            </div>
                            {(data.financials?.kpis || []).map((kpiData, idx) => (
                                <div key={idx} className="w-32 shrink-0">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded px-3 py-2 text-right text-sm text-white focus:border-blue-500 appearance-none"
                                        placeholder="0.00"
                                        value={kpiData[kpiKey] || ''}
                                        onChange={e => updateKpiValue(idx, kpiKey, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>


            {/* Peers */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-semibold">Peers Comparison</h4>
                    <button type="button" onClick={() => addArrayItem('peers', { name: '', cmp: '', pe: '', roe: '' })} className="flex items-center gap-2 text-blue-400 text-sm font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20">
                        <PlusCircle size={14} /> Add Peer
                    </button>
                </div>
                <div className="space-y-2">
                    {data.peers?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-slate-950/30 p-3 rounded-lg border border-slate-800">
                            <input placeholder="Company Name" value={item.name || ''} onChange={e => handleArrayChange('peers', idx, 'name', e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" />
                            <input placeholder="CMP" value={item.cmp || ''} onChange={e => handleArrayChange('peers', idx, 'cmp', e.target.value)} className="w-20 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" />
                            <input placeholder="P/E" value={item.pe || ''} onChange={e => handleArrayChange('peers', idx, 'pe', e.target.value)} className="w-20 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" />
                            <button type="button" onClick={() => removeArrayItem('peers', idx)} className="text-red-400 hover:bg-red-500/10 p-2 rounded"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default FinancialsInfo;
