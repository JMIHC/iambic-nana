import type { Route } from "./+types/sitemap";
import { Link } from "react-router";
import { NAVIGATION_ITEMS } from "~/types/navigation";

export function meta({}: Route.MetaArgs) {
  const url = "https://iambicnana.com/sitemap";

  return [
    { title: "Sitemap - Iambic Nana" },
    { name: "description", content: "Complete sitemap of Iambic Nana - Poetry by Susan Engle" },

    // Canonical URL
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function Sitemap() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
          Sitemap
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Navigate through all pages and sections of Iambic Nana
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Main Navigation */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Main Pages
          </h2>
          <ul className="space-y-3">
            <li>
              <Link 
                to="/" 
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Home
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Welcome page with featured poems and site overview
              </p>
            </li>
            
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.href}>
                <Link 
                  to={item.href} 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {item.label}
                </Link>
                {item.href === '/poems' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Browse all poetry collections organized by theme
                  </p>
                )}
                {item.href === '/tiny-books' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Miniature poetry collections and chapbooks for purchase
                  </p>
                )}
                {item.href === '/about' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Learn about Susan Engle and her poetry journey
                  </p>
                )}
                
                {item.children && (
                  <ul className="ml-6 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link 
                          to={child.href} 
                          className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                          {child.label} Poems
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          Poetry focused on {child.label.toLowerCase()} themes
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Pages */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Additional Pages
          </h2>
          <ul className="space-y-3">
            <li>
              <Link 
                to="/search" 
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Search
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Search through all poems and content
              </p>
            </li>
            
            <li>
              <Link 
                to="/checkout" 
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Checkout
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Complete your tiny book purchases
              </p>
            </li>
            
            <li>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Individual Poems
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Each poem has its own dedicated page with reading options
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Format: /poems/[poem-id]
              </p>
            </li>
            
            <li>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Individual Books
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Each tiny book has detailed pages with purchase options
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Format: /books/[book-id]
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* SEO Benefits Section */}
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          About This Sitemap
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          This sitemap helps visitors and search engines understand the structure of Iambic Nana. 
          It provides an organized overview of all poetry collections, individual poems, tiny books, 
          and other content available on the site. Use this page to quickly navigate to any section 
          or discover content you might have missed.
        </p>
      </div>
    </div>
  );
}