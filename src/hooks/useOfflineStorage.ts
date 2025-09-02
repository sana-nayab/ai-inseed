import { openDB, DBSchema } from 'idb';
import { CartItem, Order } from '../types';

interface OrderingDB extends DBSchema {
  cart: {
    key: string;
    value: CartItem;
  };
  orders: {
    key: string;
    value: Order;
  };
  menu: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'dylan-cafe-ordering';
const DB_VERSION = 1;

export const useOfflineStorage = () => {
  const initDB = async () => {
    return openDB<OrderingDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('cart')) {
          db.createObjectStore('cart', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('menu')) {
          db.createObjectStore('menu');
        }
      },
    });
  };

  const saveCart = async (cart: CartItem[]) => {
    const db = await initDB();
    const tx = db.transaction('cart', 'readwrite');
    await tx.store.clear();
    await Promise.all(cart.map(item => tx.store.put(item)));
    await tx.done;
  };

  const loadCart = async (): Promise<CartItem[]> => {
    const db = await initDB();
    return db.getAll('cart');
  };

  const saveOrder = async (order: Order) => {
    const db = await initDB();
    await db.put('orders', order);
  };

  const loadOrders = async (): Promise<Order[]> => {
    const db = await initDB();
    return db.getAll('orders');
  };

  const cacheMenu = async (menuData: any) => {
    const db = await initDB();
    await db.put('menu', menuData, 'current');
  };

  const loadCachedMenu = async () => {
    const db = await initDB();
    return db.get('menu', 'current');
  };

  return {
    saveCart,
    loadCart,
    saveOrder,
    loadOrders,
    cacheMenu,
    loadCachedMenu,
  };
};