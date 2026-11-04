import React, { useState } from 'react';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { CATEGORIES_DATA } from '../data/initialProducts';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  onOpenBulkQuote: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentTab,
  onOpenBulkQuote,
  onOpenAdmin,
  onSelectCategory,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Bangalore Site Delivery</div>
              <div className="text-xs text-stone-400">Free on orders above ₹15,000</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-white">100% Genuine Materials</div>
              <div className="text-xs text-stone-400">Direct factory authorized dealer</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Razorpay &amp; Site COD</div>
              <div className="text-xs text-stone-400">UPI, QR, Cards &amp; Pay on Delivery</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-white">18% GST Invoicing</div>
              <div className="text-xs text-stone-400">Full input tax credit eligibility</div>
            </div>
          </div>
        </div>

        {/* 4 Columns: Brand, Categories, Quick Links, Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white font-black shadow-md">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight text-white">
                  JYOTI <span className="text-red-500">HARDWARE</span>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                  &amp; Construction • Bangalore
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Your one-stop destination for UltraTech Cement, Tata Tiscon steel rebars, Bosch power tools, Asian Paints, Havells cables, Supreme plumbing lines, and industrial safety equipment.
            </p>

            <div className="space-y-2 text-xs text-stone-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Makali alur maine road, Pin code 562162, Bangalore, Karnataka.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:6297201943" className="hover:text-white transition-colors">
                  +91 6297201943
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:tantijoyti45@gmail.com" className="hover:text-white transition-colors font-mono">
                  tantijoyti45@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-stone-400">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon – Sat: 7:30 AM – 8:30 PM | Sun: 8:00 AM – 2:00 PM</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES_DATA.map((cat) => (
                <li key={cat.name}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.name);
                      setCurrentTab('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-stone-400 hover:text-red-400 transition-colors text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'shop', label: 'Shop Catalog' },
                { id: 'categories', label: 'All Categories' },
                { id: 'track', label: 'Track Site Order' },
                { id: 'about', label: 'About Our Yard' },
                { id: 'contact', label: 'Contact & Location' },
                { id: 'faq', label: 'Customer FAQ' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setCurrentTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenBulkQuote}
                  className="text-red-400 font-bold hover:underline"
                >
                  Request Bulk Quote
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-stone-500 hover:text-stone-300"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contractor Newsletter & WhatsApp */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              Contractor Updates
            </h4>
            <p className="text-xs text-stone-400">
              Subscribe for weekly cement price indices, steel rate alerts, and contractor discounts.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! You're subscribed to Bangalore hardware alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-red-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe for Rate Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2">
              <a
                href="https://wa.me/916297201943?text=Hello%20Jyoti%20Hardware"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +91 6297201943</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            &copy; {new Date().getFullYear()} Jyoti Hardware &amp; Construction. All rights reserved. Makali Alur Main Road, Bangalore 562162.
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[11px] font-bold text-stone-400">Payment Partners:</span>
            {['Razorpay', 'UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Visa', 'Mastercard', 'RuPay', 'COD'].map(
              (p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] font-semibold text-stone-300"
                >
                  {p}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
