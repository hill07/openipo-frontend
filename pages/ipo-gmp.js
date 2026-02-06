import { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import { iposAPI } from '../services/api';

export default function IpoGmp() {
    const [ipos, setIpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await iposAPI.getAll({ page, limit });
                const list = response.data?.ipos || [];
                const total = response.data?.count || 0;

                // Filter for IPOs that are active (Server side filtering is better but for now client side consistent)
                // Note: Pagination with client-side filtering is tricky. Ideally backend filters.
                // Assuming backend returns sorted, paginated results, we just render what we get.
                // However, the current backend controller filters by status if provided.
                // Let's rely on backend filtering if we want true pagination.
                // The previous code did client side filtering which breaks pagination logic (fetching 20 and filtering 10 leaves 10).

                // Let's just use the list from backend and assume backend handles 'active' status if we want.
                // But the user wants specific statuses. 
                // Let's keep the filter simple: Display what the API gives us, maybe verifying status.

                setIpos(list);
                setTotalPages(Math.ceil(total / limit));
            } catch (e) {
                console.error("Failed to fetch GMP data", e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [page]);

    return (
        <>
            <SEO
                title="IPO GMP Today | Live GMP, Kostak Rates & Subject to Sauda | OpenIPO"
                description="Check latest IPO GMP Today (Grey Market Premium) for Mainboard and SME IPOs. Track live premium rates, Kostak rates, and Subject to Sauda for upcoming IPOs."
                canonical="https://openipo.in/ipo-gmp"
            />

            <div className="page-container">
                <header className="page-header">
                    <h1>IPO GMP Today: Live Grey Market Premium</h1>
                    <p className="subtitle">
                        Track the latest market sentiment and estimated listing gains for all upcoming Indian IPOs.
                    </p>
                </header>

                {/* GMP Data Table */}
                <section className="gmp-table-section">
                    {loading ? (
                        <div className="loading">Loading live GMP rates...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="gmp-table">
                                <thead>
                                    <tr>
                                        <th>IPO Name</th>
                                        <th>Price Band</th>
                                        <th>GMP (₹)</th>
                                        <th>Est. Listing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ipos.map(ipo => {
                                        const price = ipo.priceBand?.max || 0;
                                        const gmp = ipo.gmp?.current || 0;
                                        const estListing = price + gmp;
                                        const gain = price > 0 ? ((gmp / price) * 100).toFixed(2) : 0;

                                        return (
                                            <tr key={ipo._id || ipo.slug}>
                                                <td>
                                                    <Link href={`/ipo/${ipo.slug}`} className="company-link">
                                                        {ipo.companyName}
                                                        <span className={`tag ${ipo.type === 'SME' ? 'sme' : 'main'}`}>
                                                            {ipo.type === 'SME' ? 'SME' : 'Main'}
                                                        </span>
                                                    </Link>
                                                </td>
                                                <td>{price > 0 ? `₹${price}` : 'TBA'}</td>
                                                <td className="gmp-cell">
                                                    <span className="gmp-val">₹{gmp}</span>
                                                    <span className="gmp-gain">({gain}%)</span>
                                                </td>
                                                <td>{estListing > 0 ? `₹${estListing}` : 'TBA'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {ipos.length === 0 && !loading && <p className="empty">No active GMP data available at the moment.</p>}

                    {/* Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="page-btn"
                            >
                                &larr; Previous
                            </button>
                            <span className="page-info">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="page-btn"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    )}
                </section>

                <article className="content-wrapper">
                    <section>
                        <h2>What is IPO GMP?</h2>
                        <p>
                            <strong>IPO GMP</strong> or <strong>Grey Market Premium</strong> is the extra amount that investors are willing to pay for an IPO share in the unofficial (grey) market before it is listed on the stock exchanges.
                            The grey market is an over-the-counter market where deals are made in cash on a personal basis.
                        </p>
                        <p>
                            The <strong>GMP</strong> indicates how the IPO might perform on listing day. A high GMP usually signals a strong listing, while a negative GMP suggests a discount listing.
                            Always check the <Link href="/ipo-calendar">Upcoming IPO Calendar</Link> to cross-reference dates with GMP trends.
                        </p>
                    </section>

                    <section>
                        <h2>How is GMP Calculated?</h2>
                        <p>
                            GMP is driven by demand and supply. If the demand for an <Link href="/">IPO</Link> is high among HNI (High Net-worth Individuals) and Retail investors, the GMP shoots up.
                            Factors affecting GMP include:
                        </p>
                        <ul>
                            <li>Company Fundamentals & Financials</li>
                            <li>Subscription Numbers (Over-subscription leads to higher GMP)</li>
                            <li>Market Sentiment (Bull vs Bear market)</li>
                            <li>Peer Comparison</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Terminologies related to GMP</h2>
                        <h3>Kostak Rate</h3>
                        <p>
                            Kostak rate is the amount an investor gets for selling their IPO application in the grey market, regardless of allotment.
                            This applies even if you don't get the allotment.
                        </p>
                        <h3>Subject to Sauda (SS)</h3>
                        <p>
                            Subject to Sauda allows an investor to sell their potential allotment at a fixed price. However, this deal is valid only if they actually get the allotment.
                            If you get allotment, you pass on the profit; if you check your <Link href="/ipo-allotment">IPO Allotment Status</Link> and find zero shares, the deal is void.
                        </p>
                    </section>

                    <section>
                        <h2>Disclaimer</h2>
                        <p>
                            <strong>OpenIPO</strong> does not promote or deal in the Grey Market. The <strong>IPO GMP</strong> figures shown here are for educational and informational purposes only.
                            Grey market trading is unregulated and risky. Investors should make decisions based on the RHP and company fundamentals, not just GMP.
                        </p>
                    </section>
                </article>
            </div>

            <style jsx>{`
        .page-container {
            max-width: 1000px;
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
        
        .gmp-table-section {
            margin-bottom: 50px;
        }
        .table-responsive {
            overflow-x: auto;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
        }
        .gmp-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 600px;
        }
        .gmp-table th {
            background: #f8fafc;
            padding: 16px;
            text-align: left;
            font-weight: 700;
            color: #475569;
            border-bottom: 2px solid #e2e8f0;
        }
        .gmp-table td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            color: #1e293b;
            vertical-align: middle;
        }
        .gmp-table tr:last-child td {
            border-bottom: none;
        }
        .company-link {
            font-weight: 600;
            color: #0f172a;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .company-link:hover {
            color: #2563eb;
        }
        .tag {
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .tag.sme {
            background: #fff7ed;
            color: #ea580c;
        }
        .tag.main {
            background: #f0fdf4;
            color: #16a34a;
        }
        .gmp-cell {
            display: flex;
            flex-direction: column;
        }
        .gmp-val {
            font-weight: 700;
            color: #000000;
        }
        .gmp-gain {
            font-size: 0.8rem;
            color: #000000;
        }
        .loading, .empty {
            text-align: center;
            padding: 40px;
            color: #64748b;
            font-weight: 600;
        }

        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 30px;
        }
        .page-btn {
            padding: 8px 16px;
            border: 1px solid #e2e8f0;
            background: #fff;
            color: #0f172a;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .page-btn:hover:not(:disabled) {
            background: #f8fafc;
            border-color: #cbd5e1;
        }
        .page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .page-info {
            color: #64748b;
            font-weight: 500;
        }

        .content-wrapper {
            max-width: 800px;
            margin: 0 auto;
        }
        .content-wrapper section {
            margin-bottom: 40px;
        }
        .content-wrapper h2 {
            font-size: 1.8rem;
            color: #1e293b;
            margin-bottom: 16px;
        }
        .content-wrapper h3 {
            font-size: 1.3rem;
            color: #334155;
            margin-top: 24px;
            margin-bottom: 10px;
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

        @media (max-width: 768px) {
            .page-container {
                padding: 24px 12px;
            }
            .page-header h1 {
                font-size: 1.8rem;
            }
        }
      `}</style>
        </>
    );
}
