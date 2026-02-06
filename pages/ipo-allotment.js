import { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import { iposAPI } from '../services/api';

export default function IpoAllotment() {
    const [ipos, setIpos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await iposAPI.getAll({ limit: 50 });
                const list = response.data?.ipos || [];

                // Filter for Closed or Allotted IPOs
                const allotmentList = list.filter(ipo =>
                    ipo.status === "CLOSED" || ipo.status === "ALLOTMENT" || ipo.status === "LISTED"
                );

                // Sort by Close Date descending
                allotmentList.sort((a, b) => new Date(b.dates?.close || 0) - new Date(a.dates?.close || 0));

                setIpos(allotmentList.slice(0, 10)); // Top 10 recent
            } catch (e) {
                console.error("Failed to fetch IPOs", e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <SEO
                title="Check IPO Allotment Status | Link Intime, KFintech & Bigshare | OpenIPO"
                description="Check IPO Allotment Status online for Mainboard and SME IPOs. Direct links to Link Intime, KFintech, Bigshare, and NSE/BSE allotment status pages."
                canonical="https://openipo.in/ipo-allotment"
            />

            <div className="page-container">
                <header className="page-header">
                    <h1>IPO Allotment Status</h1>
                    <p className="subtitle">
                        Check if you got the shares! Direct links to all major IPO registrars in India.
                    </p>
                </header>

                {/* Recent Allotments List */}
                <section className="recent-allotments">
                    <h2>Recent IPO Allotments</h2>
                    {loading ? (
                        <p>Loading recent IPOs...</p>
                    ) : (
                        <ul className="allotment-list">
                            {ipos.map(ipo => (
                                <li key={ipo.slug}>
                                    <Link href={`/ipo/${ipo.slug}`} className="ipo-link">
                                        {ipo.companyName}
                                        {/* Date removed as per request */}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    {ipos.length === 0 && !loading && <p>No recent allotments found.</p>}
                </section>

                {/* Registrar Links Section */}
                <section className="registrars-grid">
                    <a href="https://linkintime.co.in/initial_offer/public-issues.html" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>Link Intime</h3>
                        <p>Check Status →</p>
                    </a>
                    <a href="https://kosmic.kfintech.com/ipostatus/" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>KFintech</h3>
                        <p>Check Status →</p>
                    </a>
                    <a href="https://www.bigshareonline.com/ipo_Allotment.html" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>Bigshare Services</h3>
                        <p>Check Status →</p>
                    </a>
                    <a href="https://maashitla.com/public-issues" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>Maashitla</h3>
                        <p>Check Status →</p>
                    </a>
                    <a href="https://www.skylinerta.com/ipo.php" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>Skyline Financial</h3>
                        <p>Check Status →</p>
                    </a>
                    <a href="https://online.cameoindia.com/" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>Cameo Corporate</h3>
                        <p>Check Status →</p>
                    </a>
                    <a href="http://www.purvashare.com/queries/" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>Purva Sharegistry</h3>
                        <p>Check Status →</p>
                    </a>
                    <a href="http://www.beetalfinancial.com/beetalfinancial/ipo.aspx" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>Beetal Financial</h3>
                        <p>Check Status →</p>
                    </a>
                    <a href="https://www.alankit.com/company/public-issue-search" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>Alankit Assignments</h3>
                        <p>Check Status →</p>
                    </a>
                    <a href="https://www.datamatics.com/investors/shareholder-services/ipo-allotment-status" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>Datamatics</h3>
                        <p>Check Status →</p>
                    </a>
                    <a href="https://www.integratedindia.in/Corporate-Container.aspx?CPI" target="_blank" rel="noopener noreferrer" className="registrar-card">
                        <h3>Integrated Registry</h3>
                        <p>Check Status →</p>
                    </a>
                </section>

                <article className="content-wrapper">
                    <section>
                        <h2>How to Check IPO Allotment Status?</h2>
                        <p>
                            Once the <Link href="/ipo-calendar">IPO Calendar</Link> shows that the allotment date has arrived, you can check your status on the registrar's website. You will need one of the following:
                        </p>
                        <ul>
                            <li><strong>PAN Number</strong> (Most common method)</li>
                            <li><strong>Application Number</strong> (From your broker/bank)</li>
                            <li><strong>DP Client ID</strong></li>
                        </ul>
                        <p>
                            Simply select the company name from the dropdown on the registrar's site, enter your details, and submit to see your allotment result.
                        </p>
                    </section>

                    <section>
                        <h2>What if I get zero shares?</h2>
                        <p>
                            If you are not allotted any shares, it means the IPO was oversubscribed and you were not picked in the lottery system.
                            Your blocked amount in the bank account will be released (unblocked) within 1-2 working days.
                            If you still want to invest, you can buy the shares on the listing day, but be careful of the <Link href="/ipo-gmp">IPO GMP</Link> volatility.
                        </p>
                    </section>

                    <section>
                        <h2>Basis of Allotment</h2>
                        <p>
                            The <strong>Basis of Allotment</strong> document is published by the registrar, detailing how many shares were allocated to different categories (Retail, HNI, QIB).
                            It gives transparency on the subscription levels and the probability of allotment.
                        </p>
                    </section>
                </article>
            </div>

            <style jsx>{`
        .page-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 16px;
            background: #fff;
        }
        .page-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .page-header h1 {
            font-size: 2.2rem;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .subtitle {
            font-size: 1.1rem;
            color: #64748b;
        }
        
        .registrars-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 50px;
        }
        .registrar-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .registrar-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            border-color: #cbd5e1;
        }
        .registrar-card h3 {
            color: #0f172a;
            margin-bottom: 8px;
            font-size: 1.1rem;
        }
        .registrar-card p {
            color: #2563eb;
            font-weight: 600;
        }
        .registrar-card.bse {
            border-color: #fca5a5;
            background: #fff1f2;
        }
        .registrar-card.bse h3 {
            color: #991b1b;
        }
        .registrar-card.bse p {
            color: #dc2626;
        }

        .recent-allotments {
            margin-bottom: 50px;
            background: #fffbeb;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #fcd34d;
        }
        .recent-allotments h2 {
            font-size: 1.3rem;
            color: #92400e;
            margin-bottom: 16px;
        }
        .allotment-list {
            list-style: none;
            padding: 0;
            display: grid;
            gap: 10px;
        }
        .ipo-link {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: #fff;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            color: #0f172a;
            border: 1px solid #fcd34d;
        }
        .ipo-link:hover {
            background: #fefce8;
        }
        .date {
            font-weight: 400;
            color: #64748b;
            font-size: 0.9rem;
        }

        .content-wrapper section {
            margin-bottom: 40px;
        }
        .content-wrapper h2 {
            font-size: 1.8rem;
            color: #1e293b;
            margin-bottom: 16px;
        }
        .content-wrapper p {
            line-height: 1.7;
            color: #475569;
            margin-bottom: 16px;
        }
        .content-wrapper ul {
            padding-left: 20px;
            margin-bottom: 20px;
            color: #475569;
        }
        .content-wrapper li {
            margin-bottom: 8px;
        }
        .content-wrapper a {
            color: #2563eb;
            text-decoration: underline;
            font-weight: 600;
        }
      `}</style>
        </>
    );
}
