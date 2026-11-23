import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  BookOpen,
  Search,
  ShoppingBag,
  Award,
  User,
  History,
  X,
  Menu,
  ChevronDown,
  Sparkles,
  LogOut,
} from 'lucide-react';

export const Header = () => {
  const {
    activeView,
    setActiveView,
    cartItemCount,
    setIsCartOpen,
    user,
    isAuthenticated,
    setIsAuthModalOpen,
    logout,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (view, category = null) => {
    setActiveView(view);
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-indigo-950 text-[10px] uppercase font-black px-1.5 py-0.5 rounded tracking-wide">
              Special
            </span>
            <span>Free Express Delivery on orders over $35 + Earn 10% back in Gift Points!</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-indigo-100">
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <Award className="w-3.5 h-3.5" />
              {user.giftPoints || 0} Reward Points Available
            </span>
            <span className="text-indigo-300">•</span>
            <span>Support: 24/7 Live Assistance</span>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  PageTurn
                </span>
                <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded border border-indigo-200">
                  Store
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                AI-Curated Bookstore
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by book title, author, category, or publisher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-full border border-transparent focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors hidden lg:block ${
                activeView === 'home'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore
            </button>

            <button
              onClick={() => handleNavClick('catalog')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeView === 'catalog'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Catalogue
            </button>

            <button
              onClick={() => handleNavClick('orders')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'orders'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">My Orders</span>
            </button>

            {/* Gift points pill */}
            <div
              onClick={() => handleNavClick('orders')}
              title="Redeem points at checkout!"
              className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{user.giftPoints || 0} pts</span>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:px-3.5 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md shadow-indigo-600/25 transition-all duration-200 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Basket</span>
              {cartItemCount > 0 && (
                <span className="bg-amber-400 text-indigo-950 font-black text-xs px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Login dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-300"
                    />
                    <span className="max-w-[85px] truncate hidden xl:inline text-xs font-semibold">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="px-4 py-2 bg-indigo-50/50 m-2 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-900">Gift Points</span>
                        <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                          {user.giftPoints || 0} pts
                        </span>
                      </div>

                      <button
                        onClick={() => handleNavClick('orders')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        Order History & Re-orders
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books, authors, publishers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-100 text-xs rounded-xl border border-transparent focus:border-indigo-400 focus:bg-white outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/80 space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                activeView === 'home' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
              }`}
            >
              Home / Featured
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                activeView === 'catalog' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
              }`}
            >
              Full Catalogue
            </button>
            <button
              onClick={() => handleNavClick('orders')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                activeView === 'orders' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
              }`}
            >
              <span>Order History & Re-orders</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                {user.giftPoints || 0} pts
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
