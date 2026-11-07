import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Home,
  ShoppingBag,
  Building2,
  Send,
  MessageCircle,
  CheckCircle2,
  Phone,
  Sparkles,
  ShieldCheck,
  Truck,
  AlertCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { Product, BulkQuoteRequest } from '../types';
import { formatBulkQuoteWhatsApp, createWhatsAppLink } from '../utils/whatsapp';
import { cleanIndianPhone, validateBulkOrderForm } from '../utils/validation';

interface BulkOrderViewProps {
  onBackToShop: () => void;
  onNavigateToHome: () => void;
  preselectedProduct?: Product | null;
  onSubmitQuote: (quote: BulkQuoteRequest) => void;
  cartCount?: number;
}

const BULK_DRAFT_KEY = 'jhc_bulk_quote_draft_v1';

export const BulkOrderView: React.FC<BulkOrderViewProps> = ({
  onBackToShop,
  onNavigateToHome,
  preselectedProduct,
  onSubmitQuote,
  cartCount = 0,
}) => {
  // Load initial draft from localStorage if available
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(BULK_DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (preselectedProduct && !parsed.productName) {
          parsed.productName = `${preselectedProduct.name} (${preselectedProduct.brand})`;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load bulk quote draft', e);
    }

    return {
      customerName: '',
      phone: '',
      email: '',
      productName: preselectedProduct ? `${preselectedProduct.name} (${preselectedProduct.brand})` : '',
      quantity: preselectedProduct ? '50+ Units' : '',
      deliveryLocation: 'Makali / Bangalore Site Location',
      urgency: 'Within 2-3 Days',
      notes: '',
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<BulkQuoteRequest | null>(null);

  // Auto-save form draft so data is NEVER lost during navigation
  useEffect(() => {
    try {
      if (!submittedQuote) {
        localStorage.setItem(BULK_DRAFT_KEY, JSON.stringify(formData));
      }
    } catch (e) {}
  }, [formData, submittedQuote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateBulkOrderForm(formData);
    if (!result.isValid) {
      setFormErrors(result.errors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newQuote: BulkQuoteRequest = {
        id: `QUOTE-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        customerName: formData.customerName.trim(),
        phone: cleanIndianPhone(formData.phone),
        email: formData.email.trim() || 'Not provided',
        productName: formData.productName.trim(),
        quantity: formData.quantity.trim(),
        deliveryLocation: formData.deliveryLocation.trim() || 'Bangalore Project Site',
        notes: `[Timeline: ${formData.urgency}] ${formData.notes.trim()}`,
        status: 'Pending',
      };

      onSubmitQuote(newQuote);
      setSubmittedQuote(newQuote);
      setIsSubmitting(false);

      // Clear the draft on successful submission
      try {
        localStorage.removeItem(BULK_DRAFT_KEY);
      } catch (e) {}
    }, 450);
  };

  const handleSendToWhatsApp = () => {
    if (!submittedQuote) return;
    const text = formatBulkQuoteWhatsApp(submittedQuote);
    const link = createWhatsAppLink(text);
    window.open(link, '_blank');
  };

  const handleResetForm = () => {
    setSubmittedQuote(null);
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      productName: '',
      quantity: '',
      deliveryLocation: 'Makali / Bangalore Site Location',
      urgency: 'Within 2-3 Days',
      notes: '',
    });
    setFormErrors({});
    try {
      localStorage.removeItem(BULK_DRAFT_KEY);
    } catch (e) {}
  };

  return (
    <div className="bg-stone-100 min-h-screen py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        {/* TOP NAVIGATION BAR */}
        <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-3 sm:p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Prominent Back to Shop Button */}
            <button
              onClick={onBackToShop}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Return to shopping"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>← Back to Shop</span>
            </button>

            {/* Home Icon Button */}
            <button
              onClick={onNavigateToHome}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              title="Return to Home"
            >
              <Home className="w-4 h-4 text-emerald-800" />
              <span className="hidden xs:inline">Home</span>
            </button>
          </div>

          {/* Breadcrumb & Cart Status */}
          <div className="flex items-center gap-3 text-xs text-stone-600">
            <span className="hidden md:inline font-medium">
              Navigation: <span className="text-stone-400">Shop /</span> <strong className="text-stone-900">Bulk Order</strong>
            </span>
            {cartCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Cart safe ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
              </span>
            )}
          </div>
        </div>

        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-[#0c432d] via-[#093524] to-[#062619] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-400/10 to-transparent pointer-events-none" />
          <div className="max-w-2xl relative z-10 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Wholesale Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Bulk Order &amp; Contractor Quotations
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Supplying residential builders, civil engineers, and apartment contractors across Bengaluru with factory-direct pricing on UltraTech &amp; Birla cement, Tata Tiscon steel, Bosch power tools, Asian Paints, and Astral CPVC plumbing.
            </p>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLS: THE FORM OR SUCCESS CONFIRMATION */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              {submittedQuote ? (
                /* SUCCESS STATE */
                <div className="p-6 sm:p-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
                      Request Confirmed
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                      Quotation Request Dispatched!
                    </h2>
                    <p className="text-stone-500 text-xs sm:text-sm mt-1">
                      Reference ID: <strong className="text-stone-900">#{submittedQuote.id}</strong>
                    </p>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 text-left max-w-lg mx-auto space-y-2 text-xs">
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-stone-500">Contractor / Name:</span>
                      <strong className="text-stone-900">{submittedQuote.customerName}</strong>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-stone-500">Mobile (WhatsApp):</span>
                      <strong className="text-stone-900">+91 {submittedQuote.phone}</strong>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-stone-500">Material Required:</span>
                      <strong className="text-stone-900">{submittedQuote.productName}</strong>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-stone-500">Quantity:</span>
                      <strong className="text-stone-900">{submittedQuote.quantity}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Site Location:</span>
                      <strong className="text-stone-900">{submittedQuote.deliveryLocation}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    Our Makali Commercial Desk manager will evaluate volume discounts and call/WhatsApp you within <strong>30 minutes</strong> with delivery schedules.
                  </p>

                  {/* Primary CTA: WhatsApp */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleSendToWhatsApp}
                      className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send via WhatsApp (+91 6297201943)</span>
                    </button>

                    <button
                      onClick={handleResetForm}
                      className="w-full sm:w-auto px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Submit Another</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM STATE */
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#0c432d]" />
                      <h2 className="text-base sm:text-lg font-black text-stone-900">
                        Request Site Quotation
                      </h2>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      * Required fields
                    </span>
                  </div>

                  {/* Auto-save indicator */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-relaxed">
                      <strong>Draft auto-saved:</strong> You can safely switch back to the shop or explore other products anytime — your entered quote details will not be lost.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Contractor / Name */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Contractor / Firm / Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar (SK Builders)"
                        value={formData.customerName}
                        onChange={(e) => {
                          setFormData({ ...formData, customerName: e.target.value });
                          if (formErrors.customerName) setFormErrors({ ...formErrors, customerName: '' });
                        }}
                        className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white transition-all ${
                          formErrors.customerName
                            ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                            : 'border-stone-300 focus:border-[#0c432d]'
                        }`}
                      />
                      {formErrors.customerName && (
                        <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.customerName}</span>
                        </p>
                      )}
                    </div>

                    {/* Mobile Number with Indian 10-digit validation */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Mobile Number (WhatsApp) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={14}
                          placeholder="9845012345"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                          }}
                          className={`w-full pl-11 pr-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white transition-all ${
                            formErrors.phone
                              ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                              : 'border-stone-300 focus:border-[#0c432d]'
                          }`}
                        />
                      </div>
                      {formErrors.phone ? (
                        <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.phone}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          10-digit mobile number for immediate quote dispatch
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. ramesh@skbuilders.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                        }}
                        className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white transition-all ${
                          formErrors.email
                            ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                            : 'border-stone-300 focus:border-[#0c432d]'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Material Required */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Material Required *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UltraTech PPC Cement & 12mm TMT Rebar"
                        value={formData.productName}
                        onChange={(e) => {
                          setFormData({ ...formData, productName: e.target.value });
                          if (formErrors.productName) setFormErrors({ ...formErrors, productName: '' });
                        }}
                        className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white transition-all ${
                          formErrors.productName
                            ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                            : 'border-stone-300 focus:border-[#0c432d]'
                        }`}
                      />
                      {formErrors.productName && (
                        <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.productName}</span>
                        </p>
                      )}
                    </div>

                    {/* Estimated Quantity */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Estimated Quantity *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 350 Bags / 5 Tons / 25 Units"
                        value={formData.quantity}
                        onChange={(e) => {
                          setFormData({ ...formData, quantity: e.target.value });
                          if (formErrors.quantity) setFormErrors({ ...formErrors, quantity: '' });
                        }}
                        className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white transition-all ${
                          formErrors.quantity
                            ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                            : 'border-stone-300 focus:border-[#0c432d]'
                        }`}
                      />
                      {formErrors.quantity && (
                        <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.quantity}</span>
                        </p>
                      )}
                    </div>

                    {/* Site Location */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Site Delivery Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nelamangala / Peenya / Bangalore"
                        value={formData.deliveryLocation}
                        onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0c432d]"
                      />
                    </div>

                    {/* Urgency */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Required Delivery Timeline
                      </label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0c432d]"
                      >
                        <option value="Urgent (Today / Tomorrow)">Urgent (Today / Tomorrow)</option>
                        <option value="Within 2-3 Days">Within 2-3 Days</option>
                        <option value="Within 1 Week">Within 1 Week</option>
                        <option value="Planning / Estimation Stage">Planning / Estimation Stage</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Project Notes / Unloading Requirements (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Mention crane unloading needs, slab casting schedule, or specific grade preferences..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0c432d]"
                      />
                    </div>
                  </div>

                  {/* Form Submission Actions */}
                  <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-stone-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Direct Desk: <strong>+91 6297201943</strong></span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#0c432d] hover:bg-[#072d1d] disabled:bg-stone-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-400" />
                          <span>Submit Quotation Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COL: CONTRACTOR ADVANTAGES & DETAILS */}
          <div className="space-y-4">
            {/* Why buy bulk card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200 space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-extrabold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3>Wholesale Advantages</h3>
              </div>

              <ul className="space-y-3 text-xs text-stone-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </span>
                  <span><strong>Tiered Contractor Margins:</strong> Up to 15% discount on truckload quantities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </span>
                  <span><strong>Direct Site Delivery:</strong> 14-wheeler and flatbed crane dispatch across Bengaluru.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </span>
                  <span><strong>Official Tax Invoices:</strong> Full 18% / 28% GST input credit for registered builders.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    4
                  </span>
                  <span><strong>Authorized Manufacturer Dealer:</strong> Genuine batch test certificates for cement &amp; steel.</span>
                </li>
              </ul>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-stone-700 text-xs flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-800 shrink-0" />
                <span className="text-[11px]">Free delivery on bulk site orders above ₹15,000</span>
              </div>
            </div>

            {/* Quick Yard Info */}
            <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                Commercial Dispatch Yard
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Makali Alur Main Road, Bengaluru, Karnataka 562162
              </p>
              <div className="text-xs text-stone-300">
                Hours: Mon – Sun: 7:30 AM – 9:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION ACTIONS (Requirement 4 & 5) */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-xs">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            Finished with your quotation or need to browse more items? Return anytime.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={onNavigateToHome}
              className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4 text-stone-600" />
              <span>Back to Home</span>
            </button>

            {/* Clearly visible separate Continue Shopping button at the bottom */}
            <button
              onClick={onBackToShop}
              className="px-6 py-2.5 rounded-xl bg-[#0c432d] hover:bg-[#072d1d] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Continue Shopping &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
