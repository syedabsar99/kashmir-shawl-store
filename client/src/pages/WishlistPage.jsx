/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import useWishlistStore from '../store/wishlistStore';
import useCartStore from '../store/cartStore';
import useToast from '../hooks/useToast';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore(s => s.addItem);
  const { showToast } = useToast();

  const handleMoveToCart = (product) => {
    addItemToCart(product, {}, 1);
    removeItem(product._id);
    showToast(`${product.name} moved to cart`, 'success');
  };

  if (items.length === 0) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="icon">🤍</div>
          <h3>Your wishlist is empty</h3>
          <p>Explore our collections and save your favorite pieces here.</p>
          <Link to="/shop" className="btn btn-primary mt-20">Browse Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="eyebrow">Saved Items</span>
          <h1>My Wishlist</h1>
        </div>
        <button onClick={clearWishlist} className="btn btn-ghost" style={{ fontSize: '13px' }}>
          Clear All
        </button>
      </div>

      <div className="admin-table-wrapper" style={{ border: 'none', background: 'none' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(product => (
              <tr key={product._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link to={`/product/${product.slug}`} style={{ width: '80px', height: '100px', borderRadius: '8px', overflow: 'hidden', background: 'var(--gray-50)', display: 'block' }}>
                      <img 
                        src={product.images?.[0] || 'https://placehold.co/400x530/F5F5F5/9E9E9E?text=Kashmiri+Shawl'} 
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                    <div>
                      <Link to={`/product/${product.slug}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {product.name}
                      </Link>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {product.category?.name || 'Handmade'}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{fmt(product.price)}</td>
                <td>
                  <span className={`badge ${product.stock > 0 ? 'badge-confirmed' : 'badge-cancelled'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleMoveToCart(product)} 
                      className="btn btn-primary btn-sm"
                      disabled={product.stock === 0}
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => removeItem(product._id)} 
                      className="btn btn-ghost btn-sm"
                      title="Remove from wishlist"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
