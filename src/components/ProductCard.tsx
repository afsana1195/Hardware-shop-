import React from 'react';
import {
  ShoppingCart,
  Eye,
  MessageCircle,
  Check,
} from 'lucide-react';
import { Product } from '../types';
import { getStockStatus } from '../utils/inventory';
import { formatProductInquiryWhatsApp, createWhatsAppLink } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenBulkQuoteWithProduct?: (product: Product) => void;
  isInCart?: boolean;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isInCart = false,
  viewMode = 'grid',
}) => {
  const stockInfo = getStockStatus(product.stock);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const isSoldOut = product.stock <= 0 || product.badge === 'SOLD OUT';

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = formatProductInquiryWhatsApp(product, 1);
    const link = createWhatsAppLink(message);
    window.open(link, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!stockInfo.canOrder || isSoldOut) return;
    onAddToCart(product, 1);
  };

  // List View Rendering (Used on desktop when list layout is toggled)
  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onSelect(product)}
        className="group bg-white border border-stone-200 rounded-lg p-3 sm:p-4 hover:border-[#e31b23] hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center gap-4 cursor-pointer relative"
      >
        {/* Compact Thumbnail */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 bg-stone-50/80 rounded-md shrink-0 flex items-center justify-center p-2 border border-stone-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercent > 0 && !isSoldOut && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#e31b23] text-white text-[10px] font-black shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {isSoldOut && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-stone-900 text-white text-[9px] font-black uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 text-left w-full min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold text-[#e31b23] uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-stone-500 font-medium truncate">
              {product.category}
            </span>
            <span
              className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold ${
                isSoldOut
                  ? 'bg-stone-100 text-stone-500'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {stockInfo.label}
            </span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#e31b23] transition-colors uppercase leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-1 sm:line-clamp-2 mt-1">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2 mt-2">
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-base sm:text-lg font-black text-[#e31b23]">
              ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-stone-400">
              per {product.unit || 'unit'} (Incl. 18% GST)
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
          <button
            onClick={handleAddToCart}
            disabled={!stockInfo.canOrder || isSoldOut}
            className={`px-4 py-2 rounded font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              isSoldOut
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : isInCart
                ? 'bg-stone-900 text-white'
                : 'bg-[#e31b23] hover:bg-[#c41219] text-white active:scale-95'
            }`}
          >
            {isInCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            <span>{isSoldOut ? 'Sold Out' : isInCart ? 'In Cart' : 'Add to Cart'}</span>
          </button>
          <button
            onClick={handleWhatsAppEnquiry}
            className="px-3 py-2 border border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    );
  }

  // Grid View (Compact, optimized for mobile 1-column & desktop 4-column)
  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white border border-stone-200 rounded-lg hover:border-[#e31b23] hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden h-full max-w-md mx-auto sm:max-w-none w-full"
    >
      {/* 1. Consistent, Controlled-Height Image Container (No excessive height on mobile!) */}
      <div className="relative w-full h-44 sm:h-48 md:h-52 bg-white flex items-center justify-center p-3 border-b border-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top-Left Circular / Pill Discount Badge */}
        {discountPercent > 0 && !isSoldOut && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#e31b23] text-white text-[10px] sm:text-[11px] font-black shadow-xs tracking-tight select-none">
            -{discountPercent}%
          </div>
        )}

        {/* Top-Right Stock Status Badge (Clearly visible on mobile & desktop) */}
        <div className="absolute top-2.5 right-2.5 select-none">
          {isSoldOut ? (
            <span className="px-2 py-0.5 rounded-full bg-stone-900 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
              Sold Out
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Hover Action for Desktop */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-2 bg-white hover:bg-stone-100 text-stone-800 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            title="Quick View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Product Content Details (Brand, Category, Name, Price clearly readable) */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Brand & Category Header Row */}
          <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] mb-1">
            <span className="font-extrabold text-[#e31b23] uppercase tracking-wider truncate">
              {product.brand}
            </span>
            <span className="text-stone-400 font-medium truncate">
              {product.category}
            </span>
          </div>

          {/* Product Name (Consistent height with clean line-clamp) */}
          <h3 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#e31b23] transition-colors line-clamp-2 uppercase leading-snug min-h-[2rem] sm:min-h-[2.25rem] mb-1.5">
            {product.name}
          </h3>
        </div>

        <div>
          {/* Price Layout: Strikethrough M.R.P. + Bold Red Offer Price + Unit */}
          <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between gap-1 mb-2.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-[11px] text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
              <span className="text-sm sm:text-base font-black text-[#e31b23]">
                ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap">
              per {product.unit || 'unit'}
            </span>
          </div>

          {/* 3. Fully Visible, Dual Action Buttons (Add to Cart + WhatsApp Direct) */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!stockInfo.canOrder || isSoldOut}
              className={`py-2 px-2 rounded-md font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer ${
                isSoldOut
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : isInCart
                  ? 'bg-stone-900 hover:bg-stone-800 text-white'
                  : 'bg-[#e31b23] hover:bg-[#c41219] text-white active:scale-95'
              }`}
            >
              {isInCart ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="truncate">
                {isSoldOut ? 'Sold Out' : isInCart ? 'In Cart' : 'Add to Cart'}
              </span>
            </button>

            {/* WhatsApp Inquiry Button */}
            <button
              onClick={handleWhatsAppEnquiry}
              className="py-2 px-2 rounded-md font-bold text-[11px] uppercase tracking-wider border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Inquire via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
