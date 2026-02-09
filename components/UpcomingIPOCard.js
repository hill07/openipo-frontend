import Link from "next/link";
import { formatDate } from "../utils/date";

export default function UpcomingIPOCard({ ipo }) {
  const { companyName, type, slug, startDate, maximumPrice, minimumPrice } = ipo;

  const priceRange = minimumPrice && maximumPrice
    ? `₹${minimumPrice} - ₹${maximumPrice}`
    : "Price TBA";

  return (
    <div className="upcoming-card">
      <div className="main-info">
        <div className="badge-row">
          <span className="status-badge">
            Upcoming
          </span>
          <span className="type-badge">{type === "SME" ? "SME" : "Mainboard"}</span>
        </div>

        <div className="logo-row">
          {ipo.logo ? (
            <img src={ipo.logo} alt={companyName} className="logo-img" />
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
          <span className="label">Opens On</span>
          <span className="value">{formatDate(startDate)}</span>
        </div>

        <div className="stat-box highlight">
          <span className="label">Price Band</span>
          <span className="value">{priceRange}</span>
        </div>
      </div>

      <div className="action-area">
        <Link href={`/ipo/${slug}`} className="view-btn">
          View Details &rarr;
        </Link>
      </div>

      <style jsx>{`
        .upcoming-card {
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

        .upcoming-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: #3b82f6; /* Blue for Upcoming */
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
          color: #1d4ed8;
          background: #dbeafe;
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
