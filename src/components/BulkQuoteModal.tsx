import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  Building2,
  Send,
  MessageCircle,
  CheckCircle2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { Product, BulkQuoteRequest } from '../types';
import { formatBulkQuoteWhatsApp, createWhatsAppLink } from '../utils/whatsapp';

interface BulkQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: Product | null;
  onSubmitQuote: (quote: BulkQuoteRequest) => void;
  onNavigateToShop?: () => void;
}

const MODAL_DRAFT_KEY = 'jhc_bulk_quote_draft_v1';

export const BulkQuoteModal: React.FC<BulkQuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedProduct,
  onSubmitQuote,
  onNavigateToShop,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(MODAL_DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (preselectedProduct) {
          parsed.productName = `${preselectedProduct.name} (${preselectedProduct.brand})`;
        }
        return parsed;
      }
    } catch (e) {}

    return {
      customerName: '',
      phone: '',
      email: '',
      productName: preselectedProduct ? `${preselectedProduct.name} (${preselectedProduct.brand})` : '',
      quantity: preselectedProduct ? '50+ Units' : '',
      deliveryLocation: 'Makali / Bangalore Project Site',
      notes: '',
    };
  });

  const [phoneError, setPhoneError] = useState('');
  const [submittedQuote, setSubmittedQuote] = useState<BulkQuoteRequest | null>(null);

  // Auto-save draft
  React.useEffect(() => {
    try {
      if (!submittedQuote) {
        localStorage.setItem(MODAL_DRAFT_KEY, JSON.stringify(formData));
      }
    } catch (e) {}
  }, [formData, submittedQuote]);

  const cleanPhone = (val: string) => {
    return val.replace(/\D/g, '').replace(/^91/, '').slice(-10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.productName) return;

    const digitsOnly = cleanPhone(formData.phone);
    if (digitsOnly.length !== 10 || !/^[6-9]\d{9}$/.test(digitsOnly)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).');
      return;
    }

    const newQuote: BulkQuoteRequest = {
      id: `QUOTE-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName: formData.customerName.trim(),
      phone: digitsOnly,
      email: formData.email.trim() || 'Not provided',
      productName: formData.productName.trim(),
      quantity: formData.quantity.trim(),
      deliveryLocation: formData.deliveryLocation.trim(),
      notes: formData.notes.trim(),
      status: 'Pending',
    };

    onSubmitQuote(newQuote);
    setSubmittedQuote(newQuote);
    try {
      localStorage.removeItem(MODAL_DRAFT_KEY);
    } catch (e) {}
  };

  const handleSendToWhatsApp = () => {
    if (!submittedQuote) return;
    const text = formatBulkQuoteWhatsApp(submittedQuote);
    const link = createWhatsAppLink(text);
    window.open(link, '_blank');
  };

  const handleBackToShop = () => {
    onClose();
    if (onNavigateToShop) onNavigateToShop();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Back to Shop option */}
        <div className="bg-gradient-to-r from-stone-900 via-[#0c432d] to-stone-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight">
                Contractor Bulk Quote Request
              </h2>
              <p className="text-[11px] text-stone-300">
                Direct wholesale site rates &amp; credit terms from Shakthi Hardware Store
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToShop}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
              title="Return to shopping"
            >
              ← Back to Shop
            </button>
            <button
              onClick={onClose}
              aria-label="Close quote modal"
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {submittedQuote ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-stone-900">
              Quotation Request Received!
            </h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Reference #{submittedQuote.id} has been dispatched to our Makali commercial sales desk. Our team will contact you within 30 minutes with volume pricing.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleSendToWhatsApp}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp (+91 6297201943)</span>
              </button>

              <button
                onClick={handleBackToShop}
                className="w-full sm:w-auto px-6 py-3 bg-[#0c432d] hover:bg-[#072d1d] text-white font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
              >
                Continue Shopping &rarr;
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4">
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Ordering 100+ cement bags, tons of Tata Tiscon steel, or complete apartment plumbing fittings? Get special contractor margins. Draft is safely preserved.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Contractor / Firm Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar (SK Builders)"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0c432d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={14}
                  placeholder="e.g. 9845012345"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (phoneError) setPhoneError('');
                  }}
                  className={`w-full px-3 py-2 bg-stone-50 border rounded-lg text-xs font-semibold focus:outline-none focus:bg-white ${
                    phoneError ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-[#0c432d]'
                  }`}
                />
                {phoneError && (
                  <p className="text-[10px] text-red-600 font-bold mt-1">{phoneError}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@skbuilders.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0c432d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Material Required *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraTech PPC Cement &amp; 12mm TMT"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0c432d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Estimated Quantity *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 350 Bags / 5 Tons / 40 Buckets"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0c432d]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Site Delivery Location (in Bangalore / Karnataka)
                </label>
                <input
                  type="text"
                  value={formData.deliveryLocation}
                  onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0c432d]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Project Notes / Expected Delivery Date
                </label>
                <textarea
                  rows={2}
                  placeholder="Any specific brands, crane unloading needs, or slab casting schedule..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0c432d]"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBackToShop}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Continue Shopping &rarr;
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0c432d] hover:bg-[#072d1d] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Submit Quotation Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
