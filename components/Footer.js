import Link from "next/link";

import { useEffect, useState } from "react";
import { visitorAPI } from "../services/api";

export default function Footer() {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    visitorAPI.getCount()
      .then(res => setVisitorCount(res.data?.count || 0))
      .catch(err => console.error("Visitor count error:", err));
  }, []);

  return (
    <footer className="footer">
      <div className="footerInner">
        {/* Top section */}
        <div className="top">
          {/* Brand */}
          <div className="brand">
            <img src="/logo.png" alt="OpenIPO Logo" className="logo" />
            <div>
              <h3 className="brandName">OpenIPO</h3>
              <p className="brandTag">
                Indian IPO Dashboard — Track Open, Upcoming & Listed IPOs
              </p>
            </div>
          </div>

          {/* Columns */}
          <div className="cols">
            {/* Quick Links */}
            <div className="col">
              <p className="title">Quick Links</p>
              <Link href="/upcoming" className="link">Upcoming IPOs</Link>
              <Link href="/open" className="link">Open IPOs</Link>
              <Link href="/closed" className="link">Closed IPOs</Link>
              <Link href="/ipo-calendar" className="link">IPO Calendar</Link>
            </div>

            {/* Resources */}
            <div className="col">
              <p className="title">Resources</p>
              <Link href="/ipo-gmp" className="link">IPO GMP Today</Link>
              <Link href="/ipo-allotment" className="link">IPO Allotment Status</Link>
              <Link href="/what-is-ipo" className="link">What is IPO?</Link>
              <Link href="/blog" className="link">Blog & News</Link>
            </div>

            {/* Legal & Support */}
            <div className="col">
              <p className="title">Legal & Support</p>
              <Link href="/disclaimer" className="link">Disclaimer</Link>
              <Link href="/privacy-policy" className="link">Privacy Policy</Link>
              <Link href="/terms" className="link">Terms of Service</Link>
              <a href="mailto:openipo.in@gmail.com" className="email">
                Contact: openipo.in@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Bottom section */}
        <div className="bottom">
          <p className="copy">
            © {new Date().getFullYear()} <strong>OpenIPO</strong>. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Total Visits: <strong className="text-white">{visitorCount.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #000000;
          color: #e2e8f0;
          padding: 60px 20px 30px;
          margin-top: 50px;
          border-top: 1px solid #333;
        }

        .footerInner {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Top layout */
        .top {
          display: flex;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }

        /* Brand */
        .brand {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          min-width: 250px;
          flex: 1;
        }

        .logo {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          object-fit: contain;
          background: #111;
          border: 1px solid #333;
          padding: 8px;
        }

        .brandName {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .brandTag {
          margin: 8px 0 0;
          font-size: 0.95rem;
          color: #94a3b8;
          font-weight: 500;
          line-height: 1.5;
          max-width: 300px;
        }

        /* Columns */
        .cols {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          flex: 2;
        }

        .col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .title {
          margin: 0 0 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .link {
          text-decoration: none;
          color: #cbd5e1;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .link:hover {
          color: #ffffff;
          transform: translateX(4px);
        }

        .email {
          display: inline-block;
          margin-top: 8px;
          color: #ffffff;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid #333;
          padding-bottom: 2px;
        }
        
        .divider {
          height: 1px;
          margin: 40px 0 24px;
          background: #222;
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .copy {
          margin: 0;
          font-size: 0.9rem;
          color: #64748b;
        }

        .copy strong {
          color: #ffffff;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .top {
            flex-direction: column;
          }
          .cols {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .cols {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );


}
