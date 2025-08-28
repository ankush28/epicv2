import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { ProductsDashboard } from './components/ProductsDashboard';
import { Cart } from './components/Cart';
import { SalesHistory } from './components/SalesHistory';
import { AddProduct } from './components/AddProduct';
import { Navigation } from './components/Navigation';
import { initialProducts, initialOrders } from './data/dummyData';
import { Product, CartItem, Order, ActiveTab, OrderItem } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // Load data from localStorage on mount
  useEffect(() => {
    // Check if user was previously authenticated
    const authStatus = localStorage.getItem('pos-authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    const savedProducts = localStorage.getItem('pos-products');
    const savedOrders = localStorage.getItem('pos-orders');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('pos-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pos-orders', JSON.stringify(orders));
  }, [orders]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('pos-authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pos-authenticated');
    setCartItems([]); // Clear cart on logout
    setActiveTab('products'); // Reset to products tab
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    const productWithId: Product = {
      ...newProduct,
      id: maxId + 1
    };
    
    setProducts(prev => [...prev, productWithId]);
    setActiveTab('products'); // Switch back to products view
  };
  const handleAddToCart = (product: Product) => {
    if (product.quantity === 0) return;
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.cartQuantity < product.quantity) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, cartQuantity: item.cartQuantity + 1 }
              : item
          );
        }
        return prev;
      } else {
        return [...prev, { ...product, cartQuantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cartQuantity: quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleConfirmSale = () => {
    if (cartItems.length === 0) return;

    // Calculate totals
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.retailPrice * item.cartQuantity,
      0
    );
    
    const totalProfit = cartItems.reduce(
      (sum, item) => sum + (item.retailPrice - item.wholesalePrice) * item.cartQuantity,
      0
    );

    // Create order items
    const orderItems: OrderItem[] = cartItems.map(item => ({
      name: item.name,
      qty: item.cartQuantity,
      price: item.retailPrice * item.cartQuantity
    }));

    // Create new order
    const newOrder: Order = {
      id: Math.max(...orders.map(o => o.id), 100) + 1,
      date: new Date().toISOString().split('T')[0],
      items: orderItems,
      total: totalAmount,
      profit: totalProfit
    };

    // Update products inventory
    setProducts(prev =>
      prev.map(product => {
        const cartItem = cartItems.find(item => item.id === product.id);
        if (cartItem) {
          return {
            ...product,
            quantity: product.quantity - cartItem.cartQuantity
          };
        }
        return product;
      })
    );

    // Add order to history (newest first)
    setOrders(prev => [newOrder, ...prev]);

    // Clear cart
    setCartItems([]);

    // Switch to history tab to show the completed sale
    setActiveTab('history');

    // Show success feedback
    alert('Sale completed successfully!');
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
  const existingCategories = Array.from(new Set(products.map(product => product.category)));

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsDashboard products={products} onAddToCart={handleAddToCart} />;
      case 'cart':
        return (
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onConfirmSale={handleConfirmSale}
          />
        );
      case 'history':
        return <SalesHistory orders={orders} />;
      case 'add-product':
        return (
          <AddProduct
            onAddProduct={handleAddProduct}
            existingCategories={existingCategories}
          />
        );
      default:
        return <ProductsDashboard products={products} onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {renderActiveTab()}
        
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          cartItemsCount={cartItemsCount}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}

export default App;