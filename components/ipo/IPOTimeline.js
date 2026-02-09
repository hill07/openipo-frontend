import { formatDate } from '../../utils/date';

export default function IPOTimeline({ dates }) {
    if (!dates) return null;

    const events = [
        { label: 'IPO Open', date: dates.open, status: 'done' },
        { label: 'IPO Close', date: dates.close, status: 'done' },
        { label: 'Allotment', date: dates.allotment, status: 'current' },
        { label: 'Listing', date: dates.listing, status: 'upcoming' },
    ];

    // Helper to determine active state based on current date vs event date
    // For simplicity, we assume simple rendering for now, can be enhanced with real date comparison

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Dates</h3>

            <div className="relative">
                {/* Desktop Step UI */}
                <div className="hidden md:flex justify-between items-start relative z-10">
                    {events.map((event, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 text-center relative group">
                            {/* Connector Line */}
                            {index !== events.length - 1 && (
                                <div className="hidden md:block absolute top-3 left-[50%] w-full h-[2px] bg-slate-100 -z-10"></div>
                            )}

                            <div className="w-6 h-6 rounded-full bg-blue-50 border-2 border-blue-500 flex items-center justify-center mb-3 shadow-sm ring-4 ring-white">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            </div>

                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{event.label}</p>
                            <p className="text-sm font-semibold text-slate-900">{formatDate(event.date) || 'TBA'}</p>
                        </div>
                    ))}
                </div>

                {/* Mobile Vertical List UI */}
                <div className="md:hidden flex flex-col gap-6 relative pl-4 border-l-2 border-slate-100 ml-3">
                    {events.map((event, index) => (
                        <div key={index} className="relative pl-6">
                            {/* Dot */}
                            <div className="absolute top-1 -left-[21px] w-4 h-4 rounded-full bg-blue-50 border-2 border-blue-500 ring-4 ring-white"></div>

                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{event.label}</span>
                                <span className="text-base font-semibold text-slate-900">{formatDate(event.date) || 'TBA'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
