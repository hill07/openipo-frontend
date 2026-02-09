export default function IPOAbout({ title, content }) {
    if (!content) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {content}
            </div>
        </div>
    );
}
