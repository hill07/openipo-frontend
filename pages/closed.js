import Head from "next/head";
import ClosedIPOTable from "../components/ClosedIPOTable";
import { iposAPI } from "../services/api";

export async function getServerSideProps() {
    try {
        const iposData = await iposAPI.getAll({ status: "Closed", limit: 200 });
        return {
            props: {
                ipos: Array.isArray(iposData) ? iposData : (iposData.data || []),
            },
        };
    } catch (error) {
        console.error("Error fetching Closed IPOs:", error);
        return {
            props: { ipos: [] },
        };
    }
}

export default function Closed({ ipos }) {
    return (
        <>
            <Head>
                <title>Closed IPOs - History</title>
                <meta name="description" content="List of recently closed IPOs in India." />
            </Head>

            <div className="page-container">
                <header className="page-header">
                    <h1 className="page-title">Closed IPOs</h1>
                    <p className="page-subtitle">Performance history and listing details.</p>
                </header>

                {ipos.length > 0 ? (
                    <ClosedIPOTable ipos={ipos} />
                ) : (
                    <div className="empty-state">No Closed IPOs found in our database.</div>
                )}
            </div>

            <style jsx>{`
        .page-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px 16px;
        }
        .page-header {
            margin-bottom: 24px;
        }
        .page-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .page-subtitle {
             color: #64748b;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #64748b;
          font-weight: 600;
          background: #f8fafc;
          border-radius: 12px;
        }
      `}</style>
        </>
    );
}
