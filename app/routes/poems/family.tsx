import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { Route } from "./+types/family";
import { familyPoems, type FamilyPoem } from "~/data/family-poems";
import { PoemGrid } from "~/components/poems/PoemGrid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Family - Poems - Iambic Nana" },
    { name: "description", content: "Poems about family by Susan Engle" },
  ];
}

function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link 
        to="/" 
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Home
      </Link>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <Link 
        to="/poems" 
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Poems
      </Link>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <span className="text-foreground font-medium">Family</span>
    </nav>
  );
}

export default function Family() {
  const [isLoading, setIsLoading] = useState(true);
  const [poems, setPoems] = useState<FamilyPoem[]>([]);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setPoems(familyPoems);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-200 dark:from-blue-700 dark:to-blue-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb />
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Poems of Family
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Poetry celebrating the bonds of family, the joy of children, and the wisdom passed through generations. 
              These verses explore the love that binds families together.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PoemGrid 
          poems={poems}
          isLoading={isLoading}
          emptyMessage="No family poems found"
        />
      </div>
    </div>
  );
}