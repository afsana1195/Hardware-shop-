import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  FileCheck2,
  PhoneCall,
  Clock,
  Sparkles,
  Star,
  CheckCircle2,
  Building,
  Quote,
  Zap,
} from 'lucide-react';
import { Product } from '../types';
import { HeroBanner } from './HeroBanner';
import { CategoryGrid } from './CategoryGrid';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, quantity?: number) => void;
  onOpenBulkQuote: () => void;
  onOpenBulkQuoteWithProduct: (p: Product) => void;
  onShopNow: () => void;
  onSelectCategory: (cat: string) => void;
  cartProductIds: Set<string>;
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
}) => {
  const [activeTrendingTab, setActiveTrendingTab] = useState('All');

  const filteredTrending = products.filter((p) => {
    if (activeTrendingTab === 'All') return p.isTrending || p.isFeatured;
    return p.category.toLowerCase().includes(activeTrendingTab.toLowerCase());
  }).slice(0, 8);

  const bestSellers = products.filter((p) => p.badge === 'Best Seller' || p.rating >= 4.9).slice(0, 4);

  return (
    <div className="space-y-0">
      {/* 1. Hero Banner */}
      <HeroBanner onShopNow={onShopNow} onGetQuote={onOpenBulkQuote} />

      {/* 2. Featured Categories Grid */}
      <CategoryGrid onSelectCategory={onSelectCategory} />

      {/* 3. Trending Products & Best Sellers Section */}
      <section className="py-14 bg-stone-100 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Site Contractor Favorites</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Trending Materials &amp; Power Tools
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Verified high-rotation stock available for immediate loading at Makali Yard.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {['All', 'Cement', 'Tools', 'Paints', 'Plumbing', 'Electrical'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTrendingTab(tab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                    activeTrendingTab === tab
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Column Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredTrending.map((p) => (
              <div key={p.id} className="animate-fade-in h-full">
                <ProductCard
                  product={p}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                  onOpenBulkQuoteWithProduct={onOpenBulkQuoteWithProduct}
                  isInCart={cartProductIds.has(p.id)}
                />
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={onShopNow}
              className="px-8 py-3.5 bg-stone-900 hover:bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2 group"
            >
              <span>Explore Full 50+ Product Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Special Offers & Discounts Banner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            {/* Background texture */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  Bangalore Project Discount Codes
                </span>
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Get Extra 10% OFF on Structural Materials &amp; Hardware
                </h3>
                <p className="text-red-100 text-xs sm:text-sm max-w-xl">
                  Use coupon code <strong className="bg-white/20 px-2 py-0.5 rounded font-mono text-white text-sm">BUILD10</strong> at checkout on orders above ₹2,000, or <strong className="bg-white/20 px-2 py-0.5 rounded font-mono text-white text-sm">JYOTI500</strong> for flat ₹500 off above ₹5,000.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <button
                  onClick={onShopNow}
                  className="px-6 py-3.5 bg-white text-red-700 hover:bg-stone-100 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all text-center active:scale-95"
                >
                  Shop Now with Coupon
                </button>
                <button
                  onClick={onOpenBulkQuote}
                  className="px-6 py-3.5 bg-stone-900/80 hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-all text-center"
                >
                  Request Wholesale Slab
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Spotlight */}
      <section className="py-12 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-red-600">
                Top Quality Picks
              </div>
              <h2 className="text-2xl font-black text-stone-900">
                High-Demand Bangalore Best Sellers
              </h2>
            </div>
            <button
              onClick={onShopNow}
              className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((p) => (
              <div key={p.id} className="animate-fade-in h-full">
                <ProductCard
                  product={p}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                  onOpenBulkQuoteWithProduct={onOpenBulkQuoteWithProduct}
                  isInCart={cartProductIds.has(p.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Why Bangalore Contractors Trust Us
            </span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">
              The Jyoti Hardware Advantage
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm">
              We eliminate middleman margins and construction delays with direct mill partnerships and our own Bangalore logistics fleet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 hover:border-red-600 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Direct Mill Authorized</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Authorized stockist for UltraTech, Tata Steel, Bosch, and Asian Paints. Zero counterfeit guarantee with official manufacturer test sheets.
              </p>
            </div>

            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 hover:border-red-600 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Same-Day Site Dispatch</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dedicated tippers, crane trucks, and freight carriers dispatching directly to Makali, Alur, Nelamangala, and across Greater Bangalore.
              </p>
            </div>

            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 hover:border-red-600 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">GST Invoicing (18% ITC)</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                B2B invoices with clear GST breakdown so civil engineers, builders, and corporate developers can claim full input tax credits.
              </p>
            </div>

            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 hover:border-red-600 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Dedicated WhatsApp Desk</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fast responses for urgent slab-casting cement runs, spare drill bits, or site delivery coordination directly on +91 6297201943.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Contractor Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              What Bangalore Builders Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-800/90 border border-stone-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic">
                "Jyoti Hardware is our primary supplier for our villa project in Nelamangala. 400 bags of UltraTech cement were delivered and offloaded right onto our slab staging area by 8 AM. Superb reliability."
              </p>
              <div className="pt-2 border-t border-stone-700/60">
                <div className="font-bold text-sm text-white">Venkatesh Rao</div>
                <div className="text-[11px] text-stone-400">Managing Partner, Pragathi Constructions</div>
              </div>
            </div>

            <div className="bg-stone-800/90 border border-stone-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic">
                "Their WhatsApp ordering is effortless. I sent my list of Bosch angle grinders, Havells 2.5mm cables, and CPVC fittings, and had the GST quotation in 15 minutes. Delivered the same afternoon."
              </p>
              <div className="pt-2 border-t border-stone-700/60">
                <div className="font-bold text-sm text-white">Suresh Chandran</div>
                <div className="text-[11px] text-stone-400">MEP Contractor, Peenya Industrial Area</div>
              </div>
            </div>

            <div className="bg-stone-800/90 border border-stone-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic">
                "Best wholesale pricing on Asian Paints Apex Ultima in Bangalore North. Also very supportive with technical advice on waterproofing coats for wet basements."
              </p>
              <div className="pt-2 border-t border-stone-700/60">
                <div className="font-bold text-sm text-white">Anand Kulkarni</div>
                <div className="text-[11px] text-stone-400">Civil Engineer &amp; Interior Consultant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Quick Contact CTA Strip */}
      <section className="py-12 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-black tracking-tight">
              Ready to Order Materials for Your Site?
            </h3>
            <p className="text-red-100 text-xs sm:text-sm mt-1">
              Visit our Makali Yard on Alur Main Road, Bangalore or order online for guaranteed prompt delivery.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:6297201943"
              className="px-6 py-3.5 bg-stone-950 hover:bg-stone-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-red-500" />
              <span>Call: 6297201943</span>
            </a>

            <button
              onClick={onOpenBulkQuote}
              className="px-6 py-3.5 bg-white hover:bg-stone-100 text-red-700 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors"
            >
              Get Bulk Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
