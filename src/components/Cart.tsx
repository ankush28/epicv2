import React from 'react';
import { ShoppingCart, Plus, Minus, Check, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onConfirmSale: () => void;
}

export const Cart: React.FC<CartProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onConfirmSale
}) => {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.retailPrice * item.cartQuantity,
    0
  );

  const totalProfit = cartItems.reduce(
    (sum, item) => sum + (item.retailPrice - item.wholesalePrice) * item.cartQuantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cart</h1>
        
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
          <p className="text-gray-400">Add some products to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Cart</h1>
      
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-blue-600 font-medium">₹{item.retailPrice} each</p>
              </div>
              
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.cartQuantity - 1)}
                  disabled={item.cartQuantity <= 1}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                
                <span className="font-semibold text-lg min-w-[2rem] text-center">
                  {item.cartQuantity}
                </span>
                
                <button
                  onClick={() => onUpdateQuantity(item.id, item.cartQuantity + 1)}
                  disabled={item.cartQuantity >= item.quantity}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">
                  ₹{item.retailPrice * item.cartQuantity}
                </p>
                <p className="text-sm text-gray-500">
                  Profit: ₹{(item.retailPrice - item.wholesalePrice) * item.cartQuantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Items:</span>
            <span className="font-medium">
              {cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Profit:</span>
            <span className="font-medium text-green-600">₹{totalProfit}</span>
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-blue-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={onConfirmSale}
        className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-green-700 active:bg-green-800 transition-colors"
      >
        <Check className="h-5 w-5" />
        <span>Confirm Sale</span>
      </button>
    </div>
  );
};