import { PoemCard } from "./PoemCard";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { Poem } from "~/data/friends-poems";

interface PoemGridProps {
  poems: Poem[];
  isLoading?: boolean;
  emptyMessage?: string;
}

function SkeletonCard() {
  return (
    <Card className="h-full animate-pulse">
      <CardHeader>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-2"></div>
        <div className="flex justify-end gap-2">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/6"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PoemGrid({ 
  poems, 
  isLoading = false, 
  emptyMessage = "No poems found" 
}: PoemGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (poems.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {poems.map((poem, index) => (
        <div
          key={poem.id}
          className="poem-card-appear"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <PoemCard poem={poem} />
        </div>
      ))}
    </div>
  );
}