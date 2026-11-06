import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES_DATA } from '../data/initialProducts';
import { handleImageError } from '../utils/fallbackImage';

interface CategoryGridProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
              Shop by Category
            </h2>
            <div className="w-14 h-1 bg-amber-400 rounded-full mt-1.5" />
          </div>

          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs sm:text-sm font-bold text-[#0c432d] hover:text-[#062c1e] flex items-center gap-1 group cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 6 Category Cards Grid (2-cols on mobile, 3-cols on tablet, 6-cols on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-[#f8faf9] hover:bg-white hover:border-[#0c432d]/40 p-3 sm:p-4 transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col items-center text-center justify-between"
            >
              {/* Product cutout image on clean background */}
              <div className="w-full aspect-[4/3] rounded-xl flex items-center justify-center p-2 mb-2 sm:mb-3 bg-white/70 group-hover:bg-white transition-colors">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={handleImageError}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Category Name */}
              <h3 className="text-xs sm:text-sm font-black text-stone-900 group-hover:text-[#0c432d] transition-colors leading-snug">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
