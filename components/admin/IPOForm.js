import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { adminIpoAPI } from '../../services/adminApi';
import { Save, Loader2, CheckCircle, Info, FileText, TrendingUp, Users, Coins } from 'lucide-react';
import Link from 'next/link';
import { computeFrontendDerivedFields } from '../../utils/ipoCalculationsUtils';

// Sub-components
import BasicInfo from './ipo-form/BasicInfo';
import DatesInfo from './ipo-form/DatesInfo';
import IssueDetails from './ipo-form/IssueDetails';
import FinancialsInfo from './ipo-form/FinancialsInfo';
import GMPInfo from './ipo-form/GMPInfo';
import SubscriptionInfo from './ipo-form/SubscriptionInfo';
import DetailsInfo from './ipo-form/DetailsInfo';

export default function IPOForm({ initialData = {}, isEdit = false }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Initial State strictly mirroring the Schema
    const getInitialState = () => ({

        slug: '',
        isPublished: false,
        companyName: '',
        logo: '',
        type: 'MAINBOARD',
        issueType: 'IPO',
        symbol: { nse: '', bse: '', sme: '' },
        exchanges: [],
        dates: { open: '', close: '', allotment: '', listing: '' },
        status: 'UPCOMING',
        lotSize: '',
        priceBand: { min: '', max: '' },
        minInvestment: '',
        issueSize: { cr: '', shares: '' },
        faceValue: '',
        issueBreakdown: {
            total: { cr: '', shares: '' },
            fresh: { cr: '', shares: '' },
            ofs: { cr: '', shares: '' }
        },
        listingAt: [],
        marketMaker: '',
        registrar: '',
        leadManagers: [],
        gmp: { current: '', history: [] },
        subscription: { categories: [] },
        reservations: [],
        lotDistribution: [],
        limits: {},
        financials: { table: [], kpis: [] },
        promoters: [],
        objectives: [],
        reviewers: [],
        docs: { drhp: '', rhp: '', boa: '', applyLink: '', anchor: '' },
        description: '',
        strengths: [],
        weaknesses: [],
        address: '',
        // New Fields
        shareHolding: { pre: '', post: '' },
        allotment: { isAllotted: false, allotmentLink: '' },
        sources: { gmp: '', subscription: '', financials: '' },
        seo: { title: '', description: '', keywords: [] }
    });

    const [formData, setFormData] = useState(getInitialState());

    // Load initial data
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            // Migration: Map old fields to new schema if needed
            const migratedData = { ...initialData };

            // 1. Subscription Categories
            if (migratedData.subscription?.categories) {
                migratedData.subscription.categories = migratedData.subscription.categories.map(c => ({
                    ...c,
                    category: c.category || c.name, // Map name -> category
                    appliedShares: c.appliedShares || c.sharesBid, // Map sharesBid -> appliedShares
                    enabled: c.enabled !== undefined ? c.enabled : true
                }));
            }

            // 2. Reservations
            if (migratedData.reservations) {
                migratedData.reservations = migratedData.reservations.map(r => ({
                    ...r,
                    category: r.category || r.name,
                    enabled: r.enabled !== undefined ? r.enabled : true
                }));
            }

            // Merge initial data with default state to ensure structure
            setFormData(prev => ({
                ...prev,
                ...migratedData,
                financials: {
                    ...(prev.financials || {}),
                    ...(migratedData.financials || {}),
                },
                // Ensure allotment object exists and merge carefuly if partial
                allotment: {
                    ...(prev.allotment || {}),
                    ...(migratedData.allotment || {})
                }
            }));
        }
    }, [initialData]);

    // Universal Change Handler
    const handleChange = (section, field, value) => {
        if (section === 'root') {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...(prev[section] || {}),
                    [field]: value
                }
            }));
        }
    };

    // Dynamic Calculations
    const calculated = useMemo(() => computeFrontendDerivedFields(formData), [formData]);

    // Auto-calculate Min Investment, GMP stats, Status when dependent fields change
    useEffect(() => {

        setFormData(prev => {
            // Check diff to avoid loops
            const isMinInvDiff = prev.minInvestment !== calculated.minInvestment;
            const isStatusDiff = prev.status !== calculated.status;
            const isGmpPctDiff = prev.gmp?.percent !== calculated.gmp?.percent;
            const isGmpEstDiff = prev.gmp?.estListingPrice !== calculated.gmp?.estListingPrice;

            if (isMinInvDiff || isStatusDiff || isGmpPctDiff || isGmpEstDiff) {
                return {
                    ...prev,
                    minInvestment: calculated.minInvestment,
                    status: calculated.status,
                    gmp: {
                        ...(prev.gmp || {}),
                        percent: calculated.gmp?.percent,
                        estListingPrice: calculated.gmp?.estListingPrice
                    }
                };
            }
            return prev;
        });
    }, [calculated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            // Clean Payload: Convert strings to numbers where necessary
            const cleanNumber = (val) => {
                if (val === '' || val === null || val === undefined) return null;
                if (typeof val === 'number') return val;
                // Handle string: strip commas, then parse
                const str = String(val).replace(/,/g, '').trim();
                const num = Number(str);
                return isNaN(num) ? null : num;
            };

            const payload = {
                ...formData,
                // ipoId is auto-generated by backend on create
                // On update, we might need it? Usually slug is the key.
                // If we send null/undefined ipoId on update, it might check if it exists.
                // But for create we want to omit it. 
                // Let's omit it generally unless it's an edit and we want to preserve/show it?
                // Actually, if we don't send it, backend won't change it on update (Mongoose partial update logic if not in set).
                // Wait, Mongoose findOneAndUpdate with $set only sets provided fields.
                // The controller uses `validatedUpdates`.
                // If I omit it here, it won't be sent.
                // For Create: Correct, omit it.
                // For Update: Correct, omit it (immutable).
                lotSize: cleanNumber(formData.lotSize),
                minInvestment: cleanNumber(formData.minInvestment),
                faceValue: cleanNumber(formData.faceValue),

                priceBand: {
                    min: cleanNumber(formData.priceBand?.min),
                    max: cleanNumber(formData.priceBand?.max)
                },

                issueSize: {
                    cr: cleanNumber(formData.issueSize?.cr),
                    shares: cleanNumber(formData.issueSize?.shares)
                },

                issueBreakdown: {
                    total: { cr: cleanNumber(formData.issueBreakdown?.total?.cr), shares: cleanNumber(formData.issueBreakdown?.total?.shares) },
                    fresh: { cr: cleanNumber(formData.issueBreakdown?.fresh?.cr), shares: cleanNumber(formData.issueBreakdown?.fresh?.shares) },
                    ofs: { cr: cleanNumber(formData.issueBreakdown?.ofs?.cr), shares: cleanNumber(formData.issueBreakdown?.ofs?.shares) }
                },

                gmp: {
                    ...formData.gmp,
                    current: cleanNumber(formData.gmp?.current),
                    history: formData.gmp?.history?.map(h => ({ ...h, gmp: cleanNumber(h.gmp) }))
                },

                subscription: {
                    ...formData.subscription,
                    // Remove summary if present
                    summary: undefined,
                    days: formData.subscription?.days?.map(d => ({
                        day: d.day,
                        date: d.date,
                        qib: cleanNumber(d.qib),
                        retail: cleanNumber(d.retail),
                        hni: cleanNumber(d.hni),
                        shni: cleanNumber(d.shni),
                        bhni: cleanNumber(d.bhni),
                        total: cleanNumber(d.total)
                    })),
                    categories: formData.subscription?.categories?.map(c => ({
                        enabled: c.enabled,
                        category: c.category,
                        sharesOffered: cleanNumber(c.sharesOffered),
                        appliedShares: cleanNumber(c.appliedShares),
                    }))
                },

                reservations: formData.reservations?.map(r => ({
                    enabled: r.enabled,
                    category: r.category,
                    sharesOffered: cleanNumber(r.sharesOffered),
                    anchorShares: cleanNumber(r.anchorShares)
                })),

                // Ensure arrays are arrays
                listingAt: formData.listingAt || [],
                leadManagers: formData.leadManagers || [],
                promoters: formData.promoters || [],
                objectives: formData.objectives || [],
                strengths: formData.strengths || [],
                weaknesses: formData.weaknesses || [],
                reviewers: formData.reviewers || [],

                // Explicitly send allotment
                allotment: formData.allotment,

                // Ensure financials are fully sent and cleaned (remove totalExpenditure)
                financials: {
                    ...formData.financials,
                    table: formData.financials?.table?.map(row => ({
                        period: row.period,
                        assets: cleanNumber(row.assets),
                        totalIncome: cleanNumber(row.totalIncome),
                        // totalExpenditure: Removed
                        pat: cleanNumber(row.pat),
                        ebitda: cleanNumber(row.ebitda),
                        netWorth: cleanNumber(row.netWorth),
                        reservesSurplus: cleanNumber(row.reservesSurplus),
                        totalBorrowing: cleanNumber(row.totalBorrowing)
                    })),
                    kpis: formData.financials?.kpis // KPIs usually fine, numbers handled by inputs but better to clean? Inputs are text.
                        ?.map(k => {
                            // Clean all numeric values dynamically
                            const cleaned = { period: k.period };
                            Object.keys(k).forEach(key => {
                                if (key !== 'period') {
                                    cleaned[key] = cleanNumber(k[key]);
                                }
                            });
                            return cleaned;
                        })
                }
            };

            if (isEdit) {
                await adminIpoAPI.update(payload.slug, payload);
                setMsg({ type: 'success', text: 'IPO Updated Successfully!' });
            } else {
                const response = await adminIpoAPI.create(payload);
                setMsg({ type: 'success', text: 'IPO Created Successfully! Redirecting...' });
                // Redirect to edit mode to prevent duplicate creation on subsequent saves
                const newSlug = response.data?.slug;
                if (newSlug) {
                    // Use replace to avoid back-button returning to create page
                    setTimeout(() => {
                        router.replace(`/admin/ipos/edit/${newSlug}`);
                    }, 1500);
                }
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            console.error("Submit Error:", err);
            let errorText = err.message || 'Operation Failed';
            if (err.errors && Array.isArray(err.errors)) {
                errorText = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            }
            setMsg({ type: 'error', text: errorText });
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Debug Info
            if (err.errors) {
                let detailed = '';
                if (Array.isArray(err.errors)) {
                    // Zod Style
                    detailed = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(' | ');
                } else if (typeof err.errors === 'object') {
                    // Mongoose Style
                    detailed = Object.keys(err.errors).map(key => `${key}: ${err.errors[key].message}`).join(' | ');
                }
                setMsg({ type: 'error', text: `Detailed: ${detailed}` });
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    const Tabs = [
        { id: 'basic', label: 'Basic Info', icon: Info },
        { id: 'dates', label: 'Dates', icon: Info },
        { id: 'issue', label: 'Issue & Prices', icon: Coins },
        { id: 'details', label: 'Details', icon: FileText },
        { id: 'financials', label: 'Financials', icon: TrendingUp },
        { id: 'gmp', label: 'GMP', icon: TrendingUp },
        { id: 'subscription', label: 'Subscription', icon: Users }
    ];

    return (
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-700/50 overflow-x-auto bg-slate-950/30 hide-scrollbar">
                {Tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-5 text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-200 border-b-2 ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Notification */}
            {msg.text && (
                <div className={`mx-6 mt-6 p-4 rounded-xl flex items-center gap-3 font-semibold shadow-lg ${msg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {msg.type === 'success' ? <CheckCircle size={20} /> : <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>}
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-8">
                {activeTab === 'basic' && <BasicInfo data={formData} onChange={handleChange} />}
                {activeTab === 'dates' && <DatesInfo data={formData} onChange={handleChange} />}
                {activeTab === 'issue' && <IssueDetails data={formData} onChange={handleChange} />}
                {activeTab === 'details' && <DetailsInfo data={formData} onChange={handleChange} />}
                {activeTab === 'financials' && <FinancialsInfo data={formData} onChange={handleChange} type={formData.type} />}
                {activeTab === 'gmp' && <GMPInfo data={formData} onChange={handleChange} />}
                {activeTab === 'subscription' && <SubscriptionInfo data={calculated} onChange={handleChange} />}

                <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end gap-3 sticky bottom-0 bg-slate-900/95 p-4 rounded-xl backdrop-blur-md shadow-2xl z-50">
                    <Link href="/admin/ipos" className="px-6 py-3 rounded-xl border border-slate-600/50 text-slate-300 hover:bg-slate-800 font-medium transition-colors">Cancel</Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02]"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save size={18} /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
}