import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/booksData';
import { Sparkles, Cpu, BookOpen, TrendingUp, Rocket, UserCheck, Smile, Layers } from 'lucide-react';

const ICON_MAP = {
  Sparkles: Sparkles,
  Cpu: Cpu,
  BookOpen: BookOpen,
  TrendingUp: TrendingUp,
  Rocket: Rocket,
  UserCheck: UserCheck,
  Smile: Smile,
};

export const CategoryChips = () => {
  const { selectedCategory, setSelectedCategory, setActiveView } = useStore();

  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select a genre to filter the curated collection
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map(category => {
          const isSelected = selectedCategory === category.id;
          const IconComponent = ICON_MAP[category.icon] || BookOpen;

          return (
            <button
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 shadow-sm ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30 scale-[1.02]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-indigo-600'}`} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
