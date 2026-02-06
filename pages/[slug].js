import { iposAPI } from "../services/api";
import SEO from "../components/SEO";
import Link from 'next/link';
import { getIPOStatusFromDates } from "../utils/ipo";

// Re-use sections from existing IPO page, or rebuild better
// I'll create a clean, SEO-optimized layout based on the user request.

export async function getServerSideProps({ params }) {
    const { slug } = params;

    try {
        // 1. Try fetching with exact slug
        let ipoData = null;
        try {
            const res = await iposAPI.getBySlug(slug);
            ipoData = res.data;
        } catch (e) {
            // 2. If valid slug ends with '-ipo', try stripping it?
            // Or if user insists on `/{company}-ipo` mapping to `{company}` slug in DB.
            // Assuming DB slug might NOT have -ipo.
            if (slug.endsWith('-ipo')) {
                const cleanSlug = slug.replace(/-ipo$/, '');
                try {
                    const res2 = await iposAPI.getBySlug(cleanSlug);
                    ipoData = res2.data;
                } catch (e2) {
                    // Not found
                }
            }
        }

        if (!ipoData) {
            return { notFound: true };
        }

        return {
            props: {
                ipo: ipoData,
            },
        };
    } catch (error) {
        return { notFound: true };
    }
}

export default function CompanyIPOPage({ ipo }) {
    if (!ipo) return null;

    // Normalized Data
    const companyName = ipo.companyName;
    const priceBand = ipo.priceBand ? `₹${ipo.priceBand.min} - ₹${ipo.priceBand.max}` : "TBA";
    const gmp = ipo.gmp?.current || "N/A";
    const type = ipo.type === "SME" ? "SME IPO" : "Mainboard IPO";

    const dates = ipo.dates || {};
    const openDate = dates.open ? new Date(dates.open).toDateString() : "TBA";
    const closeDate = dates.close ? new Date(dates.close).toDateString() : "TBA";
    const allotmentDate = dates.allotment ? new Date(dates.allotment).toDateString() : "TBA";
    const listingDate = dates.listing ? new Date(dates.listing).toDateString() : "TBA";

    const seoTitle = `${companyName} IPO GMP, Review, Dates & Allotment | OpenIPO`;
    const seoDesc = `check ${companyName} IPO GMP today, listing date, price band, allotment status, and expert review. ${type} open from ${openDate} to ${closeDate}.`;

    return (
        <>
            <SEO
                title={seoTitle}
                description={seoDesc}
                canonical={`https://openipo.in/${ipo.slug}-ipo`} // Preferred URL format
            />

            <div className="page-container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link href="/">Home</Link> &gt; <Link href="/ipo-calendar">IPOs</Link> &gt; <span>{companyName}</span>
                </div>

                <header className="page-header">
                    <div className="header-top">
                        {ipo.companyLogo && <img src={ipo.companyLogo} alt={companyName} className="company-logo" />}
                        <div>
                            <span className="badge">{type}</span>
                            <h1>{companyName} IPO</h1>
                            <p className="subtitle">
                                GMP: <strong className="green">₹{gmp}</strong> • Price: <strong>{priceBand}</strong>
                            </p>
                        </div>
                    </div>
                </header>

                <div className="content-grid">
                    {/* Main Content */}
                    <main>
                        <section className="card">
                            <h2>{companyName} IPO Overview</h2>
                            <p>{ipo.about || `${companyName} is coming up with an IPO. The issue opens on ${openDate} and closes on ${closeDate}. Investors can apply via ASBA or UPI.`}</p>

                            <h3>IPO Details</h3>
                            <table className="details-table">
                                <tbody>
                                    <tr><td><strong>Open Date</strong></td><td>{openDate}</td></tr>
                                    <tr><td><strong>Close Date</strong></td><td>{closeDate}</td></tr>
                                    <tr><td><strong>Listing Date</strong></td><td>{listingDate}</td></tr>
                                    <tr><td><strong>Face Value</strong></td><td>₹{ipo.faceValue || 10} per share</td></tr>
                                    <tr><td><strong>Price Band</strong></td><td>{priceBand}</td></tr>
                                    <tr><td><strong>Lot Size</strong></td><td>{ipo.lotSize || "TBA"} Shares</td></tr>
                                </tbody>
                            </table>
                        </section>

                        <section className="card">
                            <h2>{companyName} IPO GMP Today</h2>
                            <div className="gmp-box">
                                <div className="gmp-val">₹{gmp}</div>
                                <div className="gmp-label">Current Grey Market Premium</div>
                                <p className="gmp-note">
                                    GMP indicates a potential listing gain of <strong>{gmp > 0 && ipo.priceBand?.max ? ((gmp / ipo.priceBand.max) * 100).toFixed(2) : 0}%</strong>.
                                </p>
                            </div>
                            <p>
                                Check <Link href="/ipo-gmp">Live IPO GMP</Link> trends for other companies.
                            </p>
                        </section>

                        <section className="card">
                            <h2>IPO Allotment Status</h2>
                            <p>
                                The allotment for {companyName} IPO is expected to be finalized on <strong>{allotmentDate}</strong>.
                                You can check your status on the registrar's website.
                            </p>
                            <Link href="/ipo-allotment" className="btn-primary">Check Allotment Status</Link>
                        </section>

                        <section className="card">
                            <h2>{companyName} IPO Review</h2>
                            <p>
                                Should you apply for {companyName}?
                                {gmp > 50 ? " The GMP suggests strong demand." : " Market sentiment is neutral."}
                                Always analyzing the financial health before investing.
                                Read our <Link href="/what-is-ipo">What is IPO</Link> guide for better understanding.
                            </p>
                        </section>
                    </main>

                    {/* Sidebar */}
                    <aside>
                        <div className="sidebar-card">
                            <h3>Quick Links</h3>
                            <ul className="links-list">
                                <li><Link href="/">OpenIPO Homepage</Link></li>
                                <li><Link href="/ipo-calendar">Upcoming IPOs</Link></li>
                                <li><Link href="/ipo-gmp">Latest GMP</Link></li>
                            </ul>
                        </div>
                    </aside>
                </div>

            </div>

            <style jsx>{`
        .page-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 24px 16px;
        }
        .breadcrumb {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 24px;
        }
        .breadcrumb a {
            color: #2563eb;
            text-decoration: none;
        }
        
        .page-header {
            margin-bottom: 30px;
        }
        .header-top {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        .company-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        h1 {
            margin: 4px 0 8px 0;
            font-size: 2rem;
            color: #0f172a;
        }
        .badge {
            background: #f1f5f9;
            color: #475569;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
        }
        .subtitle {
            font-size: 1.1rem;
            color: #475569;
            margin: 0;
        }
        .green { color: #16a34a; }

        .content-grid {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 30px;
        }
        
        .card {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        h2 {
            margin-top: 0;
            font-size: 1.5rem;
            color: #1e293b;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid #f8fafc;
        }
        h3 {
            font-size: 1.2rem;
            color: #334155;
            margin-top: 20px;
            margin-bottom: 12px;
        }
        p {
            line-height: 1.6;
            color: #475569;
            margin-bottom: 16px;
        }
        a {
            color: #2563eb;
            text-decoration: underline;
            font-weight: 600;
        }
        
        .details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .details-table td {
            padding: 10px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
        }
        .details-table tr:last-child td { border: none; }
        
        .gmp-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 16px;
        }
        .gmp-val {
            font-size: 2.5rem;
            font-weight: 800;
            color: #16a34a;
        }
        .gmp-label {
            color: #15803d;
            font-weight: 600;
        }
        .gmp-note {
            font-size: 0.9rem;
            margin-top: 8px;
            margin-bottom: 0;
        }

        .btn-primary {
            display: inline-block;
            background: #2563eb;
            color: #fff;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: background 0.2s;
        }
        .btn-primary:hover {
            background: #1d4ed8;
        }

        .sidebar-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
        }
        .links-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .links-list li {
            margin-bottom: 10px;
        }

        @media (max-width: 768px) {
            .content-grid {
                grid-template-columns: 1fr;
            }
            .header-top {
                flex-direction: column;
                align-items: flex-start;
            }
        }
      `}</style>
        </>
    );
}
