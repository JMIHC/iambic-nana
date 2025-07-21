export interface Book {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  price: number;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
  category: string;
}

// Placeholder book data - can be expanded later
export const books: Book[] = [
  {
    id: "tiny-verses-friendship",
    title: "Tiny Verses: Friendship",
    description: "A miniature collection of poems celebrating the bonds of friendship and connection.",
    excerpt: "A pocket-sized treasure filled with heartwarming verses about the joy of friendship, the comfort of companionship, and the beauty of human connection.",
    price: 12.99,
    category: "friendship",
    pageCount: 24,
  },
  {
    id: "miniature-meditations",
    title: "Miniature Meditations",
    description: "Small spiritual reflections and faith-inspired poetry for daily contemplation.",
    excerpt: "Portable spiritual poetry perfect for moments of quiet reflection. Each page offers a gentle meditation on faith, hope, and divine love.",
    price: 9.99,
    category: "faith",
    pageCount: 18,
  },
  {
    id: "pocket-family-poems",
    title: "Pocket Family Poems",
    description: "Intimate verses about family bonds, childhood memories, and generational love.",
    excerpt: "A sweet collection of family-centered poetry exploring the tender moments that bind families together across generations.",
    price: 11.99,
    category: "family",
    pageCount: 20,
  },
  {
    id: "whispered-words",
    title: "Whispered Words",
    description: "A delicate collection of quiet observations and gentle musings in verse.",
    excerpt: "Soft-spoken poetry that captures life's quieter moments with grace and sensitivity. Perfect for peaceful reading.",
    price: 14.99,
    category: "general",
    pageCount: 32,
  },
];