import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Banknote,
} from 'lucide-react';
import { CartItem, CustomerDetails, DeliveryMethod, PaymentMethod, Order } from '../types';
import { calculateOrderSummary } from '../utils/cartCalculations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  couponCode: string;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (m: DeliveryMethod) => void;
  onInitiatePayment: (orderDraft: {
    customer: CustomerDetails;
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;
    subtotal: number;
    discount: number;
    tax: number;
    shippingFee: number;
    total: number;
    couponCode: string;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  couponCode,
  deliveryMethod,
  setDeliveryMethod,
  onInitiatePayment,
}) => {
  if (!isOpen) return null;

  const summary = calculateOrderSummary(items, couponCode, deliveryMethod);

  const [formData, setFormData] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '562162',
    deliveryNotes: '',
    isB2B: false,
    companyName: '',
    gstNumber: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay_upi');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide full name or contractor name';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Valid 10-digit mobile number required for dispatch updates';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email required for GST tax receipt';
    }
    if (!formData.address.trim()) {
      errs.address = 'Detailed site delivery address required';
    }
    if (!formData.pinCode.trim() || formData.pinCode.length < 6) {
      errs.pinCode = '6-digit pin code required';
    }
    if (formData.isB2B) {
      if (!formData.companyName?.trim()) errs.companyName = 'Company name required for B2B invoice';
      if (!formData.gstNumber?.trim() || formData.gstNumber.length < 15) {
        errs.gstNumber = 'Valid 15-character GSTIN required (e.g. 29ABCDE1234F1Z5)';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onInitiatePayment({
      customer: formData,
      deliveryMethod,
      paymentMethod,
      subtotal: summary.subtotal,
      discount: summary.discount,
      tax: summary.tax,
      shippingFee: summary.shippingFee,
      total: summary.total,
      couponCode,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-stone-900 text-white px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="text-base font-black tracking-tight">
                Secure Hardware Checkout
              </h2>
              <p className="text-[11px] text-stone-400">
                Jyoti Hardware &amp; Construction • Makali Alur Main Rd, Bangalore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Order Summary Strip */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Order Total ({items.length} items)
              </div>
              <div className="text-2xl font-black text-stone-900">
                ₹{summary.total.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-xs text-stone-500 space-y-0.5 text-right">
              <div>Subtotal: ₹{summary.subtotal.toLocaleString('en-IN')}</div>
              {summary.discount > 0 && (
                <div className="text-emerald-600 font-bold">
                  Discount: -₹{summary.discount.toLocaleString('en-IN')}
                </div>
              )}
              <div>GST (18%): ₹{summary.tax.toLocaleString('en-IN')}</div>
              <div>Shipping: {summary.shippingFee === 0 ? 'FREE' : `₹${summary.shippingFee}`}</div>
            </div>
          </div>

          {/* Section 1: Customer & Site Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <span>Customer &amp; Site Delivery Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name / Contractor Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 bg-stone-50 border rounded-lg text-xs font-semibold focus:outline-none focus:bg-white ${
                    errors.name ? 'border-red-500' : 'border-stone-300 focus:border-red-600'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mobile Number (for WhatsApp &amp; Driver updates) *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9845012345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2 bg-stone-50 border rounded-lg text-xs font-semibold focus:outline-none focus:bg-white ${
                    errors.phone ? 'border-red-500' : 'border-stone-300 focus:border-red-600'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address (for GST Tax Invoice &amp; Tracking) *
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh.build@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 bg-stone-50 border rounded-lg text-xs font-semibold focus:outline-none focus:bg-white ${
                    errors.email ? 'border-red-500' : 'border-stone-300 focus:border-red-600'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Site Delivery Address / House / Plot # *
                </label>
                <textarea
                  rows={2}
                  placeholder="Plot #, Street, Area name (e.g. Plot 14, Alur Village Main Rd, near Nelamangala)"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-3 py-2 bg-stone-50 border rounded-lg text-xs font-semibold focus:outline-none focus:bg-white ${
                    errors.address ? 'border-red-500' : 'border-stone-300 focus:border-red-600'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near HP Petrol Bunk / Behind School"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className={`w-full px-3 py-2 bg-stone-50 border rounded-lg text-xs font-semibold focus:outline-none focus:bg-white ${
                      errors.pinCode ? 'border-red-500' : 'border-stone-300 focus:border-red-600'
                    }`}
                  />
                  {errors.pinCode && <p className="text-[11px] text-red-600 mt-1">{errors.pinCode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Optional B2B GST Billing Toggle */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800 select-none">
              <input
                type="checkbox"
                checked={formData.isB2B}
                onChange={(e) => setFormData({ ...formData, isB2B: e.target.checked })}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4 border-stone-300"
              />
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-red-600" />
                <span>I need a GST Tax Invoice (18% Input Tax Credit claim)</span>
              </span>
            </label>

            {formData.isB2B && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Registered Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pragathi Constructions Pvt Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                  />
                  {errors.companyName && (
                    <p className="text-[10px] text-red-600 mt-0.5">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    GSTIN Number (15 Characters) *
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="29ABCDE1234F1Z5"
                    value={formData.gstNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold uppercase"
                  />
                  {errors.gstNumber && (
                    <p className="text-[10px] text-red-600 mt-0.5">{errors.gstNumber}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Delivery Method */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              <span>Delivery Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setDeliveryMethod('standard')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryMethod === 'standard'
                    ? 'border-red-600 bg-red-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-xs text-stone-900">Standard Delivery</div>
                  <span className="text-xs font-black text-red-600">
                    {summary.subtotal >= 15000 ? 'FREE' : '₹450'}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500">Same/next day direct site truck drop</div>
              </div>

              <div
                onClick={() => setDeliveryMethod('express')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryMethod === 'express'
                    ? 'border-red-600 bg-red-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-xs text-stone-900">Express Crane Truck</div>
                  <span className="text-xs font-black text-red-600">₹850</span>
                </div>
                <div className="text-[11px] text-stone-500">Hydraulic unloading within 4 hours</div>
              </div>

              <div
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'border-red-600 bg-red-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-xs text-stone-900">Self Pickup</div>
                  <span className="text-xs font-black text-emerald-600">FREE</span>
                </div>
                <div className="text-[11px] text-stone-500">Pick from Makali Yard warehouse</div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method (Razorpay & COD) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                3
              </span>
              <span>Payment Gateway &amp; Terms</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Razorpay Option */}
              <div
                onClick={() => setPaymentMethod('razorpay_upi')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod.startsWith('razorpay')
                    ? 'border-sky-600 bg-sky-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-sky-600" />
                    <span className="font-bold text-xs text-stone-900">
                      Razorpay Gateway
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-black rounded uppercase">
                    UPI / Cards / Netbanking
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Instant verification with GPay, PhonePe, Paytm, QR code, or Debit/Credit Cards.
                </p>
              </div>

              {/* COD Option */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-xs text-stone-900">
                      Pay on Site Delivery
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded uppercase">
                    COD / Site Check
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Inspect materials on site in Bangalore and pay via cash or UPI to the truck driver.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500 text-center sm:text-left">
              🔒 256-bit encrypted checkout. Your contact data is strictly used for dispatch.
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Place Order (₹{summary.total.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
