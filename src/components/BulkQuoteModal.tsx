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
}

export const BulkQuoteModal: React.FC<BulkQuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedProduct,
  onSubmitQuote,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    productName: preselectedProduct ? `${preselectedProduct.name} (${preselectedProduct.brand})` : '',
    quantity: preselectedProduct ? '50+ Units' : '',
    deliveryLocation: 'Bangalore / Nearby Project Site',
    notes: '',
  });

  const [submittedQuote, setSubmittedQuote] = useState<BulkQuoteRequest | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.productName) return;

    const newQuote: BulkQuoteRequest = {
      id: `QUOTE-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email || 'Not provided',
      productName: formData.productName,
      quantity: formData.quantity,
      deliveryLocation: formData.deliveryLocation,
      notes: formData.notes,
      status: 'Pending',
    };

    onSubmitQuote(newQuote);
    setSubmittedQuote(newQuote);
  };

  const handleSendToWhatsApp = () => {
    if (!submittedQuote) return;
    const text = formatBulkQuoteWhatsApp(submittedQuote);
    const link = createWhatsAppLink(text);
    window.open(link, '_blank');
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
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-red-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="text-base font-black tracking-tight">
                Contractor Bulk Quote Request
              </h2>
              <p className="text-[11px] text-stone-300">
                Direct wholesale site rates &amp; credit terms from Jyoti Hardware
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close quote modal"
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp to +91 6297201943</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <div className="p-3 bg-red-50/80 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                Ordering 100+ cement bags, tons of Tata Tiscon steel, or complete apartment plumbing fittings? Get special contractor margins.
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
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9845012345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-red-600"
                />
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
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-red-600"
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
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-red-600"
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
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-red-600"
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
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-red-600"
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
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-red-600"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">
                Direct Desk: <strong>+91 6297201943</strong>
              </span>

              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Quotation Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
