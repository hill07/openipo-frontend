import React from 'react';

export default function SubscriptionCard({ subscription }) {
    if (!subscription || !subscription.length) return null;

    const maxTimes = Math.max(...subscription.map(s => parseFloat(s.subscriptionTimes || 0)), 1);

    return (
        <div className="sub-card">
            <div className="card-header">
                <h3>Live Subscription</h3>
                <span className="live-badge">LIVE</span>
            </div>

            <div className="sub-list">
                {subscription.map((item, idx) => {
                    const times = parseFloat(item.subscriptionTimes || 0);
                    const percent = Math.min((times / Math.max(maxTimes, 20)) * 100, 100);

                    return (
                        <div key={idx} className="sub-item">
                            <div className="sub-info">
                                <span className="cat">{item.name}</span>
                                <span className="val">{times}x</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-bar" style={{ width: `${percent}%` }} />
                            </div>
                        </div>
                    )
                })}
            </div>

            <style jsx>{`
        .sub-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid #f1f5f9;
        }
        @media (max-width: 600px) {
            .sub-card { padding: 16px; margin-bottom: 16px; }
        }
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
        }
        .live-badge {
            background: #fee2e2;
            color: #ef4444;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 4px;
            animation: blink 2s infinite;
        }
        
        .sub-item {
            margin-bottom: 16px;
        }
        .sub-item:last-child { margin-bottom: 0; }
        
        .sub-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 13px;
        }
        .cat { color: #64748b; font-weight: 500; }
        .val { color: #0f172a; font-weight: 700; }
        
        .progress-track {
            height: 6px;
            background: #f1f5f9;
            border-radius: 10px;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            border-radius: 10px;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
}
