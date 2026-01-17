import Link from "next/link";
import { useState, useEffect } from "react";
import { isClosingToday, getCloseCountdown } from "../utils/countdown";

// SVG Icons
const Icons = {
  Open: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" transform="rotate(180 12 12)" />
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  ),
  Closing: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Allotment: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Listing: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
};

export default function TodayHighlights({ todayHighlights, ipos }) {
  const [showModal, setShowModal] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal]);

  return (
    <>
      {/* Desktop View: Sticky Sidebar */}
      <div className="desktop-container">
        <HighlightsContent todayHighlights={todayHighlights} ipos={ipos} />
      </div>

      {/* Mobile View: Floating Button + Modal */}
      <div className="mobile-container">
        <button
          className="side-toggle-btn"
          onClick={() => setShowModal(true)}
          aria-label="Show Today's Highlights"
        >
          <span className="btn-icon">⚡</span>
          <span className="btn-text">Today's Highlights</span>
        </button>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Today's Snapshot</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <HighlightsContent todayHighlights={todayHighlights} ipos={ipos} isMobile={true} />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Desktop styles */
        .desktop-container {
           display: block;
           position: sticky;
           top: 90px;
        }

        /* Mobile styles */
        .mobile-container {
           display: none;
        }

        /* Responsive Switch */
        @media (max-width: 1024px) {
           .desktop-container { display: none; }
           .mobile-container { display: block; }
        }

        /* Mobile Toggle Button (Right Side) */
        .side-toggle-btn {
           position: fixed;
           right: 0;
           top: 50%;
           transform: translateY(-50%);
           background: #1e293b;
           color: #fff;
           border: none;
           border-radius: 8px 0 0 8px; /* Curve left side */
           padding: 16px 8px;
           z-index: 50;
           cursor: pointer;
           box-shadow: -4px 0 12px rgba(0,0,0,0.15);
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 8px;
           transition: transform 0.2s ease;
        }

        .side-toggle-btn:hover {
           transform: translateY(-50%) translateX(-2px);
           background: #0f172a;
        }

        .btn-text {
           writing-mode: vertical-rl;
           text-orientation: mixed;
           font-weight: 700;
           font-size: 0.85rem;
           letter-spacing: 0.5px;
           text-transform: uppercase;
        }

        .btn-icon {
           font-size: 1.2rem;
        }

        /* Drawer Styles */
        .modal-overlay {
           position: fixed;
           top: 0; left: 0; right: 0; bottom: 0;
           background: rgba(0,0,0,0.5);
           backdrop-filter: blur(2px);
           z-index: 2000; /* Ensure it is above the sticky filter bar (z-900) */
           animation: fadeIn 0.2s ease-out;
        }

        .modal-card {
           position: absolute;
           top: 0; 
           right: 0; 
           bottom: 0;
           width: 85%;
           max-width: 320px;
           background: #fff;
           box-shadow: -4px 0 25px rgba(0, 0, 0, 0.15);
           display: flex;
           flex-direction: column;
           animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
           border-radius: 0;
        }

        .modal-header {
           padding: 16px 20px;
           border-bottom: 1px solid #f1f5f9;
           display: flex;
           justify-content: space-between;
           align-items: center;
           background: #fff;
        }

        .modal-header h3 {
           margin: 0;
           font-size: 1.1rem;
           color: #0f172a;
           font-weight: 800;
        }

        .close-btn {
           background: #f1f5f9;
           border: none;
           width: 32px;
           height: 32px;
           border-radius: 50%;
           font-size: 1rem;
           color: #64748b;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: background 0.2s;
        }
        
        .close-btn:hover {
           background: #e2e8f0;
           color: #0f172a;
        }

        .modal-body {
           flex: 1;
           padding: 20px;
           overflow-y: auto;
           background: #f8fafc;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}

// Extracted Content Component
function HighlightsContent({ todayHighlights, ipos, isMobile }) {
  return (
    <div className={`highlights-wrapper ${isMobile ? 'mobile-mode' : ''}`}>
      {!isMobile && (
        <h2 className="sidebar-title">
          <span className="dot-pulse"></span>
          Today's Snapshot
        </h2>
      )}

      {/* Open Today */}
      <HighlightWidget
        title="Open Today"
        count={todayHighlights?.open?.count || 0}
        companies={todayHighlights?.open?.companies || []}
        type="open"
        icon={Icons.Open}
      />

      {/* Closing Today with Countdown */}
      <ClosingTodayWidget
        count={todayHighlights?.closing?.count || 0}
        companies={todayHighlights?.closing?.companies || []}
        ipos={ipos}
        icon={Icons.Closing}
      />

      {/* Allotment Today */}
      <HighlightWidget
        title="Allotment Today"
        count={todayHighlights?.allotment?.count || 0}
        companies={todayHighlights?.allotment?.companies || []}
        type="allotment"
        icon={Icons.Allotment}
      />

      {/* Listing Today */}
      <HighlightWidget
        title="Listing Today"
        count={todayHighlights?.listing?.count || 0}
        companies={todayHighlights?.listing?.companies || []}
        type="listing"
        icon={Icons.Listing}
      />

      <style jsx>{`
        .highlights-wrapper {
          background: #fff;
          border-radius: 12px;
        }

        .highlights-wrapper:not(.mobile-mode) {
           background: rgba(255, 255, 255, 0.9);
           backdrop-filter: blur(12px);
           border: 1px solid #e2e8f0;
           padding: 24px;
           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        
        .sidebar-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dot-pulse {
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          position: relative;
        }
        
        .dot-pulse::after {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background-color: rgba(239, 68, 68, 0.4);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
           0% { transform: scale(0.8); opacity: 0.8; }
           100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function HighlightWidget({ title, count, companies, type, icon }) {
  // Theme colors based on type
  const getTheme = (t) => {
    switch (t) {
      case 'open': return { border: '#22c55e', text: '#15803d', bg: '#f0fdf4' };
      case 'allotment': return { border: '#3b82f6', text: '#1d4ed8', bg: '#eff6ff' };
      case 'listing': return { border: '#eab308', text: '#a16207', bg: '#fefce8' };
      default: return { border: '#cbd5e1', text: '#64748b', bg: '#f8fafc' };
    }
  };

  const theme = getTheme(type);
  const isEmpty = count === 0;

  return (
    <div className={`highlight-widget ${isEmpty ? 'empty' : ''}`}>
      <div className="widget-header">
        <div className="title-row">
          <span className="icon-wrapper" style={{ color: theme.text, background: theme.bg }}>
            {icon}
          </span>
          <h3>{title}</h3>
        </div>
        <span className={`widget-count ${isEmpty ? 'zero' : ''}`}>{count}</span>
      </div>

      {!isEmpty && companies.length > 0 && (
        <div className="widget-companies">
          {companies.slice(0, 2).map((company, idx) => (
            <Link
              key={idx}
              href={`/ipo/${company.slug}`}
              className="company-link"
            >
              <span className="co-name">{company.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </Link>
          ))}
          {count > 2 && (
            <span className="more-count">+{count - 2} others</span>
          )}
        </div>
      )}

      {isEmpty && (
        <div className="widget-empty">Nothing today</div>
      )}

      <style jsx>{`
        .highlight-widget {
          margin-bottom: 16px;
          padding: 16px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          transition: transform 0.2s;
        }
        
        .highlight-widget:not(.empty):hover {
           transform: translateY(-2px);
           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
           border-color: ${theme.border};
        }

        .highlight-widget.empty {
           background: #fdfdfd; 
           border: 1px dashed #e2e8f0;
           opacity: 0.8;
        }
        
        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }
        
        .widget-header h3 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #334155;
          margin: 0;
        }
        
        .widget-count {
          font-size: 1.1rem;
          font-weight: 800;
          color: ${theme.text};
          background: ${theme.bg};
          padding: 2px 10px;
          border-radius: 99px;
        }
        
        .widget-count.zero {
           color: #94a3b8;
           background: #f1f5f9;
        }
        
        .widget-companies {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 10px;
          border-top: 1px dashed #e2e8f0;
        }
        
        .company-link {
          font-size: 0.85rem;
          color: #334155;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .co-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }
        
        .company-link:hover {
          color: ${theme.text};
          transform: translateX(2px);
        }
        
        .more-count {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
          padding-left: 2px;
        }
        
        .widget-empty {
          font-size: 0.8rem;
          color: #cbd5e1;
          font-style: italic;
          font-weight: 500;
          text-align: center;
          padding: 4px 0;
        }
      `}</style>
    </div>
  );
}

function ClosingTodayWidget({ count, companies, ipos, icon }) {
  const [countdowns, setCountdowns] = useState({});
  const theme = { border: '#ef4444', text: '#dc2626', bg: '#fef2f2' };

  // Find IPOs closing today and calculate countdowns
  useEffect(() => {
    if (!ipos || ipos.length === 0) return;

    const closingIPOs = ipos.filter(ipo => {
      return isClosingToday(ipo?.dates?.close);
    });

    // Sort by closest close time
    closingIPOs.sort((a, b) => {
      const aClose = new Date(a.dates.close);
      const bClose = new Date(b.dates.close);
      aClose.setHours(16, 0, 0, 0);
      bClose.setHours(16, 0, 0, 0);
      return aClose - bClose;
    });

    const newCountdowns = {};
    closingIPOs.forEach(ipo => {
      if (ipo.slug && ipo.dates?.close) {
        newCountdowns[ipo.slug] = getCloseCountdown(ipo.dates.close);
      }
    });

    setCountdowns(newCountdowns);

    // Update countdown every second
    const interval = setInterval(() => {
      const updated = {};
      closingIPOs.forEach(ipo => {
        if (ipo.slug && ipo.dates?.close) {
          updated[ipo.slug] = getCloseCountdown(ipo.dates.close);
        }
      });
      setCountdowns(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [ipos]);

  // Get closing IPOs with their countdowns
  const closingIPOsWithTimer = companies
    .map(company => {
      const ipo = ipos?.find(i => i.slug === company.slug);
      if (!ipo) return null;

      const countdown = countdowns[company.slug] || getCloseCountdown(ipo.dates?.close);
      return { ...company, countdown };
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Prioritize expired or soon-to-expire
      if (!a.countdown || !b.countdown) return 0;
      if (a.countdown.isExpired && !b.countdown.isExpired) return 1;
      if (!a.countdown.isExpired && b.countdown.isExpired) return -1;
      return (a.countdown.hours * 60 + a.countdown.minutes) -
        (b.countdown.hours * 60 + b.countdown.minutes);
    });

  const isEmpty = count === 0;

  return (
    <div className={`highlight-widget closing ${isEmpty ? 'empty' : ''}`}>
      <div className="widget-header">
        <div className="title-row">
          <span className="icon-wrapper" style={{ color: theme.text, background: theme.bg }}>
            {icon}
          </span>
          <h3>Closing Today</h3>
        </div>
        <span className={`widget-count ${isEmpty ? 'zero' : ''}`}>{count}</span>
      </div>

      {!isEmpty && closingIPOsWithTimer.length > 0 && (
        <div className="widget-companies">
          {closingIPOsWithTimer.slice(0, 2).map((item, idx) => (
            <div key={idx} className="closing-item">
              <Link
                href={`/ipo/${item.slug}`}
                className="company-link"
              >
                <span className="co-name">{item.name}</span>
              </Link>
              {item.countdown && (
                <div className={`countdown-timer ${item.countdown.isExpired ? 'expired' : ''}`}>
                  <span className="timer-icon">⏳</span>
                  {item.countdown.formatted}
                </div>
              )}
            </div>
          ))}
          {count > 2 && (
            <span className="more-count">+{count - 2} others</span>
          )}
        </div>
      )}

      {isEmpty && (
        <div className="widget-empty">Nothing closing today</div>
      )}

      <style jsx>{`
        .highlight-widget {
          margin-bottom: 16px;
          padding: 16px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          transition: transform 0.2s;
        }

        .highlight-widget.closing:not(.empty) {
           border-color: #fecaca;
           background: #fff;
        }

        .highlight-widget.empty {
           background: #fdfdfd; 
           border: 1px dashed #e2e8f0;
           opacity: 0.8;
        }
        
        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .title-row { display: flex; align-items: center; gap: 10px; }
        
        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }

        .widget-header h3 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #334155;
          margin: 0;
        }
        
        .widget-count {
          font-size: 1.1rem;
          font-weight: 800;
          color: #dc2626;
          background: #fef2f2;
          padding: 2px 10px;
          border-radius: 99px;
        }

        .widget-count.zero { color: #94a3b8; background: #f1f5f9; }
        
        .closing-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px;
          background: #fffafa;
          border-radius: 8px;
          border: 1px solid #fee2e2;
          margin-bottom: 8px;
        }
        
        .company-link {
          font-size: 0.85rem;
          color: #0f172a;
          text-decoration: none;
          font-weight: 600;
          line-height: 1.3;
        }

        .co-name {
           white-space: nowrap;
           overflow: hidden;
           text-overflow: ellipsis;
           max-width: 90%;
        }
        
        .company-link:hover {
          color: #dc2626;
        }
        
        .countdown-timer {
          font-family: 'Roboto Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .countdown-timer.expired {
          color: #64748b;
          text-decoration: line-through;
        }

        .timer-icon { font-size: 0.7rem; }
        
        .more-count {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
        }
        
        .widget-empty {
          font-size: 0.8rem;
          color: #cbd5e1;
          font-style: italic;
          font-weight: 500;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
