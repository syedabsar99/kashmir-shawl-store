/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from './AdminLayout';
import useToast from '../../hooks/useToast';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const statusColors = {
  pending: 'badge-pending', confirmed: 'badge-confirmed', processing: 'badge-confirmed',
  shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled'
};

const ALL_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showToast } = useToast();

  const fetchOrders = () => {
    setLoading(true);
    api.get('/admin/orders', { params: { status: statusFilter || undefined, page } })
      .then(r => { setOrders(r.data.orders); setPages(r.data.pages); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, page]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      showToast('Order status updated', 'success');
      fetchOrders();
      if (selectedOrder?._id === id) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
    } catch {
      showToast('Update failed', 'error');
    }
  };

  return (
    <AdminLayout title="Orders">
      {/* Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="serif">Order Details — {selectedOrder.orderNumber}</h2>
              <button className="admin-btn admin-btn-ghost" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="admin-modal-content">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--admin-muted)', marginBottom: '12px' }}>Shipping Address</h3>
                  <p style={{ fontWeight: 600, fontSize: '16px' }}>{selectedOrder.shippingAddress.name}</p>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                  <p>📞 {selectedOrder.shippingAddress.phone}</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--admin-muted)', marginBottom: '12px' }}>Order Info</h3>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
                  <p><strong>Payment:</strong> <span style={{ textTransform: 'uppercase' }}>{selectedOrder.paymentMethod}</span> ({selectedOrder.paymentStatus})</p>
                  <p><strong>Total Amount:</strong> {fmt(selectedOrder.totalAmount)}</p>
                </div>
              </div>

              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--admin-muted)', marginBottom: '16px' }}>Products ({selectedOrder.items.length})</h3>
              <div className="admin-order-items-list">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="admin-order-item">
                    <img src={item.image || 'https://placehold.co/80x100/3D2B1F/C4972A?text=Shawl'} alt={item.name} />
                    <div className="admin-order-item-info">
                      <h4>{item.name}</h4>
                      <p>
                        {item.variant?.color && <span>Color: {item.variant.color} • </span>}
                        {item.variant?.size && <span>Size: {item.variant.size} • </span>}
                        {item.variant?.material && <span>Material: {item.variant.material}</span>}
                      </p>
                      <p style={{ marginTop: '8px', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {fmt(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{fmt(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '32px', textAlign: 'right' }}>
                <select 
                  className="admin-select" 
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                  style={{ width: '200px' }}
                >
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          id="filter-all"
          className={`admin-btn ${!statusFilter ? 'admin-btn-gold' : 'admin-btn-ghost'}`}
          onClick={() => { setStatusFilter(''); setPage(1); }}
        >
          All Orders
        </button>
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            id={`filter-${s}`}
            className={`admin-btn ${statusFilter === s ? 'admin-btn-gold' : 'admin-btn-ghost'}`}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            style={{ textTransform: 'capitalize' }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>No orders found</td></tr>
            ) : orders.map(order => (
              <tr key={order._id}>
                <td style={{ fontWeight: 700, color: 'var(--admin-gold)' }}>{order.orderNumber}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{order.user?.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {order.items.slice(0, 3).map((item, i) => (
                      <img 
                        key={i} 
                        src={item.image || 'https://placehold.co/40x50/3D2B1F/C4972A?text=S'} 
                        alt="" 
                        style={{ width: '32px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }}
                      />
                    ))}
                    {order.items.length > 3 && <div style={{ fontSize: '11px', alignSelf: 'center', color: 'var(--admin-muted)' }}>+{order.items.length - 3}</div>}
                  </div>
                </td>
                <td>
                  <span className={`badge ${order.paymentMethod === 'cod' ? 'badge-cod' : 'badge-paid'}`}>
                    {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                  </span>
                </td>
                <td style={{ fontWeight: 700 }}>{fmt(order.totalAmount)}</td>
                <td>
                  <span className={`badge ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td>
                  <button 
                    className="admin-btn admin-btn-ghost" 
                    id={`view-order-${order._id}`}
                    onClick={() => setSelectedOrder(order)}
                    style={{ fontSize: '11px', padding: '6px 10px' }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex-center gap-8 mt-24">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              id={`order-page-${p}`}
              className={`admin-btn ${p === page ? 'admin-btn-gold' : 'admin-btn-ghost'}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
