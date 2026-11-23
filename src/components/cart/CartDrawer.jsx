import React from 'react';
import { useStore } from '../../context/StoreContext';
import { getTentativeDeliveryDate } from '../../data/booksData';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartItemCount,
    setIsCheckoutOpen,
    getRecommendedBooks,
    addToCart,
    setSelectedBookForDetail,
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 35;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const recommendations = getRecommendedBooks().slice(0, 2);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Background click to close */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 className="font-extrabold text-base text-slate-900">
              Shopping Basket ({cartItemCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="bg-indigo-50/60 px-5 py-2.5 border-b border-indigo-100">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-950 mb-1.5">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              {isFreeShipping ? 'You unlocked Free Express Shipping! 🎉' : `Add $${amountNeededForFreeShipping.toFixed(2)} more for Free Shipping`}
            </span>
            <span>${cartSubtotal.toFixed(2)} / ${freeShippingThreshold}</span>
          </div>
          <div className="w-full bg-indigo-200/60 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Items List or Empty state */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Your basket is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover bestselling books, tech manuals, and classics from our curated catalogue.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            <>
              {cart.map(item => {
                const book = item.book;
                const tentativeDelivery = getTentativeDeliveryDate(book?.deliveryDays || 2);

                return (
                  <div
                    key={item.bookId}
                    className="flex gap-3.5 p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:border-indigo-200 transition-colors"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-16 h-22 object-cover rounded-lg shadow-sm border border-slate-100 shrink-0 cursor-pointer"
                      onClick={() => {
                        setSelectedBookForDetail(book);
                        setIsCartOpen(false);
                      }}
                    />

                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4
                            onClick={() => {
                              setSelectedBookForDetail(book);
                              setIsCartOpen(false);
                            }}
                            className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 hover:text-indigo-600 cursor-pointer"
                          >
                            {book.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.bookId)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{book.author}</p>
                        
                        <p className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Delivery by {tentativeDelivery}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-black text-slate-900">
                          ${(book.price * item.quantity).toFixed(2)}
                        </span>

                        {/* Quantity modifier */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.bookId, item.quantity - 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.bookId, item.quantity + 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* In-Cart Recommendations based on order history */}
              {recommendations.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Frequently Added Together</span>
                  </div>

                  <div className="space-y-2">
                    {recommendations.map(rec => (
                      <div
                        key={rec.id}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img
                            src={rec.cover}
                            alt={rec.title}
                            className="w-8 h-11 object-cover rounded shadow-xs shrink-0"
                          />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-800 truncate">{rec.title}</p>
                            <p className="text-[10px] text-slate-500">${rec.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(rec, 1)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg shrink-0 transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer with Price Breakdown and Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartItemCount} items)</span>
                <span className="font-semibold text-slate-800">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-emerald-600">
                  {isFreeShipping ? 'FREE' : '$4.99'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Gift Points Earned</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Award className="w-3 h-3" /> +{Math.round(cartSubtotal)} pts
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Estimated Total</span>
                <span>${(cartSubtotal + (isFreeShipping ? 0 : 4.99)).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
