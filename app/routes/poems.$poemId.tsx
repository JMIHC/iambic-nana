import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Download, Share2, Eye, Music } from "lucide-react";
import type { Route } from "./+types/$poemId";
import { friendsPoems, type Poem } from "~/data/friends-poems";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useViewCounter } from "~/hooks/useViewCounter";
import { AudioPlayer } from "~/components/poems/AudioPlayer";

export function meta({ params }: Route.MetaArgs) {
  const poem = friendsPoems.find(p => p.id === params.poemId);
  
  if (!poem) {
    return [
      { title: "Poem Not Found - Iambic Nana" },
      { name: "description", content: "The requested poem could not be found." },
    ];
  }

  return [
    { title: `${poem.title} - Poems - Iambic Nana` },
    { name: "description", content: `Read "${poem.title}" by Susan Engle. ${poem.excerpt.substring(0, 150)}...` },
  ];
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
          Poem Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The poem you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/poems" 
          className="text-primary hover:text-primary-600 font-medium"
        >
          Back to Poems
        </Link>
      </div>
    </div>
  );
}

function BackButton({ category }: { category: string }) {
  const categoryPath = `/poems/${category.toLowerCase()}`;
  
  return (
    <Link 
      to={categoryPath}
      className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to {category.charAt(0).toUpperCase() + category.slice(1)} Poems
    </Link>
  );
}

function DownloadPdfButton({ poemId }: { poemId: string }) {
  const handleDownload = () => {
    // TODO: Implement PDF generation
    console.log(`Downloading PDF for poem: ${poemId}`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Download PDF
    </Button>
  );
}

function ShareButton({ poem }: { poem: Poem }) {
  const handleShare = () => {
    // TODO: Implement social sharing dropdown
    console.log(`Sharing poem: ${poem.title}`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
}

function ViewCounter({ poemId }: { poemId: string }) {
  const { viewCount, isLoading, error } = useViewCounter(poemId);
  
  // Don't show anything if there's an error
  if (error) {
    return null;
  }
  
  // Show skeleton loader while loading
  if (isLoading) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Eye className="h-4 w-4 mr-1" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }
  
  // Show view count if available
  if (viewCount !== null) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Eye className="h-4 w-4 mr-1" />
        {viewCount.toLocaleString()} views
      </div>
    );
  }
  
  // Don't show anything if view count is null (service unavailable)
  return null;
}

export default function PoemDetail({ params }: Route.ComponentProps) {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      const foundPoem = friendsPoems.find(p => p.id === params.poemId);
      setPoem(foundPoem || null);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [params.poemId]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-prose mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!poem) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-prose mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton category={poem.category} />
        
        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
              {poem.title}
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                By Susan Engle • {poem.copyright.match(/\d{4}/)?.[0] || 'Date Unknown'}
              </p>
              <ViewCounter poemId={poem.id} />
            </div>
          </header>

          <Separator />

          {/* Poem Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-line text-foreground leading-relaxed font-serif text-lg">
              {poem.content}
            </div>
          </div>

          <Separator />

          {/* Audio Player */}
          {poem.audioUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Music className="h-5 w-5 text-purple-600" />
                  Listen to this poem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AudioPlayer audioUrl={poem.audioUrl} />
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <DownloadPdfButton poemId={poem.id} />
            <ShareButton poem={poem} />
          </div>
        </article>
      </div>
    </div>
  );
}