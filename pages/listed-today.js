import Head from "next/head";
import Link from "next/link";
import { listingAPI } from "../services/api";

export async function getServerSideProps() {
  try {
    const listings = await listingAPI.getToday();
    return { props: { listings: listings || [] } };
  } catch (err) {
    console.error("Failed to load listings:", err);
    return { props: { listings: [] } };
  }
}

export default function ListedToday({ listings }) {
  return (
    <>
      <Head>
        <title>Listed Today | OpenIPO</title>
        <meta
          name="description"
          content="Companies listed today on Indian stock exchanges with listing prices and gains."
        />
        <meta property="og:title" content="Listed Today | OpenIPO" />
        <meta property="og:description" content="Track IPOs listed today" />
      </Head>

      <div className="container">
        <h1 className="page-title">Listed Today ({listings.length})</h1>

        {listings.length === 0 ? (
          <p className="muted">No IPOs listed today</p>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div key={listing._id} className="listing-card">
                {listing.ipoId && (
                  <>
                    <div className="listing-header">
                      <h3>{listing.ipoId.companyName}</h3>
                      <Link href={`/ipo/${listing.ipoId.slug}`} className="view-link">
                        View Details →
                      </Link>
                    </div>
                    <div className="listing-details">
                      <div className="detail-item">
                        <span className="label">Listing Price</span>
                        <span className="value">₹{listing.listingPrice}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Issue Price</span>
                        <span className="value">₹{listing.issuePrice}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Gain %</span>
                        <span
                          className={`value ${listing.gainPercent >= 0 ? "gain" : "loss"}`}
                        >
                          {listing.gainPercent >= 0 ? "+" : ""}
                          {listing.gainPercent.toFixed(2)}%
                        </span>
                      </div>
                      {listing.estimatedListingPrice && (
                        <div className="detail-item">
                          <span className="label">Estimated Price</span>
                          <span className="value">₹{listing.estimatedListingPrice}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 24px;
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .listing-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .listing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .listing-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .view-link {
          color: #2563eb;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .view-link:hover {
          text-decoration: underline;
        }

        .listing-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item .label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
        }

        .detail-item .value {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .detail-item .value.gain {
          color: #16a34a;
        }

        .detail-item .value.loss {
          color: #ef4444;
        }

        .muted {
          color: #64748b;
          text-align: center;
          padding: 40px 20px;
        }
      `}</style>
    </>
  );
}