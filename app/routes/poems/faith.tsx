import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { Route } from "./+types/faith";
import { faithPoems, type FaithPoem } from "~/data/faith-poems";
import { PoemGrid } from "~/components/poems/PoemGrid";

export function meta({}: Route.MetaArgs) {
  const url = "https://iambicnana.com/poems/faith";

  return [
    { title: "Faith - Poems - Iambic Nana" },
    { name: "description", content: "Spiritual poems by Susan Engle" },

    // Canonical URL
    { tagName: "link", rel: "canonical", href: url },
  ];
}

function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link 
        to="/" 
        className="text-white/80 hover:text-white transition-colors"
      >
        Home
      </Link>
      <ChevronRight className="h-4 w-4 text-white/60" />
      <Link 
        to="/poems" 
        className="text-white/80 hover:text-white transition-colors"
      >
        Poems
      </Link>
      <ChevronRight className="h-4 w-4 text-white/60" />
      <span className="text-white font-medium">Faith</span>
    </nav>
  );
}

export default function Faith() {
  const [isLoading, setIsLoading] = useState(true);
  const [poems, setPoems] = useState<FaithPoem[]>([]);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setPoems(faithPoems);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with solid background */}
      <div className="bg-amber-500 dark:bg-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb />
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Poems of Faith
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto">
              Spiritual poetry that explores faith, devotion, and the sacred moments of life. 
              These verses reflect on divine love and spiritual growth.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PoemGrid 
          poems={poems}
          isLoading={isLoading}
          emptyMessage="No faith poems found"
        />
      </div>
    </div>
  );
}