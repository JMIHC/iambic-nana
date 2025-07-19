import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Iambic Nana - Poetry by Susan Engle" },
    { name: "description", content: "Welcome to Iambic Nana - Poetry and writings by Susan Engle" },
  ];
}

export default function Home() {
  return (
    <div className="transition-colors duration-300">
      <div className="relative">

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
              Welcome to Iambic Nana
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Poetry and writings by Susan Engle. Explore themes of friendship, family, faith, and life's beautiful moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/poems" 
                viewTransition
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors duration-200 font-medium"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Explore Poems
              </Link>
              <Link 
                to="/tiny-books" 
                viewTransition
                className="px-6 py-3 bg-secondary text-white rounded-md hover:bg-secondary-600 transition-colors duration-200 font-medium"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                Tiny Books
              </Link>
            </div>
          </div>
        </section>

        {/* Navigation Test Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-6">
              Navigation Test & Demo
            </h3>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Desktop Tests
                  </h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-primary">✓</span>
                      <span>Hover over "Poems" to test dropdown behavior</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary">✓</span>
                      <span>Click on menu items to test active link highlighting</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary">✓</span>
                      <span>Use Tab key to navigate through menu items</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary">✓</span>
                      <span>Press Enter/Space on "Poems" to open dropdown</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary">✓</span>
                      <span>Use Arrow keys to navigate dropdown items</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Mobile Tests
                  </h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary">✓</span>
                      <span>Resize window to mobile view (&lt;1024px)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary">✓</span>
                      <span>Click hamburger menu to open mobile drawer</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary">✓</span>
                      <span>Click "Poems" to test accordion expansion</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary">✓</span>
                      <span>Click outside overlay to close menu</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary">✓</span>
                      <span>Press Escape key to close mobile menu</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Dark Mode Test
                </h4>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Use the moon/sun icon in the header to toggle between light and dark modes.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Color Palette Test
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-primary rounded-md"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Primary Purple</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-secondary rounded-md"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Secondary Coral</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-cream-200 border border-gray-300 rounded-md"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Warm Cream</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Content Preview */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <h4 className="font-serif font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Poetry Collections
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Explore poems organized by theme - friends, family, and faith.
              </p>
              <Link to="/poems" viewTransition className="text-primary hover:text-primary-600 font-medium text-sm">
                Browse Poems →
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <h4 className="font-serif font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Tiny Books
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Discover miniature poetry collections and chapbooks.
              </p>
              <Link to="/tiny-books" viewTransition className="text-primary hover:text-primary-600 font-medium text-sm">
                View Collection →
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <h4 className="font-serif font-semibold text-gray-900 dark:text-gray-100 mb-2">
                About the Poet
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Learn about Susan Engle and her journey in poetry.
              </p>
              <Link to="/about" viewTransition className="text-primary hover:text-primary-600 font-medium text-sm">
                Read More →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
