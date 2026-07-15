import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function HeroManager({ hero, reloadData }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge: '',
    ctaText: '',
    circles: []
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (hero) {
      setFormData({
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        badge: hero.badge || '',
        ctaText: hero.ctaText || '',
        circles: hero.circles || []
      });
    }
  }, [hero]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCircleUpload = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('images', file);

    try {
      alert('جاري رفع الصورة إلى Cloudinary...');
      const res = await axios.post('/api/upload', uploadData);
      if (res.data.filePaths && res.data.filePaths.length > 0) {
        const newCircles = [...formData.circles];
        newCircles[idx] = res.data.filePaths[0];
        setFormData({ ...formData, circles: newCircles });
        alert('تم رفع الصورة بنجاح');
      }
    } catch (err) {
      console.error(err);
      alert('فشل الرفع');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put('/api/hero', formData);
      alert('تم حفظ القسم الرئيسي بنجاح');
      reloadData();
    } catch (err) {
      console.error(err);
      alert('فشل حفظ القسم الرئيسي');
    }
    setIsSaving(false);
  };

  const labels = ['الدائرة الصغيرة اليمنى', 'الدائرة المتوسطة اليمنى', 'الدائرة المتوسطة اليسرى', 'الدائرة الصغيرة اليسرى'];

  return (
    <div className="page-section active">
        <div className="editor-header">
            <h2>إعدادات القسم الرئيسي (Hero)</h2>
            <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                <i className="fa-solid fa-floppy-disk"></i> {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
        </div>
        <div className="editor-grid">
            <div className="editor-main">
                <div className="form-group">
                    <label className="form-label">العنوان الرئيسي</label>
                    <textarea className="form-control" name="title" value={formData.title} onChange={handleChange} rows="2"></textarea>
                </div>
                <div className="form-group">
                    <label className="form-label">الوصف الفرعي</label>
                    <textarea className="form-control" name="subtitle" value={formData.subtitle} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className="form-group">
                    <label className="form-label">الشريط الترويجي (Badge)</label>
                    <input type="text" className="form-control" name="badge" value={formData.badge} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">نص الزر (CTA)</label>
                    <input type="text" className="form-control" name="ctaText" value={formData.ctaText} onChange={handleChange} />
                </div>
                
                <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>دوائر الصور في الواجهة</h3>
                <div className="hero-circles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {[0, 1, 2, 3].map(idx => (
                        <div className="hero-circle-item" key={idx} style={{ textAlign: 'center', background: '#f8f9fa', padding: '15px', borderRadius: '10px' }}>
                            <img 
                                src={formData.circles[idx] || '/فخم.jfif'} 
                                alt={labels[idx]} 
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }} 
                            />
                            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#555' }}>{labels[idx]}</p>
                            <input type="file" accept="image/*" onChange={(e) => handleCircleUpload(idx, e)} style={{ display: 'none' }} id={`heroCircleUpload_${idx}`} />
                            <button className="btn btn-secondary btn-sm" onClick={() => document.getElementById(`heroCircleUpload_${idx}`).click()}>
                                <i className="fa-solid fa-upload"></i> رفع صورة
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
