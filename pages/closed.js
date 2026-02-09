import Head from "next/head";
import IPOCard from "../components/IPOCard";
import { iposAPI } from "../services/api";
import { getIPOStatusFromDates } from "../utils/ipo";

export async function getServerSideProps() {
    try {
        // Fetch ALL IPOs (limit 100 to be safe) to perform robust filtering on frontend
        // This ensures what you see on Dashboard matches this page
        const response = await iposAPI.getAll({ limit: 100 });
        const rawIpos = response.data?.ipos || [];

        // Filter for CLOSED, ALLOTMENT, LISTED based on Computed Status
        // This fixes the issue where DB status might be stale "Upcoming"
        const closedIPOs = rawIpos.filter(ipo => {
            const dates = ipo.dates || {};
            const normalizedDates = {
                open: dates.open,
                close: dates.close,
                allotment: dates.allotment,
                listing: dates.listing
            };
            // Use the same logic as Dashboard
            const status = getIPOStatusFromDates(normalizedDates) || ipo.status;
            return ["Closed", "Allotted", "Listed"].includes(status);
        });

        // Map API data to component props structure
        const ipos = closedIPOs.map((ipo) => ({
            ...ipo,
            listingDate: ipo.dates?.listing || null,
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
        console.error("Error fetching closed IPOs:", error);
        return {
            props: {
                ipos: [],
            },
        };
    }
}

export default function Closed({ ipos }) {
    return (
        <>
            <Head>
                <title>Closed IPOs | OpenIPO</title>
                <meta
                    name="description"
                    content="History of closed, allotted, and listed IPOs. Check final prices, listing gains, and more."
                />
            </Head>

            <div className="page-container">
                <header className="page-header">
                    <h1 className="page-title">Closed IPOs</h1>
                </header>

                {ipos.length > 0 ? (
                    <div className="ipo-grid">
                        {ipos.map((ipo) => {
                            // Determine status strictly based on dates
                            // A date string exists, but we must check if it's in the past
                            const isListed = ipo.listingDate && new Date(ipo.listingDate) <= new Date();
                            const status = isListed ? "LISTED" : "CLOSED";
                            return <IPOCard key={ipo._id || ipo.slug} ipo={ipo} status={status} />;
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No closed IPOs found.</p>
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
          margin-bottom: 30px;
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
