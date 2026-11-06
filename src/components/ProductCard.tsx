import React from 'react';
import { ShoppingCart, Heart, Check } from 'lucide-react';
import { Product } from '../types';
import { getStockStatus } from '../utils/inventory';
import { handleImageError } from '../utils/fallbackImage';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenBulkQuoteWithProduct?: (product: Product) => void;
  isInCart?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isInCart = false,
  isWishlisted = false,
  onToggleWishlist,
  viewMode = 'grid',
}) => {
  const stockInfo = getStockStatus(product.stock);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const isSoldOut = product.stock <= 0 || product.badge === 'SOLD OUT';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!stockInfo.canOrder || isSoldOut) return;
    onAddToCart(product, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  // List View Rendering
  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onSelect(product)}
        className="group bg-white border border-stone-200/90 rounded-2xl p-3.5 sm:p-5 hover:border-[#0c432d]/40 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center gap-4 cursor-pointer relative"
      >
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 bg-[#f8faf9] rounded-xl shrink-0 flex items-center justify-center p-2.5 border border-stone-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={handleImageError}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercent > 0 && !isSoldOut && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#0c432d] text-white text-[10px] font-bold">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="flex-1 text-left w-full min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold text-[#0c432d] uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-stone-500 font-medium truncate">
              {product.category}
            </span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#0c432d] transition-colors leading-snug">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base sm:text-lg font-black text-[#d32f2f]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[11px] text-stone-400">/ {product.unit}</span>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
          <button
            onClick={handleAddToCart}
            disabled={!stockInfo.canOrder || isSoldOut}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs ${
              isSoldOut
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : isInCart
                ? 'bg-stone-900 text-white'
                : 'bg-[#0c432d] hover:bg-[#072c1c] text-white active:scale-95'
            }`}
          >
            {isInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            <span>{isSoldOut ? 'Sold Out' : isInCart ? 'In Cart' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Grid View (Exact match to reference design)
  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white border border-stone-200/90 rounded-2xl hover:border-[#0c432d]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden h-full w-full"
    >
      {/* Product Image Area with Top Badges */}
      <div className="relative w-full aspect-square bg-[#f8faf9] flex items-center justify-center p-4 border-b border-stone-100/80">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top-Right Wishlist Heart Icon Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-red-500 shadow-2xs transition-all z-10 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'text-red-500 fill-red-500' : 'text-stone-700'
            }`}
          />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Product Name */}
          <h3 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#0c432d] transition-colors line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.25rem]">
            {product.name}
          </h3>

          {/* Price & Discount Row */}
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5 mb-1">
            <span className="text-sm sm:text-base font-black text-[#d32f2f]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discountPercent > 0 && !isSoldOut && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-900 text-white text-[9px] sm:text-[10px] font-bold">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isSoldOut ? 'Sold Out' : 'In Stock'}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="pt-1">
          <button
            onClick={handleAddToCart}
            disabled={!stockInfo.canOrder || isSoldOut}
            className={`w-full py-2 sm:py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              isSoldOut
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : isInCart
                ? 'bg-stone-900 text-white'
                : 'bg-[#0c432d] hover:bg-[#072c1c] text-white active:scale-95'
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
        </div>
      </div>
    </div>
  );
};
