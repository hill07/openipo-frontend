import Link from "next/link";
import { formatDate } from "../utils/date";

export default function IPOCard({ ipo, status }) {
  const {
    companyName,
    type,
    slug,
    logo,
    startDate, // Open Date
    endDate,   // Close Date
    listingDate,
    minimumPrice,
    maximumPrice,
    gmpPrice
  } = ipo;

  const priceRange = minimumPrice && maximumPrice
    ? `₹${minimumPrice} - ₹${maximumPrice}`
    : "Price TBA";

  // --- Dynamic Logic based on Status ---
  let stripeColor = "#3b82f6"; // Default Blue (Upcoming)
  let badgeText = "Upcoming";
  let badgeColor = "#dbeafe";
  let badgeTextColor = "#1d4ed8";
  let stat1Label = "Opens On";
  let stat1Value = formatDate(startDate);
  let stat2Label = "Price Band";
  let stat2Value = priceRange;
  let highlightStat2 = true; // Highlight the GMP/Price box

  if (status === "UPCOMING") {
    stat2Label = "GMP*";
    // stat2Value will be derived from gmpPrice in renderStat2
  } else if (status === "OPEN") {
    stripeColor = "#22c55e"; // Green
    badgeText = "Live";
    badgeColor = "#dcfce7";
    badgeTextColor = "#15803d";
    stat1Label = "Closes On";
    stat1Value = formatDate(endDate);
    stat2Label = "GMP*";
    // stat2Value calculated below
  } else if (status === "CLOSED" || status === "LISTED") {
    stripeColor = "#64748b"; // Gray
    badgeText = status === "LISTED" ? "Listed" : "Closed";
    badgeColor = status === "LISTED" ? "#fef3c7" : "#f1f5f9";
    badgeTextColor = status === "LISTED" ? "#b45309" : "#64748b";

    if (status === "LISTED") {
      stat1Label = "Listed On";
      stat1Value = formatDate(listingDate);
      stat2Label = "GMP*"; // User requested "only GMP"
    } else {
      stat1Label = "Listing On";
      stat1Value = formatDate(listingDate);
      stat2Label = "GMP*";
    }
  }

  // --- Calculations ---
  const maxP = parseFloat(maximumPrice);
  const gmpP = parseFloat(gmpPrice);
  const gainPct = (maxP && gmpP) ? ((gmpP / maxP) * 100).toFixed(1) : null;

  const renderStat2 = () => {
    if (!gmpPrice) return <span className="value text-muted">--</span>;

    return (
      <div className="gmp-val">
        <span>₹{gmpPrice}</span>
        {gainPct && <span className="gain-tag">({gainPct}%)</span>}
      </div>
    );
  };



  return (
    <div className="ipo-card">
      <div className="main-info">
        <div className="badge-row">
          <span className="status-badge">
            {status === "OPEN" && <span className="pulse-dot"></span>}
            {badgeText}
          </span>
          <span className="type-badge">{type === "SME" ? "SME" : "Mainboard"}</span>
        </div>

        <div className="logo-row">
          {logo ? (
            <img src={logo} alt={companyName} className="logo-img" />
          ) : (
            <div className="logo-placeholder">{companyName?.charAt(0) || "I"}</div>
          )}
          <Link href={`/ipo/${slug}`} className="company-link">
            <h3 className="company-name">{companyName}</h3>
          </Link>
        </div>
        <div className="price-row">Price : {priceRange}</div>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <span className="label">{stat1Label}</span>
          <span className="value">{stat1Value || "Wait..."}</span>
        </div>

        <div className="stat-box highlight">
          <span className="label">{stat2Label}</span>
          {renderStat2()}
        </div>
      </div>

      <div className="action-area">
        <Link href={`/ipo/${slug}`} className="view-btn">
          {status === "LISTED" ? "View Details" : "View Details"} &rarr;
        </Link>
      </div>

      <style jsx>{`
        .ipo-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .ipo-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: ${stripeColor};
          transition: background 0.3s;
        }

        .ipo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .badge-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: ${badgeTextColor};
          background: ${badgeColor};
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        
        .pulse-dot {
          width: 6px;
          height: 6px;
          background: ${badgeTextColor};
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .type-badge {
          font-size: 0.7rem;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .company-link {
          text-decoration: none;
        }

        .logo-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 4px;
        }
        
        .logo-img {
            width: 40px;
            height: 40px;
            object-fit: contain;
            border-radius: 8px;
            background: #f8fafc;
        }
        
        .logo-placeholder {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f1f5f9;
            color: #64748b;
            font-weight: 700;
            border-radius: 8px;
        }

        .company-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.2;
        }

        .price-row {
          font-size: 0.95rem;
          color: #475569;
          font-weight: 500;
        }

        .stats-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: #f8fafc;
          padding: 12px;
          border-radius: 12px;
        }

        .stat-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .label {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
        }

        .value {
            font-size: 0.95rem;
            font-weight: 600;
            color: #334155;
        }
        
        .text-muted { color: #cbd5e1; }

        .gmp-val {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 600;
        }

        .gain-tag {
            color: #16a34a;
            font-weight: 700;
            font-size: 0.85rem;
            background: #dcfce7;
            padding: 2px 6px;
            border-radius: 4px;
        }

        .action-area {
          margin-top: auto;
        }

        .view-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 10px;
          background: #0f172a;
          color: #fff;
          font-weight: 600;
          text-decoration: none;
          border-radius: 10px;
          transition: background 0.2s;
        }

        .view-btn:hover {
          background: #1e293b;
        }
      `}</style>
    </div>
  );
}
