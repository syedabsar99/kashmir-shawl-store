/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState } from 'react';
import useSettingsStore from '../store/settingsStore';
import api from '../api/axios';

export default function ContactPage() {
  const { email, phoneNumber, isInitialized } = useSettingsStore();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/messages', formData);
      setSent(true);
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header" style={{ padding: '80px 0', background: '#111', color: 'white', opacity: isInitialized ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <div className="container text-center">
          <p style={{ letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', fontSize: '11px', fontWeight: 600, marginBottom: '16px' }}>Concierge</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 56px)' }}>Get in Touch</h1>
          <p style={{ color: 'var(--gray-300)', marginTop: '16px', fontSize: '16px', maxWidth: '500px', margin: '16px auto 0' }}>
            We are here to assist you with bespoke queries, styling advice, and support.
          </p>
        </div>
      </div>

      <section className="section" style={{ opacity: isInitialized ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'start' }}>
            
            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '24px' }}>Visit Us</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '48px', fontSize: '15px' }}>
                Our operations originate deep within the Kashmir Valley, where our artisans weave heritage into every piece. While our weaving centers are private, our digital concierge is always available.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '54px', height: '54px', background: 'var(--gray-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--crimson)' }}>
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div style={{ paddingTop: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Phone Support</div>
                    <a href={`tel:${phoneNumber?.replace(/\s+/g, '')}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '15px' }}>{phoneNumber || '+91 99999 99999'}</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '54px', height: '54px', background: 'var(--gray-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--crimson)' }}>
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div style={{ paddingTop: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Email Inquiries</div>
                    <a href={`mailto:${email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '15px' }}>{email || 'support@kashur-mart.com'}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card" style={{ padding: '40px 32px', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
              {sent ? (
                <div className="text-center" style={{ padding: '40px 0' }}>
                  <div style={{ width: '80px', height: '80px', background: 'var(--emerald)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>✓</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px' }}>Message Sent</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>Our luxury concierges will review your inquiry and respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '32px' }}>Send a Message</h3>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Full Name</label>
                    <input type="text" className="form-input" style={{ background: 'var(--gray-50)', border: 'none', padding: '16px', borderRadius: '8px' }} placeholder="Your Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Email Address</label>
                    <input type="email" className="form-input" style={{ background: 'var(--gray-50)', border: 'none', padding: '16px', borderRadius: '8px' }} placeholder="Your Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Message</label>
                    <textarea className="form-input" rows="5" style={{ background: 'var(--gray-50)', border: 'none', padding: '16px', borderRadius: '8px', resize: 'none' }} placeholder="How can we assist you today?" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-full mt-16" style={{ padding: '18px' }} disabled={loading}>
                    {loading ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}
