import React from 'react';
import {
  Building2,
  ShieldCheck,
  Truck,
  Award,
  Users,
  CheckCircle,
  PhoneCall,
  MapPin,
  Clock,
} from 'lucide-react';

interface AboutViewProps {
  onShopNow: () => void;
  onOpenBulkQuote: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onShopNow, onOpenBulkQuote }) => {
  return (
    <div className="bg-stone-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-red-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
              About Jyoti Hardware &amp; Construction
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Building Bangalore's Foundations With Trust &amp; Integrity Since 2012.
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Located on Makali Alur Main Road, Bangalore (Pin 562162), Jyoti Hardware &amp; Construction is a premier authorized distributor of structural cement, Tata Tiscon steel, Bosch power tools, Asian Paints, Havells cables, and industrial plumbing supplies.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={onShopNow}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Explore Materials Catalog
              </button>
              <button
                onClick={onOpenBulkQuote}
                className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-stone-700 transition-colors"
              >
                Request Contractor Terms
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-stone-900">100% Genuine Mill Brands</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We source directly from UltraTech, Tata Steel, Bosch, and Asian Paints manufacturing plants, guaranteeing zero counterfeit materials, genuine test certificates, and full manufacturer warranties.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-stone-900">Dedicated Fleet Dispatch</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our Makali yard operates hydraulic tippers, crane offloading trucks, and medium cargo vehicles ensuring same-day site drops to construction sites across Bangalore North, Tumkur Road, and Nelamangala.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-stone-900">GST Input Tax Credit</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We provide formal 18% / 28% GST invoices for builders, civil contractors, and homeowners, enabling smooth project auditing and maximum tax efficiency.
            </p>
          </div>
        </div>

        {/* Location & Contact Highlight */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-red-600">
                Yard &amp; Experience Center
              </div>
              <h2 className="text-2xl font-black text-stone-900">
                Visit Us in Makali, Bangalore
              </h2>
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Working Address:</strong> Makali alur maine road, Pin code 562162, Bangalore, Karnataka.
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Direct Contact:</strong> +91 6297201943
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    <strong>Operating Hours:</strong> Monday – Saturday: 7:30 AM – 8:30 PM | Sunday: 8:00 AM – 2:00 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden aspect-video bg-stone-100 border border-stone-200 relative">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80"
                alt="Jyoti Hardware Makali Store"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center p-4 text-center">
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-xs text-xs">
                  <div className="font-black text-stone-900">Jyoti Hardware &amp; Construction</div>
                  <div className="text-stone-500 mt-0.5">Makali Alur Main Rd, 562162</div>
                  <a
                    href="https://maps.google.com/?q=Makali+Alur+Main+Road+Bangalore+562162"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 font-bold text-red-600 hover:underline"
                  >
                    Open in Google Maps &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
