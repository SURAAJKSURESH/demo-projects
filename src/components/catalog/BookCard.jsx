import React from 'react';
import { useStore } from '../../context/StoreContext';
import { getTentativeDeliveryDate } from '../../data/booksData';
import {
  Star,
  ShoppingBag,
  Truck,
  Award,
  Eye,
  Check,
} from 'lucide-react';

export const BookCard = ({ book }) => {
  const { addToCart, setSelectedBookForDetail, cart } = useStore();

  const tentativeDate = getTentativeDeliveryDate(book.deliveryDays || 2);
  const isInCart = cart.some(item => item.bookId === book.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {book.badge ? (
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
            {book.badge}
          </span>
        ) : (
          <span />
        )}
        <span className="bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
          <Award className="w-3 h-3 text-amber-400" />
          +{book.pointsAwarded} pts
        </span>
      </div>

      {/* Book Cover Container with quick view button */}
      <div
        onClick={() => setSelectedBookForDetail(book)}
        className="relative bg-slate-100 p-6 pt-10 flex items-center justify-center cursor-pointer overflow-hidden aspect-[4/5]"
      >
        <img
          src={book.cover}
          alt={book.title}
          className="h-48 w-32 sm:h-52 sm:w-36 object-cover rounded-lg shadow-lg group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-300"
          loading="lazy"
        />

        {/* Hover overlay with Quick View */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBookForDetail(book);
            }}
            className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1 hover:bg-slate-100 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>
        </div>
      </div>

      {/* Book details & actions */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span className="text-indigo-600 font-bold uppercase tracking-wider">{book.publisher}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{book.rating}</span>
              <span className="text-slate-400 font-normal">({book.reviewsCount > 1000 ? `${(book.reviewsCount/1000).toFixed(1)}k` : book.reviewsCount})</span>
            </div>
          </div>

          <h3
            onClick={() => setSelectedBookForDetail(book)}
            className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-snug"
            title={book.title}
          >
            {book.title}
          </h3>

          <p className="text-xs text-slate-500 mt-1">by <span className="font-medium text-slate-700">{book.author}</span></p>

          {/* Tentative Delivery Tag (Capstone requirement) */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/70 rounded-lg text-[11px] font-semibold text-emerald-800">
            <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Delivery by <strong className="font-bold">{tentativeDate}</strong></span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">${book.price.toFixed(2)}</span>
              {book.originalPrice && (
                <span className="text-xs text-slate-400 line-through">${book.originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(book, 1)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
              isInCart
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add More</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Basket</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
