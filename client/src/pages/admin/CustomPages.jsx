/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import useToast from '../../hooks/useToast';
import Spinner from '../../components/Spinner';
import AdminLayout from './AdminLayout';

export default function CustomPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', showInFooter: true, _id: null });
  const { showToast } = useToast();

  const fetchPages = () => {
    setLoading(true);
    api.get('/pages')
      .then(r => setPages(r.data.pages))
      .catch(err => showToast('Failed to load pages', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPages(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        await api.put(`/pages/${form._id}`, form);
        showToast('Page updated successfully', 'success');
      } else {
        await api.post('/pages', form);
        showToast('Page created successfully', 'success');
      }
      setIsEditing(false);
      fetchPages();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleEdit = (p) => {
    setForm(p);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this page permanently?')) return;
    try {
      await api.delete(`/pages/${id}`);
      showToast('Page deleted', 'success');
      fetchPages();
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  if (loading && !isEditing) return <AdminLayout title="Store Pages"><Spinner /></AdminLayout>;

  return (
    <AdminLayout title="Store Pages">
      <div style={{ maxWidth: '800px' }}>
        <div className="flex-between mb-24">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px' }}>Manage CMS Pages</h2>
          {!isEditing && (
            <button className="btn btn-primary" onClick={() => { setForm({ title: '', content: '', showInFooter: true, _id: null }); setIsEditing(true); }}>
              + Create Page
            </button>
          )}
        </div>

      {isEditing ? (
        <div className="card" style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Page Title (e.g. Refund Policy)</label>
              <input type="text" className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.showInFooter} onChange={e => setForm({ ...form, showInFooter: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: 'var(--crimson)' }} />
                Add to Website Footer Menu
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Page Content</label>
              <textarea 
                className="form-input" 
                rows="12" 
                value={form.content} 
                onChange={e => setForm({ ...form, content: e.target.value })} 
                required 
                placeholder="Write your policy or page content here..."
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Page</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>URL Slug</th>
                <th>In Footer</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td style={{ color: 'var(--text-muted)' }}>/pages/{p.slug}</td>
                  <td>{p.showInFooter ? '✅ Yes' : '❌ No'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => handleEdit(p)} style={{ marginRight: '8px' }}>Edit</button>
                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--crimson)' }} onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>No custom pages created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
