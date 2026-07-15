import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SettingsManager({ settings, reloadData }) {
  const [formData, setFormData] = useState({
    whatsapp: '',
    instagram: '',
    facebook: '',
    footerText: '',
    copyrightText: '',
    premiumThreshold: 700,
    logo: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        whatsapp: settings.whatsapp || '',
        instagram: settings.instagram || '',
        facebook: settings.facebook || '',
        footerText: settings.footerText || '',
        copyrightText: settings.copyrightText || '',
        premiumThreshold: settings.premiumThreshold || 700,
        logo: settings.logo || ''
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadData = new FormData();
    uploadData.append('images', file);
    
    try {
      alert('جاري رفع الشعار إلى Cloudinary...');
      const res = await axios.post('/api/upload', uploadData);
      if (res.data.filePaths && res.data.filePaths.length > 0) {
        setFormData({ ...formData, logo: res.data.filePaths[0] });
        alert('تم رفع الشعار بنجاح');
      }
    } catch (err) {
      console.error(err);
      alert('فشل رفع الشعار');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put('/api/settings', formData);
      alert('تم حفظ الإعدادات بنجاح');
      reloadData();
    } catch (err) {
      console.error(err);
      alert('فشل حفظ الإعدادات');
    }
    setIsSaving(false);
  };

  return (
    <div className="page-section active">
        <div className="editor-header">
            <h2>إعدادات الموقع</h2>
            <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                <i className="fa-solid fa-floppy-disk"></i> {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
        </div>
        <div className="editor-grid">
            <div className="editor-main">
                <div className="form-group">
                    <label className="form-label">شعار الموقع (Logo)</label>
                    {formData.logo && (
                        <div style={{ marginBottom: '10px' }}>
                            <img src={formData.logo} alt="Logo" style={{ maxHeight: '100px', borderRadius: '8px' }} />
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} id="logoUpload" />
                    <button className="btn btn-secondary" onClick={() => document.getElementById('logoUpload').click()}>
                        <i className="fa-solid fa-upload"></i> رفع شعار جديد
                    </button>
                </div>
                
                <div className="form-group">
                    <label className="form-label">رقم الواتساب</label>
                    <input type="text" className="form-control" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="مثال: 201234567890" />
                </div>
                <div className="form-group">
                    <label className="form-label">رابط انستجرام</label>
                    <input type="text" className="form-control" name="instagram" value={formData.instagram} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">رابط فيسبوك</label>
                    <input type="text" className="form-control" name="facebook" value={formData.facebook} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">نص الفوتر (أسفل الموقع)</label>
                    <textarea className="form-control" name="footerText" value={formData.footerText} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className="form-group">
                    <label className="form-label">حقوق النشر</label>
                    <input type="text" className="form-control" name="copyrightText" value={formData.copyrightText} onChange={handleChange} />
                </div>
            </div>
        </div>
    </div>
  );
}
