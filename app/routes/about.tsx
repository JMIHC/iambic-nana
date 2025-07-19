import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Susan Engle - Iambic Nana" },
    { name: "description", content: "Learn about poet Susan Engle" },
  ];
}

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
            About Susan Engle
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Learn about the poet behind Iambic Nana and her journey in writing.
          </p>
      </div>
    </div>
  );
}