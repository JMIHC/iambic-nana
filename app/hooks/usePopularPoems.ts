import { useState, useEffect } from 'react';
import { friendsPoems, type Poem } from '../data/friends-poems';

// Extended Poem type with view count
interface PoemWithViews extends Poem {
  views: number;
}

// API response type
interface PopularPoem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  views: number;
}

interface PopularPoemsResponse {
  success: boolean;
  poems: PopularPoem[];
  total: number;
  limit: number;
  error?: string;
  timestamp: string;
}

interface UsePopularPoemsReturn {
  poems: PoemWithViews[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Get the API endpoint based on environment
const getApiEndpoint = () => {
  // Check if we're in production or local development
  const isProduction = typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    !window.location.hostname.includes('127.0.0.1');
  
  if (isProduction) {
    return '/.netlify/functions/get-popular-poems';
  }
  
  // For local development, use the Netlify CLI default port
  return 'http://localhost:8888/.netlify/functions/get-popular-poems';
};

// Custom hook for fetching popular poems
export function usePopularPoems(limit: number = 6): UsePopularPoemsReturn {
  const [poems, setPoems] = useState<PoemWithViews[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPopularPoems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoint = getApiEndpoint();
      const url = limit !== 6 ? `${endpoint}?limit=${limit}` : endpoint;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PopularPoemsResponse = await response.json();
      
      // Match API poem IDs with full poem data from friends-poems.ts
      const popularPoemsWithData: PoemWithViews[] = data.poems
        .map((popularPoem) => {
          // Find matching poem in our data
          const fullPoem = friendsPoems.find(poem => poem.id === popularPoem.id);
          if (!fullPoem) {
            // Handle case where poem ID doesn't match (data sync issues)
            console.warn(`Popular poem ID "${popularPoem.id}" not found in poem data`);
            return null;
          }
          return {
            ...fullPoem,
            views: popularPoem.views
          };
        })
        .filter((poem): poem is PoemWithViews => poem !== null)
        // Sort by view count descending to maintain order from API
        .sort((a, b) => b.views - a.views);
      
      setPoems(popularPoemsWithData);
      
      // Log if we're using fallback data
      if (!data.success && data.error) {
        console.warn('Popular poems: Using fallback data -', data.error);
      }
      
    } catch (err) {
      console.error('Error fetching popular poems:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch popular poems'));
      // Set empty array on error - component can handle gracefully
      setPoems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularPoems();
  }, [limit]);

  return {
    poems,
    isLoading,
    error,
    refetch: fetchPopularPoems,
  };
}