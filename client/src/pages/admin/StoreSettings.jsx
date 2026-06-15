/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect, useCallback } from 'react';
import useSettingsStore from '../../store/settingsStore';
import useToast from '../../hooks/useToast';
import AdminLayout from './AdminLayout';

/**
 * Compress an image file using canvas before converting to base64.
 * Resizes to maxDim and compresses to JPEG at given quality.
 * Returns a base64 data URL.
 */
const compressImage = (file, maxDim = 1200, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      // Scale down if larger than maxDim
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      // Use webp if supported, fallback to jpeg
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };
    img.src = url;
  });
};

export default function StoreSettings() {
  const settings = useSettingsStore();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  
  const [formData, setFormData] = useState({
    logoMain: settings.logoMain,
    logoSub: settings.logoSub,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    phoneNumber: settings.phoneNumber,
    email: settings.email,
    address: settings.address,
    aboutText: settings.aboutText,
    announcementText: settings.announcementText,
    legacyImage: settings.legacyImage,
    banners: settings.banners || [],
    aboutPage: settings.aboutPage || {}
  });

  const [globalHero, setGlobalHero] = useState({
    title: settings.banners?.[0]?.title || 'Wear the Art of Kashmir',
    subtitle: settings.banners?.[0]?.subtitle || 'Sale up to 40% off',
    description: settings.banners?.[0]?.description || 'Discover handwoven shawls...',
    btnText: settings.banners?.[0]?.btnText || 'Shop Now',
    btnLink: settings.banners?.[0]?.btnLink || '/shop'
  });

  // Sync form when settings are loaded from server
  useEffect(() => {
    setFormData({
      logoMain: settings.logoMain,
      logoSub: settings.logoSub,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      phoneNumber: settings.phoneNumber,
      email: settings.email,
      address: settings.address,
      address: settings.address,
      aboutText: settings.aboutText,
      announcementText: settings.announcementText,
      legacyImage: settings.legacyImage,
      banners: settings.banners || [],
      aboutPage: settings.aboutPage || {}
    });
    setGlobalHero({
      title: settings.banners?.[0]?.title || 'Wear the Art of Kashmir',
      subtitle: settings.banners?.[0]?.subtitle || 'Sale up to 40% off',
      description: settings.banners?.[0]?.description || 'Discover handwoven shawls...',
      btnText: settings.banners?.[0]?.btnText || 'Shop Now',
      btnLink: settings.banners?.[0]?.btnLink || '/shop'
    });
  }, [settings.logoMain, settings.logoSub, settings.logoUrl, settings.faviconUrl, settings.phoneNumber, settings.email, settings.address, settings.aboutText, settings.announcementText, settings.legacyImage, settings.banners]);

  const handleBannerAdd = () => {
    const newBanner = {
      _id: `new_${Date.now()}`,
      title: 'New Banner Title',
      subtitle: 'New Subtitle',
      description: 'Banner description goes here.',
      image: 'https://placehold.co/1200x600/F5F5F5/9E9E9E?text=Desktop+Banner',
      mobileImage: '',
      btnText: 'Shop Now',
      btnLink: '/shop'
    };
    setFormData({ ...formData, banners: [...formData.banners, newBanner] });
  };

  const handleBannerRemove = (id) => {
    setFormData({ ...formData, banners: formData.banners.filter(b => b._id !== id) });
  };

  const handleBannerChange = (id, field, value) => {
    setFormData({
      ...formData,
      banners: formData.banners.map(b => b._id === id ? { ...b, [field]: value } : b)
    });
  };

  const handleBannerImageUpload = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5000000) {
      toast.showToast('Banner image should be less than 5MB', 'error');
      return;
    }
    try {
      const compressed = await compressImage(file, 1400, 0.78);
      handleBannerChange(id, 'image', compressed);
    } catch { toast.showToast('Failed to process image', 'error'); }
  };

  const handleBannerMobileImageUpload = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5000000) {
      toast.showToast('Mobile banner should be less than 5MB', 'error');
      return;
    }
    try {
      const compressed = await compressImage(file, 900, 0.78);
      handleBannerChange(id, 'mobileImage', compressed);
    } catch { toast.showToast('Failed to process image', 'error'); }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2000000) {
      toast.showToast('Logo should be less than 2MB', 'error');
      return;
    }
    try {
      const compressed = await compressImage(file, 400, 0.85);
      setFormData({ ...formData, logoUrl: compressed });
    } catch { toast.showToast('Failed to process image', 'error'); }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1000000) {
      toast.showToast('Favicon should be less than 1MB', 'error');
      return;
    }
    try {
      const compressed = await compressImage(file, 128, 0.9);
      setFormData({ ...formData, faviconUrl: compressed });
    } catch { toast.showToast('Failed to process image', 'error'); }
  };

  const handleAboutChange = (e) => {
    setFormData({
      ...formData,
      aboutPage: { ...formData.aboutPage, [e.target.name]: e.target.value }
    });
  };

  const handleAboutImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5000000) {
      toast.showToast('Image should be less than 5MB', 'error');
      return;
    }
    try {
      const compressed = await compressImage(file, 1200, 0.78);
      setFormData({ ...formData, aboutPage: { ...formData.aboutPage, [field]: compressed } });
    } catch { toast.showToast('Failed to process image', 'error'); }
  };

  const handleLegacyImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5000000) {
      toast.showToast('Legacy image should be less than 5MB', 'error');
      return;
    }
    try {
      const compressed = await compressImage(file, 1000, 0.78);
      setFormData({ ...formData, legacyImage: compressed });
    } catch { toast.showToast('Failed to process image', 'error'); }
  };

  const handleLogoRemove = () => {
    setFormData({ ...formData, logoUrl: null });
  };

  const handleFaviconRemove = () => {
    setFormData({ ...formData, faviconUrl: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Sanitize banners: remove temporary frontend IDs (new_... and mock IDs b...)
      // so Mongoose can generate real ObjectIds for them.
      const sanitizedBanners = formData.banners.map(b => {
        const { _id, ...rest } = b;
        const isTemporaryId = _id && (_id.toString().startsWith('new_') || _id.toString().startsWith('b'));
        return isTemporaryId ? { ...rest, ...globalHero } : { ...b, ...globalHero };
      });

      await settings.updateSettings({ ...formData, banners: sanitizedBanners });
      setIsSaving(false);
      setShowSavedMsg(true);
      toast.showToast('Settings updated successfully!', 'success');
      setTimeout(() => setShowSavedMsg(false), 3000);
    } catch (err) {
      setIsSaving(false);
      const errorMsg = err.response?.data?.message || err.message || 'Check your internet connection';
      toast.showToast(`Failed to save: ${errorMsg}`, 'error');
      console.error('Save Settings Error Details:', err.response?.data || err);
    }
  };

  return (
    <AdminLayout title="Store Settings">
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-card">
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Store Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
                <div 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    border: '2px dashed var(--admin-border)', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    background: 'var(--gray-50)'
                  }}
                >
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '24px', opacity: 0.3 }}>🖼️</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer', margin: 0 }}>
                    Upload Logo
                    <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                  </label>
                  {formData.logoUrl && (
                    <button type="button" onClick={handleLogoRemove} className="admin-muted" style={{ fontSize: '12px', textAlign: 'left' }}>
                      Remove Image (use text fallback)
                    </button>
                  )}
                </div>
              </div>
              <p className="admin-muted" style={{ fontSize: '11px', marginTop: '8px' }}>Recommended size: 200x80px. Max 500KB.</p>
            </div>

            <div className="form-group mb-24">
              <label>Store Favicon (Browser Tab Icon)</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: '40px', height: '40px', borderRadius: '4px', border: '1px dashed var(--border-dark)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--gray-50)'
                  }}
                >
                  {formData.faviconUrl ? (
                    <img src={formData.faviconUrl} alt="Favicon preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '16px', opacity: 0.3 }}>🌐</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer', margin: 0 }}>
                    Upload Favicon
                    <input type="file" hidden accept="image/*" onChange={handleFaviconUpload} />
                  </label>
                  {formData.faviconUrl && (
                    <button type="button" onClick={handleFaviconRemove} className="admin-muted" style={{ fontSize: '12px', textAlign: 'left' }}>
                      Remove Favicon
                    </button>
                  )}
                </div>
              </div>
              <p className="admin-muted" style={{ fontSize: '11px', marginTop: '8px' }}>Recommended size: 32x32px or 64x64px. Max 200KB.</p>
            </div>

            {!formData.logoUrl && (
              <>
                <div className="form-group">
                  <label>Logo Main Text (Fallback)</label>
                  <input 
                    type="text" 
                    className="admin-input"
                    value={formData.logoMain}
                    onChange={(e) => setFormData({...formData, logoMain: e.target.value})}
                    placeholder="e.g., Saadat Shawl House"
                  />
                  <p className="admin-muted" style={{ fontSize: '11px', marginTop: '4px' }}>The first letter will be highlighted in cursive.</p>
                </div>

                <div className="form-group">
                  <label>Logo Subtitle (Fallback)</label>
                  <input 
                    type="text" 
                    className="admin-input"
                    value={formData.logoSub}
                    onChange={(e) => setFormData({...formData, logoSub: e.target.value})}
                    placeholder="e.g., Authentic Kashmiri Shawls"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Store Phone Number</label>
              <input 
                type="text" 
                className="admin-input"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                placeholder="e.g., (+91) 94190 12345"
              />
            </div>

            <div className="form-group">
              <label>Store Email Address</label>
              <input 
                type="email" 
                className="admin-input"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="e.g., support@kashurmart.com"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Physical Address</label>
              <input 
                type="text" 
                className="admin-input"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="e.g., Srinagar, Jammu & Kashmir"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Footer "About Us" Text</label>
              <textarea 
                className="admin-input"
                style={{ height: '80px', resize: 'none' }}
                value={formData.aboutText}
                onChange={(e) => setFormData({...formData, aboutText: e.target.value})}
                placeholder="Brief description of your brand for the footer"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Header Announcement</label>
              <input 
                type="text" 
                className="admin-input"
                value={formData.announcementText}
                onChange={(e) => setFormData({...formData, announcementText: e.target.value})}
                placeholder="Announcement text at the very top"
              />
            </div>
          </div>

          {/* ─── HOME BANNERS ─── */}
          <div style={{ marginTop: '40px', borderTop: '1px solid var(--admin-border)', paddingTop: '32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 className="section-title-sm" style={{ marginBottom: '4px' }}>Hero Section Layout</h3>
              <p className="admin-muted">Configure the global text and sliding images for the front page hero banner.</p>
            </div>

            {/* Global Hero Text */}
            <div className="form-grid" style={{ marginBottom: '32px', background: 'var(--white)', padding: '24px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
              <div className="form-group">
                <label className="admin-label">Primary Title</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={globalHero.title} 
                  onChange={(e) => setGlobalHero({ ...globalHero, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="admin-label">Sale Tag / Subtitle</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={globalHero.subtitle} 
                  onChange={(e) => setGlobalHero({ ...globalHero, subtitle: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="admin-label">Description</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={globalHero.description} 
                  onChange={(e) => setGlobalHero({ ...globalHero, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="admin-label">Button Text</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={globalHero.btnText} 
                  onChange={(e) => setGlobalHero({ ...globalHero, btnText: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="admin-label">Button Link</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={globalHero.btnLink} 
                  onChange={(e) => setGlobalHero({ ...globalHero, btnLink: e.target.value })}
                />
              </div>
            </div>

            {/* Sliding Images */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h4 style={{ fontWeight: 600, fontSize: '15px' }}>Hero Sliding Images</h4>
              <button type="button" onClick={handleBannerAdd} className="admin-btn admin-btn-ghost">
                + Add Image Slide
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {formData.banners.map((banner, index) => (
                <div 
                  key={banner._id} 
                  style={{ 
                    position: 'relative',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#fff'
                  }}
                >
                  <button 
                    type="button" 
                    onClick={() => handleBannerRemove(banner._id)}
                    style={{ position: 'absolute', top: '8px', right: '8px', color: '#FFF', background: 'rgba(0,0,0,0.5)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10, cursor: 'pointer', border: 'none' }}
                    title="Remove Image"
                  >
                    ×
                  </button>

                  {/* Desktop + Mobile image side by side */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                    {/* Desktop image */}
                    <div style={{ borderRight: '1px solid var(--admin-border)' }}>
                      <div style={{ width: '100%', height: '120px', position: 'relative' }}>
                        <img src={banner.image} alt="Desktop" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <span style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '10px', fontWeight: 700, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: '3px' }}>DESKTOP</span>
                      </div>
                      <div style={{ padding: '8px' }}>
                        <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer', textAlign: 'center', margin: 0, width: '100%', display: 'block', fontSize: '11px' }}>
                          Change Desktop Image
                          <input type="file" hidden accept="image/*" onChange={(e) => handleBannerImageUpload(banner._id, e)} />
                        </label>
                        <p style={{ fontSize: '10px', color: 'var(--admin-muted)', marginTop: '4px', textAlign: 'center' }}>Recommended: 1200×600px (landscape)</p>
                      </div>
                    </div>

                    {/* Mobile image */}
                    <div>
                      <div style={{ width: '100%', height: '120px', position: 'relative', background: 'var(--gray-50)' }}>
                        {banner.mobileImage ? (
                          <img src={banner.mobileImage} alt="Mobile" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--admin-muted)' }}>
                            <span style={{ fontSize: '22px' }}>📱</span>
                            <span style={{ fontSize: '11px' }}>No mobile image</span>
                          </div>
                        )}
                        <span style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '10px', fontWeight: 700, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: '3px' }}>MOBILE</span>
                      </div>
                      <div style={{ padding: '8px' }}>
                        <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer', textAlign: 'center', margin: 0, width: '100%', display: 'block', fontSize: '11px' }}>
                          {banner.mobileImage ? 'Change Mobile Image' : '+ Add Mobile Image'}
                          <input type="file" hidden accept="image/*" onChange={(e) => handleBannerMobileImageUpload(banner._id, e)} />
                        </label>
                        <p style={{ fontSize: '10px', color: 'var(--admin-muted)', marginTop: '4px', textAlign: 'center' }}>Recommended: 600×900px (portrait)</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {formData.banners.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--admin-border)', borderRadius: '8px' }}>
                  <p className="admin-muted">No banners defined. The homepage will show a default fallback.</p>
                </div>
              )}
            </div>
          </div>

          {/* ─── HOME LEGACY IMAGE ─── */}
          <div style={{ marginTop: '40px', borderTop: '1px solid var(--admin-border)', paddingTop: '32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 className="section-title-sm" style={{ marginBottom: '4px' }}>Legacy Section Image</h3>
              <p className="admin-muted">Configure the image shown in the "Our Legacy" section on the Home Page.</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Legacy Image</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {formData.legacyImage && (
                    <img src={formData.legacyImage} alt="Legacy" style={{ height: '80px', borderRadius: '4px' }} />
                  )}
                  <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer' }}>
                    Upload New Image
                    <input type="file" hidden accept="image/*" onChange={handleLegacyImageUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card mt-24">
          <div style={{ paddingTop: '8px' }}>
            <h3 className="section-title-sm mb-24">Dynamic About Us Page Content</h3>
            <p className="admin-muted mb-24">These settings directly control the text and hero images for the luxurious /about route on the storefront.</p>
            
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Hero Background Image</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {formData.aboutPage.heroImage && (
                    <img src={formData.aboutPage.heroImage} alt="Hero" style={{ height: '80px', borderRadius: '4px' }} />
                  )}
                  <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer' }}>
                    Upload New Image
                    <input type="file" hidden accept="image/*" onChange={(e) => handleAboutImageUpload(e, 'heroImage')} />
                  </label>
                </div>
              </div>
              <div className="form-group">
                 <label>Hero Title</label>
                 <input type="text" className="form-input" name="heroTitle" value={formData.aboutPage.heroTitle || ''} onChange={handleAboutChange} />
              </div>
              <div className="form-group">
                 <label>Hero Subtitle</label>
                 <input type="text" className="form-input" name="heroSubtitle" value={formData.aboutPage.heroSubtitle || ''} onChange={handleAboutChange} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                 <label>Chapter Headline</label>
                 <input type="text" className="form-input" name="chapterTitle" value={formData.aboutPage.chapterTitle || ''} onChange={handleAboutChange} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                 <label>Chapter Paragraph 1</label>
                 <textarea className="form-input" rows="3" name="chapterText1" value={formData.aboutPage.chapterText1 || ''} onChange={handleAboutChange}></textarea>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                 <label>Chapter Paragraph 2</label>
                 <textarea className="form-input" rows="3" name="chapterText2" value={formData.aboutPage.chapterText2 || ''} onChange={handleAboutChange}></textarea>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Chapter Image (Artisan/Loom)</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {formData.aboutPage.chapterImage && (
                    <img src={formData.aboutPage.chapterImage} alt="Chapter" style={{ height: '80px', borderRadius: '4px' }} />
                  )}
                  <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer' }}>
                    Upload New Image
                    <input type="file" hidden accept="image/*" onChange={(e) => handleAboutImageUpload(e, 'chapterImage')} />
                  </label>
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                 <label>Emphasized Quote</label>
                 <textarea className="form-input" rows="2" name="quoteText" value={formData.aboutPage.quoteText || ''} onChange={handleAboutChange}></textarea>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 8px' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSaving}
            style={{ minWidth: '140px' }}
          >
            {isSaving ? 'Saving...' : showSavedMsg ? 'Changes Saved!' : 'Save Changes'}
          </button>
          {showSavedMsg && (
            <span style={{ color: 'var(--crimson)', fontSize: '13px', fontWeight: 600, animation: 'fadeIn 0.3s' }}>
              ✓ Applied to storefront
            </span>
          )}
        </div>
      </form>

      <div className="admin-card mt-24">
        <h3 className="section-title-sm">Live Preview</h3>
        <p className="admin-muted mb-16">This is how your branding will appear in the header and footer.</p>
        
        <div className="settings-preview">
          <div className="settings-preview__header">
            <div className="settings-preview__logo">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Preview" style={{ height: '30px', width: 'auto' }} />
              ) : (
                <>
                   <span className="logo-main">
                     <em>{formData.logoMain[0]}</em>{formData.logoMain.slice(1)}
                   </span>
                   <span className="logo-sub">{formData.logoSub}</span>
                </>
              )}
            </div>
            <div className="settings-preview__contact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {formData.phoneNumber}
            </div>
          </div>
          <div className="settings-preview__content">
            <div className="announce-bar-mock">
              {formData.announcementText}
            </div>
            
            <div className="footer-mock mt-16">
              <div className="footer-mock__brand">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Preview" style={{ height: '24px', width: 'auto', marginBottom: '4px' }} />
                ) : (
                  <div className="logo-main" style={{ fontSize: '18px' }}>
                    <em>{formData.logoMain[0]}</em>{formData.logoMain.slice(1)}
                  </div>
                )}
                <p className="footer-mock__about">{formData.aboutText}</p>
              </div>
              <div className="footer-mock__info">
                <div className="footer-mock__item">📍 {formData.address}</div>
                <div className="footer-mock__item">✉️ {formData.email}</div>
                <div className="footer-mock__item">📞 {formData.phoneNumber}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
