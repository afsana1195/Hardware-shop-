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

  const startWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Quick Menu Popover */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider">
                  {STORE_NAME}
                </div>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Online at Makali Yard</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-2 text-xs">
            <p className="text-stone-600 text-[11px] mb-3">
              Connect directly with our Bangalore sales &amp; dispatch team on WhatsApp (+91 6297201943):
            </p>

            <button
              onClick={() =>
                startWhatsApp(
                  'Hello Jyoti Hardware, I would like to inquire about cement and site materials delivery to Bangalore.'
                )
              }
              className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors flex items-center justify-between font-semibold text-stone-800"
            >
              <span>💬 General Material Inquiry</span>
              <Send className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBulkQuote();
              }}
              className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors flex items-center justify-between font-semibold text-stone-800"
            >
              <span>🏗️ Request Bulk Project Quote</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </button>

            {cartCount > 0 && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openCart();
                }}
                className="w-full text-left p-2.5 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-between font-bold text-red-700"
              >
                <span>🛒 View Cart &amp; Send Order ({cartCount})</span>
                <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
              </button>
            )}

            <a
              href="tel:6297201943"
              className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-between font-semibold text-stone-700"
            >
              <span>📞 Direct Call (+91 6297201943)</span>
              <Phone className="w-3.5 h-3.5 text-stone-500" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open WhatsApp Support"
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative group"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
        </span>
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
};
