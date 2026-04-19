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

const emptyForm = { name: '', description: '', image: '', parent: null, showInNavbar: true };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const fetch = () => api.get('/categories').then(r => setCategories(r.data.categories));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditCat(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c) => { 
    setEditCat(c); 
    setForm({ 
      name: c.name, 
      description: c.description || '', 
      image: c.image || '',
      parent: c.parent?._id || null,
      showInNavbar: c.showInNavbar !== false
    }); 
    setShowModal(true); 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCat) {
        await api.put(`/categories/${editCat._id}`, form);
        showToast('Category updated!', 'success');
      } else {
        await api.post('/categories', form);
        showToast('Category created!', 'success');
      }
      setShowModal(false);
      fetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/categories/${deletingId}`);
      showToast('Category deleted', 'info');
      fetch();
    } catch (err) {
      showToast('Delete failed', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout title="Categories">
      <div className="flex-between mb-24">
        <p style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
        <button id="add-category-btn" className="admin-btn admin-btn-primary" onClick={openAdd}>+ Add Category</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Parent</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>No categories yet</td></tr>
            ) : categories.map(cat => (
              <tr key={cat._id}>
                <td>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {cat.image && (
                      <img src={cat.image} alt="" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{cat.name}</span>
                      {!cat.parent && (
                        <span style={{ fontSize: '10px', color: 'var(--admin-muted)', background: 'var(--gray-100)', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                          {cat.showInNavbar !== false ? 'Main Navbar' : 'More Menu'}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>
                  {cat.parent?.name || <span style={{ opacity: 0.3 }}>None</span>}
                </td>
                <td style={{ color: 'var(--admin-gold)', fontFamily: 'monospace', fontSize: '12px' }}>{cat.slug}</td>
                <td>
                  <span className={`badge ${cat.isActive ? 'badge-delivered' : 'badge-cancelled'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button id={`edit-cat-${cat._id}`} className="admin-btn admin-btn-ghost" onClick={() => openEdit(cat)}>Edit</button>
                    <button id={`del-cat-${cat._id}`} className="admin-btn admin-btn-danger" onClick={() => handleDelete(cat._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal__header">
              <h3>{editCat ? 'Edit Category' : 'Add Category'}</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal__body">
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="admin-label">Name *</label>
                  <input id="cat-name" className="admin-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Pashmina Shawls" />
                </div>
                <div>
                  <label className="admin-label">Parent Category (Optional)</label>
                  <select 
                    className="admin-input" 
                    value={form.parent || ''} 
                    onChange={e => setForm(f => ({ ...f, parent: e.target.value || null }))}
                  >
                    <option value="">None (Top Level)</option>
                    {categories
                      .filter(c => c._id !== editCat?._id) // Can't be own parent
                      .map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))
                    }
                  </select>
                </div>
                {!form.parent && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input id="cat-nav" type="checkbox" checked={form.showInNavbar} onChange={e => setForm(f => ({ ...f, showInNavbar: e.target.checked }))} style={{ accentColor: 'var(--admin-gold)', width: '18px', height: '18px' }} />
                    <label htmlFor="cat-nav" className="admin-label" style={{ marginBottom: 0, cursor: 'pointer' }}>Show directly in Main Navbar</label>
                  </div>
                )}
                <div>
                  <label className="admin-label">Description</label>
                  <textarea id="cat-desc" className="admin-input" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label className="admin-label">Category Image</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="admin-btn admin-btn-ghost" style={{ cursor: 'pointer', textAlign: 'center', fontSize: '13px', border: '1px dashed var(--admin-border)', padding: '12px' }}>
                      {saving ? 'Processing...' : form.image ? 'Change Image' : '+ Choose from Device'}
                      <input 
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                             if (file.size > 1024 * 1024) {
                               return showToast('Image must be less than 1MB', 'error');
                             }
                             const reader = new FileReader();
                             reader.onloadend = () => {
                               setForm(f => ({ ...f, image: reader.result }));
                             };
                             reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {form.image ? (
                      <div style={{ position: 'relative', width: 'fit-content', alignSelf: 'center' }}>
                        <img src={form.image} alt="Preview" style={{ marginTop: '8px', height: '120px', width: '120px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                        <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>Current Preview</div>
                      </div>
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-muted)', background: 'var(--gray-50)', fontSize: '12px' }}>
                        No image selected
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" id="save-category-btn" className="admin-btn admin-btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editCat ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {deletingId && (
        <div className="modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal__header">
              <h3>Confirm Delete</h3>
              <button className="modal__close" onClick={() => setDeletingId(null)}>×</button>
            </div>
            <div className="modal__body">
              <p style={{ color: 'var(--admin-text)', marginBottom: '24px' }}>
                Are you sure you want to delete this category? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setDeletingId(null)}>Cancel</button>
                <button className="admin-btn admin-btn-danger" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
