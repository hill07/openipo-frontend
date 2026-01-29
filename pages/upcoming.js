import Head from "next/head";
import IPOCard from "../components/IPOCard";
import { iposAPI } from "../services/api";
import { getIPOStatusFromDates } from "../utils/ipo";

export async function getServerSideProps() {
    try {
        // Fetch ALL to filter robustly
        const response = await iposAPI.getAll({ limit: 100 });
        const rawIpos = response.data?.ipos || [];

        const upcomingIPOs = rawIpos.filter(ipo => {
            const dates = ipo.dates || {};
            const normalizedDates = {
                open: dates.open,
                close: dates.close,
                allotment: dates.allotment,
                listing: dates.listing
            };
            const status = getIPOStatusFromDates(normalizedDates) || ipo.status;
            return status === "Upcoming";
        });
//only for 
        // Map API data to component props structure
        const ipos = upcomingIPOs.map((ipo) => ({
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
        console.error("Error fetching upcoming IPOs:", error);
        return {
            props: {
                ipos: [],
            },
        };
    }
}

export default function Upcoming({ ipos }) {
    return (
        <>
            <Head>
                <title>Upcoming IPOs | OpenIPO</title>
                <meta
                    name="description"
                    content="Check out the list of upcoming IPOs in the Indian stock market. Get details on price band, dates, and opportunities."
                />
            </Head>

            <div className="page-container">
                <header className="page-header">
                    <h1 className="page-title">Upcoming IPOs</h1>

                </header>

                {ipos.length > 0 ? (
                    <div className="ipo-grid">
                        {ipos.map((ipo) => (
                            <IPOCard key={ipo._id || ipo.slug} ipo={ipo} status="UPCOMING" />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No upcoming IPOs announced yet.</p>
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
        }

        .page-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px 0;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          margin: 0;
        }

        .ipo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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