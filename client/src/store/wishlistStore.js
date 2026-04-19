/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { create } from 'zustand';

const WISHLIST_KEY = 'km_wishlist';

const loadWishlist = () => {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); }
  catch { return []; }
};

const saveWishlist = (items) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
};

const useWishlistStore = create((set, get) => ({
  items: loadWishlist(),

  addItem: (product) => {
    const items = get().items;
    if (items.some(i => i._id === product._id)) return;
    const newItems = [...items, product];
    saveWishlist(newItems);
    set({ items: newItems });
  },

  removeItem: (id) => {
    const newItems = get().items.filter(i => i._id !== id);
    saveWishlist(newItems);
    set({ items: newItems });
  },

  toggleItem: (product) => {
    const items = get().items;
    const exists = items.some(i => i._id === product._id);
    if (exists) {
      get().removeItem(product._id);
    } else {
      get().addItem(product);
    }
  },

  isInWishlist: (id) => get().items.some(i => i._id === id),
  
  clearWishlist: () => {
    localStorage.removeItem(WISHLIST_KEY);
    set({ items: [] });
  }
}));

export default useWishlistStore;
