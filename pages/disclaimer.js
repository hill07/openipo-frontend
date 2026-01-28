import Head from "next/head";

export default function Disclaimer() {
    return (
        <>
            <Head>
                <title>Disclaimer | OpenIPO</title>
                <meta name="description" content="Disclaimer for OpenIPO" />
            </Head>
            <div className="page-wrapper container">
                <main className="content-box">
                    <h1>Disclaimer</h1>
                    <p>Last updated: January 20, 2026</p>

                    <section>
                        <h2>General Information</h2>
                        <p>The information provided on OpenIPO is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>
                    </section>

                    <section>
                        <h2>Not Financial Advice</h2>
                        <p>The content covering IPOs, stock markets, and financial data is not intended to be financial advice. OpenIPO is not a SEBI registered investment advisor. You should not rely on any information on the Site as a substitute for professional financial advice. Always consult with a qualified financial advisor before making any investment decisions.</p>
                        <p>Investments in the securities market are subject to market risks. Read all the related documents carefully before investing.</p>
                    </section>

                    <section>
                        <h2>External Links</h2>
                        <p>The Site may contain links to other websites or content belonging to or originating from third parties (such as SEBI, BSE, NSE, or broker websites). Such external links are not investigated, monitored, or checked for accuracy by us.</p>
                    </section>

                    <section>
                        <h2>Grey Market Premium (GMP)</h2>
                        <p>GMP values shown are speculative and based on market rumors. They do not represent exact listing gains. We do not support or encourage trading in the grey market.</p>
                    </section>
                </main>
            </div>
            <style jsx>{`
                .page-wrapper { min-height: 100vh; padding: 40px 20px; background: #f8fafc; font-family: 'Outfit', sans-serif; color: #334155; }
                .container { max-width: 800px; margin: 0 auto; }
                .content-box { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
                h1 { margin-top: 0; font-size: 32px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 24px; }
                h2 { margin-top: 32px; font-size: 20px; color: #1e293b; font-weight: 600; }
                p { line-height: 1.6; margin-bottom: 16px; }
            `}</style>
        </>
    );
}
