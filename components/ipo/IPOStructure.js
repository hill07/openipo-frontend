import { motion } from 'framer-motion';

export default function IPOStructure({ issueBreakdown, currencyFormatter }) {
    if (!issueBreakdown) return null;

    const { total, fresh, ofs } = issueBreakdown;

    // Calculate percentages for the bar
    const freshPct = total?.cr > 0 ? (fresh?.cr / total?.cr) * 100 : 0;
    const ofsPct = total?.cr > 0 ? (ofs?.cr / total?.cr) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">IPO Size Breakdown</h3>

            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Total Issue Size</span>
                    <span className="font-bold text-gray-900">{currencyFormatter(total?.cr)} Cr</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-teal-500"
                        style={{ width: `${freshPct}%` }}
                        title={`Fresh Issue: ${freshPct.toFixed(1)}%`}
                    />
                    <div
                        className="h-full bg-orange-400"
                        style={{ width: `${ofsPct}%` }}
                        title={`Offer for Sale: ${ofsPct.toFixed(1)}%`}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-teal-500 rounded-sm mr-1"></div>
                        Fresh Issue
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-400 rounded-sm mr-1"></div>
                        Offer for Sale
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-gray-100 rounded bg-gray-50">
                    <div className="text-xs text-gray-500 uppercase">Fresh Issue</div>
                    <div className="text-lg font-semibold text-gray-900">{currencyFormatter(fresh?.cr)} Cr</div>
                    <div className="text-xs text-gray-400">{fresh?.shares?.toLocaleString()} Shares</div>
                </div>
                <div className="p-3 border border-gray-100 rounded bg-gray-50">
                    <div className="text-xs text-gray-500 uppercase">Offer for Sale</div>
                    <div className="text-lg font-semibold text-gray-900">{currencyFormatter(ofs?.cr)} Cr</div>
                    <div className="text-xs text-gray-400">{ofs?.shares?.toLocaleString()} Shares</div>
                </div>
            </div>
        </motion.div>
    );
}
