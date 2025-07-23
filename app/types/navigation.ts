// Navigation item interface
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Union type for internal routes vs external links
export type NavLinkType = 'internal' | 'external';

// Mobile menu state interface
export interface MobileMenuState {
  isOpen: boolean;
}

// Navigation items constant
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    label: 'Poems',
    href: '/poems',
    children: [
      {
        label: 'Friends',
        href: '/poems/friends',
      },
      {
        label: 'Family',
        href: '/poems/family',
      },
      {
        label: 'Faith',
        href: '/poems/faith',
      },
    ],
  },
  {
    label: 'Tiny Books',
    href: '/tiny-books',
  },
  {
    label: 'About Susan Engle',
    href: '/about',
  },
];