import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import "./tailwind.css";
import forzaLogo from "./static/img/forza-logo.png";


export const links: LinksFunction = () => [];

const siteUrl = "https://nickdupuis.github.io/forza-paint-code-picker";
const siteTitle = "Forza Horizon Paint Code Database | Find Any Color";
const siteDescription = "Browse 10,000+ Forza Horizon paint codes. Search by manufacturer and color name to get exact HSB slider values. Also convert hex colors to Forza HSB format.";
const siteImage = `${siteUrl}/og-image.png`;
const navItems = [
  { to: "/colorDatabase", label: "Color Database" },
  { to: "/hueSuggestions", label: "Hue Suggestions" },
  { to: "/hexToHsb", label: "Hex to HSB" },
  { to: "/colorMixer", label: "Color Mixer" },
];

export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={siteImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={siteImage} />
        <link rel="canonical" href={siteUrl} />
        <Meta />
        <Links />
      </head>
      <body className="bg-white text-gray-900 min-h-screen flex flex-col">
        <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={forzaLogo} className="h-8 sm:h-10 w-auto" alt="Forza Horizon 6" />
              <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
                Paint Codes
              </span>
            </div>
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white text-gray-900 min-h-screen flex flex-col">
        <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={forzaLogo} className="h-8 sm:h-10 w-auto" alt="Forza Horizon 6" />
              <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
                Paint Codes
              </span>
            </div>
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-gray-800 px-3 sm:px-6 py-2 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </header>
        <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-8">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
