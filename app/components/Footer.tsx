import { Link } from "react-router";
import { NAVIGATION_ITEMS } from "~/types/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Site Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100 mb-4">
              Iambic Nana
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Poetry and books by Susan Engle.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              © {currentYear} Susan Engle. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link 
                            to={child.href} 
                            className="text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/search" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
                >
                  Search Poems
                </Link>
              </li>
              <li>
                <Link 
                  to="/sitemap" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              This website was built with love!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}