import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BRANDS } from '../../data/booksData';
import { BookmarkCheck } from 'lucide-react';

export const BrandFilter = () => {
  const { selectedBrand, setSelectedBrand } = useStore();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
        <BookmarkCheck className="w-3.5 h-3.5 text-indigo-500" />
        Publishers / Brands:
      </span>
      {BRANDS.map(brand => {
        const isSelected = selectedBrand === brand.id;
        return (
          <button
            key={brand.id}
            onClick={() => setSelectedBrand(brand.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              isSelected
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {brand.name}
          </button>
        );
      })}
    </div>
  );
};
