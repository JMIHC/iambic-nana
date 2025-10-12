import type { Handler, HandlerEvent } from '@netlify/functions';
import { friendsPoems } from '../../app/data/friends-poems';
import { familyPoems } from '../../app/data/family-poems';
import { faithPoems } from '../../app/data/faith-poems';

// Main handler function
export const handler: Handler = async (event: HandlerEvent) => {
  console.log('Sitemap function called:', {
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

  try {
    const baseUrl = "https://iambicnana.com";

    // Combine all poems from different categories
    const allPoems = [...faithPoems, ...familyPoems, ...friendsPoems];

    // Static pages with priorities
    const staticPages = [
      { url: "", priority: "1.0", changefreq: "daily" },
      { url: "/poems", priority: "0.9", changefreq: "daily" },
      { url: "/poems/faith", priority: "0.8", changefreq: "weekly" },
      { url: "/poems/family", priority: "0.8", changefreq: "weekly" },
      { url: "/poems/friends", priority: "0.8", changefreq: "weekly" },
      { url: "/tiny-books", priority: "0.9", changefreq: "weekly" },
      { url: "/about", priority: "0.7", changefreq: "monthly" },
      { url: "/listen", priority: "0.8", changefreq: "weekly" },
      { url: "/search", priority: "0.6", changefreq: "monthly" },
      { url: "/sitemap", priority: "0.5", changefreq: "monthly" },
    ];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("")}
  ${allPoems.map(poem => `
  <url>
    <loc>${baseUrl}/poems/${poem.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("")}
  <url>
    <loc>${baseUrl}/tiny-books</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
      body: sitemap,
    };

  } catch (error) {
    console.error('Error generating sitemap:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'Error generating sitemap',
    };
  }
};
