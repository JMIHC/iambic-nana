import { useState } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { Route } from "./+types/friends";
import { friendsPoems, type Poem } from "~/data/friends-poems";
import { PoemGrid } from "~/components/poems/PoemGrid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Friends - Poems - Iambic Nana" },
    { name: "description", content: "Poems about friendship by Susan Engle" },
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
      <span className="text-foreground font-medium">Friends</span>
    </nav>
  );
}

export default function Friends() {
  const isLoading = false;
  const [poems] = useState<Poem[]>(() => {
    return friendsPoems.filter(poem => poem.category === 'friends');
  });

  return (
    <div className="min-h-screen">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-200 dark:from-purple-700 dark:to-purple-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb />
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Poems of Friends
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Poetry celebrating the bonds of friendship, connection, and the joy found in companionship. 
              These verses explore the beauty of human relationships and the comfort of true friendship.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PoemGrid 
          poems={poems}
          isLoading={isLoading}
          emptyMessage="No friendship poems found"
        />
      </div>
    </div>
  );
}