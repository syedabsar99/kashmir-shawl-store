/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import Spinner from '../components/Spinner';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const statusColors = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  shipped: 'badge-shipped',
  delivered: 'badge-delivered',
  cancelled: 'badge-cancelled'
};

export default function AccountPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine')
      .then(r => setOrders(r.data.orders))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>My Account</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', alignItems: 'start' }}>

          {/* Sidebar */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--crimson), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '28px', color: 'white', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px' }}>{user?.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{user?.email}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '12px', background: 'rgba(139,26,26,0.05)', borderRadius: '8px', border: '1px solid rgba(139,26,26,0.1)' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</p>
                <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--crimson)', fontFamily: 'var(--font-serif)', marginTop: '4px' }}>{orders.length}</p>
              </div>

            </div>
          </div>

          {/* Orders */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '24px' }}>Order History</h2>
            {loading ? <Spinner /> : orders.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Start exploring our collection!</p>
                <Link to="/shop" className="btn btn-primary mt-16" id="account-shop-btn">Shop Now</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map(order => (
                  <div key={order._id} className="card" style={{ padding: '20px' }}>
                    <div className="flex-between mb-16">
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '15px' }}>{order.orderNumber}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className={`badge ${order.paymentMethod === 'cod' ? 'badge-cod' : 'badge-paid'}`}>
                          {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                        </span>
                        <span className={`badge ${statusColors[order.status] || 'badge-pending'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      {order.items.slice(0, 3).map((item, i) => (
                        <img
                          key={i}
                          src={item.image || 'https://placehold.co/60x75/3D2B1F/C4972A?text=Shawl'}
                          alt={item.name}
                          style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div style={{ width: '60px', height: '75px', borderRadius: '6px', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex-between">
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--crimson)' }}>
                        {fmt(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
