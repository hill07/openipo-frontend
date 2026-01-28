import React from 'react';

const CompanyAnalysis = ({ strengths, weaknesses, objectives }) => {
    if ((!strengths?.length) && (!weaknesses?.length) && (!objectives?.length)) return null;

    return (
        <div className="analysis-grid">
            {/* Strengths */}
            {strengths && strengths.length > 0 && (
                <div className="card strength-card">
                    <div className="card-header">
                        <span className="icon">👍</span>
                        <h3>Key Strengths</h3>
                    </div>
                    <ul className="list box-list">
                        {strengths.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Weaknesses */}
            {weaknesses && weaknesses.length > 0 && (
                <div className="card risk-card">
                    <div className="card-header">
                        <span className="icon">⚠️</span>
                        <h3>Risks & Weaknesses</h3>
                    </div>
                    <ul className="list box-list">
                        {weaknesses.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Objectives */}
            {objectives && objectives.length > 0 && (
                <div className="card obj-card">
                    <div className="card-header">
                        <span className="icon">🎯</span>
                        <h3>Objectives of the Issue</h3>
                    </div>
                    <ul className="list check-list">
                        {objectives.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            <style jsx>{`
                .analysis-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                    margin-top: 24px;
                }
                .card {
                    background: #fff;
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid #e2e8f0;
                    height: 100%;
                }
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .card-header h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 700;
                    color: #0f172a;
                }
                .icon { font-size: 24px; }
                
                .strength-card .icon { text-shadow: 0 2px 10px rgba(34, 197, 94, 0.4); }
                .risk-card .icon { text-shadow: 0 2px 10px rgba(239, 68, 68, 0.4); }

                .list {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                .list li {
                    margin-bottom: 12px;
                    font-size: 14px;
                    color: #334155;
                    line-height: 1.6;
                }

                .box-list li {
                    position: relative;
                    padding-left: 20px;
                }
                .box-list li::before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: #cbd5e1;
                    font-weight: bold;
                }
                .strength-card .box-list li::before { color: #22c55e; }
                .risk-card .box-list li::before { color: #ef4444; }

                .check-list li {
                    display: flex;
                    gap: 10px;
                }
                .check-list li::before {
                    content: "✓";
                    color: #3b82f6;
                    font-weight: 900;
                }
            `}</style>
        </div>
    );
};

export default CompanyAnalysis;
