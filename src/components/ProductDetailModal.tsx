import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Zap,
  MessageCircle,
  FileText,
  Truck,
  ShieldCheck,
  Check,
  Minus,
  Plus,
} from 'lucide-react';
import { Product } from '../types';
import { getStockStatus } from '../utils/inventory';
import { formatProductInquiryWhatsApp, createWhatsAppLink } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onOpenBulkQuoteWithProduct: (product: Product) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenBulkQuoteWithProduct,
  allProducts,
  onSelectProduct,
}) => {
  if (!product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'bulk'>('specs');

  const stockInfo = getStockStatus(product.stock);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  // Related products from same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleWhatsAppClick = () => {
    const msg = formatProductInquiryWhatsApp(product, quantity);
    const link = createWhatsAppLink(msg);
    window.open(link, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Image Gallery */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
                <img
                  src={imagesList[selectedImageIndex] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-amber-400 text-stone-900 text-xs font-black uppercase tracking-wider shadow">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {imagesList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-red-600 ring-2 ring-red-600/30'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Site Guarantee Highlights */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    <strong>Bangalore Delivery:</strong> Same-day dispatch to Makali, Alur, Nelamangala &amp; Greater Bangalore.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>100% Genuine Guaranteed:</strong> Official authorized warranty with GST input tax invoice.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info & Actions */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Brand & Category */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold text-red-600 uppercase tracking-wider text-xs">
                    {product.brand}
                  </span>
                  <span className="text-stone-400 font-medium">{product.category}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-black text-stone-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-current'
                            : 'stroke-current fill-none'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-stone-800 ml-1.5">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500">{product.reviewsCount} verified reviews</span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-stone-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-base text-stone-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                        Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-500 mt-1 flex items-center justify-between">
                    <span>Price per {product.unit || 'unit'} (Inclusive of 18% GST)</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${stockInfo.badgeClass}`}>
                      {stockInfo.label} ({product.stock} available)
                    </span>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-stone-100 text-stone-600"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(product.stock, Math.max(1, val)));
                      }}
                      className="w-14 text-center font-bold text-sm text-stone-900 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 hover:bg-stone-100 text-stone-600"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Total: ₹{(quantity * product.price).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onAddToCart(product, quantity)}
                      disabled={!stockInfo.canOrder}
                      className="py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-stone-300 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => onBuyNow(product, quantity)}
                      disabled={!stockInfo.canOrder}
                      className="py-3 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Instant Buy Now</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleWhatsAppClick}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order on WhatsApp</span>
                    </button>

                    <button
                      onClick={() => onOpenBulkQuoteWithProduct(product)}
                      className="py-2.5 px-3 rounded-xl border-2 border-stone-700 hover:bg-stone-100 text-stone-800 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-red-600" />
                      <span>Request Bulk Quote</span>
                    </button>
                  </div>
                </div>

                {/* Tabs: Specs / Description / Bulk Tiers */}
                <div className="mt-6 pt-4 border-t border-stone-200">
                  <div className="flex border-b border-stone-200 gap-4 text-xs font-bold uppercase tracking-wider text-stone-500">
                    <button
                      onClick={() => setActiveTab('specs')}
                      className={`pb-2 border-b-2 transition-colors ${
                        activeTab === 'specs'
                          ? 'border-red-600 text-red-600 font-black'
                          : 'border-transparent hover:text-stone-800'
                      }`}
                    >
                      Specifications
                    </button>
                    <button
                      onClick={() => setActiveTab('desc')}
                      className={`pb-2 border-b-2 transition-colors ${
                        activeTab === 'desc'
                          ? 'border-red-600 text-red-600 font-black'
                          : 'border-transparent hover:text-stone-800'
                      }`}
                    >
                      Description &amp; Features
                    </button>
                    {product.bulkDiscountTiers && product.bulkDiscountTiers.length > 0 && (
                      <button
                        onClick={() => setActiveTab('bulk')}
                        className={`pb-2 border-b-2 transition-colors ${
                          activeTab === 'bulk'
                            ? 'border-red-600 text-red-600 font-black'
                            : 'border-transparent hover:text-stone-800'
                        }`}
                      >
                        Bulk Savings
                      </button>
                    )}
                  </div>

                  <div className="mt-3 text-xs">
                    {activeTab === 'specs' && (
                      <div className="divide-y divide-stone-100 bg-stone-50 rounded-lg p-3 border border-stone-200">
                        {Object.entries(product.specifications).map(([key, val]) => (
                          <div key={key} className="py-1.5 flex justify-between gap-4">
                            <span className="font-semibold text-stone-500">{key}</span>
                            <span className="font-bold text-stone-900 text-right">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'desc' && (
                      <div className="space-y-3 text-stone-600 leading-relaxed">
                        <p>{product.description}</p>
                        {product.features && product.features.length > 0 && (
                          <div className="space-y-1.5 pt-2">
                            <div className="font-bold text-stone-900">Key Highlights:</div>
                            {product.features.map((feat, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'bulk' && product.bulkDiscountTiers && (
                      <div className="space-y-2">
                        <p className="text-stone-600">
                          Automatic discounts applied during checkout for site contractor orders:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {product.bulkDiscountTiers.map((tier, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-red-50 border border-red-200 rounded-lg text-center"
                            >
                              <div className="font-extrabold text-red-700 text-sm">
                                {tier.discountPercent}% OFF
                              </div>
                              <div className="text-[11px] text-stone-600 font-medium">
                                When ordering {tier.minQty}+ {product.unit}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-stone-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-3">
                Related {product.category} Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="p-3 border border-stone-200 rounded-xl hover:border-red-600 transition-colors cursor-pointer flex items-center gap-3 bg-stone-50 hover:bg-white"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-12 h-12 rounded object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {rel.name}
                      </div>
                      <div className="text-[11px] text-red-600 font-bold">
                        ₹{rel.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
