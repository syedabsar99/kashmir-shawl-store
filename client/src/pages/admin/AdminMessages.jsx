/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminLayout from './AdminLayout';
import Spinner from '../../components/Spinner';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/messages');
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id) => {
    try {
      const { data } = await api.put(`/messages/${id}/read`);
      setMessages(messages.map(m => m._id === id ? data : m));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <AdminLayout title="Inquiries"><Spinner /></AdminLayout>;

  return (
    <AdminLayout title="Inquiries">
      <div className="admin-card">
        <h3>Customer Messages</h3>
        {messages.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No messages found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {messages.map(msg => (
              <div key={msg._id} style={{ 
                padding: '20px', 
                background: msg.isRead ? 'var(--gray-50)' : 'var(--white)', 
                border: `1px solid ${msg.isRead ? 'var(--admin-border)' : 'var(--gold)'}`,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{msg.name}</strong>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '12px' }}>{msg.email}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <p style={{ margin: 0, padding: '16px', background: 'var(--gray-50)', borderRadius: '6px', fontSize: '15px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                  {msg.message}
                </p>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button onClick={() => toggleRead(msg._id)} className={`btn ${msg.isRead ? 'btn-outline' : 'btn-primary'}`} style={{ padding: '6px 12px', fontSize: '13px' }}>
                    {msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button onClick={() => deleteMessage(msg._id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '13px' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
