import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { ChevronRight, Volume2, ArrowLeft } from "lucide-react";
import type { Route } from "./+types/$poemId";
import { friendsPoems } from "~/data/friends-poems";
import { familyPoems } from "~/data/family-poems";
import { faithPoems } from "~/data/faith-poems";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { DownloadPdfButton } from "~/components/poems/DownloadPdfButton";
import type { BasePoem } from "~/types/poem";

// Combine all poems into a single array
const allPoems: BasePoem[] = [
  ...friendsPoems,
  ...familyPoems,
  ...faithPoems,
];

export function meta({ params }: Route.MetaArgs) {
  const poem = allPoems.find(p => p.id === params.poemId);
  return [
    { title: poem ? `${poem.title} - Iambic Nana` : "Poem Not Found - Iambic Nana" },
    { name: "description", content: poem ? poem.excerpt : "Poem not found" },
  ];
}

function Breadcrumb({ poem }: { poem: BasePoem }) {
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
      <Link 
        to={`/poems/${poem.category}`} 
        className="text-muted-foreground hover:text-foreground transition-colors capitalize"
      >
        {poem.category}
      </Link>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <span className="text-foreground font-medium">{poem.title}</span>
    </nav>
  );
}

const getCategoryGradient = (category: string) => {
  switch (category) {
    case 'friends':
      return 'from-purple-500 to-purple-200 dark:from-purple-700 dark:to-purple-400';
    case 'family':
      return 'from-blue-500 to-blue-200 dark:from-blue-700 dark:to-blue-400';
    case 'faith':
      return 'from-amber-500 to-amber-200 dark:from-amber-700 dark:to-amber-400';
    default:
      return 'from-gray-500 to-gray-200 dark:from-gray-700 dark:to-gray-400';
  }
};

export default function PoemDetail() {
  const { poemId } = useParams();
  const [poem, setPoem] = useState<BasePoem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundPoem = allPoems.find(p => p.id === poemId);
      setPoem(foundPoem || null);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [poemId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Poem Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The poem you're looking for doesn't exist.
          </p>
          <Link to="/poems">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Poems
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header with gradient background */}
      <div className={`bg-gradient-to-r ${getCategoryGradient(poem.category)}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb poem={poem} />
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {poem.title}
            </h1>
            {poem.audioUrl && (
              <div className="flex items-center justify-center gap-2 text-white/80">
                <Volume2 className="h-5 w-5" />
                <span>Audio available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 md:p-12">
          <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <pre className="font-serif text-lg leading-relaxed whitespace-pre-wrap">
                {poem.content}
              </pre>
            </div>
            
            {poem.copyright && (
              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  {poem.copyright}
                </p>
              </div>
            )}

            {/* Actions Section */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {poem.audioUrl && (
                  <Button variant="outline" size="lg">
                    <Volume2 className="mr-2 h-5 w-5" />
                    Play Audio
                  </Button>
                )}
                <DownloadPdfButton 
                  poem={poem} 
                  variant="outline" 
                  size="lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link to={`/poems/${poem.category}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {poem.category} poems
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}