import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function ShareholdingPattern({ preIssue, postIssue }) {
    if (!preIssue && !postIssue) return null;

    // Helper to parse if it's a string percentage or just display text
    // Assuming the backend sends strings like "70%" or descriptions. 
    // If it's just text description, we display text.
    // If we want a chart, we'd need structured data (Promoter vs Public).
    // Given the schema `shareHoldingPreIssue: { type: String }`, it's likely a text summary or percentage.

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Shareholding Pattern</h3>
            <div className="grid md:grid-cols-2 gap-6">
                {preIssue && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Pre-Issue Promoter Holding</div>
                        <div className="text-2xl font-bold text-gray-900">{preIssue}</div>
                    </div>
                )}
                {postIssue && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Post-Issue Promoter Holding</div>
                        <div className="text-2xl font-bold text-gray-900">{postIssue}</div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
