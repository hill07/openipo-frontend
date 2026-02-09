import React from 'react';

const Comparisons = ({ peers }) => {
    if (!peers || peers.length === 0) return null;

    return (
        <div className="peer-wrapper">
            <div className="section-title">⚖️ Peer Comparison</div>
            <div className="table-responsive">
                <table className="peer-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>P/E Ratio</th>
                            <th>ROE %</th>
                            <th>Face Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peers.map((peer, i) => (
                            <tr key={i}>
                                <td className="font-bold">{peer.name}</td>
                                <td>{peer.pe || '-'}</td>
                                <td>{peer.roe || '-'}</td>
                                <td>{peer.faceValue || peer.cmp || '-'}</td> {/* Fallback since schema had different fields over time? */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .peer-wrapper {
                    background: #fff;
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid #e2e8f0;
                    margin-top: 24px;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .table-responsive { overflow-x: auto; }
                .peer-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }
                .peer-table th {
                    text-align: left;
                    padding: 12px;
                    background: #f8fafc;
                    color: #64748b;
                    font-weight: 600;
                    border-bottom: 2px solid #e2e8f0;
                }
                .peer-table td {
                    padding: 12px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #334155;
                }
                .peer-table td.font-bold { font-weight: 600; color: #0f172a; }
            `}</style>
        </div>
    );
};

export default Comparisons;
