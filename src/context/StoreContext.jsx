import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_BOOKS, INITIAL_USER, INITIAL_ORDERS, getTentativeDeliveryDate } from '../data/booksData';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Books catalog
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('ebookstore_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  // User & Auth
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ebookstore_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Addresses
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('ebookstore_addresses');
    return saved ? JSON.parse(saved) : INITIAL_USER.addresses;
  });
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    return addresses.find(a => a.isDefault)?.id || addresses[0]?.id || '';
  });

  // Cart: [{ bookId, quantity, book }]
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ebookstore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ebookstore_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

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

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('ebookstore_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('ebookstore_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ebookstore_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('ebookstore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ebookstore_orders', JSON.stringify(orders));
  }, [orders]);

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
  const login = (email, name = 'Alex Johnson') => {
    const updatedUser = {
      ...user,
      email,
      name,
    };
    setUser(updatedUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${name}!`);
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
  const addAddress = (newAddr) => {
    const id = 'addr_' + Date.now();
    const addressWithId = { ...newAddr, id, isDefault: addresses.length === 0 };
    setAddresses(prev => [...prev, addressWithId]);
    setSelectedAddressId(id);
    showToast('Delivery address saved successfully!');
    return addressWithId;
  };

  // Order Placement
  const placeOrder = ({
    paymentMethod,
    pointsToRedeem = 0,
    shippingFee = 0,
    deliveryAddress,
  }) => {
    const subtotal = cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
    // 100 points = $10 discount ($0.10 per point)
    const discountFromPoints = Math.min(pointsToRedeem * 0.1, subtotal);
    const taxableAmount = Math.max(0, subtotal - discountFromPoints);
    const tax = taxableAmount * 0.085; // 8.5% tax
    const total = taxableAmount + tax + (subtotal > 35 ? 0 : shippingFee);

    // Calculate points earned (1 point per dollar spent)
    const pointsEarned = Math.round(total);

    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'Processing',
      items: cart.map(item => ({
        bookId: item.bookId,
        title: item.book.title,
        author: item.book.author,
        price: item.book.price,
        quantity: item.quantity,
        cover: item.book.cover,
        deliveryDate: getTentativeDeliveryDate(item.book.deliveryDays || 2),
      })),
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountFromPoints: parseFloat(discountFromPoints.toFixed(2)),
      pointsRedeemed: pointsToRedeem,
      pointsEarned,
      shippingFee: subtotal > 35 ? 0 : shippingFee,
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      paymentMethod,
      deliveryAddress,
      tentativeDelivery: getTentativeDeliveryDate(2),
      canCancel: true,
    };

    // Update user points
    const updatedPoints = (user.giftPoints || 0) - pointsToRedeem + pointsEarned;
    setUser(prev => ({ ...prev, giftPoints: updatedPoints }));

    // Update orders list
    setOrders(prev => [newOrder, ...prev]);

    // Clear cart and show confirmation
    clearCart();
    setIsCheckoutOpen(false);
    setLatestConfirmedOrder(newOrder);
    showToast(`Order #${newOrder.id} placed successfully! 🎉`);

    return newOrder;
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
  const cancelOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    const orderTime = new Date(order.createdAt).getTime();
    const now = Date.now();
    const hoursElapsed = (now - orderTime) / (1000 * 60 * 60);

    if (hoursElapsed > 48) {
      showToast('Cancellation window (48 hours) has expired for this order.', 'error');
      return false;
    }

    // Refund points if redeemed
    if (order.pointsRedeemed > 0) {
      setUser(prev => ({
        ...prev,
        giftPoints: (prev.giftPoints || 0) + order.pointsRedeemed - (order.pointsEarned || 0),
      }));
    }

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, status: 'Cancelled', canCancel: false } : o
      )
    );

    showToast(`Order #${orderId} was cancelled successfully. Refund initiated.`, 'info');
    return true;
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
