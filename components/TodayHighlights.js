import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
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
  ),
  WhatsApp: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" stroke="none">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  Telegram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" stroke="none">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
};

// Helper functions
function isSameDay(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const now = new Date();

  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function makeCompanyObj(ipo) {
  return {
    name: ipo.companyName || "Unknown",
    slug: ipo.slug,
  };
}

export default function TodayHighlights({ ipos }) {
  const [showModal, setShowModal] = useState(false);

  // Compute today's highlights from ipos
  const todayHighlights = useMemo(() => {
    const open = [], closing = [], allotment = [], listing = [];

    (ipos || []).forEach((ipo) => {
      if (!ipo?.slug) return;
      if (isSameDay(ipo.startDate)) open.push(makeCompanyObj(ipo));
      if (isSameDay(ipo.endDate)) closing.push(makeCompanyObj(ipo));
      if (isSameDay(ipo.allotmentDate)) allotment.push(makeCompanyObj(ipo));
      if (isSameDay(ipo.listingDate)) listing.push(makeCompanyObj(ipo));
    });

    return {
      open: { count: open.length, companies: open },
      closing: { count: closing.length, companies: closing },
      allotment: { count: allotment.length, companies: allotment },
      listing: { count: listing.length, companies: listing },
    };
  }, [ipos]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [showModal]);

  return (
    <>
      {/* Desktop View: Sticky Sidebar */}
      <div className="desktop-container">
        <HighlightsContent todayHighlights={todayHighlights} ipos={ipos} />
      </div>

      {/* Mobile View: Floating Button + Modal */}
      <div className="mobile-container">
        {!showModal && (
          <button className="side-toggle-btn" onClick={() => setShowModal(true)} aria-label="Show Highlights">
            <span className="btn-icon">⚡</span>
            <span className="btn-text"> today's Highlights</span>
          </button>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <Link href="/todays-snapshot" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ cursor: 'pointer' }}>Highlights &rarr;</h3>
                </Link>
                <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <HighlightsContent todayHighlights={todayHighlights} ipos={ipos} isMobile={true} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .desktop-container { display: block; position: sticky; top: 90px; }
        .mobile-container { display: none; }
        @media (max-width: 1024px) {
          .desktop-container { display: none; }
          .mobile-container { display: block; }
        }
        .side-toggle-btn {
          position: fixed;
          right: 0;
          top: 60%; 
          transform: translateY(-50%);
          background: #1e293b;
          color: #fff;
          border: none;
          border-radius: 8px 0 0 8px;
          padding: 12px 6px; 
          z-index: 9999;
          cursor: pointer;
          box-shadow: -4px 0 12px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: transform 0.2s ease;
        }
        .side-toggle-btn:hover { transform: translateY(-50%) translateX(-2px); background: #0f172a; }
        .btn-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          font-weight: 700;
          font-size: 0.75rem; 
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .btn-icon { font-size: 1rem; }
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
          z-index: 2000;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-card {
          position: absolute; top: 0; right: 0; bottom: 0;
          width: 85%; max-width: 320px;
          background: #fff;
          box-shadow: -4px 0 25px rgba(0, 0, 0, 0.15);
          display: flex; flex-direction: column;
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          display: flex; justify-content: space-between; align-items: center;
        }
        .modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a; }
        .close-btn {
          background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%;
          font-size: 1rem; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .close-btn:hover { background: #e2e8f0; color: #0f172a; }
        .modal-body { flex: 1; padding: 20px; overflow-y: auto; background: #f8fafc; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}

function HighlightsContent({ todayHighlights, ipos, isMobile }) {
  return (
    <>
      <div className={`highlights-wrapper ${isMobile ? "mobile-mode" : ""}`}>
        {/* WhatsApp Channel Widget - Placed at Top */}
        <a
          href="https://whatsapp.com/channel/0029VbBcVPF3gvWR3HMrd42k"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-widget"
        >
          <div className="wa-icon">
            {Icons.WhatsApp}
          </div>
          <div className="wa-content">
            <span className="wa-title">Join WhatsApp Channel</span>
            <span className="wa-subtitle">Get latest IPO updates</span>
          </div>
        </a>



        <Link href="/todays-snapshot" style={{ textDecoration: 'none' }}>
          <h2 className="sidebar-title" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <span>Today&apos;s Snapshot</span>
            <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '600' }}>View All &rarr;</span>
          </h2>
        </Link>

        <HighlightWidget
          title="Open Today"
          count={todayHighlights?.open?.count || 0}
          companies={todayHighlights?.open?.companies || []}
          type="open"
          icon={Icons.Open}
        />

        <ClosingTodayWidget
          count={todayHighlights?.closing?.count || 0}
          companies={todayHighlights?.closing?.companies || []}
          ipos={ipos}
          icon={Icons.Closing}
        />

        <HighlightWidget
          title="Allotment Today"
          count={todayHighlights?.allotment?.count || 0}
          companies={todayHighlights?.allotment?.companies || []}
          type="allotment"
          icon={Icons.Allotment}
        />

        <HighlightWidget
          title="Listing Today"
          count={todayHighlights?.listing?.count || 0}
          companies={todayHighlights?.listing?.companies || []}
          type="listing"
          icon={Icons.Listing}
        />
        {/* Telegram Channel Widget */}
        <a
          href="https://t.me/ipoopenipo" // Replace with actual link
          target="_blank"
          rel="noopener noreferrer"
          className="telegram-widget"
        >
          <div className="wa-icon">
            {Icons.Telegram}
          </div>
          <div className="wa-content">
            <span className="wa-title">Join Telegram Channel</span>
            <span className="wa-subtitle">Get latest IPO updates</span>
          </div>
        </a>
        {/* Styles */}
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
          content: "";
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

        .whatsapp-widget, .telegram-widget {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: #fff;
        }
        .whatsapp-widget {
          background: #25d366;
        }
        .telegram-widget {
          background: #229ED9;
          margin-bottom: 24px; /* Extra space after the last widget */
        }
        .wa-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wa-content {
          display: flex;
          flex-direction: column;
        }
        .wa-title {
          font-weight: 800;
          font-size: 0.95rem;
          line-height: 1.2;
        }
        .wa-subtitle {
          font-size: 0.75rem;
          opacity: 0.9;
          font-weight: 500;
        }
      `}</style>
      </div></>
  );
}

function HighlightWidget({ title, count, companies, type, icon }) {
  const getTheme = (t) => {
    switch (t) {
      case "open": return { border: "#22c55e", text: "#15803d", bg: "#f0fdf4" };
      case "allotment": return { border: "#3b82f6", text: "#1d4ed8", bg: "#eff6ff" };
      case "listing": return { border: "#eab308", text: "#a16207", bg: "#fefce8" };
      default: return { border: "#cbd5e1", text: "#64748b", bg: "#f8fafc" };
    }
  };

  const theme = getTheme(type);
  const isEmpty = count === 0;

  return (
    <div className={`highlight-widget ${isEmpty ? "empty" : ""}`}>
      <div className="widget-header">
        <div className="title-row">
          <span className="icon-wrapper" style={{ color: theme.text, background: theme.bg }}>
            {icon}
          </span>
          <h3>{title}</h3>
        </div>
        <span className={`widget-count ${isEmpty ? "zero" : ""}`}>{count}</span>
      </div>

      {/* {!isEmpty && companies.length > 0 && (
        <div className="widget-companies">
          {companies.slice(0, 2).map((company, idx) => (
            <Link key={idx} href={`/ipo/${company.slug}`} className="company-link">
              <span className="co-name">{company.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          ))}
          {count > 2 && <span className="more-count">+{count - 2} others</span>}
        </div>
      )} */}

      {/* {isEmpty && <div className="widget-empty">Nothing today</div>} */}

      {/* Styles */}
      <style jsx>{`
        .highlight-widget {
          margin-bottom: 16px;
          padding: 16px;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          transition: transform 0.2s;
        }
        .highlight-widget:not(.empty):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
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
        }
      `}</style>
    </div>
  );
}

function ClosingTodayWidget({ count, companies, ipos, icon }) {
  const isEmpty = count === 0;

  const initialCountdowns = useMemo(() => {
    if (!ipos || ipos.length === 0) return {};

    const closingIPOs = ipos.filter((ipo) => isClosingToday(ipo?.endDate));

    // Sort by closest close time
    const sortedIPOs = [...closingIPOs].sort((a, b) => {
      const aClose = new Date(a.endDate);
      const bClose = new Date(b.endDate);
      aClose.setHours(16, 0, 0, 0);
      bClose.setHours(16, 0, 0, 0);
      return aClose - bClose;
    });

    const newCountdowns = {};
    sortedIPOs.forEach((ipo) => {
      if (ipo.slug && ipo?.endDate) {
        newCountdowns[ipo.slug] = getCloseCountdown(ipo.endDate);
      }
    });

    return newCountdowns;
  }, [ipos]);

  const [countdowns, setCountdowns] = useState(initialCountdowns);

  useEffect(() => {
    if (!ipos || ipos.length === 0) return;

    const closingIPOs = ipos.filter((ipo) => isClosingToday(ipo?.endDate));

    // Sort by closest close time
    const sortedIPOs = [...closingIPOs].sort((a, b) => {
      const aClose = new Date(a.endDate);
      const bClose = new Date(b.endDate);
      aClose.setHours(16, 0, 0, 0);
      bClose.setHours(16, 0, 0, 0);
      return aClose - bClose;
    });

    const interval = setInterval(() => {
      const updated = {};
      sortedIPOs.forEach((ipo) => {
        if (ipo.slug && ipo?.endDate) {
          updated[ipo.slug] = getCloseCountdown(ipo.endDate);
        }
      });
      setCountdowns(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [ipos]);

  const closingIPOsWithTimer = companies
    .map((company) => {
      const ipo = ipos?.find((i) => i.slug === company.slug);
      if (!ipo) return null;
      const countdown = countdowns[company.slug];
      return { ...company, countdown };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (!a.countdown || !b.countdown) return 0;
      if (a.countdown.isExpired && !b.countdown.isExpired) return 1;
      if (!a.countdown.isExpired && b.countdown.isExpired) return -1;
      return (
        a.countdown.hours * 60 +
        a.countdown.minutes -
        (b.countdown.hours * 60 + b.countdown.minutes)
      );
    });

  return (
    <div className={`highlight-widget closing ${isEmpty ? "empty" : ""}`}>
      <div className="widget-header">
        <div className="title-row">
          <span className="icon-wrapper" style={{ color: "#dc2626", background: "#fef2f2" }}>
            {icon}
          </span>
          <h3>Closing Today</h3>
        </div>
        <span className={`widget-count ${isEmpty ? "zero" : ""}`}>{count}</span>
      </div>

      {!isEmpty && closingIPOsWithTimer.length > 0 && (
        <div className="widget-companies">
          {closingIPOsWithTimer.slice(0, 2).map((item, idx) => (
            <div key={idx} className="closing-item">
              <Link href={`/ipo/${item.slug}`} className="company-link">
                <span className="co-name">{item.name}</span>
              </Link>
              {item.countdown && (
                <div className={`countdown-timer ${item.countdown.isExpired ? "expired" : ""}`}>
                  {/* <span className="timer-icon">⏳</span> */}
                  {item.countdown.formatted}
                </div>
              )}
            </div>
          ))}
          {count > 2 && <span className="more-count">+{count - 2} others</span>}
        </div>
      )}

      {/* {isEmpty && <div className="widget-empty">Nothing closing today</div>} */}

      {/* Styles */}
      <style jsx>{`
        .highlight-widget {
          margin-bottom: 16px;
          padding: 16px;
          background: #fff;
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
          color: #dc2626;
          background: #fef2f2;
          padding: 2px 10px;
          border-radius: 99px;
        }
        .widget-count.zero {
          color: #94a3b8;
          background: #f1f5f9;
        }
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
          font-family: "Roboto Mono", monospace;
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
        .timer-icon {
          font-size: 0.7rem;
        }
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