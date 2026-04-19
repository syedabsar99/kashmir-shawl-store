/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';

  const activeCategory = categories.find(c => c._id === category);
  const termPlural = activeCategory ? activeCategory.name : 'Products';

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, sort };
    if (category) params.category = category;
    if (search) params.search = search;
    api.get('/products', { params })
      .then(r => {
        setProducts(r.data.products);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .finally(() => setLoading(false));
  }, [page, category, sort, search]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>{activeCategory ? activeCategory.name : 'Our Collection'}</h1>
          <p>Explore authentic Kashmiri craftsmanship and traditional wear</p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px', alignItems: 'start' }}>

          {/* SIDEBAR */}
          <aside>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '20px', color: 'var(--text-primary)' }}>
                Filters
              </h3>

              {/* Search */}
              <div className="form-group mb-24">
                <label className="form-label">Search</label>
                <input
                  id="shop-search"
                  type="text"
                  className="form-input"
                  placeholder="Search products..."
                  defaultValue={search}
                  onKeyDown={e => e.key === 'Enter' && updateParam('search', e.target.value)}
                />
              </div>

              {/* Categories */}
              <div className="mb-24">
                <p className="form-label mb-16">Category</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    id="cat-all"
                    className={`btn btn-sm ${!category ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => updateParam('category', '')}
                  >
                    All Products
                  </button>
                  {categories.map(c => (
                    <button
                      key={c._id}
                      id={`cat-filter-${c._id}`}
                      className={`btn btn-sm ${category === c._id ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ justifyContent: 'flex-start' }}
                      onClick={() => updateParam('category', c._id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="form-group">
                <label htmlFor="shop-sort" className="form-label">Sort By</label>
                <select
                  id="shop-sort"
                  className="form-select"
                  value={sort}
                  onChange={e => updateParam('sort', e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="featured">Featured First</option>
                </select>
              </div>
            </div>
          </aside>

          {/* PRODUCT AREA */}
          <div>
            <div className="flex-between mb-24">
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                {total} {termPlural} found
              </p>
            </div>

            {loading ? <Spinner /> : (
              products.length > 0 ? (
                <>
                  <div className="product-grid">
                    {products.map(p => <ProductCard key={p._id} product={p} />)}
                  </div>

                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="flex-center gap-8 mt-32">
                      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          id={`page-${p}`}
                          className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => {
                            const next = new URLSearchParams(searchParams);
                            next.set('page', p);
                            setSearchParams(next);
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <div className="icon">🛍️</div>
                  <h3>No {termPlural} Found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
