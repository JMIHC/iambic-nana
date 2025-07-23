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
              Poetry and writings by Susan Engle. Explore themes of friendship, family, and faith.
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
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Poetry website built with love and React
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a 
                href="https://twitter.com/iambicnana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Follow on Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/iambicnana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Follow on Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/iambicnana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Follow on Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.041.072 6.094.131 5.434.333 4.86.63a5.848 5.848 0 00-2.11 1.378A5.848 5.848 0 00.631 4.86C.333 5.434.131 6.094.072 7.041.013 7.989 0 8.396 0 12.017c0 3.624.013 4.09.072 5.036.059.946.261 1.606.558 2.18.306.792.717 1.468 1.378 2.11.642.661 1.318 1.072 2.11 1.378.574.297 1.234.499 2.18.558.946.059 1.412.072 5.036.072 3.624 0 4.09-.013 5.036-.072.946-.059 1.606-.261 2.18-.558a5.848 5.848 0 002.11-1.378 5.848 5.848 0 001.378-2.11c.297-.574.499-1.234.558-2.18.059-.946.072-1.412.072-5.036 0-3.624-.013-4.09-.072-5.036-.059-.946-.261-1.606-.558-2.18a5.848 5.848 0 00-1.378-2.11A5.848 5.848 0 0019.158.63c-.574-.297-1.234-.499-2.18-.558C16.032.013 15.624 0 12.017 0zm0 5.838a6.18 6.18 0 110 12.36 6.18 6.18 0 010-12.36zM12.017 16a4.162 4.162 0 100-8.324 4.162 4.162 0 000 8.324zm6.624-10.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}