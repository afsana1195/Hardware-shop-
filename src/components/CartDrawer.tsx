import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Truck,
  Tag,
  MessageCircle,
  AlertCircle,
  Check,
} from 'lucide-react';
import { CartItem, DeliveryMethod } from '../types';
import {
  calculateOrderSummary,
  calculateItemTotal,
  FREE_SHIPPING_THRESHOLD,
} from '../utils/cartCalculations';
import { formatCartForWhatsApp, createWhatsAppLink } from '../utils/whatsapp';
import { handleImageError } from '../utils/fallbackImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  couponCode,
  setCouponCode,
  deliveryMethod,
  setDeliveryMethod,
}) => {
  if (!isOpen) return null;

  const [inputCoupon, setInputCoupon] = useState(couponCode);
  const [couponError, setCouponError] = useState('');

  const summary = calculateOrderSummary(items, couponCode, deliveryMethod);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) {
      setCouponCode('');
      return;
    }
    const testSummary = calculateOrderSummary(items, inputCoupon, deliveryMethod);
    if (!testSummary.isCouponValid) {
      setCouponError(testSummary.couponMessage || 'Invalid coupon code');
    } else {
      setCouponCode(inputCoupon.trim().toUpperCase());
      setCouponError('');
    }
  };

  const handleWhatsAppOrder = () => {
    const text = formatCartForWhatsApp(items, summary.total);
    const link = createWhatsAppLink(text);
    window.open(link, '_blank');
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round((summary.subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-black text-stone-900 tracking-tight">
              Hardware Cart ({items.length})
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] font-bold text-stone-400 hover:text-red-600 uppercase"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Meter Banner */}
        <div className="px-5 py-3 bg-red-50/70 border-b border-red-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1.5 text-stone-800">
              <Truck className="w-4 h-4 text-red-600" />
              {summary.amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-red-600">₹{summary.amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> for FREE Site Delivery
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> You unlocked FREE Bangalore Site Delivery!
                </span>
              )}
            </span>
            <span className="text-[11px] font-bold text-stone-500">
              ₹15,000 threshold
            </span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-red-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-stone-100 space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-stone-800">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Add cement, power tools, paints, pipes or hardware materials from our catalog.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemTotal = calculateItemTotal(item);
              return (
                <div key={item.product.id} className="pt-3 flex gap-3 items-start">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    loading="lazy"
                    onError={handleImageError}
                    className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-red-600 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-red-600 font-semibold mb-2">
                      {item.product.brand} • ₹{item.product.price.toLocaleString('en-IN')}/{item.product.unit}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-stone-900">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-stone-200 bg-stone-50 space-y-3">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Promo Code (BUILD10, JYOTI500)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-red-600 uppercase"
                />
                <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Apply
              </button>
            </form>

            {couponError && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>{couponError}</span>
              </p>
            )}

            {summary.isCouponValid && (
              <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded flex items-center justify-between">
                <span>{summary.couponMessage}</span>
                <button
                  type="button"
                  onClick={() => {
                    setCouponCode('');
                    setInputCoupon('');
                  }}
                  className="text-stone-500 hover:text-red-600 font-bold text-xs"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Delivery Method Selector */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold text-center">
              <button
                type="button"
                onClick={() => setDeliveryMethod('standard')}
                className={`p-1.5 rounded border transition-colors ${
                  deliveryMethod === 'standard'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-stone-200 bg-white text-stone-600'
                }`}
              >
                <div>Standard</div>
                <div className="text-[10px] font-normal">
                  {summary.subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : '₹450'}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod('express')}
                className={`p-1.5 rounded border transition-colors ${
                  deliveryMethod === 'express'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-stone-200 bg-white text-stone-600'
                }`}
              >
                <div>Express Crane</div>
                <div className="text-[10px] font-normal">₹850</div>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-1.5 rounded border transition-colors ${
                  deliveryMethod === 'pickup'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-stone-200 bg-white text-stone-600'
                }`}
              >
                <div>Makali Yard</div>
                <div className="text-[10px] font-normal">Free Pickup</div>
              </button>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs text-stone-600 pt-1 border-t border-stone-200/80">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-stone-900">
                  ₹{summary.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{summary.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (18% input credit)</span>
                <span className="font-semibold text-stone-900">
                  ₹{summary.tax.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Site Shipping</span>
                <span className="font-semibold text-stone-900">
                  {summary.shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${summary.shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="text-red-600 text-base">
                  ₹{summary.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* CTAs: WhatsApp & Checkout */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant Order via WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
