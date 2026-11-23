import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { BookCard } from './BookCard';
import { BrandFilter } from '../home/BrandFilter';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  Search,
  RotateCcw,
} from 'lucide-react';

export const BookCatalog = ({ showRecommendations = true, title = 'Curated Book Catalogue' }) => {
  const {
    books,
    selectedCategory,
    selectedBrand,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    setSelectedCategory,
    setSelectedBrand,
    getRecommendedBooks,
  } = useStore();

  const recommendedBooks = useMemo(() => {
    return getRecommendedBooks();
  }, [books, getRecommendedBooks]);

  // Filter books according to category, brand, and search
  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        const matchesCategory =
          selectedCategory === 'all' || book.category === selectedCategory;
        const matchesBrand =
          selectedBrand === 'all' || book.publisher === selectedBrand;
        const matchesSearch =
          !searchQuery ||
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesBrand && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [books, selectedCategory, selectedBrand, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery !== '';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-10">
      
      {/* Personalized recommendations section based on Order History */}
      {showRecommendations && recommendedBooks.length > 0 && !hasActiveFilters && (
        <section className="bg-gradient-to-r from-amber-50 via-indigo-50/40 to-amber-50 p-6 sm:p-8 rounded-3xl border border-amber-200/70 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <Sparkles className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
                  Recommended for You
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  AI suggestions personalized based on your order history & preferences
                </p>
              </div>
            </div>
            <span className="text-xs bg-amber-200/80 text-amber-900 font-bold px-3 py-1 rounded-full self-start sm:self-auto">
              Smart Pick Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendedBooks.map(book => (
              <BookCard key={`rec-${book.id}`} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* Main Catalogue Header & Controls */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing {filteredBooks.length} available {filteredBooks.length === 1 ? 'title' : 'titles'}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Sort & filter controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Brand / Publisher selector */}
        <div className="mb-6">
          <BrandFilter />
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No books found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any books matching your current filters. Try searching with different keywords or reset your filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
