/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { create } from 'zustand';

const CART_KEY = 'km_cart';

const loadCart = () => {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Automatically remove invalid/mock items in production
    if (!isLocalhost && items.length > 0) {
      const validItems = items.filter(item => 
        item.product && item.product._id && /^[0-9a-fA-F]{24}$/.test(item.product._id)
      );
      if (validItems.length !== items.length) {
        localStorage.setItem(CART_KEY, JSON.stringify(validItems));
        return validItems;
      }
    }
    return items;
  }
  catch { return []; }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const useCartStore = create((set, get) => ({
  items: loadCart(),

  addItem: (product, variant = {}, quantity = 1) => {
    const items = get().items;
    const key = `${product._id}-${variant.color || ''}-${variant.size || ''}-${variant.material || ''}`;
    const existing = items.find(i => i.key === key);

    let newItems;
    if (existing) {
      newItems = items.map(i =>
        i.key === key ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      newItems = [...items, {
        key,
        product,
        variant,
        quantity,
        price: product.price
      }];
    }
    saveCart(newItems);
    set({ items: newItems });
  },

  removeItem: (key) => {
    const newItems = get().items.filter(i => i.key !== key);
    saveCart(newItems);
    set({ items: newItems });
  },

  updateQty: (key, quantity) => {
    if (quantity < 1) return;
    const newItems = get().items.map(i => i.key === key ? { ...i, quantity } : i);
    saveCart(newItems);
    set({ items: newItems });
  },

  clearCart: () => {
    localStorage.removeItem(CART_KEY);
    set({ items: [] });
  },

  totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
  totalPrice: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0)
}));

export default useCartStore;
