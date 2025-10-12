import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/search", "routes/search.tsx"),
  route("/poems", "routes/poems.tsx"),
  route("/poems/friends", "routes/poems/friends.tsx"),
  route("/poems/family", "routes/poems/family.tsx"),
  route("/poems/faith", "routes/poems/faith.tsx"),
  route("/poems/:poemId", "routes/poems.$poemId.tsx"),
  route("/tiny-books", "routes/tiny-books.tsx"),
  route("/checkout", "routes/checkout.tsx"),
  route("/books/:bookId", "routes/books.$bookId.tsx"),
  route("/books/success", "routes/books.success.tsx"),
  route("/about", "routes/about.tsx"),
  route("/listen", "routes/listen.tsx"),
  route("/sitemap", "routes/sitemap.tsx"),
  route("/sitemap.xml", "routes/sitemap[.]xml.tsx"),
  route("/robots.txt", "routes/robots[.]txt.tsx")
] satisfies RouteConfig;
