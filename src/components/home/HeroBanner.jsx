import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowRight, BookOpen, Gift, ShieldCheck, Zap } from 'lucide-react';

export const HeroBanner = () => {
  const { setActiveView, setSelectedCategory, addToCart, books } = useStore();

  const featuredBook = books.find(b => b.id === 'b1') || books[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 mb-10 shadow-2xl border border-indigo-900/40">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline and Call-to-actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Powered Online Bookstore Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
            Discover your next <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-100 to-amber-300">
              game-changing read
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Browse world-class titles from premier publishers. Enjoy tentative delivery tracking, 
            instant gift point rewards on every purchase, and hassle-free 48-hour order cancellation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveView('catalog');
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/40 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Full Catalogue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                setSelectedCategory('technology');
                setActiveView('catalog');
              }}
              className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl backdrop-blur-md transition-all duration-200"
            >
              Tech & AI Books
            </button>
          </div>

          {/* Quick stats / perks */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">100%</p>
              <p className="text-[11px] text-slate-400 font-medium">Authentic Titles</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-amber-400">10%</p>
              <p className="text-[11px] text-slate-400 font-medium">Gift Points Back</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-emerald-400">48h</p>
              <p className="text-[11px] text-slate-400 font-medium">Free Order Cancel</p>
            </div>
          </div>
        </div>

        {/* Right Column: Spotlight Book Card */}
        {featuredBook && (
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-2xl p-5 border border-indigo-500/30 backdrop-blur-md shadow-2xl relative group">
              <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                ★ Book of the Month
              </div>

              <div className="flex gap-4">
                <img
                  src={featuredBook.cover}
                  alt={featuredBook.title}
                  className="w-28 h-40 object-cover rounded-xl shadow-md border border-slate-700 shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {featuredBook.publisher}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1 line-clamp-2 leading-snug">
                      {featuredBook.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">by {featuredBook.author}</p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-black text-amber-300">${featuredBook.price}</span>
                      <span className="text-xs text-slate-400 line-through">${featuredBook.originalPrice}</span>
                    </div>

                    <button
                      onClick={() => addToCart(featuredBook, 1)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Quick Add to Basket
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> In Stock ({featuredBook.stock} left)
                </span>
                <span className="text-slate-400">Earn +{featuredBook.pointsAwarded} pts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
