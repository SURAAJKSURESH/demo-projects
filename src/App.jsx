import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryChips } from './components/home/CategoryChips';
import { BookCatalog } from './components/catalog/BookCatalog';
import { BookDetailModal } from './components/catalog/BookDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationModal } from './components/checkout/OrderConfirmationModal';
import { OrderHistoryView } from './components/orders/OrderHistoryView';
import { AuthModal } from './components/auth/AuthModal';

const StoreContent = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full">
        {activeView === 'home' && (
          <div>
            <HeroBanner />
            <CategoryChips />
            <BookCatalog showRecommendations={true} title="All Available Books" />
          </div>
        )}

        {activeView === 'catalog' && (
          <div>
            <CategoryChips />
            <BookCatalog showRecommendations={false} title="Explore Full Book Catalog" />
          </div>
        )}

        {activeView === 'orders' && (
          <OrderHistoryView />
        )}
      </main>

      <Footer />

      {/* Global Modals, Drawers & Overlays */}
      <CartDrawer />
      <BookDetailModal />
      <CheckoutModal />
      <OrderConfirmationModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
