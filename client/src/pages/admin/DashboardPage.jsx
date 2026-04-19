/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from './AdminLayout';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const statusColors = {
  pending: 'badge-pending', confirmed: 'badge-confirmed',
  shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled'
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout title="Dashboard">
      <div style={{ color: 'var(--admin-muted)', textAlign: 'center', paddingTop: '60px' }}>Loading…</div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Dashboard">
      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {[
          { icon: '💰', label: 'Total Revenue', value: fmt(stats?.revenue || 0) },
          { icon: '📦', label: 'Total Orders', value: stats?.totalOrders || 0 },
          { icon: '🧣', label: 'Products', value: stats?.totalProducts || 0 },
          { icon: '👥', label: 'Customers', value: stats?.totalUsers || 0 }
        ].map(card => (
          <div key={card.label} className="stat-card">
            <div className="stat-card__icon">{card.icon}</div>
            <div className="stat-card__value">{card.value}</div>
            <div className="stat-card__label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: '8px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--admin-text)', marginBottom: '20px' }}>
          Recent Orders
        </h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--admin-muted)', padding: '40px' }}>No orders yet</td></tr>
              ) : (
                stats?.recentOrders?.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 600, color: 'var(--admin-gold)' }}>{order.orderNumber}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{order.user?.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{fmt(order.totalAmount)}</td>
                    <td><span className={`badge ${statusColors[order.status]}`}>{order.status}</span></td>
                    <td style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
