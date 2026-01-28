import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <Head>
        <link rel="icon" href="/logo.png" />
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
            
            :global(html.dark) nav {
              background-color: #1e293b;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
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
            
            :global(html.dark) .logo { color: #f8fafc; }

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
            
            :global(html.dark) .link { color: #cbd5e1; }

            .link:hover {
              background-color: #f1f5f9;
            }
            :global(html.dark) .link:hover { background-color: #334155; }

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
            :global(html.dark) .iconButton { 
              border-color: #475569; 
              color: #e2e8f0;
            }
            .iconButton:hover {
              background-color: #f1f5f9;
            }
            :global(html.dark) .iconButton:hover { background-color: #334155; }

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
            :global(html.dark) .bar { background-color: #cbd5e1; }

            /* Mobile menu styles */
            .mobileMenu {
              display: flex;
              flex-direction: column;
              background-color: #fff;
              padding: 10px 20px;
              border-top: 1px solid #e5e7eb;
            }
            :global(html.dark) .mobileMenu { 
              background-color: #1e293b; 
              border-color: #334155;
            }

            .mobileLink {
              padding: 12px 0;
              text-decoration: none;
              color: #334155;
              font-weight: 600;
              font-size: 0.95rem;
              border-bottom: 1px solid #f1f5f9;
            }
            :global(html.dark) .mobileLink { 
              color: #e2e8f0; 
              border-color: #334155;
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
            :global(html.dark) .tagline { color: #94a3b8; }
          `}
        </style>
      </Head>

      <nav className="nav">
        <div className="navInner">
          {/* Logo */}
          <Link href="/" className="logo">
            <img src="/logo.png" alt="OpenIPO Logo" className="logoImage" />
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

            <button
              className="iconButton"
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
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

            <div className="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700 mt-2">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Appearance</span>
              <button
                className="iconButton"
                onClick={toggleTheme}
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}