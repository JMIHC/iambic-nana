import { Flame, TrendingUp } from "lucide-react";
import { PoemCard } from "~/components/poems/PoemCard";
import { usePopularPoems } from "~/hooks/usePopularPoems";
import { friendsPoems } from "~/data/friends-poems";
import { cn } from "~/lib/utils";

interface PopularPoemsProps {
  className?: string;
}

// Skeleton component for loading state
function PoemCardSkeleton() {
  return (
    <div className="relative">
      <div className="h-full border rounded-lg p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced PoemCard wrapper with trending badge only
function PopularPoemCard({ poem, isTrending }: { 
  poem: any; 
  isTrending?: boolean 
}) {
  return (
    <div className="relative">
      <PoemCard poem={poem} />
      
      {/* Trending badge */}
      {isTrending && (
        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          <span>Trending</span>
        </div>
      )}
    </div>
  );
}

export function PopularPoems({ className }: PopularPoemsProps) {
  const { poems, isLoading, error } = usePopularPoems(6);
  
  // Fallback to featured poems if error or no data
  const getFallbackPoems = () => {
    return friendsPoems.slice(0, 6).map(poem => ({
      ...poem,
      views: 0
    }));
  };
  
  const displayPoems = error || poems.length === 0 ? getFallbackPoems() : poems;
  
  // Simple trending logic - poems with views > average are trending
  const averageViews = poems.length > 0 
    ? poems.reduce((sum, poem) => sum + poem.views, 0) / poems.length 
    : 0;
  
  return (
    <section className={cn("py-12", className)}>
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-8">
          <Flame className="h-8 w-8 text-orange-500" />
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
            Most Read Poems
          </h2>
        </div>
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <PoemCardSkeleton key={index} />
            ))
          ) : (
            // Poem cards
            displayPoems.map((poem) => (
              <PopularPoemCard
                key={poem.id}
                poem={poem}
                isTrending={poem.views > averageViews && averageViews > 0}
              />
            ))
          )}
        </div>
        
        {/* Error message for fallback */}
        {error && (
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Showing featured poems due to service unavailability
          </div>
        )}
      </div>
    </section>
  );
}