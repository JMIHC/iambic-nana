import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, Loader2, FileText, BookOpen } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/ui/command';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { quickSearch } from '~/lib/search';
import type { SearchResult } from '~/types/search';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  variant?: 'default' | 'compact';
}

export function SearchBar({ 
  className, 
  placeholder = "Search poems and books...",
  variant = 'default' 
}: SearchBarProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Perform search with debounce
  const performSearch = useCallback((searchQuery: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchTimeout.current = setTimeout(() => {
      const searchResults = quickSearch(searchQuery, 5);
      setResults(searchResults);
      setIsLoading(false);
    }, 300);
  }, []);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setQuery(value);
    performSearch(value);
  };

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    setResults([]);
    navigate(result.url);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (query.trim()) {
      setOpen(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setResults([]);
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  // Group results by type
  const poemResults = results.filter(r => r.type === 'poem');
  const bookResults = results.filter(r => r.type === 'book');

  // Mobile modal version
  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          size={variant === 'compact' ? 'sm' : 'default'}
          onClick={() => setOpen(true)}
          className={cn("relative", className)}
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {isLoading && (
              <CommandEmpty>
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </CommandEmpty>
            )}

            {!isLoading && query && results.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            {!isLoading && results.length > 0 && (
              <>
                {poemResults.length > 0 && (
                  <CommandGroup heading="Poems">
                    {poemResults.map((result) => (
                      <CommandItem
                        key={result.id}
                        value={result.title}
                        onSelect={() => handleSelectResult(result)}
                      >
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div dangerouslySetInnerHTML={{ __html: result.title }} />
                          <p className="text-sm text-muted-foreground">
                            {result.category}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {bookResults.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Books">
                      {bookResults.map((result) => (
                        <CommandItem
                          key={result.id}
                          value={result.title}
                          onSelect={() => handleSelectResult(result)}
                        >
                          <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div dangerouslySetInnerHTML={{ __html: result.title }} />
                            <p className="text-sm text-muted-foreground">
                              ${result.price?.toFixed(2)}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}

                <CommandSeparator />
                <CommandItem onSelect={handleSearchSubmit}>
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search for "{query}"</span>
                </CommandItem>
              </>
            )}
          </CommandList>
        </CommandDialog>
      </>
    );
  }

  // Desktop dropdown version
  return (
    <div className={cn("relative", className)}>
      <Command className="rounded-lg border shadow-sm">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0"
          />
          <div className="flex items-center gap-1">
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {query && (
          <CommandList className="max-h-[300px]">
            {isLoading && (
              <CommandEmpty>
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </CommandEmpty>
            )}

            {!isLoading && results.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            {!isLoading && results.length > 0 && (
              <>
                {poemResults.length > 0 && (
                  <CommandGroup heading="Poems">
                    {poemResults.map((result) => (
                      <CommandItem
                        key={result.id}
                        value={result.title}
                        onSelect={() => handleSelectResult(result)}
                        className="cursor-pointer"
                      >
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div 
                            className="font-medium"
                            dangerouslySetInnerHTML={{ __html: result.title }} 
                          />
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {result.category} • <span dangerouslySetInnerHTML={{ __html: result.excerpt }} />
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {bookResults.length > 0 && (
                  <>
                    {poemResults.length > 0 && <CommandSeparator />}
                    <CommandGroup heading="Books">
                      {bookResults.map((result) => (
                        <CommandItem
                          key={result.id}
                          value={result.title}
                          onSelect={() => handleSelectResult(result)}
                          className="cursor-pointer"
                        >
                          <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div 
                              className="font-medium"
                              dangerouslySetInnerHTML={{ __html: result.title }} 
                            />
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              ${result.price?.toFixed(2)} • <span dangerouslySetInnerHTML={{ __html: result.excerpt }} />
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}

                <CommandSeparator />
                <CommandItem 
                  onSelect={handleSearchSubmit}
                  className="cursor-pointer"
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>View all results for "{query}"</span>
                </CommandItem>
              </>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}

// Compact version for headers/navbars
export function CompactSearchBar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className={cn("relative w-9 h-9 p-0", className)}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>

      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

// Shared search dialog component
function SearchDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();

  // Perform search
  const performSearch = useCallback((searchQuery: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchTimeout.current = setTimeout(() => {
      const searchResults = quickSearch(searchQuery, 8);
      setResults(searchResults);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    performSearch(value);
  };

  const handleSelectResult = (result: SearchResult) => {
    onOpenChange(false);
    navigate(result.url);
    setQuery('');
    setResults([]);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      onOpenChange(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setResults([]);
    }
  };

  const poemResults = results.filter(r => r.type === 'poem');
  const bookResults = results.filter(r => r.type === 'book');

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search poems and books..."
        value={query}
        onValueChange={handleSearchChange}
      />
      <CommandList>
        {isLoading && (
          <CommandEmpty>
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Searching...</p>
          </CommandEmpty>
        )}

        {!isLoading && query && results.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}

        {!isLoading && results.length > 0 && (
          <>
            {poemResults.length > 0 && (
              <CommandGroup heading="Poems">
                {poemResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={result.title}
                    onSelect={() => handleSelectResult(result)}
                  >
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div dangerouslySetInnerHTML={{ __html: result.title }} />
                      <p className="text-sm text-muted-foreground">
                        {result.category}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {bookResults.length > 0 && (
              <>
                {poemResults.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Books">
                  {bookResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => handleSelectResult(result)}
                    >
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div dangerouslySetInnerHTML={{ __html: result.title }} />
                        <p className="text-sm text-muted-foreground">
                          ${result.price?.toFixed(2)}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {query && (
              <>
                <CommandSeparator />
                <CommandItem onSelect={handleSearchSubmit}>
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search for "{query}"</span>
                </CommandItem>
              </>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}