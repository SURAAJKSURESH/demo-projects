import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { getTentativeDeliveryDate } from '../../data/booksData';
import {
  X,
  Star,
  ShoppingBag,
  Truck,
  Award,
  ShieldCheck,
  Book,
  Layers,
  Check,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

export const BookDetailModal = () => {
  const {
    selectedBookForDetail,
    setSelectedBookForDetail,
    addToCart,
    books,
    setIsCartOpen,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs'

  if (!selectedBookForDetail) return null;

  const book = selectedBookForDetail;
  const tentativeDate = getTentativeDeliveryDate(book.deliveryDays || 2);

  // Find related products
  const relatedBooks = (book.relatedIds || [])
    .map(id => books.find(b => b.id === id))
    .filter(Boolean)
    .slice(0, 3);

  const handleAddToCart = (openCart = false) => {
    addToCart(book, quantity);
    if (openCart) {
      setSelectedBookForDetail(null);
      setIsCartOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              {book.publisher}
            </span>
            {book.badge && (
              <span className="text-xs font-black uppercase text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-md">
                {book.badge}
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedBookForDetail(null)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Main Book Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Book Cover */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[260px] aspect-[4/5] bg-slate-100 rounded-2xl p-4 flex items-center justify-center shadow-lg border border-slate-200/80 relative">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-auto object-cover rounded-xl shadow-md"
                />
              </div>

              {/* Tentative delivery badge */}
              <div className="mt-4 w-full max-w-[260px] p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Tentative Delivery</p>
                  <p className="text-[11px] text-emerald-700">Expected by {tentativeDate}</p>
                </div>
              </div>
            </div>

            {/* Book Info & Purchase action */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {book.title}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  by <span className="font-bold text-slate-800">{book.author}</span>
                </p>

                {/* Star rating & Reviews count */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{book.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {book.reviewsCount.toLocaleString()} verified customer ratings
                  </span>
                </div>

                {/* Price block */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">
                        ${book.price.toFixed(2)}
                      </span>
                      {book.originalPrice && (
                        <span className="text-sm text-slate-400 line-through font-medium">
                          ${book.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                      Save ${(book.originalPrice - book.price).toFixed(2)} ({(
                        ((book.originalPrice - book.price) / book.originalPrice) * 100
                      ).toFixed(0)}% off)
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      +{book.pointsAwarded} Gift Points
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4">
                  {book.description}
                </p>
              </div>

              {/* Quantity selector & Add to basket */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 hover:bg-slate-200 transition-colors text-slate-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-sm text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 hover:bg-slate-200 transition-colors text-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-500">
                    <span className="text-emerald-600 font-bold">In Stock</span> ({book.stock} available)
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Basket
                  </button>

                  <button
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Book specifications */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Pages</span>
              <span className="font-bold text-slate-800">{book.pages}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Language</span>
              <span className="font-bold text-slate-800">{book.language}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">ISBN</span>
              <span className="font-bold text-slate-800">{book.isbn}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Publisher</span>
              <span className="font-bold text-slate-800">{book.publisher}</span>
            </div>
          </div>

          {/* Related Products Appear for Selection (Slide requirement) */}
          {relatedBooks.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Frequently Bought Together & Related Titles
                  </h4>
                </div>
                <span className="text-xs text-slate-400">Click to preview</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedBooks.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedBookForDetail(rel);
                      setQuantity(1);
                    }}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex gap-3 items-center group"
                  >
                    <img
                      src={rel.cover}
                      alt={rel.title}
                      className="w-12 h-16 object-cover rounded-lg shadow shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">
                        {rel.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{rel.author}</p>
                      <p className="text-xs font-black text-indigo-600 mt-1">${rel.price.toFixed(2)}</p>
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
