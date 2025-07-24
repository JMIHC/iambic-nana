import { Link } from 'react-router';
import { FileText, BookOpen, ArrowRight, Tag, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import type { SearchResult } from '~/types/search';

interface SearchResultCardProps {
  result: SearchResult;
  className?: string;
  showType?: boolean;
}

// Preserve line breaks and format poem excerpts
function formatPoemExcerpt(excerpt: string): string {
  // Remove HTML tags but preserve structure
  const cleanExcerpt = excerpt.replace(/<mark>/g, '[[MARK]]').replace(/<\/mark>/g, '[[/MARK]]');
  const withoutHtml = cleanExcerpt.replace(/<[^>]*>/g, '');
  const withMarks = withoutHtml.replace(/\[\[MARK\]\]/g, '<mark>').replace(/\[\[\/MARK\]\]/g, '</mark>');
  
  // Preserve line breaks by replacing \n with <br/>
  return withMarks.replace(/\n/g, '<br/>');
}

// Format book description excerpt
function formatBookExcerpt(excerpt: string): string {
  // Limit to 2 sentences or 200 chars
  const sentences = excerpt.split(/[.!?]+/);
  const limitedExcerpt = sentences.slice(0, 2).join('. ');
  
  if (limitedExcerpt.length > 200) {
    return limitedExcerpt.substring(0, 197) + '...';
  }
  
  return limitedExcerpt + (sentences.length > 2 ? '...' : '');
}

export function SearchResultCard({ 
  result, 
  className,
  showType = true 
}: SearchResultCardProps) {
  const isPoem = result.type === 'poem';
  const Icon = isPoem ? FileText : BookOpen;
  const link = result.url;
  
  return (
    <Link to={link} className="block group">
      <Card className={cn(
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        "border-2 hover:border-primary/20",
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {/* Icon with type-specific styling */}
              <div className={cn(
                "p-2 rounded-lg transition-colors duration-300",
                "group-hover:scale-110 transform",
                isPoem 
                  ? "bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50" 
                  : "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50"
              )}>
                <Icon className={cn(
                  "h-5 w-5",
                  isPoem 
                    ? "text-purple-600 dark:text-purple-400" 
                    : "text-blue-600 dark:text-blue-400"
                )} />
              </div>
              
              {/* Title */}
              <div className="flex-1">
                <h3 
                  className="font-serif text-lg font-bold leading-tight group-hover:text-primary transition-colors"
                  dangerouslySetInnerHTML={{ __html: result.title }}
                />
                
                {/* Type indicator (optional) */}
                {showType && (
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {result.type}
                  </p>
                )}
              </div>
            </div>
            
            {/* Category badge or Price */}
            <div className="flex-shrink-0">
              {isPoem && result.category && (
                <Badge 
                  variant="secondary" 
                  className="capitalize flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {result.category}
                </Badge>
              )}
              
              {!isPoem && result.price && (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-lg">{result.price.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Content based on type */}
          {isPoem ? (
            <div className="space-y-3">
              {/* Poem excerpt with line breaks */}
              <div 
                className="text-sm text-muted-foreground leading-relaxed font-serif"
                dangerouslySetInnerHTML={{ 
                  __html: formatPoemExcerpt(result.excerpt) 
                }}
              />
              
              {/* Read more indicator */}
              <div className="flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Read full poem</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Book description */}
              <p 
                className="text-sm text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: formatBookExcerpt(result.excerpt) 
                }}
              />
              
              {/* Book details */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {result.category && (
                    <span className="capitalize">{result.category} collection</span>
                  )}
                </div>
                
                {/* View details indicator */}
                <div className="flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View details</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// Compact version for sidebar or limited space
export function CompactSearchResultCard({ 
  result,
  className 
}: { 
  result: SearchResult;
  className?: string;
}) {
  const isPoem = result.type === 'poem';
  const Icon = isPoem ? FileText : BookOpen;
  const link = result.url;
  
  return (
    <Link to={link} className="block group">
      <div className={cn(
        "p-3 rounded-lg border transition-all duration-200",
        "hover:bg-accent hover:border-primary/20",
        className
      )}>
        <div className="flex items-center gap-3">
          <Icon className={cn(
            "h-4 w-4 flex-shrink-0",
            isPoem ? "text-purple-600" : "text-blue-600"
          )} />
          
          <div className="flex-1 min-w-0">
            <h4 
              className="font-medium text-sm truncate group-hover:text-primary"
              dangerouslySetInnerHTML={{ __html: result.title }}
            />
            <p className="text-xs text-muted-foreground">
              {isPoem ? result.category : `$${result.price?.toFixed(2)}`}
            </p>
          </div>
          
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}

// Grid layout version
export function GridSearchResultCard({ 
  result,
  className 
}: { 
  result: SearchResult;
  className?: string;
}) {
  const isPoem = result.type === 'poem';
  const Icon = isPoem ? FileText : BookOpen;
  const link = result.url;
  
  return (
    <Link to={link} className="block group h-full">
      <Card className={cn(
        "h-full flex flex-col transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        "border-2 hover:border-primary/20",
        className
      )}>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Icon className={cn(
              "h-5 w-5",
              isPoem ? "text-purple-600" : "text-blue-600"
            )} />
            {isPoem && result.category && (
              <Badge variant="outline" className="text-xs">
                {result.category}
              </Badge>
            )}
            {!isPoem && result.price && (
              <span className="text-sm font-bold text-green-600">
                ${result.price.toFixed(2)}
              </span>
            )}
          </div>
          
          <h3 
            className="font-serif font-bold line-clamp-2 group-hover:text-primary transition-colors"
            dangerouslySetInnerHTML={{ __html: result.title }}
          />
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <p 
            className="text-sm text-muted-foreground line-clamp-3 flex-1"
            dangerouslySetInnerHTML={{ __html: result.excerpt }}
          />
          
          <div className="flex items-center gap-2 mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>{isPoem ? 'Read poem' : 'View book'}</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}