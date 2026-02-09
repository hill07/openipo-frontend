import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, List, Settings, LogOut, X } from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose, admin, onLogout }) {
    const router = useRouter();

    const isActive = (path) => router.pathname === path || router.pathname.startsWith(path + '/');

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 h-full w-72 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/50 
                flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-8 border-b border-slate-800/50 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                            OpenIPO
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-bold">Admin Workspace</p>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
                    <SidebarLink href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" active={isActive('/admin/dashboard')} />
                    <SidebarLink href="/admin/ipos" icon={List} label="Manage IPOs" active={isActive('/admin/ipos')} />
                    <SidebarLink href="/admin/security" icon={Settings} label="Security" active={isActive('/admin/security')} />
                </nav>

                <div className="p-6 border-t border-slate-800/50 bg-slate-950/50">
                    {admin && (
                        <div className="flex items-center gap-4 px-2 py-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg ring-2 ring-slate-900">
                                {admin.email?.[0]?.toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate text-slate-200">{admin.email.split('@')[0]}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{admin.role}</p>
                            </div>
                        </div>
                    )}
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-red-500/20 group">
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}

function SidebarLink({ href, icon: Icon, label, active }) {
    return (
        <Link href={href} className={`
            flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all group
            ${active
                ? 'bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent hover:border-slate-800'}
        `}>
            <Icon size={20} className={`transition-transform group-hover:scale-110 ${active ? '' : 'text-slate-500 group-hover:text-white'}`} />
            {label}
        </Link>
    );
}
