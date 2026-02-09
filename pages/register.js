import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authService } from '../services/authService';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.register(formData);
            router.push('/');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h1>Create Account</h1>
                <p className="subtitle">Join OpenIPO to track your favorite IPOs</p>

                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Create a password"
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="footer">
                    Already have an account? <Link href="/login">Login</Link>
                </p>
            </div>

            <style jsx>{`
        .container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 20px;
        }
        .card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }
        h1 {
          margin: 0;
          font-size: 1.8rem;
          color: #0f172a;
          text-align: center;
        }
        .subtitle {
          text-align: center;
          color: #64748b;
          margin: 8px 0 24px;
        }
        .group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #334155;
          font-size: 0.9rem;
        }
        input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #fdfdfd;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }
        button {
          width: 100%;
          padding: 14px;
          background: #0ea5e9;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover:not(:disabled) {
          background: #0284c7;
        }
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error {
          background: #fee2e2;
          color: #dc2626;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          text-align: center;
        }
        .footer {
          text-align: center;
          margin-top: 24px;
          color: #64748b;
          font-size: 0.9rem;
        }
        .footer :global(a) {
          color: #0ea5e9;
          text-decoration: none;
          font-weight: 600;
        }
        .footer :global(a):hover {
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
}
