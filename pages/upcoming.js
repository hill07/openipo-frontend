import Head from "next/head";
import { useState } from "react";
import IPORow from "../components/IPORow";
import { iposAPI } from "../services/api";
import { getIPOStatusFromDates } from "../utils/ipo";

export async function getServerSideProps() {
  try {
    const data = await iposAPI.getAll({ limit: 200 });
    const ipos = data.data || [];
    
    // Filter for Upcoming IPOs using status derivation
    const upcomingIPOs = ipos.filter(ipo => {
      const status = getIPOStatusFromDates(ipo?.dates || {});
      return status === "Upcoming";
    });
    
    // Sort by nearest open date
    upcomingIPOs.sort((a, b) => {
      const aOpen = a.dates?.open ? new Date(a.dates.open) : new Date(9999, 0, 1);
      const bOpen = b.dates?.open ? new Date(b.dates.open) : new Date(9999, 0, 1);
      return aOpen - bOpen;
    });
    
    return { props: { ipos: upcomingIPOs } };
  } catch (err) {
    console.error("Failed to load IPOs:", err);
    return { props: { ipos: [] } };
  }
}

export default function Upcoming({ ipos }) {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Apply filters
  let filteredIPOs = [...ipos];
  
  if (filterType !== "all") {
    filteredIPOs = filteredIPOs.filter(ipo => ipo.ipoType === filterType);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredIPOs = filteredIPOs.filter(ipo =>
      ipo.companyName?.toLowerCase().includes(query) ||
      ipo.sector?.toLowerCase().includes(query)
    );
  }

  return (
    <>
      <Head>
        <title>Upcoming IPOs | OpenIPO</title>
        <meta
          name="description"
          content="List of upcoming IPOs in India with open dates, issue size and key details."
        />
        <meta property="og:title" content="Upcoming IPOs | OpenIPO" />
        <meta property="og:description" content="Track all upcoming IPOs in India" />
      </Head>

      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Upcoming IPOs ({filteredIPOs.length})</h1>
          
          <div className="page-filters">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="Mainboard">Mainboard</option>
              <option value="SME">SME</option>
            </select>
            
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="ipo-list">
          {filteredIPOs.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming IPOs at the moment</p>
            </div>
          ) : (
            filteredIPOs.map((ipo) => (
              <IPORow key={ipo._id || ipo.slug} ipo={ipo} />
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .page-header {
          margin-bottom: 24px;
        }
        
        .page-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 16px 0;
        }
        
        .page-filters {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .filter-select,
        .search-input {
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.875rem;
        }
        
        .filter-select {
          min-width: 150px;
        }
        
        .search-input {
          flex: 1;
          max-width: 400px;
        }
        
        .search-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #2563eb;
        }
        
        .ipo-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }
        
        @media (max-width: 768px) {
          .page-container {
            padding: 12px;
          }
          
          .page-filters {
            flex-direction: column;
          }
          
          .filter-select,
          .search-input {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
