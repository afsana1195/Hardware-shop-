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
    <footer className="bg-[#072418] text-stone-300 pt-14 pb-10 border-t-4 border-[#0c432d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Feature Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Bangalore Site Delivery</div>
              <div className="text-xs text-stone-400">Free on orders above ₹15,000</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">100% Genuine Materials</div>
              <div className="text-xs text-stone-400">Direct factory authorized stockist</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Razorpay &amp; Site COD</div>
              <div className="text-xs text-stone-400">UPI, QR, Cards &amp; Pay on Delivery</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">18% GST Invoicing</div>
              <div className="text-xs text-stone-400">Full input tax credit eligibility</div>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand & Address */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/assets/reference/logo.png"
                alt="Jyoti Hardware & Construction"
                className="h-10 w-auto bg-white p-1 rounded-md"
              />
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Wholesale &amp; retail supplier for UltraTech Cement, Tata Tiscon steel rebars, Bosch power tools, Asian Paints, Havells cables, and Astral plumbing lines in Bangalore.
            </p>

            <div className="space-y-2 text-xs text-stone-300 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Makali alur maine road, Pin code 562162, Bangalore, Karnataka.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:6297201943" className="hover:text-white transition-colors font-bold">
                  +91 6297201943
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <a href="mailto:tantijoyti45@gmail.com" className="hover:text-white transition-colors">
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
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 border-b border-white/10 pb-2">
              Product Categories
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
                    className="text-stone-300 hover:text-amber-300 transition-colors text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'shop', label: 'Shop Catalog' },
                { id: 'track', label: 'Track Site Order' },
                { id: 'about', label: 'About Makali Yard' },
                { id: 'contact', label: 'Contact & Location' },
                { id: 'faq', label: 'Contractor FAQ' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setCurrentTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenBulkQuote}
                  className="text-amber-300 font-bold hover:underline cursor-pointer"
                >
                  Request Bulk Quote
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-stone-400 hover:text-stone-200 cursor-pointer"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contractor Rate Alerts & WhatsApp Direct */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 border-b border-white/10 pb-2">
              Rate Alerts
            </h4>
            <p className="text-xs text-stone-300">
              Subscribe for weekly cement price updates and steel wholesale alerts in Bangalore.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Thank you! Subscribed to Bangalore hardware alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Subscribe Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2">
              <a
                href="https://wa.me/916297201943?text=Hello%20Jyoti%20Hardware"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +91 6297201943</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Partners */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            &copy; {new Date().getFullYear()} Jyoti Hardware &amp; Construction. All rights reserved. Makali Alur Main Road, Bangalore 562162.
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[11px] font-bold text-stone-400">Payment Modes:</span>
            {['Razorpay', 'UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Visa', 'Mastercard', 'RuPay', 'Site COD'].map(
              (p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] font-semibold text-stone-200"
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
