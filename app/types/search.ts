/**
 * Search result interface for unified search across poems and books
 */
export interface SearchResult {
  id: string;
  title: string;
  type: 'poem' | 'book';
  excerpt: string;
  category?: string; // For poems (friends, family, faith)
  price?: number;    // For books
  url: string;
}

/**
 * Searchable content types - poems and books combined
 */
export type SearchableContent = SearchResult;

/**
 * Search query interface for advanced search functionality
 */
export interface SearchQuery {
  query: string;
  type?: 'poem' | 'book' | 'all';
  category?: string;
  maxResults?: number;
}

/**
 * Search options for customizing search behavior
 */
export interface SearchOptions {
  includeContent?: boolean;  // Whether to search within poem/book content
  fuzzySearch?: boolean;     // Enable fuzzy/approximate matching
  highlightMatches?: boolean; // Whether to highlight search terms in results
  caseSensitive?: boolean;   // Case-sensitive search
}

/**
 * Search result with highlighting information
 */
export interface HighlightedSearchResult extends SearchResult {
  highlights?: {
    title?: string;
    excerpt?: string;
    content?: string;
  };
  score?: number; // Relevance score for ranking
}

/**
 * Search statistics and metadata
 */
export interface SearchStats {
  totalResults: number;
  searchTime: number; // in milliseconds
  query: string;
  resultsByType: {
    poems: number;
    books: number;
  };
}