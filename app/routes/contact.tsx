import type { Route } from "./+types/contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact - Iambic Nana" },
    { name: "description", content: "Get in touch with Susan Engle" },
  ];
}

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
            Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Get in touch to discuss poetry, readings, or collaborations.
          </p>
      </div>
    </div>
  );
}