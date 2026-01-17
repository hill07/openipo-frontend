import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { authAPI } from "../../services/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authAPI.adminLogin({ email, password });
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify({ email: data.email, name: data.name }));
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login | OpenIPO</title>
      </Head>

      <div className="login-container">
        <div className="login-box">
          <h1>Admin Login</h1>
          <p className="subtitle">OpenIPO Admin Panel</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="footer-link">
            <a href="/">← Back to Home</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 20px;
        }

        .login-box {
          background: #fff;
          border-radius: 12px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 8px 0;
          text-align: center;
        }

        .subtitle {
          text-align: center;
          color: #64748b;
          font-size: 0.875rem;
          margin: 0 0 32px 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
        }

        input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus {
          border-color: #2563eb;
        }

        input:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          background: #008080;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 8px;
        }

        .login-button:hover:not(:disabled) {
          background: #006666;
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.875rem;
        }

        .footer-link {
          text-align: center;
          margin-top: 24px;
          font-size: 0.875rem;
        }

        .footer-link a {
          color: #2563eb;
          text-decoration: none;
        }

        .footer-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
