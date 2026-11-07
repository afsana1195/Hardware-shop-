import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  List,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';
import { Product, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { filterAndSortProducts } from '../utils/inventory';
import { CATEGORIES_DATA } from '../data/initialProducts';
import { handleImageError } from '../utils/fallbackImage';

interface ShopViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenBulkQuoteWithProduct?: (product: Product) => void;
  cartProductIds: Set<string>;
  wishlistProductIds?: Set<string>;
  onToggleWishlist?: (id: string) => void;
  initialCategory?: string;
  initialSearch?: string;
  onBackToHome?: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onOpenBulkQuoteWithProduct,
  cartProductIds,
  wishlistProductIds = new Set(),
  onToggleWishlist,
  initialCategory = 'All',
  initialSearch = '',
  onBackToHome,
}) => {
  // Extract all unique brands
  const allBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => brandsSet.add(p.brand));
    return Array.from(brandsSet).sort();
  }, [products]);

  // Max price for slider
  const maxCatalogPrice = useMemo(() => {
    return Math.max(...products.map((p) => p.price), 15000);
  }, [products]);

  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    category: initialCategory,
    brands: [],
    priceRange: [0, maxCatalogPrice],
    inStockOnly: false,
    minRating: 0,
    sortBy: 'popularity',
  });

  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Synchronize with parent navigation when category or search query changes
  React.useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({ ...prev, category: initialCategory }));
      setCurrentPage(1);
    }
  }, [initialCategory]);

  React.useEffect(() => {
    if (initialSearch !== undefined) {
      setFilters((prev) => ({ ...prev, search: initialSearch }));
      setCurrentPage(1);
    }
  }, [initialSearch]);

  const filteredProducts = useMemo(() => {
    let result = filterAndSortProducts(products, filters);
    if (onlyOnSale) {
      result = result.filter(
        (p) => p.originalPrice > p.price || (p.badge && p.badge.includes('%'))
      );
    }
    return result;
  }, [products, filters, onlyOnSale]);

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => {
      const exists = prev.brands.includes(brand);
      const newBrands = exists
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      brands: [],
      priceRange: [0, maxCatalogPrice],
      inStockOnly: false,
      minRating: 0,
      sortBy: 'popularity',
    });
    setOnlyOnSale(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.brands.length > 0 ||
    filters.inStockOnly ||
    onlyOnSale ||
    filters.minRating > 0 ||
    filters.priceRange[1] < maxCatalogPrice ||
    filters.search !== '';

  return (
    <div className="bg-[#f8faf9] min-h-screen">
      {/* 1. Clean White Header with Breadcrumbs & Category Cards (NO oversized black banner!) */}
      <section className="bg-white border-b border-stone-200 pt-5 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <button
              onClick={onBackToHome}
              className="hover:text-[#0c432d] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className={filters.category === 'All' ? 'text-stone-900 font-bold' : ''}>
              Shop
            </span>
            {filters.category !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#0c432d] font-bold">{filters.category}</span>
              </>
            )}
          </div>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {filters.category === 'All' ? 'Hardware & Building Materials' : filters.category}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Wholesale contractor prices &amp; direct site delivery across Greater Bangalore.
              </p>
            </div>
            <div className="text-xs font-bold text-stone-500">
              Showing <strong className="text-stone-900">{filteredProducts.length}</strong> products
            </div>
          </div>

          {/* Modern Category Cards Selector (Clean White Cards with realistic images) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 pt-2">
            {/* All Categories Option */}
            <button
              onClick={() => {
                setFilters({ ...filters, category: 'All' });
                setCurrentPage(1);
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                filters.category === 'All'
                  ? 'bg-emerald-50/60 border-[#0c432d] text-[#0c432d] shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-1.5 text-stone-600 font-black text-xs">
                ALL
              </div>
              <div className="text-xs font-black truncate w-full">All Products</div>
              <div className="text-[10px] text-stone-400 mt-0.5">{products.length} Items</div>
            </button>

            {/* 6 Reference Categories */}
            {CATEGORIES_DATA.map((cat) => {
              const isSelected = filters.category === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setFilters({ ...filters, category: cat.name });
                    setCurrentPage(1);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50/60 border-[#0c432d] text-[#0c432d] shadow-xs ring-1 ring-[#0c432d]'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="w-12 h-10 flex items-center justify-center mb-1">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      onError={handleImageError}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-black truncate w-full leading-tight">
                    {cat.name}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{cat.itemCount}+ Items</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Controls Bar (View mode, Sort by, Mobile Filter Toggle) */}
      <div className="bg-white border-b border-stone-200 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Active Filter Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
            {onlyOnSale && (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1">
                <span>On Sale</span>
                <button onClick={() => setOnlyOnSale(false)} className="cursor-pointer ml-1">
                  ✕
                </button>
              </span>
            )}
            {filters.inStockOnly && (
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-1">
                <span>In Stock Only</span>
                <button
                  onClick={() => setFilters({ ...filters, inStockOnly: false })}
                  className="cursor-pointer ml-1"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          {/* Right Controls: Sort, View Switcher, Mobile Filter Button */}
          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#0c432d] shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#0c432d] shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as FilterState['sortBy'],
                  });
                  setCurrentPage(1);
                }}
                className="appearance-none bg-stone-50 hover:bg-stone-100 font-bold text-stone-700 text-xs py-2 pl-3 pr-8 rounded-lg border border-stone-300 focus:outline-none focus:border-[#0c432d] cursor-pointer"
              >
                <option value="popularity">Default Sorting</option>
                <option value="rating">Sort by Rating</option>
                <option value="newest">Sort by Latest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mobile Filters Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 bg-[#0c432d] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Left Filter Sidebar + Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Filter by Price */}
            <div className="bg-white border border-stone-200/90 p-5 rounded-2xl shadow-2xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
                Filter By Price
              </h3>
              <input
                type="range"
                min={200}
                max={maxCatalogPrice}
                step={100}
                value={filters.priceRange[1]}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                  });
                  setCurrentPage(1);
                }}
                className="w-full accent-[#0c432d] cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-semibold">
                  Up to: <strong className="text-stone-900">₹{filters.priceRange[1].toLocaleString('en-IN')}</strong>
                </span>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-1 bg-stone-100 hover:bg-[#0c432d] hover:text-white text-stone-800 text-[11px] font-bold uppercase rounded-md transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Stock & Sale Status */}
            <div className="bg-white border border-stone-200/90 p-5 rounded-2xl shadow-2xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
                Availability &amp; Offers
              </h3>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700 select-none hover:text-stone-900">
                <input
                  type="checkbox"
                  checked={onlyOnSale}
                  onChange={(e) => {
                    setOnlyOnSale(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-[#0c432d] focus:ring-[#0c432d] w-4 h-4 border-stone-300"
                />
                <span>Special Contractor Discounts (On Sale)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700 select-none hover:text-stone-900">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => {
                    setFilters({ ...filters, inStockOnly: e.target.checked });
                    setCurrentPage(1);
                  }}
                  className="rounded text-[#0c432d] focus:ring-[#0c432d] w-4 h-4 border-stone-300"
                />
                <span>In Stock at Makali Yard</span>
              </label>
            </div>

            {/* Filter by Brand */}
            <div className="bg-white border border-stone-200/90 p-5 rounded-2xl shadow-2xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
                Brand Stockists
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {allBrands.map((brand) => {
                  const isChecked = filters.brands.includes(brand);
                  const count = products.filter((p) => p.brand === brand).length;
                  return (
                    <label
                      key={brand}
                      className="flex items-center justify-between cursor-pointer text-xs font-semibold text-stone-600 select-none hover:text-stone-900"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBrandToggle(brand)}
                          className="rounded text-[#0c432d] focus:ring-[#0c432d] w-3.5 h-3.5 border-stone-300"
                        />
                        <span className="truncate">{brand}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Product Grid Area (Clean 2-cols on mobile, 4-cols on desktop) */}
          <main className="lg:col-span-9 space-y-6">
            {paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5'
                    : 'space-y-3'
                }
              >
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="h-full">
                    <ProductCard
                      product={product}
                      onSelect={onSelectProduct}
                      onAddToCart={onAddToCart}
                      onOpenBulkQuoteWithProduct={onOpenBulkQuoteWithProduct}
                      isInCart={cartProductIds.has(product.id)}
                      isWishlisted={wishlistProductIds.has(product.id)}
                      onToggleWishlist={onToggleWishlist}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0c432d] mx-auto flex items-center justify-center">
                  <SlidersHorizontal className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-stone-800">
                  No materials matched your filter criteria
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing the brand or price filters to browse our full 50+ product inventory.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-2 px-5 py-2.5 bg-[#0c432d] hover:bg-[#072c1c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-200">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer"
                >
                  &larr; Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#0c432d] text-white shadow-xs'
                        : 'border border-stone-300 text-stone-700 hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[85vh] flex flex-col overflow-hidden border border-stone-200">
            <div className="bg-[#0c432d] text-white p-4 flex items-center justify-between shrink-0">
              <span className="font-bold text-sm uppercase tracking-wider">
                Filter Products ({filteredProducts.length})
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-5 text-xs flex-1">
              <div>
                <label className="font-bold text-stone-900 block mb-2">Max Price</label>
                <input
                  type="range"
                  min={200}
                  max={maxCatalogPrice}
                  step={100}
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                    })
                  }
                  className="w-full accent-[#0c432d]"
                />
                <div className="text-right font-bold text-stone-800 mt-1">
                  ₹{filters.priceRange[1].toLocaleString('en-IN')}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={onlyOnSale}
                    onChange={(e) => setOnlyOnSale(e.target.checked)}
                    className="rounded text-[#0c432d]"
                  />
                  <span>On Sale</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) =>
                      setFilters({ ...filters, inStockOnly: e.target.checked })
                    }
                    className="rounded text-[#0c432d]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="font-bold text-stone-900 block mb-1">Brands</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {allBrands.map((b) => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer text-stone-700">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(b)}
                        onChange={() => handleBrandToggle(b)}
                        className="rounded text-[#0c432d]"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex gap-2 shrink-0">
              <button
                onClick={handleClearFilters}
                className="w-1/2 py-2.5 bg-stone-200 text-stone-800 font-bold text-xs uppercase rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-[#0c432d] text-white font-bold text-xs uppercase rounded-xl"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
