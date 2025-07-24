import { friendsPoems } from '~/data/friends-poems';
import { familyPoems } from '~/data/family-poems';
import { faithPoems } from '~/data/faith-poems';
import { books } from '~/data/books';
import type { SearchResult } from '~/types/search';
import type { BasePoem } from '~/types/poem';
import type { Book } from '~/data/books';

/**
 * Calculate Levenshtein distance between two strings for fuzzy matching
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Check if a word fuzzy matches the query (allowing for typos)
 */
function fuzzyMatch(query: string, text: string, maxDistance: number = 2): boolean {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Direct substring match
  if (textLower.includes(queryLower)) return true;
  
  // Check each word in the text
  const words = textLower.split(/\s+/);
  for (const word of words) {
    // Skip very short words
    if (word.length < 3) continue;
    
    // For longer queries, check if the word starts with the query
    if (queryLower.length >= 3 && word.startsWith(queryLower.substring(0, 3))) {
      return true;
    }
    
    // Calculate edit distance for fuzzy matching
    const distance = levenshteinDistance(queryLower, word);
    const threshold = Math.min(maxDistance, Math.floor(word.length / 3));
    
    if (distance <= threshold) {
      return true;
    }
  }
  
  return false;
}

/**
 * Highlight search terms in text with <mark> tags
 */
function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  let highlightedText = text;
  
  // First try exact matches
  queryWords.forEach(queryWord => {
    const regex = new RegExp(`\\b(${queryWord})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  // If no exact matches, try fuzzy matches
  if (!highlightedText.includes('<mark>')) {
    const words = text.split(/(\s+)/);
    highlightedText = words.map(word => {
      if (word.trim() && queryWords.some(qw => fuzzyMatch(qw, word, 2))) {
        return `<mark>${word}</mark>`;
      }
      return word;
    }).join('');
  }
  
  return highlightedText;
}

/**
 * Extract excerpt around matched text (up to 150 chars)
 */
function extractExcerpt(text: string, query: string, maxLength: number = 150): string {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Find the position of the match
  let matchIndex = textLower.indexOf(queryLower);
  
  // If no exact match, find fuzzy match position
  if (matchIndex === -1) {
    const words = text.split(/\s+/);
    let currentPos = 0;
    
    for (const word of words) {
      if (fuzzyMatch(query, word)) {
        matchIndex = currentPos;
        break;
      }
      currentPos += word.length + 1;
    }
  }
  
  // If still no match, use the beginning of the text
  if (matchIndex === -1) matchIndex = 0;
  
  // Calculate excerpt boundaries
  const halfLength = Math.floor(maxLength / 2);
  let start = Math.max(0, matchIndex - halfLength);
  let end = Math.min(text.length, matchIndex + halfLength);
  
  // Adjust to word boundaries
  if (start > 0) {
    const spaceIndex = text.lastIndexOf(' ', start);
    if (spaceIndex > start - 20) start = spaceIndex + 1;
  }
  
  if (end < text.length) {
    const spaceIndex = text.indexOf(' ', end);
    if (spaceIndex !== -1 && spaceIndex < end + 20) end = spaceIndex;
  }
  
  // Extract and format excerpt
  let excerpt = text.substring(start, end);
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';
  
  return excerpt;
}

/**
 * Calculate relevance score for search results
 */
function calculateRelevance(query: string, item: {
  title: string;
  content?: string;
  category?: string;
  description?: string;
}): number {
  const queryLower = query.toLowerCase();
  let score = 0;
  
  // Title match (highest priority)
  if (item.title.toLowerCase().includes(queryLower)) {
    score += 100;
  } else if (fuzzyMatch(query, item.title, 1)) {
    score += 70;
  }
  
  // Category match
  if (item.category && item.category.toLowerCase().includes(queryLower)) {
    score += 50;
  }
  
  // Content/description match
  const contentText = item.content || item.description || '';
  if (contentText.toLowerCase().includes(queryLower)) {
    score += 30;
  } else if (fuzzyMatch(query, contentText, 2)) {
    score += 20;
  }
  
  // Boost for shorter titles (more likely to be relevant)
  score += Math.max(0, 20 - item.title.length / 5);
  
  // Boost for exact word matches
  const queryWords = queryLower.split(/\s+/);
  const titleWords = item.title.toLowerCase().split(/\s+/);
  const exactWordMatches = queryWords.filter(qw => titleWords.includes(qw)).length;
  score += exactWordMatches * 25;
  
  return score;
}

/**
 * Search poems and return search results
 */
function searchPoems(query: string): SearchResult[] {
  const allPoems = [...friendsPoems, ...familyPoems, ...faithPoems];
  const results: SearchResult[] = [];
  
  for (const poem of allPoems) {
    const relevance = calculateRelevance(query, {
      title: poem.title,
      content: poem.content,
      category: poem.category,
    });
    
    if (relevance > 0) {
      const excerpt = extractExcerpt(poem.content, query);
      results.push({
        id: poem.id,
        title: poem.title,
        type: 'poem',
        excerpt: highlightMatches(excerpt, query),
        category: poem.category,
        url: `/poems/${poem.id}`,
      });
    }
  }
  
  return results;
}

/**
 * Search books and return search results
 */
function searchBooks(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  
  for (const book of books) {
    const relevance = calculateRelevance(query, {
      title: book.title,
      description: book.description,
      category: book.category,
    });
    
    if (relevance > 0) {
      const excerpt = extractExcerpt(book.description, query);
      results.push({
        id: book.id,
        title: book.title,
        type: 'book',
        excerpt: highlightMatches(excerpt, query),
        category: book.category,
        price: book.price,
        url: `/tiny-books`,
      });
    }
  }
  
  return results;
}

/**
 * Main search function that searches through poems and books
 */
export function searchContent(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  // Search both poems and books
  const poemResults = searchPoems(query);
  const bookResults = searchBooks(query);
  
  // Combine results
  const allResults = [...poemResults, ...bookResults];
  
  // Sort by relevance (recalculate for consistent sorting)
  allResults.sort((a, b) => {
    const aItem = a.type === 'poem' 
      ? [...friendsPoems, ...familyPoems, ...faithPoems].find(p => p.id === a.id)
      : books.find(book => book.id === a.id);
      
    const bItem = b.type === 'poem'
      ? [...friendsPoems, ...familyPoems, ...faithPoems].find(p => p.id === b.id)
      : books.find(book => book.id === b.id);
    
    if (!aItem || !bItem) return 0;
    
    const aRelevance = calculateRelevance(query, {
      title: aItem.title,
      content: 'content' in aItem ? aItem.content : undefined,
      description: 'description' in aItem ? aItem.description : undefined,
      category: a.category,
    });
    
    const bRelevance = calculateRelevance(query, {
      title: bItem.title,
      content: 'content' in bItem ? bItem.content : undefined,
      description: 'description' in bItem ? bItem.description : undefined,
      category: b.category,
    });
    
    return bRelevance - aRelevance;
  });
  
  // Update titles with highlighting
  return allResults.map(result => ({
    ...result,
    title: highlightMatches(result.title, query),
  }));
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(partialQuery: string): string[] {
  if (!partialQuery || partialQuery.length < 2) return [];
  
  const suggestions = new Set<string>();
  const queryLower = partialQuery.toLowerCase();
  
  // Add poem titles
  const allPoems = [...friendsPoems, ...familyPoems, ...faithPoems];
  allPoems.forEach(poem => {
    if (poem.title.toLowerCase().startsWith(queryLower) || 
        fuzzyMatch(partialQuery, poem.title, 1)) {
      suggestions.add(poem.title);
    }
  });
  
  // Add book titles
  books.forEach(book => {
    if (book.title.toLowerCase().startsWith(queryLower) ||
        fuzzyMatch(partialQuery, book.title, 1)) {
      suggestions.add(book.title);
    }
  });
  
  // Add categories
  const categories = ['friends', 'family', 'faith', 'friendship', 'general'];
  categories.forEach(cat => {
    if (cat.startsWith(queryLower)) {
      suggestions.add(cat);
    }
  });
  
  return Array.from(suggestions).slice(0, 8);
}

/**
 * Quick search function for header search bar
 */
export function quickSearch(query: string, limit: number = 5): SearchResult[] {
  const results = searchContent(query);
  return results.slice(0, limit);
}