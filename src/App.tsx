/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Product,
  CartItem,
  Order,
  BulkQuoteRequest,
  DeliveryMethod,
  PaymentMethod,
  CustomerDetails,
  UserProfile,
} from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/initialProducts';
import { deductInventory } from './utils/inventory';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { RazorpayModal } from './components/RazorpayModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { TrackOrderView } from './components/TrackOrderView';
import { BulkQuoteModal } from './components/BulkQuoteModal';
import { BulkOrderView } from './components/BulkOrderView';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { FAQView } from './components/FAQView';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { LoginModal } from './components/LoginModal';
import { WishlistModal } from './components/WishlistModal';

const STORAGE_KEYS = {
  PRODUCTS: 'jhc_products_v4',
  CART: 'jhc_cart_v4',
  ORDERS: 'jhc_orders_v4',
  QUOTES: 'jhc_quotes_v4',
  WISHLIST: 'jhc_wishlist_v4',
  USER: 'jhc_user_v4',
};

export default function App() {
  // 1. Core State with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const initialMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));
        return parsed.map((p) => {
          const fresh = initialMap.get(p.id);
          if (fresh) {
            return {
              ...p,
              image: fresh.image,
              images: fresh.images,
              category: fresh.category,
            };
          }
          return p;
        });
      }
    } catch (e) {
      console.warn('Failed loading products from storage', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading cart from storage', e);
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading orders from storage', e);
    }
    return INITIAL_ORDERS;
  });

  const [quotes, setQuotes] = useState<BulkQuoteRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUOTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading quotes from storage', e);
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    } catch (e) {}
  }, [quotes]);

  // User Profile & Wishlist State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [wishlistProductIds, setWishlistProductIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {}
    return new Set(['jhc-02']);
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.WISHLIST,
        JSON.stringify(Array.from(wishlistProductIds))
      );
    } catch (e) {}
  }, [wishlistProductIds]);

  // 2. Navigation & UI State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Tab Navigation with browser history & Android back button support
  const navigateTab = (newTab: string, pushHistory = true) => {
    setCurrentTab(newTab);
    if (pushHistory) {
      const hash = newTab === 'home' ? '' : `#${newTab}`;
      const url = `${window.location.pathname}${hash}`;
      window.history.pushState({ tab: newTab }, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.tab === 'string') {
        setCurrentTab(e.state.tab);
      } else {
        const hash = window.location.hash.replace('#', '');
        setCurrentTab(hash || 'home');
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initialize history state on load
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
      setCurrentTab(initialHash);
      window.history.replaceState({ tab: initialHash }, '', window.location.href);
    } else {
      window.history.replaceState({ tab: 'home' }, '', window.location.href);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [pendingOrderDraft, setPendingOrderDraft] = useState<any>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isBulkQuoteOpen, setIsBulkQuoteOpen] = useState(false);
  const [bulkQuoteProduct, setBulkQuoteProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Cart configuration
  const [couponCode, setCouponCode] = useState('BUILD10');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');

  // Tracking query passed from order confirmation
  const [trackOrderId, setTrackOrderId] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 3. Cart Handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    showToast(`Added ${quantity}x ${product.name} to cart`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartProductIds = useMemo(() => {
    return new Set(cart.map((i) => i.product.id));
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, i) => acc + i.quantity, 0);
  }, [cart]);

  const totalCartAmount = useMemo(() => {
    return cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  }, [cart]);

  // Instant Buy Now
  const handleBuyNow = (product: Product, quantity: number = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Wishlist Handlers
  const handleToggleWishlist = (productId: string) => {
    setWishlistProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        showToast('Removed item from Wishlist');
      } else {
        next.add(productId);
        showToast('Saved item to Wishlist');
      }
      return next;
    });
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistProductIds.has(p.id));
  }, [products, wishlistProductIds]);

  // 4. Order Checkout & Payment Handlers
  const handleInitiatePayment = (draft: {
    customer: CustomerDetails;
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;
    subtotal: number;
    discount: number;
    tax: number;
    shippingFee: number;
    total: number;
    couponCode: string;
  }) => {
    setPendingOrderDraft(draft);

    if (draft.paymentMethod.startsWith('razorpay')) {
      // Open Razorpay simulation modal
      setIsCheckoutOpen(false);
      setIsRazorpayOpen(true);
    } else {
      // Direct Cash on Delivery placement
      completeOrderPlacement(draft, 'pending');
    }
  };

  const completeOrderPlacement = (draft: any, paymentStatus: 'paid' | 'pending') => {
    const newOrderId = `JHC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newOrder: Order = {
      id: newOrderId,
      date: formattedDate,
      items: [...cart],
      customer: draft.customer,
      deliveryMethod: draft.deliveryMethod,
      paymentMethod: draft.paymentMethod,
      paymentStatus,
      subtotal: draft.subtotal,
      discount: draft.discount,
      couponCode: draft.couponCode,
      tax: draft.tax,
      shippingFee: draft.shippingFee,
      total: draft.total,
      orderStatus: 'Placed',
      trackingSteps: [
        {
          step: 'Order Placed & Registered',
          timestamp: formattedDate,
          done: true,
          detail: `Order #${newOrderId} confirmed via ${draft.paymentMethod.toUpperCase()}`,
        },
        {
          step: 'Packing & Yard Staging',
          timestamp: 'In Progress',
          done: true,
          detail: 'Materials being assembled at Makali Yard, Bangalore',
        },
        {
          step: 'Dispatched from Makali',
          timestamp: 'Pending',
          done: false,
          detail: 'Assigned to site delivery carrier truck',
        },
        {
          step: 'Out for Site Delivery',
          timestamp: 'Pending',
          done: false,
          detail: 'Driver en route to customer site address',
        },
        {
          step: 'Delivered',
          timestamp: 'Pending',
          done: false,
          detail: 'Pending physical offload at project gate',
        },
      ],
    };

    // Deduct stock in real-time
    const updatedProducts = deductInventory(
      products,
      cart.map((item) => ({ id: item.product.id, quantity: item.quantity }))
    );
    setProducts(updatedProducts);

    // Append order & clear cart
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsRazorpayOpen(false);
    setPendingOrderDraft(null);

    // Show confirmation modal
    setConfirmedOrder(newOrder);
  };

  // 5. Admin Actions
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added product "${newProd.name}"`);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    showToast(`Updated product "${updated.name}"`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Deleted product from catalog');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const now = new Date().toISOString().substring(11, 16);
        const updatedSteps = o.trackingSteps.map((step) => {
          if (step.step.toLowerCase().includes(status.toLowerCase())) {
            return { ...step, done: true, timestamp: now };
          }
          return step;
        });
        return {
          ...o,
          orderStatus: status,
          trackingSteps: updatedSteps,
        };
      })
    );
    showToast(`Order #${orderId} status set to ${status}`);
  };

  const handleResetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setQuotes([]);
    showToast('Restored default demo products and orders');
  };

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    navigateTab('shop');
  };

  const handleSearchSubmit = (query: string, category?: string) => {
    setSearchFilter(query);
    if (category && category !== 'All') {
      setSelectedCategory(category);
    }
    navigateTab('shop');
  };

  const handleOpenBulkQuoteWithProduct = (product: Product) => {
    setBulkQuoteProduct(product);
    navigateTab('bulk');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 selection:bg-[#0c432d] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0c432d] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-700 text-xs font-bold animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'categories') {
            setSelectedCategory('All');
            navigateTab('shop');
          } else {
            navigateTab(tab);
          }
        }}
        cartCount={totalCartCount}
        cartTotal={totalCartAmount}
        openCart={() => setIsCartOpen(true)}
        wishlistCount={wishlistProductIds.size}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenBulkQuote={() => {
          setBulkQuoteProduct(null);
          navigateTab('bulk');
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onSearchSubmit={handleSearchSubmit}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16 sm:pb-8">
        {currentTab === 'home' && (
          <HomeView
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onOpenBulkQuote={() => {
              setBulkQuoteProduct(null);
              navigateTab('bulk');
            }}
            onOpenBulkQuoteWithProduct={handleOpenBulkQuoteWithProduct}
            onShopNow={() => navigateTab('shop')}
            onSelectCategory={handleSelectCategory}
            cartProductIds={cartProductIds}
            wishlistProductIds={wishlistProductIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentTab === 'shop' && (
          <ShopView
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onOpenBulkQuoteWithProduct={handleOpenBulkQuoteWithProduct}
            cartProductIds={cartProductIds}
            wishlistProductIds={wishlistProductIds}
            onToggleWishlist={handleToggleWishlist}
            initialCategory={selectedCategory}
            initialSearch={searchFilter}
          />
        )}

        {currentTab === 'bulk' && (
          <BulkOrderView
            onBackToShop={() => navigateTab('shop')}
            onNavigateToHome={() => navigateTab('home')}
            preselectedProduct={bulkQuoteProduct}
            onSubmitQuote={(quote) => {
              setQuotes((prev) => [quote, ...prev]);
              showToast(`Quote request #${quote.id} registered`);
            }}
            cartCount={totalCartCount}
          />
        )}

        {currentTab === 'categories' && (
          <ShopView
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onOpenBulkQuoteWithProduct={handleOpenBulkQuoteWithProduct}
            cartProductIds={cartProductIds}
            wishlistProductIds={wishlistProductIds}
            onToggleWishlist={handleToggleWishlist}
            initialCategory="All"
          />
        )}

        {currentTab === 'offers' && (
          <ShopView
            products={products.filter((p) => p.badge || p.originalPrice > p.price)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onOpenBulkQuoteWithProduct={handleOpenBulkQuoteWithProduct}
            cartProductIds={cartProductIds}
            wishlistProductIds={wishlistProductIds}
            onToggleWishlist={handleToggleWishlist}
            initialCategory="All"
          />
        )}

        {currentTab === 'track' && (
          <TrackOrderView orders={orders} initialOrderId={trackOrderId} />
        )}

        {currentTab === 'about' && (
          <AboutView
            onShopNow={() => navigateTab('shop')}
            onOpenBulkQuote={() => {
              setBulkQuoteProduct(null);
              navigateTab('bulk');
            }}
          />
        )}

        {currentTab === 'contact' && <ContactView />}

        {currentTab === 'faq' && <FAQView />}
      </main>

      {/* Footer */}
      <Footer
        setCurrentTab={(tab) => navigateTab(tab)}
        onOpenBulkQuote={() => {
          setBulkQuoteProduct(null);
          navigateTab('bulk');
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Floating Animated WhatsApp Button */}
      <WhatsAppFloatingButton
        onOpenBulkQuote={() => {
          setBulkQuoteProduct(null);
          navigateTab('bulk');
        }}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
      />

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, q) => {
            handleAddToCart(p, q);
            setSelectedProduct(null);
          }}
          onBuyNow={handleBuyNow}
          onOpenBulkQuoteWithProduct={handleOpenBulkQuoteWithProduct}
          allProducts={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        deliveryMethod={deliveryMethod}
        setDeliveryMethod={setDeliveryMethod}
      />

      {/* Checkout Form Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        couponCode={couponCode}
        deliveryMethod={deliveryMethod}
        setDeliveryMethod={setDeliveryMethod}
        onInitiatePayment={handleInitiatePayment}
      />

      {/* Simulated Razorpay Modal */}
      {pendingOrderDraft && (
        <RazorpayModal
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
          orderTotal={pendingOrderDraft.total}
          orderDraft={pendingOrderDraft}
          onPaymentSuccess={(paymentId) => {
            completeOrderPlacement(pendingOrderDraft, 'paid');
          }}
        />
      )}

      {/* Order Confirmation & Receipt Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={(orderId) => {
          setTrackOrderId(orderId);
          setCurrentTab('track');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Bulk Quote Modal */}
      <BulkQuoteModal
        isOpen={isBulkQuoteOpen}
        onClose={() => setIsBulkQuoteOpen(false)}
        preselectedProduct={bulkQuoteProduct}
        onSubmitQuote={(quote) => {
          setQuotes((prev) => [quote, ...prev]);
          showToast(`Quote request #${quote.id} registered`);
        }}
        onNavigateToShop={() => {
          setIsBulkQuoteOpen(false);
          navigateTab('shop');
        }}
      />

      {/* Staff Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        quotes={quotes}
        onResetDemoData={handleResetDemoData}
      />

      {/* Contractor & Customer Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}`);
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out successfully');
        }}
      />

      {/* Wishlist Drawer/Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p, q) => handleAddToCart(p, q)}
        onOpenShop={() => navigateTab('shop')}
      />
    </div>
  );
}
