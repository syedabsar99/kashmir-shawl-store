/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useToast from '../hooks/useToast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const toast = useToast();
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
      toast.showToast('OTP sent to your email!', 'success');
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Email not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReset = async (e) => {
    e.preventDefault();
    if(newPassword.length < 6) return toast.showToast('Password must be at least 6 characters', 'error');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password: newPassword });
      toast.showToast('Password successfully reset! You can now log in.', 'success');
      navigate('/login');
    } catch (err) {
      toast.showToast(err.response?.data?.message || 'Invalid or expired OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--gray-50)' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 700, color: 'var(--crimson)' }}>Saadat Shawl House</Link>
        </div>

        <div className="card" style={{ padding: '40px' }}>
          {step === 1 ? (
            <>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '12px', textAlign: 'center' }}>Forgot Password?</h2>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
                Enter your email address and we'll send you a 6-digit OTP to safely reset your password.
              </p>

              <form onSubmit={handleRequestOTP} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP Code'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '12px', textAlign: 'center' }}>Enter Secure OTP</h2>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
                We've sent a 6-digit code to <strong>{email}</strong>. Enter it below along with your new password.
              </p>

              <form onSubmit={handleVerifyReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">6-Digit OTP</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="123456"
                    maxLength={6}
                    style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px', fontWeight: 'bold' }}
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                  {loading ? 'Verifying...' : 'Reset Password'}
                </button>
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <button type="button" onClick={() => setStep(1)} style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'underline' }}>
                    Didn't receive it? Try again
                  </button>
                </div>
              </form>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <Link to="/login" style={{ fontSize: '14px', color: 'var(--crimson)', fontWeight: 600 }}>Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
