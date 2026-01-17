import Head from "next/head";
import { useState, useEffect } from "react";
import IPORow from "../components/IPORow";
import TodayHighlights from "../components/TodayHighlights";

import { iposAPI, statsAPI } from "../services/api";
import { getIPOStatusFromDates } from "../utils/ipo";
import { getSavedIPOs } from "../utils/watchlist";

export async function getServerSideProps() {
  try {
    const [allIPOsData, statsData] = await Promise.all([
      iposAPI.getAll({ limit: 200 }).catch(() => ({ data: [], pagination: {} })),
      statsAPI.getDashboard().catch(() => ({ today: {}, stats: {} })),
    ]);

    return {
      props: {
        ipos: allIPOsData.data || [],
        stats: statsData.stats || {},
        todayHighlights: statsData.today || {},
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        ipos: [],
        stats: {},
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
    setSavedSlugs(getSavedIPOs());
    const handleWatchlistChange = () => setSavedSlugs(getSavedIPOs());

    window.addEventListener("watchlist-changed", handleWatchlistChange);
    return () =>
      window.removeEventListener("watchlist-changed", handleWatchlistChange);
  }, []);

  /**
   * ✅ Normalize IPO dates into the format required by getIPOStatusFromDates
   */
  const iposWithStatus = (initialIPOs || []).map((ipo) => {
    const normalizedDates = ipo?.dates || {
      open: ipo?.startDate || "",
      close: ipo?.endDate || "",
      allotment: ipo?.allotmentDate || "",
      listing: ipo?.listingDate || "",
    };

    return {
      ...ipo,
      dates: normalizedDates, // ✅ attach so IPORow can use same
      status: getIPOStatusFromDates(normalizedDates),
    };
  });

  let filteredIPOs = [...iposWithStatus];

  /**
   * ✅ Status filter
   */
  if (filterStatus !== "all") {
    const statuses = filterStatus.split(",").map((s) => s.trim());
    filteredIPOs = filteredIPOs.filter((ipo) => statuses.includes(ipo.status));
  }

  /**
   * ✅ Type filter (Mainboard/SME)
   * DB has: MAINBOARD, SME
   */
  if (filterType !== "all") {
    filteredIPOs = filteredIPOs.filter((ipo) => {
      if (filterType === "Mainboard") return ipo.type === "MAINBOARD";
      if (filterType === "SME") return ipo.type === "SME";
      return true;
    });
  }

  /**
   * ✅ Search filter
   */
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredIPOs = filteredIPOs.filter(
      (ipo) =>
        ipo.companyName?.toLowerCase().includes(query) ||
        ipo.symbol?.toLowerCase().includes(query) ||
        ipo.type?.toLowerCase().includes(query)
    );
  }

  /**
   * ✅ Sort by IPO Open Date (startDate)
   * Newest first
   */
  filteredIPOs.sort((a, b) => {
    const aDate = a?.startDate ? new Date(a.startDate) : new Date(0);
    const bDate = b?.startDate ? new Date(b.startDate) : new Date(0);
    return bDate - aDate;
  });

  /**
   * ✅ Saved IPOs section
   */
  const savedIPOs = filteredIPOs.filter((ipo) => savedSlugs.includes(ipo.slug));

  return (
    <>
      <Head>
        <title>OpenIPO - Indian IPO Dashboard</title>
        <meta
          name="description"
          content="Track open IPOs, upcoming IPOs, subscription, GMP, listing dates, and detailed information."
        />
      </Head>

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
              placeholder="Search company or symbol..."
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
          <TodayHighlights todayHighlights={todayHighlights} ipos={filteredIPOs} />
        </div>

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

            <div className="ipo-list">
              {filteredIPOs.map((ipo) => (
                <IPORow key={ipo._id || ipo.slug} ipo={ipo} />
              ))}
            </div>
          </section>

          {filteredIPOs.length === 0 && (
            <div className="empty-state">
              <p>No IPOs found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
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

        .ipo-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
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
