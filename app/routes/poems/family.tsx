import type { Route } from "./+types/family";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Family - Poems - Iambic Nana" },
    { name: "description", content: "Poems about family by Susan Engle" },
  ];
}

export default function Family() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <nav className="text-sm mb-4">
            <a href="/poems" className="text-primary hover:text-primary-600">Poems</a>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700 dark:text-gray-300">Family</span>
          </nav>
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
            Poems about Family
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Poetry about family bonds, memories, and love.
          </p>
      </div>
    </div>
  );
}