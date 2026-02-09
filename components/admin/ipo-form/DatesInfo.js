import { Calendar } from 'lucide-react';

const DatesInfo = ({ data, onChange }) => {

    // Helper to format date for input (YYYY-MM-DD)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    const handleDateChange = (field, value) => {
        onChange('dates', field, value); // Value is already YYYY-MM-DD from input type="date"
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Calendar size={20} /> Important Dates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-950/30 p-6 rounded-xl border border-slate-800">

                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Open Date</label>
                    <input
                        type="date"
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={formatDate(data.dates?.open)}
                        onChange={e => handleDateChange('open', e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Close Date</label>
                    <input
                        type="date"
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={formatDate(data.dates?.close)}
                        onChange={e => handleDateChange('close', e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Allotment Date</label>
                    <input
                        type="date"
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={formatDate(data.dates?.allotment)}
                        onChange={e => handleDateChange('allotment', e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Listing Date</label>
                    <input
                        type="date"
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-slate-600 shadow-sm"
                        value={formatDate(data.dates?.listing)}
                        onChange={e => handleDateChange('listing', e.target.value)}
                    />
                </div>

            </div>
        </div>
    );
};

export default DatesInfo;
