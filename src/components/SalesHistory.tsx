import React from 'react';
import { Calendar, DollarSign, TrendingUp, ShoppingBag, Phone } from 'lucide-react';
import { Order } from '../types';

interface SalesHistoryProps {
  orders: Order[];
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({ orders }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProfit = orders.reduce((sum, order) => sum + order.profit, 0);

  return (
    <div className="p-4 pb-20 lg:pb-4 lg:pt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sales History</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">₹{totalRevenue}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Profit</p>
              <p className="text-2xl font-bold text-green-600">₹{totalProfit}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-purple-600">{orders.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Order</p>
              <p className="text-2xl font-bold text-orange-600">
                ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No sales yet</p>
          <p className="text-gray-400">Start selling to see your history here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{formatDate(order.date)}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{order.customerPhone}</span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-500">#{order.id}</span>
              </div>
              
              <div className="mb-3">
                <h3 className="font-medium text-gray-900 mb-2">Items Sold:</h3>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.qty}
                      </span>
                      <span className="text-gray-600">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-gray-900">₹{order.total}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profit:</span>
                  <span className="font-semibold text-green-600">₹{order.profit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};