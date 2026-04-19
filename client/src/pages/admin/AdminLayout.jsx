/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useSettingsStore from '../../store/settingsStore';

const navItems = [
  { icon: '📊', label: 'Dashboard', to: '/admin' },
  { icon: '✉️', label: 'Inquiries', to: '/admin/messages' },
  { icon: '🧣', label: 'Products', to: '/admin/products' },
  { icon: '📦', label: 'Orders', to: '/admin/orders' },
  { icon: '🗂️', label: 'Categories', to: '/admin/categories' },
  { icon: '📄', label: 'Pages', to: '/admin/pages' },
  { icon: '🚚', label: 'Shipping Zones', to: '/admin/shipping' },
  { icon: '⚙️', label: 'Store Settings', to: '/admin/settings' },
];

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuthStore();
  const settings = useSettingsStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo" style={{ opacity: settings.isInitialized ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.logoMain} style={{ height: '32px', width: 'auto', marginBottom: '8px' }} />
          ) : (
            <div className="logo-main">
              {settings.logoMain.split(' ')[0]} <em>{settings.logoMain.split(' ')[1] || ''}</em>
            </div>
          )}
          <div className="logo-sub">{settings.logoSub}</div>
        </div>

        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__group">Navigation</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <div className="admin-sidebar__group" style={{ marginTop: '24px' }}>Account</div>
          <NavLink to="/admin/profile" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`} id="nav-profile">
            <span className="icon">👤</span>
            Profile Settings
          </NavLink>
          <NavLink to="/" className="admin-nav-item">
            <span className="icon">🏪</span>
            View Store
          </NavLink>
          <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', textAlign: 'left' }} id="admin-logout-btn">
            <span className="icon">🚪</span>
            Logout
          </button>
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid var(--admin-border)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Logged in as <span style={{ color: 'var(--crimson)', fontWeight: 600 }}>{user?.name}</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h1>{title}</h1>
            <p>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
