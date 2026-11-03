import React, { useState } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Package,
  AlertCircle,
  Building,
} from 'lucide-react';
import { Order } from '../types';

interface TrackOrderViewProps {
  orders: Order[];
  initialOrderId?: string;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({
  orders,
  initialOrderId = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialOrderId) {
      return orders.find((o) => o.id.toLowerCase() === initialOrderId.toLowerCase()) || null;
    }
    return orders[0] || null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderId));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const cleanQuery = searchQuery.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === cleanQuery ||
        o.customer.phone.includes(cleanQuery) ||
        o.customer.name.toLowerCase().includes(cleanQuery)
    );
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  return (
    <div className="bg-stone-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Bangalore Live Dispatch Dispatcher</span>
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Track Site Material Delivery
          </h1>
          <p className="text-sm text-stone-500 max-w-lg mx-auto">
            Check the live truck status, loaded materials, and estimated site arrival time for your Jyoti Hardware &amp; Construction order.
          </p>
        </div>

        {/* Search Bar Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. JHC-2026-8941) or Mobile Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-red-600 focus:bg-white"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0 shadow-sm"
            >
              Track Order
            </button>
          </form>

          {/* Quick Demo suggestions */}
          <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
            <span className="font-semibold text-stone-400">Quick Test IDs:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSearchQuery(o.id);
                  setSearchedOrder(o);
                  setHasSearched(true);
                }}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[11px] rounded transition-colors"
              >
                {o.id}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Result View */}
        {searchedOrder ? (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Order Reference
                </div>
                <div className="text-2xl font-black text-stone-900 font-mono">
                  #{searchedOrder.id}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Placed on {searchedOrder.date} • {searchedOrder.deliveryMethod.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-stone-500">Live Status:</span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                  {searchedOrder.orderStatus}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 mb-6">
                Delivery Progress Timeline
              </h3>
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {searchedOrder.trackingSteps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                        step.done
                          ? 'bg-red-600 text-white'
                          : 'bg-stone-200 text-stone-500 border border-stone-300'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    {/* Step Details */}
                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                          {step.step}
                        </h4>
                        <span className="text-[11px] font-mono text-stone-400">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Site Address & Materials Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-200 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="font-extrabold text-red-600 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Site Destination</span>
                </div>
                <div className="font-bold text-stone-900 text-sm">
                  {searchedOrder.customer.name}
                </div>
                <div className="text-stone-600">{searchedOrder.customer.address}</div>
                <div className="text-stone-600">
                  {searchedOrder.customer.city} - {searchedOrder.customer.pinCode}
                </div>
                <div className="text-stone-600">Contact: {searchedOrder.customer.phone}</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="font-extrabold text-stone-600 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-stone-500" />
                  <span>Loaded Material Summary</span>
                </div>
                <div className="space-y-1 pt-1">
                  {searchedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-stone-700">
                      <span className="truncate pr-2">
                        • {item.product.name} ({item.product.brand})
                      </span>
                      <span className="font-bold shrink-0">
                        {item.quantity} {item.product.unit}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                  <span>Total Order Value:</span>
                  <span className="text-red-600">₹{searchedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Help Callout */}
            <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-stone-700">
                  Need to change site gate access or schedule concrete pumping? Call dispatch directly:
                </span>
              </div>
              <a
                href="tel:6297201943"
                className="font-bold text-red-600 hover:text-red-700 shrink-0 uppercase tracking-wider"
              >
                +91 6297201943 &rarr;
              </a>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              No matching order found for "{searchQuery}"
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Please double check your Order ID (starts with JHC-2026-...) or the mobile number entered during checkout.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
