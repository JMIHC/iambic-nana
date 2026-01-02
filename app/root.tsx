import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "react-router";
import { useState, useEffect } from "react";

import type { Route } from "./+types/root";
import Navigation from "./components/Navigation";
import { SimpleSearchBar, CompactSimpleSearchBar } from "./components/search/SimpleSearchBar";
import { Footer } from "./components/Footer";
import { CartProvider } from "./contexts/CartContext";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap",
  },
  { rel: "icon", href: "/favicon.png", type: "image/png" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Iambic Nana",
    "alternateName": ["IambicNana", "Iambic Nana Poetry"],
    "description": "Poetry and tiny books by Susan Engle",
    "url": "https://iambicnana.com",
    "author": {
      "@type": "Person",
      "name": "Susan Engle",
      "jobTitle": "Poet"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://iambicnana.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className="">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Only initialize Plausible on the client side
    import("@plausible-analytics/tracker").then(({ init }) => {
      init({
        domain: 'iambicnana.com',
      });
    });
  }, []);

  // Initialize dark mode from localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDarkMode(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-cream-100 dark:bg-gray-900 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                viewTransition
                className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-300 transition-colors duration-200"
              >
                Iambic Nana
              </Link>
            </div>
            
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block flex-1 max-w-xl mx-8">
              <SimpleSearchBar />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Compact Search for Mobile */}
              <div className="md:hidden">
                <CompactSimpleSearchBar />
              </div>
              
              <Navigation />
              
              {/* Dark Mode Toggle */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleDarkMode();
                }}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                title={`Currently ${isDarkMode ? 'dark' : 'light'} mode - click to toggle`}
                type="button"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <HiddenOrderForm />
    </div>
    </CartProvider>
  );
}

{/* Hidden Netlify Form for order notifications */}
export function HiddenOrderForm() {
  return (
    <form
      name="order-notifications"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      hidden
      style={{ display: 'none' }}
    >
      <input type="hidden" name="form-name" value="order-notifications" />
      <input type="hidden" name="bot-field" />
      <input type="text" name="customerName" />
      <input type="email" name="customerEmail" />
      <input type="text" name="customerPhone" />
      <input type="text" name="orderTotal" />
      <input type="text" name="totalQuantity" />
      <input type="text" name="pricePerUnit" />
      <input type="text" name="orderDetails" />
      <input type="text" name="shippingAddress" />
      <input type="text" name="orderNotes" />
      <input type="text" name="sessionId" />
      <input type="text" name="orderDate" />
      <input type="text" name="subtotal" />
      <input type="text" name="shippingCarrier" />
      <input type="text" name="shippingService" />
      <input type="text" name="shippingRate" />
    </form>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
