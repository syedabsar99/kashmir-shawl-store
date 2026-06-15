/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { create } from 'zustand';
import api from '../api/axios';

const useSettingsStore = create((set) => ({
  isInitialized: false,
  logoMain: '',
  logoSub: '',
  logoUrl: null,
  faviconUrl: null,
  phoneNumber: '',
  email: '',
  address: '',
  aboutText: '',
  announcementText: '',
  legacyImage: '',
  banners: [],
  
  initialize: async () => {
    try {
      const response = await api.get('/settings');
      set({ ...response.data, isInitialized: true });
    } catch (err) {
      console.error('Failed to load settings:', err);
      set({ isInitialized: true });
    }
  },
  
  updateSettings: async (newSettings) => {
    try {
      const response = await api.put('/settings', newSettings);
      set(response.data);
    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  }
}));

export default useSettingsStore;
