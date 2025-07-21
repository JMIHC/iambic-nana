import { Redis } from '@upstash/redis';
import type { Handler, HandlerEvent } from '@netlify/functions';
import { friendsPoems, type Poem } from '../../app/data/friends-poems';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

// Handle preflight OPTIONS requests
const handleOptions = () => ({
  statusCode: 200,
  headers: corsHeaders,
  body: '',
});

// Validate environment variables
const validateEnvironment = () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('Missing required environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
  }
};

// Interface for poem with view count
interface PopularPoem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  views: number;
}


// Get popular poems based on view counts
const getPopularPoems = async (limit: number = 6): Promise<PopularPoem[]> => {
  try {
    // Get all poem view keys using pattern matching
    const viewKeys = await redis.keys('poem:views:*');
    
    if (viewKeys.length === 0) {
      // No views recorded yet, return fallback
      return friendsPoems.slice(0, limit).map(poem => ({
        id: poem.id,
        title: poem.title,
        category: poem.category,
        excerpt: poem.excerpt,
        views: 0
      }));
    }
    
    // Batch fetch all view counts using mget
    const viewCounts = await redis.mget(...viewKeys);
    
    // Extract poem IDs from keys and create poems with view counts
    const poemsWithViews: { id: string; views: number }[] = viewKeys
      .map((key, index) => {
        // Extract poem ID from key format 'poem:views:poemId'
        const poemId = key.replace('poem:views:', '');
        const views = Number(viewCounts[index]) || 0;
        return { id: poemId, views };
      })
      .filter(item => item.views > 0) // Only include poems that have been viewed
      .sort((a, b) => b.views - a.views) // Sort by views descending
      .slice(0, limit); // Take top N poems
    
    // Map to full poem data with view counts
    const popularPoems: PopularPoem[] = poemsWithViews
      .map(({ id, views }) => {
        const poem = friendsPoems.find(p => p.id === id);
        if (!poem) return null;
        return {
          id: poem.id,
          title: poem.title,
          category: poem.category,
          excerpt: poem.excerpt,
          views
        };
      })
      .filter((poem): poem is PopularPoem => poem !== null);
    
    return popularPoems;
  } catch (error) {
    console.error('Error fetching popular poems:', error);
    // Return fallback popular poems (first few poems) if Redis fails
    return friendsPoems.slice(0, limit).map(poem => ({
      id: poem.id,
      title: poem.title,
      category: poem.category,
      excerpt: poem.excerpt,
      views: 0
    }));
  }
};

// Main handler function
export const handler: Handler = async (event: HandlerEvent) => {
  console.log('Get popular poems function called:', {
    httpMethod: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters
  });

  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({
        error: `Method ${event.httpMethod} not allowed`,
        allowedMethods: ['GET', 'OPTIONS']
      }),
    };
  }

  try {
    // Validate environment variables
    validateEnvironment();

    // Get limit from query parameters (default to 6)
    const limitParam = event.queryStringParameters?.limit;
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam), 1), 20) : 6;

    // Fetch popular poems
    const popularPoems = await getPopularPoems(limit);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body: JSON.stringify({
        success: true,
        poems: popularPoems,
        total: popularPoems.length,
        limit: limit,
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Unexpected error in get-popular-poems function:', error);
    
    // Return fallback data in case of any error
    const fallbackPoems = friendsPoems.slice(0, 6).map(poem => ({
      id: poem.id,
      title: poem.title,
      category: poem.category,
      excerpt: poem.excerpt,
      views: 0
    }));

    return {
      statusCode: 200, // Return 200 with fallback data rather than error
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        poems: fallbackPoems,
        total: fallbackPoems.length,
        limit: 6,
        error: 'Using fallback data due to service unavailability',
        timestamp: new Date().toISOString()
      }),
    };
  }
};