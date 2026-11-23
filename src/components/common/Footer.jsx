import React from 'react';
import { BookOpen, ShieldCheck, Truck, RefreshCw, Award, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer = () => {
  const { setActiveView, setSelectedCategory } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Value propositions banner */}
      <div className="border-b border-slate-800 bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Fast & Tentative Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Real-time delivery estimates directly tagged on all titles.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Gift Points Rewards</h4>
              <p className="text-xs text-slate-400 mt-0.5">Earn points on every purchase and redeem for instant discounts.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">48-Hour Free Cancellation</h4>
              <p className="text-xs text-slate-400 mt-0.5">Effortlessly cancel orders within 48 hours directly from history.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">100% Authentic Books</h4>
              <p className="text-xs text-slate-400 mt-0.5">Curated directly from top global publishers and brands.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">PageTurn Bookstore</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Your modern digital bookstore powered by AI-augmented search, personalized recommendations, instant gift rewards, and seamless order management.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-indigo-300">
                AI Specialist Capstone
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-amber-300">
                Built with IBM BOB
              </span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Browse Categories</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('technology');
                    setActiveView('catalog');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Technology & AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('fiction');
                    setActiveView('catalog');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Fiction & Literature
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('business');
                    setActiveView('catalog');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Business & Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('scifi');
                    setActiveView('catalog');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Sci-Fi & Fantasy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('biography');
                    setActiveView('catalog');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Biography & Memoir
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Top Publishers</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Penguin Random House</li>
              <li>O'Reilly Media</li>
              <li>MIT Press</li>
              <li>HarperCollins</li>
              <li>Simon & Schuster</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Customer Service</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveView('orders')} className="hover:text-white transition-colors">
                  Order Tracking & History
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('orders')} className="hover:text-white transition-colors">
                  Buy In Again
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('orders')} className="hover:text-white transition-colors">
                  48-Hr Order Cancellation
                </button>
              </li>
              <li>Gift Points Program</li>
              <li>Delivery & Returns FAQ</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PageTurn AI Bookstore. Developed for AI Specialist Capstone Project.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & IBM BOB Agentic IDE
          </p>
        </div>
      </div>
    </footer>
  );
};
