/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useToast from '../hooks/useToast';
import Spinner from '../components/Spinner';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [form, setForm] = useState({
    name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India'
  });

  const subtotal = totalPrice();

  if (items.length === 0) return (
    <div className="section"><div className="empty-state">
      <div className="icon">🛒</div><h3>Your cart is empty</h3>
      <Link to="/shop" className="btn btn-primary mt-16">Go Shopping</Link>
    </div></div>
  );

  const checkShipping = async () => {
    if (!form.pincode || form.pincode.length < 6) return;
    setShippingLoading(true);
    try {
      const r = await api.post('/orders/shipping-rate', { pincode: form.pincode });
      setShippingCost(r.data.rate);
      setShippingInfo(r.data);
    } catch {
      setShippingCost(150);
    } finally {
      setShippingLoading(false);
    }
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (shippingCost === null) { showToast('Please check shipping for your pincode', 'error'); return; }
    setLoading(true);

    const orderItems = items.map(i => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.images?.[0],
      price: i.price,
      quantity: i.quantity,
      variant: i.variant
    }));

    try {
      const r = await api.post('/orders/create', {
        items: orderItems,
        shippingAddress: form,
        paymentMethod,
        shippingCost,
        itemsTotal: subtotal
      });

      if (paymentMethod === 'cod') {
        clearCart();
        navigate(`/order-confirmation/${r.data.order._id}`);
        return;
      }

      // Razorpay
      const options = {
        key: r.data.key,
        amount: Math.round((subtotal + shippingCost) * 100),
        currency: 'INR',
        name: 'Saadat Shawl House',
        description: 'Authentic Kashmiri Shawls',
        order_id: r.data.razorpayOrderId,
        handler: async (response) => {
          await api.post('/orders/verify', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });
          clearCart();
          navigate(`/order-confirmation/${r.data.order._id}`);
        },
        prefill: { name: form.name, contact: form.phone },
        theme: { color: '#8B1A1A' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Order failed';
      showToast(errorMsg, 'error');
      
      if (errorMsg.includes('invalid or outdated products') || errorMsg.includes('no longer available')) {
        setTimeout(() => {
          window.location.reload(); // Auto-reload to let cartStore filter out invalid items
        }, 2500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="container"><h1>Checkout</h1></div>
      </div>

      <div className="container section">
        <form onSubmit={handleSubmit}>
          <div className="cart-layout">

            {/* LEFT: Shipping + Payment */}
            <div className="checkout-left">

              {/* Shipping Address */}
              <div className="card checkout-card">
                <h3 className="checkout-card__title">
                  📦 Shipping Address
                </h3>
                <div className="checkout-form-grid">
                  {[
                    { label: 'Full Name', name: 'name', placeholder: 'Your full name' },
                    { label: 'Phone', name: 'phone', placeholder: '10-digit mobile number' },
                    { label: 'Street / Area', name: 'street', placeholder: 'House no., Street, Area', full: true },
                    { label: 'City', name: 'city', placeholder: 'City' },
                    { label: 'State', name: 'state', placeholder: 'State' },
                    { label: 'Pincode', name: 'pincode', placeholder: '6-digit pincode' },
                  ].map(({ label, name, placeholder, full }) => (
                    <div key={name} className={`form-group${full ? ' checkout-form-grid--full' : ''}`}>
                      <label className="form-label" htmlFor={`addr-${name}`}>{label}</label>
                      <input
                        id={`addr-${name}`}
                        name={name}
                        className="form-input"
                        placeholder={placeholder}
                        value={form[name]}
                        onChange={handleChange}
                        required
                        onBlur={name === 'pincode' ? checkShipping : undefined}
                      />
                    </div>
                  ))}
                </div>
                {shippingLoading && <p style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>Calculating shipping…</p>}
                {shippingInfo && (
                  <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(45,90,39,0.08)', borderRadius: '8px', border: '1px solid rgba(45,90,39,0.2)' }}>
                    <p style={{ color: 'var(--emerald)', fontWeight: 600, fontSize: '14px' }}>
                      ✅ {shippingInfo.zone} — {shippingInfo.rate === 0 ? 'Free Shipping' : fmt(shippingInfo.rate)}
                      <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>({shippingInfo.estimatedDays})</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="card checkout-card">
                <h3 className="checkout-card__title">
                  💳 Payment Method
                </h3>
                <div className="checkout-payment-options">
                  {[
                    { value: 'razorpay', label: '💳 Pay Online (Razorpay)', desc: 'Cards, UPI, Net Banking, Wallets' },
                    { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when your order arrives' }
                  ].map(opt => (
                    <label
                      key={opt.value}
                      id={`pay-${opt.value}`}
                      className={`checkout-payment-option${paymentMethod === opt.value ? ' checkout-payment-option--active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)}
                        style={{ accentColor: 'var(--crimson)' }}
                      />
                      <div>
                        <p className="checkout-payment-option__label">{opt.label}</p>
                        <p className="checkout-payment-option__desc">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="card cart-summary">
              <h3 className="cart-summary__title">Order Summary</h3>
              <div className="checkout-summary-items">
                {items.map(item => (
                  <div key={item.key} className="flex-between checkout-summary-row">
                    <span className="checkout-summary-row__name">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="checkout-summary-row__price">{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-summary-totals">
                <div className="flex-between checkout-summary-row">
                  <span>Subtotal</span><span>{fmt(subtotal)}</span>
                </div>
                <div className="flex-between checkout-summary-row">
                  <span>Shipping</span>
                  <span>{shippingCost !== null ? (shippingCost === 0 ? '🎉 Free' : fmt(shippingCost)) : '—'}</span>
                </div>
                <div className="flex-between checkout-summary-total">
                  <span>Total</span>
                  <span className="checkout-summary-total__value">{shippingCost !== null ? fmt(subtotal + shippingCost) : fmt(subtotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                id="place-order-btn"
                className="btn btn-primary btn-full btn-lg"
                style={{ marginTop: '24px' }}
                disabled={loading}
              >
                {loading ? 'Processing…' : paymentMethod === 'cod' ? '📦 Place Order (COD)' : '💳 Pay & Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
