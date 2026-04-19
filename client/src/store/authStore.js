/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('km_user') || 'null'),
  token: localStorage.getItem('km_token') || null,

  login: (user, token) => {
    localStorage.setItem('km_user', JSON.stringify(user));
    localStorage.setItem('km_token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('km_user');
    localStorage.removeItem('km_token');
    set({ user: null, token: null });
  },

  updateUser: (user) => {
    localStorage.setItem('km_user', JSON.stringify(user));
    set({ user });
  }
}));

export default useAuthStore;
