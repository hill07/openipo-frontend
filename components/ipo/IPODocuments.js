export default function IPODocuments({ docs }) {
    if (!docs || Object.values(docs).every(x => !x)) return null;

    const links = [
        { label: 'DRHP', url: docs.drhp, color: 'bg-red-50 text-red-600 border-red-100' },
        { label: 'RHP', url: docs.rhp, color: 'bg-orange-50 text-orange-600 border-orange-100' },
        { label: 'Anchor Investor List', url: docs.anchor, color: 'bg-blue-50 text-blue-600 border-blue-100' },
        { label: 'Basis of Allotment', url: docs.boa, color: 'bg-green-50 text-green-600 border-green-100' },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Official Documents</h3>
            <div className="flex flex-wrap gap-3">
                {links.map((link, i) => link.url ? (
                    <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        className={`px-4 py-2 rounded-lg text-sm font-bold border ${link.color} transition-transform active:scale-95`}
                    >
                        {link.label}
                    </a>
                ) : null)}
            </div>
        </div>
    );
}
