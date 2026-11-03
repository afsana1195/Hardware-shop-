import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  FileCheck2,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
  onGetQuote: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow, onGetQuote }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-red-950 text-white">
      {/* Background industrial overlay texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      {/* Decorative red glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Action buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bangalore's Trusted Hardware &amp; Material Supplier</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
              Everything You Need <br className="hidden sm:inline" />
              to <span className="text-red-500 underline decoration-red-600/60 decoration-4 underline-offset-8">Build Better.</span>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Wholesale &amp; retail supplies of UltraTech Cement, Tata Tiscon steel, Bosch power tools, Asian Paints, Havells cables, Supreme plumbing, and site hardware with guaranteed same-day delivery across Makali, Alur, and Greater Bangalore.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <span>Shop All Materials</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onGetQuote}
                className="w-full sm:w-auto px-7 py-4 bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl border border-stone-700 hover:border-stone-500 transition-all flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Get a Bulk Quote</span>
              </button>

              <a
                href="tel:6297201943"
                className="w-full sm:w-auto px-5 py-4 bg-transparent hover:bg-stone-800/60 text-stone-300 hover:text-white font-semibold text-xs tracking-wide rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call: 6297201943</span>
              </a>
            </div>

            {/* Quick Micro Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stone-800/80 text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">100% Genuine</div>
                  <div className="text-[10px] text-stone-400">Direct Brand Stock</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Site Delivery</div>
                  <div className="text-[10px] text-stone-400">Crane &amp; Tipper Fleet</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">GST Invoicing</div>
                  <div className="text-[10px] text-stone-400">18% Input Tax Credit</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Open 7 Days</div>
                  <div className="text-[10px] text-stone-400">7:30 AM - 8:30 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Highlight Card */}
              <div className="bg-gradient-to-b from-stone-800 to-stone-900 border border-stone-700/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-stone-700/60 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                      Live Warehouse Yard
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-700 text-amber-300">
                    Makali, Bangalore
                  </span>
                </div>

                <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-stone-950">
                  <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                    alt="Jyoti Hardware Warehouse and Site Delivery"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <div>
                      <div className="text-xs font-bold text-red-400 uppercase tracking-wider">
                        Wholesale &amp; Retail Yard
                      </div>
                      <div className="text-sm font-bold text-white">
                        Full truckload &amp; partial site delivery ready
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Brand Chips */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Authorized Stockist For:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['UltraTech', 'Tata Tiscon', 'Bosch', 'Asian Paints', 'Havells', 'Supreme', 'Pidilite'].map(
                      (b) => (
                        <span
                          key={b}
                          className="px-2.5 py-1 rounded-md bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold"
                        >
                          {b}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Special Offer Pill */}
                <div className="mt-4 p-3 bg-red-600/20 border border-red-500/40 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Contractor Offer</div>
                    <div className="text-[11px] text-red-300">Flat 10% off with coupon: BUILD10</div>
                  </div>
                  <button
                    onClick={onShopNow}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
