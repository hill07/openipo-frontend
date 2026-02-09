import Head from "next/head";

export default function PrivacyPolicy() {
    return (
        <>
            <Head>
                <title>Privacy Policy | OpenIPO</title>
                <meta name="description" content="Privacy Policy for OpenIPO" />
            </Head>
            <div className="page-wrapper container">
                <main className="content-box">
                    <h1>Privacy Policy</h1>
                    <p>Last updated: January 20, 2026</p>

                    <section>
                        <h2>Introduction</h2>
                        <p>OpenIPO (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
                    </section>

                    <section>
                        <h2>Data We Collect</h2>
                        <p>We may collect, use, store, and transfer different kinds of personal data about you, including:</p>
                        <ul>
                            <li><strong>Identity Data:</strong> Name, username.</li>
                            <li><strong>Contact Data:</strong> Email address.</li>
                            <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, operating system.</li>
                            <li><strong>Usage Data:</strong> Information about how you use our website.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Cookies</h2>
                        <p>We use cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.</p>
                    </section>

                    <section>
                        <h2>Third-Party Links</h2>
                        <p>This website may include links to third-party websites, plug-ins, and applications. Clicking on those links may allow third parties to collect or share data about you.</p>
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
                ul { margin-bottom: 16px; padding-left: 20px; }
                li { margin-bottom: 8px; line-height: 1.6; }
            `}</style>
        </>
    );
}
