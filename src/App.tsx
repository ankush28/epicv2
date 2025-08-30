import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { VerifyOTP } from './components/VerifyOTP';
import { ProductsDashboard } from './components/ProductsDashboard';
import { Cart } from './components/Cart';
import { SalesHistory } from './components/SalesHistory';
import { AddProduct } from './components/AddProduct';
import { ManageProducts } from './components/ManageProducts';
import { Navigation } from './components/Navigation';
import { ApiService } from './services/api';
import { initialOrders } from './data/dummyData';
import { Product, CartItem, Order, ActiveTab, OrderItem } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // Load data from localStorage on mount
  useEffect(() => {
    // Check if user was previously authenticated
    const token = ApiService.getToken();
    if (token) {
      setIsAuthenticated(true);
      loadProducts();
    }
    
    const savedOrders = localStorage.getItem('pos-orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    
    setIsLoading(false);
  }, []);

  const loadProducts = async () => {
    try {
      const response = await ApiService.getAllProducts();
      console.log('API Response:', response);
      if (response.success) {
        const data = response.data;
        console.log('Products data:', data);
        setProducts(data);
      } else {
        console.error('API response not successful:', response);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleOTPRequired = (email: string) => {
    setLoginEmail(email);
    setShowOTPVerification(true);
  };

  const handleOTPVerified = (token: string) => {
    setIsAuthenticated(true);
    setShowOTPVerification(false);
    setLoginEmail('');
    loadProducts();
  };

  const handleBackToLogin = () => {
    setShowOTPVerification(false);
    setLoginEmail('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowOTPVerification(false);
    setLoginEmail('');
    ApiService.clearToken();
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
    setActiveTab('products');
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

  const handleConfirmSale = (customerPhone?: string) => {
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
      customerPhone,
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

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show OTP verification screen
  if (showOTPVerification) {
    return (
      <VerifyOTP
        email={loginEmail}
        onVerified={handleOTPVerified}
        onBack={handleBackToLogin}
      />
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <Login
        onLogin={handleOTPVerified}
        onOTPRequired={handleOTPRequired}
      />
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return (
          <ProductsDashboard 
            products={products} 
            onAddToCart={handleAddToCart}
            onNavigate={setActiveTab}
            onLogout={handleLogout}
          />
        );
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
      case 'manage-products':
        return (
          <ManageProducts
            products={products}
            onProductsChange={loadProducts}
          />
        );
      default:
        return (
          <ProductsDashboard 
            products={products} 
            onAddToCart={handleAddToCart}
            onNavigate={setActiveTab}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md lg:max-w-[100%] mx-auto lg:flex-col lg:flex lg:justify-between bg-white min-h-screen lg:shadow-lg">
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