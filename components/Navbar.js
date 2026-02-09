import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <Head>
        <link rel="icon" href="https://img.sanishtech.com/u/c6cbaa8a547f26aa700087de181b3b54.png" />
        <style>
          {`
            /* Navbar styling */
            nav {
              position: sticky;
              top: 0;
              background-color: #fff;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
              z-index: 1000;
              transition: background-color 0.3s;
            }
            
            .navInner {
              display: flex;
              align-items: center;
              padding: 10px 20px;
              max-width: 1200px;
              margin: 0 auto;
              position: relative;
              gap: 16px;
            }

            /* Logo styles */
            .logo {
              display: flex;
              align-items: center;
              gap: 10px;
              text-decoration: none;
              font-weight: 900;
              color: #0f172a;
              font-size: 1.1rem;
              white-space: nowrap;
            }
            
            .logoImage {
              height: 40px;
              width: auto;
              object-fit: contain;
              display: block;
            }

            /* Links container */
            .linksContainer {
              display: flex;
              gap: 14px;
              margin-left: auto;
              align-items: center;
            }

            .link {
              text-decoration: none;
              color: #334155;
              padding: 8px 10px;
              border-radius: 10px;
              transition: all 0.2s;
              font-size: 0.875rem;
              font-weight: 600;
              white-space: nowrap;
            }
            
            .link:hover {
              background-color: #f1f5f9;
            }

            /* Buttons */
            .iconButton {
              background: transparent;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              padding: 8px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #475569;
              transition: all 0.2s;
            }
            .iconButton:hover {
              background-color: #f1f5f9;
            }

            /* Hamburger menu for mobile */
            .menuIcon {
              display: none;
              flex-direction: column;
              justify-content: space-around;
              width: 25px;
              height: 20px;
              cursor: pointer;
              background: transparent;
              border: none;
              padding: 0;
              margin-left: auto;
            }

            .bar {
              height: 3px;
              width: 100%;
              background-color: #334155;
              border-radius: 1.5px;
              transition: background-color 0.3s;
            }

            /* Mobile menu styles */
            .mobileMenu {
              display: flex;
              flex-direction: column;
              background-color: #fff;
              padding: 10px 20px;
              border-top: 1px solid #e5e7eb;
            }

            .mobileLink {
              padding: 12px 0;
              text-decoration: none;
              color: #334155;
              font-weight: 600;
              font-size: 0.95rem;
              border-bottom: 1px solid #f1f5f9;
            }
            .mobileLink:last-child { border-bottom: none; }

            /* Responsive */
            @media(max-width: 768px) {
              .desktopLinks { display: none; }
              .menuIcon { display: flex; }
            }

            .logoText {
              display: flex;
              flex-direction: column;
              line-height: 1.1;
            }
            
            .brand { font-weight: 800; }
            .tagline {
              font-size: 0.78rem;
              font-weight: 800;
              color: #64748b;
            }
          `}
        </style>
      </Head>

      <nav className="nav">
        <div className="navInner">
          {/* Logo */}
          <Link href="/" className="logo">
            <img src="https://img.sanishtech.com/u/c6cbaa8a547f26aa700087de181b3b54.png" className="logoImage" />
            <div className="logoText">
              <span className="brand">OpenIPO</span>
              <span className="tagline">Indian IPO Dashboard</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="linksContainer desktopLinks" id="desktop-links">
            <Link href="/upcoming" className="link">Upcoming</Link>
            <Link href="/open" className="link">Open</Link>
            <Link href="/closed" className="link">Closed</Link>
            <Link href="/ipo-calendar" className="link">Calendar</Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <button
            className="menuIcon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobileMenu">
            <Link href="/upcoming" className="mobileLink" onClick={() => setMenuOpen(false)}>Upcoming</Link>
            <Link href="/open" className="mobileLink" onClick={() => setMenuOpen(false)}>Open</Link>
            <Link href="/closed" className="mobileLink" onClick={() => setMenuOpen(false)}>Closed</Link>
            <Link href="/ipo-calendar" className="mobileLink" onClick={() => setMenuOpen(false)}>Calendar</Link>
          </div>
        )}
      </nav>
    </>
  );
}