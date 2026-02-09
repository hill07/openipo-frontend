import Link from "next/link";
import { formatDate } from "../utils/date";

export default function ClosedIPOTable({ ipos }) {
    return (
        <div className="table-container">
            <table className="closed-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-mobile">Issue Price</th>
                        <th>Listing Date</th>
                        <th>Final GMP</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {ipos.map((ipo) => {
                        const maxP = parseFloat(ipo.maximumPrice || 0);
                        const gmp = parseFloat(ipo.gmpPrice || 0);
                        const gain = (maxP && gmp) ? ((gmp / maxP) * 100).toFixed(0) : null;

                        return (
                            <tr key={ipo._id || ipo.ipoId}>
                                <td>
                                    <div className="company-cell">
                                        <div className="type-dot" title={ipo.type}></div>
                                        <div className="meta">
                                            <Link href={`/ipo/${ipo.slug}`} className="name-link">
                                                {ipo.companyName}
                                            </Link>
                                            <span className="type-mobile">{ipo.type}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="hide-mobile">
                                    {ipo.maximumPrice ? `₹${ipo.maximumPrice}` : "-"}
                                </td>
                                <td>
                                    {ipo.listingDate ? formatDate(ipo.listingDate) : "Wait..."}
                                </td>
                                <td>
                                    {gmp ? (
                                        <div className="gmp-cell">
                                            <span className="val">₹{gmp}</span>
                                            {gain && <span className="pct">+{gain}%</span>}
                                        </div>
                                    ) : <span className="text-muted">-</span>}
                                </td>
                                <td>
                                    <Link href={`/ipo/${ipo.slug}`} className="arrow-link">
                                        &rarr;
                                    </Link>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <style jsx>{`
        .table-container {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .closed-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        th {
          text-align: left;
          padding: 14px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          color: #64748b;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
          color: #334155;
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover td {
          background-color: #f8fafc;
        }

        .company-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .type-dot {
          width: 8px;
          height: 8px;
          background: #3b82f6; /* Mainboard blue */
          border-radius: 50%;
          flex-shrink: 0;
        }

        .meta {
           display: flex;
           flex-direction: column;
           gap: 2px;
        }

        .name-link {
          font-weight: 600;
          color: #0f172a;
          text-decoration: none;
        }
        .name-link:hover {
          text-decoration: underline;
        }

        .type-mobile {
          display: none;
          font-size: 0.65rem;
          color: #94a3b8;
        }

        .gmp-cell {
          display: flex;
          flex-direction: column;
        }
        .val { font-weight: 600; }
        .pct { font-size: 0.75rem; color: #16a34a; }

        .text-muted { color: #cbd5e1; }

        .arrow-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.2s;
        }
        .arrow-link:hover {
          background: #0f172a;
          color: #fff;
        }

        @media (max-width: 640px) {
          .hide-mobile {
            display: none;
          }
          .type-mobile {
            display: block;
          }
        }
      `}</style>
        </div>
    );
}
