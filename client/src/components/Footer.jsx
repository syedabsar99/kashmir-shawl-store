/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import useSettingsStore from '../store/settingsStore';

export default function Footer() {
  const settings = useSettingsStore();
  const [dynamicPages, setDynamicPages] = useState([]);

  useEffect(() => {
    api.get('/pages?showInFooter=true').then(r => setDynamicPages(r.data.pages)).catch(() => {});
  }, []);

  return (
    <footer className="footer" style={{ opacity: settings.isInitialized ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      <div className="container">
        <div className="footer__grid">

          {/* Brand column */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 4 }}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.logoMain} style={{ height: '32px', width: 'auto' }} />
              ) : (
                <span className="footer__brand-logo">
                  <em>{settings.logoMain[0]}</em>{settings.logoMain.slice(1)}
                </span>
              )}
            </Link>
            <span className="footer__brand-sub">{settings.logoSub}</span>
            <p className="footer__brand-desc">
              {settings.aboutText}
            </p>
            <div className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {settings.address}
            </div>
            <div className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href={`mailto:${settings.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {settings.email}
              </a>
            </div>
            <div className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {settings.phoneNumber}
              </a>
            </div>
            <div className="footer__socials">
              {/* Facebook */}
              <a href="#" className="footer__social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="footer__social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="footer__social-btn" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4>Quick Link</h4>
            <ul>
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/shop?featured=true">Wishlist</Link></li>
              <li><Link to="/shop">All Shawls</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div className="footer__col">
            <h4>Information</h4>
            <ul>
              {dynamicPages.map(p => (
                <li key={p._id}><Link to={`/pages/${p.slug}`}>{p.title}</Link></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="footer__newsletter-title">Join Our Newsletter</p>
            <p className="footer__newsletter-sub">
              Get email updates about our latest collections and special offers.
            </p>
            <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                className="footer__newsletter-input"
                placeholder="Enter your email"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="footer__newsletter-btn">Subscribe</button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom dark bar */}
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Saadat Shawl House. All rights reserved.</span>
        <div className="footer__payment-icons">
          <span className="payment-icon">VISA</span>
          <span className="payment-icon">MC</span>
          <span className="payment-icon">UPI</span>
          <span className="payment-icon">Razorpay</span>
          <span className="payment-icon">COD</span>
        </div>
      </div>
    </footer>
  );
}
