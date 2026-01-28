export default function IPORegistrar({ registrar, registrarAddress, phone, email, website, allotment }) {
    if (!registrar) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Registrar Contact</h3>

            <div className="flex flex-col gap-2">
                <h4 className="text-base font-bold text-slate-800">{registrar}</h4>

                {registrarAddress && (
                    <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                        {registrarAddress}
                    </p>
                )}

                <div className="flex flex-col gap-1 mt-3">
                    {phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="font-semibold w-16">Phone:</span> {phone}
                        </div>
                    )}
                    {email && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="font-semibold w-16">Email:</span>
                            <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
                        </div>
                    )}
                    {website && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="font-semibold w-16">Website:</span>
                            <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" className="text-blue-600 hover:underline">
                                {website}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Allotment Status Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                {allotment?.isAllotted ? (
                    <a
                        href={allotment.allotmentLink}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full py-3 px-4 bg-slate-900 text-white text-center text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                        Check Allotment
                    </a>
                ) : (
                    <div className="block w-full py-3 px-4 bg-slate-100 text-slate-400 text-center text-sm font-bold rounded-xl cursor-not-allowed">
                        Waiting for Allotment
                    </div>
                )}
            </div>
        </div>
    );
}
