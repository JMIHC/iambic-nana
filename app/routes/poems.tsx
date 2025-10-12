import { Link } from "react-router";
import type { Route } from "./+types/poems";

export function meta({}: Route.MetaArgs) {
  const url = "https://iambicnana.com/poems";

  return [
    { title: "Poems - Iambic Nana" },
    { name: "description", content: "Poetry collection by Susan Engle" },

    // Canonical URL
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function Poems() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
            Poems
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Welcome to the poetry collection. Explore poems organized by theme:
          </p>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <Link 
              to="/poems/friends" 
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 block"
            >
              <h3 className="font-semibold text-primary">Friends</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Poems celebrating friendship and connection
              </p>
            </Link>
            <Link 
              to="/poems/family" 
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 block"
            >
              <h3 className="font-semibold text-primary">Family</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Poems about family bonds and memories
              </p>
            </Link>
            <Link 
              to="/poems/faith" 
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 block"
            >
              <h3 className="font-semibold text-primary">Faith</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Spiritual reflections and faith-inspired verses
              </p>
            </Link>
          </div>
      </div>
    </div>
  );
}