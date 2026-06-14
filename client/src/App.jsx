import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useSettingsStore from './store/settingsStore';
import { ToastProvider } from './hooks/useToast';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Spinner from './components/Spinner';
import Preloader from './components/Preloader';

// Customer Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DynamicPage from './pages/DynamicPage';

import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ShippingPage from './pages/admin/ShippingPage';
import StoreSettings from './pages/admin/StoreSettings';
import ProfilePage from './pages/admin/ProfilePage';
import CustomPages from './pages/admin/CustomPages';
import AdminMessages from './pages/admin/AdminMessages';

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  const { initialize, isInitialized, faviconUrl } = useSettingsStore();
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized) {
      // Dynamically update document favicon
      if (faviconUrl) {
        // Remove any existing favicon links (including the hardcoded SVG one)
        document.querySelectorAll("link[rel~='icon']").forEach(el => el.remove());
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = faviconUrl;
        document.head.appendChild(link);
      }

      // Show splash screen rings until data sync, then drop the veil
      const dropTimer = setTimeout(() => setShowPreloader(false), 1300);
      return () => clearTimeout(dropTimer);
    }
  }, [isInitialized, faviconUrl]);

  // Show splash screen while paced timer is running or API is still buffering
  if (showPreloader || (!isInitialized && showPreloader)) {
    return <Preloader />;
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
          <Route path="/shop" element={<CustomerLayout><ShopPage /></CustomerLayout>} />
          <Route path="/product/:slug" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
          <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
          <Route path="/pages/:slug" element={<CustomerLayout><DynamicPage /></CustomerLayout>} />
          <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
          <Route path="/contact" element={<CustomerLayout><ContactPage /></CustomerLayout>} />
          <Route path="/wishlist" element={<CustomerLayout><WishlistPage /></CustomerLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          <Route path="/checkout" element={
            <ProtectedRoute>
              <CustomerLayout><CheckoutPage /></CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation/:id" element={
            <ProtectedRoute>
              <CustomerLayout><OrderConfirmationPage /></CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute>
              <CustomerLayout><AccountPage /></CustomerLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ProductsPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><OrdersPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><CategoriesPage /></AdminRoute>} />
          <Route path="/admin/shipping" element={<AdminRoute><ShippingPage /></AdminRoute>} />
          <Route path="/admin/pages" element={<AdminRoute><CustomPages /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><StoreSettings /></AdminRoute>} />
          <Route path="/admin/profile" element={<AdminRoute><ProfilePage /></AdminRoute>} />
          <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
