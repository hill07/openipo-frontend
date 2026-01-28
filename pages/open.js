import Head from "next/head";
import OpenIPOCard from "../components/OpenIPOCard";
import { iposAPI } from "../services/api";

export async function getServerSideProps() {
    try {
        const iposData = await iposAPI.getAll({ status: "Open" });
        return {
            props: {
                ipos: Array.isArray(iposData) ? iposData : (iposData.data || []),
            },
        };
    } catch (error) {
        console.error("Error fetching Open IPOs:", error);
        return {
            props: { ipos: [] },
        };
    }
}

export default function Open({ ipos }) {
    return (
        <>
            <Head>
                <title>Open IPOs - Live Bidding</title>
                <meta name="description" content="List of currently Open IPOs in India." />
            </Head>

            <div className="page-container">
                <header className="page-header">
                    <h1 className="page-title">Live IPOs ({ipos.length})</h1>
                    <p className="page-subtitle">Apply now before the window closes.</p>
                </header>

                {ipos.length > 0 ? (
                    <div className="ipo-grid">
                        {ipos.map((ipo) => (
                            <OpenIPOCard key={ipo._id || ipo.ipoId} ipo={ipo} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>No Active IPOs</h3>
                        <p>There are no IPOs open for subscription at this moment.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
        .page-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 32px 16px;
        }
        .page-header {
            margin-bottom: 24px;
        }
        .page-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .page-subtitle {
          color: #64748b;
          margin-top: 4px;
        }
        .ipo-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        .empty-state {
          text-align: center;
          padding: 60px;
          color: #64748b;
          font-weight: 600;
          background: #f1f5f9;
          border-radius: 12px;
        }
      `}</style>
        </>
    );
}
