import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { adminAuthAPI } from '../../services/adminApi';
import AdminSidebar from './AdminSidebar';
import { Menu, Loader2 } from 'lucide-react';

export default function AdminLayout({ children, title = "Admin Panel" }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Authenticate
        adminAuthAPI.getMe()
            .then(user => {
                setAdmin(user);
                setLoading(false);
            })
            .catch(() => {
                router.push('/admin/login');
            });
    }, [router]);

    const handleLogout = async () => {
        try {
            await adminAuthAPI.logout();
            router.push('/admin/login');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans selection:bg-blue-500/30">
            <Head><title>{title} | OpenIPO Admin</title></Head>

            {/* Sidebar */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                admin={admin}
                onLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="lg:ml-72 min-h-screen flex flex-col transition-all duration-300">

                {/* Mobile Header / Top Bar */}
                <header className="lg:hidden p-4 flex items-center justify-between border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-400 hover:text-white active:scale-95 transition-transform">
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">OpenIPO Admin</span>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
