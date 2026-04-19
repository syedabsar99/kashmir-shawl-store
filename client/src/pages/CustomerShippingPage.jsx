/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import React from 'react';

export default function ShippingPage() {
  return (
    <div className="container section">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="eyebrow">Customer Care</span>
        <h1>Shipping &amp; Delivery</h1>
        <p>Reliable global delivery from the heart of Kashmir</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '16px', color: 'var(--text-muted)' }}>
        <div style={{ marginBottom: '40px', background: 'var(--gray-50)', padding: '30px', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Free Worldwide Shipping</h3>
          <p>
            We are pleased to offer **Free Standard Shipping** on all orders above ₹2,000 within India 
            and above $500 for international orders. 
          </p>
        </div>

        <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>1. Processing Time</h3>
        <p style={{ marginBottom: '24px' }}>
          Since each piece is hand-selected and inspected for quality, please allow **2-3 business days** 
          for your order to be processed and dispatched.
        </p>

        <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>2. Estimated Delivery</h3>
        <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>**Domestic (India):** 5-7 business days</li>
          <li style={{ marginBottom: '8px' }}>**International:** 10-15 business days</li>
        </ul>

        <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>3. Tracking Your Order</h3>
        <p style={{ marginBottom: '24px' }}>
          Once your order has shipped, you will receive an email with your tracking number and a link 
          to monitor its progress in real-time.
        </p>

        <div style={{ padding: '32px 0', borderTop: '1px solid var(--gray-100)' }}>
          <p style={{ fontSize: '14px', fontStyle: 'italic' }}>
            Questions? Contact our support team at <a href="tel:+919419012345" style={{ color: 'var(--crimson)', fontWeight: 600 }}>(+91) 94190 12345</a>
          </p>
        </div>
      </div>
    </div>
  );
}
