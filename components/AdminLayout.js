import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");

    if (!token || !user) {
      router.push("/admin/login");
      return;
    }

    try {
      setAdminUser(JSON.parse(user));
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin Panel | OpenIPO</title>
      </Head>

      <div className="admin-layout">
        <nav className="admin-nav">
          <div className="nav-container">
            <Link href="/admin" className="nav-logo">
              OpenIPO Admin
            </Link>
            <div className="nav-links">
              <Link href="/admin">Dashboard</Link>
              <Link href="/admin/ipos">IPOs</Link>
              <Link href="/admin/ipos/new">New IPO</Link>
            </div>
            <div className="nav-user">
              <span>{adminUser.name || adminUser.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="admin-content">{children}</main>
      </div>

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          background: #f8fafc;
        }

        .admin-nav {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          padding: 12px 20px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-logo {
          font-size: 1.1rem;
          font-weight: 900;
          color: #008080;
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 16px;
          flex: 1;
        }

        .nav-links a {
          color: #475569;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 6px 12px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .nav-links a:hover {
          background: #f1f5f9;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.875rem;
          color: #64748b;
        }

        .logout-btn {
          padding: 6px 12px;
          background: #fee2e2;
          color: #991b1b;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .logout-btn:hover {
          background: #fecaca;
        }

        .admin-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }

        @media (max-width: 768px) {
          .nav-container {
            flex-wrap: wrap;
          }

          .nav-links {
            order: 3;
            width: 100%;
          }

          .admin-content {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
}
