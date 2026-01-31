import Link from "next/link";
import { getIPOStatusFromDates, isIPOApplyWindowOpen } from "../utils/ipo";
import { formatDate } from "../utils/date";

export default function IPORow({ ipo }) {
  // ✅ normalize dates
  const normalizedDates = {
    open: ipo?.startDate || "",
    close: ipo?.endDate || "",
    allotment: ipo?.allotmentDate || "",
    listing: ipo?.listingDate || "",
  };

  const rawStatus = getIPOStatusFromDates(normalizedDates);
  const status = rawStatus || "Upcoming";

  // ✅ Price band
  const priceBand =
    ipo?.minimumPrice && ipo?.maximumPrice
      ? `₹${ipo.minimumPrice} - ₹${ipo.maximumPrice}`
      : ipo?.minimumPrice
        ? `₹${ipo.minimumPrice}`
        : "Price TBA";

  // ✅ GMP Calculation
  const gmpValue = ipo?.gmpPrice ?? null;

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

  // ✅ Status Colors & Border
  const getStatusStyle = (s) => {
    switch (s) {
      case "Open":
        return {
          border: "#22c55e",
          badgeBg: "#dcfce7",
          badgeText: "#166534",
          dot: "#22c55e"
        };
      case "Upcoming":
        return {
          border: "#3b82f6",
          badgeBg: "#e0f2fe",
          badgeText: "#0369a1",
          dot: "#0ea5e9"
        };
      case "Closed":
        return {
          border: "#94a3b8",
          badgeBg: "#f1f5f9",
          badgeText: "#475569",
          dot: "#94a3b8"
        };
      case "Listed":
        return {
          border: "#64748b",
          badgeBg: "#f1f5f9",
          badgeText: "#0f172a",
          dot: "#cbd5e1"
        };
      case "Allotted":
        return {
          border: "#8b5cf6",
          badgeBg: "#f3e8ff",
          badgeText: "#6b21a8",
          dot: "#a855f7"
        };
      default:
        return {
          border: "#cbd5e1",
          badgeBg: "#f8fafc",
          badgeText: "#64748b",
          dot: "#cbd5e1"
        };
    }
  };

  const styles = getStatusStyle(status);

  return (
    <div className="ipo-card">
      <div className="card-main">
        {/* Header Section */}
        <div className="card-header">
          <div className="badge-row">
            <span className="live-badge" style={{ background: styles.badgeBg, color: styles.badgeText }}>
              <span className="dot" style={{ background: styles.dot }}></span>
              {status}
            </span>
            <span className="type-badge">
              {ipo?.type === "SME" ? "SME" : "Mainboard"}
            </span>


          </div>

          {/* Action Button: Allotment OR Apply (Mutually Exclusive) */}
          {(() => {
            const isOpenForApply = isIPOApplyWindowOpen(ipo?.startDate, ipo?.endDate);
            const applyLink = ipo?.docs?.applyLink || "https://angel-one.onelink.me/Wjgr/brmlvpa8";
            const isAllotted = ipo?.allotment?.isAllotted;
            const allotmentLink = ipo?.allotment?.allotmentLink;

            // Priority 1: Allotment Out
            if (isAllotted && allotmentLink) {
              return (
                <a
                  href={allotmentLink}
                  target="_blank"
                  className="allot-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  Allotment Out
                </a>
              );
            }

            // Priority 2: Apply Now
            if (status === "Open" && isOpenForApply) {
              return (
                <a
                  href={applyLink}
                  target="_blank"
                  className="apply-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  Apply Now
                </a>
              );
            }
            return null;
          })()}
        </div>

        <Link href={`/ipo/${ipo?.slug || ""}`} className="content-link" target="_blank">
          <div className="content-row">
            <div className="logo-wrapper">
              {ipo?.logo ? (
                <img src={ipo.logo} alt={ipo.companyName} className="row-logo" />
              ) : (
                <div className="row-logo-placeholder">{ipo?.companyName?.charAt(0)}</div>
              )}
            </div>

            <div className="details-col">
              <h3 className="company-name">{ipo?.companyName}</h3>
              <div className="price-row">{priceBand}</div>

              {/* GMP Section Inside Link for alignment */}
              {gmpValue !== null && (
                <div className="gmp-display">
                  <span className="gmp-label">GMP*</span>
                  <span className="gmp-val">₹{gmpValue}</span>
                  {returnPercent && <span className="gmp-pct">({returnPercent}%)</span>}
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Timeline Section */}
      <div className="timeline-section">
        <div className="timeline-grid">
          <div className="time-item">
            <span className="t-label">Open</span>
            <span className="t-val">{formatDate(normalizedDates.open)}</span>
          </div>
          <div className="time-item">
            <span className="t-label">Close</span>
            <span className="t-val">{formatDate(normalizedDates.close)}</span>
          </div>
          <div className="time-item">
            <span className="t-label">Allotment</span>
            <span className="t-val">{formatDate(normalizedDates.allotment)}</span>
          </div>
          <div className="time-item">
            <span className="t-label">Listing</span>
            <span className="t-val">{formatDate(normalizedDates.listing)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ipo-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          /* Removed hover effects as per user request */
        }


        .ipo-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: ${styles.border};
        }

        .card-main {
            padding: 16px 16px 16px 24px; /* Left padding for border */
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }

        .badge-row {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .live-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.7rem;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 6px;
            text-transform: uppercase;
        }

        .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
        }

        .type-badge {
            font-size: 0.7rem;
            font-weight: 600;
            color: #64748b;
            background: #f1f5f9;
            padding: 4px 8px;
            border-radius: 6px;
        }

        .allot-badge {
            font-size: 0.7rem;
            font-weight: 700;
            color: #fff;
            background: #e11d48; /* Pink/Red for attention */
            padding: 4px 8px;
            border-radius: 6px;
            text-decoration: none;
            box-shadow: 0 2px 4px rgba(225, 29, 72, 0.4);
            animation: pulse-badge 2s infinite;
        }

        @keyframes pulse-badge {
            0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.7); }
            70% { box-shadow: 0 0 0 4px rgba(225, 29, 72, 0); }
            100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }

        .apply-btn {
            font-size: 0.75rem;
            font-weight: 700;
            color: #fff;
            background: #000;
            padding: 6px 12px;
            border-radius: 8px;
            text-decoration: none;
            transition: opacity 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .apply-btn:hover {
            opacity: 0.8;
        }
        
        .allot-btn {
            font-size: 0.75rem;
            font-weight: 700;
            color: #fff;
            background: #e11d48;
            padding: 6px 12px;
            border-radius: 8px;
            text-decoration: none;
            transition: opacity 0.2s;
            box-shadow: 0 2px 4px rgba(225, 29, 72, 0.3);
            animation: pulse-badge 2s infinite;
        }
        .allot-btn:hover {
            opacity: 0.9;
        }

        .content-link {
            text-decoration: none;
            display: block;
        }

        .content-row {
            display: flex;
            gap: 16px;
            align-items: flex-start;
        }

        .logo-wrapper {
            flex-shrink: 0;
            padding-top: 0; /* Align with top */
        }
        
        .row-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
            border-radius: 8px;
            background: #f8fafc;
            border: 1px solid #f1f5f9;
        }
        
        .row-logo-placeholder {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f1f5f9;
            color: #64748b;
            font-weight: 700;
            border-radius: 8px;
            font-size: 2rem;
            border: 1px solid #e2e8f0;
        }

        .details-col {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .company-name {
            font-size: 1.15rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
            line-height: 1.2;
        }
        
        .price-row {
            font-size: 0.9rem;
            color: #475569;
            font-weight: 500;
            margin: 0;
        }

        .gmp-display {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 2px;
            font-size: 0.9rem;
        }
        
        .gmp-label {
            font-size: 0.7rem;
            font-weight: 700;
            color: #64748b;
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
        }

        .gmp-val {
            font-weight: 700;
            color: #0f172a; /* Black/Dark Gray */
        }
        
        .gmp-pct {
            color: #334155; /* Neutral Dark Gray */
            font-size: 0.8rem;
        }

        .timeline-section {
            background: #f8fafc;
            border-top: 1px solid #f1f5f9;
            padding: 12px 16px 12px 24px;
        }

        .timeline-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }

        .time-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .t-label {
            font-size: 0.65rem;
            color: #94a3b8;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .t-val {
            font-size: 0.8rem;
            font-weight: 600;
            color: #334155;
        }

        @media (max-width: 640px) {
            .timeline-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }
        }
      `}</style>
    </div>
  );
}
