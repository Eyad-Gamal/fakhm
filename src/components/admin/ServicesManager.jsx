import React, { useState } from 'react';
import axios from 'axios';

export default function ServicesManager({ services, reloadData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('fa-solid fa-flask');
  const [images, setImages] = useState([]);
  const [isCustom, setIsCustom] = useState(true);

  const handleOpenModal = (s = null) => {
    if (s) {
      setEditingId(s._id);
      setName(s.name);
      setDesc(s.desc || '');
      setIcon(s.icon || 'fa-solid fa-flask');
      setImages(s.images || []);
      setIsCustom(s.isCustom ?? true);
    } else {
      setEditingId(null);
      setName('');
      setDesc('');
      setIcon('fa-solid fa-flask');
      setImages([]);
      setIsCustom(true);
    }
    setIsEditing(true);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('images', f));
    
    try {
      alert('جاري رفع الصور إلى Cloudinary...');
      const res = await axios.post('/api/upload', formData);
      setImages([...images, ...res.data.filePaths]);
      alert('تم رفع الصور بنجاح');
    } catch (err) {
      console.error(err);
      alert('خطأ في الرفع');
    }
  };

  const handleRemoveImage = (idx) => setImages(images.filter((_, i) => i !== idx));

  const handleSave = async () => {
    if (!name.trim()) return alert("اسم الخدمة مطلوب");
    if (!desc.trim()) return alert("وصف الخدمة مطلوب");
    
    const serviceData = { name, desc, icon, images, isCustom };
    
    try {
      if (editingId) {
        await axios.put(`/api/services/${editingId}`, serviceData);
      } else {
        await axios.post('/api/services', { ...serviceData, order: services.length });
      }
      setIsEditing(false);
      reloadData();
    } catch (err) {
      console.error(err);
      alert("خطأ في الحفظ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await axios.delete(`/api/services/${id}`);
      reloadData();
    } catch (err) {
      console.error(err);
      alert("خطأ في الحذف");
    }
  };

  if (isEditing) {
    return (
      <div className="page-section active">
        <div className="editor-header">
            <button className="btn btn-icon btn-secondary" onClick={() => setIsEditing(false)}><i className="fa-solid fa-arrow-right"></i></button>
            <h2>{editingId ? 'تعديل الخدمة' : 'إضافة خدمة'}</h2>
            <button className="btn btn-primary" onClick={handleSave}><i className="fa-solid fa-floppy-disk"></i> حفظ الخدمة</button>
        </div>
        <div className="editor-grid">
            <div className="editor-main">
                <div className="form-group">
                    <label className="form-label">اسم الخدمة <span className="required">*</span></label>
                    <input type="text" className="form-control" value={name} onChange={e=>setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">الوصف <span className="required">*</span></label>
                    <textarea className="form-control" value={desc} onChange={e=>setDesc(e.target.value)} rows="4"></textarea>
                </div>
                <div className="form-group">
                    <label className="form-label">أيقونة FontAwesome</label>
                    <input type="text" className="form-control" value={icon} onChange={e=>setIcon(e.target.value)} placeholder="مثال: fa-solid fa-gem" />
                    <small>يمكنك العثور على الأيقونات من موقع FontAwesome</small>
                </div>
                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" checked={isCustom} onChange={e=>setIsCustom(e.target.checked)} />
                        إظهار زر "اطلب الآن" (خدمة مخصصة)
                    </label>
                </div>
            </div>
            <div className="editor-sidebar">
                <div className="form-group">
                    <label className="form-label">الصور (يتم رفعها لـ Cloudinary)</label>
                    <div className="image-uploader">
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{display: 'none'}} id="serviceImgUpload" />
                        <button className="btn btn-secondary" style={{width: '100%'}} onClick={() => document.getElementById('serviceImgUpload').click()}>
                            <i className="fa-solid fa-cloud-arrow-up"></i> رفع صور
                        </button>
                    </div>
                    <div className="images-list" style={{marginTop: '16px'}}>
                        {images.map((imgSrc, idx) => (
                            <div className="image-item" key={idx}>
                                <div className="image-preview-wrap">
                                    <img src={imgSrc} alt="" />
                                    <button className="image-remove-btn" onClick={() => handleRemoveImage(idx)}><i className="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section active">
      <div className="toolbar">
          <span className="toolbar-title">{services.length} خدمة</span>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <i className="fa-solid fa-plus"></i> إضافة خدمة
          </button>
      </div>

      {services.length === 0 ? (
        <div className="empty-state">
            <div className="empty-icon"><i className="fa-solid fa-concierge-bell"></i></div>
            <p className="empty-text">لم تقم بإضافة أي خدمات بعد</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>إضافة خدمة</button>
        </div>
      ) : (
        <div className="products-grid">
          {services.map(s => (
            <div className="item-card" key={s._id}>
                <div className="item-card-image">
                    <img src={s.images?.[0] || '/فخم.jfif'} alt={s.name} />
                </div>
                <div className="item-card-body">
                    <h3 className="item-card-name"><i className={s.icon} style={{color: 'var(--gold)'}}></i> {s.name}</h3>
                    <div className="item-card-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => handleOpenModal(s)}><i className="fa-solid fa-pen-to-square"></i> تعديل</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s._id)}><i className="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
