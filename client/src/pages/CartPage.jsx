/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice } = useCartStore();
  const total = totalPrice();

  if (items.length === 0) return (
    <div className="section">
      <div className="empty-state">
        <div className="icon">🛒</div>
        <h3>Your Cart is Empty</h3>
        <p>Explore our collection and find something beautiful</p>
        <Link to="/shop" className="btn btn-primary mt-24" id="cart-shop-btn">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>

          {/* ITEMS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map(item => (
              <div
                key={item.key}
                className="card"
                style={{ display: 'flex', gap: '20px', padding: '20px' }}
              >
                <Link to={`/product/${item.product.slug}`}>
                  <img
                    src={item.product.images?.[0] || 'https://placehold.co/100x130/3D2B1F/C4972A?text=Shawl'}
                    alt={item.product.name}
                    style={{ width: '100px', height: '130px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  />
                </Link>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Link to={`/product/${item.product.slug}`} style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--text-primary)' }}>
                        {item.product.name}
                      </Link>
                      {(item.variant.color || item.variant.size || item.variant.material) && (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {[item.variant.color, item.variant.size, item.variant.material].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      id={`remove-${item.key}`}
                      style={{ color: 'var(--text-muted)', fontSize: '20px', lineHeight: 1, cursor: 'pointer', background: 'none', border: 'none' }}
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                      <button
                        onClick={() => item.quantity === 1 ? removeItem(item.key) : updateQty(item.key, item.quantity - 1)}
                        id={`dec-${item.key}`}
                        style={{ width: '32px', height: '36px', background: 'none', cursor: 'pointer', fontSize: '16px', borderRight: '1px solid var(--border)' }}
                      >
                        −
                      </button>
                      <span style={{ width: '36px', textAlign: 'center', fontSize: '14px', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.key, item.quantity + 1)}
                        id={`inc-${item.key}`}
                        style={{ width: '32px', height: '36px', background: 'none', cursor: 'pointer', fontSize: '16px', borderLeft: '1px solid var(--border)' }}
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--crimson)' }}>
                      {fmt(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="card" style={{ padding: '28px', position: 'sticky', top: '88px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '20px' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div className="flex-between" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span>
                <span>{fmt(total)}</span>
              </div>
              <div className="flex-between" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--emerald)' }}>Calculated at checkout</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '24px' }}>
              <div className="flex-between">
                <span style={{ fontWeight: 700, fontSize: '16px' }}>Estimated Total</span>
                <span style={{ fontWeight: 700, fontSize: '22px', color: 'var(--crimson)' }}>{fmt(total)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-full btn-lg" id="proceed-checkout-btn">
              Proceed to Checkout →
            </Link>
            <Link to="/shop" className="btn btn-ghost btn-full mt-12" id="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
