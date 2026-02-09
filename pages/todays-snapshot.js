import Head from 'next/head';
import Link from 'next/link';
import { iposAPI } from '../services/api';
import IPOCard from '../components/IPOCard';
import { isToday } from '../utils/ipo';

export async function getServerSideProps() {
  try {
    const response = await iposAPI.getAll({ limit: 100 });
    const ipos = response.data?.ipos || [];
    return { props: { ipos } };
  } catch (error) {
    console.error("Error fetching IPOs:", error);
    return { props: { ipos: [] } };
  }
}

export default function TodaysSnapshot({ ipos }) {
  // Filter IPOs
  const openToday = ipos.filter(ipo => isToday(ipo.dates?.open));
  const closingToday = ipos.filter(ipo => isToday(ipo.dates?.close));
  const allotmentToday = ipos.filter(ipo => isToday(ipo.dates?.allotment));
  const listingToday = ipos.filter(ipo => isToday(ipo.dates?.listing));

  const sections = [
    { title: "Opening Today", data: openToday, status: "OPEN" },
    { title: "Closing Today", data: closingToday, status: "CLOSING" }, // Status for card might need adjustment if Card supports CLOSING
    { title: "Allotment Out Today", data: allotmentToday, status: "ALLOTMENT" },
    { title: "Listing Today", data: listingToday, status: "LISTED" }
  ];

  return (
    <>
      <Head>
        <title>Today's Snapshot | OpenIPO</title>
        <meta name="description" content="Daily IPO updates: Openings, Closings, Allotments, and Listings happening today." />
      </Head>

      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">Today's Snapshot</h1>
          <p className="page-subtitle">All the important IPO events happening today.</p>
        </header>

        <div className="sections-wrapper">
          {sections.map((section, idx) => (
            <section key={idx} className="snapshot-section">
              <h2 className="section-title">
                {section.title} <span className="count-badge">{section.data.length}</span>
              </h2>

              {section.data.length > 0 ? (
                <ul className="simple-list">
                  {section.data.map(ipo => (
                    <li key={ipo._id || ipo.slug}>
                      <Link href={`/ipo/${ipo.slug}`} className="simple-link">
                        <div className="link-content">
                          <div className="logo-wrapper">
                            {ipo.logo ? (
                              <img src={ipo.logo} alt={ipo.companyName} className="company-logo" />
                            ) : (
                              <div className="logo-placeholder">{ipo.companyName?.charAt(0)}</div>
                            )}
                          </div>
                          <span className="company-name">{ipo.companyName}</span>
                          <span className={`type-badge ${ipo.type === 'SME' ? 'sme' : 'mainboard'}`}>
                            {ipo.type === 'SME' ? 'SME' : 'Main'}
                          </span>
                          {/* <span className="arrow-icon">→</span> */}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  <span>Nothing {section.title.toLowerCase()}</span>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px;
        }
        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .page-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }
        .page-subtitle {
          color: #64748b;
          font-size: 1.1rem;
        }
        .sections-wrapper {
          display: grid;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .sections-wrapper {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .snapshot-section {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          height: fit-content; /* Prevents stretching if one column is longer */
        }
        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 10px;
        }
        .count-badge {
          background: #f1f5f9;
          color: #475569;
          font-size: 0.85rem;
          padding: 2px 8px;
          border-radius: 12px;
        }
        .simple-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .simple-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          color: #334155;
          text-decoration: none;
          border: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }
        .simple-link:hover {
          background: #fff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }
        .link-content {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        .company-name {
            font-weight: 700;
            color: #0f172a;
            font-size: 1.05rem;
        }
        .logo-wrapper {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            overflow: hidden;
            flex-shrink: 0;
            background: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .company-logo {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .logo-placeholder {
            font-weight: 700;
            color: #64748b;
            font-size: 0.9rem;
        }
        .type-badge {
            font-size: 0.7rem;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .type-badge.sme {
            background: #dbeafe;
            color: #1e40af;
        }
        .type-badge.mainboard {
            background: #dcfce7;
            color: #166534;
        }
        .arrow-icon {
            color: #94a3b8;
            font-weight: 600;
            transition: transform 0.2s;
        }
        .simple-link:hover .arrow-icon {
            color: #3b82f6;
            transform: translateX(4px);
        }
        .empty-state {
          padding: 30px;
          text-align: center;
          color: #94a3b8;
          font-style: italic;
          font-size: 0.95rem;
          background: #f8fafc;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}
