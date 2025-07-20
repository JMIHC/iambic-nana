import { useState, useEffect, useRef } from 'react';

// Types
interface UseViewCounterReturn {
  viewCount: number | null;
  isLoading: boolean;
  error: Error | null;
}

interface ViewCountResponse {
  poemId: string;
  views: number;
  action: 'increment' | 'fetch';
}

// Memory cache for view counts to reduce API calls
const viewCountCache = new Map<string, number>();

// SessionStorage key prefix for tracking viewed poems
const VIEWED_POEMS_KEY = 'iambic_nana_viewed_poems';

// Get the API endpoint based on environment
const getApiEndpoint = () => {
  // Check if we're in production or local development
  const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
  
  if (isProduction) {
    return '/.netlify/functions/track-view';
  }
  
  // For local development, use the Netlify CLI default port
  return 'http://localhost:8888/.netlify/functions/track-view';
};

// Check if poem was already viewed in this session
const hasViewedInSession = (poemId: string): boolean => {
  try {
    const viewedPoems = sessionStorage.getItem(VIEWED_POEMS_KEY);
    if (!viewedPoems) return false;
    
    const viewedList: string[] = JSON.parse(viewedPoems);
    return viewedList.includes(poemId);
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return false;
  }
};

// Mark poem as viewed in this session
const markAsViewed = (poemId: string): void => {
  try {
    const viewedPoems = sessionStorage.getItem(VIEWED_POEMS_KEY);
    const viewedList: string[] = viewedPoems ? JSON.parse(viewedPoems) : [];
    
    if (!viewedList.includes(poemId)) {
      viewedList.push(poemId);
      sessionStorage.setItem(VIEWED_POEMS_KEY, JSON.stringify(viewedList));
    }
  } catch (error) {
    console.error('Error writing to sessionStorage:', error);
  }
};

// Custom hook for tracking and displaying view counts
export function useViewCounter(poemId: string): UseViewCounterReturn {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef<boolean>(true);
  
  // Use ref to prevent duplicate API calls
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    // Reset refs on mount
    isMountedRef.current = true;
    isInitializedRef.current = false;

    // Validate poemId
    if (!poemId || typeof poemId !== 'string' || poemId.trim().length === 0) {
      setError(new Error('Invalid poemId provided'));
      setIsLoading(false);
      return;
    }

    // Check memory cache first
    if (viewCountCache.has(poemId)) {
      setViewCount(viewCountCache.get(poemId)!);
      setIsLoading(false);
      // Still proceed to potentially increment if not viewed in session
    }

    const trackView = async () => {
      // Prevent duplicate initialization
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      try {
        const endpoint = getApiEndpoint();
        const shouldIncrement = !hasViewedInSession(poemId);
        
        // Decide whether to increment or just fetch
        if (shouldIncrement) {
          // POST request to increment view count
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ poemId }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }

          const data: ViewCountResponse = await response.json();
          
          if (isMountedRef.current) {
            setViewCount(data.views);
            viewCountCache.set(poemId, data.views);
            markAsViewed(poemId);
            setError(null);
          }
        } else {
          // GET request to fetch current count without incrementing
          const response = await fetch(`${endpoint}?poemId=${encodeURIComponent(poemId)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }

          const data: ViewCountResponse = await response.json();
          
          if (isMountedRef.current) {
            setViewCount(data.views);
            viewCountCache.set(poemId, data.views);
            setError(null);
          }
        }
      } catch (err) {
        console.error('Error tracking view:', err);
        
        if (isMountedRef.current) {
          setError(err instanceof Error ? err : new Error('Failed to track view'));
          // Fall back to null if service is unavailable
          setViewCount(null);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // Delay API call slightly to ensure component is fully mounted
    const timeoutId = setTimeout(() => {
      trackView();
    }, 100);

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, [poemId]);

  return {
    viewCount,
    isLoading,
    error,
  };
}