import React from 'react';

const Valuation = ({ valuation }) => {
    if (!valuation || valuation.length === 0) return null;

    return (
        <div className="val-wrapper">
            <div className="section-title">📊 Company Valuation</div>
            <div className="val-grid">
                {valuation.map((item, i) => (
                    <div key={i} className="val-item">
                        <span className="lbl">{item.label}</span>
                        <span className="val">{item.value}</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .val-wrapper {
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
                .val-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 16px;
                }
                .val-item {
                    background: #f8fafc;
                    padding: 12px;
                    border-radius: 10px;
                    border: 1px solid #f1f5f9;
                }
                .val-item .lbl { display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; }
                .val-item .val { font-size: 15px; font-weight: 700; color: #0f172a; }
            `}</style>
        </div>
    );
};

export default Valuation;
