import Head from 'next/head';
import { iposAPI } from '../../services/api';
import IPOHeader from '../../components/IPO/IPOHeader';
import IPOTimeline from '../../components/IPO/IPOTimeline';
import IPOStatsGrid from '../../components/IPO/IPOStatsGrid';
import IPOSubscriptionTable from '../../components/IPO/IPOSubscriptionTable';
import IPOGMPCard from '../../components/IPO/IPOGMPCard';
import IPOFinancials from '../../components/IPO/IPOFinancials';
import IPORegistrar from '../../components/IPO/IPORegistrar';
import IPODocuments from '../../components/IPO/IPODocuments';
import IPOAbout from '../../components/IPO/IPOAbout';

/**
 * Server Side Props: Fetches data for SEO and initial render
 */
export async function getServerSideProps(context) {
    const { slug } = context.params;

    try {
        // API now supports both Slug and ID
        const response = await iposAPI.getBySlug(slug);
        // Usually response: { success: true, data: { ...wholeIPO } }

        const ipo = response.data || null;

        if (!ipo) {
            return { notFound: true };
        }

        return {
            props: { ipo },
        };
    } catch (error) {
        console.error("Error fetching IPO details:", error);
        return { notFound: true };
    }
}

export default function IPODetailsPage({ ipo }) {
    const {
        companyName,
        seo,
        gmp,
        priceBand,
        subscription,
        financials,
        registrar,
        registrarAddress,
        docs,
        description,
        objectives,
        promoters,
        dates,
        about
    } = ipo;

    // SEO
    const title = seo?.title || `${companyName} IPO GMP, Date, Price, Subscription Status & Review`;
    const desc = seo?.description || `Check ${companyName} IPO date, price band, GMP, subscription status, allotment status, and listing date. detailed review and analysis.`;
    const canonicalUrl = `https://openipo.in/ipo/${ipo.slug}`;

    // Assemble Objects content
    let objectContent = null;
    if (objectives && objectives.length > 0) {
        objectContent = objectives.map((obj, i) => `• ${obj}`).join('\n');
    }

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={desc} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph */}
                <meta property="og:title" content={title} />
                <meta property="og:description" content={desc} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="article" />
            </Head>

            <div className="bg-slate-50 min-h-screen pb-12">
                {/* Container */}
                <div className="max-w-[1200px] mx-auto px-4 pt-6 md:pt-10">

                    {/* Breadcrumb (Auto from next/link usually, but nice to have distinct) */}
                    <div className="text-sm text-slate-400 font-medium mb-4">
                        <a href="/" className="hover:text-slate-600">Home</a>
                        <span className="mx-2">/</span>
                        <span className="text-slate-600">Current IPO</span>
                        <span className="mx-2">/</span>
                        <span className="text-slate-900">{companyName}</span>
                    </div>

                    <IPOHeader ipo={ipo} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                        {/* Left Column (Main Content) */}
                        <div className="lg:col-span-2">
                            {/* Mobile Only: GMP Card */}
                            <div className="block lg:hidden mb-6">
                                <IPOGMPCard gmp={gmp} priceBand={priceBand} />
                            </div>

                            <IPOTimeline dates={dates} />
                            <IPOStatsGrid ipo={ipo} />

                            {/* Mobile: Show GMP/Subs here if needed, but sticky sidebar is better often. 
                    However, for mobile usually sidebar drops to bottom. 
                    Let's duplicating GMP for Mobile Top might be too cluttery.
                    Standard flow: Timeline -> Stats -> Financials -> About 
                */}

                            <IPOFinancials financials={financials} />

                            <IPOAbout title={`About ${companyName}`} content={description} />

                            {objectContent && <IPOAbout title="Objects of the Issue" content={objectContent} />}

                            {promoters && promoters.length > 0 && (
                                <IPOAbout title="Promoters" content={promoters.join(', ')} />
                            )}

                            <IPODocuments docs={docs} />
                        </div>

                        {/* Right Column (Sidebar / Sticky) */}
                        <div className="flex flex-col gap-6 sticky top-24">
                            <div className="hidden lg:block">
                                <IPOGMPCard gmp={gmp} priceBand={priceBand} />
                            </div>
                            <IPOSubscriptionTable subscription={subscription} />
                            <IPORegistrar
                                registrar={registrar}
                                registrarAddress={registrarAddress}
                                phone={null} // Schema doesn't split these well yet, user edits text
                                email={null}
                                website={ipo.allotment?.allotmentLink} // Often same
                                allotment={ipo.allotment}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
