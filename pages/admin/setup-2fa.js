import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { adminAuthAPI } from '../../services/adminApi';
import { Shield, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

export default function Setup2FA() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1 = Scan, 2 = Backup Codes

    // Data
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [otp, setOtp] = useState('');
    const [backupCodes, setBackupCodes] = useState([]);

    useEffect(() => {
        if (!router.isReady) return;

        // Fetch Setup QR
        // Logic: Pass query token if available (from login flow)
        const token = router.query.token;

        const initSetup = async () => {
            try {
                const payload = token ? { tempToken: token } : {};
                const res = await adminAuthAPI.setup2FA(payload);
                setQrCode(res.qrCodeUrl);
                setSecret(res.secret);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to initialize setup');
                setLoading(false);
            }
        };

        initSetup();
    }, [router.isReady, router.query.token]);

    const handleConfirm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = router.query.token;
            const res = await adminAuthAPI.confirm2FA({
                token: otp,
                tempToken: token
            });

            setBackupCodes(res.backupCodes);
            setStep(2);
        } catch (err) {
            setError(err.message || 'Invalid Code');
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = () => {
        router.push('/admin/dashboard');
    };

    if (loading && step === 1 && !qrCode) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <Head><title>Setup 2FA | OpenIPO</title></Head>

            <div className="bg-slate-800 border border-slate-700 w-full max-w-lg p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="text-emerald-500" /> Setup 2-Factor Auth
                </h1>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4">{error}</div>}

                {step === 1 && (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-xl w-fit mx-auto">
                            {qrCode && <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />}
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-slate-300">Scan this QR code with Google Authenticator</p>
                            <p className="text-xs text-slate-500 font-mono bg-slate-900/50 py-2 rounded break-all select-all">
                                Secret: {secret}
                            </p>
                        </div>

                        <form onSubmit={handleConfirm} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter 6-digit code"
                                className="bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white w-full font-mono text-center tracking-widest text-lg"
                                value={otp}
                                maxLength={6}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <button disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded font-bold">
                                {loading ? '...' : 'Verify'}
                            </button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex items-start gap-3">
                            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-amber-500">Save your Backup Codes!</h3>
                                <p className="text-sm text-slate-300 mt-1">These created codes are the ONLY way to access your account if you lose your device. We cannot recover them.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-slate-400 text-sm">
                            {backupCodes.map((code, i) => (
                                <div key={i} className="flex justify-between">
                                    <span className="text-slate-600">{i + 1}.</span>
                                    <span className="text-white select-all">{code}</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleFinish} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                            <CheckCircle /> I have saved them
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
