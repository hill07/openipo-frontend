import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminAuthAPI, adminIpoAPI } from '../../services/adminApi';
import { FileText, Plus, List, TrendingUp } from 'lucide-react';
import AdminLayoutV2 from '../../components/admin/AdminLayoutV2';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total: 0, activeNotes: 0 });
    const [admin, setAdmin] = useState({ email: 'Admin' });

    useEffect(() => {
        // We can fetch admin details again or just rely on Layout. 
        // For the greeting, let's fetch quick or rely on localized storage/cache if available.
        adminAuthAPI.getMe().then(setAdmin).catch(() => { });

        adminIpoAPI.getAll({ limit: 1 })
            .then(res => {
                setStats({ total: res.data?.count || 0, activeNotes: 0 });
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <AdminLayoutV2 title="Dashboard">
            <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-md shadow-2xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-1">Dashboard Overview</h2>
                    <p className="text-slate-400 text-sm">Welcome back, <span className="text-blue-400 font-semibold">{admin.email}</span></p>
                </div>
                <Link href="/admin/ipos/new" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 active:scale-95 border border-white/10 w-full md:w-auto">
                    <Plus size={20} strokeWidth={3} /> New IPO
                </Link>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-slate-900/60 border border-slate-800/60 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-slate-900/80 transition-all group relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <List size={28} />
                        </div>
                        <span className="text-xs font-bold bg-slate-800/80 text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/20">Real-time</span>
                    </div>
                    <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Total Listed IPOs</div>
                    <div className="text-5xl font-black text-white tracking-tight">{stats.total}</div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/60 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-slate-900/80 transition-all group relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                            <FileText size={28} />
                        </div>
                        <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">Live Notes</span>
                    </div>
                    <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Active Admin Notes</div>
                    <div className="text-5xl font-black text-white tracking-tight">{stats.total}</div>
                    <div className="text-xs text-slate-500 mt-2 font-medium">Synced with visible notes</div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/60 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:bg-slate-900/80 transition-all group relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp size={28} />
                        </div>
                        <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/20">Session</span>
                    </div>
                    <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Last Access</div>
                    <div className="text-lg font-mono font-bold text-white mt-2 bg-black/40 p-3 rounded-lg border border-slate-800/50 inline-block overflow-hidden text-ellipsis w-full">
                        {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'Just Now'}
                    </div>
                </div>
            </div>
        </AdminLayoutV2>
    );
}
