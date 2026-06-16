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
        <div className="account-layout">

          {/* Sidebar */}
          <div className="card account-sidebar">
            <div className="account-sidebar__profile">
              <div className="account-sidebar__avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="account-sidebar__name">{user?.name}</h3>
              <p className="account-sidebar__email">{user?.email}</p>
            </div>
            <div className="account-sidebar__stats">
              <div className="account-sidebar__stat-card">
                <p className="account-sidebar__stat-label">Total Orders</p>
                <p className="account-sidebar__stat-value">{orders.length}</p>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div>
            <h2 className="account-orders__title">Order History</h2>
            {loading ? <Spinner /> : orders.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Start exploring our collection!</p>
                <Link to="/shop" className="btn btn-primary mt-16" id="account-shop-btn">Shop Now</Link>
              </div>
            ) : (
              <div className="account-orders-list">
                {orders.map(order => (
                  <div key={order._id} className="card account-order-card">
                    <div className="flex-between mb-16 account-order-card__header">
                      <div>
                        <p className="account-order-card__number">{order.orderNumber}</p>
                        <p className="account-order-card__date">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="account-order-card__badges">
                        <span className={`badge ${order.paymentMethod === 'cod' ? 'badge-cod' : 'badge-paid'}`}>
                          {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                        </span>
                        <span className={`badge ${statusColors[order.status] || 'badge-pending'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="account-order-card__images">
                      {order.items.slice(0, 3).map((item, i) => (
                        <img
                          key={i}
                          src={item.image || 'https://placehold.co/60x75/3D2B1F/C4972A?text=Shawl'}
                          alt={item.name}
                          className="account-order-card__thumb"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="account-order-card__more">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex-between">
                      <span className="account-order-card__count">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                      </span>
                      <span className="account-order-card__total">
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
