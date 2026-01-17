import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import AdminLayout from "../../components/AdminLayout";
import { adminAPI } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await adminAPI.getDashboard();
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#dc2626" }}>
          <p>{error}</p>
          <button onClick={loadDashboard} style={{ marginTop: "16px", padding: "8px 16px" }}>
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard | OpenIPO</title>
      </Head>

      <div className="dashboard">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total IPOs</div>
            <div className="stat-value">{stats?.counts?.total || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Open IPOs</div>
            <div className="stat-value highlight">{stats?.counts?.open || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Upcoming IPOs</div>
            <div className="stat-value">{stats?.counts?.upcoming || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Closed IPOs</div>
            <div className="stat-value">{stats?.counts?.closed || 0}</div>
          </div>
        </div>

        <div className="actions-section">
          <Link href="/admin/ipos/new" className="action-button primary">
            + Create New IPO
          </Link>
          <Link href="/admin/ipos" className="action-button secondary">
            View All IPOs →
          </Link>
        </div>

        {stats?.recentlyUpdated && stats.recentlyUpdated.length > 0 && (
          <div className="recent-section">
            <h2>Recently Updated IPOs</h2>
            <div className="recent-list">
              {stats.recentlyUpdated.map((ipo) => (
                <Link
                  key={ipo._id}
                  href={`/admin/ipos/${ipo._id}/edit`}
                  className="recent-item"
                >
                  <div className="recent-name">{ipo.companyName}</div>
                  <div className="recent-date">
                    {new Date(ipo.meta?.lastUpdated).toLocaleString("en-IN")}
                  </div>
                  <div className="recent-link">Edit →</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 32px 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
        }

        .stat-value.highlight {
          color: #008080;
        }

        .actions-section {
          display: flex;
          gap: 16px;
          margin-bottom: 40px;
        }

        .action-button {
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s;
          display: inline-block;
        }

        .action-button.primary {
          background: #008080;
          color: #fff;
        }

        .action-button.primary:hover {
          background: #006666;
        }

        .action-button.secondary {
          background: #fff;
          color: #008080;
          border: 1px solid #008080;
        }

        .action-button.secondary:hover {
          background: #f0fdfa;
        }

        .recent-section {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
        }

        .recent-section h2 {
          font-size: 1.25rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 20px 0;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .recent-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: background 0.2s;
        }

        .recent-item:hover {
          background: #f1f5f9;
        }

        .recent-name {
          font-weight: 600;
          color: #0f172a;
          flex: 1;
        }

        .recent-date {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 16px;
        }

        .recent-link {
          color: #2563eb;
          font-weight: 600;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .actions-section {
            flex-direction: column;
          }

          .recent-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .recent-date {
            margin: 0;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
