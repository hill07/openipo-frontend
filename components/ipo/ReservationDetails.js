import React from 'react';

const ReservationDetails = ({ reservations, limits, currency, lotSize, price }) => {
    // Determine min investment for each category if limits exist
    // price * lotSize * minLots
    const calcInvest = (lots) => {
        if (!lots || !price || !lotSize) return '-';
        return currency(lots * lotSize * price);
    };

    if ((!reservations?.length) && (!limits || Object.keys(limits).length === 0)) return null;

    return (
        <div className="res-wrapper">

            {/* Reservations Table */}
            {reservations && reservations.length > 0 && (
                <div className="mb-8">
                    <div className="section-title">🥧 IPM Reservation</div>
                    <div className="table-responsive">
                        <table className="res-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Shares Offered</th>
                                    <th>Allocation %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((res, i) => (
                                    <tr key={i}>
                                        <td className="font-semibold">{res.name}</td>
                                        <td>{res.sharesOffered ? Number(res.sharesOffered).toLocaleString('en-IN') : '-'}</td>
                                        <td>{res.percentage ? `${res.percentage}%` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Investment Limits Table */}
            {limits && (
                <div>
                    <div className="section-title">🏦 Investment Limits</div>
                    <div className="table-responsive">
                        <table className="res-table">
                            <thead>
                                <tr>
                                    <th>Investor Category</th>
                                    <th>Min Lots</th>
                                    <th>Max Lots</th>
                                    <th>Min Amount</th>
                                    <th>Max Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {limits.retail && (
                                    <tr>
                                        <td className="font-semibold">Retail (RII)</td>
                                        <td>{limits.retail.minLots || '1'}</td>
                                        <td>{limits.retail.maxLots || '-'}</td>
                                        <td>{calcInvest(limits.retail.minLots || 1)}</td>
                                        <td>{calcInvest(limits.retail.maxLots)}</td>
                                    </tr>
                                )}
                                {limits.shni && (
                                    <tr>
                                        <td className="font-semibold">S-HNI (Small)</td>
                                        <td>{limits.shni.minLots || '-'}</td>
                                        <td>{limits.shni.maxLots || '-'}</td>
                                        <td>{calcInvest(limits.shni.minLots)}</td>
                                        <td>{calcInvest(limits.shni.maxLots)}</td>
                                    </tr>
                                )}
                                {limits.bhni && (
                                    <tr>
                                        <td className="font-semibold">B-HNI (Big)</td>
                                        <td>{limits.bhni.minLots || '-'}</td>
                                        <td>{limits.bhni.maxLots || '-'}</td>
                                        <td>{calcInvest(limits.bhni.minLots)}</td>
                                        <td>{calcInvest(limits.bhni.maxLots)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 italic">* Amounts calculated at upper price band.</p>
                </div>
            )}

            <style jsx>{`
                .res-wrapper {
                    background: #fff;
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid #e2e8f0;
                    margin-top: 24px;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .table-responsive { overflow-x: auto; }
                .res-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }
                .res-table th {
                    text-align: left;
                    padding: 12px;
                    background: #f8fafc;
                    color: #64748b;
                    font-weight: 600;
                    border-bottom: 2px solid #e2e8f0;
                    white-space: nowrap;
                }
                .res-table td {
                    padding: 12px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #334155;
                    white-space: nowrap;
                }
                .res-table td.font-semibold { font-weight: 600; color: #0f172a; }
            `}</style>
        </div>
    );
};

export default ReservationDetails;
