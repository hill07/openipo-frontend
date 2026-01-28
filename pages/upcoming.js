import Head from "next/head";
import UpcomingIPOCard from "../components/UpcomingIPOCard";
import { iposAPI } from "../services/api";

export async function getServerSideProps() {
    try {
        const iposData = await iposAPI.getAll({ status: "Upcoming" });
        return {
            props: {
                ipos: Array.isArray(iposData) ? iposData : (iposData.data || []),
            },
        };
    } catch (error) {
        console.error("Error fetching Upcoming IPOs:", error);
        return {
            props: { ipos: [] },
        };
    }
}

export default function Upcoming({ ipos }) {
    return (
        <>
            <Head>
                <title>Upcoming IPOs - OpenIPO</title>
                <meta name="description" content="List of upcoming IPOs in India." />
            </Head>

            <div className="page-container">
                <header className="page-header">
                    <h1 className="page-title">Upcoming Opportunities</h1>
                    <p className="page-subtitle">Get ready for these upcoming market debuts.</p>
                </header>

                {ipos.length > 0 ? (
                    <div className="ipo-grid">
                        {ipos.map((ipo) => (
                            <UpcomingIPOCard key={ipo._id || ipo.ipoId} ipo={ipo} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <img src="/empty-calendar.svg" alt="No IPOs" className="empty-icon" />
                        <h3>No Upcoming IPOs</h3>
                        <p>Market is quiet right now. Check back later!</p>
                    </div>
                )}
            </div>

            <style jsx>{`
        .page-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px 20px;
        }
        .page-header {
            margin-bottom: 32px;
            text-align: center;
        }
        .page-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px 0;
        }
        .page-subtitle {
            color: #64748b;
            font-size: 1.1rem;
        }
        .ipo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px dashed #cbd5e1;
        }
        .empty-icon {
            width: 80px;
            height: 80px;
            margin-bottom: 16px;
            opacity: 0.5;
        }
      `}</style>
        </>
    );
}
