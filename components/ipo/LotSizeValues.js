import { motion } from 'framer-motion';

export default function LotSizeValues({ limits, currencyFormatter }) {
    if (!limits) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Investment Limits</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Min Lots</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Max Lots</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {limits.retail && (
                            <tr>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">Retail</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{limits.retail.minLots}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{limits.retail.maxLots}</td>
                            </tr>
                        )}
                        {limits.shni && (
                            <tr>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">sHNI (Small)</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{limits.shni.minLots}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{limits.shni.maxLots}</td>
                            </tr>
                        )}
                        {limits.bhni && (
                            <tr>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">bHNI (Big)</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{limits.bhni.minLots}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{limits.bhni.maxLots}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
