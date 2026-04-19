/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';
import useToast from '../../hooks/useToast';
import AdminLayout from './AdminLayout';

export default function ProfilePage() {
  const { user, login } = useAuthStore();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const { name, email, password } = formData;
      const payload = { name, email };
      if (password) payload.password = password;

      const res = await api.put('/auth/profile', payload);
      login(res.data.user, localStorage.getItem('token')); // Update store with new user data
      toast.showToast('Profile updated successfully!', 'success');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Admin Profile">
      <div className="admin-card" style={{ maxWidth: '600px' }}>
        <h3 className="section-title-sm">Account Information</h3>
        <p className="admin-muted mb-24">Update your administrative credentials.</p>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className="admin-label">Full Name</label>
            <input 
              type="text" 
              className="admin-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="admin-label">Email Address</label>
            <input 
              type="email" 
              className="admin-input"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid var(--admin-border)' }} />
          
          <h3 className="section-title-sm">Security</h3>
          <p className="admin-muted mb-24">Leave password fields blank if you don't want to change it.</p>

          <div className="form-grid">
            <div className="form-group">
              <label className="admin-label">New Password</label>
              <input 
                type="password" 
                className="admin-input"
                autoComplete="new-password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label className="admin-label">Confirm New Password</label>
              <input 
                type="password" 
                className="admin-input"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
