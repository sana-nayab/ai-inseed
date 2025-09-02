import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { Menu } from './components/Menu';
import { CartDrawer } from './components/CartDrawer';
import { OrderStatus } from './components/OrderStatus';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useMenu } from './hooks/useMenu';
import { useCart } from './hooks/useCart';
import { orderService } from './utils/orderService';
import { Order } from './types';

function App() {
  const { menuData, loading, error } = useMenu();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Set initial category when menu loads
  useEffect(() => {
    if (menuData && menuData.categories.length > 0 && !activeCategory) {
      setActiveCategory(menuData.categories[0].id);
    }
  }, [menuData]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const order = await orderService.createOrder({ 
        items: cart, 
        total: getTotalPrice() 
      });
      setCurrentOrder(order);
      clearCart();
      setIsCartOpen(false);
    } catch (error) {
      console.error('Checkout failed:', error);
      // In real app, show error toast
    }
  };

  const handleOrderComplete = () => {
    setCurrentOrder(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error || !menuData) return <ErrorMessage message={error || 'Failed to load menu'} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus />
      
      <Header
        cartItemCount={getTotalItems()}
        onCartClick={() => setIsCartOpen(true)}
      />

      <CategoryTabs
        categories={menuData.categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <Menu
        categories={menuData.categories}
        activeCategory={activeCategory}
        onAddToCart={addToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        total={getTotalPrice()}
      />

      {currentOrder && (
        <OrderStatus
          order={currentOrder}
          onClose={handleOrderComplete}
        />
      )}

      {/* PWA Install Banner - shows when installable */}
      <div id="install-banner" className="hidden fixed bottom-4 left-4 right-4 bg-orange-600 text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Install Manila Order App</h3>
            <p className="text-sm opacity-90">Add to home screen for full-screen experience</p>
          </div>
          <button
            id="install-button"
            className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;