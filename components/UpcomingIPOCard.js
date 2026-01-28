import Link from "next/link";
import { formatDate } from "../utils/date";

export default function UpcomingIPOCard({ ipo }) {
    const { companyName, type, slug, startDate, maximumPrice, minimumPrice } = ipo;

    const priceRange = minimumPrice && maximumPrice
        ? `₹${minimumPrice} - ₹${maximumPrice}`
        : "Price TBA";

    return (
        <Link href={`/ipo/${slug}`} className="upcoming-card">
            <div className="card-content">
                <div className="top-badge">{type === "SME" ? "SME" : "Mainboard"}</div>

                <div className="company-info">
                    {/* Placeholder for Logo if we had one, for now just first letter */}
                    <div className="logo-placeholder">
                        {companyName?.charAt(0) || "I"}
                    </div>
                    <h3 className="company-name">{companyName}</h3>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <span className="label">Opens On</span>
                        <span className="value text-blue">{formatDate(startDate)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Price Band</span>
                        <span className="value">{priceRange}</span>
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <span>View Details</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                </svg>
            </div>

            <style jsx>{`
        .upcoming-card {
          display: block;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          overflow: hidden;
          position: relative;
        }

        .upcoming-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .card-content {
          padding: 20px;
        }

        .top-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #f1f5f9;
          color: #64748b;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 20px;
          text-transform: uppercase;
        }

        .company-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 20px;
          margin-top: 10px;
        }

        .logo-placeholder {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
          color: #0284c7;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .company-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px dashed #e2e8f0;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .label {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
        }

        .value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
        }
        
        .text-blue {
          color: #0284c7;
        }

        .card-footer {
          background: #f8fafc;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          border-top: 1px solid #f1f5f9;
        }

        .upcoming-card:hover .card-footer {
          background: #f0f9ff;
          color: #0284c7;
        }
      `}</style>
        </Link>
    );
}
