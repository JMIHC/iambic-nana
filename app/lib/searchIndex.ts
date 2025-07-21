import { friendsPoems } from '~/data/friends-poems';
import { familyPoems } from '~/data/family-poems';
import { faithPoems } from '~/data/faith-poems';
import { books } from '~/data/books';
import type { SearchResult, SearchQuery, SearchOptions, HighlightedSearchResult, SearchStats } from '~/types/search';
import type { BasePoem } from '~/types/poem';
import type { Book } from '~/data/books';

/**
 * Combines all poems into a single array
 */
const allPoems: BasePoem[] = [
  ...friendsPoems,
  ...familyPoems,
  ...faithPoems,
];

/**
 * Converts poem data to search result format
 */
function poemToSearchResult(poem: BasePoem): SearchResult {
  return {
    id: poem.id,
    title: poem.title,
    type: 'poem',
    excerpt: poem.excerpt,
    category: poem.category,
    url: `/poems/${poem.id}`,
  };
}

/**
 * Converts book data to search result format
 */
function bookToSearchResult(book: Book): SearchResult {
  return {
    id: book.id,
    title: book.title,
    type: 'book',
    excerpt: book.excerpt,
    category: book.category,
    price: book.price,
    url: `/tiny-books/${book.id}`,
  };
}

/**
 * Creates the unified search index from all content
 */
function createSearchIndex(): SearchResult[] {
  const poemResults = allPoems.map(poemToSearchResult);
  const bookResults = books.map(bookToSearchResult);
  
  return [...poemResults, ...bookResults];
}

// Create the search index
export const searchIndex: SearchResult[] = createSearchIndex();

/**
 * Simple text similarity scoring
 */
function calculateRelevanceScore(searchTerm: string, text: string): number {
  const lowerSearchTerm = searchTerm.toLowerCase();
  const lowerText = text.toLowerCase();
  
  // Exact match gets highest score
  if (lowerText.includes(lowerSearchTerm)) {
    const position = lowerText.indexOf(lowerSearchTerm);
    // Earlier matches score higher
    return 1.0 - (position / lowerText.length) * 0.3;
  }
  
  // Check for word matches
  const searchWords = lowerSearchTerm.split(' ').filter(word => word.length > 2);
  const textWords = lowerText.split(' ');
  
  let matchingWords = 0;
  for (const searchWord of searchWords) {
    if (textWords.some(textWord => textWord.includes(searchWord))) {
      matchingWords++;
    }
  }
  
  return searchWords.length > 0 ? matchingWords / searchWords.length * 0.7 : 0;
}

/**
 * Highlights search terms in text
 */
function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Performs search across all content types
 */
export function search(
  query: SearchQuery,
  options: SearchOptions = {}
): { results: HighlightedSearchResult[]; stats: SearchStats } {
  const startTime = performance.now();
  const { query: searchTerm, type = 'all', category, maxResults = 50 } = query;
  const { includeContent = true, highlightMatches = false } = options;
  
  if (!searchTerm.trim()) {
    return {
      results: [],
      stats: {
        totalResults: 0,
        searchTime: performance.now() - startTime,
        query: searchTerm,
        resultsByType: { poems: 0, books: 0 },
      },
    };
  }
  
  let filteredIndex = searchIndex;
  
  // Filter by type
  if (type !== 'all') {
    filteredIndex = filteredIndex.filter(item => item.type === type);
  }
  
  // Filter by category
  if (category) {
    filteredIndex = filteredIndex.filter(item => item.category === category);
  }
  
  // Search and score results
  const scoredResults: (HighlightedSearchResult & { score: number })[] = [];
  
  for (const item of filteredIndex) {
    let titleScore = calculateRelevanceScore(searchTerm, item.title);
    let excerptScore = calculateRelevanceScore(searchTerm, item.excerpt);
    let contentScore = 0;
    
    // Search in full content for poems
    if (includeContent && item.type === 'poem') {
      const poem = allPoems.find(p => p.id === item.id);
      if (poem) {
        contentScore = calculateRelevanceScore(searchTerm, poem.content) * 0.5;
      }
    }
    
    const totalScore = Math.max(titleScore, excerptScore, contentScore);
    
    if (totalScore > 0.1) { // Minimum relevance threshold
      const result: HighlightedSearchResult & { score: number } = {
        ...item,
        score: totalScore,
      };
      
      // Add highlights if requested
      if (highlightMatches) {
        result.highlights = {
          title: highlightText(item.title, searchTerm),
          excerpt: highlightText(item.excerpt, searchTerm),
        };
      }
      
      scoredResults.push(result);
    }
  }
  
  // Sort by relevance score (descending)
  scoredResults.sort((a, b) => b.score - a.score);
  
  // Limit results
  const limitedResults = scoredResults.slice(0, maxResults);
  
  // Calculate stats
  const poemCount = limitedResults.filter(r => r.type === 'poem').length;
  const bookCount = limitedResults.filter(r => r.type === 'book').length;
  
  const stats: SearchStats = {
    totalResults: limitedResults.length,
    searchTime: performance.now() - startTime,
    query: searchTerm,
    resultsByType: {
      poems: poemCount,
      books: bookCount,
    },
  };
  
  return { results: limitedResults, stats };
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(partialQuery: string, limit: number = 5): string[] {
  if (!partialQuery.trim() || partialQuery.length < 2) return [];
  
  const suggestions = new Set<string>();
  const lowerQuery = partialQuery.toLowerCase();
  
  // Add title suggestions
  for (const item of searchIndex) {
    if (item.title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(item.title);
    }
    
    // Add category suggestions
    if (item.category && item.category.toLowerCase().includes(lowerQuery)) {
      suggestions.add(item.category);
    }
  }
  
  return Array.from(suggestions).slice(0, limit);
}

/**
 * Get popular search terms (could be enhanced with analytics)
 */
export function getPopularSearchTerms(): string[] {
  return [
    'friendship',
    'family',
    'faith',
    'love',
    'children',
    'prayer',
    'joy',
    'hope',
  ];
}

/**
 * Get content statistics
 */
export function getContentStats() {
  const poemCount = searchIndex.filter(item => item.type === 'poem').length;
  const bookCount = searchIndex.filter(item => item.type === 'book').length;
  
  const categoryCounts = searchIndex.reduce((acc, item) => {
    if (item.category) {
      acc[item.category] = (acc[item.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total: searchIndex.length,
    poems: poemCount,
    books: bookCount,
    categories: categoryCounts,
  };
}