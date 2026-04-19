/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import useSettingsStore from '../store/settingsStore';
import api from '../api/axios';

export default function Navbar() {
  const settings = useSettingsStore();
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const wishlistItems = useWishlistStore(s => s.items);
  const cartItems = useCartStore(s => s.items);
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

  const topLevelCategories = categories.filter(c => !c.parent && c.isActive !== false);
  const mainCategories = topLevelCategories.filter(c => c.showInNavbar !== false);
  const moreCategories = topLevelCategories.filter(c => c.showInNavbar === false);

  const getSubcategories = (parentId) => categories.filter(c => c.parent?._id === parentId);

  const toggleGroup = (id) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    
    // Fetch categories for dynamic menu statically for maximum speed
    api.get('/categories').then(r => setCategories(r.data.categories)).catch(console.error);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMobileMenuOpen(false); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      <div className="announce-bar" style={{ opacity: settings.isInitialized ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <div className="announce-bar__inner">
          <div className="announce-bar__left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <a href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}>{settings.phoneNumber}</a>
          </div>
          <div className="announce-bar__center">
            {settings.announcementText}
          </div>
          <div className="announce-bar__right">
            <span>KASHMIR</span>
            <span>INR ₹</span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* Left: Hamburger (Mobile Only) */}
          <div className="navbar__mobile-nav">
            <button 
              className="navbar__hamburger" 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <form className="navbar__search-wrap mobile-search" onSubmit={handleSearch}>
              <input 
                type="text" 
                className="navbar__search-input" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search"
              />
              <div className="navbar__search-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
              </div>
            </form>
          </div>

          {/* Left: nav links (Desktop Only) */}
          <div className="navbar__nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>About Us</NavLink>
            
            {/* Main Categories */}
            {mainCategories.map(parent => {
              const children = getSubcategories(parent._id);
              return (
                <div 
                  key={parent._id} 
                  className="navbar__nav-item"
                  onMouseEnter={() => setActiveMegaMenu(parent._id)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <NavLink to={`/shop?category=${parent._id}`}>
                    {parent.name}
                    {children.length > 0 && <span className="chevron"></span>}
                  </NavLink>

                  {children.length > 0 && (
                    <div className={`megamenu ${activeMegaMenu === parent._id ? 'active' : ''}`} style={{ width: '1000px', left: '50%', transform: 'translateX(-50%)' }}>
                      <div className="megamenu__inner" style={{ display: 'flex', gap: '40px' }}>
                        <div style={{ flex: 1, columnCount: parent.image ? 4 : 5, columnGap: '40px' }}>
                          {children.map(child => {
                            const grandchildren = getSubcategories(child._id);
                            return (
                              <div className="megamenu__col" key={child._id} style={{ breakInside: 'avoid', marginBottom: '32px' }}>
                                <Link 
                                  to={`/shop?category=${child._id}`} 
                                  onClick={() => setActiveMegaMenu(null)}
                                  style={{ display: 'block', marginBottom: '14px', textDecoration: 'none' }}
                                >
                                  <h4 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                                    {child.name} {grandchildren.length > 0 && <span style={{ marginLeft: '4px', opacity: 0.5, fontSize: '14px', fontWeight: '400' }}>›</span>}
                                  </h4>
                                </Link>
                                {grandchildren.length > 0 && (
                                  <ul>
                                    {grandchildren.map(gc => (
                                      <li key={gc._id}>
                                        <Link 
                                          to={`/shop?category=${gc._id}`} 
                                          onClick={() => setActiveMegaMenu(null)}
                                        >
                                          {gc.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {parent.image && (
                          <div className="megamenu__promo" style={{ width: '280px', flexShrink: 0 }}>
                            <img src={parent.image} alt={parent.name} />
                            <div className="promo-tag">Featured</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Overflow Dropdown */}
            {moreCategories.length > 0 && (
              <div 
                className="navbar__nav-item"
                onMouseEnter={() => setActiveMegaMenu('more-dropdown')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <div className="nav-more-btn">
                  More <span className="chevron"></span>
                </div>
                <div className={`megamenu ${activeMegaMenu === 'more-dropdown' ? 'active' : ''}`} style={{ width: '1000px', left: '50%', transform: 'translateX(-50%)' }}>
                  <div className="megamenu__inner">
                    <div style={{ columnCount: 5, columnGap: '40px' }}>
                      {moreCategories.map(parent => {
                        const children = getSubcategories(parent._id);
                        return (
                          <div className="megamenu__col" key={parent._id} style={{ breakInside: 'avoid', marginBottom: '32px' }}>
                            <Link 
                              to={`/shop?category=${parent._id}`} 
                              onClick={() => setActiveMegaMenu(null)}
                              style={{ display: 'block', marginBottom: '14px', textDecoration: 'none' }}
                            >
                              <h4 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                                {parent.name} {children.length > 0 && <span style={{ marginLeft: '4px', opacity: 0.5, fontSize: '14px', fontWeight: '400' }}>›</span>}
                              </h4>
                            </Link>
                            {children.length > 0 && (
                              <ul>
                                {children.map(child => (
                                  <li key={child._id}>
                                    <Link 
                                      to={`/shop?category=${child._id}`} 
                                      onClick={() => setActiveMegaMenu(null)}
                                    >
                                      {child.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>Contact</NavLink>
          </div>

          {/* Center: logo */}
          <Link to="/" className="navbar__logo" style={{ opacity: settings.isInitialized ? 1 : 0, transition: 'opacity 0.4s ease' }}>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.logoMain} style={{ height: '38px', width: 'auto' }} />
            ) : (
              <>
                <span className="logo-main">
                  {settings.logoMain.split(' ')[0][0] && (
                    <em>{settings.logoMain[0]}</em>
                  )}
                  {settings.logoMain.slice(1)}
                </span>
                <span className="logo-sub">{settings.logoSub}</span>
              </>
            )}
          </Link>

          {/* Right: actions */}
          <div className="navbar__actions">
            <form className="navbar__search-wrap desktop-search" onSubmit={handleSearch}>
              <input 
                type="text" 
                className="navbar__search-input" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search"
              />
              <div className="navbar__search-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
              </div>
            </form>
            {user ? (
              <>
                <Link to="/account" className="navbar__icon-btn" aria-label="My Account" id="nav-account">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </Link>
                <button onClick={handleLogout} className="navbar__icon-btn" aria-label="Logout" id="nav-logout" title="Logout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar__icon-btn" aria-label="Login" id="nav-login">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
            <Link to="/wishlist" className="navbar__icon-btn" aria-label="Wishlist" id="nav-wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="navbar__cart-count" style={{ background: 'var(--crimson)' }}>{wishlistItems.length}</span>
              )}
            </Link>
            <Link to="/cart" className="navbar__icon-btn" aria-label="Cart" id="nav-cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="navbar__cart-count">{totalItems > 9 ? '9+' : totalItems}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer__overlay" onClick={closeMobileMenu}></div>
        <div className="mobile-drawer__content">
          <div className="mobile-drawer__header">
            <div className="navbar__logo" style={{ margin: 0 }}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.logoMain} style={{ height: '32px', width: 'auto' }} />
              ) : (
                <span className="logo-main"><em>{settings.logoMain[0]}</em>{settings.logoMain.slice(1).split(' ')[0]}</span>
              )}
            </div>
            <button className="mobile-drawer__close" onClick={closeMobileMenu}>×</button>
          </div>
            <div className="mobile-drawer__nav">
            <Link to="/" onClick={closeMobileMenu}>Home</Link>
            <Link to="/about" onClick={closeMobileMenu}>About Us</Link>
            <Link to="/shop" onClick={closeMobileMenu}>Shop All</Link>
            
            <div className="mobile-drawer__divider">Categories</div>
            {topLevelCategories.map(parent => {
              const subs = getSubcategories(parent._id);
              const isExpanded = expandedGroups[parent._id];
              return (
                <div key={parent._id} className="mobile-drawer__group">
                  <div className="mobile-drawer__parent-row">
                    <Link to={`/shop?category=${parent._id}`} onClick={closeMobileMenu}>
                      {parent.name}
                    </Link>
                    {subs.length > 0 && (
                      <button 
                        className={`mobile-drawer__toggle ${isExpanded ? 'active' : ''}`} 
                        onClick={() => toggleGroup(parent._id)}
                      >
                        {isExpanded ? '−' : '+'}
                      </button>
                    )}
                  </div>
                  {subs.length > 0 && isExpanded && (
                    <div className="mobile-drawer__subs">
                      {subs.map(sub => (
                        <Link key={sub._id} to={`/shop?category=${sub._id}`} onClick={closeMobileMenu}>
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mobile-drawer__divider" style={{ marginTop: '32px' }}>Support</div>
            <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
          </div>
          <div className="mobile-drawer__footer">
            <p>Need support?</p>
            <a href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}>{settings.phoneNumber}</a>
          </div>
        </div>
      </div>
    </>
  );
}
