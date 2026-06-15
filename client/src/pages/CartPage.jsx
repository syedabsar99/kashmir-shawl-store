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
        <div className="cart-layout">

          {/* ITEMS */}
          <div className="cart-items-col">
            {items.map(item => (
              <div key={item.key} className="card cart-item">
                <Link to={`/product/${item.product.slug}`}>
                  <img
                    src={item.product.images?.[0] || 'https://placehold.co/100x130/3D2B1F/C4972A?text=Shawl'}
                    alt={item.product.name}
                    className="cart-item__image"
                  />
                </Link>
                <div className="cart-item__body">
                  <div className="cart-item__top">
                    <div>
                      <Link to={`/product/${item.product.slug}`} className="cart-item__name">
                        {item.product.name}
                      </Link>
                      {(item.variant.color || item.variant.size || item.variant.material) && (
                        <p className="cart-item__variant">
                          {[item.variant.color, item.variant.size, item.variant.material].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      id={`remove-${item.key}`}
                      className="cart-item__remove"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>

                  <div className="cart-item__bottom">
                    <div className="cart-qty">
                      <button
                        onClick={() => item.quantity === 1 ? removeItem(item.key) : updateQty(item.key, item.quantity - 1)}
                        id={`dec-${item.key}`}
                        className="cart-qty__btn cart-qty__btn--dec"
                      >
                        −
                      </button>
                      <span className="cart-qty__val">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.key, item.quantity + 1)}
                        id={`inc-${item.key}`}
                        className="cart-qty__btn cart-qty__btn--inc"
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-item__price">
                      {fmt(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="card cart-summary">
            <h3 className="cart-summary__title">Order Summary</h3>
            <div className="cart-summary__rows">
              <div className="flex-between cart-summary__row">
                <span>Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span>
                <span>{fmt(total)}</span>
              </div>
              <div className="flex-between cart-summary__row">
                <span>Shipping</span>
                <span className="emerald">Calculated at checkout</span>
              </div>
            </div>
            <div className="cart-summary__divider">
              <div className="flex-between">
                <span className="cart-summary__total-label">Estimated Total</span>
                <span className="cart-summary__total-value">{fmt(total)}</span>
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
