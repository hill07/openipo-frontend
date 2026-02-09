import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { adminAuthAPI } from '../../services/adminApi';
import { Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLogin() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1 = Email/Pwd, 2 = OTP, 3 = Setup Redirect
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form Data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [tempToken, setTempToken] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await adminAuthAPI.login({ email, password });

            if (res.step === 'verify_2fa') {
                setTempToken(res.tempToken);
                setStep(2);
            } else if (res.step === 'setup_2fa') {
                // Redirect to setup with temp token
                // Use router to pass tempToken via query or state? 
                // Security-wise slightly risky in query. 
                // Better store in localStorage briefly or pass via state if using context.
                // For now, we will assume the Setup page handle this or we pass as query param
                router.push(`/admin/setup-2fa?token=${encodeURIComponent(res.tempToken)}`);
            } else {
                // Should not happen based on requirement "No admin route should work without 2FA"
                // But if we allowed it:
                router.push('/admin/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await adminAuthAPI.verify2FA({ token: otp, tempToken });
            router.push('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <Head>
                <title>Admin Login | OpenIPO</title>
            </Head>

            <div className="bg-slate-800 border border-slate-700 w-full max-w-md p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <div className="bg-blue-600/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                        {step === 1 ? <Lock className="w-8 h-8 text-blue-500" /> : <ShieldCheck className="w-8 h-8 text-emerald-500" />}
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {step === 1 ? 'Admin Portal' : 'Security Check'}
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">
                        {step === 1 ? 'Enter credentials to access dashboard' : 'Enter 2FA code from authenticator app'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-slate-300 text-xs font-semibold uppercase mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 text-xs font-semibold uppercase mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label className="block text-slate-300 text-xs font-semibold uppercase mb-2">Authentication Code</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                placeholder="000 000"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-slate-500 hover:text-white text-sm py-2"
                        >
                            Back to Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
