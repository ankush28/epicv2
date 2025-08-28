import React from 'react';
import { Package, ShoppingCart, BarChart3, Plus, LogOut } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  cartItemsCount: number;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  cartItemsCount,
  onLogout
}) => {
  const tabs = [
    { id: 'products' as ActiveTab, label: 'Products', icon: Package },
    { id: 'cart' as ActiveTab, label: 'Cart', icon: ShoppingCart },
    { id: 'history' as ActiveTab, label: 'History', icon: BarChart3 },
    { id: 'add-product' as ActiveTab, label: 'Add', icon: Plus }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
      <div className="flex justify-around items-center">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors relative ${
              activeTab === id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
            
            {id === 'cart' && cartItemsCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </div>
            )}
          </button>
        ))}
        
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};