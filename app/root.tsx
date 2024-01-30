import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import forzaLogo from "./static/img/forza-logo.png";


export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex">
        <div className="sidebar h-screen flex-shrink-0 p-4 bg-gray-900 text-white">
          <div className="bg-white rounded-full p-4">
            <img src={forzaLogo} className="w-24" />
          </div>
          <h2 className="font-bold text-center">Color Tools</h2>
          <nav className="flex flex-col items-center gap-2 mt-4">
            <Link to="/colorDatabase">Color Database</Link>
            <Link to="/hexToHsb">Hex to HSB</Link>
          </nav>
        </div>
        <div className="main flex-1">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
