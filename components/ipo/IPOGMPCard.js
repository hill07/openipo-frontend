export default function IPOGMPCard({ gmp, priceBand }) {
    if (!gmp) return null;

    // Calculate Listing Price
    const capPrice = priceBand?.max || 0;
    const gmpVal = gmp.current || 0;
    const listingPrice = capPrice + gmpVal;

    // Calculate Pct manually if not provided
    const gmpPct = gmp.percent
        ? gmp.percent
        : (capPrice > 0 ? ((gmpVal / capPrice) * 100).toFixed(1) : 0);

    const isBullish = gmpPct > 50;
    const isBearish = gmpPct < 10;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
            {/* Ambient Bg Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 -mr-16 -mt-16 pointer-events-none ${gmpVal > 0 ? 'bg-green-500' : 'bg-slate-300'
                }`}></div>

            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900">Grey Market Premium</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded">Updated: {gmp.lastUpdatedAtText || 'Just Now'}</span>
            </div>

            <div className="flex flex-col gap-1 mb-6">
                <span className="text-sm font-semibold text-slate-500">Expected Premium</span>
                <div className="flex items-baseline gap-3">
                    <span className={`text-3xl font-black ${gmpVal >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        ₹{gmpVal.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-sm font-bold px-2 py-1 rounded-md ${gmpVal >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {gmpVal >= 0 ? '+' : ''}{gmpPct}%
                    </span>
                </div>
            </div>

            {capPrice > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-slate-500">Est. Listing Price</span>
                        <span className="text-base font-bold text-slate-900">₹{listingPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-slate-800 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-right">Based on upper price band ({capPrice.toLocaleString('en-IN')})</p>
                </div>
            )}
        </div>
    );
}
