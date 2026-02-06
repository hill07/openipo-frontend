import Link from 'next/link';
import SEO from '../components/SEO';

export default function HowToApplyIPO() {
    return (
        <>
            <SEO
                title="How to Apply for IPO in India | Step-by-Step Guide (UPI & ASBA) | OpenIPO"
                description="Learn how to apply for IPO online in India using UPI (Zerodha, Groww, Upstox) or Net Banking (ASBA). Complete guide for beginners."
                canonical="https://openipo.in/how-to-apply-ipo"
            />

            <div className="page-container">
                <header className="page-header">
                    <h1>How to Apply for IPO in India</h1>
                    <p className="subtitle">
                        A comprehensive guide to applying for IPOs via UPI apps and Net Banking (ASBA).
                    </p>
                </header>

                <article className="content-wrapper">
                    <section>
                        <h2>Prerequisites for Investing in IPO</h2>
                        <p>
                            Before you begin, ensure you have the following ready:
                        </p>
                        <ul>
                            <li>A <strong>Demat Account</strong> (with brokers like Zerodha, Groww, AngelOne).</li>
                            <li>A active <strong>UPI ID</strong> (Google Pay, PhonePe, BHIM) linked to your bank.</li>
                            <li>Sufficient funds in your bank account blocked for the application.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Method 1: Apply via UPI (Most Popular)</h2>
                        <p>
                            Using UPI is the easiest way for retail investors to apply for an <Link href="/">IPO</Link>. Follow these steps:
                        </p>
                        <ol className="steps-list">
                            <li>
                                <strong>Login to Broker App:</strong> Open your trading app (e.g., Kite, Groww).
                            </li>
                            <li>
                                <strong>Go to IPO Section:</strong> Find the 'IPO' tab usually in the 'Orders' or 'Discover' section.
                            </li>
                            <li>
                                <strong>Select IPO:</strong> Choose the active IPO you want to apply for from the list. Check the <Link href="/ipo-gmp">IPO GMP</Link> before deciding.
                            </li>
                            <li>
                                <strong>Place Bid:</strong> Enter the quantity (Lot size). Always select the <strong>'Cut-off Price'</strong> to maximize allotment chances.
                            </li>
                            <li>
                                <strong>Enter UPI ID:</strong> Type your VPA (e.g., yourname@oksbi) and submit.
                            </li>
                            <li>
                                <strong>Approve Mandate:</strong> Open your UPI app. You will see a 'Mandate Request'. Approve it to block the amount.
                            </li>
                        </ol>
                        <div className="note-box">
                            <p><strong>Note:</strong> The money is not deducted immediately. It is only 'blocked'. It will be deducted only if you get the allotment.</p>
                        </div>
                    </section>

                    <section>
                        <h2>Method 2: Apply via ASBA (Net Banking)</h2>
                        <p>
                            ASBA (Application Supported by Blocked Amount) is available via your bank's net banking portal (HDFC, SBI, ICICI, etc.).
                        </p>
                        <ol>
                            <li>Login to Net Banking.</li>
                            <li>Look for 'IPO' or 'e-Services' section.</li>
                            <li>Select the IPO and enter your Demat Account details (DP ID).</li>
                            <li>Enter bid quantity and price.</li>
                            <li>Submit to block funds directly.</li>
                        </ol>
                    </section>

                    <section>
                        <h2>Tips for Higher IPO Allotment Chance</h2>
                        <p>
                            Since most good IPOs are oversubscribed, allotment is a lottery. Here are some tips:
                        </p>
                        <ul>
                            <li><strong>Apply at Cut-off Price:</strong> Always tick the cut-off price option.</li>
                            <li><strong>Avoid Last Minute:</strong> UPI mandates can delayed on the last day. Apply 1 day before closing. Check <Link href="/ipo-calendar">Close Dates</Link>.</li>
                            <li><strong>Multiple Accounts:</strong> Apply via different family members' Demat accounts to increase probability (1 lot per account).</li>
                        </ul>
                    </section>

                    <section>
                        <h2>What happens after applying?</h2>
                        <p>
                            After applying, wait for the Allotment Date. You can check your status on our <Link href="/ipo-allotment">IPO Allotment Status</Link> page.
                        </p>
                    </section>
                </article>
            </div>

            <style jsx>{`
        .page-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 16px;
            background: #fff;
        }
        .page-header {
            text-align: center;
            margin-bottom: 50px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 30px;
        }
        .page-header h1 {
            font-size: 2.2rem;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .subtitle {
            font-size: 1.1rem;
            color: #64748b;
        }
        
        .content-wrapper section {
            margin-bottom: 50px;
        }
        .content-wrapper h2 {
            font-size: 1.8rem;
            color: #1e293b;
            margin-bottom: 20px;
            padding-left: 16px;
            border-left: 4px solid #2563eb;
        } 
        .content-wrapper p, .content-wrapper li {
            line-height: 1.7;
            color: #475569;
            font-size: 1.05rem;
            margin-bottom: 16px;
        }
        .content-wrapper ul, .content-wrapper ol {
            padding-left: 24px;
            margin-bottom: 24px;
            color: #475569;
        }
        .steps-list li {
            margin-bottom: 16px;
        }
        .content-wrapper strong {
            color: #0f172a;
        }
        .content-wrapper a {
            color: #2563eb;
            text-decoration: underline;
            font-weight: 600;
        }

        .note-box {
            background: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 16px;
            border-radius: 4px;
            margin-top: 20px;
        }
        .note-box p {
            margin: 0;
            font-size: 0.95rem;
        }

        @media (max-width: 768px) {
            .page-container {
                padding: 24px 16px;
            }
            .page-header h1 {
                font-size: 1.8rem;
            }
        }
      `}</style>
        </>
    );
}
