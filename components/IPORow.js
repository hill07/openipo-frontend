import Link from "next/link";
import { useState, useEffect } from "react";
import { getIPOStatusFromDates } from "../utils/ipo";
import { formatDate } from "../utils/date";
import { isIPOSaved, toggleIPO } from "../utils/watchlist";

export default function IPORow({ ipo }) {
  const [isSaved, setIsSaved] = useState(false);

  /**
   * ✅ Support BOTH formats:
   * Old format: ipo.dates.open, ipo.pricing.priceBand, ipo.gmp.current
   * New DB format: startDate/endDate/allotmentDate/listingDate + min/max price
   */
  const normalizedDates = ipo?.dates || {
    open: ipo?.startDate || "",
    close: ipo?.endDate || "",
    allotment: ipo?.allotmentDate || "",
    listing: ipo?.listingDate || "",
  };

  const status = getIPOStatusFromDates(normalizedDates);

  // ✅ Watchlist (based on slug)
  useEffect(() => {
    if (!ipo?.slug) return;

    setIsSaved(isIPOSaved(ipo.slug));
    const handleWatchlistChange = () => setIsSaved(isIPOSaved(ipo.slug));

    window.addEventListener("watchlist-changed", handleWatchlistChange);
    return () => window.removeEventListener("watchlist-changed", handleWatchlistChange);
  }, [ipo?.slug]);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!ipo?.slug) return;
    toggleIPO(ipo.slug);
  };

  // ✅ Price band support
  const priceBand =
    ipo?.pricing?.priceBand ||
    (ipo?.minimumPrice && ipo?.maximumPrice
      ? `${ipo.minimumPrice} - ${ipo.maximumPrice}`
      : ipo?.minimumPrice
      ? `${ipo.minimumPrice}`
      : "");

  // --- Helpers for Financials ---
  const gmpValue = ipo?.gmp?.current ?? ipo?.gmpPrice ?? null;

  // Extract max price for calculation
  const getMaxPrice = (band) => {
    if (!band) return 0;
    const parts = band.toString().replace(/[₹,]/g, "").split("-");
    const max = parseFloat(parts[parts.length - 1].trim());
    return isNaN(max) ? 0 : max;
  };

  const maxPrice = getMaxPrice(priceBand);
  let returnPercent = null;

  if (gmpValue !== null && maxPrice > 0) {
    returnPercent = ((gmpValue / maxPrice) * 100).toFixed(1);
  }

  // Visual helpers
  const getStatusColor = (s) => {
    switch (s) {
      case "Open":
        return { bg: "#dcfce7", text: "#166534", dot: "#22c55e" };
      case "Upcoming":
        return { bg: "#e0f2fe", text: "#0369a1", dot: "#0ea5e9" };
      case "Closed":
        return { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" };
      default:
        return { bg: "#f8fafc", text: "#64748b", dot: "#cbd5e1" };
    }
  };
  const statusColors = getStatusColor(status);

  return (
    <div className="ipo-card">
      {/* --- Header: Name & Meta --- */}
      <div className="card-header">
        <div className="header-left">
          {/* ✅ Link uses slug */}
          <Link href={`/ipo/${ipo?.slug || ""}`} className="company-link">
            <h3 className="company-name">{ipo?.companyName}</h3>
          </Link>

          {/* ✅ type label fallback */}
          <span className="sector-badge">
            {ipo?.type === "SME" ? "SME" : "Mainboard"}
          </span>
        </div>

        <div className="header-right">
          <div
            className="status-badge"
            style={{ background: statusColors.bg, color: statusColors.text }}
          >
            <span className="status-dot" style={{ background: statusColors.dot }}></span>
            {status}
          </div>

          <button
            className={`save-btn ${isSaved ? "active" : ""}`}
            onClick={handleSaveClick}
            aria-label="Toggle Watchlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- Financials Grid --- */}
      <div className="stats-grid">
        {/* Price */}
        <div className="stat-item">
          <span className="stat-label">Price Range</span>
          <span className="stat-value">{priceBand || "TBA"}</span>
        </div>

        {/* GMP & Return */}
        <div className="stat-item highlight">
          <span className="stat-label">GMP*</span>
          {gmpValue !== null ? (
            <div className="gmp-group">
              <span className="gmp-val">₹{gmpValue}</span>
              {returnPercent && <span className="gmp-pct">({returnPercent}%)</span>}
            </div>
          ) : (
            <span className="stat-value text-muted">—</span>
          )}
        </div>
      </div>

      {/* --- Timeline Grid (4 Cols) --- */}
      <div className="timeline-grid">
        <div className="time-item">
          <span className="time-label">Open</span>
          <span className="time-val">{formatDate(normalizedDates?.open)}</span>
        </div>
        <div className="time-item">
          <span className="time-label">Close</span>
          <span className="time-val">{formatDate(normalizedDates?.close)}</span>
        </div>
        <div className="time-item">
          <span className="time-label">Allotment</span>
          <span className="time-val">{formatDate(normalizedDates?.allotment)}</span>
        </div>
        <div className="time-item">
          <span className="time-label">Listing</span>
          <span className="time-val">{formatDate(normalizedDates?.listing)}</span>
        </div>
      </div>

      <style jsx>{`
        .ipo-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 0px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .company-link {
          text-decoration: none;
          width: fit-content;
        }

        .company-name {
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.3;
        }

        .sector-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 500;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          width: fit-content;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .save-btn {
          background: transparent;
          border: none;
          padding: 4px;
          color: #cbd5e1;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .save-btn.active {
          color: #f59e0b;
        }
        .save-btn svg {
          width: 22px;
          height: 22px;
        }

        .stats-grid {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-value {
          font-family: 'Roboto Mono', monospace;
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
        }

        .text-muted {
          color: #cbd5e1;
        }

        .gmp-group {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .gmp-val {
          font-family: 'Roboto Mono', monospace;
          font-weight: 700;
          font-size: 1rem;
          color: #15803d;
        }

        .gmp-pct {
          font-size: 0.75rem;
          font-weight: 600;
          color: #16a34a;
        }

        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          border-top: 1px dashed #e2e8f0;
          padding-top: 12px;
        }

        .time-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .time-label {
          font-size: 0.65rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .time-val {
          font-size: 0.8rem;
          font-weight: 600;
          color: #0f172a;
        }

        @media (max-width: 640px) {
          .stats-grid {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .timeline-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px 10px;
          }
        }
      `}</style>
    </div>
  );
}
