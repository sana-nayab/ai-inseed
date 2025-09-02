import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketEvents {
  'order.created': (data: { orderId: string; queueNumber: number; status: string }) => void;
  'order.status_updated': (data: { orderId: string; queueNumber: number; status: string }) => void;
  'payment.completed': (data: { orderId: string; queueNumber: number; status: string }) => void;
  'payment.status_updated': (data: { orderId: string; paymentStatus: string; amount: number }) => void;
}

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinOrderRoom = (orderId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join_order', orderId);
    }
  };

  const on = <K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = <K extends keyof SocketEvents>(event: K, callback?: SocketEvents[K]) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    joinOrderRoom,
    on,
    off,
    isConnected: socketRef.current?.connected || false,
  };
};