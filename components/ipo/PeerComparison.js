import { motion } from 'framer-motion';

export default function PeerComparison({ peers }) {
    if (!peers || peers.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Peer Comparison</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CMP (₹)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/E</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RoE (%)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {peers.map((peer, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{peer.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{peer.cmp || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{peer.pe || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{peer.roe || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
