import React from 'react';

const Intermediaries = ({ registrar, leadManagers, marketMaker, promoters, shareHolding }) => {
    return (
        <div className="inter-wrapper">
            <div className="section-title">🏢 Company & Management</div>

            <div className="grid">
                {/* Promoters */}
                {promoters && promoters.length > 0 && (
                    <div className="box">
                        <h4>👥 Promoters</h4>
                        <ul className="pill-list">
                            {promoters.map((p, i) => (
                                <li key={i}>{p}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Share Holding */}
                {(shareHolding?.pre || shareHolding?.post) && (
                    <div className="box">
                        <h4>📊 Share Holding</h4>
                        <div className="sh-row">
                            {shareHolding.pre && (
                                <div className="sh-item">
                                    <span>Pre-Issue</span>
                                    <strong>{shareHolding.pre}</strong>
                                </div>
                            )}
                            {shareHolding.post && (
                                <div className="sh-item">
                                    <span>Post-Issue</span>
                                    <strong>{shareHolding.post}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Registrar */}
                {registrar && (
                    <div className="box">
                        <h4>📜 Registrar</h4>
                        <div className="text-val">{registrar}</div>
                    </div>
                )}

                {/* Lead Managers */}
                {leadManagers && leadManagers.length > 0 && (
                    <div className="box">
                        <h4>💼 Lead Managers</h4>
                        <ul className="simple-list">
                            {leadManagers.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>
                )}

                {/* Market Maker */}
                {marketMaker && (
                    <div className="box">
                        <h4>🏦 Market Maker</h4>
                        <div className="text-val">{marketMaker}</div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .inter-wrapper {
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
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 20px;
                }
                .box {
                    background: #f8fafc;
                    padding: 16px;
                    border-radius: 12px;
                }
                .box h4 {
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #64748b;
                    margin: 0 0 12px 0;
                    font-weight: 700;
                }
                .text-val {
                    font-size: 14px;
                    font-weight: 600;
                    color: #334155;
                    line-height: 1.5;
                }
                .pill-list {
                    list-style: none;
                    padding: 0;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .pill-list li {
                    background: #e2e8f0;
                    color: #475569;
                    font-size: 12px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: 500;
                }
                .simple-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .simple-list li {
                    font-size: 14px;
                    color: #334155;
                    margin-bottom: 4px;
                    font-weight: 500;
                }
                .sh-row {
                    display: flex;
                    gap: 24px;
                }
                .sh-item {
                    display: flex;
                    flex-direction: column;
                }
                .sh-item span { font-size: 11px; color: #94a3b8; }
                .sh-item strong { font-size: 15px; color: #0f172a; }
            `}</style>
        </div>
    );
};

export default Intermediaries;
