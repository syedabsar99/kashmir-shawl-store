/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { create } from 'zustand';

const CART_KEY = 'km_cart';

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
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
