import Link from 'next/link';
import { isIPOApplyWindowOpen } from '../../utils/ipo';

export default function IPOHeader({ ipo }) {
    const { companyName, logo, symbol, sector, type, status } = ipo;

    // Determine real-time status for Apply button
    const isOpenForApply = isIPOApplyWindowOpen(ipo.dates?.open, ipo.dates?.close);
    const applyLink = ipo.docs?.applyLink || "https://angelone.com";

    // User Request: "never show any other status only show open,close,upcoming"
    let displayStatus = status;
    if (status === 'LISTED' || status === 'ALLOTMENT') {
        displayStatus = 'CLOSED';
    }

    const getStatusStyles = (s) => {
        switch (s) {
            case 'OPEN': return 'bg-green-100 text-green-700 border-green-200';
            case 'UPCOMING': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200'; // CLOSED
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

                {/* Left: Logo & Name */}
                <div className="flex items-center gap-5">
                    {logo ? (
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl border border-slate-200 p-2 flex items-center justify-center bg-white shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logo} alt={`${companyName} Logo`} className="max-w-full max-h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-2xl shrink-0">
                            {companyName?.charAt(0)}
                        </div>
                    )}

                    <div>
                        <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
                            {companyName}
                        </h1>
                        <div className="flex flex-wrap gap-2 items-center text-sm">
                            {symbol?.nse && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md font-semibold text-xs border border-slate-200">
                                    NSE: {symbol.nse}
                                </span>
                            )}
                            {symbol?.bse && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md font-semibold text-xs border border-slate-200">
                                    BSE: {symbol.bse}
                                </span>
                            )}
                            {/* Group Type and Status to prevent bad wrapping */}
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-semibold text-xs border border-blue-100">
                                    {type}
                                </span>

                                {/* Status Badge */}
                                <div className={`px-2 py-1 rounded-md font-bold text-xs flex items-center gap-1.5 border ${getStatusStyles(displayStatus)}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${displayStatus === 'OPEN' ? 'bg-green-600 animate-pulse' :
                                        displayStatus === 'UPCOMING' ? 'bg-blue-600' :
                                            'bg-slate-500' // CLOSED dot
                                        }`}></span>
                                    {displayStatus}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Action Button Only */}
                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    {/* Action Button Logic: Allotment > Apply */}
                    {(() => {
                        if (ipo.allotment?.isAllotted && ipo.allotment?.allotmentLink) {
                            return (
                                <Link
                                    href={ipo.allotment.allotmentLink}
                                    target='_blank'
                                    className="w-full md:w-auto text-center px-6 py-2.5 bg-green-600 hover:bg-green-700 !text-white font-semibold rounded-xl text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                                >
                                    Check Allotment
                                </Link>
                            );
                        }

                        if (displayStatus === 'OPEN' && isOpenForApply) {
                            return (
                                <Link
                                    href={applyLink}
                                    target='_blank'
                                    className="w-full md:w-auto text-center px-6 py-2.5 bg-green-600 hover:bg-green-700 !text-white font-semibold rounded-xl text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                                >
                                    Apply Now &rarr;
                                </Link>
                            );
                        }
                        return null;
                    })()}
                </div>

            </div>
        </div>
    );
}
