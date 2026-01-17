import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import AdminLayout from "../../../components/AdminLayout";
import { adminAPI } from "../../../services/api";
import { getIPOStatusFromDates } from "../../../utils/ipo";

export default function AdminIPOsList() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadIPOs();
  }, []);

  const loadIPOs = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllIPOs();
      setIpos(data.data || []);
    } catch (err) {
      setError(err.message || "Failed to load IPOs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, companyName) => {
    if (!confirm(`Are you sure you want to delete "${companyName}"?`)) return;

    try {
      await adminAPI.deleteIPO(id);
      alert("IPO deleted successfully");
      loadIPOs();
    } catch (err) {
      alert(err.message || "Failed to delete IPO");
    }
  };

  const filteredIPOs = searchQuery
    ? ipos.filter(ipo =>
        ipo.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ipo.slug?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ipos;

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p>Loading IPOs...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Manage IPOs | Admin Panel</title>
      </Head>

      <div className="ipos-page">
        <div className="page-header">
          <h1>Manage IPOs ({filteredIPOs.length})</h1>
          <Link href="/admin/ipos/new" className="btn-primary">
            + Create New IPO
          </Link>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by company name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="ipos-table">
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Slug</th>
                <th>Type</th>
                <th>Status</th>
                <th>Price Band</th>
                <th>GMP</th>
                <th>Open Date</th>
                <th>Close Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIPOs.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "40px" }}>
                    {searchQuery ? "No IPOs found matching your search." : "No IPOs found. Create your first IPO!"}
                  </td>
                </tr>
              ) : (
                filteredIPOs.map((ipo) => {
                  const status = getIPOStatusFromDates(ipo.dates || {});
                  return (
                    <tr key={ipo._id}>
                      <td>
                        <Link href={`/ipo/${ipo.slug}`} target="_blank" className="company-link">
                          {ipo.companyName || "—"}
                        </Link>
                      </td>
                      <td className="slug-cell">{ipo.slug || "—"}</td>
                      <td>{ipo.ipoType || "—"}</td>
                      <td>
                        <span className={`status-badge status-${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                      <td>{ipo.pricing?.priceBand || "—"}</td>
                      <td>{ipo.gmp?.current ? `₹${ipo.gmp.current}` : "—"}</td>
                      <td>
                        {ipo.dates?.open
                          ? new Date(ipo.dates.open).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                      <td>
                        {ipo.dates?.close
                          ? new Date(ipo.dates.close).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                      <td className="actions-cell">
                        <Link href={`/admin/ipos/${ipo._id}/edit`} className="btn-edit">
                          Edit
                        </Link>
                        <Link href={`/ipo/${ipo.slug}`} target="_blank" className="btn-view">
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(ipo._id, ipo.companyName)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .ipos-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
        }

        .btn-primary {
          padding: 10px 20px;
          background: #008080;
          color: #fff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.875rem;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #006666;
        }

        .search-bar {
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          max-width: 500px;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.875rem;
          outline: none;
        }

        .search-input:focus {
          border-color: #2563eb;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .ipos-table {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f8fafc;
          padding: 12px;
          text-align: left;
          font-weight: 700;
          font-size: 0.875rem;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        td {
          padding: 12px;
          border-top: 1px solid #e5e7eb;
          font-size: 0.875rem;
          color: #334155;
        }

        .company-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .company-link:hover {
          text-decoration: underline;
        }

        .slug-cell {
          font-family: monospace;
          font-size: 0.8rem;
          color: #64748b;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .status-upcoming {
          background: #e0f2fe;
          color: #0284c7;
        }

        .status-open {
          background: #dcfce7;
          color: #15803d;
        }

        .status-closed {
          background: #f1f5f9;
          color: #334155;
        }

        .status-allotted {
          background: #ffedd5;
          color: #b45309;
        }

        .status-listed {
          background: #ecfdf5;
          color: #14532d;
        }

        .actions-cell {
          display: flex;
          gap: 8px;
        }

        .btn-edit,
        .btn-view,
        .btn-delete {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-edit {
          background: #dbeafe;
          color: #1e40af;
        }

        .btn-edit:hover {
          background: #bfdbfe;
        }

        .btn-view {
          background: #f0fdf4;
          color: #166534;
        }

        .btn-view:hover {
          background: #dcfce7;
        }

        .btn-delete {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-delete:hover {
          background: #fecaca;
        }

        @media (max-width: 1024px) {
          .ipos-table {
            overflow-x: auto;
          }

          table {
            min-width: 1000px;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .search-input {
            max-width: 100%;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
