import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

const safe = (v, fallback = "—") =>
  v === null || v === undefined || v === "" ? fallback : v;

const formatDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "subscription", label: "Subscription" },
  { key: "reservation", label: "Reservation" },
  { key: "gmp", label: "GMP" },
  { key: "allotment", label: "Allotment" },
  { key: "company", label: "Company" },
];

// ✅ BEST PRACTICE SSR FETCH
export async function getServerSideProps(ctx) {
  const { slug } = ctx.params;

  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    const res = await fetch(`${base}/api/ipos/${slug}`);
    const json = await res.json();

    if (!json?.success) return { notFound: true };

    return { props: { slug, payload: json } };
  } catch (err) {
    console.error("Slug SSR error:", err);
    return { notFound: true };
  }
}

export default function IPOPage({ payload }) {
  const [tab, setTab] = useState("overview");

  /**
   * ✅ Payload Shape (Backend suggested)
   * {
   *   success: true,
   *   ipo,
   *   details,
   *   reservation: [],
   *   subscription: [],
   *   gmp: [],
   *   basis: {}
   * }
   */
  const ipo = payload?.ipo || {};
  const details = payload?.details || {};
  const reservation = Array.isArray(payload?.reservation) ? payload.reservation : [];
  const subscription = Array.isArray(payload?.subscription) ? payload.subscription : [];
  const gmpHistory = Array.isArray(payload?.gmp) ? payload.gmp : [];
  const basis = payload?.basis || null;

  const companyName = details?.companyName || ipo?.companyName || "IPO Details";
  const companyLogo = details?.companyLogo || ipo?.companyLogo || "";

  const priceBand =
    details?.minimumPrice && details?.maximumPrice
      ? `₹${details.minimumPrice} - ₹${details.maximumPrice}`
      : ipo?.minimumPrice && ipo?.maximumPrice
      ? `₹${ipo.minimumPrice} - ₹${ipo.maximumPrice}`
      : "TBA";

  const latestGmp =
    details?.gmpPrice ??
    (gmpHistory?.length ? gmpHistory[gmpHistory.length - 1]?.gmpPrice : null);

  // ✅ Timeline dates (clean)
  const timeline = useMemo(() => {
    const t = details?.timeLine || {};
    const d = ipo?.dates || {};

    const items = [
      { key: "Open", value: t.startDate || ipo.startDate || d.open },
      { key: "Close", value: t.endDate || ipo.endDate || d.close },
      { key: "Allotment", value: t.allotmentDate || ipo.allotmentDate || d.allotment },
      { key: "Refund", value: t.refundDate },
      { key: "Credit", value: t.creditShareDate },
      { key: "Listing", value: t.listingDate || ipo.listingDate || d.listing },
    ];

    // ✅ Remove empty values to avoid showing blank cards
    return items.filter((x) => x.value);
  }, [details, ipo]);

  return (
    <>
      <Head>
        <title>{companyName} IPO Details | OpenIPO</title>
        <meta name="description" content={`${companyName} IPO details, GMP, subscription, reservation and timeline`} />
      </Head>

      <div className="page">
        {/* Breadcrumb */}
        <div className="crumb">
          <Link href="/">Home</Link> <span>›</span>
          <Link href="/">All IPO</Link> <span>›</span>
          <span className="muted">{companyName}</span>
        </div>

        {/* HERO */}
        <div className="hero">
          <div className="heroLeft">
            <div className="logoWrap">
              {companyLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={companyLogo} alt={companyName} />
              ) : (
                <div className="fallback">{companyName.slice(0, 2).toUpperCase()}</div>
              )}
            </div>

            <div>
              <h1>{companyName}</h1>
              <div className="badges">
                <span className="pill">{safe(details?.type || ipo?.type)}</span>
                <span className="pill">{safe(details?.exchanged || ipo?.exchanged)}</span>
                <span className="pill">{safe(details?.issueType || ipo?.issueType)}</span>
                <span className={`status ${ipo?.status?.toLowerCase() || ""}`}>{safe(ipo?.status)}</span>
              </div>
            </div>
          </div>

          <div className="heroRight">
            <div className="kpi">
              <span>Price Band</span>
              <b>{priceBand}</b>
            </div>
            <div className="kpi">
              <span>Lot Size</span>
              <b>{safe(details?.lotSize || ipo?.lotSize)}</b>
            </div>
            <div className="kpi">
              <span>Issue Size</span>
              <b>{safe(details?.totalIssuePrice || ipo?.totalIssuePrice)}</b>
            </div>
            <div className="kpi highlight">
              <span>GMP</span>
              <b>{latestGmp !== null ? `₹${latestGmp}` : "—"}</b>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
          {timeline.map((item) => (
            <div key={item.key} className="t">
              <span>{item.key.toUpperCase()}</span>
              <b>{formatDate(item.value)}</b>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card">
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="grid">
              <div className="item">
                <span>Face Value</span>
                <b>{safe(details?.faceValue)}</b>
              </div>

              <div className="item">
                <span>IPO Type</span>
                <b>{safe(details?.ipoType)}</b>
              </div>

              <div className="item">
                <span>Pre Holding</span>
                <b>{safe(details?.shareHoldingPreIssue)}</b>
              </div>

              <div className="item">
                <span>Post Holding</span>
                <b>{safe(details?.shareHoldingPostIssue)}</b>
              </div>

              <div className="docs">
                {details?.drhpLink && (
                  <a href={details.drhpLink} target="_blank" rel="noreferrer">
                    📄 DRHP
                  </a>
                )}
                {details?.rhpLink && (
                  <a href={details.rhpLink} target="_blank" rel="noreferrer">
                    📄 RHP
                  </a>
                )}
                {details?.anchorListLink && (
                  <a href={details.anchorListLink} target="_blank" rel="noreferrer">
                    📄 Anchor List
                  </a>
                )}
              </div>
            </div>
          )}

          {/* SUBSCRIPTION */}
          {tab === "subscription" && (
            <>
              {subscription.length ? (
                <div className="tableWrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Shares Offered</th>
                        <th>Shares Bid</th>
                        <th>Times</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscription.map((row, i) => (
                        <tr key={i}>
                          <td>{safe(row.name)}</td>
                          <td>{safe(row.shareOffered)}</td>
                          <td>{safe(row.shareBid)}</td>
                          <td>{safe(row.subscriptionTimes)}</td>
                          <td>{safe(row.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty">No subscription data available.</p>
              )}
            </>
          )}

          {/* RESERVATION */}
          {tab === "reservation" && (
            <>
              {reservation.length ? (
                <div className="tableWrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Shares Offered</th>
                        <th>Percentage</th>
                        <th>Max Allottees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservation.map((row, i) => (
                        <tr key={i}>
                          <td>{safe(row.name)}</td>
                          <td>{safe(row.sharesOffered)}</td>
                          <td>{safe(row.percentage)}</td>
                          <td>{safe(row.maximumAllottees)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty">No reservation data available.</p>
              )}
            </>
          )}

          {/* GMP */}
          {tab === "gmp" && (
            <>
              {gmpHistory.length ? (
                <div className="tableWrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>IPO Price</th>
                        <th>GMP</th>
                        <th>Estimated Listing</th>
                        <th>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gmpHistory.map((row, i) => (
                        <tr key={i}>
                          <td>{formatDate(row.gmpDate)}</td>
                          <td>{safe(row.ipoPrice)}</td>
                          <td>{safe(row.gmpPrice)}</td>
                          <td>{safe(row.estimatedListingPrice)}</td>
                          <td>{safe(row.estimatedListingPercentage)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty">No GMP available.</p>
              )}
            </>
          )}

          {/* ALLOTMENT */}
          {tab === "allotment" && (
            <>
              {basis?.basicOfAllotment ? (
                <a className="btn" target="_blank" rel="noreferrer" href={basis.basicOfAllotment}>
                  View Basis Of Allotment ↗
                </a>
              ) : (
                <p className="empty">Basis of allotment not available.</p>
              )}
            </>
          )}

          {/* COMPANY */}
          {tab === "company" && (
            <div className="company">
              {details?.about && (
                <>
                  <h3>About</h3>
                  <div className="html" dangerouslySetInnerHTML={{ __html: details.about }} />
                </>
              )}
              {details?.strength && (
                <>
                  <h3>Strength</h3>
                  <div className="html" dangerouslySetInnerHTML={{ __html: details.strength }} />
                </>
              )}
              {details?.risk && (
                <>
                  <h3>Risk</h3>
                  <div className="html" dangerouslySetInnerHTML={{ __html: details.risk }} />
                </>
              )}
              {details?.objectives && (
                <>
                  <h3>Objectives</h3>
                  <div className="html" dangerouslySetInnerHTML={{ __html: details.objectives }} />
                </>
              )}
              {details?.financialInformation && (
                <>
                  <h3>Financial Information</h3>
                  <div className="html" dangerouslySetInnerHTML={{ __html: details.financialInformation }} />
                </>
              )}

              {!details?.about &&
                !details?.strength &&
                !details?.risk &&
                !details?.objectives &&
                !details?.financialInformation && (
                  <p className="empty">Company details not available.</p>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 14px 60px;
        }
        .crumb {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 12px;
          color: #64748b;
          font-weight: 800;
          flex-wrap: wrap;
        }
        .crumb a {
          color: #0ea5e9;
          text-decoration: none;
          font-weight: 900;
        }
        .muted {
          color: #0f172a;
        }

        .hero {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .heroLeft {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .logoWrap {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .logoWrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .fallback {
          font-weight: 1000;
          color: #0f172a;
        }
        h1 {
          margin: 0;
          color: #0f172a;
          font-size: 1.5rem;
        }

        .badges {
          margin-top: 6px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pill {
          padding: 4px 10px;
          border-radius: 999px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .status {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 1000;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #334155;
        }
        .status.open {
          background: #dcfce7;
          color: #166534;
          border-color: #86efac;
        }
        .status.upcoming {
          background: #e0f2fe;
          color: #0369a1;
          border-color: #7dd3fc;
        }
        .status.closed {
          background: #f1f5f9;
          color: #475569;
          border-color: #cbd5e1;
        }

        .heroRight {
          display: grid;
          grid-template-columns: repeat(2, minmax(140px, 1fr));
          gap: 10px;
        }
        .kpi {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          padding: 10px;
        }
        .kpi span {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 900;
          text-transform: uppercase;
        }
        .kpi b {
          display: block;
          margin-top: 4px;
          color: #0f172a;
          font-weight: 1000;
        }
        .kpi.highlight {
          background: #ecfeff;
          border-color: #99f6e4;
        }

        .timeline {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
        }
        .t {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          padding: 10px;
        }
        .t span {
          font-size: 0.7rem;
          font-weight: 1000;
          color: #94a3b8;
        }
        .t b {
          display: block;
          margin-top: 3px;
          font-weight: 1000;
          color: #0f172a;
        }

        .tabs {
          margin-top: 16px;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 6px;
        }
        .tab {
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          background: #fff;
          padding: 8px 14px;
          font-weight: 1000;
          cursor: pointer;
          white-space: nowrap;
        }
        .tab.active {
          background: #0ea5e9;
          border-color: #0ea5e9;
          color: #fff;
        }

        .card {
          margin-top: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #fff;
          padding: 14px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .item {
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 12px;
        }
        .item span {
          display: block;
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 1000;
        }
        .item b {
          display: block;
          margin-top: 6px;
          color: #0f172a;
          font-weight: 1000;
        }

        .docs {
          grid-column: 1 / -1;
          display: flex;
          gap: 10px;
          margin-top: 6px;
          flex-wrap: wrap;
        }
        .docs a {
          color: #0ea5e9;
          font-weight: 1000;
          text-decoration: none;
        }

        .tableWrap {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 650px;
        }
        th,
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        th {
          background: #f8fafc;
          font-weight: 1100;
        }

        .empty {
          text-align: center;
          color: #64748b;
          font-weight: 1000;
          padding: 20px;
        }

        .btn {
          display: inline-flex;
          padding: 10px 14px;
          background: #0ea5e9;
          color: #fff;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 1000;
        }

        .company h3 {
          margin: 16px 0 8px;
          color: #0f172a;
        }

        .html {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px;
          background: #f8fafc;
          overflow-x: auto;
        }

        .company :global(p),
        .company :global(li) {
          color: #475569;
          font-weight: 600;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .timeline {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 640px) {
          .heroRight {
            grid-template-columns: 1fr 1fr;
            width: 100%;
          }
          .timeline {
            grid-template-columns: repeat(2, 1fr);
          }
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
