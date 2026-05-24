export default function SkeletonProductCard() {
  return (
    <div className="product-card skeleton-card">
      <div className="product-card__image-wrap skeleton"></div>
      <div className="product-card__body">
        <div className="product-card__category skeleton skeleton-text" style={{ width: '40%' }}></div>
        <div className="product-card__name-wrap skeleton skeleton-text" style={{ width: '80%', height: '24px', margin: '8px 0' }}></div>
        <div className="product-card__price skeleton skeleton-text" style={{ width: '60%' }}></div>
        <div className="product-card__swatches">
           <span className="product-card__swatch skeleton" style={{ background: '#eee' }}></span>
           <span className="product-card__swatch skeleton" style={{ background: '#eee' }}></span>
           <span className="product-card__swatch skeleton" style={{ background: '#eee' }}></span>
        </div>
      </div>
    </div>
  );
}
