import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Sidebar from "./Sidebar";
import { authStorage } from "../../utils/authStorage";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Client-side only
        if (typeof window === "undefined") return;

        const checkAuth = async () => {
            if (!authStorage.isAuthenticated()) {
                router.push(`/admin/login?redirect=${encodeURIComponent(router.asPath)}`);
                return;
            }

            const user = authStorage.getUser();
            if (!user || user.role !== "admin") {
                // Logged in but not admin
                setLoading(false);
                return; // render access denied
            }

            setAuthorized(true);
            setLoading(false);
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return <div className="loading">Loading Admin Panel...</div>;
    }

    if (!authorized) {
        return (
            <div className="denied">
                <h1>Access Denied</h1>
                <p>You must be an administrator to view this page.</p>
                <button
                    onClick={() => {
                        authStorage.clear();
                        router.push('/admin/login');
                    }}>
                    Login as Admin
                </button>
                <style jsx>{`
                .denied { 
                    height: 100vh; 
                    display: flex; 
                    flex-direction: column;
                    align-items: center; 
                    justify-content: center; 
                    background: #f1f5f9;
                }
                h1 { color: #ef4444; }
                button { 
                    margin-top: 20px; 
                    padding: 10px 20px; 
                    background: #0f172a; 
                    color: white; 
                    border: none; 
                    border-radius: 6px; 
                    cursor: pointer;
                }
              `}</style>
            </div>
        );
    }

    return (
        <div className="admin-wrapper">
            <Head>
                <title>OpenIPO Admin</title>
            </Head>

            <Sidebar />

            <main className="main-content">
                <header className="top-bar">
                    <div className="breadcrumbs">Admin / {router.pathname.split('/').pop()}</div>
                    <div className="user-menu">
                        <span>{authStorage.getUser()?.email}</span>
                        <button onClick={() => { authStorage.clear(); router.push('/admin/login'); }}>Logout</button>
                    </div>
                </header>

                <div className="content-scroll">
                    {children}
                </div>
            </main>

            <style jsx>{`
        .admin-wrapper {
            display: flex;
            min-height: 100vh;
            background: #f8fafc;
        }
        
        .main-content {
            flex: 1;
            margin-left: 260px; /* Sidebar width */
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        .top-bar {
            height: 64px;
            background: white;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 32px;
            flex-shrink: 0;
        }

        .breadcrumbs {
            font-weight: 600;
            color: #64748b;
            text-transform: capitalize;
        }

        .user-menu {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 0.9rem;
            color: #334155;
        }

        .user-menu button {
            background: #ffe4e6;
            color: #be123c;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
        }

        .content-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 32px;
        }
        
        .loading {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #64748b;
        }
      `}</style>
        </div>
    );
}
