export default function IPOGMPCard({ gmp, priceBand }) {
    if (!gmp) return null;

    const capPrice = priceBand?.max || 0;
    const gmpVal = gmp.current || 0;
    const listingPrice = capPrice + gmpVal;

    const gmpPct = gmp.percent
        ? gmp.percent
        : (capPrice > 0 ? ((gmpVal / capPrice) * 100).toFixed(1) : 0);

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-4 relative overflow-hidden">

            {/* Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 blur-2xl opacity-10 -mr-12 -mt-12 ${gmpVal >= 0 ? 'bg-green-500' : 'bg-red-400'}`} />

            {/* Header */}
            <div className="flex justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">Grey Market Premium*</h3>
                <span className="text-[9px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                    UPDATED: {gmp.lastUpdatedAtText || 'Now'}
                </span>
            </div>

            {/* GMP */}
            <span className="text-xs font-medium text-slate-500">Expected Premium</span>

            <div className="flex items-center gap-2 mt-1 mb-3">
                <span className={`text-xl md:text-2xl font-extrabold ${gmpVal >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    ₹{gmpVal}
                </span>

                <span className={`text-xs font-bold px-2 py-0.5 rounded ${gmpVal >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {gmpVal >= 0 ? '+' : ''}{gmpPct}%
                </span>
            </div>

            {/* Listing */}
            {capPrice > 0 && (
                <div className="bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
                    <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-500">Est. Listing*</span>
                        <span className="font-bold text-slate-900">₹{listingPrice}</span>
                    </div>

                    <p className="text-[9px] text-slate-400 mt-1 text-right">
                        Upper band ₹{capPrice}
                    </p>
                </div>
            )}

            {/* Footer */}
            <p className="text-[9px] text-slate-400 mt-2 leading-tight">
                * GMP indicative only. Not investment advice.
            </p>

        </div>
    );
}
