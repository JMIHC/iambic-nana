import type { Route } from "./+types/home";
import { Link } from "react-router";
import { PopularPoems } from "~/components/home/PopularPoems";
import iambicMushroomsImage from "~/assets/iambicmushrooms.png";
import fullMushroomImage from "~/assets/fullmushroom.webp";

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
              Poetry and tiny books by Susan Engle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/poems" 
                viewTransition
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors duration-200 font-medium"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Poems to read
              </Link>
              <Link 
                to="/poems" 
                viewTransition
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors duration-200 font-medium"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Poems to listen to
              </Link>
              <Link 
                to="/tiny-books" 
                viewTransition
                className="px-6 py-3 bg-secondary text-white rounded-md hover:bg-secondary-600 transition-colors duration-200 font-medium"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                Tiny books
              </Link>
            </div>
          </div>
        </section>

        {/* Most Read Poems Section */}
        <section className="bg-gray-50 dark:bg-gray-900/50">
          <PopularPoems />
        </section>

        {/* Mushroom Art Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <img 
              src={fullMushroomImage} 
              alt="Mushroom fabric art" 
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 italic">
              Photo and Fabric Art by Elaine Phillips
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
