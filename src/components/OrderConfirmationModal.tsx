import React from 'react';
import {
  CheckCircle2,
  Printer,
  MessageCircle,
  Truck,
  ArrowRight,
  Building,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';
import { Order } from '../types';
import { formatOrderConfirmationWhatsApp, createWhatsAppLink } from '../utils/whatsapp';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsAppReceipt = () => {
    const text = formatOrderConfirmationWhatsApp(order);
    const link = createWhatsAppLink(text);
    window.open(link, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close button */}
        <button
          onClick={onClose}
          aria-label="Close invoice"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Body (printable) */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="text-center space-y-2 pb-6 border-b border-stone-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Order Confirmed &amp; Dispatched!
            </h1>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Thank you for ordering with Jyoti Hardware &amp; Construction. Your order has been registered at our Makali Yard warehouse.
            </p>
            <div className="inline-block px-3 py-1 bg-stone-100 rounded-lg text-xs font-mono font-bold text-stone-800">
              Order ID: #{order.id}
            </div>
          </div>

          {/* Store & Customer Two-Column Invoice Header */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <div className="font-extrabold text-red-600 uppercase tracking-wider text-[11px]">
                Supplier / Store
              </div>
              <div className="font-black text-stone-900 text-sm">
                Jyoti Hardware &amp; Construction
              </div>
              <div className="text-stone-600">Makali Alur Main Road, Bangalore</div>
              <div className="text-stone-600">Karnataka - 562162</div>
              <div className="text-stone-600">Ph: +91 6297201943</div>
              <div className="text-stone-600">Email: tantijoyti45@gmail.com</div>
              <div className="text-[10px] text-stone-400 font-mono mt-1">
                GSTIN: 29AAEFJ9281M1Z4 (Auth Hardware)
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <div className="font-extrabold text-stone-500 uppercase tracking-wider text-[11px]">
                Deliver To Site
              </div>
              <div className="font-bold text-stone-900 text-sm">
                {order.customer.name}
              </div>
              {order.customer.companyName && (
                <div className="font-semibold text-stone-700">
                  {order.customer.companyName}
                </div>
              )}
              {order.customer.gstNumber && (
                <div className="font-mono text-[11px] text-stone-700">
                  GST: {order.customer.gstNumber}
                </div>
              )}
              <div className="text-stone-600">{order.customer.address}</div>
              <div className="text-stone-600">
                {order.customer.city} - {order.customer.pinCode}
              </div>
              <div className="text-stone-600">Ph: {order.customer.phone}</div>
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-stone-900 mb-2">
              Itemized Materials Receipt
            </div>
            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-stone-200">
                <thead className="bg-stone-100 font-bold text-stone-700">
                  <tr>
                    <th className="py-2 px-3">Item</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Rate</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-stone-900">{item.product.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {item.product.brand} • {item.product.category}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">
                        {item.quantity} {item.product.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-stone-600">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                        ₹{(item.quantity * item.product.price).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Tax breakdown */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-bold text-stone-900">
                ₹{order.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Promotional Discount:</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>GST (18% Input Tax Credit itemized):</span>
              <span className="font-bold text-stone-900">
                ₹{order.tax.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Site Delivery:</span>
              <span className="font-bold text-stone-900">
                {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
              <span>Grand Total Paid:</span>
              <span className="text-red-600 text-base">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 pt-1 flex justify-between">
              <span>Payment Mode: {order.paymentMethod.toUpperCase()}</span>
              <span className="font-bold text-emerald-600 uppercase">
                Status: {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 no-print">
            <button
              onClick={() => {
                onTrackOrder(order.id);
                onClose();
              }}
              className="w-full sm:flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery</span>
            </button>

            <button
              onClick={handleSendWhatsAppReceipt}
              className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Receipt</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase rounded-xl transition-colors flex items-center justify-center gap-2 print-include"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
