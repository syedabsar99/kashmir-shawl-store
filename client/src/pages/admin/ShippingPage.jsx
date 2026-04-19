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

const emptyForm = { name: '', pincodes: '', rate: '', estimatedDays: '5-7 business days', isFree: false };

export default function ShippingPage() {
  const [zones, setZones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editZone, setEditZone] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const fetch = () => api.get('/admin/shipping-zones').then(r => setZones(r.data.zones));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditZone(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (z) => {
    setEditZone(z);
    setForm({ name: z.name, pincodes: z.pincodes.join(', '), rate: z.rate, estimatedDays: z.estimatedDays, isFree: z.isFree });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      pincodes: form.pincodes.split(',').map(p => p.trim()).filter(Boolean),
      rate: Number(form.rate),
      estimatedDays: form.estimatedDays,
      isFree: form.isFree
    };
    try {
      if (editZone) {
        await api.put(`/admin/shipping-zones/${editZone._id}`, payload);
        showToast('Zone updated!', 'success');
      } else {
        await api.post('/admin/shipping-zones', payload);
        showToast('Zone created!', 'success');
      }
      setShowModal(false);
      fetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this shipping zone?')) return;
    await api.delete(`/admin/shipping-zones/${id}`);
    showToast('Zone deleted', 'info');
    fetch();
  };

  return (
    <AdminLayout title="Shipping Zones">
      <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--admin-glow)', border: '1px solid var(--admin-border)', borderRadius: '10px' }}>
        <p style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>
          ℹ️ Add pincode prefixes (e.g. "190" for Srinagar) or full pincodes. At checkout, we match the customer's pincode against these to calculate shipping.
        </p>
      </div>

      <div className="flex-between mb-24">
        <p style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>{zones.length} shipping zone{zones.length !== 1 ? 's' : ''}</p>
        <button id="add-zone-btn" className="admin-btn admin-btn-primary" onClick={openAdd}>+ Add Zone</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Pincode Prefixes</th>
              <th>Rate</th>
              <th>Delivery Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>No zones yet. Add one to enable zone-based shipping.</td></tr>
            ) : zones.map(zone => (
              <tr key={zone._id}>
                <td style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{zone.name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--admin-muted)' }}>
                  {zone.pincodes.slice(0, 4).join(', ')}{zone.pincodes.length > 4 ? ` +${zone.pincodes.length - 4} more` : ''}
                </td>
                <td>
                  {zone.isFree
                    ? <span className="badge badge-delivered">Free</span>
                    : <span style={{ fontWeight: 700, color: 'var(--admin-gold)' }}>{fmt(zone.rate)}</span>
                  }
                </td>
                <td style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>{zone.estimatedDays}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button id={`edit-zone-${zone._id}`} className="admin-btn admin-btn-ghost" onClick={() => openEdit(zone)}>Edit</button>
                    <button id={`del-zone-${zone._id}`} className="admin-btn admin-btn-danger" onClick={() => handleDelete(zone._id)}>Delete</button>
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
              <h3>{editZone ? 'Edit Zone' : 'Add Shipping Zone'}</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal__body">
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="admin-label">Zone Name *</label>
                  <input id="zone-name" className="admin-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Kashmir Valley, Metro Cities" />
                </div>
                <div>
                  <label className="admin-label">Pincode Prefixes (comma-separated) *</label>
                  <input id="zone-pincodes" className="admin-input" value={form.pincodes} onChange={e => setForm(f => ({ ...f, pincodes: e.target.value }))} required placeholder="190, 191, 192 or full pincodes: 190001, 190002" />
                </div>
                <div className="admin-form-grid">
                  <div>
                    <label className="admin-label">Rate (₹)</label>
                    <input id="zone-rate" type="number" className="admin-input" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} min="0" disabled={form.isFree} />
                  </div>
                  <div>
                    <label className="admin-label">Estimated Delivery</label>
                    <input id="zone-days" className="admin-input" value={form.estimatedDays} onChange={e => setForm(f => ({ ...f, estimatedDays: e.target.value }))} placeholder="5-7 business days" />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" id="zone-free" checked={form.isFree} onChange={e => setForm(f => ({ ...f, isFree: e.target.checked, rate: e.target.checked ? 0 : f.rate }))} style={{ accentColor: 'var(--admin-gold)', width: '18px', height: '18px' }} />
                  <span className="admin-label" style={{ marginBottom: 0 }}>Free Shipping Zone</span>
                </label>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" id="save-zone-btn" className="admin-btn admin-btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editZone ? 'Update Zone' : 'Create Zone'}
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
