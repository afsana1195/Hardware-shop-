import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  FileCheck2,
  PhoneCall,
  MapPin,
  Compass,
  Star,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types';
import { HeroBanner } from './HeroBanner';
import { CategoryGrid } from './CategoryGrid';
import { ProductCard } from './ProductCard';
import { DirectionsModal } from './DirectionsModal';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, quantity?: number) => void;
  onOpenBulkQuote: () => void;
  onOpenBulkQuoteWithProduct: (p: Product) => void;
  onShopNow: () => void;
  onSelectCategory: (cat: string) => void;
  cartProductIds: Set<string>;
  wishlistProductIds: Set<string>;
  onToggleWishlist: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onOpenBulkQuote,
  onOpenBulkQuoteWithProduct,
  onShopNow,
  onSelectCategory,
  cartProductIds,
  wishlistProductIds,
  onToggleWishlist,
}) => {
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [activeTrendingTab, setActiveTrendingTab] = useState('All');

  // Featured 4 products from the reference design
  const featuredProducts = products.slice(0, 4);

  // Trending products for the secondary collection
  const trendingProducts = products
    .filter((p) => {
      if (activeTrendingTab === 'All') return p.isTrending || p.isFeatured;
      const cat = p.category.toLowerCase();
      const tab = activeTrendingTab.toLowerCase();
      if (tab === 'cement' && (cat.includes('cement') || cat.includes('construction'))) return true;
      if (tab === 'tools' && cat.includes('tool')) return true;
      if (tab === 'paints' && cat.includes('paint')) return true;
      if (tab === 'plumbing' && cat.includes('plumb')) return true;
      if (tab === 'electrical' && cat.includes('electric')) return true;
      if (tab === 'hardware' && cat.includes('hardware')) return true;
      return cat.includes(tab);
    })
    .slice(0, 8);

  return (
    <div className="bg-white">
      {/* 1. Hero Banner with Feature Badges */}
      <HeroBanner onShopNow={onShopNow} onGetQuote={onOpenBulkQuote} />

      {/* 2. Shop by Category Section (6 Modern White Cards) */}
      <CategoryGrid onSelectCategory={onSelectCategory} />

      {/* 3. Realistic Jyoti Hardware Storefront Banner (Direct match to reference design) */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            onClick={() => setDirectionsModalOpen(true)}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-stone-200 cursor-pointer group"
            role="button"
            aria-label="Visit Our Hardware Store in Makali, Bengaluru - Click for Directions & Contact"
          >
            {/* Real Storefront Banner Background */}
            <img
              src="/assets/reference/store_banner.png"
              alt="Visit Our Hardware Store - Jyoti Hardware & Construction Makali Bangalore"
              className="w-full h-auto object-cover object-center group-hover:scale-[1.005] transition-transform duration-300"
            />

            {/* Accessible interactive hotspots for directions and location */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 flex flex-col justify-center items-end pr-4 sm:pr-8 md:pr-12 gap-2 sm:gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDirectionsModalOpen(true);
                }}
                className="opacity-0 w-36 h-9 cursor-pointer"
                aria-label="Makali Bengaluru Location Info"
                tabIndex={0}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDirectionsModalOpen(true);
                }}
                className="opacity-0 w-36 h-9 cursor-pointer"
                aria-label="Get Directions to Store"
                tabIndex={0}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products Section (Direct match to reference design: 4 products) */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
                Featured Products
              </h2>
              <div className="w-14 h-1 bg-amber-400 rounded-full mt-1.5" />
            </div>

            <button
              onClick={onShopNow}
              className="text-xs sm:text-sm font-bold text-[#0c432d] hover:text-[#062c1e] flex items-center gap-1 group cursor-pointer"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 4-Column Responsive Grid (2-cols on mobile, 4-cols on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {featuredProducts.map((p) => (
              <div key={p.id} className="h-full">
                <ProductCard
                  product={p}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                  onOpenBulkQuoteWithProduct={onOpenBulkQuoteWithProduct}
                  isInCart={cartProductIds.has(p.id)}
                  isWishlisted={wishlistProductIds.has(p.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trending Materials & Site Hardware */}
      <section className="py-12 bg-[#f8faf9] border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Trending Contractor Supplies
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                High-rotation site materials loaded and dispatched daily from our Makali Yard.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {['All', 'Cement', 'Tools', 'Paints', 'Plumbing', 'Electrical', 'Hardware'].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTrendingTab(tab)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      activeTrendingTab === tab
                        ? 'bg-[#0c432d] text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {trendingProducts.map((p) => (
              <div key={p.id} className="h-full">
                <ProductCard
                  product={p}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                  onOpenBulkQuoteWithProduct={onOpenBulkQuoteWithProduct}
                  isInCart={cartProductIds.has(p.id)}
                  isWishlisted={wishlistProductIds.has(p.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={onShopNow}
              className="px-6 py-3 bg-[#0c432d] hover:bg-[#083020] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Complete 50+ Product Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. The Jyoti Hardware Advantage */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0c432d]">
              Why Bangalore Builders Trust Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              The Jyoti Hardware Advantage
            </h2>
            <div className="w-14 h-1 bg-amber-400 rounded-full mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 bg-[#f8faf9] rounded-2xl border border-stone-200 space-y-2.5 hover:border-[#0c432d]/40 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#0c432d] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Direct Mill Authorized</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Authorized stockist for UltraTech, Tata Tiscon, Bosch, Asian Paints, and Astral. Official factory warranties and batch test certificates.
              </p>
            </div>

            <div className="p-6 bg-[#f8faf9] rounded-2xl border border-stone-200 space-y-2.5 hover:border-[#0c432d]/40 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Same-Day Site Dispatch</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dedicated tippers and crane trucks delivering right to your slab staging area in Makali, Alur, Nelamangala, and Greater Bangalore.
              </p>
            </div>

            <div className="p-6 bg-[#f8faf9] rounded-2xl border border-stone-200 space-y-2.5 hover:border-[#0c432d]/40 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#0c432d] flex items-center justify-center font-bold">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">GST Invoicing (18% ITC)</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Clean B2B GST tax invoices provided with every consignment for builders, civil engineers, and developers to claim input credit.
              </p>
            </div>

            <div className="p-6 bg-[#f8faf9] rounded-2xl border border-stone-200 space-y-2.5 hover:border-[#0c432d]/40 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Yard WhatsApp Desk</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Quick quotations and truck dispatch coordination directly on WhatsApp (+91 6297201943) for urgent concrete and structural runs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contractor Testimonials */}
      <section className="py-14 bg-[#072418] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Contractor Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              What Bangalore Builders Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-200 leading-relaxed italic">
                "Jyoti Hardware is our primary supplier for our villa project in Nelamangala. 400 bags of UltraTech cement were delivered and offloaded onto our slab staging area by 8 AM. Superb reliability."
              </p>
              <div className="pt-2 border-t border-white/10">
                <div className="font-bold text-sm text-white">Venkatesh Rao</div>
                <div className="text-[11px] text-stone-400">Managing Partner, Pragathi Constructions</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-200 leading-relaxed italic">
                "Effortless WhatsApp ordering. I messaged my requirements for Bosch impact drills, Havells cables, and Astral CPVC fittings and had the GST quotation in 15 minutes. Delivered the same afternoon."
              </p>
              <div className="pt-2 border-t border-white/10">
                <div className="font-bold text-sm text-white">Suresh Chandran</div>
                <div className="text-[11px] text-stone-400">MEP Contractor, Peenya Industrial Area</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-200 leading-relaxed italic">
                "Best wholesale pricing on Asian Paints Apcolite and waterproofing coats in Bangalore North. Always genuine stock and helpful technical advice for damp basements."
              </p>
              <div className="pt-2 border-t border-white/10">
                <div className="font-bold text-sm text-white">Anand Kulkarni</div>
                <div className="text-[11px] text-stone-400">Civil Consultant, Makali Alur Road</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directions Modal */}
      <DirectionsModal
        isOpen={directionsModalOpen}
        onClose={() => setDirectionsModalOpen(false)}
      />
    </div>
  );
};
