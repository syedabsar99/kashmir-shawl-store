/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import useToast from '../hooks/useToast';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const SWATCH_COLORS = ['#8B1A1A', '#C4972A', '#2D5A27', '#1a2d5a', '#4a2d5a'];

function StarRating({ rating = 0 }) {
  return (
    <div className="product-card__stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star ${i <= Math.round(rating) ? '' : 'empty'}`}>★</span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  const { showToast } = useToast();
  const { toggleItem, items: wishlistItems } = useWishlistStore();

  const isInWishlist = wishlistItems.some(i => i._id === product._id);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, {}, 1);
    showToast(`${product.name} added to cart`, 'success');
  };

  return (
    <div className="product-card" id={`product-${product._id}`}>
      <div className="product-card__image-wrap">
        <Link to={`/product/${product.slug}`} className="product-card__image-link">
          <img
            src={product.images?.[0] || 'https://placehold.co/400x530/F5F5F5/9E9E9E?text=Kashmiri+Shawl'}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {/* Sale badge */}
        {discount > 0 && (
          <span className="product-card__sale-badge">Sale {discount}%</span>
        )}
        {product.featured && !discount && (
          <span className="product-card__sale-badge" style={{ background: 'var(--crimson)' }}>Featured</span>
        )}

        {/* Hover action icons */}
        <div className="product-card__hover-actions">
          <button 
            className="product-card__action-icon" 
            aria-label="Add to wishlist" 
            style={{ color: isInWishlist ? 'var(--crimson)' : 'inherit' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleItem(product);
              showToast(isInWishlist ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`, 'success');
            }}
          >
            <svg viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button 
            className="product-card__action-icon" 
            aria-label="Quick view" 
            onClick={(e) => {
              // Navigation handled manually if needed
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        {/* Add to Cart slide-up */}
        <button className="product-card__add-cta" onClick={handleAddToCart} id={`add-cart-${product._id}`}>
          Add to Cart
        </button>
      </div>

      <div className="product-card__body">
        <Link to={`/product/${product.slug}`} className="product-card__body-link">
          <div className="product-card__category">
            {product.category?.name || 'Shawl'}
          </div>

          {/* Title */}
          <div className="product-card__name-wrap">
            <span className="product-card__name">{product.name}</span>
          </div>

          {/* Price */}
          <div className="product-card__price">
            <span className="current">{fmt(product.price)}</span>
            {product.comparePrice && (
              <span className="original">{fmt(product.comparePrice)}</span>
            )}
          </div>
        </Link>

        {/* Color swatches (decorative) */}
        <div className="product-card__swatches">
          {SWATCH_COLORS.slice(0, 3 + Math.floor(Math.random() * 3)).map(c => (
            <span
              key={c}
              className="product-card__swatch"
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>

        {/* Stars */}
        <StarRating rating={product.rating || 4} />
      </div>
    </div>
  );
}
