import type { Handler, HandlerEvent } from '@netlify/functions';

// Main handler function
export const handler: Handler = async (event: HandlerEvent) => {
  console.log('Robots.txt function called:', {
    httpMethod: event.httpMethod,
    path: event.path,
  });

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: `Method ${event.httpMethod} not allowed`,
    };
  }

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://iambicnana.com/sitemap.xml
`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
    body: robotsTxt,
  };
};
