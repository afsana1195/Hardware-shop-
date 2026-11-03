import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Star,
  ChevronDown,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Product, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { filterAndSortProducts } from '../utils/inventory';
import { CATEGORIES_DATA } from '../data/initialProducts';

interface ShopViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenBulkQuoteWithProduct: (product: Product) => void;
  cartProductIds: Set<string>;
  initialCategory?: string;
  initialSearch?: string;
}

// 14 Category badges displayed in the Shop Hero Banner (Directly from Build it DTM screenshot)
const HERO_CATEGORIES = [
  { name: 'APPLIANCES', count: '8 Products', filterCat: 'Power Tools' },
  { name: 'BATHROOMWARE', count: '36 Products', filterCat: 'Plumbing Supplies' },
  { name: 'BUILDING MATERIALS', count: '19 Products', filterCat: 'Cement & Construction Materials' },
  { name: 'CEILING', count: '24 Products', filterCat: 'Building Hardware' },
  { name: 'DOORS', count: '34 Products', filterCat: 'Building Hardware' },
  { name: 'FASTENERS', count: '16 Products', filterCat: 'Adhesives & Fasteners' },
  { name: 'GARDEN & OUTDOOR', count: '15 Products', filterCat: 'Safety Equipment' },
  { name: 'PAINTING & DECORATING', count: '45 Products', filterCat: 'Paints & Accessories' },
  { name: 'PLUMBING', count: '68 Products', filterCat: 'Plumbing Supplies' },
  { name: 'ROOFING', count: '10 Products', filterCat: 'Cement & Construction Materials' },
  { name: 'TILING', count: '22 Products', filterCat: 'Cement & Construction Materials' },
  { name: 'TOOLS & HARDWARE', count: '27 Products', filterCat: 'Power Tools' },
  { name: 'ELECTRICAL', count: '33 Products', filterCat: 'Electrical Supplies' },
  { name: 'WINDOWS & AWNINGS', count: '12 Products', filterCat: 'Building Hardware' },
];

// Sample Filter by Size options from reference screenshot
const SIZE_FILTERS = [
  { label: '0.3mm X 3.0m', count: 2 },
  { label: '0.3mm X 3.6m', count: 2 },
  { label: '0.3mm X 4.2m', count: 2 },
  { label: '0.3mm X 4.8m', count: 2 },
  { label: '0.3mm X 5.4m', count: 2 },
  { label: '0.3mm X 6.0m', count: 2 },
  { label: '0.4mm X 6.0m', count: 4 },
];

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  cartProductIds,
  initialCategory = 'All',
  initialSearch = '',
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

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter & sort
  const filteredProducts = useMemo(() => {
    let result = filterAndSortProducts(products, filters);
    if (onlyOnSale) {
      result = result.filter(
        (p) => p.originalPrice > p.price || (p.badge && p.badge.includes('%'))
      );
    }
    if (selectedSize) {
      const query = selectedSize.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          Object.values(p.specifications || {}).some((val) =>
            val.toLowerCase().includes(query)
          )
      );
    }
    return result;
  }, [products, filters, onlyOnSale, selectedSize]);

  // Pagination
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
    setSelectedSize(null);
    setOnlyOnSale(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.brands.length > 0 ||
    filters.inStockOnly ||
    onlyOnSale ||
    selectedSize !== null ||
    filters.minRating > 0 ||
    filters.priceRange[1] < maxCatalogPrice ||
    filters.search !== '';

  // Top Rated Products for the sidebar widget (from reference screenshot)
  const topRatedSidebarProducts = useMemo(() => {
    return products
      .filter((p) => p.rating >= 4.7)
      .slice(0, 3);
  }, [products]);

  return (
    <div className="bg-[#f7f7f7] min-h-screen">
      {/* 1. Shop Hero Banner with Overlaid Category Grid (Build it DTM Signature Look) */}
      <section className="relative w-full bg-stone-900 overflow-hidden py-10 sm:py-14 border-b border-stone-200">
        {/* Background Image with modern workshop/interior backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay scale-105"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-stone-950/70 via-stone-900/60 to-stone-950/80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Large Centered Title */}
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans mb-6">
            Shop
          </h1>

          {/* Overlaid Category Badges in 2 Rows (Directly from Build it DTM) */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
            {HERO_CATEGORIES.map((cat, idx) => {
              const isSelected = filters.category === cat.filterCat;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setFilters({ ...filters, category: cat.filterCat });
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded transition-all text-left flex flex-col items-center justify-center cursor-pointer border ${
                    isSelected
                      ? 'bg-[#e31b23] text-white border-[#e31b23] shadow-md scale-105'
                      : 'bg-black/60 hover:bg-[#e31b23] hover:border-[#e31b23] text-white/95 border-white/15 backdrop-blur-xs'
                  }`}
                >
                  <span className="text-[11px] font-black tracking-wider uppercase leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-[9px] font-medium text-stone-300 leading-tight">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Subheader Controls Bar (Breadcrumbs, Items Count, Layout Icons, Sort) */}
      <div className="bg-white border-b border-stone-200 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <button
              onClick={handleClearFilters}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-stone-900 font-bold">Shop</span>
            {filters.category !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#e31b23] font-bold">{filters.category}</span>
              </>
            )}
          </div>

          {/* Right: Show Count, Grid/List Toggles, Default Sorting */}
          <div className="flex items-center gap-4 flex-wrap justify-between md:justify-end">
            {/* Show: 9 / 12 / 18 / 24 */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
              <span>Show:</span>
              {[9, 12, 18, 24].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setItemsPerPage(count);
                    setCurrentPage(1);
                  }}
                  className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                    itemsPerPage === count
                      ? 'text-[#e31b23] font-black underline'
                      : 'hover:text-stone-900'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>

            {/* View Mode Switcher (Grid ::: vs List ≡) */}
            <div className="flex items-center gap-1 border-l border-stone-200 pl-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'text-[#e31b23] bg-red-50'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
                title="4-Column Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'text-[#e31b23] bg-red-50'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sorting Dropdown (Default sorting) */}
            <div className="relative border-l border-stone-200 pl-3">
              <select
                value={filters.sortBy}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as FilterState['sortBy'],
                  });
                  setCurrentPage(1);
                }}
                className="appearance-none bg-stone-50 hover:bg-stone-100 font-bold text-stone-700 text-xs py-1.5 pl-3 pr-7 rounded border border-stone-300 focus:outline-none focus:border-[#e31b23] cursor-pointer"
              >
                <option value="popularity">Default sorting</option>
                <option value="rating">Sort by average rating</option>
                <option value="newest">Sort by latest</option>
                <option value="price-asc">Sort by price: low to high</option>
                <option value="price-desc">Sort by price: high to low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3 py-1.5 bg-[#e31b23] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Left Sidebar + Right 4-Column Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar (Faithful to Build it DTM) */}
          <aside
            className={`lg:col-span-3 space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Mobile Filter Drawer Close Bar */}
            <div className="lg:hidden flex items-center justify-between bg-stone-900 text-white p-3 rounded-md mb-3">
              <span className="font-bold text-xs uppercase tracking-wider">
                Filter Products ({filteredProducts.length})
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="px-3 py-1 bg-[#e31b23] text-white text-xs font-bold rounded cursor-pointer"
              >
                Apply &amp; Close ✕
              </button>
            </div>

            {/* FILTER BY PRICE */}
            <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-2xs">
              <h2 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2 mb-4">
                FILTER BY PRICE
              </h2>

              <div className="space-y-4">
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
                  className="w-full accent-[#e31b23] cursor-pointer"
                />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-semibold">
                    Price: <strong className="text-stone-900">₹0 — ₹{filters.priceRange[1].toLocaleString('en-IN')}</strong>
                  </span>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-1 bg-stone-100 hover:bg-[#e31b23] hover:text-white text-stone-800 text-[11px] font-black uppercase tracking-wider rounded border border-stone-300 transition-colors cursor-pointer"
                  >
                    FILTER
                  </button>
                </div>
              </div>
            </div>

            {/* FILTER BY SIZE (Directly from reference screenshot) */}
            <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-2xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2 mb-3">
                FILTER BY SIZE
              </h3>
              <div className="space-y-1.5">
                {SIZE_FILTERS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() =>
                      setSelectedSize(selectedSize === s.label ? null : s.label)
                    }
                    className={`w-full text-left py-1 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      selectedSize === s.label
                        ? 'text-[#e31b23] font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="w-5 h-5 rounded-full border border-stone-200 bg-stone-50 text-[10px] text-stone-500 flex items-center justify-center font-bold">
                      {s.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* STOCK STATUS (Directly from reference screenshot: On sale / In stock) */}
            <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-2xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2 mb-3">
                STOCK STATUS
              </h3>
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700 select-none hover:text-stone-900">
                  <input
                    type="checkbox"
                    checked={onlyOnSale}
                    onChange={(e) => {
                      setOnlyOnSale(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="rounded text-[#e31b23] focus:ring-[#e31b23] w-4 h-4 border-stone-300"
                  />
                  <span>On sale</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700 select-none hover:text-stone-900">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => {
                      setFilters({ ...filters, inStockOnly: e.target.checked });
                      setCurrentPage(1);
                    }}
                    className="rounded text-[#e31b23] focus:ring-[#e31b23] w-4 h-4 border-stone-300"
                  />
                  <span>In stock</span>
                </label>
              </div>
            </div>

            {/* FILTER BY BRAND */}
            <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-2xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2 mb-3">
                BRANDS &amp; MAKERS
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
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
                          className="rounded text-[#e31b23] focus:ring-[#e31b23] w-3.5 h-3.5 border-stone-300"
                        />
                        <span className="truncate">{brand}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* TOP RATED PRODUCTS (Directly from reference screenshot) */}
            <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-2xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2 mb-3">
                TOP RATED PRODUCTS
              </h3>
              <div className="space-y-3">
                {topRatedSidebarProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-stone-50 border border-stone-200 rounded p-1 shrink-0 flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-stone-800 group-hover:text-[#e31b23] transition-colors truncate uppercase leading-tight">
                        {p.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-xs font-black text-[#e31b23]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Filters CTA if active */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="w-full py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </aside>

          {/* Right Product Catalog Area (4-Column Layout directly from reference) */}
          <main className="lg:col-span-9 space-y-6">
            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap bg-white p-3 border border-stone-200 rounded-sm">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Active Filters:
                </span>
                {filters.category !== 'All' && (
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-1">
                    {filters.category}
                    <button
                      onClick={() => setFilters({ ...filters, category: 'All' })}
                      className="hover:text-red-950 font-black ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {onlyOnSale && (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-bold flex items-center gap-1">
                    On Sale
                    <button
                      onClick={() => setOnlyOnSale(false)}
                      className="hover:text-black ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.brands.map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-0.5 bg-stone-100 text-stone-800 rounded-full text-xs font-bold flex items-center gap-1 border border-stone-300"
                  >
                    {b}
                    <button
                      onClick={() => handleBrandToggle(b)}
                      className="hover:text-black ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.inStockOnly && (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
                    In Stock
                    <button
                      onClick={() => setFilters({ ...filters, inStockOnly: false })}
                      className="hover:text-emerald-950 ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-[#e31b23] hover:underline ml-auto cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Display: 4-Column Grid or List View */}
            {paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-3'
                }
              >
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="animate-fade-in h-full">
                    <ProductCard
                      product={product}
                      onSelect={onSelectProduct}
                      onAddToCart={onAddToCart}
                      isInCart={cartProductIds.has(product.id)}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-stone-200 rounded p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-4">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-800 uppercase">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try adjusting the price range, brand filters, or select "All Products" to browse the complete inventory.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-5 py-2 bg-[#e31b23] text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs hover:bg-[#c41219] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Numbered Pagination (Build it DTM layout) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-200">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded border border-stone-300 text-xs font-bold text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer"
                >
                  &larr; Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded text-xs font-black transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#e31b23] text-white shadow-xs'
                        : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded border border-stone-300 text-xs font-bold text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
