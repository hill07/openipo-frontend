import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize dark mode from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode") === "true";
      setDarkMode(saved);
      if (saved) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);



  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <Head>
        <link rel="icon" href="/logo.png" />
        <style>
          {`
            /* Embedded CSS styles */

            /* Reset some default styles if needed */

            /* Navbar styling */
            nav {
              position: sticky;
              top: 0;
              background-color: #fff;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
              z-index: 1000;
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

            /* Search styles */
            .searchForm {
              display: flex;
              align-items: center;
              flex: 1;
              max-width: 400px;
              gap: 8px;
            }

            .searchInput {
              flex: 1;
              padding: 8px 12px;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              font-size: 0.875rem;
              outline: none;
            }

            .searchButton {
              padding: 8px 12px;
              background: #008080;
              color: #fff;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 1rem;
              line-height: 1;
            }

            /* Links container */
            .linksContainer {
              display: flex;
              gap: 14px;
              margin-left: auto;
            }

            .link {
              text-decoration: none;
              color: #334155;
              padding: 8px 10px;
              border-radius: 10px;
              transition: background-color 0.2s;
              font-size: 0.875rem;
              font-weight: 600;
              white-space: nowrap;
            }

            .link:hover {
              background-color: #f1f5f9;
            }

            /* Dark mode toggle button */
            .darkModeToggle {
              background: transparent;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              padding: 6px 10px;
              cursor: pointer;
              font-size: 1.1rem;
              line-height: 1;
              transition: all 0.2s;
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
            }

            /* Mobile menu styles */
            .mobileMenu {
              display: flex;
              flex-direction: column;
              background-color: #fff;
              padding: 10px 20px;
              border-top: 1px solid #e5e7eb;
            }

            .mobileSearchForm {
              display: flex;
              gap: 8px;
              margin-bottom: 12px;
            }

            .mobileSearchInput {
              flex: 1;
              padding: 8px 12px;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              font-size: 0.875rem;
              outline: none;
            }

            .mobileSearchButton {
              padding: 8px 16px;
              background: #008080;
              color: #fff;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 600;
            }

            .mobileLink {
              padding: 10px 0;
              text-decoration: none;
              color: #334155;
              font-weight: 600;
              font-size: 0.875rem;
            }

            /* Responsive styles */
            @media(max-width: 768px) {
              .desktopLinks {
                display: none;
              }
              .menuIcon {
                display: flex;
              }
              .searchForm {
                display: none;
              }
            }

            /* Remove progress bar styles as per your request */
            /* Optional: Add dark mode styles */
            body.dark {
              background-color: #1f2937;
              color: #f9fafb;
            }
              .tagline {
            font-size: 0.78rem;
            font-weight: 800;
            color: #64748b;
          }
            /* Logo */
          .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
          }

        

          .logoText {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
          }
        `}
        </style>
      </Head>

      <nav className="nav">
        <div className="navInner">
          {/* Logo */}
          <Link href="/" className="logo">
            <img src="/logo.png" alt="OpenIPO" className="logoImage" />
            <div className="logoText">
              <span className="brand">OpenIPO</span>
              <span className="tagline">Indian IPO Dashboard</span>
            </div>
          </Link>


          {/* Desktop Links */}
          <div className="linksContainer desktopLinks" id="desktop-links">
            <Link href="/upcoming" className="link">
              Upcoming
            </Link>
            <Link href="/open" className="link">
              Open
            </Link>
            <Link href="/closed" className="link">
              Closed
            </Link>
            <Link href="/ipo-calendar" className="link">
              Calendar
            </Link>
          </div>



          {/* Hamburger Menu for Mobile */}
          <button
            className="menuIcon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            role="button"
            tabIndex={0}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobileMenu" aria-hidden={!menuOpen}>
            <Link
              href="/upcoming"
              className="mobileLink"
              onClick={() => setMenuOpen(false)}
            >
              Upcoming
            </Link>
            <Link
              href="/open"
              className="mobileLink"
              onClick={() => setMenuOpen(false)}
            >
              Open
            </Link>
            <Link
              href="/closed"
              className="mobileLink"
              onClick={() => setMenuOpen(false)}
            >
              Closed
            </Link>
            <Link
              href="/ipo-calendar"
              className="mobileLink"
              onClick={() => setMenuOpen(false)}
            >
              Calendar
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}