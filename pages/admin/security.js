import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayoutV2 from '../../components/admin/AdminLayoutV2';
import { adminAuthAPI } from '../../services/adminApi';
import { Shield, Lock, Key, Smartphone, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminSecurity() {
    const router = useRouter();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [msg, setMsg] = useState({ text: '', isError: false });

    useEffect(() => {
        fetchAdmin();
    }, []);

    const fetchAdmin = async () => {
        try {
            const data = await adminAuthAPI.getMe();
            setAdmin(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMsg({ text: '', isError: false });

        if (passwords.new !== passwords.confirm) {
            return setMsg({ text: "New passwords do not match", isError: true });
        }

        if (passwords.new.length < 6) {
            return setMsg({ text: "Password must be at least 6 characters", isError: true });
        }

        setLoading(true);
        try {
            await adminAuthAPI.changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            setMsg({ text: "Password updated successfully!", isError: false });
            setPasswords({ current: '', new: '', confirm: '' });
            setShowPasswordForm(false);
        } catch (err) {
            setMsg({ text: err.message || "Failed to update password", isError: true });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayoutV2 title="Security">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            </AdminLayoutV2>
        );
    }

    return (
        <AdminLayoutV2 title="Security">
            <Head>
                <title>Security Settings | OpenIPO Admin</title>
            </Head>

            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Security Settings</h1>
                <p className="text-slate-400">Manage your account security and authentication preferences.</p>
            </header>

            <div className="space-y-6 max-w-4xl">
                {/* Profile Overview */}
                <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Shield className="text-blue-400" size={24} />
                        Account Overview
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black/20 p-4 rounded-2xl border border-dashed border-slate-800">
                            <label className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Email Address</label>
                            <div className="text-white font-mono">{admin?.email}</div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-2xl border border-dashed border-slate-800">
                            <label className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Role</label>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded textxs font-bold ${admin?.role === 'SUPER_ADMIN'
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {admin?.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-800/50 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
                        <div>
                            <span className="block text-xs uppercase tracking-wider text-slate-600 mb-1">Last Login</span>
                            {admin?.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'N/A'}
                        </div>
                        <div>
                            <span className="block text-xs uppercase tracking-wider text-slate-600 mb-1">Last IP</span>
                            {admin?.lastLoginIp === '::1' || admin?.lastLoginIp === '127.0.0.1'
                                ? 'Localhost (' + admin?.lastLoginIp + ')'
                                : (admin?.lastLoginIp || 'N/A')}
                        </div>
                    </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <Smartphone className={admin?.twoFactorEnabled ? "text-emerald-400" : "text-slate-400"} size={24} />
                                Two-Factor Authentication
                            </h2>
                            <p className="text-slate-400 text-sm max-w-lg mb-4">
                                Add an extra layer of security to your account by requiring a verification code from your authenticator app when logging in.
                            </p>

                            {admin?.twoFactorEnabled ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold">
                                    <CheckCircle size={14} /> Enabled
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-bold">
                                    <AlertTriangle size={14} /> Not Enabled
                                </div>
                            )}
                        </div>

                        <div className="flex-shrink-0">
                            {admin?.twoFactorEnabled ? (
                                <Link href="/admin/setup-2fa">
                                    <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all border border-slate-700">
                                        Reset Configuration
                                    </button>
                                </Link>
                            ) : (
                                <Link href="/admin/setup-2fa">
                                    <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
                                        Enable 2FA
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Password Management */}
                <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <Key className="text-indigo-400" size={24} />
                                Password
                            </h2>
                            <p className="text-slate-400 text-sm">
                                Change your current password to a new one.
                            </p>
                        </div>
                        <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all border border-slate-700">
                            {showPasswordForm ? 'Cancel' : 'Change Password'}
                        </button>
                    </div>

                    {showPasswordForm && (
                        <form onSubmit={handleChangePassword} className="mt-8 pt-8 border-t border-slate-800/50 space-y-4 max-w-lg">
                            {msg.text && (
                                <div className={`p-4 rounded-xl text-sm font-bold ${msg.isError ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                    {msg.text}
                                </div>
                            )}
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Current Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-11 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="••••••••"
                                        value={passwords.current}
                                        onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">New Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-11 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="••••••••"
                                        value={passwords.new}
                                        onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-11 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="••••••••"
                                        value={passwords.confirm}
                                        onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <button
                                    disabled={loading}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 w-auto"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayoutV2>
    );
}
