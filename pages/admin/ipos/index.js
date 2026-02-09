import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { adminIpoAPI } from '../../../services/adminApi';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import AdminLayoutV2 from '../../../components/admin/AdminLayoutV2';

export default function AdminIPOList() {
    const [ipos, setIpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchIPOs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminIpoAPI.getAll({ page, limit: 10, search });
            setIpos(res.data?.ipos || []);
            setTotalPages(res.data?.pages || 1);
        } catch (err) {
            console.error('Error fetching IPOs:', err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    // Fetch Data
    useEffect(() => {
        fetchIPOs();
    }, [fetchIPOs]);

    const handleDelete = async (slug) => {
        if (!window.confirm("Are you sure? This will delete ALL data (details, financials, etc) for this IPO.")) return;
        setActionLoading(slug);
        try {
            await adminIpoAPI.delete(slug);
            fetchIPOs();
        } catch (err) {
            alert("Delete failed: " + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleTogglePublish = async (ipo) => {
        setActionLoading(ipo.slug);
        try {
            const newStatus = !ipo.isPublished;
            // Optimistic update
            setIpos(prev => prev.map(p => p.slug === ipo.slug ? { ...p, isPublished: newStatus } : p));

            await adminIpoAPI.update(ipo.slug, { isPublished: newStatus });
            // No need to refetch if successful, as we did optimistic update. 
            // But to be safe on derived fields, maybe silent refetch? Nah, publish status is simple.
        } catch (err) {
            alert("Toggle failed: " + err.message);
            fetchIPOs(); // Revert
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <AdminLayoutV2 title="Manage IPOs">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">IPO Management</h1>
                    <p className="text-slate-400 text-sm md:text-base">View, edit, or create new IPO listings.</p>
                </div>
                <Link href="/admin/ipos/new" className="w-full md:w-auto bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105 active:scale-95">
                    <Plus size={20} strokeWidth={3} /> Add New
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/50 mb-8 flex gap-4 backdrop-blur-sm max-w-md shadow-inner w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by company name..."
                        className="w-full bg-slate-950/50 border border-transparent rounded-xl pl-12 pr-4 py-3 text-white focus:ring-0 focus:bg-slate-900 focus:border-slate-700 transition-all placeholder:text-slate-600 font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table wrapper for mobile scroll */}
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800/60 overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-slate-300 min-w-[800px]"> {/* Min width ensures generic table doesn't squash */}
                        <thead className="bg-black/20 text-slate-400 uppercase text-[11px] font-bold tracking-widest border-b border-slate-800/50">
                            <tr>
                                <th className="px-8 py-6">Company</th>
                                <th className="px-6 py-6">Type</th>
                                <th className="px-6 py-6">Status</th>
                                <th className="px-6 py-6">Dates</th>
                                <th className="px-6 py-6 text-center">Visible</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500"><Loader2 className="animate-spin w-8 h-8 mx-auto mb-2 opacity-50" />Loading IPOs...</td></tr>
                            ) : ipos.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500 font-medium">No IPOs found based on your search.</td></tr>
                            ) : (
                                ipos.map((ipo) => (
                                    <tr key={ipo.ipoId} className="group hover:bg-white/[0.02] transition-colors duration-200">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{ipo.companyName}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-1">
                                                {ipo.symbol?.nse || ipo.symbol?.bse || ipo.symbol?.sme || (typeof ipo.symbol === 'string' ? ipo.symbol : 'N/A')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold border ${ipo.type === 'MAINBOARD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                                {ipo.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-slate-400 bg-slate-800/50 px-2 py-1 rounded border border-slate-700">{ipo.status}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-mono text-slate-400">
                                            {ipo.dates?.open ? new Date(ipo.dates.open).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button
                                                onClick={() => handleTogglePublish(ipo)}
                                                disabled={actionLoading === ipo.slug}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${ipo.isPublished ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ipo.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/ipos/${ipo.slug}/edit`} className="p-2.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all" title="Edit">
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ipo.slug)}
                                                    disabled={actionLoading === ipo.slug}
                                                    className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {actionLoading === ipo.slug ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 disabled:opacity-30 hover:bg-slate-800 font-bold transition-all text-sm">Prev</button>
                <span className="px-5 py-2.5 bg-slate-950 rounded-xl text-slate-500 border border-slate-900 font-mono text-sm flex items-center">{page}/{totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 disabled:opacity-30 hover:bg-slate-800 font-bold transition-all text-sm">Next</button>
            </div>
        </AdminLayoutV2>
    );
}
