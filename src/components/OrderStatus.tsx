import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, ChefHat, Bell } from 'lucide-react';
import { Order } from '../types';
import { useSocket } from '../hooks/useSocket';

interface OrderStatusProps {
  order: Order;
  onClose: () => void;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ order, onClose }) => {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const { on, off, joinOrderRoom } = useSocket();

  useEffect(() => {
    // Join order room for real-time updates
    joinOrderRoom(order.id);
    
    // Listen for status updates
    const handleStatusUpdate = (data: { orderId: string; status: string }) => {
      if (data.orderId === order.id) {
        setCurrentStatus(data.status as Order['status']);
      }
    };
    
    on('order.status_updated', handleStatusUpdate);
    on('payment.completed', handleStatusUpdate);
    
    return () => {
      off('order.status_updated', handleStatusUpdate);
      off('payment.completed', handleStatusUpdate);
    };
  }, [order.id, on, off, joinOrderRoom]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'preparing':
        return <ChefHat className="w-8 h-8 text-blue-500" />;
      case 'ready':
        return <Bell className="w-8 h-8 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      default:
        return <Clock className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Being Prepared';
      case 'ready':
        return 'Ready for Pickup';
      case 'completed':
        return 'Order Complete';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            {getStatusIcon(currentStatus)}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Queue #{order.queueNumber}
          </h2>
          
          <p className="text-lg text-gray-600 mb-6">
            {getStatusMessage(currentStatus)}
          </p>

          {/* Status Timeline */}
          <div className="flex justify-between items-center mb-8">
            {['confirmed', 'preparing', 'ready', 'completed'].map((status, index) => (
              <div key={status} className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${
                  ['confirmed', 'preparing', 'ready', 'completed'].indexOf(currentStatus) >= index
                    ? 'bg-orange-600'
                    : 'bg-gray-300'
                }`} />
                <span className="text-xs text-gray-500 mt-2 capitalize">{status}</span>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>{item.quantity}x {item.name}</span>
                <span>₱{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₱{order.total}</span>
              </div>
            </div>
          </div>

          {currentStatus === 'completed' && (
            <button
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold transition-colors"
            >
              Complete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};