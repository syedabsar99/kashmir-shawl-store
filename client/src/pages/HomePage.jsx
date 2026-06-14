/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import Spinner from '../components/Spinner';
import useSettingsStore from '../store/settingsStore';
import { Helmet } from 'react-helmet-async';
import useToast from '../hooks/useToast';

const TRUST_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
        <circle cx="7" cy="20" r="2" /><circle cx="17" cy="20" r="2" />
      </svg>
    ),
    title: 'Free Shipping',
    sub: 'On orders above ₹2,000',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    title: '30-Day Returns',
    sub: 'Hassle-free exchange & refund',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: '100% Authentic',
    sub: 'GI-certified Kashmiri craft',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    title: 'Secure Payment',
    sub: 'Razorpay, UPI & COD',
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState(window.innerWidth <= 992);
  const { showToast } = useToast();

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth <= 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { banners, initialize, isInitialized } = useSettingsStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    initialize();
    Promise.all([
      api.get('/products/featured'),
      api.get('/categories')
    ]).then(([fRes, cRes]) => {
      setFeatured(fRes.data.products);
      setCategories(cRes.data.categories);
    }).catch((error) => {
      console.error('Error fetching homepage data:', error);
      showToast('Failed to load store data. Please try refreshing.', 'error');
    }).finally(() => setLoading(false));
  }, [initialize]);

  // Auto-slide logic
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => handleNext(), 6000);
    return () => clearInterval(timer);
  }, [banners.length, currentIndex]);

  const handleNext = () => {
    if (isAnimating || banners.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
      setIsAnimating(false);
    }, 500); // Sync with CSS transition
  };

  const handlePrev = () => {
    if (isAnimating || banners.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      setIsAnimating(false);
    }, 500);
  };

  const currentBanner = banners[currentIndex] || {
    title: 'Wear the Art of Kashmir',
    subtitle: 'Sale up to 40% off',
    description: 'Discover handwoven shawls crafted by master artisans in the heart of the Kashmir Valley.',
    image: 'https://images.unsplash.com/photo-1563161439-04f4892c67bd?w=1000&q=80',
    btnText: 'Shop Now',
    btnLink: '/shop'
  };

  return (
    <div style={{ opacity: isInitialized ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      <Helmet>
        <title>Saadat Shawl House | Authentic Kashmiri Shawls</title>
        <meta name="description" content="Discover authentic, handcrafted Kashmiri shawls. Premium Pashmina, Kani, and Woolen shawls woven by master artisans in the Kashmir Valley." />
        <meta property="og:title" content="Saadat Shawl House | Authentic Kashmiri Shawls" />
        <meta property="og:description" content="Discover authentic, handcrafted Kashmiri shawls. Premium Pashmina, Kani, and Woolen shawls woven by master artisans in the Kashmir Valley." />
      </Helmet>
      {/* ─── HERO DESKTOP (hidden on mobile) ─── */}
      <section className="hero hero--desktop">
        {/* Left text panel */}
        <div className="hero__left">
          <div className="hero__left-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {banners.map((banner, idx) => (
              <div className="hero__text-slide" key={banner._id || idx}>
                <div className="hero__sale-tag">
                  <span className="tag">{banner.subtitle}</span>
                  Kashmir Valley &mdash; Since 1952
                </div>
                <h1 dangerouslySetInnerHTML={{ __html: banner.title.replace('Kashmir', '<em>Kashmir</em>') }} />
                <p className="hero__desc">{banner.description}</p>
                <div className="hero__actions">
                  <Link to={banner.btnLink || '/shop'} className="btn btn-primary btn-lg">
                    {banner.btnText || 'Shop Now'}
                  </Link>
                  <Link to="/shop?featured=true" className="btn btn-ghost btn-lg">View Featured</Link>
                </div>
              </div>
            ))}
          </div>

          {/* Nav arrows */}
          <div className="hero__nav">
            <button className="hero__nav-btn" onClick={handlePrev} aria-label="Previous">&larr;</button>
            <button className="hero__nav-btn" onClick={handleNext} aria-label="Next">&rarr;</button>
          </div>
        </div>

        {/* Right sliding images */}
        <div className="hero__right">
          <div className="hero__slides-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {banners.map((banner, idx) => (
              <div className="hero__slide-img" key={banner._id || idx}>
                <img src={banner.image} alt={banner.title || 'Banner'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HERO MOBILE (hidden on desktop) ─── */}
      <section className="hero hero--mobile">
        <div className="hero__slides-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {banners.map((banner, idx) => (
            <div className="hero__slide-img" key={banner._id || idx}>
              <img
                src={(banner.mobileImage || banner.image)}
                alt={banner.title || 'Banner'}
              />
            </div>
          ))}
        </div>

        {/* Text overlay */}
        <div className="hero__mobile-overlay">
          {banners.length > 0 && (
            <>
              <div className="hero__sale-tag" style={{ marginBottom: '10px' }}>
                <span className="tag">{banners[currentIndex]?.subtitle || banners[0].subtitle}</span>
                Kashmir Valley &mdash; Since 1952
              </div>
              <h1 dangerouslySetInnerHTML={{ __html: (banners[currentIndex]?.title || banners[0].title).replace('Kashmir', '<em>Kashmir</em>') }} />
              <p className="hero__desc">{banners[currentIndex]?.description || banners[0].description}</p>
              <div className="hero__actions">
                <Link to={banners[currentIndex]?.btnLink || banners[0].btnLink || '/shop'} className="btn btn-primary btn-lg">
                  {banners[currentIndex]?.btnText || banners[0].btnText || 'Shop Now'}
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Nav arrows */}
        <div className="hero__nav--mobile">
          <button className="hero__nav-btn" onClick={handlePrev} aria-label="Previous">&larr;</button>
          <button className="hero__nav-btn" onClick={handleNext} aria-label="Next">&rarr;</button>
        </div>
      </section>

      {/* Trust strip relocated to bottom based on target design */}

      {/* ─── CATEGORIES ─── */}
      {categories.length > 0 && (
        <section className="section theme-luxury-cashmere">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Browse by Type</span>
              <h2>Shop by Category</h2>
              <p>From the finest Pashmina to vibrant Woolen weaves</p>
            </div>
            <div className="category-carousel">
              {categories.map(cat => (
                <Link
                  to={`/shop?category=${cat._id}`}
                  key={cat._id}
                  className="category-card"
                  id={`cat-${cat._id}`}
                >
                  <img
                    src={cat.image || `https://placehold.co/400x530/F5F5F5/9E9E9E?text=${cat.name}`}
                    alt={cat.name}
                    loading="lazy"
                  />
                  <div className="category-card__label">{cat.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="section theme-luxury-alabaster">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Hand-Picked</span>
            <h2>Featured Products</h2>
            <p>Discover the Best of Our Collection for Your Dream Home</p>
          </div>

          {loading ? (
            <div className="product-grid">
              <SkeletonProductCard />
              <SkeletonProductCard />
              <SkeletonProductCard />
              <SkeletonProductCard />
            </div>
          ) : (
            featured.length > 0 ? (
              <div className="product-grid">
                {featured.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            ) : null
          )}
        </div>
      </section>



      {/* ─── HERITAGE SECTION ─── */}
      <section className="section heritage-section">
        <div className="container">
          <div className="heritage-grid">
            <div className="heritage-text">
              <span className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '16px', display: 'block' }}>Our Legacy</span>
              <h2 style={{ color: 'var(--white)', marginBottom: '24px' }}>The Art of Kashmiri Weaving</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', fontSize: '16px', lineHeight: '1.8' }}>
                For centuries, the master weavers of the Kashmir Valley have perfected the art of creating the world's most luxurious shawls. 
                Using the finest Pashmina wool sourced from the high altitudes of the Himalayas, each piece is a testament to heritage, patience, and unparalleled craftsmanship.
              </p>
              <div className="heritage-stat-grid">
                <div className="heritage-stat">
                  <div className="heritage-stat__num">1952</div>
                  <div className="heritage-stat__label">ESTABLISHED</div>
                </div>
                <div className="heritage-stat">
                  <div className="heritage-stat__num">100%</div>
                  <div className="heritage-stat__label">GI CERTIFIED</div>
                </div>
                <div className="heritage-stat">
                  <div className="heritage-stat__num">50+</div>
                  <div className="heritage-stat__label">MASTER ARTISANS</div>
                </div>
                <div className="heritage-stat">
                  <div className="heritage-stat__num">∞</div>
                  <div className="heritage-stat__label">TIMELESS ELEGANCE</div>
                </div>
              </div>
              <div style={{ marginTop: '40px' }}>
                <Link to="/about" className="btn btn-gold">Discover Our Story</Link>
              </div>
            </div>
            <div className="heritage-image" style={{ borderRadius: '12px', overflow: 'hidden', height: '100%' }}>
              <img src="https://images.unsplash.com/photo-1605810753066-5e58988a87fb?q=80&w=1000" alt="Kashmiri Artisan Weaving" style={{ width: '100%', height: '100%', minHeight: '500px', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP (BOTTOM) ─── */}
      <div className="trust-strip theme-luxury-cashmere" style={{ borderTop: 'none' }}>
        <div className="container-wide">
          <div className="trust-strip__grid">
            {TRUST_ITEMS.map(item => (
              <div className="trust-strip__item" key={item.title}>
                <div className="trust-strip__icon">{item.icon}</div>
                <div className="trust-strip__text">
                  <div className="trust-strip__title">{item.title}</div>
                  <div className="trust-strip__sub">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
