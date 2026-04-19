/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import useToast from '../hooks/useToast';
import Spinner from '../components/Spinner';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [qty, setQty] = useState(1);
  const addItem = useCartStore(s => s.addItem);
  const { toggleItem, items: wishlistItems } = useWishlistStore();
  const { showToast } = useToast();

  const isInWishlist = wishlistItems.some(i => i._id === product?._id);

  useEffect(() => {
    api.get(`/products/${slug}`)
      .then(r => { setProduct(r.data.product); })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;
  if (!product) return (
    <div className="empty-state section">
      <div className="icon">❌</div>
      <h3>Product Not Found</h3>
      <Link to="/shop" className="btn btn-primary mt-16">Back to Shop</Link>
    </div>
  );

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const colors = [...new Set(product.variants?.map(v => v.color)?.filter(Boolean) || [])];
  const sizes = [...new Set(product.variants?.map(v => v.size)?.filter(Boolean) || [])];
  const materials = [...new Set(product.variants?.map(v => v.material)?.filter(Boolean) || [])];

  const handleAddToCart = () => {
    addItem(product, selectedVariant, qty);
    showToast(`${product.name} added to cart! 🛒`, 'success');
  };

  return (
    <>
      <div className="container section">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px', alignItems: 'center' }}>
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/shop">Shop</Link>
          <span>›</span>
          <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
          {/* IMAGE GALLERY */}
          <div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '3/4', background: 'var(--cream-dark)', marginBottom: '16px' }}>
              <img
                src={product.images?.[mainImage] || 'https://placehold.co/600x800/3D2B1F/C4972A?text=Kashmiri+Shawl'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    style={{
                      width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden', padding: 0,
                      border: i === mainImage ? '2px solid var(--crimson)' : '2px solid var(--border)',
                      cursor: 'pointer', transition: 'border-color 0.2s'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>
              {product.category?.name}
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px,3vw,36px)', marginBottom: '16px', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--crimson)' }}>{fmt(product.price)}</span>
              {product.comparePrice && (
                <>
                  <span style={{ fontSize: '20px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{fmt(product.comparePrice)}</span>
                  <span style={{ background: 'rgba(45,90,39,0.1)', color: 'var(--emerald)', fontWeight: 700, fontSize: '14px', padding: '4px 10px', borderRadius: '6px' }}>
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="ornament-divider"><span>✦</span></div>

            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-secondary)', margin: '20px 0 28px' }}>
              {product.description}
            </p>

            {/* Variants */}
            {colors.length > 0 && (
              <div className="mb-20">
                <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Color: <span style={{ color: 'var(--text-primary)' }}>{selectedVariant.color || 'Select'}</span>
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {colors.map(c => (
                    <button
                      key={c}
                      id={`color-${c}`}
                      onClick={() => setSelectedVariant(v => ({ ...v, color: c }))}
                      className={`btn btn-sm ${selectedVariant.color === c ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mb-20">
                <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Size
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {sizes.map(s => (
                    <button
                      key={s}
                      id={`size-${s}`}
                      onClick={() => setSelectedVariant(v => ({ ...v, size: s }))}
                      className={`btn btn-sm ${selectedVariant.size === s ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {materials.length > 0 && (
              <div className="mb-24">
                <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Material
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {materials.map(m => (
                    <button
                      key={m}
                      id={`material-${m}`}
                      onClick={() => setSelectedVariant(v => ({ ...v, material: m }))}
                      className={`btn btn-sm ${selectedVariant.material === m ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Cart */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  id="qty-dec"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: '40px', height: '48px', fontSize: '18px', background: 'none', cursor: 'pointer', borderRight: '1px solid var(--border)' }}
                >
                  −
                </button>
                <span style={{ width: '48px', textAlign: 'center', fontWeight: 600, fontSize: '16px' }}>{qty}</span>
                <button
                  id="qty-inc"
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{ width: '40px', height: '48px', fontSize: '18px', background: 'none', cursor: 'pointer', borderLeft: '1px solid var(--border)' }}
                >
                  +
                </button>
              </div>
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </button>
              <button
                id="wishlist-detail-btn"
                onClick={() => {
                  toggleItem(product);
                  showToast(isInWishlist ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`, 'success');
                }}
                className="btn btn-ghost btn-lg"
                style={{ width: '56px', padding: 0, border: '1.5px solid var(--border)' }}
                title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg viewBox="0 0 24 24" fill={isInWishlist ? 'var(--crimson)' : 'none'} stroke={isInWishlist ? 'var(--crimson)' : 'currentColor'} strokeWidth="2" width="24" height="24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <p style={{ fontSize: '13px', color: product.stock < 5 ? 'var(--crimson)' : 'var(--emerald)', fontWeight: 500 }}>
              {product.stock === 0 ? '❌ Out of stock'
                : product.stock < 5 ? `⚠️ Only ${product.stock} left`
                : `✅ In Stock (${product.stock} available)`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
