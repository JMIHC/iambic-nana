import { Redis } from '@upstash/redis';
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// CORS headers for local development and cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

// Validate poemId parameter
const validatePoemId = (poemId: string) => {
  if (!poemId || typeof poemId !== 'string' || poemId.trim().length === 0) {
    throw new Error('Invalid poemId: must be a non-empty string');
  }
  
  // Basic sanitization - allow alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9\-_]+$/.test(poemId)) {
    throw new Error('Invalid poemId: contains invalid characters');
  }
};

// Generate Redis key for poem views
const getViewKey = (poemId: string) => `poem:views:${poemId}`;

// Handle GET request - fetch view count without incrementing
const handleGet = async (event: HandlerEvent) => {
  const poemId = event.queryStringParameters?.poemId;
  
  if (!poemId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Missing poemId query parameter',
        example: '/.netlify/functions/track-view?poemId=a-travelers-tale'
      }),
    };
  }

  try {
    validatePoemId(poemId);
    
    const viewKey = getViewKey(poemId);
    const views = await redis.get(viewKey) || 0;
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        poemId,
        views: Number(views),
        action: 'fetch'
      }),
    };
  } catch (error) {
    console.error('Error fetching view count:', error);
    
    return {
      statusCode: error instanceof Error && error.message.includes('Invalid poemId') ? 400 : 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to fetch view count',
        poemId
      }),
    };
  }
};

// Handle POST request - increment view count and return new count
const handlePost = async (event: HandlerEvent) => {
  let requestBody;
  
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Missing request body',
          expected: { poemId: 'string' }
        }),
      };
    }

    requestBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Invalid JSON in request body',
        received: event.body
      }),
    };
  }

  const { poemId } = requestBody;

  if (!poemId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Missing poemId in request body',
        expected: { poemId: 'string' }
      }),
    };
  }

  try {
    validatePoemId(poemId);
    
    const viewKey = getViewKey(poemId);
    
    // Increment view count atomically
    const newViews = await redis.incr(viewKey);
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        poemId,
        views: newViews,
        action: 'increment'
      }),
    };
  } catch (error) {
    console.error('Error incrementing view count:', error);
    
    return {
      statusCode: error instanceof Error && error.message.includes('Invalid poemId') ? 400 : 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to increment view count',
        poemId
      }),
    };
  }
};

// Main handler function
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log('Track view function called:', {
    httpMethod: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters,
    hasBody: !!event.body
  });

  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  try {
    // Validate environment variables
    validateEnvironment();

    // Route based on HTTP method
    switch (event.httpMethod) {
      case 'GET':
        return await handleGet(event);
      
      case 'POST':
        return await handlePost(event);
      
      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({
            error: `Method ${event.httpMethod} not allowed`,
            allowedMethods: ['GET', 'POST', 'OPTIONS']
          }),
        };
    }
  } catch (error) {
    console.error('Unexpected error in track-view function:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
    };
  }
};