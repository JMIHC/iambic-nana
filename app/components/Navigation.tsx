import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronDown, X, Menu } from 'lucide-react';
import { NAVIGATION_ITEMS, type NavItem } from '../types/navigation';

// Props interfaces
interface DesktopNavItemProps {
  item: NavItem;
  isActive: boolean;
  isActiveLink: (href: string) => boolean;
}

interface MobileNavItemProps {
  item: NavItem;
  isActive: boolean;
  isActiveLink: (href: string) => boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

// Desktop Navigation Item Component
const DesktopNavItem: React.FC<DesktopNavItemProps> = ({ item, isActive, isActiveLink }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const hasChildren = item.children && item.children.length > 0;

  const handleMouseEnter = () => {
    if (hasChildren) {
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (hasChildren) {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          setIsDropdownOpen(!isDropdownOpen);
          break;
        case 'Escape':
          setIsDropdownOpen(false);
          e.currentTarget.blur();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setIsDropdownOpen(true);
          // Focus first child link with timeout for animation
          setTimeout(() => {
            const firstChild = dropdownRef.current?.querySelector('ul a');
            if (firstChild instanceof HTMLElement) {
              firstChild.focus();
            }
          }, 100);
          break;
      }
    }
  };

  const handleChildKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    const childLinks = dropdownRef.current?.querySelectorAll('ul a');
    if (!childLinks) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = index + 1;
        if (nextIndex < childLinks.length && childLinks[nextIndex] instanceof HTMLElement) {
          childLinks[nextIndex].focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = index - 1;
        if (prevIndex >= 0 && childLinks[prevIndex] instanceof HTMLElement) {
          childLinks[prevIndex].focus();
        } else {
          // Focus parent link
          const parentLink = dropdownRef.current?.querySelector('a');
          if (parentLink instanceof HTMLElement) {
            parentLink.focus();
          }
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        const parentLink = dropdownRef.current?.querySelector('a');
        if (parentLink instanceof HTMLElement) {
          parentLink.focus();
        }
        break;
    }
  };

  return (
    <li 
      ref={dropdownRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={item.href}
        className={`
          relative flex items-center gap-1 px-4 py-2 rounded-md
          transition-all duration-200 ease-out
          text-gray-700 dark:text-gray-300 
          hover:text-gray-900 dark:hover:text-gray-100 hover:scale-105
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
          ${isActive ? 'text-gray-900 dark:text-gray-100' : ''}
        `}
        aria-current={isActive ? 'page' : undefined}
        aria-expanded={hasChildren ? isDropdownOpen.toString() as "true" | "false" : undefined}
        aria-haspopup={hasChildren ? 'menu' : undefined}
        onKeyDown={handleKeyDown}
      >
        <span className="relative">
          {item.label}
          {isActive && (
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary"></span>
          )}
        </span>
        {hasChildren && (
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        )}
      </Link>
      
      {hasChildren && (
        <ul 
          className={`
            absolute left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl 
            border border-gray-200 dark:border-gray-700 
            transition-all duration-300 ease-out transform origin-top
            ${isDropdownOpen 
              ? 'opacity-100 visible translate-y-0 scale-100' 
              : 'opacity-0 invisible translate-y-2 scale-95'
            } z-50
          `}
          role="menu"
          aria-label={`${item.label} submenu`}
        >
          {item.children!.map((child, index) => {
            const isChildActive = isActiveLink(child.href);
            return (
              <li key={child.href} role="menuitem" className="first:rounded-t-lg last:rounded-b-lg overflow-hidden">
                <Link
                  to={child.href}
                  className={`
                    relative block px-4 py-3 text-sm 
                    transition-all duration-200 ease-out
                    hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-5
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary
                    ${isChildActive
                      ? 'text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                  aria-current={isChildActive ? 'page' : undefined}
                  onKeyDown={(e) => handleChildKeyDown(e, index)}
                >
                  <span className="relative">
                    {child.label}
                    {isChildActive && (
                      <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-secondary"></span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

// Mobile Navigation Item Component
const MobileNavItem: React.FC<MobileNavItemProps> = ({ 
  item, 
  isActive, 
  isActiveLink, 
  isExpanded, 
  onToggleExpanded 
}) => {
  const hasChildren = item.children && item.children.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onToggleExpanded();
        break;
    }
  };

  return (
    <li className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      {hasChildren ? (
        <div>
          <button
            onClick={onToggleExpanded}
            onKeyDown={handleKeyDown}
            className={`
              w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary
              ${isActive 
                ? 'text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800' 
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
            aria-expanded={isExpanded}
            aria-controls={`mobile-submenu-${item.href}`}
          >
            <span className="relative">
              {item.label}
              {isActive && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary"></span>
              )}
            </span>
            <ChevronDown 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              aria-hidden="true"
            />
          </button>
          <div
            id={`mobile-submenu-${item.href}`}
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <ul className="bg-gray-50 dark:bg-gray-900" role="menu">
              {item.children!.map((child) => {
                const isChildActive = isActiveLink(child.href);
                return (
                  <li key={child.href} role="menuitem">
                    <Link
                      to={child.href}
                      className={`
                        block pl-12 pr-6 py-3 transition-colors duration-200
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary
                        ${isChildActive
                          ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <span className="relative">
                        {child.label}
                        {isChildActive && (
                          <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-secondary"></span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <Link
          to={item.href}
          className={`
            block px-6 py-4 transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary
            ${isActive 
              ? 'text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800' 
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
            }
          `}
          aria-current={isActive ? 'page' : undefined}
        >
          <span className="relative">
            {item.label}
            {isActive && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary"></span>
            )}
          </span>
        </Link>
      )}
    </li>
  );
};

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle Escape key for mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleExpanded = (itemHref: string) => {
    setExpandedItems(prev =>
      prev.includes(itemHref)
        ? prev.filter(href => href !== itemHref)
        : [...prev, itemHref]
    );
  };

  return (
    <nav className="relative" role="navigation" aria-label="Main navigation">
      {/* Desktop Navigation */}
      <ul className="hidden lg:flex lg:items-center lg:space-x-2">
        {NAVIGATION_ITEMS.map((item) => (
          <DesktopNavItem
            key={item.href}
            item={item}
            isActive={isActiveLink(item.href)}
            isActiveLink={isActiveLink}
          />
        ))}
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-primary-300 
          transition-all duration-200 hover:scale-110 active:scale-95
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          toggleMobileMenu();
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
          }
        }}
        aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
        type="button"
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Mobile Menu Overlay and Panel */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setIsMobileMenuOpen(false);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Escape') {
              setIsMobileMenuOpen(false);
            }
          }}
          role="button"
          tabIndex={-1}
          aria-label="Close navigation menu"
        />
        
        {/* Slide-in Panel */}
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl 
            transform transition-all duration-300 ease-out
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          role="dialog"
          aria-label="Mobile navigation menu"
          aria-modal="true"
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setIsMobileMenuOpen(false);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                }
              }}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                hover:bg-gray-100 dark:hover:bg-gray-800 
                transition-all duration-200 hover:scale-110 active:scale-95
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              aria-label="Close mobile menu"
              type="button"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          
          {/* Navigation Items */}
          <nav className="overflow-y-auto h-[calc(100%-80px)]">
            <ul>
              {NAVIGATION_ITEMS.map((item) => (
                <MobileNavItem
                  key={item.href}
                  item={item}
                  isActive={isActiveLink(item.href)}
                  isActiveLink={isActiveLink}
                  isExpanded={expandedItems.includes(item.href)}
                  onToggleExpanded={() => toggleExpanded(item.href)}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;