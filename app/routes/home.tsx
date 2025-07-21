import type { Route } from "./+types/home";
import { Link } from "react-router";
import { PopularPoems } from "~/components/home/PopularPoems";
import iambicMushroomsImage from "~/assets/iambicmushrooms.png";

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
        <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 py-16">
          {/* Header Image */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={iambicMushroomsImage} 
              alt="Iambic Mushrooms" 
              className="w-full h-full object-cover opacity-20 dark:opacity-10"
            />
          </div>
          
          {/* Content overlay */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

        {/* Most Read Poems Section */}
        <section className="bg-gray-50 dark:bg-gray-900/50">
          <PopularPoems />
        </section>

        {/* Navigation Test Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
