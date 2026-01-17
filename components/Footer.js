import Link from "next/link";

export default function Footer() {
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

            {/* Legal */}
            <div className="col">
              <p className="title">Legal</p>
              <Link href="/disclaimer" className="link">Disclaimer</Link>
              <Link href="/privacy-policy" className="link">Privacy Policy</Link>
              <Link href="/terms" className="link">Terms of Service</Link>
            </div>

            {/* Support */}
            <div className="col">
              <p className="title">Support</p>
              <a href="mailto:openipo.in@gmail.com" className="email">
                openipo.in@gmail.com
              </a>
              <p className="supportNote">
                For inquiries, feedback, bug reports, or partnership.
              </p>
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

          <p className="note">
            ⚠️ Educational purpose only. We are <strong>NOT SEBI registered</strong>.
          </p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #0b1220;
          color: #cbd5e1;
          padding: 46px 16px 26px;
          margin-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footerInner {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Top layout */
        .top {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        /* Brand */
        .brand {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          min-width: 260px;
          flex: 1;
        }

        .logo {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          object-fit: contain;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px;
        }

        .brandName {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 1000;
          color: #ffffff;
        }

        .brandTag {
          margin: 8px 0 0;
          font-size: 0.92rem;
          color: #94a3b8;
          font-weight: 600;
          line-height: 1.5;
          max-width: 380px;
        }

        /* Columns */
        .cols {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          flex: 2;
          min-width: 520px;
        }

        .col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .title {
          margin: 0 0 2px;
          font-size: 0.85rem;
          font-weight: 1000;
          color: #e2e8f0;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .link {
          text-decoration: none;
          color: #cbd5e1;
          font-weight: 700;
          font-size: 0.92rem;
          transition: 0.15s ease;
        }

        .link:hover {
          color: #22c55e;
        }

        .email {
          display: inline-flex;
          width: fit-content;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: #22c55e;
          font-weight: 1000;
          text-decoration: none;
        }

        .email:hover {
          background: rgba(34, 197, 94, 0.18);
        }

        .supportNote {
          margin: 0;
          font-size: 0.9rem;
          color: #94a3b8;
          font-weight: 600;
          line-height: 1.5;
        }

        .divider {
          height: 1px;
          margin: 28px 0 18px;
          background: rgba(255, 255, 255, 0.08);
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
        }

        .copy {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 700;
          color: #94a3b8;
        }

        .copy strong {
          color: #ffffff;
        }

        .note {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 700;
          color: #94a3b8;
          line-height: 1.4;
        }

        .note strong {
          color: #ffffff;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .cols {
            min-width: unset;
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );

}
