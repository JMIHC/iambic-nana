import type { Book } from '~/types/book';

export const books: Book[] = [
  {
    id: 'bahai-faith-english',
    title: 'The Bahá\'í Faith: A Tiny Introduction',
    description: 'A concise introduction to the Bahá\'í Faith in English',
    image: '/images/books/bahai-faith-english.jpg'
  },
  {
    id: 'bahai-faith-spanish',
    title: 'La Fe Bahá\'í: Una pequeña introducción',
    description: 'Una introducción concisa a la Fe Bahá\'í en español',
    image: '/images/books/bahai-faith-spanish.jpg'
  },
  {
    id: 'tiny-book-prayers',
    title: 'A Tiny Book of Prayers',
    description: 'A collection of prayers for daily reflection and meditation',
    image: '/images/books/tiny-book-prayers.jpg'
  },
  {
    id: 'soul-is-forever',
    title: 'A Soul Is Forever: A Tiny Book of Comfort',
    description: 'Stories and reflections on life after death.',
    image: '/images/books/soul-is-forever.jpg'
  }
];

export const BUNDLE_DEAL = {
  id: 'community-stimulus-bundle',
  title: 'Community-Building Stimulus Package',
  description: 'All 4 tiny books bundled together',
  price: 7.00,
  stripePriceId: 'price_bundle_deal',
  bookIds: ['bahai-faith-english', 'bahai-faith-spanish', 'tiny-book-prayers', 'soul-is-forever']
};