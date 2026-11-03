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

interface CategoryGridProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-red-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-red-600" />;
      case 'Paintbrush':
        return <Paintbrush className="w-5 h-5 text-red-600" />;
      case 'Cable':
        return <Cable className="w-5 h-5 text-red-600" />;
      case 'Pipette':
        return <Pipette className="w-5 h-5 text-red-600" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-red-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-red-600" />;
      case 'Layers':
      default:
        return <Layers className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <section className="py-12 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Full Hardware Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Explore Our Product Categories
            </h2>
            <p className="text-stone-500 text-sm mt-1 max-w-xl">
              Source every construction requirement under one roof with genuine manufacturer warranties and direct site drops.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 flex items-center gap-1 group self-start md:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="group cursor-pointer rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-red-600/60 p-4 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-stone-200">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-stone-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    {cat.itemCount}+ Items
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-red-50 rounded-md group-hover:bg-red-600 group-hover:text-white transition-colors">
                    {getIcon(cat.icon)}
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                </div>

                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-stone-700 group-hover:text-red-600 transition-colors">
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
