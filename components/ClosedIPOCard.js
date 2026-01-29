import Link from "next/link";
import { formatDate } from "../utils/date";

export default function ClosedIPOCard({ ipo }) {
  const {
    companyName,
    type,
    slug,
    listingDate,
    minimumPrice,
    maximumPrice,
    gmpPrice,
    logo
  } = ipo;

  // Calculate listing gains if available
  const maxP = parseFloat(maximumPrice);
  const gmpP = parseFloat(gmpPrice);
  const listingPrice = (maxP && gmpP) ? (maxP + gmpP) : null;
  const gainPct = (maxP && gmpP) ? ((gmpP / maxP) * 100).toFixed(1) : null;

  const priceRange = minimumPrice && maximumPrice
    ? `₹${minimumPrice} - ₹${maximumPrice}`
    : "Price TBA";

  return (
    <div className="closed-card">
      <div className="main-info">
        <div className="badge-row">
          <span className="status-badge">
            Listed
          </span>
          <span className="type-badge">{type === "SME" ? "SME" : "Mainboard"}</span>
        </div>

        <div className="logo-row">
          {logo ? (
            <img src={logo} alt={companyName} className="logo-img" />
          ) : (
            <div className="logo-placeholder">{companyName?.charAt(0)}</div>
          )}
          <Link href={`/ipo/${slug}`} className="company-link">
            <h3 className="company-name">{companyName}</h3>
          </Link>
        </div>
        <div className="price-row">{priceRange}</div>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <span className="label">Listed Price</span>
          <span className="value">{listingPrice ? `₹${listingPrice}` : "--"}</span>
        </div>

        <div className="stat-box highlight">
          <span className="label">Listing Gain</span>
          {gainPct ? (
            <span className="gain-tag">+{gainPct}%</span>
          ) : (
            <span className="value text-muted">--</span>
          )}
        </div>
      </div>

      <div className="action-area">
        <Link href={`/ipo/${slug}`} className="view-btn">
          View Performance &rarr;
        </Link>
      </div>

      <style jsx>{`
        .closed-card {
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
        }

        .closed-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: #64748b; /* Gray for Closed/Listed */
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
          color: #854d0e;
          background: #fef9c3;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
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

        .gain-tag {
            color: #16a34a;
            font-weight: 700;
            font-size: 0.9rem;
            background: #dcfce7;
            padding: 2px 6px;
            border-radius: 4px;
            width: fit-content;
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
