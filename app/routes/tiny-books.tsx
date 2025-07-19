import type { Route } from "./+types/tiny-books";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tiny Books - Iambic Nana" },
    { name: "description", content: "Tiny book collection by Susan Engle" },
  ];
}

export default function TinyBooks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
            Tiny Books
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            A collection of miniature poetry books and chapbooks.
          </p>
      </div>
    </div>
  );
}