import React, { useState } from 'react';
import { MessageCircle, Phone, X, Send, Sparkles, ShoppingBag } from 'lucide-react';
import { DEFAULT_WHATSAPP_PHONE, STORE_NAME } from '../utils/whatsapp';

interface WhatsAppFloatingButtonProps {
  onOpenBulkQuote: () => void;
  cartCount: number;
  openCart: () => void;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  onOpenBulkQuote,
  cartCount,
  openCart,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const startWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end pointer-events-none"
    >
      {/* Quick Menu Popover */}
      {isOpen && (
        <div className="pointer-events-auto mb-2.5 w-[calc(100vw-1.5rem)] max-w-xs sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-emerald-600 text-white p-3.5 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-xs uppercase tracking-wider truncate">
                  {STORE_NAME}
                </div>
                <div className="text-[10px] sm:text-[11px] text-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse shrink-0" />
                  <span className="truncate">Online at Makali Yard, Bangalore</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close WhatsApp Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 sm:p-4 space-y-2 text-xs">
            <p className="text-stone-600 text-[11px] mb-2 leading-relaxed">
              Connect directly with our Bangalore sales &amp; dispatch team (+91 6297201943):
            </p>

            <button
              onClick={() =>
                startWhatsApp(
                  'Hello Jyoti Hardware, I would like to inquire about cement and site materials delivery to Bangalore.'
                )
              }
              className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors flex items-center justify-between font-semibold text-stone-800 cursor-pointer"
            >
              <span className="truncate pr-2">💬 General Material Inquiry</span>
              <Send className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBulkQuote();
              }}
              className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors flex items-center justify-between font-semibold text-stone-800 cursor-pointer"
            >
              <span className="truncate pr-2">🏗️ Request Bulk Project Quote</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            </button>

            {cartCount > 0 && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openCart();
                }}
                className="w-full text-left p-2.5 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-between font-bold text-red-700 cursor-pointer"
              >
                <span className="truncate pr-2">🛒 View Cart &amp; Order ({cartCount})</span>
                <ShoppingBag className="w-3.5 h-3.5 text-red-600 shrink-0" />
              </button>
            )}

            <a
              href="tel:6297201943"
              className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-between font-semibold text-stone-700 block cursor-pointer"
            >
              <span className="truncate pr-2">📞 Direct Call (+91 6297201943)</span>
              <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button - Compact on mobile, non-intrusive */}
      <div className="pointer-events-auto flex items-center gap-1.5">
        {!isMinimized && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open WhatsApp Support"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative group cursor-pointer focus:outline-none"
          >
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 border-2 border-white" />
            </span>
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Optional Minimized Tab */}
        {isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Show WhatsApp Support"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        )}
      </div>
    </aside>
  );
};
