import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Phone,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Truck,
  MapPin,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Product, UserProfile } from '../types';
import { CATEGORIES_DATA } from '../data/initialProducts';
import { handleImageError } from '../utils/fallbackImage';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  cartTotal?: number;
  openCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
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
  wishlistCount,
  onOpenWishlist,
  currentUser,
  onOpenLogin,
  onOpenBulkQuote,
  onOpenAdmin,
  products,
  onSelectProduct,
  onSearchSubmit,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allCategoriesOpen, setAllCategoriesOpen] = useState(false);

  const filteredSearch = searchQuery.trim()
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearchSubmit(searchQuery, 'All');
    setShowSearchResults(false);
    setCurrentTab('shop');
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'deals', label: 'Deals' },
    { id: 'brands', label: 'Brands' },
    { id: 'bulk', label: 'Bulk Order' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-stone-200">
      {/* 1. Deep Forest Green Top Utility Bar */}
      <div className="bg-[#0c432d] text-white py-1.5 px-3 sm:px-6 text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Location & Delivery Info */}
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="flex items-center gap-1.5 text-stone-200 truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Makali, Bengaluru – 562162</span>
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-amber-300 font-semibold truncate">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Free Site Delivery in Bengaluru (Orders ₹15,000+)</span>
            </span>
          </div>

          {/* Quick Enquiries & Staff Admin */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-medium">
            <button
              onClick={onOpenBulkQuote}
              className="flex items-center gap-1.5 text-stone-100 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Bulk &amp; Contractor Enquiry</span>
              <span className="sm:hidden font-bold">Enquiry</span>
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-stone-300 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Staff Portal"
            >
              <ShieldCheck className="w-3 h-3" />
              <span className="hidden xs:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header (Clean White Background, Authentic Jyoti Logo) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo */}
          <button
            onClick={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-left focus:outline-none shrink-0 cursor-pointer"
          >
            <img
              src="/assets/reference/logo.png"
              alt="Jyoti Hardware & Construction"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
          </button>

          {/* Search Bar - Desktop View */}
          <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl relative">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center bg-white rounded-lg border-2 border-stone-300 hover:border-stone-400 focus-within:border-[#0c432d] transition-all overflow-hidden shadow-2xs"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search cement, tools, paints, electricals..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0c432d] hover:bg-[#072d1d] text-white transition-colors flex items-center justify-center cursor-pointer"
                title="Search Products"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Suggestions Dropdown */}
            {showSearchResults && searchQuery.trim().length > 1 && (
              <div
                className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-stone-200 py-2 z-50 max-h-96 overflow-y-auto"
                onMouseLeave={() => setShowSearchResults(false)}
              >
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 flex items-center justify-between">
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
                      className="w-full px-4 py-2.5 text-left hover:bg-emerald-50/50 flex items-center gap-3 transition-colors border-b border-stone-50 last:border-0 cursor-pointer"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        loading="lazy"
                        onError={handleImageError}
                        className="w-9 h-9 rounded object-contain border border-stone-200 shrink-0 p-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate">{prod.name}</div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-1.5">
                          <span className="text-[#0c432d] font-bold">{prod.brand}</span>
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
                    No products matched "{searchQuery}". Press Enter to view in catalog.
                  </div>
                )}
                <div className="p-2 border-t border-stone-100 bg-stone-50 text-center">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold text-[#0c432d] hover:underline cursor-pointer"
                  >
                    View all matching results in Shop &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons: Login, Wishlist, Cart */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Login / Account */}
            <button
              onClick={onOpenLogin}
              className="flex flex-col items-center justify-center text-stone-700 hover:text-[#0c432d] transition-colors group cursor-pointer focus:outline-none p-1"
              title="Contractor & Customer Login"
            >
              <User className="w-5 h-5 sm:w-5 sm:h-5 text-stone-700 group-hover:text-[#0c432d] transition-colors" />
              <span className="text-[10px] font-bold tracking-tight mt-0.5">
                {currentUser ? currentUser.name.split(' ')[0] : 'Login'}
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="flex flex-col items-center justify-center text-stone-700 hover:text-[#0c432d] transition-colors group cursor-pointer focus:outline-none p-1 relative"
              title="View Wishlist"
            >
              <div className="relative">
                <Heart
                  className={`w-5 h-5 sm:w-5 sm:h-5 transition-colors ${
                    wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-stone-700 group-hover:text-[#0c432d]'
                  }`}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight mt-0.5">Wishlist</span>
            </button>

            {/* Shopping Cart */}
            <button
              onClick={openCart}
              className="flex flex-col items-center justify-center text-stone-700 hover:text-[#0c432d] transition-colors group cursor-pointer focus:outline-none p-1 relative"
              title="View Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 sm:w-5 sm:h-5 text-stone-700 group-hover:text-[#0c432d] transition-colors" />
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-tight mt-0.5">Cart</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-stone-700 hover:text-stone-900 rounded-md hover:bg-stone-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile View */}
        <div className="mt-2 md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-stone-100 rounded-lg border border-stone-300 focus-within:border-[#0c432d] focus-within:bg-white transition-all overflow-hidden"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cement, tools, paints, electrical..."
              className="flex-1 px-3 py-2 text-xs text-stone-900 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2 text-stone-400 text-xs"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#0c432d] text-white text-xs font-bold flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Deep Forest Green Navigation Menu Bar */}
      <nav className="bg-[#0c432d] text-white shadow-xs relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: "All Categories" Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAllCategoriesOpen(!allCategoriesOpen)}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#083020] hover:bg-[#062619] font-bold text-xs uppercase tracking-wider text-white transition-colors cursor-pointer select-none"
              >
                <Menu className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    allCategoriesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* All Categories Dropdown Flyout */}
              {allCategoriesOpen && (
                <div
                  className="absolute left-0 top-full w-64 bg-white text-stone-900 shadow-2xl rounded-b-xl border border-stone-200 py-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setAllCategoriesOpen(false)}
                >
                  <div className="px-4 py-1.5 border-b border-stone-100 text-[10px] font-black uppercase tracking-wider text-stone-400">
                    Product Categories
                  </div>
                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(cat.name);
                        setCurrentTab('shop');
                        setAllCategoriesOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-stone-700 hover:text-white hover:bg-[#0c432d] flex items-center justify-between transition-colors cursor-pointer"
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
                        setAllCategoriesOpen(false);
                      }}
                      className="w-full text-center py-1.5 text-xs font-bold text-[#0c432d] hover:underline uppercase"
                    >
                      View All Products &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const isActive =
                  item.id === 'deals'
                    ? false
                    : item.id === 'brands'
                    ? false
                    : currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'bulk') {
                        setCurrentTab('bulk');
                      } else if (item.id === 'deals') {
                        setCurrentTab('shop');
                      } else if (item.id === 'brands') {
                        setCurrentTab('shop');
                      } else {
                        setCurrentTab(item.id);
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3 lg:px-4 py-2.5 sm:py-3 text-xs font-bold tracking-wide transition-colors relative cursor-pointer ${
                      isActive
                        ? 'text-amber-300 font-extrabold'
                        : 'text-stone-100 hover:text-amber-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Quick Contractor Quote Button */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => {
                  setCurrentTab('bulk');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                <span>Bulk Contractor Pricing</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#083020] text-white px-4 py-4 space-y-2 border-t border-emerald-900 animate-in fade-in">
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-300 pb-1 border-b border-emerald-900">
              Navigation Menu
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'bulk') {
                    setCurrentTab('bulk');
                  } else if (item.id === 'deals' || item.id === 'brands') {
                    setCurrentTab('shop');
                  } else {
                    setCurrentTab(item.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold cursor-pointer ${
                  currentTab === item.id
                    ? 'bg-amber-400 text-stone-950 font-black'
                    : 'text-stone-200 hover:bg-emerald-900/60'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 border-t border-emerald-900 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenBulkQuote();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-lg bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bulk Quote</span>
              </button>
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-lg bg-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-white/20"
              >
                <User className="w-3.5 h-3.5" />
                <span>{currentUser ? 'My Profile' : 'Sign In'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
