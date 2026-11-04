import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Phone,
  MessageCircle,
  ShieldCheck,
  Truck,
  MapPin,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES_DATA } from '../data/initialProducts';
import { handleImageError } from '../utils/fallbackImage';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  cartTotal?: number;
  openCart: () => void;
  onOpenBulkQuote: () => void;
  onOpenAdmin: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSearchSubmit: (query: string, category?: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  cartTotal = 0,
  openCart,
  onOpenBulkQuote,
  onOpenAdmin,
  products,
  onSelectProduct,
  onSearchSubmit,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [browseCategoriesOpen, setBrowseCategoriesOpen] = useState(false);

  const filteredSearch = searchQuery.trim()
    ? products
        .filter((p) => {
          const matchesQuery =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCat =
            searchCategory === 'All' || p.category === searchCategory;
          return matchesQuery && matchesCat;
        })
        .slice(0, 6)
    : [];

  const handleSearchSubmitAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearchSubmit(searchQuery, searchCategory);
    setShowSearchResults(false);
    setCurrentTab('shop');
  };

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'offers', label: 'PROMOTIONS' },
    { id: 'shop', label: 'SHOP' },
    { id: 'faq', label: 'HANDY HINTS' },
    { id: 'guides', label: 'HOW TO GUIDES' },
    { id: 'about', label: 'ABOUT US' },
    { id: 'contact', label: 'CONTACT US' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-xs shadow-xs border-b border-stone-200">
      {/* 1. Ultra-Compact Top Announcement Bar (Optimized for Mobile & Desktop) */}
      <div className="bg-stone-900 text-stone-200 py-1 px-3 sm:px-4 text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Site Delivery Highlight */}
          <div className="flex items-center gap-2 truncate">
            <span className="flex items-center gap-1 text-amber-400 font-semibold truncate">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">Free Bangalore Site Delivery &gt;₹15k</span>
            </span>
            <span className="hidden lg:inline text-stone-600">|</span>
            <span className="hidden lg:flex items-center gap-1 text-stone-300 truncate">
              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
              <span className="truncate">Makali Alur Main Rd, Bangalore 562162</span>
            </span>
          </div>

          {/* Quick Contact & Staff Access */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 font-medium">
            <a
              href="tel:6297201943"
              className="flex items-center gap-1 hover:text-white transition-colors"
              title="Call Makali Yard Desk"
            >
              <Phone className="w-3 h-3 text-red-400" />
              <span className="hidden xs:inline">6297201943</span>
            </a>
            <span className="text-stone-700">|</span>
            <a
              href="https://wa.me/916297201943?text=Hello%20Jyoti%20Hardware,%20I%20have%20an%20enquiry"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
              title="WhatsApp Direct Support"
            >
              <MessageCircle className="w-3 h-3" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <span className="text-stone-700">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Staff Portal (PIN: admin123)"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header (Clean Spacing, No Overlap, No Horizontal Overflow) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-8">
          {/* Logo & Brand */}
          <button
            onClick={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col text-left focus:outline-none group shrink-0 cursor-pointer"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black italic tracking-tighter text-[#e31b23] leading-none select-none font-sans">
                Build it
              </span>
            </div>
            <div className="flex items-center gap-1 -mt-0.5">
              <span className="text-[10px] sm:text-xs font-black tracking-widest text-stone-900 uppercase">
                JYOTI DTM
              </span>
              <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider hidden sm:inline">
                • BANGALORE
              </span>
            </div>
          </button>

          {/* Search Bar - Desktop View (Unified Input + Category Selector + Submit) */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <form
              onSubmit={handleSearchSubmitAction}
              className="w-full flex items-center bg-white rounded-md border-2 border-stone-300 hover:border-stone-400 focus-within:border-[#e31b23] transition-all overflow-hidden shadow-2xs"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search for products (cement, tools, paints, electrical...)"
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />

              <div className="border-l border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors relative">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="px-2.5 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-700 bg-transparent focus:outline-none cursor-pointer pr-6 appearance-none"
                >
                  <option value="All">ALL CATEGORIES</option>
                  {CATEGORIES_DATA.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="px-3.5 py-2.5 bg-stone-100 hover:bg-[#e31b23] hover:text-white text-stone-700 transition-colors border-l border-stone-200 flex items-center justify-center cursor-pointer"
                title="Search Catalog"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Suggestions Dropdown */}
            {showSearchResults && searchQuery.trim().length > 1 && (
              <div
                className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-2xl border border-stone-200 py-2 z-50 max-h-96 overflow-y-auto"
                onMouseLeave={() => setShowSearchResults(false)}
              >
                <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 flex items-center justify-between">
                  <span>Product Suggestions</span>
                  <span>{filteredSearch.length} results</span>
                </div>
                {filteredSearch.length > 0 ? (
                  filteredSearch.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-3 transition-colors border-b border-stone-50 last:border-0 cursor-pointer"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        loading="lazy"
                        onError={handleImageError}
                        className="w-9 h-9 rounded object-contain border border-stone-200 shrink-0 p-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-1.5">
                          <span className="text-[#e31b23] font-bold">{prod.brand}</span>
                          <span>•</span>
                          <span>{prod.category}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-stone-900">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-4 text-center text-xs text-stone-500">
                    No products matched "{searchQuery}". Press Enter to view full catalog.
                  </div>
                )}
                <div className="p-2 border-t border-stone-100 bg-stone-50 text-center">
                  <button
                    onClick={handleSearchSubmitAction}
                    className="text-xs font-bold text-[#e31b23] hover:underline cursor-pointer"
                  >
                    View all matching results in Shop &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Cart Button & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={openCart}
              aria-label="View Shopping Cart"
              className="flex items-center gap-2 text-stone-800 hover:text-[#e31b23] transition-colors group cursor-pointer focus:outline-none p-1"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#e31b23] group-hover:scale-105 transition-transform" />
                {cartCount > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-stone-900 text-white text-[9px] sm:text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-cart-bump">
                    {cartCount}
                  </span>
                ) : (
                  <span className="absolute -top-1.5 -right-2 bg-stone-200 text-stone-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    0
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  Cart
                </span>
                <span className="text-xs sm:text-sm font-black text-stone-900 group-hover:text-[#e31b23]">
                  ₹{cartTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-stone-700 hover:text-stone-900 rounded-md hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile View (Compact, Integrated, Fully Functional) */}
        <div className="mt-2 md:hidden">
          <form
            onSubmit={handleSearchSubmitAction}
            className="flex items-center bg-stone-100 rounded-md border border-stone-300 focus-within:border-[#e31b23] focus-within:bg-white transition-all overflow-hidden"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cement, tools, paints, electrical..."
              className="flex-1 px-2.5 py-1.5 text-xs text-stone-900 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2 text-stone-400 text-xs hover:text-stone-600"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#e31b23] text-white text-xs font-bold flex items-center justify-center"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Solid Bright Red Navigation Bar (Directly from reference: bg-[#e31b23]) */}
      <nav className="bg-[#e31b23] text-white shadow-xs relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: BROWSE CATEGORIES Button with dropdown */}
            <div className="relative">
              <button
                onClick={() => setBrowseCategoriesOpen(!browseCategoriesOpen)}
                className="flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-[#c41219] hover:bg-[#ad0e14] font-black text-xs uppercase tracking-wider text-white transition-colors cursor-pointer select-none"
              >
                <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span className="text-[11px] sm:text-xs">BROWSE CATEGORIES</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    browseCategoriesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Browse Categories Flyout Menu */}
              {browseCategoriesOpen && (
                <div
                  className="absolute left-0 top-full w-64 sm:w-72 bg-white text-stone-900 shadow-2xl rounded-b-lg border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setBrowseCategoriesOpen(false)}
                >
                  <div className="px-4 py-1.5 border-b border-stone-100 text-[10px] font-black uppercase tracking-wider text-stone-400">
                    Product Categories
                  </div>
                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        if (onSelectCategory) {
                          onSelectCategory(cat.name);
                        }
                        setCurrentTab('shop');
                        setBrowseCategoriesOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-stone-700 hover:text-white hover:bg-[#e31b23] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    </button>
                  ))}
                  <div className="p-2 border-t border-stone-100 bg-stone-50">
                    <button
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory('All');
                        setCurrentTab('shop');
                        setBrowseCategoriesOpen(false);
                      }}
                      className="w-full text-center py-1 text-xs font-bold text-[#e31b23] hover:underline uppercase"
                    >
                      View All 8 Categories &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Nav Items for Desktop */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      if (link.id === 'guides') {
                        setCurrentTab('faq');
                      } else {
                        setCurrentTab(link.id);
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-2.5 lg:px-3 py-2.5 sm:py-3 text-[11px] lg:text-xs font-black tracking-wider uppercase transition-colors relative cursor-pointer ${
                      isActive
                        ? 'text-white bg-black/20'
                        : 'text-white/90 hover:text-white hover:bg-black/10'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: REQUEST QUOTE White Pill Button */}
            <div className="hidden sm:flex items-center">
              <button
                onClick={onOpenBulkQuote}
                className="bg-white hover:bg-stone-100 text-[#e31b23] text-xs font-black uppercase tracking-wider px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-2xs hover:shadow transition-all transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>REQUEST QUOTE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-900 text-white px-4 py-3 space-y-1.5 border-t border-red-800 animate-in fade-in">
            <div className="text-[10px] font-black uppercase tracking-wider text-stone-400 pb-1 border-b border-stone-800">
              Menu Navigation
            </div>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  if (link.id === 'guides') {
                    setCurrentTab('faq');
                  } else {
                    setCurrentTab(link.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded text-xs font-black uppercase tracking-wider cursor-pointer ${
                  currentTab === link.id
                    ? 'bg-[#e31b23] text-white'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-2 border-t border-stone-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenBulkQuote();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded bg-[#e31b23] text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Bulk Quote</span>
              </button>
              <a
                href="https://wa.me/916297201943?text=Hello%20Jyoti%20Hardware,%20I%20have%20an%20enquiry"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
