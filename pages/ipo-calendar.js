import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SEO from "../components/SEO";
import { iposAPI } from "../services/api";

// ✅ Safe Date Formatter (prevents invalid date crashes)
const formatDate = (date) => {
  if (!date) return "TBA";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "TBA";
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ✅ Convert date string -> local YYYY-MM-DD key (NO UTC shift)
const toLocalKey = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

// Event type styles
const EVENT_META = {
  open: { label: "Open ", color: "#10b981" },
  close: { label: "Close ", color: "#ef4444" },
  allotment: { label: "Allotment ", color: "#f97316" },
  listing: { label: "Listing ", color: "#3b82f6" },
};

export default function IPOCalendarPage() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Fetch IPOs
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const response = await iposAPI.getAll({ limit: 1000 });

        // Support both shapes
        // V2 Response Structure: { success: true, data: { ipos: [...] } }
        const iposArray = Array.isArray(response)
          ? response
          : response?.data?.ipos || response?.data || [];

        if (mounted) setIpos(iposArray);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load IPOs");
        if (mounted) setIpos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Track viewport for mobile list toggle
  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // ✅ Build events map keyed by local yyyy-mm-dd (NO UTC shift)
  const eventsByDay = useMemo(() => {
    const map = {};
    if (!Array.isArray(ipos)) return map;

    ipos.forEach((ipo) => {
      const dateEntries = [
        ["open", ipo?.dates?.open || ipo?.startDate],
        ["close", ipo?.dates?.close || ipo?.endDate],
        ["allotment", ipo?.dates?.allotment || ipo?.allotmentDate],
        ["listing", ipo?.dates?.listing || ipo?.listingDate],
      ];

      dateEntries.forEach(([type, value]) => {
        if (!value) return;

        const dayKey = toLocalKey(value);
        if (!dayKey) return;

        if (!map[dayKey]) map[dayKey] = [];
        map[dayKey].push({ type, date: value, ipo });
      });
    });

    // Sort events within a day
    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => {
        const t = new Date(a.date) - new Date(b.date);
        if (t !== 0) return t;
        return EVENT_META[a.type].label.localeCompare(EVENT_META[b.type].label);
      });
    });

    return map;
  }, [ipos]);

  // Helpers for calendar grid
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay(); // 0 Sun

  const dayCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(dateObj.getDate()).padStart(2, "0")}`;

      cells.push({
        day,
        key,
        events: eventsByDay[key] || [],
        showWatermark: false, // Default
      });
    }

    // ✅ Show "OpenIPO" watermark in ALL empty days
    const emptyIndices = cells
      .map((c, i) => (c && c.events.length === 0 ? i : -1))
      .filter((i) => i !== -1);

    // Mark ALL empty cells as having visible watermark
    emptyIndices.forEach((idx) => {
      if (cells[idx]) {
        cells[idx].hasWatermark = true;
        cells[idx].watermarkVisible = true;
      }
    });

    return cells;
  }, [startDay, daysInMonth, year, month, eventsByDay]);

  // Month navigation
  const goToMonth = (delta) => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + delta);
    setViewDate(next);
  };

  // Filter events for current month for mobile list
  const mobileEvents = useMemo(() => {
    const list = [];
    Object.entries(eventsByDay).forEach(([key, events]) => {
      const d = new Date(key);
      if (d.getFullYear() === year && d.getMonth() === month) {
        list.push({ key, dateObj: d, events });
      }
    });
    return list.sort((a, b) => a.dateObj - b.dateObj);
  }, [eventsByDay, year, month]);

  const monthLabel = viewDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const hasEventsThisMonth = mobileEvents.length > 0;

  return (
    <>
      <SEO
        title="Upcoming IPO Calendar 2026 - Open, Close & Listing Dates | OpenIPO"
        description="Check the latest IPO Calendar for upcoming IPOs in India. Track IPO Open Date, Closing Date, Allotment Date, and Listing Date for Mainboard and SME IPOs."
        canonical="https://openipo.in/ipo-calendar"
      />

      <div className="page">
        <header className="header">
          <div>
            <p className="eyebrow">Calendar</p>
            <h1>IPO Calendar</h1>
            <p className="subtitle">
              Track key IPO milestones across Open, Close, Allotment, and Listing dates.
            </p>
          </div>

          <div className="nav">
            <button onClick={() => goToMonth(-1)} aria-label="Previous month">
              ←
            </button>
            <span className="month">{monthLabel}</span>
            <button onClick={() => goToMonth(1)} aria-label="Next month">
              →
            </button>
          </div>
        </header>

        {loading ? (
          <div className="skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : isMobile ? (
          <div className="mobile-list">
            {hasEventsThisMonth ? (
              mobileEvents.map(({ key, dateObj, events }) => (
                <div key={key} className="day-card">
                  <div className="day-card-date">
                    {dateObj.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="badges">
                    {events.map((event, idx) => (
                      <button
                        key={`${event.ipo.slug}-${event.type}-${idx}`}
                        className="badge"
                        style={{ backgroundColor: EVENT_META[event.type].color + "1a" }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <span
                          className="dot"
                          style={{ backgroundColor: EVENT_META[event.type].color }}
                        />
                        {EVENT_META[event.type].label} • {event.ipo.companyName}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty">No IPO events this month</div>
            )}
          </div>
        ) : (
          <div className="calendar">
            <div className="weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid">
              {dayCells.map((cell, idx) =>
                cell ? (
                  <div key={cell.key} className={`cell ${cell.events.length ? "has-events" : ""}`}>
                    <div className="cell-header">
                      <span className="day-number">{cell.day}</span>
                      {cell.events.length > 0 && <span className="pill">{cell.events.length}</span>}
                    </div>

                    {cell.events.length === 0 && cell.hasWatermark && (
                      <div className={`watermark-container ${cell.watermarkVisible ? "visible" : "hidden"}`}>
                        <span className="seo-text">OpenIPO</span>
                      </div>
                    )}

                    <div className="event-list">
                      {cell.events.slice(0, 5).map((event, i) => (
                        <button
                          key={`${event.ipo.slug}-${event.type}-${i}`}
                          className="badge"
                          style={{ backgroundColor: EVENT_META[event.type].color + "1a" }}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <span
                            className="dot"
                            style={{ backgroundColor: EVENT_META[event.type].color }}
                          />
                          {EVENT_META[event.type].label}
                        </button>
                      ))}
                      {cell.events.length > 5 && (
                        <div className="more-events">+{cell.events.length - 5} more</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={`empty-${idx}`} className="cell empty" />
                )
              )}
            </div>

            {!hasEventsThisMonth && <div className="empty">No IPO events this month</div>}
          </div>
        )}

        {/* SEO Content Section */}
        <section className="seo-content">
          <h2>Upcoming IPO Calendar: Your Guide to Market Opportunities</h2>
          <p>
            The <strong>Upcoming IPO</strong> landscape in India is vibrant, with companies from diverse sectors lining up to go public.
            Our <strong>IPO Calendar</strong> is the ultimate tool for investors to stay ahead of the curve. It provides a comprehensive view of all critical dates,
            ensuring you never miss an application window or a listing debut.
          </p>

          <h3>Understanding IPO Timelines</h3>
          <p>
            Investing in an <Link href="/">IPO</Link> requires precise timing. The calendar highlights four key events:
          </p>
          <ul>
            <li><strong>Open Date:</strong> The day bidding starts. Only bids placed during this window are valid.</li>
            <li><strong>Close Date:</strong> The final day to submit your application. Most subscriptions happen on the last day.</li>
            <li><strong>Allotment Date:</strong> The day when the registrar announces who got shares. You can check this on our <Link href="/ipo-allotment">IPO Allotment Status</Link> page.</li>
            <li><strong>Listing Date:</strong> The day shares start trading on NSE and BSE.</li>
          </ul>

          <h3>Mainboard vs SME IPO Calendar</h3>
          <p>
            Our calendar tracks both Mainboard and SME IPOs. While Mainboard IPOs are from larger corporates, SME IPOs are from smaller enterprises offering higher risk-reward ratios.
            Before investing, it is wise to check the <Link href="/ipo-gmp">IPO GMP Today</Link> to understand the market sentiment.
          </p>

          <h3>How to Use This Calendar</h3>
          <p>
            Use this calendar to plan your funds. If multiple exciting IPOs are overlapping, you might need to allocate capital strategically.
            For beginners, we recommend reading <Link href="/what-is-ipo">What is IPO</Link> to understand the basics before diving into the schedule.
          </p>
        </section>
      </div>

      {selectedEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="logo-wrap">
                {selectedEvent.ipo.companyLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedEvent.ipo.companyLogo} alt={selectedEvent.ipo.companyName} />
                ) : (
                  <div className="logo-fallback">
                    {selectedEvent.ipo.companyName?.slice(0, 2)?.toUpperCase() || "IPO"}
                  </div>
                )}
              </div>

              <div>
                <p className="eyebrow">{EVENT_META[selectedEvent.type].label}</p>
                <h3>{selectedEvent.ipo.companyName}</h3>
                <p className="muted">
                  {(selectedEvent.ipo.type || "IPO") === "SME" ? "SME" : "Mainboard"} IPO
                </p>
              </div>

              <button className="close" onClick={() => setSelectedEvent(null)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="date-grid">
                {["open", "close", "allotment", "listing"].map((key) => {
                  const value =
                    selectedEvent.ipo?.dates?.[key] ||
                    (key === "open" ? selectedEvent.ipo?.startDate : null) ||
                    (key === "close" ? selectedEvent.ipo?.endDate : null) ||
                    (key === "allotment" ? selectedEvent.ipo?.allotmentDate : null) ||
                    (key === "listing" ? selectedEvent.ipo?.listingDate : null);

                  if (!value) return null;

                  return (
                    <div key={key} className="date-chip">
                      <span className="dot" style={{ backgroundColor: EVENT_META[key].color }} />
                      <span>{EVENT_META[key].label}</span>
                      <strong>{formatDate(value)}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer">
              <Link href={`/ipo/${selectedEvent.ipo.slug}`} className="primary-btn">
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ✅ UI CSS remains unchanged */}
      <style jsx>{`
        .page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 16px 64px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6b7280;
          font-size: 12px;
          margin: 0 0 4px 0;
        }
        h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          color: #0f172a;
        }
        .subtitle {
          margin: 0;
          color: #475569;
        }
        .nav {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav button {
          background: #e2e8f0;
          border: none;
          border-radius: 10px;
          width: 38px;
          height: 38px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .nav button:hover {
          background: #cbd5e1;
        }
        .month {
          font-weight: 700;
          color: #0f172a;
        }
        .calendar {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
          padding: 12px;
        }
        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          padding: 0 6px;
          color: #94a3b8;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 12px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }
        .cell {
          min-height: 120px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cell.has-events {
          border-color: #cbd5e1;
          box-shadow: inset 0 0 0 1px #e2e8f0;
        }
        .cell.empty {
          background: transparent;
          border: none;
          min-height: 80px;
        }
        .cell-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .day-number {
          font-weight: 700;
          color: #0f172a;
        }
        .pill {
          background: #e2e8f0;
          color: #475569;
          border-radius: 999px;
          padding: 2px 8px;
          font-size: 12px;
          font-weight: 600;
        }
        .event-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .badge {
          border: none;
          width: 100%;
          text-align: left;
          padding: 8px 10px;
          border-radius: 10px;
          color: #0f172a;
          font-weight: 600;
          background: #f8fafc;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.1s ease, box-shadow 0.15s ease;
        }
        .badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .empty {
          text-align: center;
          padding: 24px 0;
          font-weight: 600;
        }
        .watermark-container {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .watermark-container.visible {
            flex: 1;
            opacity: 0.4;
        }
        .watermark-container.hidden {
            position: absolute;
            inset: 0;
            z-index: -1;
            opacity: 0.01;
            overflow: hidden;
            pointer-events: none;
            height: 1px;
            width: 1px;
        }
        .seo-text {
          font-size: 0.9rem;
          color: #e2e8f0;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          user-select: none;
        }
        .more-events {
            font-size: 0.7rem;
            color: #64748b;
            text-align: center;
            font-weight: 600;
            padding-top: 2px;
        }
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        .skeleton-card {
          height: 120px;
          border-radius: 12px;
          background: linear-gradient(
            90deg,
            #f1f5f9 25%,
            #e2e8f0 50%,
            #f1f5f9 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .mobile-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .day-card {
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
        }
        .day-card-date {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .badges {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .error {
          padding: 16px;
          border-radius: 12px;
          background: #fee2e2;
          color: #b91c1c;
          font-weight: 600;
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 50;
        }
        .modal {
          background: #fff;
          border-radius: 16px;
          max-width: 520px;
          width: 100%;
          padding: 18px;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.18);
        }
        .modal-header {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 12px;
          align-items: center;
        }
        .logo-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .logo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .logo-fallback {
          font-weight: 700;
          color: #0f172a;
        }
        h3 {
          margin: 0;
          color: #0f172a;
        }
        .muted {
          margin: 2px 0 0 0;
          color: #64748b;
        }
        .close {
          background: #e2e8f0;
          border: none;
          border-radius: 10px;
          width: 32px;
          height: 32px;
          font-size: 18px;
          cursor: pointer;
          color: #0f172a;
        }
        .modal-body {
          margin-top: 12px;
        }
        .date-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 8px;
        }
        .date-chip {
          padding: 10px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 6px;
          align-items: center;
          font-size: 14px;
        }
        .date-chip strong {
          grid-column: 1 / -1;
          color: #0f172a;
        }
        .modal-footer {
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
        }
        .primary-btn {
          background: #0ea5e9;
          color: #fff;
          padding: 10px 16px;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(14, 165, 233, 0.35);
        }

        .seo-content {
            margin-top: 60px;
            background: #fff;
            padding: 30px;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
        }
        .seo-content h2 {
            font-size: 1.8rem;
            color: #1e293b;
            margin-bottom: 16px;
        }
        .seo-content h3 {
            font-size: 1.4rem;
            color: #334155;
            margin-top: 24px;
            margin-bottom: 12px;
        }
        .seo-content p {
            font-size: 1rem;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 12px;
        }
        .seo-content ul {
            padding-left: 20px;
            margin-bottom: 20px;
        }
        .seo-content li {
            margin-bottom: 8px;
            color: #475569;
        }
        .seo-content a {
            color: #2563eb;
            text-decoration: underline;
            font-weight: 600;
        }

        @media (max-width: 767px) {
          .calendar {
            display: none;
          }
          .nav {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </>
  );
}