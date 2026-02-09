import Head from 'next/head';
import { iposAPI } from '../../services/api';
import IPOHeader from '../../components/ipo/IPOHeader';
import IPOTimeline from '../../components/ipo/IPOTimeline';
import IPOStatsGrid from '../../components/ipo/IPOStatsGrid';
import IPOSubscriptionTable from '../../components/ipo/IPOSubscriptionTable';
import IPOGMPCard from '../../components/ipo/IPOGMPCard';
import IPOFinancials from '../../components/ipo/IPOFinancials';
import IPORegistrar from '../../components/ipo/IPORegistrar';
import IPODocuments from '../../components/ipo/IPODocuments';
import IPOAbout from '../../components/ipo/IPOAbout';
import IPOPeers from '../../components/ipo/IPOPeers';
import IPOCompanyInfo from '../../components/ipo/IPOCompanyInfo';
import IPOLotSize from '../../components/ipo/IPOLotSize';

/**
 * Static Paths: Pre-render paths for better performance (ISR)
 */
export async function getStaticPaths() {
    try {
        // Fetch top 20 active/popular IPOs to pre-render
        // Assuming getAll supports pagination or limit. If not, we might fetch all (if count is low)
        // or just fallback to blocking.
        const response = await iposAPI.getAll({ limit: 20 });
        const ipos = response.data?.ipos || []; // Access nested ipos array

        const paths = ipos.map((ipo) => ({
            params: { slug: ipo.slug },
        }));

        return { paths, fallback: 'blocking' };
    } catch (error) {
        console.error("Error fetching paths:", error);
        return { paths: [], fallback: 'blocking' };
    }
}

/**
 * Static Props: Fetches data at build time + Revalidates (ISR)
 */
export async function getStaticProps(context) {
    const { slug } = context.params;

    try {
        const response = await iposAPI.getBySlug(slug);
        const ipo = response.data || null;

        if (!ipo) {
            return { notFound: true };
        }

        return {
            props: { ipo },
            revalidate: 60, // Update every 60 seconds
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
        about,
        peers,
        address,
        leadManagers,
        marketMaker,
        strengths,
        weaknesses,
        lotSize,
        lotDistribution,
        limits
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
                {ipo.logo && <meta property="og:image" content={ipo.logo} />}

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FinancialProduct",
                            "name": companyName,
                            "description": description,
                            "brand": {
                                "@type": "Brand",
                                "name": companyName
                            },
                            "offers": {
                                "@type": "Offer",
                                "priceCurrency": "INR",
                                "price": priceBand?.max || priceBand?.min || "0",
                                "availability": dates?.open ? "https://schema.org/PreOrder" : "https://schema.org/InStock"
                            },
                            "image": ipo.logo || ""
                        })
                    }}
                />
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

                            {/* Mobile Only: Subscription Table */}
                            <div className="block lg:hidden mb-6">
                                <IPOSubscriptionTable subscription={subscription} />
                            </div>

                            <IPOFinancials financials={financials} type={ipo.type} />

                            <IPOStatsGrid ipo={ipo} />
                            <IPOTimeline dates={dates} />
                            <IPOLotSize lotDistribution={lotDistribution} limits={limits} lotSize={lotSize} />

                            <IPOPeers peers={peers} />

                            <IPOAbout title={`About ${companyName}`} content={description} />
                            <IPOCompanyInfo
                                address={address}
                                leadManagers={leadManagers}
                                marketMaker={marketMaker}
                                strengths={strengths}
                                weaknesses={weaknesses}
                            />

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
                                allotment={ipo.allotment}
                            />
                        </div>

                    </div>
                    {/* Global Disclaimer */}
                    <div className="mt-12 p-6 bg-slate-100 rounded-2xl text-xs text-slate-500 text-center leading-relaxed">
                        <p className="font-bold mb-2">Disclaimer</p>
                        <p>
                            Investment in Pre-IPO/Unlisted Shares/IPO is subject to market risks. OpenIPO.in is not a SEBI registered entity.
                            The information provided here is for educational purposes only and should not be considered as financial advice.
                            GMP prices are estimated based on market rumors and may vary. Please consult your financial advisor before making any investment decisions.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
