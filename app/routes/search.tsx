import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search } from 'lucide-react';
import type { Route } from './+types/search';
import { SearchBar } from '~/components/search/SearchBar';
import { SearchResultCard } from '~/components/search/SearchResultCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Button } from '~/components/ui/button';
import { searchContent, getSearchSuggestions } from '~/lib/search';
import type { SearchResult } from '~/types/search';

export function meta({ location }: Route.MetaArgs) {
  const params = new URLSearchParams(location.search);
  const query = params.get('q') || '';
  
  return [
    { title: query ? `Search: ${query} - Iambic Nana` : 'Search - Iambic Nana' },
    { name: 'description', content: `Search results for "${query}" in poems and books` },
  ];
}


function NoResults({ query }: { query: string }) {
  const suggestions = getSearchSuggestions(query.substring(0, 3));
  
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any poems or books matching "{query}". 
          Try adjusting your search or browse our collections.
        </p>
        
        {suggestions.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              Did you mean:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion}
                  to={`/search?q=${encodeURIComponent(suggestion)}`}
                >
                  <Button variant="secondary" size="sm">
                    {suggestion}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/poems">
            <Button variant="outline">
              Browse Poems
            </Button>
          </Link>
          <Link to="/tiny-books">
            <Button variant="outline">
              Browse Books
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Perform search when query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Simulate async search
    const timer = setTimeout(() => {
      const searchResults = searchContent(query);
      setResults(searchResults);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Filter results based on active tab
  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    if (activeTab === 'poems') return result.type === 'poem';
    if (activeTab === 'books') return result.type === 'book';
    return true;
  });

  // Count results by type
  const poemCount = results.filter(r => r.type === 'poem').length;
  const bookCount = results.filter(r => r.type === 'book').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Link>
          </div>
          <h1 className="text-2xl font-bold mb-4">Search Results</h1>
          <SearchBar 
            className="max-w-2xl" 
            placeholder={query || "Search poems and books..."}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Searching...</p>
            </div>
          </div>
        ) : query && results.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  All ({results.length})
                </TabsTrigger>
                <TabsTrigger value="poems">
                  Poems ({poemCount})
                </TabsTrigger>
                <TabsTrigger value="books">
                  Books ({bookCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredResults.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </TabsContent>

              <TabsContent value="poems" className="space-y-4">
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No poems found matching "{query}"
                  </p>
                )}
              </TabsContent>

              <TabsContent value="books" className="space-y-4">
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No books found matching "{query}"
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : query ? (
          <NoResults query={query} />
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start your search</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Use the search bar above to find poems and books by title, content, or theme.
            </p>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">
                Popular searches:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['friendship', 'family', 'faith', 'love', 'hope'].map((term) => (
                  <Link
                    key={term}
                    to={`/search?q=${encodeURIComponent(term)}`}
                  >
                    <Button variant="secondary" size="sm">
                      {term}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}