import type { Route } from "./+types/robots[.]txt";

export function loader({}: Route.LoaderArgs) {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://iambicnana.com/sitemap.xml
`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
