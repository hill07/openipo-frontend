import React from 'react';

const BrokerReviews = ({ reviewers }) => {
    if (!reviewers || reviewers.length === 0) return null;

    return (
        <div className="reviews-wrapper">
            <div className="section-title">📢 Broker Recommendations</div>
            <div className="review-grid">
                {reviewers.map((rev, i) => (
                    <div key={i} className="rev-card">
                        <div className="rev-head">
                            <span className="broker-name">{rev.name}</span>
                            <span className={`rating-badge ${getRatingClass(rev.rating)}`}>{rev.rating}</span>
                        </div>
                        {rev.summary && <p className="rev-sum">{rev.summary}</p>}
                    </div>
                ))}
            </div>

            <style jsx>{`
                .reviews-wrapper {
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
                .review-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                }
                .rev-card {
                    background: #f8fafc;
                    border: 1px solid #f1f5f9;
                    padding: 16px;
                    border-radius: 12px;
                }
                .rev-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .broker-name {
                    font-weight: 700;
                    color: #334155;
                    font-size: 14px;
                }
                .rating-badge {
                    font-size: 11px;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 6px;
                    text-transform: uppercase;
                }
                .apply { background: #dcfce7; color: #166534; }
                .avoid { background: #fee2e2; color: #991b1b; }
                .neutral { background: #f1f5f9; color: #475569; }

                .rev-sum {
                    font-size: 12px;
                    color: #64748b;
                    margin: 0;
                    line-height: 1.4;
                }
            `}</style>
        </div>
    );
};

const getRatingClass = (rating) => {
    if (!rating) return 'neutral';
    const r = rating.toLowerCase();
    if (r.includes('buy') || r.includes('subscribe') || r.includes('good') || r.includes('apply')) return 'apply';
    if (r.includes('sell') || r.includes('avoid') || r.includes('bad')) return 'avoid';
    return 'neutral';
};

export default BrokerReviews;
