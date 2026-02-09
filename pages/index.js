import { useState, useEffect } from "react";
import Link from 'next/link';
import SEO from "../components/SEO";
import IPORow from "../components/IPORow";
import TodayHighlights from "../components/TodayHighlights";
import { iposAPI } from "../services/api";
import { getIPOStatusFromDates } from "../utils/ipo";

export async function getServerSideProps() {
  try {
    // Limit to Top 20 as per user request
    const response = await iposAPI.getAll({ limit: 20, page: 1 });

    const iposList = response.data?.ipos || [];

    return {
      props: {
        ipos: iposList,
        todayHighlights: {},
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        ipos: [],
        todayHighlights: {},
      },
    };
  }
}

export default function Home({ ipos: initialIPOs, todayHighlights }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [savedSlugs, setSavedSlugs] = useState([]);

  useEffect(() => {
    // Load saved IPOs from local storage
    const saved = JSON.parse(localStorage.getItem("savedIPO_slugs") || "[]");
    setSavedSlugs(saved);
  }, []);

  const iposWithStatus = (initialIPOs || []).map((ipo) => {
    const dates = ipo.dates || {};
    const normalizedDates = {
      open: dates.open,
      close: dates.close,
      allotment: dates.allotment,
      listing: dates.listing
    };

    return {
      ...ipo,
      startDate: dates.open,
      endDate: dates.close,
      allotmentDate: dates.allotment,
      listingDate: dates.listing,
      dates: normalizedDates,
      status: getIPOStatusFromDates(normalizedDates) || ipo.status,
      type: ipo.type === "MAINBOARD" ? "Mainboard" : ipo.type,
      minimumPrice: ipo.priceBand?.min,
      maximumPrice: ipo.priceBand?.max,
      gmpPrice: ipo.gmp?.current,
      allotment: ipo.allotment,
    };
  });


  let filteredIPOs = [...iposWithStatus];

  if (filterStatus !== "all") {
    const selectedStatuses = filterStatus.split(",").map((s) => s.trim());
    filteredIPOs = filteredIPOs.filter((ipo) => {
      let broadStatus = ipo.status;
      if (["Listed", "Allotted"].includes(ipo.status)) {
        broadStatus = "Closed";
      }
      return selectedStatuses.includes(ipo.status) || selectedStatuses.includes(broadStatus);
    });
  }

  if (filterType !== "all") {
    filteredIPOs = filteredIPOs.filter((ipo) => {
      if (filterType === "Mainboard") return ipo.type === "Mainboard";
      if (filterType === "SME") return ipo.type === "SME";
      return true;
    });
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredIPOs = filteredIPOs.filter(
      (ipo) => {
        const symbolStr = typeof ipo.symbol === 'object'
          ? `${ipo.symbol?.nse || ''} ${ipo.symbol?.bse || ''}`
          : ipo.symbol || '';

        return ipo.companyName?.toLowerCase().includes(query) ||
          symbolStr.toLowerCase().includes(query) ||
          ipo.type?.toLowerCase().includes(query);
      }
    );
  }

  filteredIPOs.sort((a, b) => {
    const aDate = a?.startDate ? new Date(a.startDate) : new Date(0);
    const bDate = b?.startDate ? new Date(b.startDate) : new Date(0);
    return bDate - aDate;
  });

  const savedIPOs = filteredIPOs.filter((ipo) => savedSlugs.includes(ipo.slug));

  return (
    <>
      <SEO
        title="IPO – Upcoming IPOs, IPO GMP Today & Allotment Status"
        description="OpenIPO provides latest IPO updates in India including upcoming IPOs, IPO GMP today, allotment status and detailed IPO information."
        canonical="https://openipo.in"
      />

      {/* Schema for Authority Hub */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "OpenIPO",
            "url": "https://openipo.in",
            "logo": "https://openipo.in/logo.png", // Ensure this exists or update
            "sameAs": []
          })
        }}
      />

      {/* Hero Section / Intro */}
      <div className="hero-section">
        <div className="container">
          <h1 className="main-title">IPO – Complete Indian IPO Platform</h1>
          <p className="hero-desc">
            Your trusted source for the latest <strong>IPO</strong> news, GMP trends, and allotment updates in the Indian share market.
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky-filter-bar">
        <div className="filter-container">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="Open">Open</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Closed">Closed</option>
              <option value="Open,Upcoming">Open + Upcoming</option>
              <option value="Open,Closed">Open + Closed</option>
              <option value="Upcoming,Closed">Upcoming + Closed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="Mainboard">Mainboard</option>
              <option value="SME">SME</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <input
              type="text"
              placeholder="Search company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-container">
        <div className="sidebar-section">
          <TodayHighlights todayHighlights={todayHighlights} ipos={iposWithStatus} />


        </div>

        <div className="content-column">
          <div className="ipo-list-section">
            {savedIPOs.length > 0 && (
              <section className="ipo-section saved-section">
                <h2 className="section-title">⭐ Saved IPOs ({savedIPOs.length})</h2>
                <div className="ipo-list">
                  {savedIPOs.map((ipo) => (
                    <IPORow key={ipo._id || ipo.slug} ipo={ipo} />
                  ))}
                </div>
              </section>
            )}

            <section className="ipo-section">
              <div className="section-header">
                <h2 className="section-title">
                  {filterStatus === "all"
                    ? "All IPOs"
                    : `${filterStatus} IPOs`}{" "}
                  ({filteredIPOs.length})
                </h2>
              </div>

              <div className="scrollable-list-container">
                <div className="ipo-list">
                  {filteredIPOs.map((ipo) => {
                    return <IPORow key={ipo._id || ipo.slug} ipo={ipo} />;
                  })}
                </div>

                {filteredIPOs.length > 5 && (
                  <div className="list-footer">
                    <span className="footer-text">Showing Top matches</span>
                  </div>
                )}
              </div>
            </section>

            {filteredIPOs.length === 0 && (
              <div className="empty-state">
                <p>No IPOs found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* SEO Content Sections (Authority Hub) */}
          <div className="seo-content-wrapper">

            {/* Section 1: What is IPO */}
            <section className="seo-text-section">
              <h2>What is IPO?</h2>
              <p>
                An <strong>Initial Public Offering (IPO)</strong> is the process by which a private company offers its shares to the public for the first time.
                Investing in an <strong>IPO</strong> allows retail investors to buy shares directly from the company before they are traded on stock exchanges like NSE and BSE.
              </p>
              <p>
                Understanding the core of <Link href="/what-is-ipo">What is IPO</Link> is crucial for every investor. It marks the transition of a company from private to public,
                unlocking value for early investors and raising capital for growth.
              </p>
            </section>

            {/* Section 2: Upcoming IPO */}
            <section className="seo-text-section">
              <h2>Upcoming IPO in India</h2>
              <p>
                Staying updated with the <Link href="/ipo-calendar">Upcoming IPO</Link> calendar is essential for planning your investments.
                The Indian market is witnessing a surge in Mainboard and SME <strong>IPO</strong> launches.
                Our platform provides real-time dates for Open, Close, and Listing days so you never miss an opportunity.
              </p>
            </section>

            {/* Section 3: IPO GMP */}
            <section className="seo-text-section">
              <h2>IPO GMP (Grey Market Premium)</h2>
              <p>
                The <Link href="/ipo-gmp">IPO GMP Today</Link> serves as a key indicator of the potential listing gain.
                GMP is the premium at which IPO shares are traded in the unofficial market before listing.
                High <strong>IPO</strong> GMP often suggests strong investor demand and likely positive listing debut.
              </p>
            </section>

            {/* Section 4: IPO Allotment */}
            <section className="seo-text-section">
              <h2>IPO Allotment Status</h2>
              <p>
                After applying, the next big event is the <Link href="/ipo-allotment">IPO Allotment Status</Link>.
                Registrars like Link Intime and KFintech handle the allotment process.
                You can check if you have been allotted shares by visiting our dedicated allotment checking guide.
              </p>
            </section>

            {/* Section 5: How to Apply */}
            <section className="seo-text-section">
              <h2>How to Apply for IPO</h2>
              <p>
                Ideally, you need a Demat account to apply. The process is simple via UPI mandates.
                Learn more about <Link href="/how-to-apply-ipo">How to Apply IPO</Link> effectively to maximize your chances of allotment.
              </p>
            </section>
          </div>

        </div>
      </div>

      <style jsx>{`
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 16px;
        }
        .hero-section {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 40px 0;
            text-align: center;
            margin-bottom: 20px;
        }
        .main-title {
            font-size: 2.5rem;
            color: #1e293b;
            margin-bottom: 12px;
        }
        .hero-desc {
            font-size: 1.1rem;
            color: #475569;
            max-width: 800px;
            margin: 0 auto;
        }

        .sticky-filter-bar {
          position: sticky;
          top: 60px;
          z-index: 900;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 18px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.06);
        }
        @media (max-width: 768px) {
          .sticky-filter-bar {
            top: 60px;
            padding: 10px 12px;
            overflow-x: auto;
          }
          .main-title {
              font-size: 1.8rem;
          }
        }

        .filter-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-group label {
          font-size: 0.85rem;
          font-weight: 900;
          color: #475569;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.88rem;
          background: #fff;
          cursor: pointer;
          min-width: 140px;
        }

        .search-group {
          flex: 1;
          min-width: 240px;
        }

        .search-input {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.9rem;
        }

        .main-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 20px;
          align-items: start;
        }

        .sidebar-section {
          position: sticky;
          top: 140px;
          height: fit-content;
        }

        .content-column {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }

        .ipo-section {
          margin-bottom: 26px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          gap: 10px;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 1000;
          color: #0f172a;
          margin: 0;
        }
        
        .scrollable-list-container {
            max-height: 800px;
            overflow-y: auto;
            padding-right: 8px;
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
        }
        
        .scrollable-list-container::-webkit-scrollbar {
            width: 6px;
        }
        .scrollable-list-container::-webkit-scrollbar-track {
            background: transparent;
        }
        .scrollable-list-container::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 10px;
        }

        .ipo-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .list-footer {
            text-align: center;
            padding: 16px 0;
            color: #94a3b8;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .saved-section {
          border: 1px solid #fbbf24;
          background: #fffbeb;
          border-radius: 16px;
          padding: 14px;
        }

        .empty-state {
          padding: 50px 12px;
          text-align: center;
          color: #64748b;
          font-weight: 700;
        }

        .seo-content-wrapper {
            background: #fff;
            padding: 30px;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
        }

        .seo-text-section {
            margin-bottom: 30px;
        }
        .seo-text-section h2 {
            font-size: 1.5rem;
            color: #1e293b;
            margin-bottom: 12px;
        }
        .seo-text-section p {
            font-size: 1rem;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 10px;
        }
        


        @media (max-width: 1024px) {
          .main-container {
            grid-template-columns: 1fr;
          }

          .sidebar-section {
            position: relative;
            top: 0;
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .sticky-filter-bar {
            top: 60px;
            padding: 8px 12px;
          }

          .filter-container {
            flex-direction: row;
            align-items: center;
            gap: 10px;
            flex-wrap: nowrap;
            width: 100%;
          }

          .sticky-filter-bar {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .sticky-filter-bar::-webkit-scrollbar {
            display: none;
          }

          .filter-group {
            flex-shrink: 0;
            gap: 4px;
          }

          .filter-group label {
            display: none;
          }

          .filter-select {
            width: auto;
            min-width: 110px;
            padding: 8px;
            font-size: 0.85rem;
          }

          .search-group {
            flex: 1;
            min-width: 140px;
          }

          .search-input {
            padding: 8px 12px;
            font-size: 0.85rem;
          }

          .main-container {
            padding: 12px;
          }

          .section-header {
            flex-direction: row;
          }
        }
      `}</style>
    </>
  );
}
