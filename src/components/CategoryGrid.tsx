import React from 'react';
import {
  Building2,
  Zap,
  Paintbrush,
  Cable,
  Pipette,
  Hammer,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES_DATA } from '../data/initialProducts';
import { handleImageError } from '../utils/fallbackImage';

interface CategoryGridProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" />;
      case 'Zap':
        return <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" />;
      case 'Paintbrush':
        return <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" />;
      case 'Cable':
        return <Cable className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" />;
      case 'Pipette':
        return <Pipette className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" />;
      case 'Hammer':
        return <Hammer className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" />;
      case 'Layers':
      default:
        return <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" />;
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Full Hardware Catalog</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
              Explore Our Product Categories
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-xl">
              Source every construction requirement under one roof with genuine manufacturer warranties and direct site drops.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 flex items-center gap-1 group self-start md:self-auto cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 8 Categories Grid - Optimized for 360px, 390px, 414px, Tablets & Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="group cursor-pointer rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-red-600/70 p-2.5 sm:p-4 transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between h-full"
            >
              <div>
                {/* Category Thumbnail Image with Fallback */}
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2 sm:mb-3 bg-stone-200">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-stone-900/85 backdrop-blur-xs text-white text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
                    {cat.itemCount}+ Items
                  </div>
                </div>

                {/* Category Title & Icon - NO TRUNCATION, Complete Names Visible */}
                <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 mb-1.5 min-h-[2.5rem] sm:min-h-[2.75rem]">
                  <div className="p-1 sm:p-1.5 bg-red-50 rounded-md group-hover:bg-red-600 transition-colors shrink-0 mt-0.5 sm:mt-0">
                    {getIcon(cat.icon)}
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-stone-900 group-hover:text-red-600 transition-colors leading-tight break-words">
                    {cat.name}
                  </h3>
                </div>

                <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 pt-2 sm:mt-4 sm:pt-3 border-t border-stone-200/60 flex items-center justify-between text-[10px] sm:text-xs font-bold text-stone-700 group-hover:text-red-600 transition-colors">
                <span>Browse Products</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
