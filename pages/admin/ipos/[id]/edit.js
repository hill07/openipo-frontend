import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import AdminLayout from "../../../../components/AdminLayout";
import { adminAPI } from "../../../../services/api";
import IPOForm from "../../../../components/admin/IPOForm";

export default function EditIPO() {
  const router = useRouter();
  const { id } = router.query;
  const [ipo, setIpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadIPO();
    }
  }, [id]);

  const loadIPO = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getIPO(id);
      setIpo(data);
    } catch (err) {
      setError(err.message || "Failed to load IPO");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError("");
      
      // Remove meta.lastUpdated from formData - backend will handle it
      // Preserve other meta fields if they exist
      if (formData.meta) {
        const { lastUpdated, ...restMeta } = formData.meta;
        formData.meta = restMeta;
      }

      await adminAPI.updateIPO(id, formData);
      alert("IPO updated successfully!");
      router.push("/admin/ipos");
    } catch (err) {
      setError(err.message || "Failed to update IPO");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p>Loading IPO...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !ipo) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#dc2626" }}>
          <p>{error}</p>
          <button onClick={() => router.back()} style={{ marginTop: "16px", padding: "8px 16px" }}>
            Go Back
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit IPO: {ipo?.companyName} | Admin Panel</title>
      </Head>

      <div className="edit-ipo-page">
        <div className="page-header">
          <h1>Edit IPO: {ipo?.companyName || "Loading..."}</h1>
          <div className="header-actions">
            <Link href={`/ipo/${ipo?.slug}`} target="_blank" className="btn-view">
              View Page →
            </Link>
            <button onClick={() => router.back()} className="btn-secondary">
              ← Back
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {ipo && (
          <IPOForm onSubmit={handleSubmit} initialData={ipo} loading={saving} />
        )}
      </div>

      <style jsx>{`
        .edit-ipo-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-secondary,
        .btn-view {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.875rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-secondary {
          background: #fff;
          color: #475569;
          border: 1px solid #cbd5e1;
        }

        .btn-secondary:hover {
          background: #f8fafc;
        }

        .btn-view {
          background: #008080;
          color: #fff;
        }

        .btn-view:hover {
          background: #006666;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
      `}</style>
    </AdminLayout>
  );
}
