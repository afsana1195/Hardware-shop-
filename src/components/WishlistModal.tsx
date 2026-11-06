import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { handleImageError } from '../utils/fallbackImage';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenShop: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onOpenShop,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0c432d] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-amber-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Saved Materials Wishlist</h3>
              <p className="text-emerald-100 text-xs">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for your project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-stone-100">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center gap-3 sm:gap-4 first:pt-0 last:pb-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-50 rounded-xl p-1.5 border border-stone-200 shrink-0 flex items-center justify-center">
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={handleImageError}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-extrabold text-[#0c432d] uppercase tracking-wider">
                    {p.brand}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">{p.name}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-[#b91c1c]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    {p.originalPrice > p.price && (
                      <span className="text-xs text-stone-400 line-through">
                        ₹{p.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-[10px] text-stone-500">/ {p.unit}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onAddToCart(p, 1);
                    }}
                    className="px-3 py-1.5 bg-[#0c432d] hover:bg-[#083020] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(p.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 transition-colors self-center"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0c432d] mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8 stroke-1" />
              </div>
              <h4 className="text-base font-bold text-stone-900">Your wishlist is empty</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Click the heart icon on any product card to bookmark cement, power tools, paints, and hardware for your site.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenShop();
                }}
                className="mt-3 px-5 py-2.5 bg-[#0c432d] hover:bg-[#083020] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <span>Browse Hardware Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-stone-500 font-medium">
              {wishlistProducts.length} materials saved
            </span>
            <button
              onClick={() => {
                wishlistProducts.forEach((p) => onAddToCart(p, 1));
                onClose();
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add All to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
