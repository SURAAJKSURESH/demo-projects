import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_BOOKS, INITIAL_USER } from '../data/booksData';
import { api } from '../api';

const StoreContext = createContext();

const USER_ID_KEY = 'ebookstore_user_id';

export const StoreProvider = ({ children }) => {
  // Books catalog (static copy is shown until the API responds)
  const [books, setBooks] = useState(INITIAL_BOOKS);

  // User & Auth (loaded from PostgreSQL via the API)
  const [user, setUser] = useState({
    id: '',
    name: 'Guest',
    email: '',
    avatar: INITIAL_USER.avatar,
    giftPoints: 0,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // Cart: [{ bookId, quantity, book }] — client-side only
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ebookstore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState([]);

  // Navigation and UI Modals
  const [activeView, setActiveView] = useState('home'); // 'home' | 'catalog' | 'orders' | 'profile'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedBookForDetail, setSelectedBookForDetail] = useState(null);
  const [latestConfirmedOrder, setLatestConfirmedOrder] = useState(null);

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'
  const [maxPrice, setMaxPrice] = useState(60);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('ebookstore_cart', JSON.stringify(cart));
  }, [cart]);

  const applyAccount = (account) => {
    setUser(account.user);
    setAddresses(account.addresses);
    setOrders(account.orders);
    setSelectedAddressId(
      account.addresses.find(a => a.isDefault)?.id || account.addresses[0]?.id || ''
    );
    localStorage.setItem(USER_ID_KEY, account.user.id);
  };

  const refreshBooks = () => {
    api.getBooks().then(setBooks).catch(() => {});
  };

  // Initial load: catalogue + the signed-in user's account from the API
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [dbBooks, account] = await Promise.all([
          api.getBooks(),
          api
            .getAccount(localStorage.getItem(USER_ID_KEY) || INITIAL_USER.id)
            .catch(() => api.login(INITIAL_USER.email, INITIAL_USER.name)),
        ]);
        if (cancelled) return;
        setBooks(dbBooks);
        applyAccount(account);
      } catch (err) {
        if (!cancelled) showToast(err.message, 'error');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth operations
  const login = async (email, name = 'Alex Johnson') => {
    try {
      const account = await api.login(email, name);
      applyAccount(account);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${account.user.name}!`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('You have been logged out.', 'info');
  };

  // Cart operations
  const addToCart = (book, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.bookId === book.id);
      if (existing) {
        return prev.map(item =>
          item.bookId === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { bookId: book.id, quantity, book }];
    });
    showToast(`Added "${book.title.slice(0, 30)}..." to basket!`);
  };

  const updateCartQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.bookId === bookId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (bookId) => {
    const item = cart.find(i => i.bookId === bookId);
    setCart(prev => prev.filter(i => i.bookId !== bookId));
    if (item?.book) {
      showToast(`Removed "${item.book.title.slice(0, 24)}..." from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Address operations
  const addAddress = async (newAddr) => {
    try {
      const saved = await api.addAddress(user.id, newAddr);
      setAddresses(prev => [...prev, saved]);
      setSelectedAddressId(saved.id);
      showToast('Delivery address saved successfully!');
      return saved;
    } catch (err) {
      showToast(err.message, 'error');
      return null;
    }
  };

  // Order Placement — the server prices the order, checks stock and updates points
  const placeOrder = async ({ paymentMethod, pointsToRedeem = 0, deliveryAddress }) => {
    try {
      const { order, user: updatedUser } = await api.placeOrder({
        userId: user.id,
        addressId: deliveryAddress?.id || selectedAddressId,
        paymentMethod,
        pointsToRedeem,
        items: cart.map(item => ({ bookId: item.bookId, quantity: item.quantity })),
      });

      setUser(updatedUser);
      setOrders(prev => [order, ...prev]);
      refreshBooks();

      // Clear cart and show confirmation
      clearCart();
      setIsCheckoutOpen(false);
      setLatestConfirmedOrder(order);
      showToast(`Order #${order.id} placed successfully! 🎉`);

      return order;
    } catch (err) {
      showToast(err.message, 'error');
      return null;
    }
  };

  // Buy Again feature
  const buyAgain = (orderItem) => {
    const foundBook = books.find(b => b.id === orderItem.bookId) || {
      id: orderItem.bookId,
      title: orderItem.title,
      author: orderItem.author,
      price: orderItem.price,
      cover: orderItem.cover,
      deliveryDays: 2,
    };
    addToCart(foundBook, 1);
    setIsCartOpen(true);
    showToast(`Added "${orderItem.title.slice(0, 30)}" to basket for re-order!`);
  };

  // Cancel Order (within 48 hrs)
  const cancelOrder = async (orderId) => {
    try {
      const { order, user: updatedUser } = await api.cancelOrder(orderId, user.id);
      setUser(updatedUser);
      setOrders(prev => prev.map(o => (o.id === orderId ? order : o)));
      refreshBooks();
      showToast(`Order #${orderId} was cancelled successfully. Refund initiated.`, 'info');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // Recommendations generator based on order history & cart
  const getRecommendedBooks = () => {
    const orderedCategories = new Set();
    const orderedBookIds = new Set();

    orders.forEach(order => {
      order.items?.forEach(item => {
        orderedBookIds.add(item.bookId);
        const b = books.find(book => book.id === item.bookId);
        if (b) orderedCategories.add(b.category);
      });
    });

    cart.forEach(item => {
      orderedBookIds.add(item.bookId);
      if (item.book) orderedCategories.add(item.book.category);
    });

    if (orderedCategories.size === 0) {
      return books.filter(b => b.featured).slice(0, 4);
    }

    const matches = books.filter(
      b => orderedCategories.has(b.category) && !orderedBookIds.has(b.id)
    );

    if (matches.length < 4) {
      const rest = books.filter(b => !orderedBookIds.has(b.id) && !matches.includes(b));
      return [...matches, ...rest].slice(0, 4);
    }

    return matches.slice(0, 4);
  };

  // Cart summary calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.book?.price || 0) * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        books,
        user,
        isAuthenticated,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        cart,
        cartSubtotal,
        cartItemCount,
        orders,
        activeView,
        setActiveView,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedBookForDetail,
        setSelectedBookForDetail,
        latestConfirmedOrder,
        setLatestConfirmedOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        sortBy,
        setSortBy,
        maxPrice,
        setMaxPrice,
        toasts,
        showToast,
        removeToast,
        login,
        logout,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        addAddress,
        placeOrder,
        buyAgain,
        cancelOrder,
        getRecommendedBooks,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
