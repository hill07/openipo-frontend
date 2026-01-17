import { useState } from "react";
import { formatDateForInput, parseDateFromInput, formatDateTimeForInput, parseDateTimeFromInput } from "../../utils/date";

export default function IPOForm({ initialData = {}, onSubmit, loading = false }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    companyName: initialData.companyName || "",
    slug: initialData.slug || "",
    logoUrl: initialData.logoUrl || "",
    sector: initialData.sector || "",
    ipoType: initialData.ipoType || "Mainboard",
    exchange: initialData.exchange || [],
    
    // Dates
    dates: {
      open: initialData.dates?.open ? formatDateForInput(initialData.dates.open) : "",
      close: initialData.dates?.close ? formatDateForInput(initialData.dates.close) : "",
      allotment: initialData.dates?.allotment ? formatDateForInput(initialData.dates.allotment) : "",
      refund: initialData.dates?.refund ? formatDateForInput(initialData.dates.refund) : "",
      demat: initialData.dates?.demat ? formatDateForInput(initialData.dates.demat) : "",
      listing: initialData.dates?.listing ? formatDateForInput(initialData.dates.listing) : "",
    },
    
    // Pricing
    pricing: {
      priceBand: initialData.pricing?.priceBand || "",
      faceValue: initialData.pricing?.faceValue || "",
      issuePrice: initialData.pricing?.issuePrice || "",
    },
    
    // Issue Details
    issueDetails: {
      issueSizeCr: initialData.issueDetails?.issueSizeCr || "",
      freshIssueCr: initialData.issueDetails?.freshIssueCr || "",
      offerForSaleCr: initialData.issueDetails?.offerForSaleCr || "",
      issueType: initialData.issueDetails?.issueType || "",
      marketMaker: initialData.issueDetails?.marketMaker || "",
    },
    
    // Lot Details
    lotDetails: {
      lotSize: initialData.lotDetails?.lotSize || "",
      retailMinLots: initialData.lotDetails?.retailMinLots || "",
      retailMinAmount: initialData.lotDetails?.retailMinAmount || "",
      hniMinLots: initialData.lotDetails?.hniMinLots || "",
      hniMinAmount: initialData.lotDetails?.hniMinAmount || "",
    },
    
    // GMP
    gmp: {
      current: initialData.gmp?.current || "",
      kostak: initialData.gmp?.kostak || "",
      subjectToSauda: initialData.gmp?.subjectToSauda || "",
      updatedAt: initialData.gmp?.updatedAt ? formatDateTimeForInput(initialData.gmp.updatedAt) : "",
    },
    
    // Subscription
    subscription: {
      dayNumber: initialData.subscription?.dayNumber || "",
      categories: {
        qib: initialData.subscription?.categories?.qib || "",
        nii: initialData.subscription?.categories?.nii || "",
        retail: initialData.subscription?.categories?.retail || "",
        employee: initialData.subscription?.categories?.employee || "",
        shareholder: initialData.subscription?.categories?.shareholder || "",
      },
      updatedAt: initialData.subscription?.updatedAt ? formatDateTimeForInput(initialData.subscription.updatedAt) : "",
    },
    
    // Reservation
    reservation: {
      qib: initialData.reservation?.qib || "",
      nii: initialData.reservation?.nii || "",
      retail: initialData.reservation?.retail || "",
      employee: initialData.reservation?.employee || "",
      shareholder: initialData.reservation?.shareholder || "",
    },
    
    // Company
    company: {
      description: initialData.company?.description || "",
      businessModel: initialData.company?.businessModel || "",
      objectives: initialData.company?.objectives || "",
      promoters: initialData.company?.promoters?.join("\n") || "",
      promoterHolding: initialData.company?.promoterHolding || "",
      strengths: initialData.company?.strengths?.join("\n") || "",
      risks: initialData.company?.risks?.join("\n") || "",
    },
    
    // Financials
    financials: initialData.financials || [{ year: "", revenue: "", profit: "", eps: "", roe: "", roce: "" }],
    
    // Peers
    peers: initialData.peers || [{ name: "", pe: "", revenue: "", profitMargin: "" }],
    
    // Registrar
    registrar: {
      name: initialData.registrar?.name || "",
      website: initialData.registrar?.website || "",
      allotmentUrl: initialData.registrar?.allotmentUrl || "",
    },
    
    // Links
    links: {
      rhp: initialData.links?.rhp || "",
      drhp: initialData.links?.drhp || "",
      applyGroww: initialData.links?.applyGroww || "",
      applyZerodha: initialData.links?.applyZerodha || "",
      applyAngelOne: initialData.links?.applyAngelOne || "",
    },
  });

  const updateField = (path, value) => {
    const keys = path.split(".");
    const newData = { ...formData };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = { ...current[keys[i]] };
    }
    
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert form data to API format
    const submitData = {
      ...formData,
      dates: Object.fromEntries(
        Object.entries(formData.dates).map(([key, value]) => [
          key,
          value ? parseDateFromInput(value) : null
        ])
      ),
      gmp: {
        ...formData.gmp,
        updatedAt: formData.gmp.updatedAt ? parseDateTimeFromInput(formData.gmp.updatedAt) : null,
        current: formData.gmp.current ? parseFloat(formData.gmp.current) : null,
        kostak: formData.gmp.kostak ? parseFloat(formData.gmp.kostak) : null,
        subjectToSauda: formData.gmp.subjectToSauda ? parseFloat(formData.gmp.subjectToSauda) : null,
      },
      subscription: {
        ...formData.subscription,
        updatedAt: formData.subscription.updatedAt ? parseDateTimeFromInput(formData.subscription.updatedAt) : null,
        dayNumber: formData.subscription.dayNumber ? parseInt(formData.subscription.dayNumber) : null,
        categories: Object.fromEntries(
          Object.entries(formData.subscription.categories).map(([key, value]) => [
            key,
            value ? parseFloat(value) : 0
          ])
        ),
      },
      pricing: {
        ...formData.pricing,
        faceValue: formData.pricing.faceValue ? parseFloat(formData.pricing.faceValue) : null,
        issuePrice: formData.pricing.issuePrice ? parseFloat(formData.pricing.issuePrice) : null,
      },
      issueDetails: {
        ...formData.issueDetails,
        issueSizeCr: formData.issueDetails.issueSizeCr ? parseFloat(formData.issueDetails.issueSizeCr) : null,
        freshIssueCr: formData.issueDetails.freshIssueCr ? parseFloat(formData.issueDetails.freshIssueCr) : null,
        offerForSaleCr: formData.issueDetails.offerForSaleCr ? parseFloat(formData.issueDetails.offerForSaleCr) : null,
      },
      lotDetails: {
        ...formData.lotDetails,
        lotSize: formData.lotDetails.lotSize ? parseInt(formData.lotDetails.lotSize) : null,
        retailMinLots: formData.lotDetails.retailMinLots ? parseInt(formData.lotDetails.retailMinLots) : null,
        retailMinAmount: formData.lotDetails.retailMinAmount ? parseFloat(formData.lotDetails.retailMinAmount) : null,
        hniMinLots: formData.lotDetails.hniMinLots ? parseInt(formData.lotDetails.hniMinLots) : null,
        hniMinAmount: formData.lotDetails.hniMinAmount ? parseFloat(formData.lotDetails.hniMinAmount) : null,
      },
      reservation: Object.fromEntries(
        Object.entries(formData.reservation).map(([key, value]) => [
          key,
          value ? parseFloat(value) : null
        ])
      ),
      company: {
        ...formData.company,
        promoterHolding: formData.company.promoterHolding ? parseFloat(formData.company.promoterHolding) : null,
        promoters: formData.company.promoters ? formData.company.promoters.split("\n").filter(Boolean) : [],
        strengths: formData.company.strengths ? formData.company.strengths.split("\n").filter(Boolean) : [],
        risks: formData.company.risks ? formData.company.risks.split("\n").filter(Boolean) : [],
      },
      financials: formData.financials
        .filter(f => f.year || f.revenue || f.profit)
        .map(f => ({
          year: f.year,
          revenue: f.revenue ? parseFloat(f.revenue) : null,
          profit: f.profit ? parseFloat(f.profit) : null,
          eps: f.eps ? parseFloat(f.eps) : null,
          roe: f.roe ? parseFloat(f.roe) : null,
          roce: f.roce ? parseFloat(f.roce) : null,
        })),
      peers: formData.peers
        .filter(p => p.name || p.pe || p.revenue)
        .map(p => ({
          name: p.name,
          pe: p.pe ? parseFloat(p.pe) : null,
          revenue: p.revenue ? parseFloat(p.revenue) : null,
          profitMargin: p.profitMargin ? parseFloat(p.profitMargin) : null,
        })),
      exchange: Array.isArray(formData.exchange) ? formData.exchange : [],
    };

    onSubmit(submitData);
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "dates", label: "Dates" },
    { id: "pricing", label: "Pricing" },
    { id: "issue", label: "Issue Details" },
    { id: "lot", label: "Lot Details" },
    { id: "gmp", label: "GMP" },
    { id: "subscription", label: "Subscription" },
    { id: "reservation", label: "Reservation" },
    { id: "company", label: "Company" },
    { id: "financials", label: "Financials" },
    { id: "peers", label: "Peers" },
    { id: "registrar", label: "Registrar" },
    { id: "links", label: "Links" },
  ];

  return (
    <form onSubmit={handleSubmit} className="ipo-form">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "basic" && (
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => {
                    updateField("companyName", e.target.value);
                    if (!formData.slug) {
                      const slug = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                      updateField("slug", slug);
                    }
                  }}
                  required
                />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>IPO Type *</label>
                <select
                  value={formData.ipoType}
                  onChange={(e) => updateField("ipoType", e.target.value)}
                  required
                >
                  <option value="Mainboard">Mainboard</option>
                  <option value="SME">SME</option>
                </select>
              </div>
              <div className="form-group">
                <label>Exchange *</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.exchange.includes("NSE")}
                      onChange={(e) => {
                        const exchanges = e.target.checked
                          ? [...formData.exchange, "NSE"]
                          : formData.exchange.filter((ex) => ex !== "NSE");
                        updateField("exchange", exchanges);
                      }}
                    />
                    NSE
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.exchange.includes("BSE")}
                      onChange={(e) => {
                        const exchanges = e.target.checked
                          ? [...formData.exchange, "BSE"]
                          : formData.exchange.filter((ex) => ex !== "BSE");
                        updateField("exchange", exchanges);
                      }}
                    />
                    BSE
                  </label>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Sector</label>
                <input
                  type="text"
                  value={formData.sector}
                  onChange={(e) => updateField("sector", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Logo URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => updateField("logoUrl", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "dates" && (
          <div className="form-section">
            <h3>IPO Dates</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Open Date</label>
                <input
                  type="date"
                  value={formData.dates.open}
                  onChange={(e) => updateField("dates.open", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Close Date</label>
                <input
                  type="date"
                  value={formData.dates.close}
                  onChange={(e) => updateField("dates.close", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Allotment Date</label>
                <input
                  type="date"
                  value={formData.dates.allotment}
                  onChange={(e) => updateField("dates.allotment", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Refund Date</label>
                <input
                  type="date"
                  value={formData.dates.refund}
                  onChange={(e) => updateField("dates.refund", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Demat Date</label>
                <input
                  type="date"
                  value={formData.dates.demat}
                  onChange={(e) => updateField("dates.demat", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Listing Date</label>
                <input
                  type="date"
                  value={formData.dates.listing}
                  onChange={(e) => updateField("dates.listing", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="form-section">
            <h3>Pricing Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Price Band (e.g., ₹100-110)</label>
                <input
                  type="text"
                  value={formData.pricing.priceBand}
                  onChange={(e) => updateField("pricing.priceBand", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Face Value (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricing.faceValue}
                  onChange={(e) => updateField("pricing.faceValue", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Issue Price (₹) - Final</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricing.issuePrice}
                  onChange={(e) => updateField("pricing.issuePrice", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "issue" && (
          <div className="form-section">
            <h3>Issue Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Issue Size (₹ Cr)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.issueDetails.issueSizeCr}
                  onChange={(e) => updateField("issueDetails.issueSizeCr", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Fresh Issue (₹ Cr)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.issueDetails.freshIssueCr}
                  onChange={(e) => updateField("issueDetails.freshIssueCr", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Offer for Sale (₹ Cr)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.issueDetails.offerForSaleCr}
                  onChange={(e) => updateField("issueDetails.offerForSaleCr", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Issue Type</label>
                <select
                  value={formData.issueDetails.issueType}
                  onChange={(e) => updateField("issueDetails.issueType", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Fresh Issue">Fresh Issue</option>
                  <option value="Offer for Sale">Offer for Sale</option>
                  <option value="Combination">Combination</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Market Maker</label>
                <input
                  type="text"
                  value={formData.issueDetails.marketMaker}
                  onChange={(e) => updateField("issueDetails.marketMaker", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "lot" && (
          <div className="form-section">
            <h3>Lot Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Lot Size (Shares)</label>
                <input
                  type="number"
                  value={formData.lotDetails.lotSize}
                  onChange={(e) => updateField("lotDetails.lotSize", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Retail Min Lots</label>
                <input
                  type="number"
                  value={formData.lotDetails.retailMinLots}
                  onChange={(e) => updateField("lotDetails.retailMinLots", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Retail Min Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.lotDetails.retailMinAmount}
                  onChange={(e) => updateField("lotDetails.retailMinAmount", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>HNI Min Lots</label>
                <input
                  type="number"
                  value={formData.lotDetails.hniMinLots}
                  onChange={(e) => updateField("lotDetails.hniMinLots", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>HNI Min Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.lotDetails.hniMinAmount}
                  onChange={(e) => updateField("lotDetails.hniMinAmount", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "gmp" && (
          <div className="form-section">
            <h3>GMP (Grey Market Premium)</h3>
            <div className="form-row">
              <div className="form-group">
                <label>GMP Current (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gmp.current}
                  onChange={(e) => updateField("gmp.current", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Kostak (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gmp.kostak}
                  onChange={(e) => updateField("gmp.kostak", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Subject to Sauda (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gmp.subjectToSauda}
                  onChange={(e) => updateField("gmp.subjectToSauda", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Updated At</label>
                <input
                  type="datetime-local"
                  value={formData.gmp.updatedAt}
                  onChange={(e) => updateField("gmp.updatedAt", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="form-section">
            <h3>Subscription Data</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Day Number</label>
                <input
                  type="number"
                  value={formData.subscription.dayNumber}
                  onChange={(e) => updateField("subscription.dayNumber", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Updated At</label>
                <input
                  type="datetime-local"
                  value={formData.subscription.updatedAt}
                  onChange={(e) => updateField("subscription.updatedAt", e.target.value)}
                />
              </div>
            </div>
            <h4>Category Times</h4>
            <div className="form-row">
              <div className="form-group">
                <label>QIB (x)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.subscription.categories.qib}
                  onChange={(e) => updateField("subscription.categories.qib", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>NII (x)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.subscription.categories.nii}
                  onChange={(e) => updateField("subscription.categories.nii", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Retail (x)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.subscription.categories.retail}
                  onChange={(e) => updateField("subscription.categories.retail", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Employee (x)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.subscription.categories.employee}
                  onChange={(e) => updateField("subscription.categories.employee", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Shareholder (x)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.subscription.categories.shareholder}
                  onChange={(e) => updateField("subscription.categories.shareholder", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "reservation" && (
          <div className="form-section">
            <h3>Reservation (%)</h3>
            <div className="form-row">
              <div className="form-group">
                <label>QIB (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.reservation.qib}
                  onChange={(e) => updateField("reservation.qib", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>NII (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.reservation.nii}
                  onChange={(e) => updateField("reservation.nii", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Retail (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.reservation.retail}
                  onChange={(e) => updateField("reservation.retail", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Employee (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.reservation.employee}
                  onChange={(e) => updateField("reservation.employee", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Shareholder (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.reservation.shareholder}
                  onChange={(e) => updateField("reservation.shareholder", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "company" && (
          <div className="form-section">
            <h3>Company Information</h3>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="4"
                value={formData.company.description}
                onChange={(e) => updateField("company.description", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Business Model</label>
              <textarea
                rows="3"
                value={formData.company.businessModel}
                onChange={(e) => updateField("company.businessModel", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Objectives</label>
              <textarea
                rows="3"
                value={formData.company.objectives}
                onChange={(e) => updateField("company.objectives", e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Promoter Holding (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.company.promoterHolding}
                  onChange={(e) => updateField("company.promoterHolding", e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Promoters (one per line)</label>
              <textarea
                rows="3"
                value={formData.company.promoters}
                onChange={(e) => updateField("company.promoters", e.target.value)}
                placeholder="Promoter 1&#10;Promoter 2"
              />
            </div>
            <div className="form-group">
              <label>Strengths (one per line)</label>
              <textarea
                rows="4"
                value={formData.company.strengths}
                onChange={(e) => updateField("company.strengths", e.target.value)}
                placeholder="Strength 1&#10;Strength 2"
              />
            </div>
            <div className="form-group">
              <label>Risks (one per line)</label>
              <textarea
                rows="4"
                value={formData.company.risks}
                onChange={(e) => updateField("company.risks", e.target.value)}
                placeholder="Risk 1&#10;Risk 2"
              />
            </div>
          </div>
        )}

        {activeTab === "financials" && (
          <div className="form-section">
            <h3>Financial Data (₹ Cr)</h3>
            {formData.financials.map((fin, index) => (
              <div key={index} className="financial-row">
                <div className="form-row">
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="text"
                      value={fin.year || ""}
                      onChange={(e) => {
                        const newFinancials = [...formData.financials];
                        newFinancials[index] = { ...newFinancials[index], year: e.target.value };
                        setFormData({ ...formData, financials: newFinancials });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Revenue (₹ Cr)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={fin.revenue || ""}
                      onChange={(e) => {
                        const newFinancials = [...formData.financials];
                        newFinancials[index] = { ...newFinancials[index], revenue: e.target.value };
                        setFormData({ ...formData, financials: newFinancials });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Profit (₹ Cr)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={fin.profit || ""}
                      onChange={(e) => {
                        const newFinancials = [...formData.financials];
                        newFinancials[index] = { ...newFinancials[index], profit: e.target.value };
                        setFormData({ ...formData, financials: newFinancials });
                      }}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>EPS</label>
                    <input
                      type="number"
                      step="0.01"
                      value={fin.eps || ""}
                      onChange={(e) => {
                        const newFinancials = [...formData.financials];
                        newFinancials[index] = { ...newFinancials[index], eps: e.target.value };
                        setFormData({ ...formData, financials: newFinancials });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>ROE (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={fin.roe || ""}
                      onChange={(e) => {
                        const newFinancials = [...formData.financials];
                        newFinancials[index] = { ...newFinancials[index], roe: e.target.value };
                        setFormData({ ...formData, financials: newFinancials });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>ROCE (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={fin.roce || ""}
                      onChange={(e) => {
                        const newFinancials = [...formData.financials];
                        newFinancials[index] = { ...newFinancials[index], roce: e.target.value };
                        setFormData({ ...formData, financials: newFinancials });
                      }}
                    />
                  </div>
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newFinancials = formData.financials.filter((_, i) => i !== index);
                      setFormData({ ...formData, financials: newFinancials });
                    }}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  financials: [...formData.financials, { year: "", revenue: "", profit: "", eps: "", roe: "", roce: "" }]
                });
              }}
              className="btn-add"
            >
              + Add Financial Year
            </button>
          </div>
        )}

        {activeTab === "peers" && (
          <div className="form-section">
            <h3>Peer Comparison</h3>
            {formData.peers.map((peer, index) => (
              <div key={index} className="peer-row">
                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      value={peer.name || ""}
                      onChange={(e) => {
                        const newPeers = [...formData.peers];
                        newPeers[index] = { ...newPeers[index], name: e.target.value };
                        setFormData({ ...formData, peers: newPeers });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>P/E Ratio</label>
                    <input
                      type="number"
                      step="0.01"
                      value={peer.pe || ""}
                      onChange={(e) => {
                        const newPeers = [...formData.peers];
                        newPeers[index] = { ...newPeers[index], pe: e.target.value };
                        setFormData({ ...formData, peers: newPeers });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Revenue (₹ Cr)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={peer.revenue || ""}
                      onChange={(e) => {
                        const newPeers = [...formData.peers];
                        newPeers[index] = { ...newPeers[index], revenue: e.target.value };
                        setFormData({ ...formData, peers: newPeers });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Profit Margin (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={peer.profitMargin || ""}
                      onChange={(e) => {
                        const newPeers = [...formData.peers];
                        newPeers[index] = { ...newPeers[index], profitMargin: e.target.value };
                        setFormData({ ...formData, peers: newPeers });
                      }}
                    />
                  </div>
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newPeers = formData.peers.filter((_, i) => i !== index);
                      setFormData({ ...formData, peers: newPeers });
                    }}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  peers: [...formData.peers, { name: "", pe: "", revenue: "", profitMargin: "" }]
                });
              }}
              className="btn-add"
            >
              + Add Peer
            </button>
          </div>
        )}

        {activeTab === "registrar" && (
          <div className="form-section">
            <h3>Registrar Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Registrar Name</label>
                <input
                  type="text"
                  value={formData.registrar.name}
                  onChange={(e) => updateField("registrar.name", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={formData.registrar.website}
                  onChange={(e) => updateField("registrar.website", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Allotment URL</label>
                <input
                  type="url"
                  value={formData.registrar.allotmentUrl}
                  onChange={(e) => updateField("registrar.allotmentUrl", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "links" && (
          <div className="form-section">
            <h3>Important Links</h3>
            <div className="form-row">
              <div className="form-group">
                <label>RHP (PDF URL)</label>
                <input
                  type="url"
                  value={formData.links.rhp}
                  onChange={(e) => updateField("links.rhp", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>DRHP (PDF URL)</label>
                <input
                  type="url"
                  value={formData.links.drhp}
                  onChange={(e) => updateField("links.drhp", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Apply via Groww</label>
                <input
                  type="url"
                  value={formData.links.applyGroww}
                  onChange={(e) => updateField("links.applyGroww", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Apply via Zerodha</label>
                <input
                  type="url"
                  value={formData.links.applyZerodha}
                  onChange={(e) => updateField("links.applyZerodha", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Apply via AngelOne</label>
                <input
                  type="url"
                  value={formData.links.applyAngelOne}
                  onChange={(e) => updateField("links.applyAngelOne", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Saving..." : initialData._id ? "Update IPO" : "Create IPO"}
        </button>
        <button type="button" onClick={() => window.history.back()} className="btn-cancel">
          Cancel
        </button>
      </div>

      <style jsx>{`
        .ipo-form {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .tabs {
          display: flex;
          flex-wrap: wrap;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 12px;
          gap: 4px;
        }

        .tab {
          padding: 10px 16px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab:hover {
          color: #334155;
          background: #f1f5f9;
        }

        .tab.active {
          color: #008080;
          border-bottom-color: #008080;
          background: #fff;
        }

        .tab-content {
          padding: 24px;
          min-height: 400px;
        }

        .form-section h3 {
          font-size: 1.1rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 20px 0;
        }

        .form-section h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #334155;
          margin: 24px 0 12px 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
        }

        input,
        select,
        textarea {
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.875rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #2563eb;
        }

        textarea {
          resize: vertical;
        }

        .checkbox-group {
          display: flex;
          gap: 16px;
          padding: 10px 0;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          cursor: pointer;
        }

        .financial-row,
        .peer-row {
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 16px;
          position: relative;
        }

        .btn-remove {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 4px 8px;
          background: #fee2e2;
          color: #991b1b;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-add {
          padding: 10px 16px;
          background: #e0f2fe;
          color: #0284c7;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover {
          background: #bae6fd;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
        }

        .btn-submit {
          padding: 12px 24px;
          background: #008080;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          background: #006666;
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          padding: 12px 24px;
          background: #fff;
          color: #475569;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background: #f8fafc;
        }

        @media (max-width: 768px) {
          .tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-submit,
          .btn-cancel {
            width: 100%;
          }
        }
      `}</style>
    </form>
  );
}
