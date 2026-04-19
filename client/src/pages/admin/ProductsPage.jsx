/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from './AdminLayout';
import useToast from '../../hooks/useToast';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const emptyForm = {
  name: '', description: '', price: '', comparePrice: '', stock: '',
  category: '', featured: false, tags: '', images: [],
  variants: []
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products', { params: { limit: 50 } })
      .then(r => setProducts(r.data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  const openAdd = () => { setEditProduct(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description, price: p.price,
      comparePrice: p.comparePrice || '', stock: p.stock,
      category: p.category?._id || '', featured: p.featured,
      tags: p.tags?.join(', ') || '', images: p.images || [],
      variants: p.variants || []
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const r = await api.post('/products/upload-image', { data: ev.target.result });
        setForm(f => ({ ...f, images: [...f.images, r.data.url] }));
        showToast('Image uploaded!', 'success');
      } catch {
        showToast('Image upload failed', 'error');
      } finally {
        setImageUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (idx) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { color: '', size: '', material: '' }] }));
  const updateVariant = (i, key, val) => setForm(f => ({
    ...f,
    variants: f.variants.map((v, idx) => idx === i ? { ...v, [key]: val } : v)
  }));
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      stock: Number(form.stock),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      variants: form.variants.filter(v => v.color || v.size || v.material)
    };
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        showToast('Product updated!', 'success');
      } else {
        await api.post('/products', payload);
        showToast('Product created!', 'success');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Product removed', 'info');
      fetchProducts();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Products">
      {/* Header */}
      <div className="flex-between mb-24">
        <input
          id="products-search"
          type="text"
          className="admin-input"
          placeholder="🔍 Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <button id="add-product-btn" className="admin-btn admin-btn-primary" onClick={openAdd}>
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>Loading…</td></tr>
            ) : filtered.map(p => (
              <tr key={p._id}>
                <td>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={p.images?.[0] || 'https://placehold.co/50x65/1B1628/C4972A?text=Shawl'}
                      style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '6px' }}
                      alt=""
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--admin-muted)' }}>{p.category?.name || '—'}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{fmt(p.price)}</div>
                  {p.comparePrice && (
                    <div style={{ fontSize: '12px', color: 'var(--admin-muted)', textDecoration: 'line-through' }}>{fmt(p.comparePrice)}</div>
                  )}
                </td>
                <td>
                  <span style={{ color: p.stock < 5 ? '#EF4444' : p.stock < 10 ? '#F59E0B' : '#22C55E', fontWeight: 600 }}>
                    {p.stock}
                  </span>
                </td>
                <td>{p.featured ? '⭐' : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button id={`edit-${p._id}`} className="admin-btn admin-btn-ghost" onClick={() => openEdit(p)}>Edit</button>
                    <button id={`del-${p._id}`} className="admin-btn admin-btn-danger" onClick={() => handleDelete(p._id)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '700px' }}>
            <div className="modal__header">
              <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal__body">
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="admin-form-grid">
                  <div>
                    <label className="admin-label">Product Name *</label>
                    <input id="prod-name" className="admin-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="admin-label">Category *</label>
                    <select id="prod-category" className="admin-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Price (₹) *</label>
                    <input id="prod-price" type="number" className="admin-input" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min="0" />
                  </div>
                  <div>
                    <label className="admin-label">Compare Price (₹)</label>
                    <input id="prod-compare" type="number" className="admin-input" value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} min="0" />
                  </div>
                  <div>
                    <label className="admin-label">Stock *</label>
                    <input id="prod-stock" type="number" className="admin-input" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required min="0" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
                    <input id="prod-featured" type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ accentColor: 'var(--admin-gold)', width: '18px', height: '18px' }} />
                    <label htmlFor="prod-featured" className="admin-label" style={{ marginBottom: 0, cursor: 'pointer' }}>Featured Product</label>
                  </div>
                </div>

                <div>
                  <label className="admin-label">Description *</label>
                  <textarea id="prod-desc" className="admin-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required style={{ resize: 'vertical' }} />
                </div>

                <div>
                  <label className="admin-label">Tags (comma-separated)</label>
                  <input id="prod-tags" className="admin-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="pashmina, handwoven, winter" />
                </div>

                {/* Images */}
                <div>
                  <label className="admin-label">Product Images</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {form.images.map((img, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={img} alt="" style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--admin-border)' }} />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#EF4444', color: 'white', fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >×</button>
                      </div>
                    ))}
                    <label htmlFor="image-upload" style={{ width: '70px', height: '90px', border: '2px dashed var(--admin-border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--admin-muted)', fontSize: '24px' }}>
                      {imageUploading ? '⏳' : '+'}
                      <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                {/* Variants */}
                <div>
                  <div className="flex-between mb-12">
                    <label className="admin-label">Variants</label>
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={addVariant} style={{ fontSize: '12px', padding: '4px 12px' }}>+ Add Variant</button>
                  </div>
                  {form.variants.map((v, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                      <input className="admin-input" placeholder="Color" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} style={{ fontSize: '13px', padding: '8px 10px' }} />
                      <input className="admin-input" placeholder="Size" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} style={{ fontSize: '13px', padding: '8px 10px' }} />
                      <input className="admin-input" placeholder="Material" value={v.material} onChange={e => updateVariant(i, 'material', e.target.value)} style={{ fontSize: '13px', padding: '8px 10px' }} />
                      <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeVariant(i)} style={{ fontSize: '16px', padding: '8px 10px' }}>×</button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" id="save-product-btn" className="admin-btn admin-btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
