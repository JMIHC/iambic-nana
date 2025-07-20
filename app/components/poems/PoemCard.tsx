import { Link } from "react-router";
import { Volume2, FileText } from "lucide-react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { Poem } from "~/data/friends-poems";

interface PoemCardProps {
  poem: Poem;
  className?: string;
}

const getCategoryBadgeStyles = (category: string) => {
  switch (category.toLowerCase()) {
    case "friends":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "family":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "faith":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getExcerpt = (poem: Poem): string => {
  if (poem.excerpt) {
    return poem.excerpt.length > 150 ? poem.excerpt.substring(0, 150) + "..." : poem.excerpt;
  }
  return poem.content.substring(0, 150) + "...";
};

export function PoemCard({ poem, className }: PoemCardProps) {
  const excerpt = getExcerpt(poem);
  
  return (
    <Link to={`/poems/${poem.id}`} className="block">
      <Card 
        className={cn(
          "h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer",
          className
        )}
      >
        <CardHeader>
          <CardTitle className="font-serif text-lg leading-tight">
            {poem.title}
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            {poem.audioUrl && (
              <Volume2 className="h-4 w-4 text-green-600" />
            )}
            <FileText className="h-4 w-4 text-gray-600" />
          </CardAction>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {excerpt}
          </div>
          
          <div className="flex items-center justify-between">
            <span 
              className={cn(
                "inline-block px-2 py-1 rounded-full text-xs font-medium",
                getCategoryBadgeStyles(poem.category)
              )}
            >
              {poem.category.charAt(0).toUpperCase() + poem.category.slice(1)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}