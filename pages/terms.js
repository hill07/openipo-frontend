import Head from "next/head";

export default function Terms() {
    return (
        <>
            <Head>
                <title>Terms of Service | OpenIPO</title>
                <meta name="description" content="Terms of Service for OpenIPO" />
            </Head>
            <div className="page-wrapper container">
                <main className="content-box">
                    <h1>Terms of Service</h1>
                    <p>Last updated: January 20, 2026</p>

                    <section>
                        <h2>Agreement to Terms</h2>
                        <p>By accessing or using OpenIPO, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.</p>
                    </section>

                    <section>
                        <h2>Intellectual Property</h2>
                        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of OpenIPO and its licensors.</p>
                    </section>

                    <section>
                        <h2>User Responsibilities</h2>
                        <p>You specifically agree not to use the website for any unlawful purpose or in any way that could damage the Site, the Service, or general business of the Company.</p>
                    </section>

                    <section>
                        <h2>Limitation of Liability</h2>
                        <p>In no event shall OpenIPO, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
                    </section>

                    <section>
                        <h2>Changes to Terms</h2>
                        <p>We reserve the right to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
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
