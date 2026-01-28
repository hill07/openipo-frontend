import React from 'react';

const STEPS = [
  { key: 'open', label: 'Open' },
  { key: 'close', label: 'Close' },
  { key: 'allotment', label: 'Allotment' },
  { key: 'listing', label: 'Listing' }
];

export default function Timeline({ dates }) {
  const getCurrentStep = () => {
    const now = new Date();
    if (dates.listing && now >= new Date(dates.listing)) return 3;
    if (dates.allotment && now >= new Date(dates.allotment)) return 2;
    if (dates.close && now >= new Date(dates.close)) return 1;
    if (dates.open && now >= new Date(dates.open)) return 0;
    return -1;
  };

  const activeIndex = getCurrentStep();

  return (
    <div className="timeline-container">
      <div className="track-bg">
        <div className="track-fill" style={{ width: `${Math.min(100, (activeIndex / 3) * 100)}%` }} />
      </div>

      <div className="steps-wrapper">
        {STEPS.map((step, idx) => {
          const dateStr = dates[step.key];
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.key} className={`step-item ${isCompleted ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="step-icon">
                {idx < activeIndex ? (
                  <span className="check">✓</span>
                ) : (
                  <span className="num">{idx + 1}</span>
                )}
              </div>

              <div className="step-content">
                <span className="step-label">{step.label}</span>
                <span className="step-date">
                  {dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBA'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .timeline-container {
          position: relative;
          padding: 10px 0 20px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .timeline-container::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .timeline-container {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        .track-bg {
          position: absolute;
          top: 24px;
          left: 40px;
          right: 40px;
          height: 3px;
          background: #e2e8f0;
          z-index: 0;
          border-radius: 10px;
          min-width: 300px; /* Ensure line doesn't disappear on very small screens if container scrolls */
        }
        .track-fill {
           height: 100%;
           background: #4ade80;
           transition: width 1s ease;
           box-shadow: 0 0 10px rgba(74, 222, 128, 0.4);
        }
        .steps-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          min-width: 320px; /* Force minimum width to trigger scroll on tiny screens */
          padding: 0 10px; /* Add some padding so end items aren't cut off immediately */
        }
        .step-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            width: 80px;
            flex-shrink: 0; /* Prevent steps from squashing */
        }
        .step-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid #cbd5e1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #94a3b8;
            margin-bottom: 8px;
            transition: all 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .step-item.active .step-icon {
            background: #4ade80;
            border-color: #4ade80;
            color: white;
            box-shadow: 0 4px 10px rgba(74, 222, 128, 0.3);
        }
        .step-item.current .step-icon {
            animation: pulse 2s infinite;
        }
        
        .step-label {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
            color: #94a3b8;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }
        .step-item.active .step-label {
            color: #0f172a;
        }
        .step-date {
            font-size: 13px;
            font-weight: 600;
            color: #0f172a;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
            100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        }
      `}</style>
    </div>
  );
}
