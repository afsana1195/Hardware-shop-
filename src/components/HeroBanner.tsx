import React, { useState, useEffect } from 'react';
import { ArrowRight, Truck, ShieldCheck, Layers, Headphones } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
  onGetQuote: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow, onGetQuote }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-rotate dots subtly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* 1. Hero Showcase Banner */}
      <section className="relative w-full bg-[#072418] overflow-hidden select-none">
        <div
          onClick={onShopNow}
          className="relative w-full cursor-pointer group"
          role="button"
          aria-label="Everything You Need to Build Better - Shop Construction Materials, Tools, Paints, Plumbing, Electrical"
        >
          <img
            src="/assets/reference/hero_banner.png"
            alt="Jyoti Hardware & Construction - Building Materials, Power Tools, Paints, Plumbing, Electrical"
            className="w-full h-auto object-cover object-center group-hover:opacity-98 transition-opacity"
          />

          {/* Interactive hotspot over Shop Now button area for keyboard/screen readers */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShopNow();
            }}
            className="absolute left-[3%] sm:left-[5%] bottom-[12%] sm:bottom-[15%] w-[16%] sm:w-[14%] h-[18%] sm:h-[16%] opacity-0 cursor-pointer"
            aria-label="Shop Now"
            tabIndex={0}
          />
        </div>
      </section>

      {/* 2. 4 Feature Trust Badges Bar (Direct from reference design) */}
      <section className="bg-white border-b border-stone-200 py-3.5 sm:py-5 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-stone-200">
            {/* Feature 1 */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 pl-0 sm:pl-2">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald-50 text-[#0c432d] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="leading-snug">
                <div className="text-xs sm:text-sm font-black text-stone-900">Fast Delivery</div>
                <div className="text-[10px] sm:text-xs text-stone-500">Across Bengaluru</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 pl-0 sm:pl-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald-50 text-[#0c432d] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="leading-snug">
                <div className="text-xs sm:text-sm font-black text-stone-900">100%</div>
                <div className="text-[10px] sm:text-xs text-stone-500">Genuine Products</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 pl-0 sm:pl-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald-50 text-[#0c432d] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="leading-snug">
                <div className="text-xs sm:text-sm font-black text-stone-900">Bulk &amp;</div>
                <div className="text-[10px] sm:text-xs text-stone-500">Contractor Pricing</div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 pl-0 sm:pl-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald-50 text-[#0c432d] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="leading-snug">
                <div className="text-xs sm:text-sm font-black text-stone-900">Expert</div>
                <div className="text-[10px] sm:text-xs text-stone-500">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
