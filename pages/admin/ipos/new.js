import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminLayout from "../../../components/AdminLayout";
import { adminAPI } from "../../../services/api";
import IPOForm from "../../../components/admin/IPOForm";

export default function CreateIPO() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");
      
      // Generate slug from company name if not provided
      if (!formData.slug && formData.companyName) {
        formData.slug = formData.companyName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      // Set metadata
      formData.meta = {
        ...formData.meta,
        lastUpdated: new Date().toISOString(),
        isActive: true
      };

      await adminAPI.createIPO(formData);
      alert("IPO created successfully!");
      router.push("/admin/ipos");
    } catch (err) {
      setError(err.message || "Failed to create IPO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Create New IPO | Admin Panel</title>
      </Head>

      <div className="create-ipo-page">
        <div className="page-header">
          <h1>Create New IPO</h1>
          <button onClick={() => router.back()} className="btn-secondary">
            ← Back
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <IPOForm onSubmit={handleSubmit} loading={loading} />
      </div>

      <style jsx>{`
        .create-ipo-page {
          max-width: 1200px;
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

        .btn-secondary {
          padding: 10px 20px;
          background: #fff;
          color: #475569;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f8fafc;
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
