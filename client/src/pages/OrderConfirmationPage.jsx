/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;

  return (
    <div className="container section" style={{ maxWidth: '680px' }}>
      {/* Success Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Thank you for your purchase. Your Kashmiri shawl is being prepared with care.
        </p>
        {order && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(196,151,42,0.1)', border: '1px solid rgba(196,151,42,0.3)', padding: '8px 20px', borderRadius: '999px', marginTop: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Order Number:</span>
            <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '15px' }}>{order.orderNumber}</span>
          </div>
        )}
      </div>

      {order && (
        <div className="card" style={{ padding: '32px' }}>
          {/* Items */}
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '20px' }}>Your Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src={item.image || 'https://placehold.co/70x90/3D2B1F/C4972A?text=Shawl'}
                  alt={item.name}
                  style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>{item.name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--crimson)' }}>{fmt(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="flex-between" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span><span>{fmt(order.itemsTotal)}</span>
            </div>
            <div className="flex-between" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : fmt(order.shippingCost)}</span>
            </div>
            <div className="flex-between" style={{ fontWeight: 700, fontSize: '18px', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--crimson)' }}>{fmt(order.totalAmount)}</span>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--cream)', borderRadius: '10px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Shipping to:</p>
            <p style={{ fontSize: '14px' }}>
              {order.shippingAddress.name}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            <Link to="/account" className="btn btn-outline" id="view-orders-btn">View My Orders</Link>
            <Link to="/shop" className="btn btn-primary" id="continue-shopping-confirm-btn">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
