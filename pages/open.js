import Head from "next/head";
import IPOCard from "../components/IPOCard";
import { iposAPI } from "../services/api";
import { getIPOStatusFromDates } from "../utils/ipo";

export async function getServerSideProps() {
    try {
        const response = await iposAPI.getAll({ limit: 100 });
        const rawIpos = response.data?.ipos || [];

        const openIPOs = rawIpos.filter(ipo => {
            const dates = ipo.dates || {};
            const normalizedDates = {
                open: dates.open,
                close: dates.close,
                allotment: dates.allotment,
                listing: dates.listing
            };
            const status = getIPOStatusFromDates(normalizedDates) || ipo.status;
            return status === "Open";
        });

        const ipos = openIPOs.map((ipo) => ({
            ...ipo,
            startDate: ipo.dates?.open || null,
            endDate: ipo.dates?.close || null,
            minimumPrice: ipo.priceBand?.min || null,
            maximumPrice: ipo.priceBand?.max || null,
            gmpPrice: ipo.gmp?.current || null,
            type: ipo.type === "MAINBOARD" ? "Mainboard" : "SME",
        }));

        return {
            props: {
                ipos,
            },
        };
    } catch (error) {
        console.error("Error fetching open IPOs:", error);
        return {
            props: {
                ipos: [],
            },
        };
    }
}

export default function Open({ ipos }) {
    return (
        <>
            <Head>
                <title>Open IPOs | OpenIPO</title>
                <meta
                    name="description"
                    content="Live IPOs currently open for subscription. Don't miss out on these market opportunities."
                />
            </Head>

            <div className="page-container">
                <header className="page-header">
                    <div className="title-wrapper">
                        {/* <span className="live-pill">Live Now</span> */}
                        <h1 className="page-title">Open IPOs</h1>
                    </div>
                </header>

                {ipos.length > 0 ? (
                    <div className="ipo-grid">
                        {ipos.map((ipo) => (
                            <IPOCard key={ipo._id || ipo.slug} ipo={ipo} status="OPEN" />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No IPOs are currently open.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px;
          min-height: 60vh;
        }

        .page-header {
          margin-bottom: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
        }

        .live-pill {
            background: #dcfce7;
            color: #16a34a;
            font-size: 0.75rem;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .page-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          margin: 0;
        }

        .ipo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #f8fafc;
          border-radius: 16px;
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 600;
        }
      `}</style>
        </>
    );
}
